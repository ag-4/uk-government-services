const fs = require('fs');
const path = require('path');
const https = require('https');

console.log('🖼️ ADDING ENHANCED REAL MP PHOTOS...');
console.log('==================================================');

const INPUT_FILE = path.join(__dirname, 'public', 'data', 'mps.json');
const OUTPUT_FILE = path.join(__dirname, 'public', 'data', 'mps-enhanced-photos.json');

// Enhanced mapping with more real MP photos from reliable sources
const realMPPhotos = {
  // Cabinet Ministers and Party Leaders
  "Sir Keir Starmer": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Official_portrait_of_Rt_Hon_Sir_Keir_Starmer_KCB_QC_MP_crop_2.jpg/256px-Official_portrait_of_Rt_Hon_Sir_Keir_Starmer_KCB_QC_MP_crop_2.jpg",
  "Rishi Sunak": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Official_portrait_of_Rishi_Sunak_crop_2.jpg/256px-Official_portrait_of_Rishi_Sunak_crop_2.jpg",
  "Rachel Reeves": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Official_portrait_of_Rachel_Reeves_crop_2.jpg/256px-Official_portrait_of_Rachel_Reeves_crop_2.jpg",
  "Angela Rayner": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Official_portrait_of_Angela_Rayner_crop_2.jpg/256px-Official_portrait_of_Angela_Rayner_crop_2.jpg",
  "David Lammy": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Official_portrait_of_Rt_Hon_David_Lammy_MP_crop_2.jpg/256px-Official_portrait_of_Rt_Hon_David_Lammy_MP_crop_2.jpg",
  "Yvette Cooper": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Official_portrait_of_Rt_Hon_Yvette_Cooper_MP_crop_2.jpg/256px-Official_portrait_of_Rt_Hon_Yvette_Cooper_MP_crop_2.jpg",
  "John Healey": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Official_portrait_of_Rt_Hon_John_Healey_MP_crop_2.jpg/256px-Official_portrait_of_Rt_Hon_John_Healey_MP_crop_2.jpg",
  "Wes Streeting": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Official_portrait_of_Wes_Streeting_MP_crop_2.jpg/256px-Official_portrait_of_Wes_Streeting_MP_crop_2.jpg",
  "Shabana Mahmood": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Official_portrait_of_Shabana_Mahmood_MP_crop_2.jpg/256px-Official_portrait_of_Shabana_Mahmood_MP_crop_2.jpg",
  "Ed Miliband": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Official_portrait_of_Rt_Hon_Ed_Miliband_MP_crop_2.jpg/256px-Official_portrait_of_Rt_Hon_Ed_Miliband_MP_crop_2.jpg",

  // Opposition Leaders and Shadow Cabinet
  "Kemi Badenoch": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Official_portrait_of_Kemi_Badenoch_MP_crop_2.jpg/256px-Official_portrait_of_Kemi_Badenoch_MP_crop_2.jpg",
  "Jeremy Hunt": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Official_portrait_of_Rt_Hon_Jeremy_Hunt_MP_crop_2.jpg/256px-Official_portrait_of_Rt_Hon_Jeremy_Hunt_MP_crop_2.jpg",
  "James Cleverly": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Official_portrait_of_Rt_Hon_James_Cleverly_MP_crop_2.jpg/256px-Official_portrait_of_Rt_Hon_James_Cleverly_MP_crop_2.jpg",
  "Priti Patel": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Official_portrait_of_Rt_Hon_Priti_Patel_MP_crop_2.jpg/256px-Official_portrait_of_Rt_Hon_Priti_Patel_MP_crop_2.jpg",
  "Robert Jenrick": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Official_portrait_of_Robert_Jenrick_MP_crop_2.jpg/256px-Official_portrait_of_Robert_Jenrick_MP_crop_2.jpg",
  "Tom Tugendhat": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Official_portrait_of_Tom_Tugendhat_MP_crop_2.jpg/256px-Official_portrait_of_Tom_Tugendhat_MP_crop_2.jpg",

  // Former Prime Ministers and Senior MPs
  "Theresa May": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Official_portrait_of_Mrs_Theresa_May_MP_crop_2.jpg/256px-Official_portrait_of_Mrs_Theresa_May_MP_crop_2.jpg",
  "Liz Truss": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Official_portrait_of_Rt_Hon_Liz_Truss_MP_crop_2.jpg/256px-Official_portrait_of_Rt_Hon_Liz_Truss_MP_crop_2.jpg",
  "Boris Johnson": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Boris_Johnson_official_portrait_%28cropped%29.jpg/256px-Boris_Johnson_official_portrait_%28cropped%29.jpg",
  "Gordon Brown": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Gordon_Brown_official.jpg/256px-Gordon_Brown_official.jpg",
  "Tony Blair": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Tony_Blair_2010_%28cropped%29.jpg/256px-Tony_Blair_2010_%28cropped%29.jpg",

  // SNP Leaders
  "Stephen Flynn": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Official_portrait_of_Stephen_Flynn_MP_crop_2.jpg/256px-Official_portrait_of_Stephen_Flynn_MP_crop_2.jpg",
  "Ian Blackford": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Official_portrait_of_Ian_Blackford_MP_crop_2.jpg/256px-Official_portrait_of_Ian_Blackford_MP_crop_2.jpg",

  // Liberal Democrats
  "Sir Ed Davey": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Official_portrait_of_Rt_Hon_Sir_Ed_Davey_MP_crop_2.jpg/256px-Official_portrait_of_Rt_Hon_Sir_Ed_Davey_MP_crop_2.jpg",
  "Layla Moran": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Official_portrait_of_Layla_Moran_MP_crop_2.jpg/256px-Official_portrait_of_Layla_Moran_MP_crop_2.jpg",

  // Other Notable MPs
  "Nigel Farage": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Nigel_Farage_2014_%28cropped%29.jpg/256px-Nigel_Farage_2014_%28cropped%29.jpg",
  "George Galloway": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/George_Galloway_2016.jpg/256px-George_Galloway_2016.jpg",
  "Caroline Lucas": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Official_portrait_of_Caroline_Lucas_crop_2.jpg/256px-Official_portrait_of_Caroline_Lucas_crop_2.jpg",
  "Diane Abbott": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Official_portrait_of_Ms_Diane_Abbott_MP_crop_2.jpg/256px-Official_portrait_of_Ms_Diane_Abbott_MP_crop_2.jpg",
  "Jacob Rees-Mogg": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Official_portrait_of_Mr_Jacob_Rees-Mogg_MP_crop_2.jpg/256px-Official_portrait_of_Mr_Jacob_Rees-Mogg_MP_crop_2.jpg",
  "Iain Duncan Smith": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Official_portrait_of_Mr_Iain_Duncan_Smith_MP_crop_2.jpg/256px-Official_portrait_of_Mr_Iain_Duncan_Smith_MP_crop_2.jpg",
  "David Davis": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Official_portrait_of_Mr_David_Davis_MP_crop_2.jpg/256px-Official_portrait_of_Mr_David_Davis_MP_crop_2.jpg",
  "Hilary Benn": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Official_portrait_of_Rt_Hon_Hilary_Benn_MP_crop_2.jpg/256px-Official_portrait_of_Rt_Hon_Hilary_Benn_MP_crop_2.jpg",
  "Harriet Harman": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Official_portrait_of_Rt_Hon_Harriet_Harman_QC_MP_crop_2.jpg/256px-Official_portrait_of_Rt_Hon_Harriet_Harman_QC_MP_crop_2.jpg",
  "Sir Lindsay Hoyle": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Official_portrait_of_Rt_Hon_Sir_Lindsay_Hoyle_MP_crop_2.jpg/256px-Official_portrait_of_Rt_Hon_Sir_Lindsay_Hoyle_MP_crop_2.jpg",

  // Women MPs and Rising Stars
  "Tulip Siddiq": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Official_portrait_of_Tulip_Siddiq_MP_crop_2.jpg/256px-Official_portrait_of_Tulip_Siddiq_MP_crop_2.jpg",
  "Jess Phillips": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Official_portrait_of_Jess_Phillips_MP_crop_2.jpg/256px-Official_portrait_of_Jess_Phillips_MP_crop_2.jpg",
  "Stella Creasy": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Official_portrait_of_Stella_Creasy_MP_crop_2.jpg/256px-Official_portrait_of_Stella_Creasy_MP_crop_2.jpg",
  "Bridget Phillipson": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Official_portrait_of_Bridget_Phillipson_MP_crop_2.jpg/256px-Official_portrait_of_Bridget_Phillipson_MP_crop_2.jpg",
  "Lisa Nandy": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Official_portrait_of_Lisa_Nandy_MP_crop_2.jpg/256px-Official_portrait_of_Lisa_Nandy_MP_crop_2.jpg",
  "Emily Thornberry": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Official_portrait_of_Emily_Thornberry_MP_crop_2.jpg/256px-Official_portrait_of_Emily_Thornberry_MP_crop_2.jpg",

  // Regional leaders and Notable MPs
  "Andy Burnham": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Andy_Burnham_2016_%28cropped%29.jpg/256px-Andy_Burnham_2016_%28cropped%29.jpg",
  "Sadiq Khan": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Sadiq_Khan_2016_%28cropped%29.jpg/256px-Sadiq_Khan_2016_%28cropped%29.jpg",
  "Matt Hancock": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Official_portrait_of_Matt_Hancock_MP_crop_2.jpg/256px-Official_portrait_of_Matt_Hancock_MP_crop_2.jpg",
  "Michael Gove": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Official_portrait_of_Rt_Hon_Michael_Gove_MP_crop_2.jpg/256px-Official_portrait_of_Rt_Hon_Michael_Gove_MP_crop_2.jpg",
  "Dominic Raab": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Official_portrait_of_Rt_Hon_Dominic_Raab_MP_crop_2.jpg/256px-Official_portrait_of_Rt_Hon_Dominic_Raab_MP_crop_2.jpg",
  "Sajid Javid": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Official_portrait_of_Rt_Hon_Sajid_Javid_MP_crop_2.jpg/256px-Official_portrait_of_Rt_Hon_Sajid_Javid_MP_crop_2.jpg"
};

// Alternative sources for some MPs (in case Wikipedia images don't work)
const alternativePhotos = {
  "Sir Keir Starmer": "https://www.theyworkforyou.com/images/mps/25353.jpg",
  "Rishi Sunak": "https://www.theyworkforyou.com/images/mps/24964.jpg",
  "Theresa May": "https://www.theyworkforyou.com/images/mps/10426.jpg",
  "Boris Johnson": "https://www.theyworkforyou.com/images/mps/10999.jpg",
  "Jeremy Hunt": "https://www.theyworkforyou.com/images/mps/11507.jpg",
  "Angela Rayner": "https://www.theyworkforyou.com/images/mps/25428.jpg"
};

function findMPByName(mps, searchName) {
  // Clean the search name
  const cleanName = searchName.toLowerCase()
    .replace(/^(sir|dame|rt hon|dr|mr|mrs|ms|lord|lady)\s+/i, '')
    .replace(/\s+(mp|qc|kcb)$/i, '')
    .trim();

  return mps.find(mp => {
    if (!mp.name) return false;
    
    const mpName = mp.name.toLowerCase()
      .replace(/^(sir|dame|rt hon|dr|mr|mrs|ms|lord|lady)\s+/i, '')
      .replace(/\s+(mp|qc|kcb)$/i, '')
      .trim();
    
    // Exact match
    if (mpName === cleanName) return true;
    
    // Display name match
    if (mp.displayName) {
      const displayName = mp.displayName.toLowerCase()
        .replace(/^(sir|dame|rt hon|dr|mr|mrs|ms|lord|lady)\s+/i, '')
        .replace(/\s+(mp|qc|kcb)$/i, '')
        .trim();
      if (displayName === cleanName) return true;
    }
    
    return false;
  });
}

async function validateImageUrl(url) {
  return new Promise((resolve) => {
    const request = https.get(url, { timeout: 5000 }, (response) => {
      if (response.statusCode === 200 && response.headers['content-type']?.startsWith('image/')) {
        resolve(true);
      } else {
        resolve(false);
      }
      response.destroy();
    });
    
    request.on('error', () => resolve(false));
    request.on('timeout', () => {
      request.destroy();
      resolve(false);
    });
  });
}

async function updateMPPhotos() {
  try {
    console.log('📖 Loading MP data...');
    const mpsData = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
    console.log(`Found ${mpsData.length} MPs`);

    let updatedCount = 0;
    let validatedCount = 0;

    console.log('\n🔍 Adding enhanced MP photos...');
    
    for (const [mpName, photoUrl] of Object.entries(realMPPhotos)) {
      const mp = findMPByName(mpsData, mpName);
      
      if (mp) {
        console.log(`📷 Checking photo for ${mp.name || mp.displayName}...`);
        
        // Validate the primary photo URL
        const isValid = await validateImageUrl(photoUrl);
        
        if (isValid) {
          mp.thumbnailUrl = photoUrl;
          mp.imageSource = 'wikipedia_official';
          updatedCount++;
          validatedCount++;
          console.log(`✅ Updated ${mp.name || mp.displayName} with official photo`);
        } else {
          // Try alternative photo if available
          const altPhoto = alternativePhotos[mpName];
          if (altPhoto) {
            const isAltValid = await validateImageUrl(altPhoto);
            if (isAltValid) {
              mp.thumbnailUrl = altPhoto;
              mp.imageSource = 'theyworkforyou';
              updatedCount++;
              validatedCount++;
              console.log(`✅ Updated ${mp.name || mp.displayName} with alternative photo`);
            } else {
              console.log(`❌ Both photos failed for ${mp.name || mp.displayName}`);
            }
          } else {
            console.log(`❌ Photo validation failed for ${mp.name || mp.displayName}`);
          }
        }
      } else {
        console.log(`⚠️ MP not found: ${mpName}`);
      }
      
      // Small delay to avoid overwhelming servers
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n💾 Saving enhanced MP data...`);
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(mpsData, null, 2));
    
    console.log('\n📊 ENHANCEMENT SUMMARY:');
    console.log(`🖼️ Enhanced photos added: ${updatedCount}`);
    console.log(`✅ Validated photos: ${validatedCount}`);
    console.log(`📁 Output saved to: ${OUTPUT_FILE}`);
    
    return mpsData;

  } catch (error) {
    console.error('❌ Error updating MP photos:', error);
    throw error;
  }
}

async function generateImageReport(mpsData) {
  console.log('\n📊 GENERATING IMAGE COVERAGE REPORT...');
  
  const imageStats = {
    total: mpsData.length,
    wikipedia: 0,
    theyworkforyou: 0,
    parliament: 0,
    partyLogos: 0,
    placeholders: 0
  };

  mpsData.forEach(mp => {
    if (!mp.thumbnailUrl || mp.thumbnailUrl.includes('placeholder')) {
      imageStats.placeholders++;
    } else if (mp.imageSource === 'wikipedia_official' || mp.thumbnailUrl.includes('wikipedia')) {
      imageStats.wikipedia++;
    } else if (mp.imageSource === 'theyworkforyou' || mp.thumbnailUrl.includes('theyworkforyou')) {
      imageStats.theyworkforyou++;
    } else if (mp.thumbnailUrl.includes('parliament.uk')) {
      imageStats.parliament++;
    } else if (mp.thumbnailUrl.includes('-logo.')) {
      imageStats.partyLogos++;
    } else {
      imageStats.placeholders++;
    }
  });

  const realPhotos = imageStats.wikipedia + imageStats.theyworkforyou + imageStats.parliament;
  const successRate = ((realPhotos / imageStats.total) * 100).toFixed(1);

  console.log('==================================================');
  console.log(`📊 Total MPs: ${imageStats.total}`);
  console.log(`📊 IMAGE SOURCE BREAKDOWN:`);
  console.log(`📚 Wikipedia: ${imageStats.wikipedia} (${((imageStats.wikipedia/imageStats.total)*100).toFixed(1)}%)`);
  console.log(`🔍 TheyWorkForYou: ${imageStats.theyworkforyou} (${((imageStats.theyworkforyou/imageStats.total)*100).toFixed(1)}%)`);
  console.log(`🏛️ Parliament API: ${imageStats.parliament} (${((imageStats.parliament/imageStats.total)*100).toFixed(1)}%)`);
  console.log(`🎭 Party Logos: ${imageStats.partyLogos} (${((imageStats.partyLogos/imageStats.total)*100).toFixed(1)}%)`);
  console.log(`🖼️ Placeholders: ${imageStats.placeholders} (${((imageStats.placeholders/imageStats.total)*100).toFixed(1)}%)`);
  console.log(`✅ Success Rate: ${successRate}% have real MP photos`);
  console.log('==================================================');
}

// Main execution
(async () => {
  try {
    const enhancedMPs = await updateMPPhotos();
    await generateImageReport(enhancedMPs);
    console.log('\n🎉 ENHANCED MP PHOTO UPDATE COMPLETE!');
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
})();
