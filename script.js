// script.js
// Loads track metadata from service/music.json and plays files from music/ with optional covers in cover/.
// Expected service/music.json format:
// [
//   { "file": "track1.mp3", "title": "Song Title", "artist": "Artist Name", "cover": "cover/track1.jpg" },
//   { "file": "track2.mp3", "title": "Another Song", "artist": "Artist 2" }
// ]

// --- state ---
let playlist = []; // { file, title, artist, cover }
let current = 0;
let isPlaying = false;
let repeat = false;

// --- elements ---
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

// --- helpers ---
function formatTime(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

function safePrefixFile(filePath, folder = 'music/') {
  if (!filePath) return '';
  return (filePath.startsWith('http://') || filePath.startsWith('https://') || filePath.startsWith(folder))
    ? filePath
    : folder + filePath;
}

// --- apply metadata to player ---
function applyTrackMeta(index) {
  if (!playlist.length) return;
  current = ((index % playlist.length) + playlist.length) % playlist.length; // wrap
  const item = playlist[current];
  const src = safePrefixFile(item.file, 'music/');
  audio.src = src;
  trackTitle.textContent = item.title || src.split('/').pop();
  trackArtist.textContent = item.artist || '';
  // cover handling
  if (item.cover) {
    coverImg.src = item.cover;
    coverImg.style.display = '';
    // if cover is missing the image element will hide via onerror (handled below)
  } else {
    // attempt to auto-match by filename (without extension)
    const name = src.split('/').pop().replace(/\.[^/.]+$/, '');
    coverImg.src = `cover/${name}.jpg`;
    coverImg.style.display = '';
    // onerror handler (tries .png then hides)
    coverImg.onerror = function tryPng() {
      // If we already tried png (i.e. endsWith .png), hide.
      if (this.src.endsWith('.png')) {
        this.style.display = 'none';
        this.onerror = null;
      } else {
        this.onerror = null; // remove current handler to avoid recursion
        this.src = `cover/${name}.png`;
        // new onerror will hide
        this.onerror = function () { this.style.display = 'none'; this.onerror = null; };
      }
    };
  }
  // playlist UI
  document.querySelectorAll('#playlist li').forEach((li, i) => li.classList.toggle('active', i === current));
  localStorage.setItem('om_current', current);
}

// --- playback controls ---
function playTrack() {
  return audio.play()
    .then(() => {
      isPlaying = true;
      playBtn.textContent = 'Pause';
    })
    .catch(e => {
      console.warn('Playback failed:', e);
    });
}
function pauseTrack() {
  audio.pause();
  isPlaying = false;
  playBtn.textContent = 'Play';
}

playBtn.addEventListener('click', () => (isPlaying ? pauseTrack() : playTrack()));
nextBtn.addEventListener('click', () => { applyTrackMeta(current + 1); playTrack(); });
prevBtn.addEventListener('click', () => { applyTrackMeta(current - 1); playTrack(); });

// --- audio events ---
audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    const pct = (audio.currentTime / audio.duration) * 100;
    seek.value = pct;
    curEl.textContent = formatTime(audio.currentTime);
    durEl.textContent = formatTime(audio.duration);
  }
});

audio.addEventListener('loadedmetadata', () => {
  durEl.textContent = formatTime(audio.duration);
});

seek.addEventListener('input', () => {
  if (audio.duration) audio.currentTime = (seek.value / 100) * audio.duration;
});

audio.addEventListener('ended', () => {
  if (repeat) {
    audio.currentTime = 0;
    playTrack();
    return;
  }
  applyTrackMeta(current + 1);
  playTrack();
});

audio.addEventListener('error', (ev) => {
  console.warn('Audio error loading', audio.src, ev);
  // try to advance to next track automatically
  applyTrackMeta(current + 1);
});

// --- playlist UI ---
function renderPlaylist() {
  playlistEl.innerHTML = '';
  if (!playlist.length) {
    const li = document.createElement('li');
    li.textContent = 'No tracks found. Create service/music.json with track entries.';
    playlistEl.appendChild(li);
    return;
  }
  playlist.forEach((p, i) => {
    const li = document.createElement('li');
    li.textContent = (p.title || p.file) + (p.artist ? ` — ${p.artist}` : '');
    li.tabIndex = 0;
    li.addEventListener('click', () => { applyTrackMeta(i); playTrack(); });
    li.addEventListener('keypress', (e) => { if (e.key === 'Enter') { applyTrackMeta(i); playTrack(); } });
    if (i === current) li.classList.add('active');
    playlistEl.appendChild(li);
  });
}

// --- shuffle & repeat ---
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

// --- load metadata from service/music.json ---
function loadMetadata() {
  fetch('service/music.json', { cache: 'no-store' })
    .then(res => {
      if (!res.ok) throw new Error('service/music.json not found');
      return res.json();
    })
    .then(data => {
      if (!Array.isArray(data)) throw new Error('Invalid metadata format: expected JSON array');
      playlist = data.map(it => ({
        file: it.file || it.filename || it.path || '',
        title: it.title || '',
        artist: it.artist || '',
        cover: it.cover || ''
      })).filter(it => it.file);
      const saved = parseInt(localStorage.getItem('om_current'), 10);
      if (!isNaN(saved) && saved >= 0 && saved < playlist.length) current = saved;
      renderPlaylist();
      if (playlist.length) applyTrackMeta(current);
    })
    .catch(err => {
      console.warn('Failed to load metadata:', err);
      playlistEl.innerHTML = '<li>No metadata found. Create service/music.json with track entries.</li>';
    });
}

// --- initialize ---
loadMetadata();
