import csv
import os

# Get the directory where this script is located
script_dir = os.path.dirname(os.path.abspath(__file__))
csv_file = os.path.join(script_dir, 'jobroles.csv')  # Put your CSV here
output_file = os.path.join(script_dir, 'IMPORT_ALL_JOBROLES.sql')

# Read CSV and generate SQL
with open(csv_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    
    with open(output_file, 'w', encoding='utf-8') as out:
        out.write("-- AUTO-GENERATED: Import all jobroles\n")
        out.write("-- Supabase will auto-generate IDs\n\n")
        out.write('INSERT INTO karmafy_jobrole (name, "createdAt", "updatedAt", alternate_roles, keywords, "jobTitlesToApplyFor")\n')
        out.write("VALUES\n")
        
        values = []
        for row in reader:
            # Escape single quotes by doubling them
            name = row['name'].replace("'", "''")
            created = row['createdAt']
            updated = row['updatedAt']
            alt_roles = row['alternate_roles'].replace("'", "''") if row['alternate_roles'] else ''
            keywords = row['keywords'].replace("'", "''") if row['keywords'] else ''
            job_titles = row['jobTitlesToApplyFor'].replace("'", "''") if row['jobTitlesToApplyFor'] else ''
            
            values.append(f"  ('{name}', '{created}', '{updated}', '{alt_roles}', '{keywords}', '{job_titles}')")
        
        out.write(',\n'.join(values))
        out.write(';\n\n')
        out.write('-- Verify import\n')
        out.write('SELECT COUNT(*) as total_imported FROM karmafy_jobrole;\n')

print(f"✅ SQL script created: {output_file}")
print("📋 Next steps:")
print("1. Save your CSV data as 'jobroles.csv' in the same folder as this script")
print("2. Run: python convert_csv_to_sql.py")
print("3. Copy the generated SQL from IMPORT_ALL_JOBROLES.sql")
print("4. Paste into Supabase SQL Editor and run")
