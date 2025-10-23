#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ArchiveVideoFinder = require('./index.js');

class StreamingVideoFinder {
    constructor() {
        this.finder = new ArchiveVideoFinder();
        this.outputDir = './continuous_output';
        this.jsonFile = path.join(this.outputDir, 'videos_stream.json');
        this.csvFile = path.join(this.outputDir, 'videos_stream.csv');
        this.processedCount = 0;
        this.startTime = Date.now();

        // Create output directory
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir);
        }

        // Initialize files with headers
        this.initializeFiles();
    }

    initializeFiles() {
        // Initialize JSON file
        fs.writeFileSync(this.jsonFile, JSON.stringify({
            generated: new Date().toISOString(),
            videos: []
        }, null, 2));

        // Initialize CSV file with headers - COMPREHENSIVE: Shows ALL individual videos
        const csvHeaders = [
            'Resource Title', 'Episode/Video Name', 'Category', 'Creator', 'Date', 'Downloads',
            'Video Format', 'File Size', 'Direct Link', 'Archive URL', 'License'
        ];
        fs.writeFileSync(this.csvFile, csvHeaders.join(',') + '\n');

        console.log(`📁 Output initialized in: ${this.outputDir}`);
        console.log(`📄 JSON file: ${this.jsonFile}`);
        console.log(`📄 CSV file: ${this.csvFile}`);
    }

    outputVideo(video) {
        this.processedCount++;

        // Output to console
        console.log(`\n🎬 VIDEO #${this.processedCount}: ${video.title}`);
        console.log(`   Category: ${video.category}`);
        console.log(`   Creator: ${video.creator}`);
        console.log(`   Downloads: ${video.downloads}`);
        console.log(`   Best quality: ${video.videoFiles[0]?.format || 'Unknown'}`);
        console.log(`   Direct link: ${video.videoFiles[0]?.directLink || 'No link'}`);
        console.log(`   License: ${video.license}`);

        // Append to JSON file
        try {
            const existingData = JSON.parse(fs.readFileSync(this.jsonFile, 'utf8'));
            existingData.videos.push(video);
            existingData.totalVideos = existingData.videos.length;
            existingData.lastUpdated = new Date().toISOString();
            fs.writeFileSync(this.jsonFile, JSON.stringify(existingData, null, 2));
        } catch (error) {
            console.error('Error appending to JSON:', error.message);
        }

        // Append to CSV file - COMPREHENSIVE: Shows ALL individual videos
        try {
            video.videoFiles.forEach((videoFile, index) => {
                const csvRow = [
                    `"${String(video.title || '').replace(/"/g, '""')}"`,
                    `"${String(videoFile.name || '').replace(/"/g, '""')}"`,
                    video.category,
                    `"${String(video.creator || '').replace(/"/g, '""')}"`,
                    video.date || '',
                    video.downloads || 0,
                    videoFile.format || '',
                    videoFile.size || 0,
                    videoFile.directLink || '',
                    video.archiveURL,
                    video.license || ''
                ];
                fs.appendFileSync(this.csvFile, csvRow.join(',') + '\n');
            });
        } catch (error) {
            console.error('Error appending to CSV:', error.message);
        }

        // Progress update every 10 videos
        if (this.processedCount % 10 === 0) {
            const elapsed = Math.round((Date.now() - this.startTime) / 1000 / 60);
            const rate = (this.processedCount / elapsed).toFixed(1);
            console.log(`\n📊 Progress: ${this.processedCount} videos processed (${rate} videos/minute) - Time elapsed: ${elapsed} minutes`);
        }
    }

    async runContinuousSearch() {
        console.log('🚀 STARTING CONTINUOUS ARCHIVE.ORG VIDEO SEARCH');
        console.log('Videos will be output AS THEY ARE FOUND!\n');

        // Handle graceful shutdown
        process.on('SIGINT', () => {
            console.log('\n\n⚠️  Search interrupted by user');
            console.log(`📁 Total videos saved: ${this.processedCount}`);
            console.log(`💾 Results are continuously saved in: ${this.outputDir}`);
            process.exit(0);
        });

        try {
            // Run search with continuous output callback
            await this.finder.findAllVideos((video) => this.outputVideo(video));

            // Final summary
            const totalTime = Math.round((Date.now() - this.startTime) / 1000 / 60);
            console.log('\n🎉 SEARCH COMPLETED!');
            console.log(`⏱️  Total time: ${totalTime} minutes`);
            console.log(`📁 Total videos found and saved: ${this.processedCount}`);
            console.log(`📁 Final results in: ${this.outputDir}`);

        } catch (error) {
            console.error('\n❌ Error during search:', error);
            console.log(`💾 Partial results saved: ${this.processedCount} videos in ${this.outputDir}`);
            process.exit(1);
        }
    }
}

// Run the continuous search
const continuousFinder = new StreamingVideoFinder();
continuousFinder.runContinuousSearch();