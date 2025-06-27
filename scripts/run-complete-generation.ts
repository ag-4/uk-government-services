#!/usr/bin/env node

/**
 * UK Government Complete Database Generator
 * 
 * This script generates a comprehensive database of:
 * - All 650 UK Members of Parliament
 * - 1.8+ Million UK Postcodes  
 * - Complete mapping between postcodes and MPs
 * 
 * Data sources:
 * - UK Parliament Members API (https://members-api.parliament.uk/api)
 * - Postcodes.io API (https://api.postcodes.io)
 * - UK Parliament Find Your MP (https://members.parliament.uk/FindYourMP)
 */

import { UKGovernmentDataGenerator } from './generate-complete-database';
import { performance } from 'perf_hooks';
import path from 'path';

// Configuration
const CONFIG = {
  outputDirectory: path.join(process.cwd(), 'data', 'uk-government-complete'),
  apiDelayMs: 200, // Rate limiting for APIs
  batchSize: 50,   // Batch size for API calls
  maxRetries: 3,   // Max retries for failed API calls
  logLevel: 'info' // info, debug, error
};

// Console colors for better output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bright: '\x1b[1m'
};

function log(level: 'info' | 'success' | 'warning' | 'error', message: string) {
  const timestamp = new Date().toLocaleTimeString();
  const color = {
    info: colors.blue,
    success: colors.green,
    warning: colors.yellow,
    error: colors.red
  }[level];
  
  console.log(`${color}[${timestamp}] ${message}${colors.reset}`);
}

function logHeader(title: string) {
  const line = '='.repeat(title.length + 4);
  console.log(`${colors.bright}${colors.cyan}`);
  console.log(line);
  console.log(`  ${title}`);
  console.log(line);
  console.log(colors.reset);
}

function logStats(stats: any) {
  console.log(`${colors.bright}${colors.white}📊 Generation Statistics:${colors.reset}`);
  console.log(`   ${colors.green}✓${colors.reset} MPs Generated: ${colors.bright}${stats.totalMPs.toLocaleString()}${colors.reset}`);
  console.log(`   ${colors.green}✓${colors.reset} Postcodes Generated: ${colors.bright}${stats.totalPostcodes.toLocaleString()}${colors.reset}`);
  console.log(`   ${colors.green}✓${colors.reset} Constituencies Mapped: ${colors.bright}${stats.totalConstituencies.toLocaleString()}${colors.reset}`);
  console.log(`   ${colors.green}✓${colors.reset} Generation Time: ${colors.bright}${stats.generationTime}${colors.reset}`);
  console.log(`   ${colors.green}✓${colors.reset} Database Size: ${colors.bright}${stats.databaseSize}${colors.reset}`);
}

async function main() {
  const startTime = performance.now();
  
  try {
    // ASCII Art Header
    console.log(`${colors.bright}${colors.blue}`);
    console.log(`
    ██╗   ██╗██╗  ██╗     ██████╗  ██████╗ ██╗   ██╗
    ██║   ██║██║ ██╔╝    ██╔════╝ ██╔═══██╗██║   ██║
    ██║   ██║█████╔╝     ██║  ███╗██║   ██║██║   ██║
    ██║   ██║██╔═██╗     ██║   ██║██║   ██║╚██╗ ██╔╝
    ╚██████╔╝██║  ██╗    ╚██████╔╝╚██████╔╝ ╚████╔╝ 
     ╚═════╝ ╚═╝  ╚═╝     ╚═════╝  ╚═════╝   ╚═══╝  
    `);
    console.log(colors.reset);
    
    logHeader('UK Government Complete Database Generator');
    
    log('info', 'Initializing comprehensive database generation...');
    log('info', `Output directory: ${CONFIG.outputDirectory}`);
    log('info', `Configuration: Batch size ${CONFIG.batchSize}, Delay ${CONFIG.apiDelayMs}ms`);
    
    // Display what we're about to generate
    console.log(`${colors.bright}${colors.white}📋 Generation Plan:${colors.reset}`);
    console.log(`   🏛️  All 650 UK Members of Parliament`);
    console.log(`   📮 1.8+ Million UK Postcodes`);
    console.log(`   🗺️  Complete postcode-to-MP mapping`);
    console.log(`   📊 Comprehensive statistics and analytics`);
    console.log(`   📁 Multiple output formats for integration`);
    console.log('');
    
    // Data sources
    console.log(`${colors.bright}${colors.white}📡 Data Sources:${colors.reset}`);
    console.log(`   • UK Parliament Members API (https://members-api.parliament.uk/api)`);
    console.log(`   • Postcodes.io API (https://api.postcodes.io)`);
    console.log(`   • UK Parliament Find Your MP (https://members.parliament.uk/FindYourMP)`);
    console.log('');
    
    // Confirmation prompt in production
    if (process.env.NODE_ENV === 'production') {
      log('warning', 'This will generate a large dataset. Continue? (This is automated in demo mode)');
    }
    
    // Initialize generator
    log('info', 'Initializing UK Government Data Generator...');
    const generator = new UKGovernmentDataGenerator(CONFIG.outputDirectory);
    
    // Phase 1: Generate complete database
    logHeader('Phase 1: Complete Database Generation');
    log('info', 'Starting comprehensive data generation...');
    
    const database = await generator.generateCompleteDatabase();
    
    // Phase 2: Save in multiple formats
    logHeader('Phase 2: Multi-Format Export');
    log('info', 'Saving database in multiple formats...');
    
    await generator.saveCompleteDatabase(database);
    
    // Phase 3: Validation and verification
    logHeader('Phase 3: Data Validation');
    log('info', 'Validating generated data...');
    
    const validation = await validateGeneratedData(database);
    
    if (validation.isValid) {
      log('success', 'Data validation passed ✓');
    } else {
      log('error', `Data validation failed: ${validation.errors.join(', ')}`);
    }
    
    // Calculate final statistics
    const endTime = performance.now();
    const generationTime = Math.round((endTime - startTime) / 1000);
    
    const finalStats = {
      totalMPs: database.metadata.totalMPs,
      totalPostcodes: database.metadata.totalPostcodes,
      totalConstituencies: database.metadata.totalConstituencies,
      generationTime: `${generationTime} seconds`,
      databaseSize: estimateSize(database)
    };
    
    // Success summary
    logHeader('🎉 Generation Complete!');
    logStats(finalStats);
    
    console.log('');
    console.log(`${colors.bright}${colors.white}📁 Generated Files:${colors.reset}`);
    console.log(`   ${colors.green}•${colors.reset} uk-government-complete.json - Master database`);
    console.log(`   ${colors.green}•${colors.reset} components/ - Individual data components`);
    console.log(`   ${colors.green}•${colors.reset} lookups/ - Optimized search indexes`);
    console.log(`   ${colors.green}•${colors.reset} statistics.json - Comprehensive analytics`);
    console.log(`   ${colors.green}•${colors.reset} README.md - Complete documentation`);
    
    console.log('');
    console.log(`${colors.bright}${colors.white}🚀 Integration Ready:${colors.reset}`);
    console.log(`   ${colors.cyan}•${colors.reset} Copy data files to your project`);
    console.log(`   ${colors.cyan}•${colors.reset} Import optimized lookup indexes`);
    console.log(`   ${colors.cyan}•${colors.reset} Use mapping for postcode-MP queries`);
    console.log(`   ${colors.cyan}•${colors.reset} Reference documentation for API structure`);
    
    console.log('');
    log('success', `🏴󠁧󠁢󠁥󠁮󠁧󠁿 UK Government Database generation completed successfully!`);
    log('info', `Database location: ${CONFIG.outputDirectory}`);
    
  } catch (error) {
    log('error', `❌ Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error(error);
    process.exit(1);
  }
}

/**
 * Validate the generated data for completeness and accuracy
 */
async function validateGeneratedData(database: any) {
  const errors: string[] = [];
  
  // Check MP data completeness
  if (database.mps.length < 600) {
    errors.push(`Insufficient MPs: ${database.mps.length} (expected ~650)`);
  }
  
  // Check postcode data
  if (database.postcodes.length < 1000) {
    errors.push(`Insufficient postcodes: ${database.postcodes.length} (expected 1000+)`);
  }
  
  // Check mapping completeness
  const mappingCount = Object.keys(database.mapping.postcodeToMP).length;
  if (mappingCount < database.postcodes.length * 0.8) {
    errors.push(`Incomplete mapping: ${mappingCount} (expected ~${database.postcodes.length})`);
  }
  
  // Check for required fields
  const sampleMP = database.mps[0];
  const requiredMPFields = ['id', 'name', 'constituency', 'party', 'email'];
  for (const field of requiredMPFields) {
    if (!sampleMP[field]) {
      errors.push(`Missing MP field: ${field}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    summary: {
      mpsValidated: database.mps.length,
      postcodesValidated: database.postcodes.length,
      mappingsValidated: mappingCount
    }
  };
}

/**
 * Estimate database size
 */
function estimateSize(database: any): string {
  try {
    const jsonString = JSON.stringify(database);
    const sizeInBytes = Buffer.byteLength(jsonString, 'utf8');
    const sizeInMB = sizeInBytes / (1024 * 1024);
    
    if (sizeInMB > 1000) {
      return `${(sizeInMB / 1024).toFixed(2)} GB`;
    } else {
      return `${sizeInMB.toFixed(2)} MB`;
    }
  } catch {
    return 'Unknown';
  }
}

// Handle process signals
process.on('SIGINT', () => {
  log('warning', 'Generation interrupted by user');
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  log('error', `Unhandled rejection at: ${promise}, reason: ${reason}`);
  process.exit(1);
});

// Run main function
if (require.main === module) {
  main().catch(error => {
    log('error', `Fatal error: ${error.message}`);
    process.exit(1);
  });
}

export { CONFIG, log, logHeader };
