const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const VIDKING_BASE_URL = 'https://www.vidking.net/embed';

// PASTE YOUR TMDB API KEY HERE TO MAKE IT PERMANENT
const DEFAULT_API_KEY = 'b80a71388447e647e1ff09bd1fd41a4f';

function getApiKey() {
    return localStorage.getItem('tmdb_api_key') || DEFAULT_API_KEY;
}

// DOM Elements
const navbar = document.querySelector('.navbar');
const moviesGrid = document.getElementById('movies-grid');
const showsGrid = document.getElementById('shows-grid');
const playerModal = document.getElementById('player-modal');
const closeModalBtn = document.getElementById('close-modal');
const iframeContainer = document.getElementById('iframe-container');
const tvControls = document.getElementById('tv-controls');
const seasonSelect = document.getElementById('season-select');
const episodeSelect = document.getElementById('episode-select');
const updateEpisodeBtn = document.getElementById('update-episode-btn');
const playerTitle = document.getElementById('player-title');
const apiNotice = document.getElementById('api-notice');
const addKeyBtn = document.getElementById('add-key-btn');
const dismissNoticeBtn = document.getElementById('dismiss-notice');
const apiKeyModal = document.getElementById('api-key-modal');
const closeKeyModalBtn = document.getElementById('close-key-modal');
const apiKeyInput = document.getElementById('api-key-input');
const saveKeyBtn = document.getElementById('save-key-btn');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

// State
let currentMedia = {
    type: 'movie', // 'movie' or 'tv'
    id: null,
    season: 1,
    episode: 1
};

// Demo Data (Fallback when no API key is present)
const demoMovies = [
    { id: 533535, title: "Deadpool & Wolverine", poster_path: "/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg", vote_average: 7.7 },
    { id: 1022789, title: "Inside Out 2", poster_path: "/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg", vote_average: 7.6 },
    { id: 653346, title: "Kingdom of the Planet of the Apes", poster_path: "/gKkl37BQuKTanygYQG1pyYgLVgf.jpg", vote_average: 6.9 },
    { id: 693134, title: "Dune: Part Two", poster_path: "/1pdfLvkbY9ohJlCjQH2IGpbRXYS.jpg", vote_average: 8.2 },
    { id: 929590, title: "Civil War", poster_path: "/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg", vote_average: 7.0 }
];

const demoShows = [
    { id: 76479, name: "The Boys", poster_path: "/2quzoptnn7GZ4Z1hsS220H1o748.jpg", vote_average: 8.5 },
    { id: 113988, name: "Fallout", poster_path: "/A3sD2kY0PZea8z7B38bV4Z83LhJ.jpg", vote_average: 8.4 },
    { id: 1396, name: "Breaking Bad", poster_path: "/3xnWaLQjelJDDF7LT1WBo6f4BRe.jpg", vote_average: 8.9 },
    { id: 66732, name: "Stranger Things", poster_path: "/49WJfeN0moxb9IPfGn8xkbjDSpw.jpg", vote_average: 8.6 },
    { id: 108978, name: "Reacher", poster_path: "/jBJWaqmbOKA6RQydME2TlwqICg2.jpg", vote_average: 8.1 }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initScrollEffect();
    checkApiKey();
    setupEventListeners();

    // Generate episode options
    populateEpisodeSelect();
});

function initScrollEffect() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// API Key Management
async function setApiKey(key) {
    // Basic validation check
    const test = await fetch(`${TMDB_BASE_URL}/authentication?api_key=${key}`);
    if (!test.ok) {
        alert("Invalid API Key! Please use the shorter 'API Key' from TMDB, not the long 'Read Access Token'.");
        return;
    }

    localStorage.setItem('tmdb_api_key', key);
    apiKeyModal.classList.remove('active');
    apiNotice.classList.remove('show');
    loadContent(); // Reload with actual data
}

function checkApiKey() {
    const key = getApiKey();
    if (!key) {
        setTimeout(() => {
            apiNotice.classList.add('show');
        }, 2000);
        renderDemoContent();
    } else {
        loadContent();
    }
}

// Event Listeners Setup
function setupEventListeners() {
    // Player Modal
    closeModalBtn.addEventListener('click', closePlayer);
    playerModal.addEventListener('click', (e) => {
        if (e.target === playerModal) closePlayer();
    });

    // API Key UI
    addKeyBtn.addEventListener('click', () => {
        apiKeyModal.classList.add('active');
        apiKeyInput.value = getApiKey() || '';
    });

    dismissNoticeBtn.addEventListener('click', () => {
        apiNotice.classList.remove('show');
    });

    closeKeyModalBtn.addEventListener('click', () => {
        apiKeyModal.classList.remove('active');
    });

    saveKeyBtn.addEventListener('click', async () => {
        const key = apiKeyInput.value.trim();
        if (key) {
            saveKeyBtn.disabled = true;
            saveKeyBtn.textContent = "Validating...";
            await setApiKey(key);
            saveKeyBtn.disabled = false;
            saveKeyBtn.textContent = "Save Key";
        }
    });

    // TV Controls
    updateEpisodeBtn.addEventListener('click', () => {
        currentMedia.season = seasonSelect.value;
        currentMedia.episode = episodeSelect.value;
        loadIframe();
    });

    // Search
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
}

function populateEpisodeSelect() {
    episodeSelect.innerHTML = '';
    for (let i = 1; i <= 24; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Episode ${i}`;
        episodeSelect.appendChild(option);
    }
}

// Render Functions
function renderMediaCard(item, type) {
    const title = type === 'movie' ? item.title : item.name;
    const date = type === 'movie' ? (item.release_date || '').split('-')[0] : (item.first_air_date || '').split('-')[0];
    const rating = item.vote_average ? item.vote_average.toFixed(1) : 'NR';
    const poster = item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Poster';

    return `
        <div class="media-card" onclick="window.openPlayer('${type}', '${item.id}', '${title.replace(/'/g, "\\'")}')">
            <div class="poster-wrapper">
                <img src="${poster}" alt="${title}" class="poster" loading="lazy">
                <div class="play-overlay">
                    <i class="fa-solid fa-circle-play"></i>
                </div>
            </div>
            <div class="media-info">
                <div class="media-title">${title}</div>
                <div class="media-meta">
                    <span>${date}</span>
                    <span class="rating"><i class="fa-solid fa-star"></i> ${rating}</span>
                </div>
            </div>
        </div>
    `;
}

function renderDemoContent() {
    moviesGrid.innerHTML = demoMovies.map(m => renderMediaCard(m, 'movie')).join('');
    showsGrid.innerHTML = demoShows.map(s => renderMediaCard(s, 'tv')).join('');
}

// Data Fetching
async function fetchFromTMDB(endpoint) {
    const key = getApiKey();
    if (!key) {
        console.warn("No API key found.");
        return null;
    }

    try {
        const separator = endpoint.includes('?') ? '&' : '?';
        const url = `${TMDB_BASE_URL}${endpoint}${separator}api_key=${key}&language=en-US`;
        console.log("Fetching from TMDB:", url.replace(key, 'HIDDEN'));
        
        const response = await fetch(url);
        console.log("TMDB Response Status:", response.status);
        
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            console.error("TMDB Error Details:", errData);
            throw new Error(`TMDB Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Fetch error details:", error);
        return null;
    }
}

async function loadContent() {
    const moviesData = await fetchFromTMDB('/trending/movie/week');
    if (moviesData && moviesData.results) {
        moviesGrid.innerHTML = moviesData.results.slice(0, 10).map(m => renderMediaCard(m, 'movie')).join('');

        // Update Hero
        const heroMovie = moviesData.results[0];
        document.getElementById('hero-title').textContent = heroMovie.title;
        document.getElementById('hero-overview').textContent = heroMovie.overview;
        document.querySelector('.hero-backdrop').style.backgroundImage = `url(https://image.tmdb.org/t/p/original${heroMovie.backdrop_path})`;
        document.querySelector('.hero .btn-primary').setAttribute('onclick', `openPlayer('movie', '${heroMovie.id}')`);
    } else {
        renderDemoContent();
    }

    const showsData = await fetchFromTMDB('/trending/tv/week');
    if (showsData && showsData.results) {
        showsGrid.innerHTML = showsData.results.slice(0, 10).map(s => renderMediaCard(s, 'tv')).join('');
    }
}

async function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    const key = getApiKey();
    if (!key) {
        alert("Please add your TMDB API key to use search functionality.");
        apiKeyModal.classList.add('active');
        return;
    }

    searchBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    searchBtn.disabled = true;

    try {
        // Search Movies
        const moviesSearch = await fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}`);
        if (moviesSearch && moviesSearch.results && moviesSearch.results.length > 0) {
            document.querySelector('.content-section:nth-of-type(1) h2').textContent = `Search Results: Movies`;
            moviesGrid.innerHTML = moviesSearch.results.filter(m => m.poster_path).slice(0, 10).map(m => renderMediaCard(m, 'movie')).join('');
        } else {
            moviesGrid.innerHTML = '<p class="no-results">No movies found.</p>';
        }

        // Search Shows
        const showsSearch = await fetchFromTMDB(`/search/tv?query=${encodeURIComponent(query)}`);
        if (showsSearch && showsSearch.results && showsSearch.results.length > 0) {
            document.querySelector('.content-section:nth-of-type(2) h2').textContent = `Search Results: TV Shows`;
            showsGrid.innerHTML = showsSearch.results.filter(s => s.poster_path).slice(0, 10).map(s => renderMediaCard(s, 'tv')).join('');
        } else {
            showsGrid.innerHTML = '<p class="no-results">No shows found.</p>';
        }

        // Scroll down to results
        document.getElementById('movies-grid').scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (e) {
        console.error("Search Logic Error:", e);
        alert("Search failed. This is usually caused by an invalid API key or network block.");
    } finally {
        searchBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';
        searchBtn.disabled = false;
    }
}

// Player Logic
window.openPlayer = function (type, id, title) {
    currentMedia.type = type;
    currentMedia.id = id;
    currentMedia.season = 1;
    currentMedia.episode = 1;

    // Update title
    playerTitle.textContent = title || (type === 'movie' ? 'Movie' : 'TV Show');

    // Reset selects
    seasonSelect.value = "1";
    episodeSelect.value = "1";

    if (type === 'tv') {
        tvControls.classList.remove('hidden');
    } else {
        tvControls.classList.add('hidden');
    }

    loadIframe();
    playerModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
};

function loadIframe() {
    let embedUrl = '';

    if (currentMedia.type === 'movie') {
        embedUrl = `${VIDKING_BASE_URL}/movie/${currentMedia.id}?autoplay=1`;
    } else {
        embedUrl = `${VIDKING_BASE_URL}/tv/${currentMedia.id}/${currentMedia.season}/${currentMedia.episode}?autoplay=1`;
    }

    iframeContainer.innerHTML = `
        <iframe 
            src="${embedUrl}" 
            width="100%" 
            height="100%" 
            frameborder="0" 
            allowfullscreen>
        </iframe>
    `;
}

function closePlayer() {
    playerModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    // Clear iframe to stop playback
    setTimeout(() => {
        iframeContainer.innerHTML = '';
    }, 300);
}
