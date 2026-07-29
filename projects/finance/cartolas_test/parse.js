const XLSX = require('xlsx');

function parseXLS(file) {
    console.log(`\n--- parsing ${file} ---`);
    try {
        const workbook = XLSX.readFile(file);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        
        for (let i = 0; i < Math.min(rows.length, 30); i++) {
            console.log(`[${i}]: ${JSON.stringify(rows[i])}`);
        }
    } catch(e) {
        console.log("Error:", e);
    }
}

parseXLS('Mov_Facturado.xls');
parseXLS('Saldo_y_Mov_No_Facturado.xls');
