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
const subComprasEsteEl = document.getElementById('sub-compras-este');
const subCargosEsteEl = document.getElementById('sub-cargos-este');
const subComprasProximoEl = document.getElementById('sub-compras-proximo');
const subCargosProximoEl = document.getElementById('sub-cargos-proximo');

const btnClearData = document.getElementById('btn-clear-data');

// Form Elements
const formAddCredit = document.getElementById('form-add-credit');
const creditName = document.getElementById('credit-name');
const creditBank = document.getElementById('credit-bank');
const creditAmount = document.getElementById('credit-amount');
const creditQuotes = document.getElementById('credit-quotes');
const btnSaveCredit = document.getElementById('btn-save-credit');
const creditModal = document.getElementById('credit-modal');

// Filters & Tabs
const tabBtns = document.querySelectorAll('.tab-btn');
const filterBtns = document.querySelectorAll('.filter-btn');

let currentTab = 'mes-actual';
let currentGlobalFilter = 'all';
let currentUser = null;

let allDebts = [];
let allCredits = [];

const formatter = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
});

// Auth State Listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        userEmailEl.textContent = user.email;
        authLoading.classList.add('hide');
        appContent.classList.remove('hide');
        
        fetchData();
    } else {
        window.location.href = "../../intranet.html";
    }
});

// -------------------------------------------------------------
// UI NAVIGATION LOGIC (TABS & FILTERS)
// -------------------------------------------------------------
tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        tabBtns.forEach(b => {
            b.classList.remove('bg-blue-600', 'text-white');
            b.classList.add('bg-transparent', 'text-slate-400');
        });
        const target = e.target;
        target.classList.remove('bg-transparent', 'text-slate-400');
        target.classList.add('bg-blue-600', 'text-white');
        
        currentTab = target.getAttribute('data-tab');
        renderTables();
    });
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => {
            b.classList.remove('bg-blue-600', 'text-white', 'border-blue-500');
            b.classList.add('bg-slate-800', 'text-slate-400', 'border-slate-700');
        });
        const target = e.target;
        target.classList.remove('bg-slate-800', 'text-slate-400', 'border-slate-700');
        target.classList.add('bg-blue-600', 'text-white', 'border-blue-500');
        
        currentGlobalFilter = target.getAttribute('data-filter');
        calculateTotalsAndRender();
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

        let purchaseDateStr = dateKey ? (row[dateKey] || '') : '';
        
        // Categorization logic
        let category = 'Compra';
        const dLower = desc.toLowerCase();
        if (/interés|interes|interest/.test(dLower)) {
            category = 'Interés';
        } else if (/comisión|comision|mantención|mantencion|administración|administracion|seguro|avance/.test(dLower)) {
            category = 'Comisión';
        } else if (/impuesto|timbre|estampilla/.test(dLower)) {
            category = 'Impuesto';
        }
        
        try {
            await addDoc(collection(db, "finance_debts"), {
                userId: currentUser.uid,
                bank: bankType,
                description: desc,
                category: category,
                amount: absAmount,
                currentQuote: cuotaActual,
                totalQuotes: cuotaTotal,
                billingDay: billingDay,
                purchaseDateStr: purchaseDateStr,
                dateAdded: new Date().toISOString()
            });
            addedCount++;
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
    
    if (addedCount > 0) {
        alert(`Se importaron ${addedCount} movimientos con el perfil ${bankType}.`);
        fetchData();
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
            bank: creditBank.value,
            name: creditName.value,
            amount: parseFloat(creditAmount.value),
            quotesRemaining: parseInt(creditQuotes.value),
            dateAdded: new Date().toISOString()
        });
        
        formAddCredit.reset();
        creditModal.classList.add('hide');
        fetchData();
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
            fetchData();
        } catch (e) {
            console.error("Error deleting credit:", e);
        }
    }
};

// -------------------------------------------------------------
// FETCH & CALCULATE DATA
// -------------------------------------------------------------
async function fetchData() {
    if (!currentUser) return;
    
    allDebts = [];
    allCredits = [];
    
    try {
        const qDebts = query(collection(db, "finance_debts"), where("userId", "==", currentUser.uid));
        const snapDebts = await getDocs(qDebts);
        snapDebts.forEach((docSnap) => {
            const data = docSnap.data();
            data.quotesLeft = data.totalQuotes - data.currentQuote + 1;
            
            // Facturado vs No Facturado Logic
            let isFacturado = true; 
            if (data.purchaseDateStr && data.billingDay) {
                const nums = data.purchaseDateStr.match(/\d+/g);
                if (nums && nums.length >= 2) {
                    let day = parseInt(nums[0]);
                    if (day > 31) day = parseInt(nums[1]); 
                    if (day && day > data.billingDay) {
                        isFacturado = false;
                    }
                }
            }
            data.isFacturado = isFacturado;
            allDebts.push({ id: docSnap.id, ...data });
        });
    } catch (e) {
        console.error("Error fetching debts", e);
    }

    try {
        const qCredits = query(collection(db, "finance_credits"), where("userId", "==", currentUser.uid));
        const snapCredits = await getDocs(qCredits);
        snapCredits.forEach((docSnap) => {
            allCredits.push({ id: docSnap.id, ...docSnap.data() });
        });
    } catch (e) {
        console.error("Error fetching credits", e);
    }
    
    calculateTotalsAndRender();
}

function calculateTotalsAndRender() {
    let totalEsteMes = 0;
    let subComprasEste = 0;
    let subCargosEste = 0;
    
    let totalProximoMes = 0;
    let subComprasProximo = 0;
    let subCargosProximo = 0;
    
    // Filter by Bank if needed
    const filteredDebts = allDebts.filter(d => currentGlobalFilter === 'all' || d.bank === currentGlobalFilter);
    const filteredCredits = allCredits.filter(c => currentGlobalFilter === 'all' || c.bank === currentGlobalFilter);

    // Calc Debts
    filteredDebts.forEach(debt => {
        if (debt.quotesLeft > 0) {
            const isCargo = (debt.category === 'Interés' || debt.category === 'Comisión' || debt.category === 'Impuesto');
            if (debt.isFacturado) {
                totalEsteMes += debt.amount;
                if (isCargo) subCargosEste += debt.amount;
                else subComprasEste += debt.amount;
            } else {
                totalProximoMes += debt.amount;
                if (isCargo) subCargosProximo += debt.amount;
                else subComprasProximo += debt.amount;
            }
        }
    });
    
    // Calc Credits (Assume they hit Este Mes and are always "Compras/Crédito" not fees)
    filteredCredits.forEach(credit => {
        totalEsteMes += credit.amount;
        subComprasEste += credit.amount;
    });

    // Update UI Totals
    totalEsteMesEl.textContent = formatter.format(totalEsteMes);
    subComprasEsteEl.textContent = formatter.format(subComprasEste);
    subCargosEsteEl.textContent = formatter.format(subCargosEste);
    
    totalProximoMesEl.textContent = formatter.format(totalProximoMes);
    subComprasProximoEl.textContent = formatter.format(subComprasProximo);
    subCargosProximoEl.textContent = formatter.format(subCargosProximo);
    
    renderTables();
}

function getCategoryBadge(category) {
    if (!category) return '';
    if (category === 'Interés') return `<span class="px-2 py-0.5 rounded text-[10px] bg-red-900/50 text-red-400 font-bold uppercase tracking-wider ml-2 border border-red-800/50">Interés</span>`;
    if (category === 'Comisión') return `<span class="px-2 py-0.5 rounded text-[10px] bg-orange-900/50 text-orange-400 font-bold uppercase tracking-wider ml-2 border border-orange-800/50">Comisión</span>`;
    if (category === 'Impuesto') return `<span class="px-2 py-0.5 rounded text-[10px] bg-yellow-900/50 text-yellow-400 font-bold uppercase tracking-wider ml-2 border border-yellow-800/50">Impuesto</span>`;
    return `<span class="px-2 py-0.5 rounded text-[10px] bg-blue-900/50 text-blue-400 uppercase tracking-wider ml-2 border border-blue-800/50">Compra</span>`;
}

function getBankBadge(bank) {
    if (!bank || bank === 'auto' || bank === 'all') return '';
    const b = bank.replace('_', ' ');
    return `<span class="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 uppercase tracking-wider ml-2">${b}</span>`;
}

function renderTables() {
    // Filter Debts
    const finalDebts = allDebts.filter(d => currentGlobalFilter === 'all' || d.bank === currentGlobalFilter).filter(d => {
        if (currentTab === 'historial') return d.quotesLeft <= 0;
        if (currentTab === 'mes-actual') return d.quotesLeft > 0 && d.isFacturado;
        if (currentTab === 'mes-proximo') return d.quotesLeft > 0 && !d.isFacturado;
        return false;
    });
    
    let htmlDebts = '';
    if (finalDebts.length === 0) {
        let msg = currentTab === 'historial' ? 'No hay historial de cuotas pagadas.' : 'No hay cuotas en esta categoría.';
        htmlDebts = `<tr><td colspan="4" class="px-6 py-8 text-center text-slate-500 italic">${msg}</td></tr>`;
    } else {
        finalDebts.forEach(data => {
            const totalRemaining = data.quotesLeft > 0 ? data.quotesLeft * data.amount : 0;
            htmlDebts += `
                <tr class="hover:bg-white/5 transition-colors border-l-2 ${data.category === 'Interés' || data.category === 'Comisión' ? 'border-red-500/50' : 'border-transparent'}">
                    <td class="px-6 py-4">
                        <div class="font-medium text-white flex items-center">${data.description} ${getCategoryBadge(data.category)}</div>
                        <div class="text-[10px] text-slate-500 mt-1 uppercase flex items-center">
                            Tarjeta de Crédito ${getBankBadge(data.bank)} ${data.purchaseDateStr ? ' | Fecha: '+data.purchaseDateStr : ''}
                        </div>
                    </td>
                    <td class="px-6 py-4 text-center">
                        <span class="${data.currentQuote === data.totalQuotes ? 'bg-red-900/50 text-red-400' : 'bg-slate-700 text-slate-300'} px-2 py-1 rounded text-xs font-mono">
                            ${data.currentQuote} / ${data.totalQuotes}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-right text-white font-mono">${formatter.format(data.amount)}</td>
                    <td class="px-6 py-4 text-right text-slate-400 font-mono">${formatter.format(totalRemaining)}</td>
                </tr>
            `;
        });
    }
    debtsTableBody.innerHTML = htmlDebts;
    
    // Filter Credits
    const finalCredits = allCredits.filter(c => currentGlobalFilter === 'all' || c.bank === currentGlobalFilter);
    let htmlCredits = '';
    if (finalCredits.length === 0) {
        htmlCredits = `<tr><td colspan="4" class="px-6 py-8 text-center text-slate-500 italic">No hay créditos activos registrados para esta vista.</td></tr>`;
    } else {
        finalCredits.forEach(data => {
            htmlCredits += `
                <tr class="hover:bg-white/5 transition-colors border-l-2 border-emerald-500/50">
                    <td class="px-6 py-4">
                        <div class="font-medium text-white flex items-center">${data.name}</div>
                        <div class="text-[10px] text-slate-500 mt-1 uppercase flex items-center">
                            Crédito Fijo ${getBankBadge(data.bank)}
                        </div>
                    </td>
                    <td class="px-6 py-4 text-center">
                        <span class="bg-emerald-900/50 text-emerald-400 px-2 py-1 rounded text-xs font-bold">
                            ${data.quotesRemaining >= 999 ? 'Indefinido' : data.quotesRemaining}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-right text-white font-mono">${formatter.format(data.amount)}</td>
                    <td class="px-6 py-4 text-right">
                        <button onclick="deleteCredit('${data.id}')" class="text-red-400 hover:text-red-300 transition-colors p-2"><i class="fa-solid fa-trash-can"></i></button>
                    </td>
                </tr>
            `;
        });
    }
    creditsTableBody.innerHTML = htmlCredits;
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
            fetchData();
        } catch (e) {
            console.error("Error deleting debts:", e);
            alert("Hubo un error al borrar los datos.");
        }
    }
});
