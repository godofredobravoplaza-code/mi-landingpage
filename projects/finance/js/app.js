import { auth, db } from '../../firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// DOM Elements
const authLoading = document.getElementById('auth-loading');
const appContent = document.getElementById('app-content');
const userEmailEl = document.getElementById('user-email');
const csvUpload = document.getElementById('csv-upload');
const formatHelp = document.getElementById('format-help');
const debtsTableBody = document.getElementById('debts-table-body');
const totalProximoMesEl = document.getElementById('total-proximo-mes');
const btnClearData = document.getElementById('btn-clear-data');

let currentUser = null;

// Auth State Listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is logged in
        currentUser = user;
        userEmailEl.textContent = user.email;
        authLoading.classList.add('hide');
        appContent.classList.remove('hide');
        
        // Load data for this user
        loadDebts();
    } else {
        // Not logged in, redirect to intranet
        window.location.href = "../../intranet.html";
    }
});

// CSV Upload & Parsing
csvUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Use PapaParse to read CSV
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async function(results) {
            console.log("CSV parsed:", results.data);
            await processCartola(results.data);
            // Reset input
            csvUpload.value = '';
        },
        error: function(error) {
            console.error("Error parsing CSV:", error);
            formatHelp.classList.remove('hide');
        }
    });
});

// Process Cartola Data
async function processCartola(data) {
    if (!currentUser) return;
    formatHelp.classList.add('hide');
    
    // We assume the bank CSV has some columns like "Descripción", "Monto", "Cuotas"
    // Since every bank is different, we will try to look for common keywords in headers
    
    // Find column keys
    let descKey = null, amountKey = null, cuotaKey = null;
    
    if (data.length > 0) {
        const keys = Object.keys(data[0]);
        descKey = keys.find(k => k.toLowerCase().includes('descrip') || k.toLowerCase().includes('detalle') || k.toLowerCase().includes('comercio') || k.toLowerCase().includes('movimiento'));
        amountKey = keys.find(k => k.toLowerCase().includes('monto') || k.toLowerCase().includes('valor') || k.toLowerCase().includes('cargo'));
        cuotaKey = keys.find(k => k.toLowerCase().includes('cuota'));
        
        if (!descKey || !amountKey) {
            formatHelp.classList.remove('hide');
            return;
        }
    }
    
    let addedCount = 0;
    
    for (const row of data) {
        const desc = row[descKey] || 'Compra Desconocida';
        let amountStr = String(row[amountKey] || '0').replace(/[^0-9.-]+/g, '');
        const amount = parseFloat(amountStr) || 0;
        
        // Only process positive amounts (charges, ignoring payments to the card which might be negative)
        // Note: Some banks put charges as negative. We just take Math.abs for the quote value.
        const absAmount = Math.abs(amount);
        if (absAmount === 0) continue;
        
        let cuotaStr = cuotaKey ? (row[cuotaKey] || '') : '';
        let cuotaActual = 1;
        let cuotaTotal = 1;
        
        // Parse "03/12" or "3 de 12"
        if (cuotaStr) {
            const cuotaMatch = String(cuotaStr).match(/(\d+)[^\d]+(\d+)/);
            if (cuotaMatch) {
                cuotaActual = parseInt(cuotaMatch[1]);
                cuotaTotal = parseInt(cuotaMatch[2]);
            }
        }
        
        // Save to Firestore
        try {
            await addDoc(collection(db, "finance_debts"), {
                userId: currentUser.uid,
                description: desc,
                amount: absAmount, // the value of ONE quote/installment
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
        alert(`Se han procesado e importado ${addedCount} movimientos con éxito.`);
        loadDebts();
    } else {
        alert("No se encontraron movimientos válidos para importar.");
    }
}

// Load Debts from Firestore
async function loadDebts() {
    if (!currentUser) return;
    
    debtsTableBody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-slate-400">Cargando datos...</td></tr>';
    
    try {
        const q = query(collection(db, "finance_debts"), where("userId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        let totalProximoMes = 0;
        let html = '';
        
        if (querySnapshot.empty) {
            debtsTableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="px-6 py-8 text-center text-slate-500 italic">
                        <i class="fa-solid fa-ghost text-2xl mb-2 block opacity-50"></i>
                        No hay deudas registradas.<br>
                        Sube tu cartola CSV para analizarla.
                    </td>
                </tr>
            `;
            totalProximoMesEl.textContent = '$0';
            return;
        }
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            // Calculate remaining
            const quotesLeft = data.totalQuotes - data.currentQuote + 1; // including current one
            const totalRemaining = quotesLeft > 0 ? quotesLeft * data.amount : 0;
            
            // If it's a valid debt for next month
            if (quotesLeft > 0) {
                totalProximoMes += data.amount;
                
                // Format money
                const formatter = new Intl.NumberFormat('es-CL', {
                    style: 'currency',
                    currency: 'CLP',
                    minimumFractionDigits: 0
                });
                
                html += `
                    <tr class="hover:bg-white/5 transition-colors">
                        <td class="px-6 py-4 font-medium text-white">${data.description}</td>
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
        
        debtsTableBody.innerHTML = html;
        
        const formatterTotal = new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        });
        totalProximoMesEl.textContent = formatterTotal.format(totalProximoMes);
        
    } catch (e) {
        console.error("Error loading debts:", e);
        debtsTableBody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-red-400">Error al cargar los datos. Revisa la consola.</td></tr>';
    }
}

// Clear Data
btnClearData.addEventListener('click', async () => {
    if (!currentUser) return;
    
    if (confirm('¿Estás seguro de que deseas borrar todas las deudas registradas? Esta acción no se puede deshacer.')) {
        try {
            const q = query(collection(db, "finance_debts"), where("userId", "==", currentUser.uid));
            const querySnapshot = await getDocs(q);
            
            const deletePromises = [];
            querySnapshot.forEach((document) => {
                deletePromises.push(deleteDoc(doc(db, "finance_debts", document.id)));
            });
            
            await Promise.all(deletePromises);
            loadDebts();
        } catch (e) {
            console.error("Error deleting debts:", e);
            alert("Hubo un error al borrar los datos.");
        }
    }
});
