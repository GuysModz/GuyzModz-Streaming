const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const VIDKING_BASE_URL = 'https://www.vidking.net/embed';

// API key injected at build time from TMDB_API_KEY env variable
const DEFAULT_API_KEY = '%%TMDB_API_KEY%%';

function getApiKey() {
    if (DEFAULT_API_KEY && DEFAULT_API_KEY !== '%%TMDB_API_KEY%%') return DEFAULT_API_KEY;
    return localStorage.getItem('tmdb_api_key') || null;
}

// Get URL params
const urlParams = new URLSearchParams(window.location.search);
const type  = urlParams.get('type');
const id    = urlParams.get('id');
const title = urlParams.get('title');

let currentMedia = { type, id, season: 1, episode: 1 };

// DOM refs
const fullscreenPlayer = document.getElementById('fullscreen-player');
const playerOverlay    = document.getElementById('player-overlay');
const overlayTitle     = document.getElementById('overlay-title');
const overlaySubtitle  = document.getElementById('overlay-subtitle');
const overlayBottom    = document.getElementById('overlay-bottom');
const seasonSelect     = document.getElementById('season-select');
const episodeSelect    = document.getElementById('episode-select');
const loadingScreen    = document.getElementById('loading-screen');

// ─── Auto-hide overlay logic ───────────────────────────────
let hideTimer = null;

function showOverlay() {
    playerOverlay.classList.remove('hidden');
    document.body.classList.remove('hide-cursor');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideOverlay, 3000);
}

function hideOverlay() {
    playerOverlay.classList.add('hidden');
    document.body.classList.add('hide-cursor');
}

document.addEventListener('mousemove', showOverlay);
document.addEventListener('touchstart', showOverlay);
document.addEventListener('keydown', showOverlay);

// Show overlay on load, then hide after 4s
setTimeout(hideOverlay, 4000);

// ─── Init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    if (!id) { window.location.href = 'index.html'; return; }

    overlayTitle.textContent = title || (type === 'movie' ? 'Movie' : 'TV Show');

    if (type === 'tv') {
        overlayBottom.classList.remove('hidden-controls');
        await loadTVDetails(id);
        if (seasonSelect.options.length > 0) {
            currentMedia.season = seasonSelect.options[0].value;
        }
    }

    if (episodeSelect.options.length > 0) {
        episodeSelect.value = '1';
    }

    loadIframe();

    // Hide loading after short delay
    setTimeout(() => loadingScreen.classList.add('hidden'), 800);

    // Season/episode listeners
    seasonSelect.addEventListener('change', () => {
        const opt = seasonSelect.options[seasonSelect.selectedIndex];
        const epCount = opt?.dataset.episodeCount || 24;
        populateEpisodeSelect(epCount);
        currentMedia.season  = seasonSelect.value;
        currentMedia.episode = 1;
        episodeSelect.value  = '1';
        updateSubtitle();
        loadIframe();
    });

    episodeSelect.addEventListener('change', () => {
        currentMedia.season  = seasonSelect.value;
        currentMedia.episode = episodeSelect.value;
        updateSubtitle();
        loadIframe();
    });
});

function updateSubtitle() {
    if (type === 'tv') {
        overlaySubtitle.textContent = `Season ${currentMedia.season}  ·  Episode ${currentMedia.episode}`;
    }
}

// ─── Load iframe ──────────────────────────────────────────
function loadIframe() {
    if (currentMedia.type === 'sports') {
        fullscreenPlayer.innerHTML = `
            <video id="live-player" controls autoplay style="width:100%;height:100%;background:#000;"></video>
        `;
        const video = document.getElementById('live-player');
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(currentMedia.id);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = currentMedia.id;
            video.addEventListener('loadedmetadata', () => video.play().catch(() => {}));
        }
    } else {
        let embedUrl = '';
        if (currentMedia.type === 'movie') {
            embedUrl = `${VIDKING_BASE_URL}/movie/${currentMedia.id}`;
        } else {
            embedUrl = `${VIDKING_BASE_URL}/tv/${currentMedia.id}/${currentMedia.season}/${currentMedia.episode}`;
        }
        fullscreenPlayer.innerHTML = `
            <iframe src="${embedUrl}" width="100%" height="100%" frameborder="0" allowfullscreen allow="autoplay; encrypted-media; fullscreen"></iframe>
        `;
    }
    updateSubtitle();
}

// ─── TMDB helpers ─────────────────────────────────────────
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
        populateSeasonSelect(seasons.length ? seasons : tvData.seasons, true);
    } else {
        populateSeasonSelect(5);
    }
}

function populateSeasonSelect(data, isArray = false) {
    seasonSelect.innerHTML = '';
    if (isArray) {
        data.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.season_number;
            opt.textContent = s.name || `Season ${s.season_number}`;
            opt.dataset.episodeCount = s.episode_count;
            seasonSelect.appendChild(opt);
        });
        populateEpisodeSelect(data[0]?.episode_count || 24);
    } else {
        const count = typeof data === 'number' ? data : 5;
        for (let i = 1; i <= count; i++) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = `Season ${i}`;
            opt.dataset.episodeCount = 24;
            seasonSelect.appendChild(opt);
        }
        populateEpisodeSelect(24);
    }
}

function populateEpisodeSelect(count = 24) {
    episodeSelect.innerHTML = '';
    const max = parseInt(count) || 24;
    for (let i = 1; i <= max; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `Episode ${i}`;
        episodeSelect.appendChild(opt);
    }
}
