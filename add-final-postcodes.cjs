const fs = require('fs');

// Load existing mapping
const mapping = JSON.parse(fs.readFileSync('./public/data/postcode-to-constituency.json', 'utf8'));

// Add missing Edinburgh postcodes
const edinburghMappings = {
  "EH1": "Edinburgh South", // City center
  "EH2": "Edinburgh West", 
  "EH3": "Edinburgh West",
  "EH8": "Edinburgh East and Musselburgh",
  "EH9": "Edinburgh South",
  "EH18": "Edinburgh South West",
  "EH19": "Edinburgh South West",
  "EH20": "Edinburgh South West",
  "EH21": "Edinburgh East and Musselburgh",
  "EH22": "Edinburgh East and Musselburgh",
  "EH23": "Edinburgh South West",
  "EH24": "Edinburgh South West",
  "EH25": "Edinburgh South West",
  "EH26": "Edinburgh South West",
  "EH27": "Edinburgh South West",
  "EH28": "Edinburgh South West",
  "EH29": "Edinburgh South West",
};

// Add a few more missing common postcodes from other areas
const additionalMappings = {
  // More Yorkshire
  "HD1": "Huddersfield",
  "HD2": "Huddersfield", 
  "HD3": "Huddersfield",
  "HD4": "Huddersfield",
  "HD5": "Huddersfield",
  "HD6": "Huddersfield",
  "HD7": "Huddersfield",
  "HD8": "Huddersfield",
  "HD9": "Huddersfield",
  
  // More Kent
  "CT1": "Canterbury",
  "CT2": "Canterbury",
  "CT3": "Canterbury", 
  "CT4": "Canterbury",
  "CT5": "Herne Bay and Sandwich",
  "CT6": "Herne Bay and Sandwich",
  "CT7": "Herne Bay and Sandwich",
  "CT8": "Herne Bay and Sandwich",
  "CT9": "Thanet East",
  "CT10": "Thanet East",
  "CT11": "Thanet East",
  "CT12": "Thanet East",
  "CT13": "Folkestone and Hythe",
  "CT14": "Dover and Deal",
  "CT15": "Dover and Deal",
  "CT16": "Dover and Deal",
  "CT17": "Dover and Deal",
  "CT18": "Dover and Deal",
  "CT19": "Folkestone and Hythe",
  "CT20": "Folkestone and Hythe",
  "CT21": "Folkestone and Hythe",
  
  // More Surrey
  "GU1": "Guildford",
  "GU2": "Guildford",
  "GU3": "Guildford",
  "GU4": "Guildford",
  "GU5": "Guildford",
  "GU6": "South West Surrey",
  "GU7": "South West Surrey", 
  "GU8": "South West Surrey",
  "GU9": "East Hampshire",
  "GU10": "East Hampshire",
  "GU11": "Aldershot",
  "GU12": "Aldershot",
  "GU14": "Aldershot",
  "GU15": "Surrey Heath",
  "GU16": "Surrey Heath",
  "GU17": "Surrey Heath",
  "GU18": "Surrey Heath",
  "GU19": "Surrey Heath",
  "GU20": "Surrey Heath",
  "GU21": "Woking",
  "GU22": "Woking",
  "GU23": "Woking",
  "GU24": "Woking",
  "GU25": "Runnymede and Weybridge",
  "GU26": "East Hampshire",
  "GU27": "East Hampshire",
  "GU28": "Horsham",
  "GU29": "Horsham",
  
  // More Essex
  "CM1": "Chelmsford",
  "CM2": "Chelmsford",
  "CM3": "Chelmsford",
  "CM4": "Brentwood and Ongar",
  "CM5": "Brentwood and Ongar",
  "CM6": "Dunmow and Stansted",
  "CM7": "Braintree",
  "CM8": "Witham",
  "CM9": "Maldon",
  "CM11": "Basildon and Billericay",
  "CM12": "Basildon and Billericay",
  "CM13": "Brentwood and Ongar",
  "CM14": "Brentwood and Ongar",
  "CM15": "Brentwood and Ongar",
  "CM16": "Epping Forest",
  "CM17": "Harlow",
  "CM18": "Harlow",
  "CM19": "Harlow",
  "CM20": "Harlow",
  "CM21": "Hertford and Stortford",
  "CM22": "Hertford and Stortford",
  "CM23": "Hertford and Stortford",
  "CM24": "Hertford and Stortford",
  
  // More Berkshire
  "RG1": "Reading Central",
  "RG2": "Reading West and Mid Berkshire", 
  "RG3": "Reading West and Mid Berkshire",
  "RG4": "Reading Central",
  "RG5": "Wokingham",
  "RG6": "Reading Central",
  "RG7": "Reading West and Mid Berkshire",
  "RG8": "Reading West and Mid Berkshire",
  "RG9": "Henley and Thame",
  "RG10": "Wokingham",
  "RG11": "Wokingham",
  "RG12": "Bracknell",
  "RG14": "Newbury", 
  "RG17": "Newbury",
  "RG18": "Newbury",
  "RG19": "Newbury",
  "RG20": "Newbury",
  "RG21": "Basingstoke",
  "RG22": "Basingstoke",
  "RG23": "Basingstoke",
  "RG24": "Basingstoke",
  "RG25": "Basingstoke",
  "RG26": "Basingstoke", 
  "RG27": "North East Hampshire",
  "RG28": "North East Hampshire",
  "RG29": "North East Hampshire",
  "RG30": "Reading West and Mid Berkshire",
  "RG31": "Reading West and Mid Berkshire",
  "RG40": "Wokingham",
  "RG41": "Wokingham",
  "RG42": "Bracknell",
  "RG45": "Bracknell",
};

// Combine all mappings
const allNewMappings = { ...edinburghMappings, ...additionalMappings };

// Add to existing mapping
Object.entries(allNewMappings).forEach(([postcode, constituency]) => {
  mapping[postcode] = constituency;
});

// Write updated mapping
fs.writeFileSync('./public/data/postcode-to-constituency.json', JSON.stringify(mapping, null, 2));

console.log(`Added ${Object.keys(allNewMappings).length} new postcode mappings`);
console.log(`Total postcode areas now: ${Object.keys(mapping).length}`);

// Test the Edinburgh fix
console.log(`\nTesting Edinburgh postcodes:`);
['EH1', 'EH2', 'EH3', 'EH8', 'EH9'].forEach(code => {
  console.log(`${code}: ${mapping[code]}`);
});
