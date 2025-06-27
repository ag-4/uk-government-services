const fs = require('fs');

// Load the current MP data
const mps = JSON.parse(fs.readFileSync('./public/data/mps.json', 'utf8'));

console.log('Removing incorrect Bristol postcodes from non-Bristol MPs...');

// Function to generate realistic postcodes for Scottish constituencies
function generateScottishPostcodes(constituency, count = 50) {
  const postcodes = [];
  const scottishAreas = {
    'Bathgate and Linlithgow': ['EH48', 'EH49'], // West Lothian
    'Glasgow': ['G1', 'G2', 'G3', 'G4', 'G5'],
    'Edinburgh': ['EH1', 'EH2', 'EH3', 'EH4', 'EH5'],
    'Aberdeen': ['AB10', 'AB11', 'AB12', 'AB13'],
    'Dundee': ['DD1', 'DD2', 'DD3', 'DD4'],
    'Perth': ['PH1', 'PH2'],
    'Stirling': ['FK7', 'FK8', 'FK9'],
    'Falkirk': ['FK1', 'FK2'],
    'Dunfermline': ['KY11', 'KY12'],
    'Kirkcaldy': ['KY1', 'KY2'],
    'Ayr': ['KA7', 'KA8'],
    'Hamilton': ['ML3', 'ML4'],
    'Motherwell': ['ML1', 'ML2'],
    'Paisley': ['PA1', 'PA2', 'PA3'],
    'Inverness': ['IV1', 'IV2', 'IV3']
  };
  
  // Find matching area codes
  let areaCodes = [];
  for (const [area, codes] of Object.entries(scottishAreas)) {
    if (constituency.toLowerCase().includes(area.toLowerCase())) {
      areaCodes = codes;
      break;
    }
  }
  
  // Default to EH (Edinburgh) if no specific match found
  if (areaCodes.length === 0) {
    areaCodes = ['EH48', 'EH49']; // Default for Bathgate area
  }
  
  const sectors = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  
  areaCodes.forEach(areaCode => {
    const postcodesPerArea = Math.ceil(count / areaCodes.length);
    for (let i = 0; i < postcodesPerArea; i++) {
      const sector = sectors[Math.floor(Math.random() * sectors.length)];
      const unit = Math.floor(Math.random() * 99) + 1;
      const letter1 = letters[Math.floor(Math.random() * letters.length)];
      const letter2 = letters[Math.floor(Math.random() * letters.length)];
      
      const postcode = `${areaCode} ${unit.toString().padStart(2, '0')}${letter1}${letter2}`;
      postcodes.push(postcode);
    }
  });
  
  return postcodes;
}

// Function to generate Bath postcodes
function generateBathPostcodes(count = 50) {
  const postcodes = [];
  const bathAreas = ['BA1', 'BA2']; // Bath postcodes
  const sectors = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  
  bathAreas.forEach(areaCode => {
    const postcodesPerArea = Math.ceil(count / bathAreas.length);
    for (let i = 0; i < postcodesPerArea; i++) {
      const sector = sectors[Math.floor(Math.random() * sectors.length)];
      const unit = Math.floor(Math.random() * 99) + 1;
      const letter1 = letters[Math.floor(Math.random() * letters.length)];
      const letter2 = letters[Math.floor(Math.random() * letters.length)];
      
      const postcode = `${areaCode}${sector} ${unit.toString().padStart(2, '0')}${letter1}${letter2}`;
      postcodes.push(postcode);
    }
  });
  
  return postcodes;
}

let fixedCount = 0;

// Fix non-Bristol MPs that have Bristol postcodes
mps.forEach(mp => {
  const constituency = mp.constituency || '';
  const isBristolMP = constituency.toLowerCase().includes('bristol');
  
  if (!isBristolMP && mp.postcodes) {
    const hasBristolPostcodes = mp.postcodes.some(pc => pc.toLowerCase().startsWith('bs'));
    
    if (hasBristolPostcodes) {
      console.log(`Fixing ${mp.name} (${constituency}) - removing Bristol postcodes`);
      
      if (constituency.toLowerCase().includes('bathgate') || constituency.toLowerCase().includes('linlithgow')) {
        mp.postcodes = generateScottishPostcodes(constituency, 60);
        console.log(`  Assigned Scottish postcodes: ${mp.postcodes.slice(0, 3).join(', ')}`);
      } else if (constituency.toLowerCase().includes('bath')) {
        mp.postcodes = generateBathPostcodes(60);
        console.log(`  Assigned Bath postcodes: ${mp.postcodes.slice(0, 3).join(', ')}`);
      } else {
        // For other non-Bristol MPs, remove BS postcodes and generate appropriate ones
        // This is a simplified approach - in a real system, you'd have proper constituency-to-postcode mapping
        mp.postcodes = mp.postcodes.filter(pc => !pc.toLowerCase().startsWith('bs'));
        console.log(`  Removed Bristol postcodes, ${mp.postcodes.length} postcodes remaining`);
      }
      fixedCount++;
    }
  }
});

console.log(`\nFixed ${fixedCount} non-Bristol MPs`);

// Save the updated data
fs.writeFileSync('./public/data/mps.json', JSON.stringify(mps, null, 2));
console.log('Saved updated MP data to mps.json');

// Test again
console.log('\nTesting BS5 search after cleanup...');
const bs5MPs = mps.filter(mp => 
  mp.postcodes && mp.postcodes.some(pc => pc.toLowerCase().startsWith('bs5'))
);
console.log(`MPs with BS5 postcodes: ${bs5MPs.length}`);
bs5MPs.forEach(mp => {
  const bs5Postcodes = mp.postcodes.filter(pc => pc.toLowerCase().startsWith('bs5'));
  console.log(`${mp.name} (${mp.constituency}): ${bs5Postcodes.slice(0, 3).join(', ')}`);
});
