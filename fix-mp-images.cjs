#!/usr/bin/env node

/**
 * Fix MP Images with Better Sources
 * 
 * This script uses more reliable image sources and fallback strategies
 * to get real MP photos.
 */

const fs = require('fs').promises;
const fetch = require('node-fetch');

async function fixMPImages() {
  console.log('🖼️ FIXING MP IMAGES WITH BETTER SOURCES...');
  console.log('='.repeat(60));
  
  try {
    const data = await fs.readFile('./public/data/mps.json', 'utf-8');
    const mps = JSON.parse(data);
    
    console.log(`📊 Processing ${mps.length} MPs`);
    
    // Let's try a different approach - use known working image patterns
    const updatedMPs = await Promise.all(mps.map(async (mp, index) => {
      if (index % 50 === 0) {
        console.log(`📸 Processing MP ${index + 1}/${mps.length}: ${mp.name}`);
      }
      
      let imageUrl = await getWorkingImageUrl(mp);
      
      return {
        ...mp,
        image: imageUrl,
        imageSource: imageUrl.includes('parliament') ? 'parliament' :
                     imageUrl.includes('theyworkforyou') ? 'theyworkforyou' :
                     imageUrl.includes('wikipedia') ? 'wikipedia' :
                     imageUrl.includes('logo') ? 'party' : 'placeholder',
        imageUpdated: new Date().toISOString()
      };
    }));
    
    // Save the updated data
    await fs.writeFile('./public/data/mps-fixed-images.json', JSON.stringify(updatedMPs, null, 2));
    
    // Generate report
    const imageSources = {
      parliament: updatedMPs.filter(mp => mp.imageSource === 'parliament').length,
      theyworkforyou: updatedMPs.filter(mp => mp.imageSource === 'theyworkforyou').length,
      wikipedia: updatedMPs.filter(mp => mp.imageSource === 'wikipedia').length,
      party: updatedMPs.filter(mp => mp.imageSource === 'party').length,
      placeholder: updatedMPs.filter(mp => mp.imageSource === 'placeholder').length
    };
    
    console.log('\n📊 UPDATED IMAGE SOURCES:');
    console.log(`🏛️  Parliament API: ${imageSources.parliament}`);
    console.log(`🔍 TheyWorkForYou: ${imageSources.theyworkforyou}`);
    console.log(`📚 Wikipedia: ${imageSources.wikipedia}`);
    console.log(`🎭 Party Logos: ${imageSources.party}`);
    console.log(`🖼️  Placeholders: ${imageSources.placeholder}`);
    
    const realImages = imageSources.parliament + imageSources.theyworkforyou + imageSources.wikipedia;
    console.log(`✅ Real photos: ${realImages}/${updatedMPs.length} (${Math.round((realImages / updatedMPs.length) * 100)}%)`);
    
    // Show some examples of real images found
    const realImageExamples = updatedMPs.filter(mp => 
      mp.imageSource === 'parliament' || mp.imageSource === 'theyworkforyou' || mp.imageSource === 'wikipedia'
    ).slice(0, 10);
    
    if (realImageExamples.length > 0) {
      console.log('\n✅ Real images found for:');
      realImageExamples.forEach(mp => {
        console.log(`   ${mp.name} (${mp.party}): ${mp.image}`);
      });
    }
    
    console.log('\n💾 Updated data saved to mps-fixed-images.json');
    console.log('🎉 IMAGE FIX COMPLETE!');
    
  } catch (error) {
    console.error('❌ Failed to fix MP images:', error);
  }
}

async function getWorkingImageUrl(mp) {
  // Try multiple specific approaches for real MP images
  
  // 1. Try official Parliament API with different ID patterns
  const parliamentUrls = [
    `https://members-api.parliament.uk/api/Members/${mp.parliamentId}/Thumbnail`,
    `https://members-api.parliament.uk/api/Members/${mp.id}/Thumbnail`,
    `https://www.parliament.uk/mps-lords-and-offices/mps/${mp.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}/portrait/`,
  ];
  
  for (const url of parliamentUrls) {
    try {
      const response = await fetch(url, { method: 'HEAD', timeout: 5000 });
      if (response.ok && response.headers.get('content-type')?.startsWith('image/')) {
        return url;
      }
    } catch (e) {
      // Continue to next
    }
  }
  
  // 2. Try Wikipedia with exact name matching
  try {
    const wikiResponse = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(mp.name)}`,
      { timeout: 5000 }
    );
    
    if (wikiResponse.ok) {
      const wikiData = await wikiResponse.json();
      if (wikiData.thumbnail?.source && wikiData.thumbnail.source.includes('upload.wikimedia.org')) {
        return wikiData.thumbnail.source;
      }
    }
  } catch (e) {
    // Continue
  }
  
  // 3. Try some common MP image patterns
  const nameSlug = mp.name.toLowerCase()
    .replace(/\b(sir|dame|dr|mr|mrs|ms|lord|lady)\b/g, '')
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');
  
  const commonUrls = [
    `https://www.theyworkforyou.com/images/mps/${nameSlug}.jpg`,
    `https://www.theyworkforyou.com/images/mpsL/${nameSlug}.jpg`,
    `https://www.parliament.uk/globalassets/mps-lords/members-images/${nameSlug}.jpg`,
  ];
  
  for (const url of commonUrls) {
    try {
      const response = await fetch(url, { method: 'HEAD', timeout: 5000 });
      if (response.ok) {
        return url;
      }
    } catch (e) {
      // Continue
    }
  }
  
  // 4. Fallback to better party logos or generic
  const betterPartyImages = {
    'Conservative': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Conservative_logo_2020.svg/200px-Conservative_logo_2020.svg.png',
    'Labour': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Labour_Party_%28UK%29_logo.svg/200px-Labour_Party_%28UK%29_logo.svg.png',
    'Liberal Democrat': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Liberal_Democrats_logo_bird_of_liberty.svg/200px-Liberal_Democrats_logo_bird_of_liberty.svg.png',
    'Green': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Green_Party_of_England_and_Wales_logo.svg/200px-Green_Party_of_England_and_Wales_logo.svg.png',
    'SNP': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/SNP_logo.svg/200px-SNP_logo.svg.png',
    'Scottish National Party': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/SNP_logo.svg/200px-SNP_logo.svg.png'
  };
  
  return betterPartyImages[mp.party] || '/images/mp-placeholder.jpg';
}

// Small delay helper
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

fixMPImages();
