document.addEventListener('DOMContentLoaded', () => {
    const MY_DISCORD_ID = '834054385746575380'; 

    const enterScreen = document.getElementById('enter-screen');
    const mainContent = document.getElementById('main-content');
    const bgMusic = document.getElementById('bg-music');
    const discordAvatar = document.getElementById('discord-avatar');
    const discordUsername = document.getElementById('discord-username');
    const discordPresence = document.getElementById('discord-presence');
    const discordStatusDot = document.getElementById('discord-status-dot');
    const DISCORD_CDN_URL = 'https://cdn.discordapp.com';
    
    bgMusic.volume = 0.5;

    enterScreen.addEventListener('click', () => {
        viewCounterBox.classList.remove('hidden');
        bgMusic.play();
        mainContent.classList.remove('hidden');
        musicPlayer.classList.remove('hidden');
        enterScreen.style.opacity = '0';
        setTimeout(() => {
            enterScreen.style.display = 'none';
        }, 500);
    });

    async function updateDiscordPresence() {
        try {
            const response = await fetch(`https://api.lanyard.rest/v1/users/${MY_DISCORD_ID}`);
            const data = await response.json();

            if (data.success) {
                const presenceData = data.data;
                
                if (discordStatusDot) {
                    discordStatusDot.className = `status-${presenceData.discord_status}`;
                }
                
                if (discordAvatar) {
                    discordAvatar.src = `${DISCORD_CDN_URL}/avatars/${MY_DISCORD_ID}/${presenceData.discord_user.avatar}.png`;
                }

               
                // 2. Cập nhật Tên
                if (discordUsername) {
                     discordUsername.innerText = presenceData.discord_user.username;
                }

                
                let presenceMsg = '';
                if (presenceData.listening_to_spotify) {
                    presenceMsg = `Listening to Spotify`;
                } 
                else if (presenceData.activities && presenceData.activities.length > 0) {
                    const activity = presenceData.activities[0];
                    if (activity.type === 0) presenceMsg = `Playing ${activity.name}`;
                    else if (activity.type === 4) presenceMsg = activity.state || 'Online';
                    else if (activity.type === 2) presenceMsg = `Listening to ${activity.name}`;
                    else presenceMsg = `Playing ${activity.name}`;
                }
                else {
                    const status = presenceData.discord_status;
                    if (status === 'online') presenceMsg = 'Online';
                    else if (status === 'idle') presenceMsg = 'Idle';
                    else if (status === 'dnd') presenceMsg = 'Do Not Disturb';
                    else if (status === 'offline') presenceMsg = 'Offline';
                    else presenceMsg = 'Unknown Status';
                }

                if (discordPresence) {
                    discordPresence.innerText = presenceMsg;
                }

            } else {
                if (discordUsername) discordUsername.innerText = 'User Not Found';
                if (discordPresence) discordPresence.innerText = 'Check ID';
            }
        } catch (error) {
            console.error("Lỗi API Lanyard:", error);
            if (discordUsername) discordUsername.innerText = 'Error';
        }
    }

    updateDiscordPresence();
    setInterval(updateDiscordPresence, 15000); 
    const titleFrames = [
        "@",       
        "@E", 
        "@Er", 
        "@Ery", 
        "@Eryx",   
        "@Ery", 
        "@Er", 
        "@E"       
    ];
    let frameIndex = 0;

    
    setInterval(() => {
        document.title = titleFrames[frameIndex];
        frameIndex = (frameIndex + 1) % titleFrames.length;
    }, 300);

    const musicPlayer = document.getElementById('music-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playPauseIcon = playPauseBtn.querySelector('i');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

   
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            bgMusic.currentTime = 0;
        });
    }

  
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            bgMusic.currentTime = bgMusic.duration; 
        });
    }
  
    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    
    
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds === Infinity) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return m + ":" + (s < 10 ? "0" : "") + s;
    }

    bgMusic.addEventListener('loadedmetadata', () => {
        totalTimeEl.innerText = formatTime(bgMusic.duration);
    });

    bgMusic.addEventListener('timeupdate', () => {
      
        currentTimeEl.innerText = formatTime(bgMusic.currentTime);
        
        if (bgMusic.duration) {
            totalTimeEl.innerText = formatTime(bgMusic.duration);
        }

        const pc = (bgMusic.currentTime / bgMusic.duration) * 100;
        progressBar.style.width = `${pc || 0}%`;
    });
    
    playPauseBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            playPauseIcon.className = 'fa-solid fa-pause';
        } else {
            bgMusic.pause();
            playPauseIcon.className = 'fa-solid fa-play';
        }
    });

 
    bgMusic.addEventListener('timeupdate', () => {
        currentTimeEl.innerText = formatTime(bgMusic.currentTime);
     
        const percent = (bgMusic.currentTime / bgMusic.duration) * 100;
        progressBar.style.width = `${percent}%`;
    });

   
    progressContainer.addEventListener('click', (e) => {
        const width = progressContainer.clientWidth; 
        const clickX = e.offsetX;                    
        const duration = bgMusic.duration;           
        bgMusic.currentTime = (clickX / width) * duration;
    });
   
    const viewCounterBox = document.getElementById('view-counter');
    const viewCountEl = document.getElementById('view-count');
    
   
    const myViewCounterID = 'eryx_bio_profile_2026'; 

    function updateViewCount() {
        fetch(`https://api.counterapi.dev/v1/${myViewCounterID}/visits/up`)
            .then(response => response.json())
            .then(data => {
                if (viewCountEl) {
                    const formatter = new Intl.NumberFormat('en-US', { 
                        notation: 'compact', 
                        compactDisplay: 'short' 
                    });
                    viewCountEl.innerText = formatter.format(data.count); 
                }
            })
            .catch(error => {
                console.error("Lỗi đếm view:", error);
            });
    }

    updateViewCount();
    const canvas = document.getElementById('snow-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const snowCount = 120;
    const snowflakes = [];

    for (let i = 0; i < snowCount; i++) {
        snowflakes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            opacity: Math.random() * 0.5 + 0.1,
            speedX: Math.random() * 1 - 0.5,
            speedY: Math.random() * 1.5 + 0.5,
            radius: Math.random() * 2 + 0.5
        });
    }

    function drawSnow() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'white';
        ctx.beginPath();
        for (let i = 0; i < snowCount; i++) {
            let f = snowflakes[i];
            ctx.globalAlpha = f.opacity;
            ctx.moveTo(f.x, f.y);
            ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2, true);
        }
        ctx.fill();
        moveSnow();
    }

    function moveSnow() {
        for (let i = 0; i < snowCount; i++) {
            let f = snowflakes[i];
            f.y += f.speedY;
            f.x += f.speedX;

            if (f.y > height) {
                f.y = 0;
                f.x = Math.random() * width;
            }
            if (f.x > width) f.x = 0;
            if (f.x < 0) f.x = width;
        }
    }

    function loopSnow() {
        drawSnow();
        requestAnimationFrame(loopSnow);
    }

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    loopSnow();
}
});

    
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault(); 
    });

    
    document.addEventListener('keydown', function(e) {
        
        if (
            e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) || 
            (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'i')) || 
            (e.ctrlKey && (e.key === 'U' || e.key === 'u')) || 
            (e.metaKey && e.altKey && (e.key === 'U' || e.key === 'u')) 
        ) {
            e.preventDefault(); 
            
       
            alert("Stop looking at my code"); 
        }
    });

    const consoleMessage = "%cStop looking at my code";
    const consoleStyle = "color: #ff0000; font-size: 40px; font-weight: bold; text-shadow: 2px 2px 4px #000000; font-family: 'Inter', sans-serif;";
    
    console.log(consoleMessage, consoleStyle);