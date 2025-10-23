// Analyze what content we're missing by doing raw Archive.org searches
const ArchiveVideoFinder = require('./index.js');

async function analyzeMissingContent() {
    console.log('🔍 Analyzing missing content with raw Archive.org searches...\n');

    const finder = new ArchiveVideoFinder();

    // Millennial-friendly search terms for edgy/absurdist humor
    const millennialSearches = [
        'vine compilation',
        'tiktok funny',
        'meme compilation',
        'youtube poop',
        'ytp',
        'absurdist humor',
        'ironic content',
        'cringe comedy',
        'dark humor',
        'shock value',
        'dank memes',
        'weird internet',
        'viral videos',
        'reaction video',
        'fail compilation',
        'shitposting',
        'surreal humor',
        'anti-humor',
        'post-ironic'
    ];

    // Specific edgy internet culture searches
    const edgySearches = [
        '4chan compilation',
        'reddit funny',
        '4am',
        'deep fried memes',
        'ironic memes',
        'cursed images',
        'unstable memes',
        'wholesome memes'
    ];

    console.log('=== TESTING MILLENNIAL HUMOR SEARCHES ===\n');

    for (const searchTerm of millennialSearches.slice(0, 8)) { // Test first 8
        console.log(`Searching for: "${searchTerm}"`);

        try {
            const results = await finder.searchArchive(
                `"${searchTerm}" AND mediatype:(movies OR opensource_movies)`,
                [], 10, 'downloads desc'
            );

            console.log(`Found ${results.length} results:`);
            for (const item of results.slice(0, 3)) {
                const wouldKeep = finder.isPubliclyAvailable(item);
                console.log(`  ${wouldKeep ? '✅' : '❌'} "${item.title}" (${item.downloads?.toLocaleString() || 0} downloads)`);
            }
            console.log('');
        } catch (error) {
            console.log(`  Error: ${error.message}`);
        }

        // Small delay between searches
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n=== TESTING EDGY INTERNET CULTURE SEARCHES ===\n');

    for (const searchTerm of edgySearches.slice(0, 5)) { // Test first 5
        console.log(`Searching for: "${searchTerm}"`);

        try {
            const results = await finder.searchArchive(
                `"${searchTerm}" AND mediatype:(movies OR opensource_movies)`,
                [], 10, 'downloads desc'
            );

            console.log(`Found ${results.length} results:`);
            for (const item of results.slice(0, 3)) {
                const wouldKeep = finder.isPubliclyAvailable(item);
                console.log(`  ${wouldKeep ? '✅' : '❌'} "${item.title}" (${item.downloads?.toLocaleString() || 0} downloads)`);
            }
            console.log('');
        } catch (error) {
            console.log(`  Error: ${error.message}`);
        }

        // Small delay between searches
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n=== ANALYSIS COMPLETE ===');
    console.log('Review the results above to see what edgy/millennial content exists vs what our filters allow.');
}

analyzeMissingContent().catch(console.error);