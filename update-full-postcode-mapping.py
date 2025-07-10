import csv
import json

# Load data from CSV files
# Postcode to constituency mapping
postcode_to_constituency_map = {}

with open('postcode_data.csv', 'r') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        postcode_prefix = row['Postcode'].split()[0]
        constituency = row['Constituency']

        if postcode_prefix not in postcode_to_constituency_map:
            postcode_to_constituency_map[postcode_prefix] = constituency

# Save updated mapping to JSON
with open('public/data/postcode-to-constituency.json', 'w') as jsonfile:
    json.dump(postcode_to_constituency_map, jsonfile, indent=2)

print('✅ Comprehensive postcode-to-constituency mapping created.')
