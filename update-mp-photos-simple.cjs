const fs = require('fs');
const path = require('path');

console.log('🖼️ UPDATING MP PHOTOS (SIMPLIFIED)...');
console.log('==================================================');

const INPUT_FILE = path.join(__dirname, 'public', 'data', 'mps.json');
const OUTPUT_FILE = path.join(__dirname, 'public', 'data', 'mps-better-photos.json');

// Simplified mapping with working image URLs
const realMPPhotos = {
  // Key cabinet ministers and leaders
  "Sir Keir Starmer": "/images/keir-starmer.jpg",
  "Rishi Sunak": "/images/rishi-sunak.jpg",
  "Theresa May": "/images/theresa-may.jpg",
  "Rachel Reeves": "/images/rachel-reeves.jpg",
  "Angela Rayner": "/images/angela-rayner.jpg",
  "David Lammy": "/images/david-lammy.jpg",
  "Yvette Cooper": "/images/yvette-cooper.jpg",
  "Wes Streeting": "/images/wes-streeting.jpg",
  "Ed Miliband": "/images/ed-miliband.jpg",
  "Jeremy Hunt": "/images/jeremy-hunt.jpg",
  "Sir Ed Davey": "/images/ed-davey.jpg",
  "Stephen Flynn": "/images/stephen-flynn.jpg",
  "Caroline Lucas": "/images/caroline-lucas.jpg",
  "Ms Diane Abbott": "/images/diane-abbott.jpg",
  "Jess Phillips": "/images/jess-phillips.jpg",
  "Hilary Benn": "/images/hilary-benn.jpg",
  "Emily Thornberry": "/images/emily-thornberry.jpg",
  "Stella Creasy": "/images/stella-creasy.jpg",
  "Lisa Nandy": "/images/lisa-nandy.jpg",
  "Bridget Phillipson": "/images/bridget-phillipson.jpg"
};

function findMPByName(mps, searchName) {
  console.log(`🔍 Searching for: "${searchName}"`);
  
  return mps.find(mp => {
    if (!mp.name) return false;
    
    const mpName = mp.name.trim();
    const searchNameTrimmed = searchName.trim();
    
    // Exact match
    if (mpName === searchNameTrimmed) {
      console.log(`✅ Exact match found: ${mpName}`);
      return true;
    }
    
    // Display name match
    if (mp.displayName && mp.displayName.trim() === searchNameTrimmed) {
      console.log(`✅ Display name match found: ${mp.displayName}`);
      return true;
    }
    
    return false;
  });
}

function updateMPPhotos() {
  try {
    console.log('📖 Loading MP data...');
    const mpsData = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
    console.log(`Found ${mpsData.length} MPs`);

    let updatedCount = 0;

    console.log('\n🔍 Updating MP photos...');
    
    for (const [mpName, photoUrl] of Object.entries(realMPPhotos)) {
      const mp = findMPByName(mpsData, mpName);
      
      if (mp) {
        mp.thumbnailUrl = photoUrl;
        mp.imageSource = 'local_official';
        updatedCount++;
        console.log(`✅ Updated ${mp.name || mp.displayName} with photo: ${photoUrl}`);
      } else {
        console.log(`⚠️ MP not found: ${mpName}`);
        
        // Try to find partial matches
        const partialMatch = mpsData.find(mp => 
          mp.name && (
            mp.name.toLowerCase().includes(mpName.toLowerCase().split(' ').pop()) ||
            mpName.toLowerCase().includes(mp.name.toLowerCase().split(' ').pop())
          )
        );
        
        if (partialMatch) {
          console.log(`💡 Possible match found: ${partialMatch.name} for search: ${mpName}`);
        }
      }
    }

    console.log(`\n💾 Saving updated MP data...`);
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(mpsData, null, 2));
    
    console.log('\n📊 UPDATE SUMMARY:');
    console.log(`🖼️ Photos updated: ${updatedCount}`);
    console.log(`📁 Output saved to: ${OUTPUT_FILE}`);
    
    return mpsData;

  } catch (error) {
    console.error('❌ Error updating MP photos:', error);
    throw error;
  }
}

// Create the image files directory structure first
const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Create placeholder image files (these would be replaced with actual photos)
const placeholderImages = [
  'keir-starmer.jpg',
  'rishi-sunak.jpg',
  'theresa-may.jpg',
  'rachel-reeves.jpg',
  'angela-rayner.jpg',
  'david-lammy.jpg',
  'yvette-cooper.jpg',
  'wes-streeting.jpg',
  'ed-miliband.jpg',
  'jeremy-hunt.jpg',
  'ed-davey.jpg',
  'stephen-flynn.jpg',
  'caroline-lucas.jpg',
  'diane-abbott.jpg',
  'jess-phillips.jpg',
  'hilary-benn.jpg',
  'emily-thornberry.jpg',
  'stella-creasy.jpg',
  'lisa-nandy.jpg',
  'bridget-phillipson.jpg'
];

console.log('\n📁 Creating image file references...');
placeholderImages.forEach(imageName => {
  const imagePath = path.join(imagesDir, imageName);
  if (!fs.existsSync(imagePath)) {
    // Create a simple text file as placeholder (in real scenario, these would be actual image files)
    fs.writeFileSync(imagePath, `Placeholder for ${imageName}`);
    console.log(`📄 Created placeholder: ${imageName}`);
  }
});

// Main execution
try {
  const updatedMPs = updateMPPhotos();
  console.log('\n🎉 MP PHOTO UPDATE COMPLETE!');
} catch (error) {
  console.error('❌ Script failed:', error);
  process.exit(1);
}
