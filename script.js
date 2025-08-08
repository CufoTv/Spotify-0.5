let playlist = [];
let current = 0;
let isPlaying = false;
let repeat = false;

const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const playlistEl = document.getElementById('playlist');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');
const seek = document.getElementById('seek');
const curEl = document.getElementById('cur');
const durEl = document.getElementById('dur');
const shuffleBtn = document.getElementById('shuffle');
const repeatBtn = document.getElementById('repeat');
const coverImg = document.getElementById('coverImg');

function formatTime(s) {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
}

function applyTrackMeta(index) {
    if (!playlist.length) return;
    current = ((index % playlist.length) + playlist.length) % playlist.length;
    const item = playlist[current];
    audio.src = item.file;
    trackTitle.textContent = item.title || item.file;
    trackArtist.textContent = item.artist || '';
    
    if (item.cover) {
        coverImg.src = item.cover;
        coverImg.style.display = '';
    } else {
        coverImg.style.display = 'none';
    }

    document.querySelectorAll('#playlist li').forEach((li, i) => li.classList.toggle('active', i === current));
}

function playTrack() {
    audio.play().then(() => {
        isPlaying = true;
        playBtn.textContent = 'Pause';
    }).catch(console.warn);
}

function pauseTrack() {
    audio.pause();
    isPlaying = false;
    playBtn.textContent = 'Play';
}

playBtn.addEventListener('click', () => (isPlaying ? pauseTrack() : playTrack()));
nextBtn.addEventListener('click', () => { applyTrackMeta(current + 1); playTrack(); });
prevBtn.addEventListener('click', () => { applyTrackMeta(current - 1); playTrack(); });

audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        seek.value = (audio.currentTime / audio.duration) * 100;
        curEl.textContent = formatTime(audio.currentTime);
        durEl.textContent = formatTime(audio.duration);
    }
});

seek.addEventListener('input', () => {
    if (audio.duration) audio.currentTime = (seek.value / 100) * audio.duration;
});

audio.addEventListener('ended', () => {
    if (repeat) {
        audio.currentTime = 0;
        playTrack();
    } else {
        applyTrackMeta(current + 1);
        playTrack();
    }
});

function renderPlaylist() {
    playlistEl.innerHTML = '';
    playlist.forEach((p, i) => {
        const li = document.createElement('li');
        li.textContent = `${p.title} — ${p.artist}`;
        li.addEventListener('click', () => { applyTrackMeta(i); playTrack(); });
        if (i === current) li.classList.add('active');
        playlistEl.appendChild(li);
    });
}

shuffleBtn.addEventListener('click', () => {
    for (let i = playlist.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
    }
    renderPlaylist();
    applyTrackMeta(0);
    playTrack();
});

repeatBtn.addEventListener('click', () => {
    repeat = !repeat;
    repeatBtn.textContent = repeat ? 'Repeat: ON' : 'Toggle Repeat';
});

function loadMetadata() {
    fetch('service/music.json')
        .then(res => res.json())
        .then(data => {
            playlist = data;
            renderPlaylist();
            applyTrackMeta(0);
        })
        .catch(err => {
            console.error('Failed to load music.json:', err);
        });
}

loadMetadata();
