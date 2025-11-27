const fs = require('fs');
const { createWriteStream } = require('fs');

class ArchiveVideoFinder {
    constructor() {
        this.baseURL = 'https://archive.org/advancedsearch.php';
        this.metadataURL = 'https://archive.org/metadata/';
        this.videoList = [];
    }

    // Search queries for different categories - focused on millennial/tech/gaming content
    getSearchQueries() {
        return [
            // High-energy visual impact content - Simplified for better results
            {
                category: 'millennial_meme_comedy',
                query: '("dank memes" OR "vine compilation" OR "tiktok funny" OR "youtube poop" OR ytp OR "meme compilation" OR "funny compilation" OR "viral videos" OR "montage parody" OR "mlg montage" OR "shitposting" OR "ironic memes") AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // Tech culture and machinima comedy (NO gameplay/reviews)
            {
                category: 'tech_gaming_comedy',
                query: '(machinima OR "red vs blue" OR "rooster teeth" OR "achievement hunter" OR "tech support" OR "it crowd" OR programming OR hacking OR coding) AND (funny OR comedy OR parody OR satire OR hilarious) AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // Dark/edgy internet comedy
            {
                category: 'dark_edgy_comedy',
                query: '(("dark humor" OR "black comedy" OR "offensive humor" OR shock OR controversial OR "4chan" OR reddit OR liveleak) AND (funny OR comedy OR compilation OR parody)) AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // Modern adult animation
            {
                category: 'adult_animation',
                query: '("ren and stimpy" OR "beavis and butthead" OR "south park" OR "family guy" OR "american dad" OR "the simpsons" OR "boondocks" OR "hazbin hotel" OR "king of the hill") AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // Modern sitcoms and comedy series - more specific
            {
                category: 'modern_sitcoms',
                query: '("the office" OR "parks and recreation" OR community OR "arrested development" OR "it\'s always sunny" OR "brooklyn nine nine") AND (complete OR series OR episodes OR compilation) AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // Lost/archived internet content
            {
                category: 'lost_internet_content',
                query: '("lost youtube" OR "deleted youtube" OR "archived youtube" OR "lost media" OR "deleted scenes" OR "internet archive") AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // Anime and modern animation
            {
                category: 'modern_anime',
                query: '(anime OR "dragon ball" OR dragonball OR digimon OR "x-men" OR xmen OR spiderman OR "spider-man" OR "final space" OR spongebob) AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // Viral and reaction content
            {
                category: 'viral_reaction',
                query: '(viral OR reaction OR "cringe comedy" OR "fail compilation" OR "funny moments" OR "best of" OR compilation) AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // Modern comedy films (millennial-friendly)
            {
                category: 'modern_comedy_films',
                query: '(("comedy film" OR "comedy movie" OR "dark comedy" OR "black comedy") AND (2000..2025 OR modern OR contemporary OR indie OR "independent film")) AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // Missing content: MLG/Pro gaming compilations and memes
            {
                category: 'mlg_gaming_memes',
                query: '("mlg compilation" OR "best mlg" OR "gaming memes" OR "funny gaming" OR "pro compilation") AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // Missing content: General funny compilations
            {
                category: 'funny_compilations',
                query: '("funny compilation" OR "funny moments" OR "funny videos" OR "comedy compilation") AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // Weird internet and experimental content (deep internet stuff)
            {
                category: 'weird_internet',
                query: '("wonder showzen" OR "xavier renegade angel" OR "millennium" OR "tim and eric" OR "eric andre" OR "adult swim" OR "experimental film" OR "surreal comedy" OR "weird cartoons" OR "bizarre animation" OR "psychedelic" OR "trippy" OR "visual art" OR "motion graphics" OR "video art") AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // Lost media and nostalgia (really cool stuff only)
            {
                category: 'lost_nostalgia',
                query: '("lost media" OR "deleted scenes" OR "rare footage" OR "vintage commercials" OR "retro cartoons" OR "old animation" OR "forgotten films" OR "obscure cartoons") AND (cool, weird, funny, bizarre) AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // Retro internet animation and edgy cartoons (based on scouting results)
            {
                category: 'retro_animation',
                query: '("flash animation" OR "newgrounds" OR "albino blacksheep" OR "homestar runner" OR "weebl" OR "jibjab" OR "animutation" OR "salad fingers" OR "burnt face man" OR "stick death" OR "zone archive" OR "speedosausage") AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // Cartoon Network nostalgia and weird animation
            {
                category: 'cartoon_network_weird',
                query: '("cartoon network" OR "cartoon cartoon" OR "adult swim" OR "liquid television" OR "aeon flux" OR "space ghost" OR "harvey birdman" OR "sealab 2021" OR "aqua teen hunger force" OR "perfect hair forever" OR "tom goes to the mayor" OR "wonder showzen") AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // More Adult Swim cult classics
            {
                category: 'adult_swim_extended',
                query: '("robot chicken" OR "moral orel" OR "superjail" OR "metalocalypse" OR "squidbillies" OR "12 oz mouse" OR "smiling friends" OR "off the air" OR "infomercials" OR "too many cooks") AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // Sketch comedy and alternative comedy shows
            {
                category: 'sketch_comedy',
                query: '("key and peele" OR "key & peele" OR "whitest kids u know" OR "wkuk" OR "mr show" OR "chappelle show" OR "mad tv" OR "in living color" OR "the state" OR "human giant" OR "upright citizens brigade") AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // Early YouTube comedy era
            {
                category: 'early_youtube_comedy',
                query: '("smosh" OR "collegehumor" OR "derrick comedy" OR "lonely island" OR "epic meal time" OR "freddiew" OR "corridor digital" OR "h3h3" OR "idubbz" OR "filthy frank") AND (comedy OR funny OR sketch OR parody) AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // Cult anime and edgy animation
            {
                category: 'cult_anime',
                query: '("cowboy bebop" OR "flcl" OR "trigun" OR "hellsing" OR "elfen lied" OR "paranoia agent" OR "serial experiments lain" OR "ghost in the shell" OR "akira" OR "evangelion" OR "perfect blue") AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // Internet animation classics
            {
                category: 'internet_animation',
                query: '("happy tree friends" OR "eddsworld" OR "asdf movie" OR "charlie the unicorn" OR "llamas with hats" OR "don\'t hug me i\'m scared" OR "cyanide and happiness" OR "dick figures") AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // Gaming comedy and animation
            {
                category: 'gaming_comedy_creators',
                query: '("game grumps" OR "egoraptor" OR "jontron" OR "avgn" OR "angry video game nerd" OR "nostalgia critic" OR "gmod idiot box" OR "sfm animation" OR "team fabulous") AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // 90s/2000s Nickelodeon weird era
            {
                category: 'nickelodeon_weird',
                query: '("invader zim" OR "rocko\'s modern life" OR "courage the cowardly dog" OR "angry beavers" OR "catdog" OR "aaahh real monsters" OR "kablam" OR "action league now") AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // More edgy adult cartoons
            {
                category: 'edgy_adult_cartoons',
                query: '("drawn together" OR "ugly americans" OR "brickleberry" OR "mr pickles" OR "paradise pd" OR "bordertown" OR "legends of chamberlain heights") AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // Classic viral internet videos and phenomena
            {
                category: 'viral_internet_classics',
                query: '("numa numa" OR "chocolate rain" OR "keyboard cat" OR "leeroy jenkins" OR "all your base" OR "badger badger" OR "peanut butter jelly time" OR "dramatic chipmunk" OR "evolution of dance") AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // Alternative comedy specials and stand-up
            {
                category: 'alternative_standup',
                query: '("bo burnham" OR "maria bamford" OR "reggie watts" OR "tim heidecker" OR "hannibal buress" OR "doug stanhope" OR "louis ck" OR "patton oswalt") AND (comedy OR standup OR "stand up" OR special) AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // Internet horror/creepy comedy
            {
                category: 'internet_horror_comedy',
                query: '("local 58" OR "unedited footage of a bear" OR "this house has people in it" OR "marble hornets" OR "everymanhybrid" OR "creepypasta reading" OR "scp foundation") AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // Late night talk and absurdist interviews
            {
                category: 'late_night_absurdist',
                query: '("conan" OR "between two ferns" OR "nathan for you" OR "comedy bang bang" OR "tim and eric" OR "space ghost coast to coast") AND (interview OR talk OR comedy) AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // Psychedelic and trippy visual content
            {
                category: 'psychedelic_visuals',
                query: '("psychedelic" OR "trippy" OR "fractal" OR "kaleidoscope" OR "visual trip" OR "acid visuals" OR "colorful animation" OR "abstract visuals" OR "optical illusion" OR "visual hallucination") AND (animation OR video OR visual) AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // Music videos - visually creative
            {
                category: 'music_videos_creative',
                query: '("music video" OR "official video" OR "animated music video" OR "visual album") AND (animation OR animated OR trippy OR psychedelic OR creative OR artistic OR experimental) AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // Vaporwave and aesthetic videos
            {
                category: 'vaporwave_aesthetic',
                query: '("vaporwave" OR "synthwave" OR "retrowave" OR "aesthetic" OR "seapunk" OR "mallsoft" OR "future funk" OR "a e s t h e t i c") AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // Motion graphics and visual design
            {
                category: 'motion_graphics',
                query: '("motion graphics" OR "kinetic typography" OR "animated typography" OR "logo animation" OR "visual design" OR "graphic animation" OR "title sequence") AND (creative OR colorful OR experimental) AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // Stop motion and claymation comedy
            {
                category: 'stop_motion_comedy',
                query: '("stop motion" OR "claymation" OR "clay animation" OR "lego animation" OR "brick film" OR "puppet animation") AND (funny OR comedy OR weird OR bizarre) AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // Absurdist and surreal short films
            {
                category: 'absurdist_shorts',
                query: '("surreal" OR "absurd" OR "bizarre" OR "weird" OR "strange") AND ("short film" OR animation OR "experimental film" OR comedy) AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            },

            // Visual effects compilations and demos
            {
                category: 'vfx_demos',
                query: '("visual effects" OR "vfx" OR "cgi" OR "special effects" OR "sfx demo" OR "cg animation" OR "3d animation") AND (demo OR reel OR compilation OR showcase) AND mediatype:(movies OR opensource_movies)',
                filters: [],
                sort: 'downloads desc'
            }
        ];
    }

    // Build search URL for Archive.org API
    buildSearchURL(query, filters, rows = 100, start = 0, sort = 'downloads desc') {
        const params = new URLSearchParams({
            q: query,
            fl: 'identifier,title,description,creator,date,downloads,mediatype,licenseurl',
            sort: sort,
            rows: rows.toString(),
            start: start.toString(),
            output: 'json'
        });

        // Add filters properly - they need to be separate parameters
        filters.forEach(filter => {
            params.append('filter[]', filter);
        });

        return `${this.baseURL}?${params}`;
    }

    // Search Archive.org for videos (single batch since pagination doesn't work)
    async searchArchive(query, filters, maxResults = 200, sort = 'downloads desc') {
        // Since Archive.org doesn't respect pagination, we'll get one large batch per query
        const url = this.buildSearchURL(query, filters, Math.min(maxResults, 1000), 0, sort);

        try {
            console.log(`Searching: ${url}`);
            const response = await fetch(url);
            const data = await response.json();

            if (data.response && data.response.docs) {
                console.log(`Found ${data.response.docs.length} items for query: ${query.substring(0, 50)}...`);
                return data.response.docs;
            }
        } catch (error) {
            console.error(`Error searching Archive.org: ${error.message}`);
        }

        return [];
    }

    // Get metadata for a specific item including direct video links
    async getItemMetadata(identifier) {
        try {
            const url = `${this.metadataURL}${identifier}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data && data.files) {
                // Find video files and their direct links
                const allVideoFiles = [];

                for (const [filename, fileData] of Object.entries(data.files)) {
                    // Look for common video formats
                    if (this.isVideoFile(filename, fileData.format)) {
                        // Use Archive.org's actual file server format
                        const directLink = fileData.name ?
                            `https://archive.org/download/${identifier}/${fileData.name}` :
                            `https://archive.org/download/${identifier}/${encodeURIComponent(filename)}`;

                        // Extract duration information if available
                        let duration = null;
                        let durationFormatted = 'Unknown';
                        let durationMs = null;

                        if (fileData.length !== undefined) {
                            duration = fileData.length;

                            // Convert to milliseconds for parseable format
                            if (typeof duration === 'number' && duration > 0) {
                                durationMs = Math.round(duration * 1000);
                            } else if (typeof duration === 'string') {
                                const parsedDuration = parseFloat(duration);
                                if (!isNaN(parsedDuration)) {
                                    duration = parsedDuration;
                                    durationMs = Math.round(parsedDuration * 1000);
                                }
                            }

                            // Format duration as human-readable
                            if (typeof duration === 'number' && duration > 0) {
                                const hours = Math.floor(duration / 3600);
                                const minutes = Math.floor((duration % 3600) / 60);
                                const seconds = Math.floor(duration % 60);

                                if (hours > 0) {
                                    durationFormatted = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                                } else {
                                    durationFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                                }
                            } else if (typeof duration === 'string') {
                                // If it's already a string, try to parse it as a number first
                                const parsedDuration = parseFloat(duration);
                                if (!isNaN(parsedDuration)) {
                                    duration = parsedDuration;
                                    const hours = Math.floor(duration / 3600);
                                    const minutes = Math.floor((duration % 3600) / 60);
                                    const seconds = Math.floor(duration % 60);

                                    if (hours > 0) {
                                        durationFormatted = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                                    } else {
                                        durationFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                                    }
                                } else {
                                    durationFormatted = duration;
                                }
                            }
                        }

                    // Detect if file is audio-only or has video
                        const mediaType = this.detectMediaType(filename, fileData.format);

                        allVideoFiles.push({
                            name: fileData.name || filename,
                            originalFilename: filename,
                            format: fileData.format || this.getFileFormat(filename),
                            size: fileData.size,
                            mediaType: mediaType,
                            duration: duration,
                            durationMs: durationMs,
                            durationFormatted: durationFormatted,
                            directLink: directLink,
                            streamingLink: `https://archive.org/stream/${identifier}/${encodeURIComponent(filename)}`
                        });
                    }
                }

                // Only include MP4 files - sorted by size (largest first)
                // Archive.org uses "MPEG4" format label for MP4 files
                const videoFiles = allVideoFiles
                    .filter(file => {
                        const format = (file.format || '').toLowerCase();
                        const filename = (file.name || '').toLowerCase();
                        return format === 'mp4' || format === 'mpeg4' || filename.endsWith('.mp4');
                    })
                    .sort((a, b) => (b.size || 0) - (a.size || 0));

                return {
                    ...data,
                    videoFiles: videoFiles
                };
            }

            return null;
        } catch (error) {
            console.error(`Error getting metadata for ${identifier}: ${error.message}`);
            return null;
        }
    }

    // Check if file is a video file
    isVideoFile(filename, format) {
        const videoExtensions = ['.mp4', '.webm', '.ogv', '.avi', '.mov', '.mkv', '.mpeg', '.mpg'];
        const audioExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a', '.wma'];
        const videoFormats = ['h.264', 'h.264 MPEG4', 'QuickTime', 'Ogg Video', 'MPEG4', 'webm'];
        const audioFormats = ['MP3', 'Vorbis', 'AAC', 'FLAC', 'WAV', 'Ogg'];

        const lowerFilename = filename.toLowerCase();

        // Check by extension
        if (videoExtensions.some(ext => lowerFilename.endsWith(ext))) {
            return true;
        }
        if (audioExtensions.some(ext => lowerFilename.endsWith(ext))) {
            return false; // Audio file
        }

        // Check by format
        if (format && videoFormats.includes(format)) {
            return true;
        }
        if (format && audioFormats.includes(format)) {
            return false; // Audio file
        }

        // Default to false (assume audio if unclear)
        return false;
    }

    // Detect media type (video vs audio)
    detectMediaType(filename, format) {
        const videoExtensions = ['.mp4', '.webm', '.avi', '.mov', '.mkv', '.mpeg', '.mpg'];
        const audioExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a', '.wma'];
        const videoFormats = ['h.264', 'h.264 MPEG4', 'QuickTime', 'MPEG4', 'webm'];
        const audioFormats = ['MP3', 'Vorbis', 'AAC', 'FLAC', 'WAV', 'Ogg'];

        const lowerFilename = filename.toLowerCase();

        // Video-specific indicators
        if (videoExtensions.some(ext => lowerFilename.endsWith(ext))) {
            return 'video';
        }
        if (format && videoFormats.includes(format)) {
            return 'video';
        }

        // Audio-specific indicators
        if (audioExtensions.some(ext => lowerFilename.endsWith(ext))) {
            return 'audio';
        }
        if (format && audioFormats.includes(format)) {
            return 'audio';
        }

        // Special handling for OGV - often audio-only based on your finding
        if (lowerFilename.endsWith('.ogv') || format === 'Ogg Video') {
            // Check filename for audio indicators
            const audioKeywords = ['audio', 'sound', 'music', 'track', 'song', 'mp3', 'audio-only'];
            if (audioKeywords.some(keyword => lowerFilename.includes(keyword))) {
                return 'audio';
            }

            // Check if format specifically indicates audio
            if (format && format.toLowerCase().includes('audio')) {
                return 'audio';
            }

            // Default OGV to video unless clear audio indicators
            return 'video';
        }

        // Default to video for mixed/unknown formats
        return 'video';
    }

    // Get file format from filename
    getFileFormat(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        return extension;
    }

    // Check if content is English and actually funny - Improved English detection
    isPubliclyAvailable(item) {
        const title = String(item.title || '');
        const text = `${title} ${String(item.description || '')} ${String(item.creator || '')}`.toLowerCase();

        // Strict English check on TITLE ONLY - descriptions can have special characters
        const obviousNonEnglish = title.includes('العربية') || title.includes('中文') || title.includes('日本語') ||
                                title.includes('한국어') || title.includes('русский') || title.includes('français') ||
                                title.includes('español') || title.includes('deutsch') || title.includes('italiano') ||
                                title.includes('português') || title.includes('nederlands') || title.includes('polski') ||
                                title.includes('türkçe') || title.includes('svenska') || title.includes('norsk');

        if (obviousNonEnglish) {
            console.log(`Skipping (non-English): ${item.title}`);
            return false;
        }

        // Skip content with predominantly non-ASCII titles (indicates foreign content)
        const nonAsciiRatio = (title.match(/[^\x00-\x7F]/g) || []).length / title.length;
        if (nonAsciiRatio > 0.3) { // If more than 30% non-ASCII characters
            console.log(`Skipping (non-English title): ${item.title}`);
            return false;
        }

        // Skip obvious non-funny content AND classic comedy that's not millennial-friendly
        const skipPatterns = [
            'speed run', 'speedrun', 'segments completed', 'author\'s comments',
            'test file for site', 'educational', 'instructional', 'industrial',
            'health: your posture', 'sleep for health', 'about bananas',
            'automotive service', 'employment opportunities',

            // Skip gameplay and review content (not funny)
            'gameplay', 'playthrough', 'walkthrough', 'let\'s play', 'review', 'tutorial',
            'how to', 'guide', 'speed run', 'speedrun', 'achievement', 'high score',

            // Skip boring educational/documentary content (BE MORE AGGRESSIVE)
            'documentary', 'education', 'educational', 'learning', 'school', 'university',
            'lecture', 'presentation', 'training', 'course', 'lesson',
            'public service announcement', 'psa', 'informational', 'instructional',
            'industrial film', 'corporate video', 'training video', 'safety video',
            'technical manual', 'business presentation', 'manufacturing', 'automotive',

            // Skip boring news/media content (but allow legitimate funny footage)
            'news report', 'news broadcast', 'journalism', 'interview', 'press conference',
            'archive footage', 'historical', 'vintage', 'retro film',
            'television commercial', 'tv ad', 'advertisement', 'promo', 'trailer',

            // Skip boring family/kids content
            'family show', 'kids show', 'children', 'disney junior', 'nick jr',
            'cartoon for kids', 'educational cartoon', 'baby', 'toddler', 'preschool',
            'alvin and the chipmunks', 'hamtaro', 'pb&j otter', 'blue\'s clues',

            // Skip boring technical/industrial content
            'technical manual', 'training video', 'safety video', 'corporate',
            'business presentation', 'manufacturing', 'automotive', 'mechanical',
            'engineering', 'construction', 'maintenance', 'operating instructions',

            // Skip boring sports/fitness content
            'workout', 'fitness', 'exercise', 'sports training', 'athletic',
            'gym', 'personal training', 'sports highlights', 'game footage',
            'match', 'tournament', 'championship', 'competition', 'sports broadcast',

            // Skip boring medical/health content
            'medical', 'health', 'hospital', 'doctor', 'nurse', 'medicine',
            'surgery', 'treatment', 'therapy', 'psychology', 'mental health',
            'pharmaceutical', 'clinical', 'healthcare', 'wellness',

            // Skip boring nature/travel content
            'nature documentary', 'wildlife', 'travel', 'vacation', 'tourism',
            'scenery', 'landscape', 'national geographic', 'discovery channel',
            'travel guide', 'tourist', 'sightseeing', 'beach', 'mountain',

            // Classic/old comedy to exclude (not millennial-friendly)
            'three stooges', 'chaplin', 'charlie chaplin', 'laurel and hardy', 'laurel & hardy',
            'abbott and costello', 'abbott & costello', 'harold lloyd', 'buster keaton',
            'mickey mouse', 'donald duck', 'goofy', 'pluto', 'marx brothers',

            // Unus Annus and similar shows to exclude
            'unus annus', 'markiplier', 'ethan', 'theunusannusarchive',

            // Old/lame kids shows to exclude
            'berenstain bears', 'berenstein bears', 'arthur', 'magic school bus',
            'blue\'s clues', 'dragon tales', 'barney', 'sesame street', 'mister rogers',
            'reading rainbow', 'wishbone', 'power rangers', 'teenage mutant ninja turtles',

            // Lame Disney content to exclude (keep edgy WB)
            'mickey mouse', 'donald duck', 'goofy', 'pluto', 'minnie mouse',
            'disney channel', 'disney junior', 'winnie the pooh', 'lion king',

            // Old-timey content to skip
            'silent film', 'vaudeville', 'black and white', 'black & white',

            // Foreign/non-English content to skip
            'french', 'francais', 'tintin', 'asterix', 'belgian', 'european comics',

            // Lame cartoon content to skip
            'tintin', 'herge',

            // TEDIOUS CONTENT - Add more aggressive filtering
            'ted talk', 'conference talk', 'panel discussion', 'interview series',
            'academic lecture', 'university lecture', 'college lecture', 'symposium',
            'political debate', 'government hearing', 'committee hearing',
            'corporate presentation', 'business meeting', 'industry conference',
            'professional development', 'workshop', 'seminar', 'webinar',

            // MORE TEDIOUS CONTENT
            'biography documentary', 'historical documentary', 'biographical film',
            'life story', 'career retrospective', 'interview series', 'oral history',
            'personal documentary', 'family documentary', 'institutional documentary',

            // VJ LOOPS - Add more comprehensive filtering
            'vj loops', 'vj clip', 'visual jockey', 'vj performance', 'vj set',
            'vj loop pack', 'vj collection', 'vj visuals', 'vj effects',
            'vj mixing', 'vj software', 'vj content', 'vj media',
            'analog recycling', 'v jzoo', 'analog recycling',

            // BORING HIGH-VALUE CONTENT - Add better recognition
            'elephants dream', 'prelinger twice a night', 'sleep for health',
            'eat for health', 'personal hygiene', 'automotive service',
            'general health habits', 'have i told you lately', 'the last bomb',
            'good eating habits', 'duck and cover', 'nazi concentration camps',
            'bloody pit of horror', 'experiments in the revival of organisms',
            'child molester', 'about bananas',

            // CULT CLASSICS - Some are actually cool, others are not
            'reefer madness', 'bloody pit of horror', 'killers from space',
            'grave of the vampire', 'cosmos: war of the planets',
            'horror express', 'the final moments of budd dwyer',
            'terry a. davis templeos archive', 'temple os archive',

            // BORING SERIES AND DOCUMENTARIES
            'norm macdonald live', 'connections by james burke', 'the corporation',
            'a is for atom', 'century 21 calling', 'gary kildall special',
            'hypercard', 'alan kay', 'doing with images',
            'the internet', 'the internet\'s own boy',

            // KIDS CONTENT TO SKIP (but keep the good adult shows)
            'blue\'s clues'
        ];

        if (skipPatterns.some(pattern => text.includes(pattern))) {
            console.log(`Skipping (non-funny content): ${item.title}`);
            return false;
        }

        // More inclusive funny detection (reduced false negatives)
        const funnyIndicators = [
            // High-value specific content we definitely want
            'norm macdonald', 'red vs blue', 'rwby', 'final space',
            'camp camp', 'rooster teeth', 'achievement hunter',

            // Direct comedy indicators
            'funny', 'comedy', 'humor', 'humour', 'laugh', 'joke', 'parody', 'satire',
            'hilarious', 'comic', 'standup', 'stand up', 'sketch', 'amusing',
            'entertaining', 'comical', 'witty', 'goofy', 'silly', 'absurd',
            'ridiculous', 'slapstick', 'farce', 'spoof', 'fawlty', 'towers',

            // Animation/cartoon indicators
            'cartoon', 'animation', 'animated', 'anime', 'boondocks',

            // Edgy WB/Adult animation to keep (not lame Disney)
            'ren and stimpy', 'beavis and butthead', 'south park', 'family guy',
            'american dad', 'the simpsons', 'futurama', 'aqua teen hunger force',
            'sealab 2021', 'harvey birdman', 'space ghost coast to coast',

            'daffy duck', 'elmer fudd',  'woody woodpecker', 'road runner', 'wile e coyote', 'yosemite sam',

            'king of the hill', 'spiderman', 'spider-man', 'dragon ball', 'dragonball',
            'digimon', 'x-men', 'xmen', 'hazbin hotel', 'final space', 'spongebob', 'spongebob squarepants',

            'vine', 'tiktok', 'meme', 'memes', 'dank', 'compilation', 'youtube poop', 'ytp',
            'viral', 'reaction', 'fail', 'cringe', 'dark humor', 'ironic', 'shitposting',
            'surreal', 'absurdist', 'anti-humor', 'post-ironic', 'weird internet',
            'lost youtube', 'lost videos', 'deleted youtube', 'archived youtube',
            'greentext', '4chan', 'newgrounds', 'flash animation', 'montage parody',
            'cyriak', 'surreal animation', 'weird cartoons', 'abstract animation', 'loop animation',
            'kaleidoscope', 'psychedelic animation', 'trippy animation', 'bizarre comedy',
            'weird comedy', 'alternative comedy', 'experimental comedy', 'cult comedy',
            'weird cinema', 'b-movie comedy', 'spoof movie', 'parody film', 'exploitation comedy',

            // Digital art & glitch content
            'datamosh', 'datamoshing', 'glitch art', 'digital corruption', 'video corruption',
            'digital glitch', 'pixel sorting', 'ascii art', 'demoscene', 'chipmusic',

            // Web art & internet meta
            'web art', 'net art', 'internet art', 'vaporwave', 'seapunk', 'memphis design',
            'webcore', 'old web', 'geocities', 'shockwave flash', 'flash cartoons',

            // Video art & experimental
            'video art', 'experimental video', 'visual experiment', 'abstract video',
            'motion graphics', 'visual music', 'synesthetic', 'audiovisual art',

            // Internet mysteries & phenomena
            'internet mystery', 'creepypasta', 'urban legend', 'web mystery', 'online mystery',
            'viral mystery', 'internet phenomenon', 'deep web', 'dark web', 'creepy internet',

            // Surrealist & absurdist cinema
            'surrealist cinema', 'absurdist film', 'dada cinema', 'surreal comedy',
            'nonsense film', 'experimental narrative', 'non-linear film', 'dream sequence',
            'psychedelic film', 'consciousness film', 'avant garde narrative',

            // Internet subcultures (but allow the TV show "Community")
            'internet subculture', 'fandom documentary', 'meme culture',
            'viral culture', 'internet tribe', 'digital tribe', 'troll culture',

            // Additional animation studios & retro content
            'spumco', 'john kricfalusi', 'ren and stimpy', 'powerpuff girls', 'dexter laboratory',
            'cartoon network', 'nickelodeon', 'mtv animation', 'liquid television', 'aeon flux',
            'harvey birdman', 'aqua teen hunger force', 'sealab 2021', 'space ghost',
            'homestar runner', 'strong bad email', 'albino blacksheep',

            // High energy visual impact content
            'high energy', 'visual impact', 'trippy', 'psychedelic', 'surreal animation',
            'abstract animation', 'motion graphics', 'visual effects', 'special effects',
            'visual spectacle', 'mind bending', 'cult animation', 'indie animation',
            'artistic animation', 'underground animation', 'weird cartoon', 'psychedelic cartoon',
            'visionary animation', 'experimental animation', 'animation anthology',

            // Engaging comedy & variety shows
            'sketch comedy', 'variety show', 'absurdist comedy', 'surreal comedy',
            'funny weird', 'comedy gold', 'sketch comedy show', 'funny anthology',
            'comedy collection', 'humor anthology', 'funny variety', 'comedy special',
            'stand-up comedy', 'improv comedy', 'alternative comedy', 'experimental comedy',

            // Visual art & performance (non-boring)
            'music video', 'music visuals', 'performance art', 'visual music',
            'animated music', 'music animation', 'visual performance', 'art performance',
            'artistic video', 'creative video', 'artistic film', 'multimedia performance',

            // International (short & funny only)
            'funny short', 'comedy short', 'funny clip', 'humor short', 'comic short',

            // Tech/gaming/machinima content
            'machinima', 'red vs blue', 'rooster teeth', 'achievement hunter', 
            'gaming comedy', 'glitch', 'it crowd',
            'internet culture','tech humor',

            // Internet culture sources
            '4chan', 'reddit', 'liveleak', 'deep fried', 'cursed', 'unstable', 'wholesome',

            // Media/comedy formats (modern/millennial-friendly)
            'exploitation film', 'live comedy', 'tv series', 'sitcom', 'animated series',
            'the office', 'brooklyn nine nine', 'community', 'arrested development', 'it\'s always sunny',

            // Dark/edgy humor themes (no fluff)
            'dark humor', 'dark comedy', 'black comedy', 'cynical', 'sarcastic',
            'anti-humor', 'edgy', 'controversial', 'offensive', 'shock humor'
        ];

        const isFunny = funnyIndicators.some(indicator => text.includes(indicator));

        // Additional check: if title suggests comedy OR is high-value content, allow it
        const titleSuggestsComedy = (
            title.toLowerCase().includes('comedy') ||
            title.toLowerCase().includes('funny') ||
            title.toLowerCase().includes('laughs') ||
            title.toLowerCase().includes('humor') ||
            title.toLowerCase().includes('cartoon') ||
            title.toLowerCase().includes('animation')
        );

        // Special exemption for high-value content we definitely want (excluding Unus Annus)
        const isHighValueContent = (
            title.toLowerCase().includes('norm macdonald') ||
            title.toLowerCase().includes('red vs blue') ||
            title.toLowerCase().includes('rwby') ||
            title.toLowerCase().includes('final space') ||
            title.toLowerCase().includes('camp camp') ||
            title.toLowerCase().includes('rooster teeth') ||
            title.toLowerCase().includes('achievement hunter') ||
            title.toLowerCase().includes('logan paul') ||
            title.toLowerCase().includes('salo') ||
            title.toLowerCase().includes('scarlet street') ||
            title.toLowerCase().includes('dr strangelove') ||
            title.toLowerCase().includes('tik tok') ||
            title.toLowerCase().includes('mlg') ||
            title.toLowerCase().includes('dank memes') ||
            title.toLowerCase().includes('freakazoid') ||
            title.toLowerCase().includes('xavier: renegade angel') ||
            title.toLowerCase().includes('chris morris') ||
            title.toLowerCase().includes('the happiness of the katakuris') ||
            title.toLowerCase().includes('how the eye functions') ||
            title.toLowerCase().includes('ant city') ||
            title.toLowerCase().includes('firesign theatre') ||
            title.toLowerCase().includes('killer diller') ||
            title.toLowerCase().includes('the benny hill show') ||
            title.toLowerCase().includes('the amanda show') ||
            title.toLowerCase().includes('the best of bizarre') ||
            title.toLowerCase().includes('amazon women on the moon') ||
            title.toLowerCase().includes('sita sings the blues') ||
            title.toLowerCase().includes('case of spring fever') ||
            title.toLowerCase().includes('wonder showzen') ||
            title.toLowerCase().includes('idiocracy') ||
            title.toLowerCase().includes('hazbin hotel') ||
            title.toLowerCase().includes('pink panther') ||
            title.toLowerCase().includes('grim adventures') ||
            title.toLowerCase().includes('boondocks') ||
            title.toLowerCase().includes('million dollar extreme') ||
            title.toLowerCase().includes('neon genesis evangelion') ||
            title.toLowerCase().includes('venture bros') ||
            title.toLowerCase().includes('king of the hill') ||
            title.toLowerCase().includes('idiocracy') ||
            title.toLowerCase().includes('evolved virtual creatures') ||

            // Cool animation content (any animation is fun to watch)
            title.toLowerCase().includes('my little pony') ||
            title.toLowerCase().includes('x-men') ||
            title.toLowerCase().includes('xmen') ||
            title.toLowerCase().includes('x-men evolution') ||
            title.toLowerCase().includes('spider-man') ||
            title.toLowerCase().includes('spiderman') ||
            title.toLowerCase().includes('merrie melodies') ||
            title.toLowerCase().includes('legend of the galactic heroes') ||
            title.toLowerCase().includes('princess by matt stone') ||
            title.toLowerCase().includes('harvey birdman attorney at law') ||
            title.toLowerCase().includes('aeon flux') ||
            title.toLowerCase().includes('popeye') ||
            title.toLowerCase().includes('noveltoon') ||
            title.toLowerCase().includes('caspar the friendly ghost') ||
            title.toLowerCase().includes('mighty mouse') ||
            title.toLowerCase().includes('north playground') ||

            // Weird/nostalgic internet content
            title.toLowerCase().includes('shrek retold') ||
            title.toLowerCase().includes('vloggercon') ||
            title.toLowerCase().includes('webby awards') ||
            title.toLowerCase().includes('flames') ||
            title.toLowerCase().includes('make mine freedom') ||
            title.toLowerCase().includes('my favorite brunette') ||

            // Discovered animation content
            title.toLowerCase().includes('cartoon network') ||
            title.toLowerCase().includes('cartoon cartoon') ||
            title.toLowerCase().includes('marvel super heroes') ||
            title.toLowerCase().includes('vhs recording') ||
            title.toLowerCase().includes('stick death') ||
            title.toLowerCase().includes('newgrounds') ||
            title.toLowerCase().includes('flash animation') ||
            title.toLowerCase().includes('zone archive') ||
            title.toLowerCase().includes('speedosausage') ||
            title.toLowerCase().includes('homestar runner') ||
            title.toLowerCase().includes('salad fingers') ||
            title.toLowerCase().includes('albino blacksheep') ||
            title.toLowerCase().includes('weebl') ||
            title.toLowerCase().includes('jibjab') ||
            title.toLowerCase().includes('animutation') ||
            title.toLowerCase().includes('burnt face man')
        );

        // Early return for high-value content
        if (isHighValueContent) {
            console.log(`Including (high-value content): ${item.title}`);
            return true;
        }

        if (!isFunny && !titleSuggestsComedy) {
            console.log(`Skipping (not clearly funny): ${item.title}`);
            return false;
        }

  
        return true;
    }

    // Process search results and get detailed metadata for each item
    async processSearchResults(results, category, outputCallback = null) {
        const processedItems = [];

        for (const item of results) {
            console.log(`Processing: ${item.title || item.identifier}`);

            // Filter for publicly available content
            if (!this.isPubliclyAvailable(item)) {
                console.log(`Skipping (not publicly available): ${item.title}`);
                continue;
            }

            const metadata = await this.getItemMetadata(item.identifier);
            if (metadata && metadata.videoFiles.length > 0) {
                const processedItem = {
                    identifier: item.identifier,
                    title: item.title || item.identifier,
                    description: item.description || '',
                    creator: item.creator || 'Unknown',
                    date: item.date || 'Unknown',
                    downloads: item.downloads || 0,
                    license: metadata.metadata?.licenseurl || 'Unknown',
                    rights: metadata.metadata?.rights || 'Check archive page for license details',
                    category: category,
                    videoFiles: metadata.videoFiles,
                    metadataURL: `https://archive.org/metadata/${item.identifier}`,
                    archiveURL: `https://archive.org/details/${item.identifier}`
                };

                processedItems.push(processedItem);

                // Immediately output this video if callback provided
                if (outputCallback) {
                    outputCallback(processedItem);
                }
            }

            // Add delay to avoid rate limiting (reduced for faster processing)
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        return processedItems;
    }

    // Main function to find all videos
    async findAllVideos(outputCallback = null) {
        console.log('Starting comprehensive Archive.org video search...');

        const queries = this.getSearchQueries();
        const processedIdentifiers = new Set(); // Avoid duplicates

        for (const { category, query, filters, sort } of queries) {
            console.log(`\n=== Searching for ${category} videos ===`);

            const searchResults = await this.searchArchive(query, filters, 1000, sort);
            console.log(`Found ${searchResults.length} potential ${category} videos`);

            // Filter out already processed items to avoid duplicates
            const newResults = searchResults.filter(item => !processedIdentifiers.has(item.identifier));
            console.log(`${newResults.length} new items (excluding duplicates)`);

            const processedItems = await this.processSearchResults(newResults, category, outputCallback);

            // Track processed identifiers
            processedItems.forEach(item => processedIdentifiers.add(item.identifier));

            this.videoList.push(...processedItems);
            console.log(`Successfully processed ${processedItems.length} ${category} videos with direct links`);
        }

        console.log(`\nTotal unique videos found: ${this.videoList.length}`);
        return this.videoList;
    }

    // Save results to JSON file
    saveToFile(filename = 'archive_videos.json') {
        const output = {
            generated: new Date().toISOString(),
            totalVideos: this.videoList.length,
            categories: {
                funny: this.videoList.filter(v => v.category === 'funny').length,
                machinima: this.videoList.filter(v => v.category === 'machinima').length,
                cartoons: this.videoList.filter(v => v.category === 'cartoons').length
            },
            videos: this.videoList
        };

        fs.writeFileSync(filename, JSON.stringify(output, null, 2));
        console.log(`Results saved to ${filename}`);

        // Also save a simple CSV for easy viewing
        this.saveToCSV('archive_videos.csv');
    }

    // Save to CSV format - COMPREHENSIVE: Shows ALL individual videos with duration and media type
    saveToCSV(filename) {
        const headers = ['Resource Title', 'Episode/Video Name', 'Category', 'Creator', 'Date', 'Downloads', 'Duration', 'Media Type', 'Video Format', 'File Size', 'Direct Link', 'Archive URL'];
        const rows = [];

        this.videoList.forEach(video => {
            if (video.videoFiles && video.videoFiles.length > 0) {
                // Create a row for EACH video file in multi-video resources
                video.videoFiles.forEach((videoFile, index) => {
                    rows.push([
                        `"${String(video.title || '').replace(/"/g, '""')}"`,
                        `"${String(videoFile.name || '').replace(/"/g, '""')}"`,
                        video.category,
                        `"${String(video.creator || '').replace(/"/g, '""')}"`,
                        video.date || '',
                        video.downloads || 0,
                        `"${String(videoFile.durationFormatted || 'Unknown').replace(/"/g, '""')}"`,
                        `"${String(videoFile.mediaType || 'Unknown').replace(/"/g, '""')}"`,
                        videoFile.format || '',
                        videoFile.size || '',
                        videoFile.directLink || '',
                        video.archiveURL
                    ]);
                });
            }
        });

        const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        fs.writeFileSync(filename, csvContent);
        console.log(`Comprehensive CSV with ALL ${rows.length} videos saved to ${filename}`);
    }

    // Display summary statistics
    displaySummary() {
        console.log('\n=== Video Search Summary ===');
        console.log(`Total videos found: ${this.videoList.length}`);

        const categories = ['funny', 'machinima', 'cartoons'];
        categories.forEach(category => {
            const count = this.videoList.filter(v => v.category === category).length;
            console.log(`${category}: ${count} videos`);
        });

        // Show top 10 most downloaded videos with duration
        const topVideos = this.videoList
            .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
            .slice(0, 10);

        console.log('\n=== Top 10 Most Downloaded Videos ===');
        topVideos.forEach((video, index) => {
            const firstVideo = video.videoFiles[0];
            const duration = firstVideo?.durationFormatted || 'Unknown';
            console.log(`${index + 1}. ${video.title} (${video.category}) - ${video.downloads} downloads - ${duration}`);
            console.log(`   ${firstVideo?.directLink || 'No direct link'}`);
            console.log('');
        });
    }
}

// Main execution
async function main() {
    const finder = new ArchiveVideoFinder();

    try {
        await finder.findAllVideos();
        finder.saveToFile();
        finder.displaySummary();

        console.log('\n✅ Archive.org video search completed!');
        console.log('📁 Results saved to archive_videos.json and archive_videos.csv');

    } catch (error) {
        console.error('❌ Error during video search:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = ArchiveVideoFinder;