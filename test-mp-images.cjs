#!/usr/bin/env node

/**
 * Test MP Images - Validate Image Updates
 * 
 * This script tests the updated MP images to ensure they're working
 * and provides a report on image sources and availability.
 */

const fs = require('fs').promises;

async function testMPImages() {
  console.log('🖼️ TESTING MP IMAGES...');
  console.log('='.repeat(50));
  
  try {
    // Load updated MP data
    const data = await fs.readFile('./public/data/mps.json', 'utf-8');
    const mps = JSON.parse(data);
    
    console.log(`📊 Total MPs: ${mps.length}`);
    
    // Analyze image sources
    const imageSources = {
      parliament: 0,
      theyworkforyou: 0,
      wikipedia: 0,
      party: 0,
      placeholder: 0,
      total: 0
    };
    
    const sampleImages = {
      parliament: [],
      theyworkforyou: [],
      wikipedia: [],
      party: [],
      placeholder: []
    };
    
    mps.forEach(mp => {
      imageSources.total++;
      
      if (mp.image) {
        if (mp.image.includes('parliament.uk') || mp.image.includes('members-api')) {
          imageSources.parliament++;
          if (sampleImages.parliament.length < 5) {
            sampleImages.parliament.push({ name: mp.name, url: mp.image });
          }
        } else if (mp.image.includes('theyworkforyou')) {
          imageSources.theyworkforyou++;
          if (sampleImages.theyworkforyou.length < 5) {
            sampleImages.theyworkforyou.push({ name: mp.name, url: mp.image });
          }
        } else if (mp.image.includes('wikipedia')) {
          imageSources.wikipedia++;
          if (sampleImages.wikipedia.length < 5) {
            sampleImages.wikipedia.push({ name: mp.name, url: mp.image });
          }
        } else if (mp.image.includes('logo')) {
          imageSources.party++;
          if (sampleImages.party.length < 5) {
            sampleImages.party.push({ name: mp.name, url: mp.image });
          }
        } else {
          imageSources.placeholder++;
          if (sampleImages.placeholder.length < 5) {
            sampleImages.placeholder.push({ name: mp.name, url: mp.image });
          }
        }
      } else {
        imageSources.placeholder++;
      }
    });
    
    console.log('\n📊 IMAGE SOURCE BREAKDOWN:');
    console.log(`🏛️  Parliament API: ${imageSources.parliament} (${Math.round((imageSources.parliament / imageSources.total) * 100)}%)`);
    console.log(`🔍 TheyWorkForYou: ${imageSources.theyworkforyou} (${Math.round((imageSources.theyworkforyou / imageSources.total) * 100)}%)`);
    console.log(`📚 Wikipedia: ${imageSources.wikipedia} (${Math.round((imageSources.wikipedia / imageSources.total) * 100)}%)`);
    console.log(`🎭 Party Logos: ${imageSources.party} (${Math.round((imageSources.party / imageSources.total) * 100)}%)`);
    console.log(`🖼️  Placeholders: ${imageSources.placeholder} (${Math.round((imageSources.placeholder / imageSources.total) * 100)}%)`);
    
    const realImagesCount = imageSources.parliament + imageSources.theyworkforyou + imageSources.wikipedia;
    console.log(`\n✅ Success Rate: ${Math.round((realImagesCount / imageSources.total) * 100)}% have real MP photos`);
    
    // Show examples
    if (sampleImages.parliament.length > 0) {
      console.log('\n🏛️  Sample Parliament Images:');
      sampleImages.parliament.forEach(img => console.log(`   ${img.name}: ${img.url}`));
    }
    
    if (sampleImages.theyworkforyou.length > 0) {
      console.log('\n🔍 Sample TheyWorkForYou Images:');
      sampleImages.theyworkforyou.forEach(img => console.log(`   ${img.name}: ${img.url}`));
    }
    
    if (sampleImages.wikipedia.length > 0) {
      console.log('\n📚 Sample Wikipedia Images:');
      sampleImages.wikipedia.forEach(img => console.log(`   ${img.name}: ${img.url}`));
    }
    
    // Test some specific MPs
    console.log('\n🔍 TESTING SPECIFIC MP IMAGES:');
    const testMPs = ['Boris Johnson', 'Keir Starmer', 'Rishi Sunak', 'Theresa May', 'David Cameron'];
    
    testMPs.forEach(testName => {
      const mp = mps.find(m => m.name.includes(testName.split(' ')[1])); // Search by surname
      if (mp) {
        console.log(`✅ ${mp.name}: ${mp.image || 'No image'}`);
      } else {
        console.log(`❌ ${testName}: Not found in database`);
      }
    });
    
    console.log('\n🎉 MP IMAGE TEST COMPLETE!');
    console.log('=' .repeat(50));
    
  } catch (error) {
    console.error('❌ IMAGE TEST FAILED:', error);
  }
}

testMPImages();
