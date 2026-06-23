// ── Config ──────────────────────────────────────────────────
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Single working embed source
function getEmbedUrl(type, id, season, episode) {
    return type === 'movie'
        ? `https://www.vidking.net/embed/movie/${id}`
        : `https://www.vidking.net/embed/tv/${id}/${season}/${episode}`;
}

// API key injected at build time from TMDB_API_KEY env variable
const DEFAULT_API_KEY = 'b80a71388447e647e1ff09bd1fd41a4f';
function normalizeApiKey(key) {
    if (!key) return null;
    return String(key)
        .trim()
        .replace(/^Bearer\s+/i, '')
        .replace(/^['\"]|['\"]$/g, '')
        .trim();
}

function getApiKey() {
    const injected = normalizeApiKey(DEFAULT_API_KEY);
    if (injected && injected !== '%%TMDB_API_KEY%%') return injected;
    return normalizeApiKey(localStorage.getItem('tmdb_api_key'));
}

// ── URL params ──────────────────────────────────────────────
const urlParams = new URLSearchParams(window.location.search);
const mediaType  = urlParams.get('type');
const mediaId    = urlParams.get('id');
const mediaTitle = urlParams.get('title') || (mediaType === 'movie' ? 'Movie' : mediaType === 'sports' ? 'Live Stream' : 'TV Show');
const urlSeason  = parseInt(urlParams.get('season') || '1', 10);
const urlEpisode = parseInt(urlParams.get('episode') || '1', 10);

let currentMedia = {
    type: mediaType,
    id: mediaId,
    season: Number.isFinite(urlSeason) && urlSeason > 0 ? urlSeason : 1,
    episode: Number.isFinite(urlEpisode) && urlEpisode > 0 ? urlEpisode : 1
};
let isPlaying = true; // cosmetic state
let isMuted   = false;
let fakeTime  = 0;
let fakeDuration = 0;
let fakeTimer = null;

// ── DOM refs ─────────────────────────────────────────────────
const videoWrap    = document.getElementById('video-wrap');
const overlay      = document.getElementById('overlay');
const loadScreen   = document.getElementById('loading-screen');
const loadTitle    = document.getElementById('load-title');
const titleMain    = document.getElementById('title-main');
const titleSub     = document.getElementById('title-sub');
const tvControls   = document.getElementById('tv-controls');
const seasonSel    = document.getElementById('season-select');
const episodeSel   = document.getElementById('episode-select');
const playBtn      = document.getElementById('play-btn');
const playIcon     = document.getElementById('play-icon');
const volIcon      = document.getElementById('vol-icon');
const volSlider    = document.getElementById('vol-slider');
const timeDisplay  = document.getElementById('time-display');
const progressFill = document.getElementById('fake-progress-fill');
const fakeProgress = document.getElementById('fake-progress');

// ── Auto-hide overlay ────────────────────────────────────────
let hideTimer = null;

function showOverlay() {
    overlay.classList.remove('hidden');
    document.body.classList.remove('hide-cursor');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideOverlay, 3500);
}
function hideOverlay() {
    overlay.classList.add('hidden');
    document.body.classList.add('hide-cursor');
}

document.addEventListener('mousemove',  showOverlay);
document.addEventListener('touchstart', showOverlay, { passive: true });
document.addEventListener('keydown',    showOverlay);

// ── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    if (!mediaId) { window.location.href = 'index.html'; return; }

    loadTitle.textContent = mediaTitle;
    titleMain.textContent = mediaTitle;

    if (mediaType === 'tv') {
        tvControls.classList.remove('hidden');
        await loadTVDetails(mediaId);
        if (seasonSel.options.length) {
            const wantedSeason = String(currentMedia.season);
            seasonSel.value = [...seasonSel.options].some(opt => opt.value === wantedSeason)
                ? wantedSeason
                : seasonSel.options[0].value;
            currentMedia.season = parseInt(seasonSel.value, 10);

            const selectedSeason = seasonSel.options[seasonSel.selectedIndex];
            populateEpisodes(parseInt(selectedSeason?.dataset.episodeCount, 10) || 24);

            const wantedEpisode = String(currentMedia.episode);
            episodeSel.value = [...episodeSel.options].some(opt => opt.value === wantedEpisode)
                ? wantedEpisode
                : '1';
            currentMedia.episode = parseInt(episodeSel.value, 10);
        }
        updateSubtitle();
    }

    loadIframe();
    startFakeProgress();

    // Dismiss loading after bar fills
    setTimeout(() => loadScreen.classList.add('out'), 1300);
    // Auto-hide overlay after 4s
    setTimeout(hideOverlay, 4000);

    // Season / episode
    seasonSel.addEventListener('change', () => {
        const opt = seasonSel.options[seasonSel.selectedIndex];
        populateEpisodes(parseInt(opt?.dataset.episodeCount) || 24);
        currentMedia.season  = parseInt(seasonSel.value);
        currentMedia.episode = 1;
        episodeSel.value = '1';
        updateSubtitle();
        loadIframe();
        resetFakeProgress();
    });
    episodeSel.addEventListener('change', () => {
        currentMedia.season  = parseInt(seasonSel.value);
        currentMedia.episode = parseInt(episodeSel.value);
        updateSubtitle();
        loadIframe();
        resetFakeProgress();
    });

    // Volume slider (cosmetic)
    volSlider.addEventListener('input', () => {
        const v = parseInt(volSlider.value);
        isMuted = v === 0;
        updateVolIcon(v);
    });

    // Fake progress click to seek (cosmetic)
    fakeProgress.addEventListener('click', (e) => {
        const rect = fakeProgress.getBoundingClientRect();
        const pct  = (e.clientX - rect.left) / rect.width;
        if (fakeDuration > 0) {
            fakeTime = pct * fakeDuration;
            updateTimeDisplay();
            progressFill.style.width = (pct * 100) + '%';
        }
    });
});

// ── Iframe loader ─────────────────────────────────────────────
function loadIframe() {
    if (currentMedia.type === 'sports') {
        videoWrap.innerHTML = `<video id="live-video" autoplay controls style="width:100%;height:100%;background:#000;"></video>`;
        const vid = document.getElementById('live-video');
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(currentMedia.id);
            hls.attachMedia(vid);
            hls.on(Hls.Events.MANIFEST_PARSED, () => vid.play().catch(() => {}));
        } else if (vid.canPlayType('application/vnd.apple.mpegurl')) {
            vid.src = currentMedia.id;
        }
        return;
    }

    const url = getEmbedUrl(currentMedia.type, currentMedia.id, currentMedia.season, currentMedia.episode);
    videoWrap.innerHTML = `
        <iframe
            src="${url}"
            width="100%" height="100%"
            frameborder="0"
            allowfullscreen
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            referrerpolicy="no-referrer"
        ></iframe>
    `;
}

function reloadPlayer() {
    loadIframe();
    resetFakeProgress();
}

// ── Fake cosmetic controls ────────────────────────────────────
function startFakeProgress() {
    // Randomize a fake duration (between 85 and 150 min for movies, 40-60 for TV)
    fakeDuration = (currentMedia.type === 'movie' ? (85 + Math.random() * 65) : (40 + Math.random() * 20)) * 60;
    fakeTime = 0;
    clearInterval(fakeTimer);
    fakeTimer = setInterval(() => {
        if (!isPlaying) return;
        fakeTime++;
        updateTimeDisplay();
        if (fakeDuration > 0) {
            progressFill.style.width = Math.min((fakeTime / fakeDuration) * 100, 100) + '%';
        }
    }, 1000);
}

function resetFakeProgress() {
    fakeTime = 0;
    progressFill.style.width = '0%';
    clearInterval(fakeTimer);
    setTimeout(startFakeProgress, 800);
}

function updateTimeDisplay() {
    const fmt = s => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
    timeDisplay.textContent = `${fmt(fakeTime)} / ${fakeDuration > 0 ? fmt(fakeDuration) : '--:--'}`;
}

function updateVolIcon(val) {
    if (val === 0)       volIcon.className = 'fa-solid fa-volume-xmark';
    else if (val < 50)   volIcon.className = 'fa-solid fa-volume-low';
    else                 volIcon.className = 'fa-solid fa-volume-high';
}

function toggleMute() {
    isMuted = !isMuted;
    volSlider.value = isMuted ? 0 : 100;
    updateVolIcon(isMuted ? 0 : 100);
}

// Play/pause button — overlay only.
// IMPORTANT: Do NOT forward clicks into the iframe.
// Third-party embed providers often use the first iframe clicks to open ads/popups.
// Keeping this button cosmetic prevents extra ad triggers from our custom controls.
playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    playIcon.className = isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
});

// Fullscreen
function toggleFullscreen() {
    const fsIcon = document.querySelector('#fs-btn i');
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        if (fsIcon) fsIcon.className = 'fa-solid fa-compress';
    } else {
        document.exitFullscreen();
        if (fsIcon) fsIcon.className = 'fa-solid fa-expand';
    }
}
document.addEventListener('fullscreenchange', () => {
    const fsIcon = document.querySelector('#fs-btn i');
    if (fsIcon) fsIcon.className = document.fullscreenElement ? 'fa-solid fa-compress' : 'fa-solid fa-expand';
});

// ── Subtitle helper ───────────────────────────────────────────
function updateSubtitle() {
    if (currentMedia.type === 'tv') {
        titleSub.textContent = `Season ${currentMedia.season}  ·  Episode ${currentMedia.episode}`;
    }
}

// ── TMDB helpers ──────────────────────────────────────────────
async function fetchFromTMDB(endpoint) {
    const key = getApiKey();
    if (!key) return null;
    try {
        const sep = endpoint.includes('?') ? '&' : '?';
        const res = await fetch(`${TMDB_BASE_URL}${endpoint}${sep}api_key=${key}&language=en-US`);
        if (!res.ok) throw new Error(`TMDB ${res.status}`);
        return await res.json();
    } catch (e) { console.error(e); return null; }
}

async function loadTVDetails(tvId) {
    const tvData = await fetchFromTMDB(`/tv/${tvId}`);
    if (tvData?.seasons) {
        const seasons = tvData.seasons.filter(s => s.season_number > 0);
        populateSeasons(seasons.length ? seasons : tvData.seasons, true);
    } else {
        populateSeasons(5, false);
    }
}

function populateSeasons(data, isArray) {
    seasonSel.innerHTML = '';
    if (isArray) {
        data.forEach(s => {
            const o = document.createElement('option');
            o.value = s.season_number;
            o.textContent = s.name || `Season ${s.season_number}`;
            o.dataset.episodeCount = s.episode_count;
            seasonSel.appendChild(o);
        });
        populateEpisodes(parseInt(data[0]?.episode_count) || 24);
    } else {
        const n = typeof data === 'number' ? data : 5;
        for (let i = 1; i <= n; i++) {
            const o = document.createElement('option');
            o.value = i; o.textContent = `Season ${i}`; o.dataset.episodeCount = 24;
            seasonSel.appendChild(o);
        }
        populateEpisodes(24);
    }
}

function populateEpisodes(count = 24) {
    episodeSel.innerHTML = '';
    const max = parseInt(count) || 24;
    for (let i = 1; i <= max; i++) {
        const o = document.createElement('option');
        o.value = i; o.textContent = `Ep ${i}`;
        episodeSel.appendChild(o);
    }
}
