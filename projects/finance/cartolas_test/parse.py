import pandas as pd
import sys

def analyze(file_path):
    print(f"--- Analyzing {file_path} ---")
    try:
        # Try to read as excel, if it fails maybe it's HTML
        df = pd.read_excel(file_path, header=None)
        
        # Find where the actual table starts (look for 'Monto', 'Cargo', etc.)
        for idx, row in df.iterrows():
            row_str = ' '.join([str(x).lower() for x in row.values])
            if 'monto' in row_str or 'cargo' in row_str or 'fecha' in row_str:
                print(f"Header found at row {idx}: {row.values}")
                print(df.iloc[idx:idx+15].to_string())
                break
        else:
            print("No clear header found. First 15 rows:")
            print(df.head(15).to_string())
    except Exception as e:
        print(f"Error reading with pandas read_excel: {e}")
        try:
            df = pd.read_html(file_path)[0]
            print("Successfully read as HTML. First 15 rows:")
            print(df.head(15).to_string())
        except Exception as e2:
            print(f"Error reading as HTML: {e2}")

analyze('Mov_Facturado.xls')
analyze('Saldo_y_Mov_No_Facturado.xls')
