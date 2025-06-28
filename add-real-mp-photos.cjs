#!/usr/bin/env node

/**
 * Get Real MP Photos - Final Attempt
 * 
 * This script manually adds real MP photos for the most prominent MPs
 * and provides better fallbacks for the rest.
 */

const fs = require('fs').promises;

async function addRealMPPhotos() {
  console.log('📸 ADDING REAL MP PHOTOS...');
  console.log('='.repeat(50));
  
  try {
    const data = await fs.readFile('./public/data/mps-fixed-images.json', 'utf-8');
    const mps = JSON.parse(data);
    
    // Manual mapping of prominent MPs to their real photos
    const realMPPhotos = {
      'Sir Keir Starmer': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Official_portrait_of_Rt_Hon_Sir_Keir_Starmer_KCB_QC_MP.jpg/220px-Official_portrait_of_Rt_Hon_Sir_Keir_Starmer_KCB_QC_MP.jpg',
      'Rishi Sunak': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Official_portrait_of_Rishi_Sunak_%28cropped%29.jpg/220px-Official_portrait_of_Rishi_Sunak_%28cropped%29.jpg',
      'Boris Johnson': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Boris_Johnson_official_portrait_%28cropped%29.jpg/220px-Boris_Johnson_official_portrait_%28cropped%29.jpg',
      'Theresa May': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Theresa_May_Downing_Street_%28cropped%29.jpg/220px-Theresa_May_Downing_Street_%28cropped%29.jpg',
      'Jeremy Corbyn': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Jeremy_Corbyn%2C_Leader_of_the_Labour_Party_%28UK%29_%28cropped%29.jpg/220px-Jeremy_Corbyn%2C_Leader_of_the_Labour_Party_%28UK%29_%28cropped%29.jpg',
      'Angela Rayner': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Official_portrait_of_Angela_Rayner_MP_%28cropped%29.jpg/220px-Official_portrait_of_Angela_Rayner_MP_%28cropped%29.jpg',
      'Rachel Reeves': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Official_portrait_of_Rachel_Reeves_MP_%28cropped%29.jpg/220px-Official_portrait_of_Rachel_Reeves_MP_%28cropped%29.jpg',
      'David Lammy': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Official_portrait_of_Rt_Hon_David_Lammy_MP_%28cropped%29.jpg/220px-Official_portrait_of_Rt_Hon_David_Lammy_MP_%28cropped%29.jpg',
      'Wes Streeting': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Official_portrait_of_Wes_Streeting_MP_%28cropped%29.jpg/220px-Official_portrait_of_Wes_Streeting_MP_%28cropped%29.jpg',
      'Liz Truss': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Official_portrait_of_Elizabeth_Truss_%28cropped%29.jpg/220px-Official_portrait_of_Elizabeth_Truss_%28cropped%29.jpg',
      'Matt Hancock': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Official_portrait_of_Matt_Hancock_MP_%28cropped%29.jpg/220px-Official_portrait_of_Matt_Hancock_MP_%28cropped%29.jpg',
      'Jacob Rees-Mogg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Official_portrait_of_Mr_Jacob_Rees-Mogg_MP_%28cropped%29.jpg/220px-Official_portrait_of_Mr_Jacob_Rees-Mogg_MP_%28cropped%29.jpg',
      'Priti Patel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Official_portrait_of_Priti_Patel_MP_%28cropped%29.jpg/220px-Official_portrait_of_Priti_Patel_MP_%28cropped%29.jpg',
      'Sajid Javid': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Official_portrait_of_Sajid_Javid_MP_%28cropped%29.jpg/220px-Official_portrait_of_Sajid_Javid_MP_%28cropped%29.jpg',
      'Diane Abbott': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Official_portrait_of_Ms_Diane_Abbott_MP_%28cropped%29.jpg/220px-Official_portrait_of_Ms_Diane_Abbott_MP_%28cropped%29.jpg',
      'John McDonnell': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Official_portrait_of_John_McDonnell_MP_%28cropped%29.jpg/220px-Official_portrait_of_John_McDonnell_MP_%28cropped%29.jpg',
      'Ed Miliband': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Official_portrait_of_Rt_Hon_Edward_Miliband_MP_%28cropped%29.jpg/220px-Official_portrait_of_Rt_Hon_Edward_Miliband_MP_%28cropped%29.jpg',
      'Yvette Cooper': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Official_portrait_of_Rt_Hon_Yvette_Cooper_MP_%28cropped%29.jpg/220px-Official_portrait_of_Rt_Hon_Yvette_Cooper_MP_%28cropped%29.jpg',
      'Hilary Benn': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Official_portrait_of_Rt_Hon_Hilary_Benn_MP_%28cropped%29.jpg/220px-Official_portrait_of_Rt_Hon_Hilary_Benn_MP_%28cropped%29.jpg',
      'Stephen Flynn': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Official_portrait_of_Stephen_Flynn_MP_%28cropped%29.jpg/220px-Official_portrait_of_Stephen_Flynn_MP_%28cropped%29.jpg',
      'Ian Blackford': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Official_portrait_of_Ian_Blackford_MP_%28cropped%29.jpg/220px-Official_portrait_of_Ian_Blackford_MP_%28cropped%29.jpg',
      'Nicola Sturgeon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Nicola_Sturgeon_2014_%28cropped%29.jpg/220px-Nicola_Sturgeon_2014_%28cropped%29.jpg'
    };
    
    let realPhotosAdded = 0;
    
    // Update MPs with real photos
    const updatedMPs = mps.map(mp => {
      // Try exact name match first
      let realPhotoUrl = realMPPhotos[mp.name];
      
      // Try partial matches for names with titles
      if (!realPhotoUrl) {
        for (const [photoName, photoUrl] of Object.entries(realMPPhotos)) {
          // Remove common titles and check if names match
          const cleanMPName = mp.name.replace(/^(Sir|Dame|Dr|Mr|Mrs|Ms|Lord|Lady|Rt Hon)\s+/i, '').trim();
          const cleanPhotoName = photoName.replace(/^(Sir|Dame|Dr|Mr|Mrs|Ms|Lord|Lady|Rt Hon)\s+/i, '').trim();
          
          if (cleanMPName.includes(cleanPhotoName) || cleanPhotoName.includes(cleanMPName)) {
            realPhotoUrl = photoUrl;
            break;
          }
        }
      }
      
      if (realPhotoUrl) {
        realPhotosAdded++;
        return {
          ...mp,
          image: realPhotoUrl,
          imageSource: 'wikipedia-real',
          imageUpdated: new Date().toISOString()
        };
      }
      
      return mp;
    });
    
    // Save the final version
    await fs.writeFile('./public/data/mps-final-images.json', JSON.stringify(updatedMPs, null, 2));
    
    console.log(`✅ Added ${realPhotosAdded} real MP photos`);
    console.log(`📊 Total MPs with real photos: ${realPhotosAdded}/${mps.length}`);
    
    // Show which MPs got real photos
    const mpsWithRealPhotos = updatedMPs.filter(mp => mp.imageSource === 'wikipedia-real');
    if (mpsWithRealPhotos.length > 0) {
      console.log('\n📸 Real photos added for:');
      mpsWithRealPhotos.forEach(mp => {
        console.log(`   ✅ ${mp.name} (${mp.party})`);
      });
    }
    
    // Final statistics
    const finalStats = {
      realPhotos: updatedMPs.filter(mp => mp.imageSource === 'wikipedia-real').length,
      partyLogos: updatedMPs.filter(mp => mp.imageSource === 'wikipedia' || mp.imageSource === 'party').length,
      placeholders: updatedMPs.filter(mp => mp.imageSource === 'placeholder').length
    };
    
    console.log('\n📊 FINAL IMAGE STATISTICS:');
    console.log(`📸 Real MP Photos: ${finalStats.realPhotos} (${Math.round((finalStats.realPhotos / updatedMPs.length) * 100)}%)`);
    console.log(`🎭 Quality Party Logos: ${finalStats.partyLogos} (${Math.round((finalStats.partyLogos / updatedMPs.length) * 100)}%)`);
    console.log(`🖼️  Generic Placeholders: ${finalStats.placeholders} (${Math.round((finalStats.placeholders / updatedMPs.length) * 100)}%)`);
    
    const totalGoodImages = finalStats.realPhotos + finalStats.partyLogos;
    console.log(`🏆 Total Professional Images: ${totalGoodImages}/${updatedMPs.length} (${Math.round((totalGoodImages / updatedMPs.length) * 100)}%)`);
    
    console.log('\n💾 Final data saved to mps-final-images.json');
    console.log('🎉 MP PHOTO UPDATE COMPLETE!');
    
  } catch (error) {
    console.error('❌ Failed to add real MP photos:', error);
  }
}

addRealMPPhotos();
