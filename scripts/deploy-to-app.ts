#!/usr/bin/env node

/**
 * Deploy Generated Data to Main Application
 * 
 * This script copies the best generated data to the main application
 * for use in the web interface.
 */

import fs from 'fs/promises';
import path from 'path';

async function deployDataToApp() {
  console.log('🚀 Deploying generated data to main application...');
  
  try {
    // Source paths (from generated data)
    const sourceMPs = './data/complete-parliament-data/mps-active-only.json';
    const sourceStats = './data/complete-parliament-data/mp-statistics-complete.json';
    
    // Destination paths (main app)
    const destMPs = '../public/data/mps.json';
    const destStats = '../public/data/mp-statistics.json';
    
    // Copy active MPs to main app
    console.log('📄 Copying active MPs data...');
    const mpsData = await fs.readFile(sourceMPs, 'utf8');
    await fs.writeFile(destMPs, mpsData);
    console.log(`✅ Copied active MPs to ${destMPs}`);
    
    // Copy statistics
    console.log('📊 Copying statistics...');
    const statsData = await fs.readFile(sourceStats, 'utf8');
    await fs.writeFile(destStats, statsData);
    console.log(`✅ Copied statistics to ${destStats}`);
    
    // Update the main app's MP data with our enhanced structure
    console.log('🔄 Updating main application data structure...');
    const mps = JSON.parse(mpsData);
    
    // Create a summary for the main app
    const appSummary = {
      totalMPs: mps.length,
      lastUpdated: new Date().toISOString(),
      dataSource: 'UK Parliament Members API',
      version: '1.0.0',
      description: 'Active UK MPs with complete postcode coverage'
    };
    
    await fs.writeFile('../public/data/app-summary.json', JSON.stringify(appSummary, null, 2));
    console.log('✅ Created app summary file');
    
    console.log('\n🎉 Data deployment complete!');
    console.log(`📊 Deployed ${mps.length} active MPs to main application`);
    console.log('🌐 Web application now has the latest MP data');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

// Run deployment
deployDataToApp();
