class TwitchChatSimulator {
    constructor() {
        this.usernames = [];
        this.messages = [];
        this.isRunning = true; // Start automatically
        this.intervalId = null;
        this.messageCount = 0;
        this.currentSpeed = 1500;
        this.nextMessageTime = 0;
        this.scrollScheduled = false;
        this.viewerState = 0; // 0: normal, 1: "Live", 2: hidden
        this.emotesEnabled = true;
        
        this.initializeElements();
        this.loadData();
        this.setupEventListeners();
    }

    initializeElements() {
        this.chatMessages = document.getElementById('chatMessages');
        this.speedSlider = document.getElementById('speedSlider');
        this.speedValue = document.getElementById('speedValue');
        this.toggleBtn = document.getElementById('toggleBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.messageCounter = document.getElementById('messageCounter');
        this.messageType = document.getElementById('messageType');
        this.viewerCount = document.getElementById('viewerCount');
        this.liveDot = document.querySelector('.live-dot');
        this.emoteToggle = document.getElementById('emoteToggle');
    }

    loadData() {
        // Embedded usernames from names.txt
        this.usernames = [
            'clutchline', 'VantaCore', 'driftshot', 'HexaPeak', 'quakepulse', 'TrueSight', 'zyntrix', 'FragNest', 'RecoilZen', 'shadowbind',
            'byteglow', 'StackDream', 'renderx', 'NullTide', 'debugloop', 'pxlshift', 'echoform', 'glitchmark', 'firewalled', 'macrovoid',
            'novaeli', 'kirova', 'vesq', 'luneo', 'ellair', 'jinnex', 'ruva', 'noryn', 'ziaa', 'miravi', 'ItsTheo', 'livewithLex', 'heyserena',
            'thatmilo', 'watchniko', 'playzay', 'streamerkai', 'notellie', 'talktojas', 'zekoTV', 'aimjune', 'Kryptek', 'ValorDrop', 'reflexjin',
            'xrunn', 'boldzera', 'clutchxr', 'twitchrush', 'shotcore', 'lexclaps', 'thinkzen', 'NightSyntax', 'plainaudio', 'TheoryTuned',
            'voltquiet', 'logicline', 'streamscope', 'calmio', 'infomute', 'datafade', 'justkay', 'mellowmax', 'chillren', 'loopdevon',
            'bigvinnytv', 'hannahwatch', 'markinlive', 'crispyben', 'whodatmatt', 'chilltony', 'Veltix', 'Jeyro', 'Chroniq', 'Lexium', 'Vornas',
            'Zydrix', 'Kintal', 'Brexio', 'Yuron', 'Nolvik', 'domocode', 'lofigrip', 'trashpixel', 'mopelive', 'bugspool', 'watchpot', 'lollexa',
            'streamrollin', 'firewithren', 'kaxaon', 'LunarGroove', 'Omenwave', 'tactribe', 'byteorbit', 'streakish', 'mellowlynx', 'fynntv',
            'aimology', 'renknows', 'pxlcamp', 'streamforge', 'nexusbay', 'ridgeline', 'voltstream', 'pulserift', 'corelink', 'fluxzone',
            'peakview', 'axisgame', 'driftcore', 'zenmode', 'voidstream', 'syncplay', 'edgecast', 'flowtide', 'raybeam', 'snapgrid',
            'primecast', 'linkwave', 'fastlane', 'blueshift', 'skybound', 'rustcode', 'ironplay', 'goldstream', 'silvercast', 'copperlink',
            'steelwave', 'firecast', 'icestream', 'stormline', 'windplay', 'lightcast', 'darkmode', 'brightview', 'clearcast', 'sharpplay',
            'quickbeam', 'fastcast', 'slowburn', 'deepdive', 'highplay', 'lowkey', 'midzone', 'topcast', 'endgame', 'startline', 'playzone',
            'gamecast', 'livemode', 'watchplay', 'streamline', 'castzone', 'playlink', 'gamemode', 'livecast', 'watchzone', 'streamplay',
            'castmode', 'playcast', 'gamezone', 'livelink', 'watchcast', 'coderift', 'techbay', 'datastream', 'byteflow', 'pixelcast',
            'meshlink', 'nodeplay', 'framecast', 'loadzone', 'cacheline', 'buffstream', 'pingcast', 'lagtide', 'synczone', 'netplay',
            'webcast', 'appstream', 'devzone', 'scriptcast', 'funcplay', 'loopcast', 'arrayzone', 'stringplay', 'boolcast', 'intstream',
            'floatzone', 'charplay', 'voidcast', 'nullzone', 'trueplay', 'falsecast', 'ifstream', 'elsecast', 'forplay', 'whilecast',
            'switchzone', 'caseplay', 'breakcast', 'returnzone', 'classplay', 'objectcast', 'methodzone', 'fieldplay', 'propcast', 'eventzone',
            'listplay', 'setcast', 'mapzone', 'queueplay', 'stackcast', 'heapzone', 'treeplay', 'nodecast', 'graphzone', 'edgeplay',
            'pathcast', 'routezone', 'bridgeplay', 'hubcast', 'portzone', 'linkplay', 'netcast', 'meshzone', 'gridplay', 'tilecast',
            'blockzone', 'chunkplay', 'segmentcast', 'sectorzone', 'regionplay', 'areacast', 'zoneline', 'fieldcast', 'rangezone', 'boundplay',
            'limitcast', 'maxzone', 'minplay', 'avgcast', 'sumzone', 'countplay', 'totalcast', 'ratezone', 'speedplay', 'timecast',
            'clockzone', 'timerplay', 'framecast', 'tickzone', 'stepplay', 'movecast', 'turnzone', 'shiftplay', 'rotatecast', 'Nightbot'
        ];

        // All messages from messages.txt + frequent W's and L's
        this.allMessages = [
            // Frequent W's and L's added to normal messages
            'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W',
            'WW', 'WW', 'WW', 'WW', 'WW', 'WW', 'WW', 'WW', 'WW', 'WW',
            'WWW', 'WWW', 'WWW', 'WWW', 'WWW', 'WWW', 'WWW', 'WWW', 'WWW', 'WWW',
            'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L',
            'LL', 'LL', 'LL', 'LL', 'LL', 'LL', 'LL', 'LL', 'LL', 'LL',
            'LLL', 'LLL', 'LLL', 'LLL', 'LLL', 'LLL', 'LLL', 'LLL', 'LLL', 'LLL',
            
            // Original messages from messages.txt
            'yo this game actually looks sick', 'wait how did you do that??', 'that was clean af', 'dude you\'re cracked',
            'been watching for 10 mins and I\'m already hooked', 'lol the timing on that', 'bruh no way', 'lowkey that was kinda smart',
            'just got here, what\'d I miss?', 'bro\'s cooking tonight fr', 'this part always stresses me out', 'why is this so intense lol',
            'I swear this game hates you', 'LMAO not the fall again', 'W stream as always', 'nah that was smooth',
            'chat he really pulled that off', 'just chillin after work, glad you\'re live', 'who else remembers when he first played this?',
            'yo I needed this stream today', 'how are you still alive rn 😂', 'not even mad, that was hilarious', 'music on point rn',
            'cam froze but he\'s still talking lmao', 'been lurking, but this part got me', 'can\'t believe that actually worked',
            'bro\'s in the zone tonight', 'this is why I subbed', 'the vibes are immaculate', 'what\'s the name of this song?',
            'is this a new setup? looks clean', 'you already know he\'s about to clutch', 'I feel like I\'ve seen this part before',
            'he\'s got that gamer lean going', 'actual peak content', 'was not expecting that ending lol', 'this is one of my fav games',
            'no shot he wins this', 'yo that timing tho', 'bro the RNG is wild today', 'just me or is this lowkey relaxing',
            'man I missed these streams', 'okay but that transition was smooth', 'he really said "watch this" and did it',
            'that one hurt to watch', 'bro you\'re on fire tonight', 'we love a comeback', 'deadass thought you were gonna lose',
            'I could watch this all night', 'just got off work, perfect timing', 'yo chat that was kinda hype',
            'I swear you\'re cursed in this game', 'dude that move was so clean', 'been here since 1k followers, love to see it',
            'why is this so intense for no reason', 'you\'ve improved a lot ngl', 'yo how long you streaming tonight?',
            'yo this part is crazy', 'he\'s not making it out of this one', 'chat he\'s actually sweating', 'nahhh that was clutch',
            'ok that was clean', 'been waiting all day for this stream', 'finally caught it live 🙌', 'you got this bro',
            'how did you survive that', 'I\'m crying that was too funny', 'this man really just did that', 'audio sounds so good today',
            'new mic? sounds crispy', 'ok but this game looks kinda fire', 'who else remembers when he rage quit last time?',
            'bro the aim is wild today', 'pause... what just happened 😂', 'just vibin with the stream after work',
            'yo you\'ve gotten way better at this', 'he actually hit that shot', 'can\'t believe he pulled that off',
            'I\'m hooked already lol', 'when\'s the next stream?', 'this is why I don\'t play ranked', 'yo the chat is moving fast today',
            'been lurking for a bit, had to speak up for that', 'nah he\'s different today', 'you\'re actually cracked at this',
            'that timing was unreal', 'music and gameplay on point', 'ok but the lighting in this scene 🔥', 'mods asleep again lol',
            'noooo not this level again 😩', 'lowkey I love this part', 'ok you actually had me worried', 'bro you\'re too good',
            'you always stream when I\'m trying to sleep lol', 'I\'d rage quit right there tbh', 'first time here, already vibing',
            'he makes it look easy', 'nah cause that was disrespectful 😂', 'that dodge tho', 'you should make a highlight reel of this',
            'yo you ever thought about speedrunning this?', 'ok but who else is eating while watching', 'I\'m just here for the chaos',
            'he\'s locked in now', 'chat, is this a new game?', 'ok that was smart, I\'ll give you that', 'this is the content I needed today',
            'dude the way you play this is so fun to watch', 'you really out here dodging everything', 'this might be your cleanest run yet',
            'first time catching the stream live', 'can\'t believe I\'ve been missing these', 'yo I feel like I\'ve seen this level 10 times now lol',
            'what are the settings you use for this?', 'you make this game look too easy', 'this is my comfort stream tbh',
            'wait what did I just walk into', 'yo he\'s in gamer mode', 'chat I think he forgot to save lol', 'why does this part always go wrong',
            'you better clip that', 'you already know what\'s about to happen', 'bro that timing was scary good',
            'how did you know that was gonna happen', 'bro\'s third eye opened for that move', 'the chaos is real rn',
            'honestly I would\'ve panicked', 'you\'re way too calm for what\'s happening', 'this music goes hard every time',
            'yo you just unlocked a memory I forgot I had', 'I swear this game is out to get you', 'he\'s speedrunning emotions rn',
            'I\'m just tryna chill and you\'re out here sweating', 'ok now you\'re just showing off', 'anyone know what song this is?',
            'this man\'s reflexes are wild', 'he\'s dialed in', 'love the chill vibe tonight', 'this is straight therapy',
            'you really dodged all that huh', 'chat he\'s cracked', 'you ever gonna do a face reveal?', 'why is this actually so fun to watch',
            'I need to play this now', 'ok streamer, we see you', 'who remembers the first time he played this lol', 'game really said "nope"',
            'you had that in the bag', 'yo the comeback is real', 'I swear the game glitched', 'that was some anime moment timing',
            'stream got me in my feels rn', 'how are you even alive right now', 'I swear he\'s hacking', 'this stream cured my boredom',
            'I come here for the vibes and stay for the chaos', 'someone needs to clip that NOW', 'he\'s different today',
            'ok but that was a W play', 'I could watch this all day ngl', 'what the fuuuuuck', 'nah what was that', 'crazy shit',
            'bat shit', 'insane', 'jittliang', 'fuhlutugans'
        ];

        // Simple messages (W's, LETS GOOO, L's) - with increased frequency for W and L
        this.simpleMessages = [
            // W's - more frequent
            'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W',
            'WW', 'WW', 'WW', 'WW', 'WW', 'WW', 'WW', 'WW', 'WW', 'WW',
            'WWW', 'WWW', 'WWW', 'WWW', 'WWW', 'WWW', 'WWW', 'WWW', 'WWW', 'WWW',
            'WWWW', 'WWWW', 'WWWW', 'WWWW', 'WWWW', 'WWWW', 'WWWW', 'WWWW', 'WWWW', 'WWWW',
            'WWWWW', 'WWWWW', 'WWWWW', 'WWWWW', 'WWWWW', 'WWWWW', 'WWWWW', 'WWWWW', 'WWWWW', 'WWWWW',
            'WWWWWW', 'WWWWWW', 'WWWWWW', 'WWWWWW', 'WWWWWW', 'WWWWWW', 'WWWWWW', 'WWWWWW', 'WWWWWW', 'WWWWWW',
            'WWWWWWW', 'WWWWWWWW', 'WWWWWWWWW', 'WWWWWWWWWW',
            
            // L's - more frequent
            'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L',
            'LL', 'LL', 'LL', 'LL', 'LL', 'LL', 'LL', 'LL', 'LL', 'LL',
            'LLL', 'LLL', 'LLL', 'LLL', 'LLL', 'LLL', 'LLL', 'LLL', 'LLL', 'LLL',
            'LLLL', 'LLLL', 'LLLL', 'LLLL', 'LLLL', 'LLLL', 'LLLL', 'LLLL', 'LLLL', 'LLLL',
            'LLLLL', 'LLLLL', 'LLLLL', 'LLLLL', 'LLLLL', 'LLLLL', 'LLLLL', 'LLLLL', 'LLLLL', 'LLLLL',
            'LLLLLL', 'LLLLLLL', 'LLLLLLLL', 'LLLLLLLLL', 'LLLLLLLLLL',
            
            // LETS GOOO variations
            'LETS GOOO', 'LETS GOOOOO', 'LETS GOOOOOO', 'LETS GOOOOOOO', 'LETS GOOOOOOOO',
            
            // Other reactions
            'LMAO', 'LMAOO', 'LMAOOO', 'LMAOOOO', 'LMAOOOOO',
            'LOL', 'LOOL', 'LOOOL', 'LOOOOL', 'LOOOOOL',
            'POG', 'POGGERS', 'POGGIES', 'POGCHAMP', 'POGGERS',
            'EZ', 'EZZ', 'EZZZ', 'EZZZZ', 'EZZZZZ',
            'GG', 'GGG', 'GGGG', 'GGGGG', 'GGGGGG',
            'WP', 'WPP', 'WPPP', 'WPPPP', 'WPPPPP',
            'NICE', 'NICEE', 'NICEEE', 'NICEEEE', 'NICEEEEE',
            'SHEESH', 'SHEESHH', 'SHEESHHH', 'SHEESHHHH', 'SHEESHHHHH'
        ];

        // Game-specific messages
        this.gameMessages = [
            'nice shot', 'great aim', 'perfect timing', 'clutch play', 'amazing save',
            'that was clean', 'smooth movement', 'insane reflexes', 'god tier play', 'absolute unit',
            'carried the team', 'MVP performance', 'unreal skills', 'cracked at this game', 'gaming god',
            'perfect execution', 'flawless play', 'masterclass', 'highlight reel material', 'clip that',
            'game sense on point', 'positioning was perfect', 'communication was great', 'teamwork makes the dream work',
            'that strat was genius', 'big brain play', '200 IQ move', 'outplayed', 'skill gap',
            'ranked ready', 'pro level', 'esports material', 'tournament worthy', 'championship play',
            'meta breaking', 'new meta', 'meta slave', 'off meta', 'experimental build',
            'nerf this', 'buff that', 'broken character', 'overpowered', 'underpowered',
            'skill issue', 'git gud', 'get good', 'practice more', 'training arc',
            'rage quit incoming', 'salt levels rising', 'tilted', 'tilted beyond belief', 'maximum tilt',
            'uninstall', 'delete game', 'game is trash', 'worst game ever', 'best game ever',
            'patch notes when', 'update when', 'devs please', 'fix this', 'bug report',
            'lag', 'ping', 'fps drop', 'server issues', 'connection problems',
            'smurf account', 'alt account', 'main account', 'ranked anxiety', 'placement matches'
        ];

        // Set initial messages to all messages
        this.messages = this.allMessages;

        // Load emotes
        this.emotes = [
            { name: 'kappa', file: 'kappa.png' },
            { name: 'dude', file: 'dude.png' },
            { name: 'brocmon', file: 'brocmon.png' },
            { name: 'baby', file: 'baby.png' },
            { name: 'joseppi', file: 'joseppi.png' },
            { name: 'issaccry', file: 'issaccry.png' },
            { name: 'trihex', file: 'trihex.png' }
        ];

        console.log(`Successfully loaded ${this.usernames.length} usernames and ${this.allMessages.length} total messages`);
        console.log('Sample usernames:', this.usernames.slice(0, 5));
        console.log('Sample messages:', this.allMessages.slice(0, 5));
        console.log(`Loaded ${this.emotes.length} emotes`);
    }

    setupEventListeners() {
        this.speedSlider.addEventListener('input', (e) => {
            this.currentSpeed = parseInt(e.target.value);
            this.speedValue.textContent = (this.currentSpeed / 1000).toFixed(1) + 's';
            this.updateViewerCount();
            
            if (this.isRunning) {
                this.stopChat();
                this.startChat();
            }
        });

        this.messageType.addEventListener('change', (e) => {
            switch(e.target.value) {
                case 'random':
                    this.messages = this.allMessages;
                    break;
                case 'simple':
                    this.messages = this.simpleMessages;
                    break;
                case 'game':
                    this.messages = this.gameMessages;
                    break;
            }
        });

        this.toggleBtn.addEventListener('click', () => {
            this.toggleChat();
        });

        this.clearBtn.addEventListener('click', () => {
            this.clearChat();
        });

        // Add click event for viewer count
        this.viewerCount.addEventListener('click', () => {
            this.cycleViewerState();
        });

        // Add emote toggle event
        this.emoteToggle.addEventListener('change', (e) => {
            this.emotesEnabled = e.target.checked;
        });
    }

    toggleChat() {
        if (this.isRunning) {
            this.stopChat();
        } else {
            this.startChat();
        }
    }

    startChat() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.toggleBtn.textContent = 'Stop Chat';
        this.updateViewerCount();
        
        // Schedule first message
        this.scheduleNextMessage();
    }

    stopChat() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        this.toggleBtn.textContent = 'Start Chat';
        this.updateViewerCount();
        
        if (this.intervalId) {
            clearTimeout(this.intervalId);
            this.intervalId = null;
        }
    }

    addRandomMessage() {
        if (this.usernames.length === 0 || this.messages.length === 0) {
            console.warn('No usernames or messages loaded');
            return;
        }

        const randomUsername = this.usernames[Math.floor(Math.random() * this.usernames.length)];
        const randomColor = Math.floor(Math.random() * 16);

        // Decide if this should be an emote message or text message
        let messageContent;
        if (this.emotesEnabled && Math.random() < 0.15) { // 15% chance for emote
            messageContent = this.getRandomEmote();
        } else {
            messageContent = this.messages[Math.floor(Math.random() * this.messages.length)];
        }

        this.createMessageElement(randomUsername, messageContent, randomColor);
        this.messageCount++;
        
        // Only update message counter if element exists
        if (this.messageCounter) {
            this.messageCounter.textContent = this.messageCount;
        }
        
        this.autoScroll();
    }

    getRandomEmote() {
        const randomEmote = this.emotes[Math.floor(Math.random() * this.emotes.length)];
        return { type: 'emote', emote: randomEmote };
    }

    createMessageElement(username, message, colorIndex) {
        // Use document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        
        const usernameSpan = document.createElement('span');
        usernameSpan.className = 'username';
        usernameSpan.textContent = username;
        usernameSpan.setAttribute('data-color', colorIndex);
        
        const messageSpan = document.createElement('span');
        messageSpan.className = 'message-text';
        
        // Handle emote or text message
        if (message && message.type === 'emote') {
            const emoteImg = document.createElement('img');
            emoteImg.className = 'emote';
            emoteImg.src = `emotes/${message.emote.file}`;
            emoteImg.alt = message.emote.name;
            messageSpan.appendChild(emoteImg);
        } else {
            messageSpan.textContent = message;
        }
        
        messageDiv.appendChild(usernameSpan);
        messageDiv.appendChild(messageSpan);
        
        fragment.appendChild(messageDiv);
        this.chatMessages.appendChild(fragment);
        
        // Batch DOM cleanup - only remove old messages occasionally
        if (this.messageCount % 20 === 0) {
            this.cleanupOldMessages();
        }
    }

    cleanupOldMessages() {
        const messages = this.chatMessages.querySelectorAll('.message');
        if (messages.length > 80) {
            // Remove multiple messages at once for better performance
            const messagesToRemove = messages.length - 80;
            for (let i = 0; i < messagesToRemove; i++) {
                messages[i].remove();
            }
        }
    }

    clearChat() {
        this.chatMessages.innerHTML = '';
        this.messageCount = 0;
        
        // Only update message counter if element exists
        if (this.messageCounter) {
            this.messageCounter.textContent = '0';
        }
    }

    autoScroll() {
        // Throttle scrolling for better performance
        if (!this.scrollScheduled) {
            this.scrollScheduled = true;
            requestAnimationFrame(() => {
                // Use scrollTo for smoother scrolling
                this.chatMessages.scrollTo({
                    top: this.chatMessages.scrollHeight,
                    behavior: 'auto' // Use 'auto' instead of 'smooth' for better performance
                });
                this.scrollScheduled = false;
            });
        }
    }

    scheduleNextMessage() {
        if (!this.isRunning) return;
        
        // Add subtle randomness to timing (±20% of base speed)
        const randomFactor = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2
        const randomDelay = Math.floor(this.currentSpeed * randomFactor);
        
        // Rarely add small extra delay for subtle variation
        const extraDelay = Math.random() < 0.1 ? Math.floor(Math.random() * 500) : 0; // 10% chance of small extra delay
        
        const totalDelay = randomDelay + extraDelay;
        
        this.intervalId = setTimeout(() => {
            // Batch multiple messages for high speeds
            if (this.currentSpeed < 100) {
                this.addBatchMessages();
            } else {
                this.addRandomMessage();
            }
            this.scheduleNextMessage(); // Schedule the next message
        }, totalDelay);
    }

    addBatchMessages() {
        // Add 2-4 messages at once for very high speeds
        const batchSize = Math.floor(Math.random() * 3) + 2; // 2-4 messages
        for (let i = 0; i < batchSize; i++) {
            this.addRandomMessage();
        }
    }

    updateViewerCount() {
        if (this.viewerState === 2) {
            // Hidden state - don't update
            return;
        }

        if (!this.isRunning) {
            if (this.viewerState === 0) {
                this.viewerCount.textContent = '10 viewers';
            } else if (this.viewerState === 1) {
                this.viewerCount.textContent = 'Live';
            }
            return;
        }

        // Calculate viewer count based on speed
        // Faster speed = more viewers
        const minViewers = 5;
        const maxViewers = 2400;
        
        // Map speed to viewer count (25ms = max viewers, 3000ms = min viewers)
        const speedRange = 3000 - 25; // 2975ms range
        const currentSpeedOffset = this.currentSpeed - 25; // How far from fastest speed
        const speedPercentage = currentSpeedOffset / speedRange; // 0 = fastest, 1 = slowest
        
        let viewerCount = Math.floor(maxViewers - (speedPercentage * (maxViewers - minViewers)));
        
        // Add some randomness (±10%)
        const randomFactor = 0.9 + (Math.random() * 0.2); // 0.9 to 1.1
        viewerCount = Math.floor(viewerCount * randomFactor);
        
        // Ensure within bounds
        viewerCount = Math.max(minViewers, Math.min(viewerCount, maxViewers));
        
        // Format based on state
        if (this.viewerState === 0) {
            this.viewerCount.textContent = viewerCount.toLocaleString() + ' viewers';
        } else if (this.viewerState === 1) {
            this.viewerCount.textContent = 'Live';
        }
    }

    cycleViewerState() {
        this.viewerState = (this.viewerState + 1) % 3;
        
        if (this.viewerState === 0) {
            // Normal state - show viewer count and dot
            this.viewerCount.style.display = 'inline';
            this.liveDot.style.display = 'block';
            this.updateViewerCount();
        } else if (this.viewerState === 1) {
            // "Live" state - show "Live" and dot
            this.viewerCount.style.display = 'inline';
            this.liveDot.style.display = 'block';
            this.viewerCount.textContent = 'Live';
        } else if (this.viewerState === 2) {
            // Hidden state - hide both
            this.viewerCount.style.display = 'none';
            this.liveDot.style.display = 'none';
        }
    }

    // Add some initial messages to make it look more realistic
    addInitialMessages() {
        if (this.usernames.length === 0 || this.messages.length === 0) {
            console.warn('Cannot add initial messages - no data loaded');
            return;
        }

        const initialMessages = [
            { username: 'Nightbot', message: 'Welcome to the chat!', color: 0 },
            { username: this.usernames[Math.floor(Math.random() * this.usernames.length)], 
              message: this.messages[Math.floor(Math.random() * this.messages.length)], 
              color: Math.floor(Math.random() * 16) },
            { username: this.usernames[Math.floor(Math.random() * this.usernames.length)], 
              message: this.messages[Math.floor(Math.random() * this.messages.length)], 
              color: Math.floor(Math.random() * 16) },
            { username: this.usernames[Math.floor(Math.random() * this.usernames.length)], 
              message: this.messages[Math.floor(Math.random() * this.messages.length)], 
              color: Math.floor(Math.random() * 16) }
        ];

        initialMessages.forEach(({ username, message, color }) => {
            this.createMessageElement(username, message, color);
        });
    }
}

// Initialize the simulator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const simulator = new TwitchChatSimulator();
    
    // Add some initial messages after data is loaded
    setTimeout(() => {
        simulator.addInitialMessages();
        // Start the chat automatically
        simulator.startChat();
    }, 1000);
});
