#!/usr/bin/env node

const ArchiveVideoFinder = require('./index.js');

console.log('🚀 STARTING COMPREHENSIVE ARCHIVE.ORG VIDEO SEARCH');
console.log('This will search using multiple strategies for MAXIMUM coverage');
console.log('This may take several hours to complete...\n');

const finder = new ArchiveVideoFinder();

// Add progress tracking
const originalGetItemMetadata = finder.getItemMetadata.bind(finder);
let processedCount = 0;
let totalCount = 0;

finder.getItemMetadata = async function(identifier) {
    processedCount++;
    if (processedCount % 100 === 0) {
        console.log(`📊 Processed ${processedCount}/${totalCount} items...`);
    }
    return originalGetItemMetadata(identifier);
};

// Override processSearchResults to count total items
const originalProcessSearchResults = finder.processSearchResults.bind(finder);
finder.processSearchResults = async function(results, category) {
    totalCount += results.length;
    console.log(`🔍 Found ${results.length} ${category} videos to process (total so far: ${totalCount})`);
    return originalProcessSearchResults(results, category);
};

// Main execution with error handling
async function runExhaustive() {
    const startTime = Date.now();
    let processedCount = 0;

    // Continuous output callback
    const outputCallback = (video) => {
        processedCount++;
        console.log(`\n🎬 VIDEO #${processedCount}: ${video.title}`);
        console.log(`   Category: ${video.category} | Downloads: ${video.downloads} | Best format: ${video.videoFiles[0]?.format || 'Unknown'}`);
        console.log(`   Direct link: ${video.videoFiles[0]?.directLink || 'No link'}`);
    };

    try {
        await finder.findAllVideos(outputCallback);

        const endTime = Date.now();
        const duration = Math.round((endTime - startTime) / 1000 / 60);

        finder.saveToFile('all_archive_videos.json');
        finder.saveToCSV('all_archive_videos.csv');

        console.log('\n🎉 EXHAUSTIVE SEARCH COMPLETED!');
        console.log(`⏱️  Total time: ${duration} minutes`);
        console.log(`📁 Total videos found: ${finder.videoList.length} (${processedCount} processed)`);
        console.log('📁 Results saved to:');
        console.log('   - all_archive_videos.json (complete data)');
        console.log('   - all_archive_videos.csv (spreadsheet format)');

        // Show category breakdown
        const categories = {};
        finder.videoList.forEach(video => {
            categories[video.category] = (categories[video.category] || 0) + 1;
        });

        console.log('\n📊 Video breakdown by category:');
        Object.entries(categories).forEach(([category, count]) => {
            console.log(`   ${category}: ${count} videos`);
        });

    } catch (error) {
        console.error('❌ Error during exhaustive search:', error);

        // Save partial results even if error occurred
        if (finder.videoList.length > 0) {
            finder.saveToFile('partial_archive_videos.json');
            finder.saveToCSV('partial_archive_videos.csv');
            console.log(`💾 Saved partial results: ${finder.videoList.length} videos`);
        }

        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n⚠️  Search interrupted by user');
    if (finder.videoList.length > 0) {
        finder.saveToFile('interrupted_archive_videos.json');
        finder.saveToCSV('interrupted_archive_videos.csv');
        console.log(`💾 Saved partial results: ${finder.videoList.length} videos`);
    }
    process.exit(0);
});

// Run the exhaustive search
runExhaustive();