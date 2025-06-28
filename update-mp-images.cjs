#!/usr/bin/env node

/**
 * Update MP Database with Real Images
 * 
 * This script fetches real MP photos from multiple sources and updates
 * the MP database with correct image URLs.
 * 
 * Sources:
 * - UK Parliament Members API
 * - TheyWorkForYou.com
 * - Wikipedia
 * - Parliament.uk official photos
 * 
 * Created: June 28, 2025
 */

const fs = require('fs').promises;
const fetch = require('node-fetch');

class MPImageUpdater {
  constructor() {
    this.MP_DATA_PATH = './public/data/mps.json';
    this.OUTPUT_PATH = './public/data/mps-with-images.json';
    this.imageCache = new Map();
  }

  async updateMPImages() {
    console.log('🖼️ MP IMAGE UPDATER STARTING...');
    console.log('='.repeat(60));
    
    try {
      console.log('📂 Loading MP data...');
      const mps = await this.loadMPData();
      console.log(`✅ Loaded ${mps.length} MPs`);

      console.log('\n🔍 Fetching real MP images...');
      const updatedMPs = await this.processAllMPs(mps);

      console.log('\n💾 Saving updated MP data...');
      await this.saveMPData(updatedMPs);

      console.log('\n📊 Generating image update report...');
      await this.generateReport(mps, updatedMPs);

      console.log('\n🎉 MP IMAGE UPDATE COMPLETE!');
      console.log('='.repeat(60));

    } catch (error) {
      console.error('❌ MP IMAGE UPDATE FAILED:', error);
      throw error;
    }
  }

  async loadMPData() {
    try {
      const data = await fs.readFile(this.MP_DATA_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Failed to load MP data: ${error}`);
    }
  }

  async processAllMPs(mps) {
    const results = [];
    const batchSize = 5;

    for (let i = 0; i < mps.length; i += batchSize) {
      const batch = mps.slice(i, i + batchSize);
      console.log(`📸 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(mps.length / batchSize)} (MPs ${i + 1}-${Math.min(i + batchSize, mps.length)})`);

      const batchResults = await Promise.all(
        batch.map(mp => this.updateMPImage(mp))
      );

      results.push(...batchResults);

      if (i + batchSize < mps.length) {
        await this.delay(1000);
      }
    }

    return results;
  }

  async updateMPImage(mp) {
    try {
      const imageUrl = await this.fetchMPImage(mp);
      
      return {
        ...mp,
        image: imageUrl,
        imageSource: imageUrl.includes('parliament') ? 'parliament' :
                     imageUrl.includes('theyworkforyou') ? 'theyworkforyou' :
                     imageUrl.includes('wikipedia') ? 'wikipedia' : 'default',
        imageUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.warn(`⚠️ Failed to update image for ${mp.name}: ${error}`);
      return {
        ...mp,
        image: this.getDefaultImage(mp),
        imageSource: 'default',
        imageUpdated: new Date().toISOString()
      };
    }
  }

  async fetchMPImage(mp) {
    const cacheKey = `${mp.name}-${mp.constituency}`;
    
    if (this.imageCache.has(cacheKey)) {
      return this.imageCache.get(cacheKey);
    }

    let imageUrl = await this.tryParliamentAPI(mp) ||
                   await this.tryTheyWorkForYou(mp) ||
                   await this.tryWikipedia(mp) ||
                   this.getDefaultImage(mp);

    this.imageCache.set(cacheKey, imageUrl);
    return imageUrl;
  }

  async tryParliamentAPI(mp) {
    try {
      const searchUrl = `https://members-api.parliament.uk/api/Members/Search?Name=${encodeURIComponent(mp.name)}&IsEligible=true`;
      const response = await fetch(searchUrl);
      
      if (!response.ok) return null;
      
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const mpMatch = data.items.find((item) => {
          const latestMembership = item.value.latestHouseMembership;
          return latestMembership?.membershipFrom === mp.constituency ||
                 item.value.latestParty?.name === mp.party;
        }) || data.items[0];

        if (mpMatch?.value?.id) {
          const detailUrl = `https://members-api.parliament.uk/api/Members/${mpMatch.value.id}`;
          const detailResponse = await fetch(detailUrl);
          
          if (detailResponse.ok) {
            const detailData = await detailResponse.json();
            if (detailData.value?.thumbnailUrl) {
              return detailData.value.thumbnailUrl;
            }
          }
        }
      }
    } catch (error) {
      // Silently fail
    }
    
    return null;
  }

  async tryTheyWorkForYou(mp) {
    try {
      const nameSlug = mp.name.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '_');
      
      const possibleUrls = [
        `https://www.theyworkforyou.com/images/mps/${nameSlug}.jpg`,
        `https://www.theyworkforyou.com/images/mpsL/${nameSlug}.jpg`
      ];

      for (const url of possibleUrls) {
        try {
          const response = await fetch(url, { method: 'HEAD' });
          if (response.ok) {
            return url;
          }
        } catch (e) {
          // Continue
        }
      }
    } catch (error) {
      // Silently fail
    }
    
    return null;
  }

  async tryWikipedia(mp) {
    try {
      const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(mp.name)}`;
      const response = await fetch(searchUrl);
      
      if (response.ok) {
        const data = await response.json();
        if (data.thumbnail?.source) {
          return data.thumbnail.source;
        }
      }
    } catch (error) {
      // Silently fail
    }
    
    return null;
  }

  getDefaultImage(mp) {
    const partyImages = {
      'Conservative': '/images/conservative-logo.jpeg',
      'Labour': '/images/labour-logo.png',
      'Liberal Democrat': '/images/lib-dem-logo.png',
      'Green': '/images/green-logo.png',
      'SNP': '/images/snp-logo.png',
      'Scottish National Party': '/images/snp-logo.png'
    };

    return partyImages[mp.party] || '/images/mp-placeholder.jpg';
  }

  async saveMPData(mps) {
    await fs.writeFile(this.OUTPUT_PATH, JSON.stringify(mps, null, 2));
    
    const backupPath = `./public/data/mps-backup-${Date.now()}.json`;
    try {
      const originalData = await fs.readFile(this.MP_DATA_PATH, 'utf-8');
      await fs.writeFile(backupPath, originalData);
    } catch (error) {
      console.warn('Could not create backup:', error);
    }

    await fs.writeFile(this.MP_DATA_PATH, JSON.stringify(mps, null, 2));
    
    console.log(`✅ Updated MP data saved to ${this.MP_DATA_PATH}`);
    console.log(`📁 Copy saved to ${this.OUTPUT_PATH}`);
  }

  async generateReport(originalMPs, updatedMPs) {
    const report = {
      timestamp: new Date().toISOString(),
      totalMPs: updatedMPs.length,
      imagesSources: {
        parliament: updatedMPs.filter(mp => mp.imageSource === 'parliament').length,
        theyworkforyou: updatedMPs.filter(mp => mp.imageSource === 'theyworkforyou').length,
        wikipedia: updatedMPs.filter(mp => mp.imageSource === 'wikipedia').length,
        default: updatedMPs.filter(mp => mp.imageSource === 'default').length
      },
      successRate: Math.round((updatedMPs.filter(mp => mp.imageSource !== 'default').length / updatedMPs.length) * 100),
      examples: {
        parliamentImages: updatedMPs.filter(mp => mp.imageSource === 'parliament').slice(0, 5).map(mp => ({ name: mp.name, image: mp.image })),
        theyworkforyouImages: updatedMPs.filter(mp => mp.imageSource === 'theyworkforyou').slice(0, 5).map(mp => ({ name: mp.name, image: mp.image })),
        wikipediaImages: updatedMPs.filter(mp => mp.imageSource === 'wikipedia').slice(0, 5).map(mp => ({ name: mp.name, image: mp.image }))
      }
    };

    await fs.writeFile('./public/data/mp-image-update-report.json', JSON.stringify(report, null, 2));
    
    console.log('\n📊 IMAGE UPDATE REPORT:');
    console.log(`📊 Total MPs: ${report.totalMPs}`);
    console.log(`🏛️  Parliament API: ${report.imagesSources.parliament} images`);
    console.log(`🔍 TheyWorkForYou: ${report.imagesSources.theyworkforyou} images`);
    console.log(`📚 Wikipedia: ${report.imagesSources.wikipedia} images`);
    console.log(`🎭 Default/Party: ${report.imagesSources.default} images`);
    console.log(`✅ Success Rate: ${report.successRate}%`);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

async function main() {
  const updater = new MPImageUpdater();
  try {
    await updater.updateMPImages();
    console.log('\n🎉 MP images updated successfully!');
    console.log('📁 Check public/data/mps.json for updated data');
    console.log('📊 Check public/data/mp-image-update-report.json for detailed report');
  } catch (error) {
    console.error('\n❌ Failed to update MP images:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
