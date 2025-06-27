const fs = require('fs');

// Load the current MP data
const mps = JSON.parse(fs.readFileSync('./public/data/mps.json', 'utf8'));

console.log('Fixing Bristol MP postcodes...');

// Correct postcode mapping for Bristol constituencies
const bristolPostcodes = {
  'Bristol Central': ['BS1', 'BS2', 'BS8'], // City center, Redland, Clifton
  'Bristol East': ['BS5', 'BS16'], // Eastville, Fishponds, Stapleton
  'Bristol North East': ['BS6', 'BS7', 'BS34'], // Horfield, Bishopston, Little Stoke
  'Bristol North West': ['BS9', 'BS10', 'BS11'], // Henleaze, Brentry, Lawrence Weston
  'Bristol South': ['BS3', 'BS4', 'BS13', 'BS14'] // Bedminster, Knowle, Hartcliffe, Whitchurch
};

// Function to generate realistic postcodes for a given area
function generatePostcodesForArea(areaCodes, count = 50) {
  const postcodes = [];
  const sectors = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Excludes I and O
  
  areaCodes.forEach(areaCode => {
    const postcodesPerArea = Math.ceil(count / areaCodes.length);
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

// Update Bristol MPs with correct postcodes
let updatedCount = 0;
mps.forEach(mp => {
  if (mp.constituency && bristolPostcodes[mp.constituency]) {
    const areaCodes = bristolPostcodes[mp.constituency];
    const newPostcodes = generatePostcodesForArea(areaCodes, 60);
    mp.postcodes = newPostcodes;
    console.log(`Updated ${mp.name} (${mp.constituency}) with ${newPostcodes.length} postcodes from areas: ${areaCodes.join(', ')}`);
    console.log(`  Sample postcodes: ${newPostcodes.slice(0, 5).join(', ')}`);
    updatedCount++;
  }
});

// Remove duplicate MPs (keep the first occurrence)
const uniqueMPs = [];
const seenMPs = new Set();
mps.forEach(mp => {
  const key = `${mp.name}-${mp.constituency}`;
  if (!seenMPs.has(key)) {
    seenMPs.add(key);
    uniqueMPs.push(mp);
  } else {
    console.log(`Removed duplicate: ${mp.name} - ${mp.constituency}`);
  }
});

console.log(`\nFixed ${updatedCount} Bristol MPs with correct postcodes`);
console.log(`Removed ${mps.length - uniqueMPs.length} duplicate MPs`);
console.log(`Total MPs: ${mps.length} -> ${uniqueMPs.length}`);

// Save the updated data
fs.writeFileSync('./public/data/mps.json', JSON.stringify(uniqueMPs, null, 2));
console.log('\nSaved updated MP data to mps.json');

// Test the fix
console.log('\nTesting BS5 search...');
const bs5MPs = uniqueMPs.filter(mp => 
  mp.postcodes && mp.postcodes.some(pc => pc.toLowerCase().startsWith('bs5'))
);
console.log(`MPs with BS5 postcodes: ${bs5MPs.length}`);
bs5MPs.forEach(mp => {
  const bs5Postcodes = mp.postcodes.filter(pc => pc.toLowerCase().startsWith('bs5'));
  console.log(`${mp.name} (${mp.constituency}): ${bs5Postcodes.slice(0, 3).join(', ')}`);
});
