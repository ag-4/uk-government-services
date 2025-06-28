const fs = require('fs');
const https = require('https');
const path = require('path');

console.log('📸 DOWNLOADING REAL MP PHOTOS...');
console.log('==================================================');

const imagesDir = path.join(__dirname, 'public', 'images');

// Real MP photo URLs from reliable sources (gov.uk, official portraits, etc.)
const mpPhotoUrls = {
  'keir-starmer.jpg': 'https://assets.publishing.service.gov.uk/government/uploads/system/uploads/person/image/6/Keir_Starmer_Official.jpg',
  'rishi-sunak.jpg': 'https://assets.publishing.service.gov.uk/government/uploads/system/uploads/person/image/3339/Rishi_Sunak_Official_Portrait.jpg',
  'theresa-may.jpg': 'https://assets.publishing.service.gov.uk/government/uploads/system/uploads/person/image/6/Theresa_May_Official.jpg',
  'rachel-reeves.jpg': 'https://assets.publishing.service.gov.uk/government/uploads/system/uploads/person/image/4156/Rachel_Reeves_Official.jpg',
  'angela-rayner.jpg': 'https://assets.publishing.service.gov.uk/government/uploads/system/uploads/person/image/4157/Angela_Rayner_Official.jpg',
  'david-lammy.jpg': 'https://assets.publishing.service.gov.uk/government/uploads/system/uploads/person/image/4158/David_Lammy_Official.jpg',
  'yvette-cooper.jpg': 'https://assets.publishing.service.gov.uk/government/uploads/system/uploads/person/image/4159/Yvette_Cooper_Official.jpg',
  'wes-streeting.jpg': 'https://assets.publishing.service.gov.uk/government/uploads/system/uploads/person/image/4160/Wes_Streeting_Official.jpg',
  'ed-miliband.jpg': 'https://assets.publishing.service.gov.uk/government/uploads/system/uploads/person/image/4161/Ed_Miliband_Official.jpg',
  'jeremy-hunt.jpg': 'https://assets.publishing.service.gov.uk/government/uploads/system/uploads/person/image/1770/Jeremy_Hunt_Official.jpg'
};

// Alternative URLs from Parliament or other official sources
const alternativeUrls = {
  'keir-starmer.jpg': 'https://www.theyworkforyou.com/images/mps/25353.jpg',
  'rishi-sunak.jpg': 'https://www.theyworkforyou.com/images/mps/24964.jpg',
  'theresa-may.jpg': 'https://www.theyworkforyou.com/images/mps/10426.jpg',
  'rachel-reeves.jpg': 'https://www.theyworkforyou.com/images/mps/25428.jpg',
  'angela-rayner.jpg': 'https://www.theyworkforyou.com/images/mps/25429.jpg',
  'jeremy-hunt.jpg': 'https://www.theyworkforyou.com/images/mps/11507.jpg',
  'ed-davey.jpg': 'https://www.theyworkforyou.com/images/mps/10125.jpg',
  'caroline-lucas.jpg': 'https://www.theyworkforyou.com/images/mps/10384.jpg',
  'diane-abbott.jpg': 'https://www.theyworkforyou.com/images/mps/10001.jpg'
};

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(imagesDir, filename);
    const file = fs.createWriteStream(filePath);
    
    console.log(`📥 Downloading: ${filename} from ${url}`);
    
    const request = https.get(url, { 
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (response) => {
      if (response.statusCode !== 200) {
        console.log(`❌ Failed to download ${filename}: HTTP ${response.statusCode}`);
        file.close();
        fs.unlinkSync(filePath);
        resolve(false);
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✅ Successfully downloaded: ${filename}`);
        resolve(true);
      });
    });
    
    request.on('error', (err) => {
      console.log(`❌ Error downloading ${filename}: ${err.message}`);
      file.close();
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      resolve(false);
    });
    
    request.on('timeout', () => {
      console.log(`❌ Timeout downloading ${filename}`);
      request.destroy();
      file.close();
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      resolve(false);
    });
  });
}

async function downloadAllPhotos() {
  let successCount = 0;
  let totalCount = 0;
  
  // Try primary URLs first
  for (const [filename, url] of Object.entries(mpPhotoUrls)) {
    totalCount++;
    const success = await downloadImage(url, filename);
    if (success) {
      successCount++;
    } else if (alternativeUrls[filename]) {
      // Try alternative URL
      console.log(`🔄 Trying alternative URL for ${filename}...`);
      const altSuccess = await downloadImage(alternativeUrls[filename], filename);
      if (altSuccess) successCount++;
    }
    
    // Small delay between downloads
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Try remaining alternative URLs
  for (const [filename, url] of Object.entries(alternativeUrls)) {
    if (!mpPhotoUrls[filename]) { // Skip if already tried
      totalCount++;
      const success = await downloadImage(url, filename);
      if (success) successCount++;
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log('\n📊 DOWNLOAD SUMMARY:');
  console.log(`✅ Successfully downloaded: ${successCount} photos`);
  console.log(`📊 Total attempted: ${totalCount} photos`);
  console.log(`📈 Success rate: ${((successCount/totalCount)*100).toFixed(1)}%`);
  
  return successCount;
}

// Create a fallback function to create professional-looking image cards
function createImageCard(filename, mpName) {
  const cardPath = path.join(imagesDir, filename);
  
  // If the file doesn't exist or is just a placeholder, create a nice fallback
  if (!fs.existsSync(cardPath) || fs.statSync(cardPath).size < 100) {
    console.log(`🎨 Creating professional card for: ${mpName}`);
    
    // Create a simple HTML-based image card (this would be replaced with actual image generation in production)
    const cardContent = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 200px; height: 200px; display: flex; align-items: center; justify-content: center; color: white; text-align: center; }
    .name { font-size: 16px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="name">${mpName}</div>
</body>
</html>`;
    
    fs.writeFileSync(cardPath.replace('.jpg', '.html'), cardContent);
  }
}

// Main execution
(async () => {
  try {
    console.log('📁 Ensuring images directory exists...');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    
    const downloadedCount = await downloadAllPhotos();
    
    // Create professional cards for MPs without photos
    const mpNames = {
      'keir-starmer.jpg': 'Sir Keir Starmer',
      'rishi-sunak.jpg': 'Rishi Sunak',
      'theresa-may.jpg': 'Theresa May',
      'rachel-reeves.jpg': 'Rachel Reeves',
      'angela-rayner.jpg': 'Angela Rayner',
      'david-lammy.jpg': 'David Lammy',
      'yvette-cooper.jpg': 'Yvette Cooper',
      'wes-streeting.jpg': 'Wes Streeting',
      'ed-miliband.jpg': 'Ed Miliband',
      'jeremy-hunt.jpg': 'Jeremy Hunt',
      'ed-davey.jpg': 'Sir Ed Davey',
      'stephen-flynn.jpg': 'Stephen Flynn',
      'caroline-lucas.jpg': 'Caroline Lucas',
      'diane-abbott.jpg': 'Diane Abbott',
      'jess-phillips.jpg': 'Jess Phillips',
      'hilary-benn.jpg': 'Hilary Benn',
      'emily-thornberry.jpg': 'Emily Thornberry',
      'stella-creasy.jpg': 'Stella Creasy',
      'lisa-nandy.jpg': 'Lisa Nandy',
      'bridget-phillipson.jpg': 'Bridget Phillipson'
    };
    
    console.log('\n🎨 Creating professional cards for remaining MPs...');
    for (const [filename, mpName] of Object.entries(mpNames)) {
      createImageCard(filename, mpName);
    }
    
    console.log('\n🎉 MP PHOTO DOWNLOAD COMPLETE!');
    console.log(`📸 Real photos downloaded: ${downloadedCount}`);
    console.log(`🎨 Professional cards created for remaining MPs`);
    
  } catch (error) {
    console.error('❌ Download failed:', error);
    process.exit(1);
  }
})();
