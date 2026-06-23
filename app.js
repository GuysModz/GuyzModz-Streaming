const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const VIDKING_BASE_URL = 'https://www.vidking.net/embed';

// API key is injected at build time from TMDB_API_KEY environment variable
const DEFAULT_API_KEY = '';

function getApiKey() {
    // Use the key injected by Vercel at build time
    if (DEFAULT_API_KEY && DEFAULT_API_KEY !== '') return DEFAULT_API_KEY;
    // Fallback to localStorage for backwards compatibility
    const stored = localStorage.getItem('tmdb_api_key');
    if (stored) return stored;
    return null;
}

// ── DOM refs ──────────────────────────────────────────────
const navbar          = document.querySelector('.navbar');
const moviesGrid      = document.getElementById('movies-grid');
const showsGrid       = document.getElementById('shows-grid');
const playerModal     = document.getElementById('player-modal');
const closeModalBtn   = document.getElementById('close-modal');
const iframeContainer = document.getElementById('iframe-container');
const playerTitle     = document.getElementById('player-title');
const apiNotice       = document.getElementById('api-notice');
const addKeyBtn       = document.getElementById('add-key-btn');
const dismissNoticeBtn= document.getElementById('dismiss-notice');
const apiKeyModal     = document.getElementById('api-key-modal');
const closeKeyModalBtn= document.getElementById('close-key-modal');
const apiKeyInput     = document.getElementById('api-key-input');
const saveKeyBtn      = document.getElementById('save-key-btn');
const searchInput     = document.getElementById('search-input');

// ── State ─────────────────────────────────────────────────
let currentMedia = { type: 'movie', id: null, season: 1, episode: 1 };
let currentMoviesList = [];
let currentShowsList  = [];
let sportsChannels    = [];
let activeSportsFilter= 'all';
let searchFilter      = 'multi';
let searchTimeout     = null;
let currentDetailId   = null;
let currentDetailType = null;
let watchlist         = JSON.parse(localStorage.getItem('gm_watchlist') || '[]');
let watchHistory      = JSON.parse(localStorage.getItem('gm_history') || '[]');
let recentSearches    = JSON.parse(localStorage.getItem('gm_recent_searches') || '[]');

// ── Demo Data ─────────────────────────────────────────────
const demoMovies = [
    { id: 533535, title: "Deadpool & Wolverine", poster_path: "/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg", vote_average: 7.7, release_date: "2024-07-24" },
    { id: 1022789, title: "Inside Out 2", poster_path: "/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg", vote_average: 7.6, release_date: "2024-06-14" },
    { id: 653346, title: "Kingdom of the Planet of the Apes", poster_path: "/gKkl37BQuKTanygYQG1pyYgLVgf.jpg", vote_average: 6.9, release_date: "2024-05-08" },
    { id: 693134, title: "Dune: Part Two", poster_path: "/1pdfLvkbY9ohJlCjQH2IGpbRXYS.jpg", vote_average: 8.2, release_date: "2024-02-28" },
    { id: 929590, title: "Civil War", poster_path: "/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg", vote_average: 7.0, release_date: "2024-04-12" }
];
const demoShows = [
    { id: 76479, name: "The Boys", poster_path: "/2quzoptnn7GZ4Z1hsS220H1o748.jpg", vote_average: 8.5, first_air_date: "2019-07-26" },
    { id: 113988, name: "Fallout", poster_path: "/A3sD2kY0PZea8z7B38bV4Z83LhJ.jpg", vote_average: 8.4, first_air_date: "2024-04-11" },
    { id: 1396, name: "Breaking Bad", poster_path: "/3xnWaLQjelJDDF7LT1WBo6f4BRe.jpg", vote_average: 8.9, first_air_date: "2008-01-20" },
    { id: 66732, name: "Stranger Things", poster_path: "/49WJfeN0moxb9IPfGn8xkbjDSpw.jpg", vote_average: 8.6, first_air_date: "2016-07-15" },
    { id: 108978, name: "Reacher", poster_path: "/jBJWaqmbOKA6RQydME2TlwqICg2.jpg", vote_average: 8.1, first_air_date: "2022-02-04" }
];

// ── Init ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initScrollEffect();
    checkApiKey();
    setupEventListeners();
    loadLiveSports();
    renderRecentSearches();
});

function initScrollEffect() {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// ── API Key ───────────────────────────────────────────────
async function setApiKey(key) {
    const test = await fetch(`${TMDB_BASE_URL}/authentication?api_key=${key}`);
    if (!test.ok) { alert("Invalid API Key!"); return; }
    localStorage.setItem('tmdb_api_key', key);
    apiKeyModal.classList.remove('active');
    apiNotice.classList.remove('show');
    loadContent();
}

function checkApiKey() {
    const key = getApiKey();
    if (!key) {
        // Key is configured via environment variable - show demo content silently
        renderDemoContent();
    } else {
        loadContent();
    }
    // Hide the key button from navbar since key is hardcoded
    const keyBtn = document.getElementById('nav-key-btn');
    if (keyBtn) keyBtn.style.display = 'none';
    const apiNoticeEl = document.getElementById('api-notice');
    if (apiNoticeEl) apiNoticeEl.style.display = 'none';
}

// ── TMDB Fetch ────────────────────────────────────────────
async function fetchFromTMDB(endpoint) {
    const key = getApiKey();
    if (!key) return null;
    try {
        const sep = endpoint.includes('?') ? '&' : '?';
        const res = await fetch(`${TMDB_BASE_URL}${endpoint}${sep}api_key=${key}&language=en-US`);
        if (!res.ok) throw new Error(`TMDB Error: ${res.status}`);
        return await res.json();
    } catch (e) { console.error(e); return null; }
}

// ── Content Loading ───────────────────────────────────────
async function loadContent() {
    // Hero + Top10 + Trending from trending movies
    const moviesData = await fetchFromTMDB('/trending/movie/week');
    if (moviesData?.results) {
        currentMoviesList = moviesData.results;
        renderMovies();
        updateHero(moviesData.results[0], 'movie');
        renderTop10(moviesData.results.slice(0, 10));
        renderTrending(moviesData.results, 'movie');
    } else {
        renderDemoContent();
    }

    const showsData = await fetchFromTMDB('/trending/tv/week');
    if (showsData?.results) {
        currentShowsList = showsData.results;
        renderShows();
    }

    // Top rated movies default
    const topRatedMovies = await fetchFromTMDB('/movie/top_rated');
    if (topRatedMovies?.results) renderTopRated(topRatedMovies.results, 'movie');
}

function updateHero(item, type) {
    if (!item) return;
    const title = type === 'movie' ? item.title : item.name;
    const year  = (type === 'movie' ? item.release_date : item.first_air_date || '').split('-')[0];
    const rating = item.vote_average?.toFixed(1) || 'NR';

    document.getElementById('hero-title').textContent = title;
    document.getElementById('hero-overview').textContent = item.overview;
    document.getElementById('hero-rating-val').textContent = rating;
    document.getElementById('hero-year').textContent = year;
    document.getElementById('hero-type-badge').textContent = type === 'movie' ? 'Movie' : 'TV Show';
    if (item.backdrop_path) {
        document.getElementById('hero-backdrop').style.backgroundImage = `url(https://image.tmdb.org/t/p/original${item.backdrop_path})`;
    }
    document.getElementById('hero-watch-btn').onclick = () => openDetailPage(type, item.id, title);
    document.getElementById('hero-info-btn').onclick   = () => openDetailPage(type, item.id, title);

    const wlBtn = document.getElementById('hero-watchlist-btn');
    const inWL = watchlist.some(w => w.id == item.id);
    wlBtn.innerHTML = inWL ? '<i class="fa-solid fa-bookmark"></i> In Watchlist' : '<i class="fa-regular fa-bookmark"></i> Watchlist';
    wlBtn.onclick = () => toggleWatchlist({ id: item.id, title, type, poster_path: item.poster_path });
}

function renderDemoContent() {
    currentMoviesList = demoMovies;
    currentShowsList  = demoShows;
    renderMovies();
    renderShows();
    updateHero(demoMovies[0], 'movie');
    renderTop10(demoMovies);
    renderTrending(demoMovies, 'movie');
    renderTopRated(demoMovies, 'movie');
}

// ── Top 10 Row ────────────────────────────────────────────
function renderTop10(items) {
    const grid = document.getElementById('top10-grid');
    if (!grid) return;
    grid.innerHTML = items.slice(0, 10).map((item, i) => {
        const title = item.title || item.name;
        const type  = item.title ? 'movie' : 'tv';
        const year  = (item.release_date || item.first_air_date || '').split('-')[0];
        const rating = item.vote_average?.toFixed(1) || 'NR';
        const poster = item.poster_path ? `https://image.tmdb.org/t/p/w342${item.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Poster';
        return `
        <div class="top10-card" onclick="openDetailPage('${type}', '${item.id}', '${title.replace(/'/g,"\\'")}')">
            <div class="top10-rank">${String(i+1).padStart(2,'0')}</div>
            <div class="top10-poster-wrap">
                <img src="${poster}" alt="${title}" class="top10-poster" loading="lazy">
                <div class="play-overlay"><i class="fa-solid fa-circle-play"></i></div>
            </div>
            <div class="top10-info">
                <div class="media-title">${title}</div>
                <div class="media-meta">
                    <span class="rating"><i class="fa-solid fa-star"></i> ${rating}</span>
                    <span>${year}</span>
                    <span>${type === 'movie' ? 'Movie' : 'TV Show'}</span>
                </div>
            </div>
        </div>`;
    }).join('');
}

// ── Trending Wide Row ─────────────────────────────────────
function renderTrending(items, type) {
    const grid = document.getElementById('trending-grid');
    if (!grid) return;
    grid.innerHTML = items.slice(0, 8).map(item => {
        const title = item.title || item.name;
        const year  = (item.release_date || item.first_air_date || '').split('-')[0];
        const rating = item.vote_average?.toFixed(1) || 'NR';
        const backdrop = item.backdrop_path ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}` : (item.poster_path ? `https://image.tmdb.org/t/p/w342${item.poster_path}` : '');
        return `
        <div class="wide-card" onclick="openDetailPage('${type}', '${item.id}', '${title.replace(/'/g,"\\'")}')">
            <div class="wide-card-img" style="background-image: url('${backdrop}')">
                <div class="play-overlay"><i class="fa-solid fa-circle-play"></i></div>
            </div>
            <div class="wide-card-info">
                <div class="media-title">${title}</div>
                <div class="media-meta">
                    <span class="rating"><i class="fa-solid fa-star"></i> ${rating}</span>
                    <span>${year}</span>
                    <span>${type === 'movie' ? 'Movie' : 'TV Show'}</span>
                </div>
            </div>
        </div>`;
    }).join('');
}

// ── Top Rated Wide Row ────────────────────────────────────
function renderTopRated(items, type) {
    const grid = document.getElementById('toprated-grid');
    if (!grid) return;
    grid.innerHTML = items.slice(0, 8).map(item => {
        const title = item.title || item.name;
        const year  = (item.release_date || item.first_air_date || '').split('-')[0];
        const rating = item.vote_average?.toFixed(1) || 'NR';
        const backdrop = item.backdrop_path ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}` : (item.poster_path ? `https://image.tmdb.org/t/p/w342${item.poster_path}` : '');
        return `
        <div class="wide-card" onclick="openDetailPage('${type}', '${item.id}', '${title.replace(/'/g,"\\'")}')">
            <div class="wide-card-img" style="background-image: url('${backdrop}')">
                <div class="play-overlay"><i class="fa-solid fa-circle-play"></i></div>
            </div>
            <div class="wide-card-info">
                <div class="media-title">${title}</div>
                <div class="media-meta">
                    <span class="rating"><i class="fa-solid fa-star"></i> ${rating}</span>
                    <span>${year}</span>
                    <span>${type === 'movie' ? 'Movie' : 'TV Show'}</span>
                </div>
            </div>
        </div>`;
    }).join('');
}

// ── Standard Card Grids ───────────────────────────────────
function renderMediaCard(item, type) {
    const title  = type === 'movie' ? item.title : item.name;
    const date   = (type === 'movie' ? item.release_date : item.first_air_date || '').split('-')[0];
    const rating = item.vote_average ? item.vote_average.toFixed(1) : 'NR';
    const poster = item.poster_path
        ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
        : 'https://via.placeholder.com/342x513?text=No+Poster';
    return `
    <div class="media-card" onclick="openDetailPage('${type}', '${item.id}', '${title.replace(/'/g,"\\'")}')">
        <div class="poster-wrapper">
            <img src="${poster}" alt="${title}" class="poster" loading="lazy">
            <div class="play-overlay"><i class="fa-solid fa-circle-play"></i></div>
        </div>
        <div class="media-info">
            <div class="media-title">${title}</div>
            <div class="media-meta">
                <span>${date}</span>
                <span class="rating"><i class="fa-solid fa-star"></i> ${rating}</span>
            </div>
        </div>
    </div>`;
}

function renderMovies() {
    moviesGrid.innerHTML = currentMoviesList.slice(0, 10).map(m => renderMediaCard(m, 'movie')).join('');
    const btn = document.getElementById('see-all-movies');
    if (btn) btn.style.display = currentMoviesList.length > 10 ? 'flex' : 'none';
}
function renderShows() {
    showsGrid.innerHTML = currentShowsList.slice(0, 10).map(s => renderMediaCard(s, 'tv')).join('');
    const btn = document.getElementById('see-all-shows');
    if (btn) btn.style.display = currentShowsList.length > 10 ? 'flex' : 'none';
}

// ── DETAIL PAGE ───────────────────────────────────────────
window.openDetailPage = async function(type, id, titleHint) {
    currentDetailId   = id;
    currentDetailType = type;

    const detailPage = document.getElementById('detail-page');
    detailPage.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    // Set placeholder while loading
    document.getElementById('detail-title').textContent   = titleHint || 'Loading...';
    document.getElementById('detail-overview').textContent = '';
    document.getElementById('detail-rating').textContent   = '';
    document.getElementById('detail-year').textContent     = '';
    document.getElementById('detail-runtime').textContent  = '';
    document.getElementById('detail-poster').src           = '';
    document.getElementById('detail-backdrop').style.backgroundImage = '';
    document.getElementById('actors-grid').innerHTML        = '';
    document.getElementById('recommendations-grid').innerHTML = '';
    document.getElementById('detail-episodes-section').style.display = 'none';

    const key = getApiKey();
    if (!key) {
        // Demo mode - use demo data
        const item = type === 'movie' ? demoMovies.find(m=>m.id==id)||demoMovies[0] : demoShows.find(s=>s.id==id)||demoShows[0];
        fillDetailPage(item, type, null, [], []);
        return;
    }

    // Parallel fetch: details + credits + recommendations
    const [details, credits, recs] = await Promise.all([
        fetchFromTMDB(`/${type}/${id}`),
        fetchFromTMDB(`/${type}/${id}/credits`),
        fetchFromTMDB(`/${type}/${id}/recommendations`)
    ]);

    fillDetailPage(details, type, credits, recs?.results || [], details?.seasons || []);

    // Add to history
    if (details) {
        const title = details.title || details.name;
        addToHistory({ id, type, title, poster_path: details.poster_path });
    }
};

function fillDetailPage(details, type, credits, recs, seasons) {
    if (!details) return;
    const title   = details.title || details.name;
    const year    = (details.release_date || details.first_air_date || '').split('-')[0];
    const rating  = details.vote_average?.toFixed(1) || 'NR';
    const runtime = type === 'movie'
        ? (details.runtime ? `${Math.floor(details.runtime/60)}h ${details.runtime%60}m` : '')
        : (details.episode_run_time?.[0] ? `${details.episode_run_time[0]}m/ep` : '');
    const poster  = details.poster_path ? `https://image.tmdb.org/t/p/w342${details.poster_path}` : '';
    const backdrop= details.backdrop_path ? `https://image.tmdb.org/t/p/original${details.backdrop_path}` : '';

    document.getElementById('detail-title').textContent    = title;
    document.getElementById('detail-overview').textContent = details.overview || '';
    document.getElementById('detail-rating').textContent   = rating;
    document.getElementById('detail-year').textContent     = year;
    document.getElementById('detail-runtime').textContent  = runtime;
    document.getElementById('detail-type-label').textContent = type === 'movie' ? 'Movie' : 'TV Show';
    document.getElementById('detail-poster').src           = poster;
    if (backdrop) document.getElementById('detail-backdrop').style.backgroundImage = `url('${backdrop}')`;

    // Play button
    const playBtn = document.getElementById('detail-play-btn');
    playBtn.onclick = () => openPlayer(type, details.id, title);

    // Watchlist button
    const wlBtn = document.getElementById('detail-watchlist-btn');
    const inWL  = watchlist.some(w => w.id == details.id);
    wlBtn.innerHTML = inWL ? '<i class="fa-solid fa-bookmark"></i> In Watchlist' : '<i class="fa-regular fa-bookmark"></i> Watchlist';
    wlBtn.onclick   = () => { toggleWatchlist({ id: details.id, title, type, poster_path: details.poster_path }); fillDetailPage(details, type, credits, recs, seasons); };

    // Actors
    const actors = (credits?.cast || []).slice(0, 12);
    document.getElementById('actors-grid').innerHTML = actors.map(actor => {
        const photo = actor.profile_path
            ? `https://image.tmdb.org/t/p/w92${actor.profile_path}`
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(actor.name)}&background=333&color=fff&size=64`;
        return `
        <div class="actor-card">
            <img src="${photo}" alt="${actor.name}" class="actor-photo">
            <div class="actor-info">
                <div class="actor-name">${actor.name}</div>
                <div class="actor-char">${actor.character || ''}</div>
            </div>
        </div>`;
    }).join('');
    document.getElementById('actors-section').style.display = actors.length ? '' : 'none';

    // Recommendations
    document.getElementById('recommendations-grid').innerHTML = recs.slice(0, 12).map(r => renderMediaCard(r, r.title ? 'movie' : 'tv')).join('');
    document.getElementById('recommendations-section').style.display = recs.length ? '' : 'none';

    // TV Episodes
    if (type === 'tv' && seasons && seasons.length > 0) {
        const regularSeasons = seasons.filter(s => s.season_number > 0);
        const epSection = document.getElementById('detail-episodes-section');
        epSection.style.display = '';
        const seasonSel = document.getElementById('detail-season-select');
        seasonSel.innerHTML = regularSeasons.map(s => `<option value="${s.season_number}" data-count="${s.episode_count}">${s.name || 'Season '+s.season_number}</option>`).join('');
        loadEpisodes(details.id, regularSeasons[0]?.season_number || 1, regularSeasons[0]?.episode_count || 10);
        seasonSel.onchange = () => {
            const opt = seasonSel.options[seasonSel.selectedIndex];
            loadEpisodes(details.id, seasonSel.value, opt.dataset.count);
        };
    }
}

async function loadEpisodes(showId, seasonNum, episodeCount) {
    const epList = document.getElementById('detail-episodes-list');
    epList.innerHTML = '<div style="color:var(--text-muted); padding:1rem;"><i class="fa-solid fa-spinner fa-spin"></i> Loading episodes...</div>';

    const key = getApiKey();
    let episodes = [];
    if (key) {
        const data = await fetchFromTMDB(`/tv/${showId}/season/${seasonNum}`);
        episodes = data?.episodes || [];
    }

    if (episodes.length === 0) {
        // fallback: generate numbered episodes
        episodes = Array.from({ length: parseInt(episodeCount) || 10 }, (_, i) => ({
            episode_number: i + 1, name: `Episode ${i + 1}`, overview: '', still_path: null, runtime: null
        }));
    }

    epList.innerHTML = episodes.map((ep, idx) => {
        const still = ep.still_path ? `https://image.tmdb.org/t/p/w300${ep.still_path}` : '';
        const isFirst = idx === 0;
        return `
        <div class="episode-item ${isFirst ? 'episode-watching' : ''}" onclick="openPlayer('tv', ${showId}, '', ${seasonNum}, ${ep.episode_number})">
            ${isFirst ? '<span class="watching-badge"><i class="fa-solid fa-play"></i> WATCHING</span>' : ''}
            <div class="episode-num">${ep.episode_number}.</div>
            ${still ? `<img src="${still}" alt="ep${ep.episode_number}" class="episode-still" loading="lazy">` : ''}
            <div class="episode-text">
                <div class="episode-title">${ep.name}</div>
                <div class="episode-desc">${ep.overview ? ep.overview.substring(0,100)+'...' : ''}</div>
                ${ep.runtime ? `<div class="episode-runtime">${ep.runtime}m left</div>` : ''}
            </div>
        </div>`;
    }).join('');
}

function closeDetailPage() {
    document.getElementById('detail-page').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// ── Player ────────────────────────────────────────────────
let currentModalRequestId = 0;

window.openPlayer = function(type, id, title, season = 1, episode = 1) {
    const safeTitle = encodeURIComponent(title || (type === 'movie' ? 'Movie' : type === 'tv' ? 'TV Show' : 'Live Stream'));
    const safeId = encodeURIComponent(id);
    const url = `player.html?type=${encodeURIComponent(type)}&id=${safeId}&title=${safeTitle}&season=${encodeURIComponent(season)}&episode=${encodeURIComponent(episode)}`;
    window.location.href = url;
};

function loadIframe() {
    if (currentMedia.type === 'sports') {
        iframeContainer.innerHTML = `<video id="live-player" controls autoplay style="width:100%;height:100%;background:#000;border-radius:12px;"></video>`;
        const video = document.getElementById('live-player');
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(currentMedia.id);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(()=>{}));
            window.activeHlsInstance = hls;
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = currentMedia.id;
            video.addEventListener('loadedmetadata', () => video.play().catch(()=>{}));
        }
    } else {
        let embedUrl = '';
        if (currentMedia.type === 'movie') {
            embedUrl = `${VIDKING_BASE_URL}/movie/${currentMedia.id}`;
        } else {
            embedUrl = `${VIDKING_BASE_URL}/tv/${currentMedia.id}/${currentMedia.season}/${currentMedia.episode}`;
        }
        iframeContainer.innerHTML = `<iframe src="${embedUrl}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>`;
    }
}

function closePlayer() {
    playerModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    if (window.activeHlsInstance) { window.activeHlsInstance.destroy(); window.activeHlsInstance = null; }
    setTimeout(() => { if (!playerModal.classList.contains('active')) iframeContainer.innerHTML = ''; }, 300);
}

// ── Search ────────────────────────────────────────────────
function renderRecentSearches() {
    const list = document.getElementById('recent-searches-list');
    const section = document.getElementById('search-recent-section');
    if (!list) return;
    if (recentSearches.length === 0) { section.style.display = 'none'; return; }
    section.style.display = '';
    list.innerHTML = recentSearches.map(q => `
        <div class="recent-item" onclick="runSearch('${q.replace(/'/g,"\\'")}')">
            <i class="fa-regular fa-clock"></i> ${q}
        </div>`).join('');
}

function addRecentSearch(query) {
    recentSearches = [query, ...recentSearches.filter(q => q !== query)].slice(0, 5);
    localStorage.setItem('gm_recent_searches', JSON.stringify(recentSearches));
    renderRecentSearches();
}

async function liveSearch(query) {
    const key = getApiKey();
    const dropdown = document.getElementById('search-dropdown');
    const resultsList = document.getElementById('search-results-list');
    if (!query) { dropdown.classList.remove('show-results'); return; }

    dropdown.classList.add('show-results');
    resultsList.innerHTML = '<div class="search-loading"><i class="fa-solid fa-spinner fa-spin"></i></div>';

    if (!key) {
        // demo search
        const q = query.toLowerCase();
        const all = [...demoMovies, ...demoShows];
        const matches = all.filter(i => (i.title||i.name).toLowerCase().includes(q));
        resultsList.innerHTML = matches.length ? matches.slice(0,6).map(item => searchResultCard(item)).join('') : '<div class="no-results-small">No results found.</div>';
        return;
    }

    let endpoint = '/search/multi';
    if (searchFilter === 'movie') endpoint = '/search/movie';
    else if (searchFilter === 'tv' || searchFilter === 'anime') endpoint = '/search/tv';

    const data = await fetchFromTMDB(`${endpoint}?query=${encodeURIComponent(query)}`);
    const results = (data?.results || []).filter(r => r.poster_path && (r.media_type !== 'person')).slice(0, 8);
    resultsList.innerHTML = results.length ? results.map(item => searchResultCard(item)).join('') : '<div class="no-results-small">No results found.</div>';
}

function searchResultCard(item) {
    const type  = item.media_type || (item.title ? 'movie' : 'tv');
    const title = item.title || item.name;
    const year  = (item.release_date || item.first_air_date || '').split('-')[0];
    const poster = item.poster_path ? `https://image.tmdb.org/t/p/w92${item.poster_path}` : '';
    return `
    <div class="search-result-item" onclick="openDetailPage('${type}','${item.id}','${title.replace(/'/g,"\\'")}'); closeSearchDropdown();">
        ${poster ? `<img src="${poster}" alt="${title}" class="search-result-poster">` : '<div class="search-result-poster-ph"></div>'}
        <div class="search-result-info">
            <div class="search-result-title">${title}</div>
            <div class="search-result-meta">${year} · ${type === 'movie' ? 'Movie' : 'TV Show'}</div>
        </div>
    </div>`;
}

async function runSearch(query) {
    if (!query) return;
    searchInput.value = query;
    addRecentSearch(query);
    closeSearchDropdown();
    document.getElementById('search-dropdown').classList.remove('show-results');

    const key = getApiKey();
    const homeSections = document.getElementById('home-sections');
    const sportsSection = document.getElementById('sports-section');

    if (!key) {
        // No API key available in this build. Do a local/demo search instead of showing a blocking popup.
        const q = query.toLowerCase();
        currentMoviesList = demoMovies.filter(m => (m.title || '').toLowerCase().includes(q));
        currentShowsList = demoShows.filter(s => (s.name || '').toLowerCase().includes(q));
        renderMovies();
        renderShows();
        moviesGrid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    const moviesSearch = await fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}`);
    if (moviesSearch?.results) {
        currentMoviesList = moviesSearch.results.filter(m => m.poster_path);
        renderMovies();
    }
    const showsSearch = await fetchFromTMDB(`/search/tv?query=${encodeURIComponent(query)}`);
    if (showsSearch?.results) {
        currentShowsList = showsSearch.results.filter(s => s.poster_path);
        renderShows();
    }
    moviesGrid.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function closeSearchDropdown() {
    document.getElementById('search-dropdown').classList.remove('show-results');
}

// ── Watchlist & History ───────────────────────────────────
function toggleWatchlist(item) {
    const idx = watchlist.findIndex(w => w.id == item.id);
    if (idx >= 0) watchlist.splice(idx, 1);
    else watchlist.unshift(item);
    localStorage.setItem('gm_watchlist', JSON.stringify(watchlist));
}

function addToHistory(item) {
    watchHistory = [item, ...watchHistory.filter(h => h.id != item.id)].slice(0, 50);
    localStorage.setItem('gm_history', JSON.stringify(watchHistory));
}

function showWatchlist() {
    currentMoviesList = watchlist.filter(i => i.type === 'movie');
    currentShowsList  = watchlist.filter(i => i.type === 'tv');
    renderMovies(); renderShows();
    document.querySelector('.content-section:first-of-type h2') && (document.querySelector('#movies-grid').parentElement.querySelector('h2').textContent = 'Watchlist - Movies');
}

function showHistory() {
    currentMoviesList = watchHistory.filter(i => i.type === 'movie');
    currentShowsList  = watchHistory.filter(i => i.type === 'tv');
    renderMovies(); renderShows();
}

// ── Category Filter ───────────────────────────────────────
async function showCategory(type) {
    if (type === '4k') {
        const data = await fetchFromTMDB('/discover/movie?with_genres=28&sort_by=popularity.desc');
        if (data?.results) { currentMoviesList = data.results; renderMovies(); }
        setTimeout(() => document.getElementById('movies-grid')?.closest('.content-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        return;
    }
    if (type === 'anime') {
        const data = await fetchFromTMDB('/discover/tv?with_genres=16&sort_by=popularity.desc');
        if (data?.results) { currentShowsList = data.results; renderShows(); }
        setTimeout(() => document.getElementById('shows-grid')?.closest('.content-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        return;
    }
    const endpoint = type === 'movie' ? '/movie/popular' : '/tv/popular';
    const data = await fetchFromTMDB(endpoint);
    if (type === 'movie' && data?.results) { currentMoviesList = data.results; renderMovies(); }
    if (type === 'tv'    && data?.results) { currentShowsList  = data.results; renderShows(); }
    setTimeout(() => {
        const target = type === 'movie'
            ? document.getElementById('movies-grid')?.closest('.content-section')
            : document.getElementById('shows-grid')?.closest('.content-section');
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// ── Reset Home ────────────────────────────────────────────
function resetHome() {
    searchInput.value = '';
    checkApiKey();
}

// ── Browse Modal ──────────────────────────────────────────
function closeBrowse() {
    document.getElementById('browse-modal').classList.remove('active');
}

// ── Tab Switchers ─────────────────────────────────────────
document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    const section = btn.dataset.section;
    const type    = btn.dataset.type;
    btn.closest('.section-header').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (section === 'trending') {
        const endpoint = type === 'movie' ? '/trending/movie/week' : '/trending/tv/week';
        const data = await fetchFromTMDB(endpoint);
        if (data?.results) renderTrending(data.results, type);
        else renderTrending(type === 'movie' ? demoMovies : demoShows, type);
    } else if (section === 'toprated') {
        const endpoint = type === 'movie' ? '/movie/top_rated' : '/tv/top_rated';
        const data = await fetchFromTMDB(endpoint);
        if (data?.results) renderTopRated(data.results, type);
        else renderTopRated(type === 'movie' ? demoMovies : demoShows, type);
    }
});

// ── Live Sports ───────────────────────────────────────────
async function loadLiveSports() {
    const sportsGrid = document.getElementById('sports-grid');
    if (!sportsGrid) return;
    sportsGrid.innerHTML = '<div style="color:var(--text-muted); padding: 20px;"><i class="fa-solid fa-spinner fa-spin"></i> Loading Live Channels...</div>';
    const urls = [
        'https://iptv-org.github.io/iptv/categories/sports.m3u',
        'https://iptv-org.github.io/iptv/countries/us.m3u'
    ];
    try {
        const responses = await Promise.all(urls.map(url => fetch(url).then(r => r.text()).catch(() => '')));
        const parsed = []; const seenUrls = new Set();
        responses.forEach(data => {
            if (!data) return;
            const lines = data.split('\n');
            let cur = {};
            for (const line of lines) {
                const l = line.trim();
                if (l.startsWith('#EXTINF:')) {
                    const nm = l.match(/,(.+)$/); cur.name = nm ? nm[1].trim() : 'Unknown';
                    const lg = l.match(/tvg-logo="([^"]+)"/); cur.logo = lg ? lg[1] : '';
                } else if (l.startsWith('http')) {
                    cur.url = l;
                    if (!seenUrls.has(l)) { seenUrls.add(l); parsed.push(cur); }
                    cur = {};
                }
            }
        });
        sportsChannels = parsed;
        renderSportsGrid();
    } catch (e) {
        sportsGrid.innerHTML = '<p class="no-results">Failed to load live sports streams.</p>';
    }
}

function renderSportsGrid() {
    const sportsGrid = document.getElementById('sports-grid');
    if (!sportsGrid) return;
    let filtered = sportsChannels;
    if (activeSportsFilter !== 'all') {
        filtered = sportsChannels.filter(ch => {
            const n = ch.name.toLowerCase();
            switch (activeSportsFilter) {
                case 'nfl': return n.includes('nfl') || n.includes('redzone');
                case 'nba': return n.includes('nba') || n.includes('basketball');
                case 'nhl': return n.includes('nhl') || n.includes('hockey');
                case 'ufc': return n.includes('ufc') || n.includes('mma') || n.includes('fight') || n.includes('boxing');
                case 'ncaa': return n.includes('ncaa') || n.includes('college') || n.includes('sec') || n.includes('big ten');
                case 'mlb': return n.includes('mlb') || n.includes('baseball');
                case 'soccer': return n.includes('soccer') || n.includes('laliga') || n.includes('bundesliga') || n.includes('premier league') || n.includes('mls');
                case 'f1': return n.includes('f1') || n.includes('formula') || n.includes('nascar');
                default: return n.includes(activeSportsFilter.toLowerCase());
            }
        });
    } else {
        filtered = sportsChannels.slice(0, 20);
    }
    if (filtered.length === 0) { sportsGrid.innerHTML = '<p class="no-results">No channels found.</p>'; return; }
    sportsGrid.innerHTML = filtered.map(ch => {
        const logo = ch.logo || 'https://via.placeholder.com/300x200?text=Sports+Live';
        return `
        <div class="media-card" onclick="openPlayer('sports','${ch.url}','${ch.name.replace(/'/g,"\\'")}')">
            <div class="poster-wrapper">
                <img src="${logo}" alt="${ch.name}" class="poster" loading="lazy" style="object-fit:contain;padding:10px;background:#111;">
                <div class="play-overlay"><i class="fa-solid fa-circle-play"></i></div>
            </div>
            <div class="media-info">
                <div class="media-title">${ch.name}</div>
                <div class="media-meta"><span>Live Broadcast</span></div>
            </div>
        </div>`;
    }).join('');
}

// ── Event Listeners ───────────────────────────────────────
function setupEventListeners() {
    // Close player
    closeModalBtn.addEventListener('click', closePlayer);

    // Detail page back
    document.getElementById('detail-back-btn').addEventListener('click', closeDetailPage);

    // API key
    addKeyBtn.addEventListener('click', () => { apiKeyModal.classList.add('active'); apiKeyInput.value = getApiKey() || ''; });
    dismissNoticeBtn.addEventListener('click', () => apiNotice.classList.remove('show'));
    closeKeyModalBtn.addEventListener('click', () => apiKeyModal.classList.remove('active'));
    saveKeyBtn.addEventListener('click', async () => {
        const key = apiKeyInput.value.trim();
        if (key) { saveKeyBtn.disabled = true; saveKeyBtn.textContent = "Validating..."; await setApiKey(key); saveKeyBtn.disabled = false; saveKeyBtn.textContent = "Save Key"; }
    });

    // Browse modal
    const browseBtn = document.getElementById('nav-browse-btn');
    const browseModal = document.getElementById('browse-modal');
    if (browseBtn) browseBtn.addEventListener('click', e => { e.preventDefault(); browseModal.classList.add('active'); });
    document.getElementById('close-browse-modal').addEventListener('click', closeBrowse);
    browseModal.addEventListener('click', e => { if (e.target === browseModal) closeBrowse(); });

    // Scroll to sports
    document.getElementById('nav-sports-btn')?.addEventListener('click', e => { e.preventDefault(); document.getElementById('sports-section').scrollIntoView({ behavior: 'smooth' }); });

    // Mobile menu
    document.getElementById('hamburger')?.addEventListener('click', () => document.getElementById('mobile-menu').classList.add('active'));
    document.getElementById('close-mobile-menu')?.addEventListener('click', () => document.getElementById('mobile-menu').classList.remove('active'));
    document.querySelectorAll('.mobile-menu-links a').forEach(a => a.addEventListener('click', () => document.getElementById('mobile-menu').classList.remove('active')));
    document.getElementById('nav-sports-mobile')?.addEventListener('click', e => { e.preventDefault(); document.getElementById('mobile-menu').classList.remove('active'); document.getElementById('sports-section').scrollIntoView({ behavior: 'smooth' }); });
    document.querySelector('.nav-key-mobile')?.addEventListener('click', e => { e.preventDefault(); document.getElementById('mobile-menu').classList.remove('active'); apiKeyModal.classList.add('active'); apiKeyInput.value = getApiKey() || ''; });
    document.getElementById('nav-key-btn')?.addEventListener('click', e => { e.preventDefault(); apiKeyModal.classList.add('active'); apiKeyInput.value = getApiKey() || ''; });

    // Mobile search
    document.getElementById('mobile-search-toggle')?.addEventListener('click', () => { navbar.classList.toggle('search-active'); if (navbar.classList.contains('search-active')) searchInput.focus(); });

    // Sports filters
    document.getElementById('sports-filters')?.querySelectorAll('.filter-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('sports-filters').querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeSportsFilter = btn.dataset.filter;
            renderSportsGrid();
        });
    });

    // See All buttons
    document.getElementById('see-all-movies')?.addEventListener('click', e => { e.preventDefault(); showCategory('movie'); });
    document.getElementById('see-all-shows')?.addEventListener('click',  e => { e.preventDefault(); showCategory('tv');    });

    // Search input live search
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        const q = searchInput.value.trim();
        if (!q) { document.getElementById('search-dropdown').classList.remove('show-results'); return; }
        searchTimeout = setTimeout(() => liveSearch(q), 300);
    });
    searchInput.addEventListener('keypress', e => { if (e.key === 'Enter') runSearch(searchInput.value.trim()); });
    searchInput.addEventListener('focus',    () => { if (searchInput.value.trim()) liveSearch(searchInput.value.trim()); else document.getElementById('search-dropdown').classList.add('show-results'); });
    document.addEventListener('click', e => { if (!e.target.closest('#desktop-search')) closeSearchDropdown(); });

    // Search filter dropdown
    const filterBtn  = document.getElementById('search-filter-btn');
    const filterMenu = document.getElementById('search-filter-menu');
    const filterChev = document.getElementById('filter-chevron');
    filterBtn.addEventListener('click', e => { e.stopPropagation(); filterMenu.classList.toggle('open'); filterChev.style.transform = filterMenu.classList.contains('open') ? 'rotate(180deg)' : ''; });
    filterMenu.querySelectorAll('.filter-option').forEach(opt => {
        opt.addEventListener('click', () => {
            filterMenu.querySelectorAll('.filter-option').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            searchFilter = opt.dataset.filter;
            document.getElementById('filter-label').textContent = opt.textContent;
            filterMenu.classList.remove('open');
            filterChev.style.transform = '';
            if (searchInput.value.trim()) liveSearch(searchInput.value.trim());
        });
    });

    // Clear recent searches
    document.getElementById('clear-recent-btn')?.addEventListener('click', () => { recentSearches = []; localStorage.removeItem('gm_recent_searches'); renderRecentSearches(); });

    // Search close
    document.getElementById('search-close-btn')?.addEventListener('click', () => { searchInput.value = ''; closeSearchDropdown(); });

    // Close player modal on backdrop click
    playerModal.addEventListener('click', e => { if (e.target === playerModal) closePlayer(); });

    // Custom stream modal
    const customStreamBtn = document.getElementById('custom-stream-btn');
    const customStreamModal = document.getElementById('custom-stream-modal');
    customStreamBtn?.addEventListener('click', () => customStreamModal.classList.add('active'));
    document.getElementById('close-custom-modal')?.addEventListener('click', () => customStreamModal.classList.remove('active'));
    document.getElementById('play-custom-btn')?.addEventListener('click', () => {
        const title = document.getElementById('custom-stream-title').value.trim() || 'Custom Stream';
        const url   = document.getElementById('custom-stream-url').value.trim();
        if (!url) { alert('Enter a valid URL.'); return; }
        customStreamModal.classList.remove('active');
        openPlayer('sports', url, title);
    });

    const csInput = document.getElementById('custom-search-input');
    const csResults = document.getElementById('custom-search-results');
    csInput?.addEventListener('input', () => {
        const q = csInput.value.trim().toLowerCase();
        if (!q) { csResults.innerHTML = ''; return; }
        const matches = sportsChannels.filter(ch => ch.name.toLowerCase().includes(q)).slice(0, 30);
        csResults.innerHTML = matches.length
            ? matches.map(ch => `<button style="text-align:left;width:100%;padding:0.5rem 1rem;font-size:0.85rem;display:flex;justify-content:space-between;align-items:center;border:1px solid var(--glass-border);border-radius:8px;background:rgba(255,255,255,0.02);margin-bottom:0.3rem;color:white;cursor:pointer;" onclick="customStreamModal.classList.remove('active'); openPlayer('sports','${ch.url}','${ch.name.replace(/'/g,"\\'")}')"><span>${ch.name}</span><span style="font-size:0.75rem;opacity:0.6;"><i class='fa-solid fa-play'></i> Watch</span></button>`).join('')
            : '<div style="color:var(--text-muted);padding:5px;font-size:0.85rem;">No channels found.</div>';
    });
}
