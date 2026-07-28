import { auth, db } from '../../../firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// DOM Elements
const authLoading = document.getElementById('auth-loading');
const appContent = document.getElementById('app-content');
const userEmailEl = document.getElementById('user-email');
const csvUpload = document.getElementById('csv-upload');
const bankSelector = document.getElementById('bank-selector');
const billingDayInput = document.getElementById('billing-day');
const formatHelp = document.getElementById('format-help');
const debtsTableBody = document.getElementById('debts-table-body');
const creditsTableBody = document.getElementById('credits-table-body');
const totalEsteMesEl = document.getElementById('total-este-mes');
const totalProximoMesEl = document.getElementById('total-proximo-mes');
const btnClearData = document.getElementById('btn-clear-data');

// Form Elements
const formAddCredit = document.getElementById('form-add-credit');
const creditName = document.getElementById('credit-name');
const creditAmount = document.getElementById('credit-amount');
const creditQuotes = document.getElementById('credit-quotes');
const btnSaveCredit = document.getElementById('btn-save-credit');
const creditModal = document.getElementById('credit-modal');

// Tabs
const tabBtns = document.querySelectorAll('.tab-btn');
let currentTab = 'mes-actual';

let currentUser = null;
let allDebts = []; // Store debts in memory for tab filtering

// Auth State Listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        userEmailEl.textContent = user.email;
        authLoading.classList.add('hide');
        appContent.classList.remove('hide');
        
        loadData();
    } else {
        window.location.href = "../../intranet.html";
    }
});

// -------------------------------------------------------------
// TABS LOGIC
// -------------------------------------------------------------
tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Reset all tabs UI
        tabBtns.forEach(b => {
            b.classList.remove('bg-blue-600', 'text-white');
            b.classList.add('bg-transparent', 'text-slate-400');
        });
        
        // Active tab UI
        const target = e.target;
        target.classList.remove('bg-transparent', 'text-slate-400');
        target.classList.add('bg-blue-600', 'text-white');
        
        currentTab = target.getAttribute('data-tab');
        renderDebtsTable();
    });
});

// -------------------------------------------------------------
// CSV PROCESSING
// -------------------------------------------------------------
csvUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async function(results) {
            await processCartola(results.data, bankSelector.value, parseInt(billingDayInput.value));
            csvUpload.value = '';
        },
        error: function(error) {
            console.error("Error parsing CSV:", error);
            formatHelp.classList.remove('hide');
        }
    });
});

async function processCartola(data, bankType, billingDay) {
    if (!currentUser) return;
    formatHelp.classList.add('hide');
    
    if (data.length === 0) return;
    
    const keys = Object.keys(data[0]);
    let descKey, amountKey, cuotaKey, dateKey;
    
    // Perfiles Bancarios Básicos
    if (bankType === 'banco_estado') {
        descKey = keys.find(k => k.toLowerCase().includes('descrip'));
        amountKey = keys.find(k => k.toLowerCase().includes('monto'));
        cuotaKey = keys.find(k => k.toLowerCase().includes('cuota'));
        dateKey = keys.find(k => k.toLowerCase().includes('fecha'));
    } else if (bankType === 'banco_chile') {
        descKey = keys.find(k => k.toLowerCase().includes('detalle') || k.toLowerCase().includes('descrip'));
        amountKey = keys.find(k => k.toLowerCase().includes('cargo') || k.toLowerCase().includes('monto'));
        cuotaKey = keys.find(k => k.toLowerCase().includes('cuota'));
        dateKey = keys.find(k => k.toLowerCase().includes('fecha'));
    } else if (bankType === 'falabella') {
        descKey = keys.find(k => k.toLowerCase().includes('comercio') || k.toLowerCase().includes('descrip'));
        amountKey = keys.find(k => k.toLowerCase().includes('monto'));
        cuotaKey = keys.find(k => k.toLowerCase().includes('cuota'));
        dateKey = keys.find(k => k.toLowerCase().includes('fecha'));
    } else if (bankType === 'tenpo') {
        descKey = keys.find(k => k.toLowerCase().includes('movimiento') || k.toLowerCase().includes('descrip'));
        amountKey = keys.find(k => k.toLowerCase().includes('monto'));
        cuotaKey = null; 
        dateKey = keys.find(k => k.toLowerCase().includes('fecha'));
    }
    
    // Fallback heurístico
    if (!descKey) descKey = keys.find(k => /descrip|detalle|comercio|movimiento/i.test(k));
    if (!amountKey) amountKey = keys.find(k => /monto|valor|cargo/i.test(k));
    if (!cuotaKey) cuotaKey = keys.find(k => /cuota/i.test(k));
    if (!dateKey) dateKey = keys.find(k => /fecha|date/i.test(k));
    
    if (!descKey || !amountKey) {
        formatHelp.classList.remove('hide');
        return;
    }
    
    let addedCount = 0;
    
    for (const row of data) {
        const desc = row[descKey] || 'Compra Desconocida';
        let amountStr = String(row[amountKey] || '0').replace(/[^0-9.-]+/g, '');
        const amount = parseFloat(amountStr) || 0;
        
        const absAmount = Math.abs(amount);
        if (absAmount === 0) continue;
        
        let cuotaStr = cuotaKey ? (row[cuotaKey] || '') : '';
        let cuotaActual = 1;
        let cuotaTotal = 1;
        
        if (cuotaStr) {
            const cuotaMatch = String(cuotaStr).match(/(\d+)[^\d]+(\d+)/);
            if (cuotaMatch) {
                cuotaActual = parseInt(cuotaMatch[1]);
                cuotaTotal = parseInt(cuotaMatch[2]);
            }
        }

        // Determinar Fecha de la compra
        let purchaseDateStr = dateKey ? (row[dateKey] || '') : '';
        
        try {
            await addDoc(collection(db, "finance_debts"), {
                userId: currentUser.uid,
                bank: bankType,
                description: desc,
                amount: absAmount,
                currentQuote: cuotaActual,
                totalQuotes: cuotaTotal,
                billingDay: billingDay,
                purchaseDateStr: purchaseDateStr, // we keep the string to avoid complex parsing errors here
                dateAdded: new Date().toISOString()
            });
            addedCount++;
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
    
    if (addedCount > 0) {
        alert(`Se importaron ${addedCount} movimientos con el perfil ${bankType}.`);
        loadData();
    } else {
        alert("No se encontraron movimientos válidos.");
    }
}


// -------------------------------------------------------------
// CREDITS CRUD
// -------------------------------------------------------------
formAddCredit.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    
    btnSaveCredit.disabled = true;
    btnSaveCredit.textContent = 'Guardando...';
    
    try {
        await addDoc(collection(db, "finance_credits"), {
            userId: currentUser.uid,
            name: creditName.value,
            amount: parseFloat(creditAmount.value),
            quotesRemaining: parseInt(creditQuotes.value),
            dateAdded: new Date().toISOString()
        });
        
        formAddCredit.reset();
        creditModal.classList.add('hide');
        loadData();
    } catch (e) {
        console.error("Error adding credit:", e);
        alert("Hubo un error al guardar el crédito.");
    } finally {
        btnSaveCredit.disabled = false;
        btnSaveCredit.textContent = 'Guardar Crédito';
    }
});

window.deleteCredit = async (id) => {
    if (confirm('¿Deseas eliminar este crédito activo?')) {
        try {
            await deleteDoc(doc(db, "finance_credits", id));
            loadData();
        } catch (e) {
            console.error("Error deleting credit:", e);
        }
    }
};

// -------------------------------------------------------------
// LOAD DATA & CALCULATE TOTAL
// -------------------------------------------------------------
const formatter = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
});

async function loadData() {
    if (!currentUser) return;
    
    debtsTableBody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-slate-400">Cargando cartolas...</td></tr>';
    creditsTableBody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-slate-400">Cargando créditos...</td></tr>';
    
    // 1. Load Debts
    allDebts = [];
    try {
        const qDebts = query(collection(db, "finance_debts"), where("userId", "==", currentUser.uid));
        const snapDebts = await getDocs(qDebts);
        
        snapDebts.forEach((docSnap) => {
            allDebts.push({ id: docSnap.id, ...docSnap.data() });
        });
        
    } catch (e) {
        console.error(e);
        debtsTableBody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-red-400">Error al cargar cartolas.</td></tr>';
    }

    // Process and Calculate Totals based on Billed vs Unbilled
    let totalEsteMes = 0;
    let totalProximoMes = 0;

    const today = new Date();
    const currentDay = today.getDate();
    
    allDebts.forEach(debt => {
        debt.quotesLeft = debt.totalQuotes - debt.currentQuote + 1;
        
        // Very basic logic for Facturado vs No Facturado
        // If purchase was made in the last 30 days and day > billingDay, it's next month
        let isFacturado = true; 
        
        if (debt.purchaseDateStr && debt.billingDay) {
            // attempt basic extraction of day from string (e.g. "26-05-2023" or "2023/05/26")
            const nums = debt.purchaseDateStr.match(/\d+/g);
            if (nums && nums.length >= 2) {
                // assume one of the first two numbers is the day, usually <= 31
                let day = parseInt(nums[0]);
                if (day > 31) day = parseInt(nums[1]); // maybe yyyy-mm-dd
                
                if (day && day > debt.billingDay) {
                    isFacturado = false; // it crossed the billing cycle, billed next month
                }
            }
        }
        
        debt.isFacturado = isFacturado;
        
        if (debt.quotesLeft > 0) {
            if (isFacturado) {
                totalEsteMes += debt.amount;
            } else {
                totalProximoMes += debt.amount;
            }
        }
    });

    renderDebtsTable();

    // 2. Load Fixed Credits
    try {
        const qCredits = query(collection(db, "finance_credits"), where("userId", "==", currentUser.uid));
        const snapCredits = await getDocs(qCredits);
        
        let htmlCredits = '';
        
        if (snapCredits.empty) {
            creditsTableBody.innerHTML = '<tr><td colspan="4" class="px-6 py-8 text-center text-slate-500 italic">No hay créditos activos registrados.</td></tr>';
        } else {
            snapCredits.forEach((docSnap) => {
                const data = docSnap.data();
                const id = docSnap.id;
                
                // Fixed credits usually hit every month, so we add to both just to show the weight, or maybe just Este Mes.
                // We'll add them to Este Mes for now.
                totalEsteMes += data.amount;
                
                htmlCredits += `
                    <tr class="hover:bg-white/5 transition-colors">
                        <td class="px-6 py-4 font-medium text-white">${data.name}</td>
                        <td class="px-6 py-4 text-center">
                            <span class="bg-emerald-900/50 text-emerald-400 px-2 py-1 rounded text-xs font-bold">
                                ${data.quotesRemaining >= 999 ? 'Indefinido' : data.quotesRemaining}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-right text-white font-mono">${formatter.format(data.amount)}</td>
                        <td class="px-6 py-4 text-right">
                            <button onclick="deleteCredit('${id}')" class="text-red-400 hover:text-red-300 transition-colors p-2"><i class="fa-solid fa-trash-can"></i></button>
                        </td>
                    </tr>
                `;
            });
            creditsTableBody.innerHTML = htmlCredits;
        }
    } catch (e) {
        creditsTableBody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-red-400">Error al cargar créditos.</td></tr>';
    }
    
    // Render Totals
    totalEsteMesEl.textContent = formatter.format(totalEsteMes);
    totalProximoMesEl.textContent = formatter.format(totalProximoMes);
}

function renderDebtsTable() {
    let htmlDebts = '';
    
    let filteredDebts = allDebts.filter(d => {
        if (currentTab === 'historial') return d.quotesLeft <= 0;
        if (currentTab === 'mes-actual') return d.quotesLeft > 0 && d.isFacturado;
        if (currentTab === 'mes-proximo') return d.quotesLeft > 0 && !d.isFacturado;
        return false;
    });
    
    if (filteredDebts.length === 0) {
        let msg = currentTab === 'historial' ? 'No hay historial de cuotas pagadas.' : 'No hay cuotas en esta categoría.';
        debtsTableBody.innerHTML = `<tr><td colspan="4" class="px-6 py-8 text-center text-slate-500 italic">${msg}</td></tr>`;
        return;
    }
    
    filteredDebts.forEach(data => {
        const totalRemaining = data.quotesLeft > 0 ? data.quotesLeft * data.amount : 0;
        htmlDebts += `
            <tr class="hover:bg-white/5 transition-colors">
                <td class="px-6 py-4">
                    <div class="font-medium text-white">${data.description}</div>
                    <div class="text-[10px] text-slate-500 mt-1 uppercase">${data.bank || 'Auto'} ${data.purchaseDateStr ? '| Fecha: '+data.purchaseDateStr : ''}</div>
                </td>
                <td class="px-6 py-4 text-center">
                    <span class="${data.currentQuote === data.totalQuotes ? 'bg-red-900/50 text-red-400' : 'bg-slate-700 text-slate-300'} px-2 py-1 rounded text-xs">
                        ${data.currentQuote} / ${data.totalQuotes}
                    </span>
                </td>
                <td class="px-6 py-4 text-right text-white font-mono">${formatter.format(data.amount)}</td>
                <td class="px-6 py-4 text-right text-slate-400 font-mono">${formatter.format(totalRemaining)}</td>
            </tr>
        `;
    });
    
    debtsTableBody.innerHTML = htmlDebts;
}


// -------------------------------------------------------------
// CLEAR ALL DEBTS
// -------------------------------------------------------------
btnClearData.addEventListener('click', async () => {
    if (!currentUser) return;
    
    if (confirm('¿Estás seguro de que deseas borrar TODAS las cartolas procesadas?')) {
        try {
            const q = query(collection(db, "finance_debts"), where("userId", "==", currentUser.uid));
            const querySnapshot = await getDocs(q);
            
            const deletePromises = [];
            querySnapshot.forEach((document) => {
                deletePromises.push(deleteDoc(doc(db, "finance_debts", document.id)));
            });
            
            await Promise.all(deletePromises);
            loadData();
        } catch (e) {
            console.error("Error deleting debts:", e);
            alert("Hubo un error al borrar los datos.");
        }
    }
});
