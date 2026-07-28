import { auth, db } from '../../../firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// DOM Elements
const authLoading = document.getElementById('auth-loading');
const appContent = document.getElementById('app-content');
const userEmailEl = document.getElementById('user-email');
const csvUpload = document.getElementById('csv-upload');
const bankSelector = document.getElementById('bank-selector');
const formatHelp = document.getElementById('format-help');
const debtsTableBody = document.getElementById('debts-table-body');
const creditsTableBody = document.getElementById('credits-table-body');
const totalProximoMesEl = document.getElementById('total-proximo-mes');
const btnClearData = document.getElementById('btn-clear-data');

// Form Elements
const formAddCredit = document.getElementById('form-add-credit');
const creditName = document.getElementById('credit-name');
const creditAmount = document.getElementById('credit-amount');
const creditQuotes = document.getElementById('credit-quotes');
const btnSaveCredit = document.getElementById('btn-save-credit');
const creditModal = document.getElementById('credit-modal');

let currentUser = null;

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
// CSV PROCESSING (Multi-Bank)
// -------------------------------------------------------------
csvUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async function(results) {
            console.log("CSV parsed:", results.data);
            await processCartola(results.data, bankSelector.value);
            csvUpload.value = '';
        },
        error: function(error) {
            console.error("Error parsing CSV:", error);
            formatHelp.classList.remove('hide');
        }
    });
});

async function processCartola(data, bankType) {
    if (!currentUser) return;
    formatHelp.classList.add('hide');
    
    if (data.length === 0) return;
    
    const keys = Object.keys(data[0]);
    let descKey, amountKey, cuotaKey;
    
    // Perfiles Bancarios Básicos
    if (bankType === 'banco_estado') {
        descKey = keys.find(k => k.toLowerCase().includes('descrip'));
        amountKey = keys.find(k => k.toLowerCase().includes('monto'));
        cuotaKey = keys.find(k => k.toLowerCase().includes('cuota'));
    } else if (bankType === 'banco_chile') {
        descKey = keys.find(k => k.toLowerCase().includes('detalle') || k.toLowerCase().includes('descrip'));
        amountKey = keys.find(k => k.toLowerCase().includes('cargo') || k.toLowerCase().includes('monto'));
        cuotaKey = keys.find(k => k.toLowerCase().includes('cuota'));
    } else if (bankType === 'falabella') {
        descKey = keys.find(k => k.toLowerCase().includes('comercio') || k.toLowerCase().includes('descrip'));
        amountKey = keys.find(k => k.toLowerCase().includes('monto'));
        cuotaKey = keys.find(k => k.toLowerCase().includes('cuota'));
    } else if (bankType === 'tenpo') {
        descKey = keys.find(k => k.toLowerCase().includes('movimiento') || k.toLowerCase().includes('descrip'));
        amountKey = keys.find(k => k.toLowerCase().includes('monto'));
        cuotaKey = null; // Tenpo prepago, rara vez tiene cuotas
    }
    
    // Fallback heurístico (Auto-Detectar)
    if (!descKey) descKey = keys.find(k => /descrip|detalle|comercio|movimiento/i.test(k));
    if (!amountKey) amountKey = keys.find(k => /monto|valor|cargo/i.test(k));
    if (!cuotaKey) cuotaKey = keys.find(k => /cuota/i.test(k));
    
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
        
        try {
            await addDoc(collection(db, "finance_debts"), {
                userId: currentUser.uid,
                bank: bankType,
                description: desc,
                amount: absAmount,
                currentQuote: cuotaActual,
                totalQuotes: cuotaTotal,
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

// Delete specific credit
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
    
    let totalProximoMes = 0;
    
    // 1. Cargar Deudas de Tarjeta
    try {
        const qDebts = query(collection(db, "finance_debts"), where("userId", "==", currentUser.uid));
        const snapDebts = await getDocs(qDebts);
        
        let htmlDebts = '';
        
        if (snapDebts.empty) {
            debtsTableBody.innerHTML = '<tr><td colspan="4" class="px-6 py-8 text-center text-slate-500 italic">No hay deudas registradas. Sube tu cartola CSV.</td></tr>';
        } else {
            snapDebts.forEach((doc) => {
                const data = doc.data();
                const quotesLeft = data.totalQuotes - data.currentQuote + 1;
                const totalRemaining = quotesLeft > 0 ? quotesLeft * data.amount : 0;
                
                if (quotesLeft > 0) {
                    totalProximoMes += data.amount;
                    htmlDebts += `
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="px-6 py-4 font-medium text-white">${data.description} ${data.bank && data.bank!=='auto' ? '<span class="text-[10px] text-blue-400 ml-2 uppercase">'+data.bank+'</span>' : ''}</td>
                            <td class="px-6 py-4 text-center">
                                <span class="${data.currentQuote === data.totalQuotes ? 'bg-red-900/50 text-red-400' : 'bg-slate-700 text-slate-300'} px-2 py-1 rounded text-xs">
                                    ${data.currentQuote} / ${data.totalQuotes}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-right text-white font-mono">${formatter.format(data.amount)}</td>
                            <td class="px-6 py-4 text-right text-slate-400 font-mono">${formatter.format(totalRemaining)}</td>
                        </tr>
                    `;
                }
            });
            debtsTableBody.innerHTML = htmlDebts || '<tr><td colspan="4" class="px-6 py-4 text-center text-slate-500 italic">No hay cuotas pendientes para el próximo mes.</td></tr>';
        }
    } catch (e) {
        debtsTableBody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-red-400">Error al cargar cartolas.</td></tr>';
    }
    
    // 2. Cargar Créditos Fijos
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
                
                totalProximoMes += data.amount;
                
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
    
    // Render Total
    totalProximoMesEl.textContent = formatter.format(totalProximoMes);
}

// -------------------------------------------------------------
// CLEAR ALL DEBTS
// -------------------------------------------------------------
btnClearData.addEventListener('click', async () => {
    if (!currentUser) return;
    
    if (confirm('¿Estás seguro de que deseas borrar TODAS las cartolas procesadas? (Los créditos fijos NO se borrarán).')) {
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
