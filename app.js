const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const VIDKING_BASE_URL = 'https://www.vidking.net/embed';

// PASTE YOUR TMDB API KEY HERE TO MAKE IT PERMANENT
const DEFAULT_API_KEY = ''; 

function getApiKey() {
    const stored = localStorage.getItem('tmdb_api_key');
    if (stored) return stored;
    if (DEFAULT_API_KEY && !DEFAULT_API_KEY.includes('PLACEHOLDER')) return DEFAULT_API_KEY;
    return null;
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
let currentMoviesList = [];
let currentShowsList = [];
let sportsChannels = [];
let isMoviesExpanded = false;
let isShowsExpanded = false;
let activeSportsFilter = 'all';

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
    populateSeasonSelect(5);
    loadLiveSports();
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
    
    // Add Key Button
    addKeyBtn.addEventListener('click', () => {
        apiKeyModal.classList.add('active');
        apiKeyInput.value = getApiKey() || '';
    });

    // Mobile Menu
    const hamburger = document.getElementById('hamburger');
    const closeMobileMenu = document.getElementById('close-mobile-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileSearchToggle = document.getElementById('mobile-search-toggle');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.add('active');
        });
    }

    if (closeMobileMenu) {
        closeMobileMenu.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    }

    if (mobileSearchToggle) {
        mobileSearchToggle.addEventListener('click', () => {
            navbar.classList.toggle('search-active');
            if (navbar.classList.contains('search-active')) {
                searchInput.focus();
            }
        });
    }

    // Close mobile menu when link is clicked
    document.querySelectorAll('.mobile-menu-links a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });

    // Mobile Key Button
    const navKeyMobile = document.querySelector('.nav-key-mobile');
    if (navKeyMobile) {
        navKeyMobile.addEventListener('click', (e) => {
            e.preventDefault();
            mobileMenu.classList.remove('active');
            apiKeyModal.classList.add('active');
            apiKeyInput.value = getApiKey() || '';
        });
    }

    // Navbar Key Icon (Settings)
    const navKeyBtn = document.getElementById('nav-key-btn');
    if (navKeyBtn) {
        navKeyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            apiKeyModal.classList.add('active');
            apiKeyInput.value = getApiKey() || '';
        });
    }

    // Live Sports Navigation (Desktop)
    const navSportsBtn = document.getElementById('nav-sports-btn');
    if (navSportsBtn) {
        navSportsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const sportsSec = document.getElementById('sports-section');
            if (sportsSec) sportsSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // Live Sports Navigation (Mobile)
    const navSportsMobile = document.getElementById('nav-sports-mobile');
    if (navSportsMobile) {
        navSportsMobile.addEventListener('click', (e) => {
            e.preventDefault();
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu) mobileMenu.classList.remove('active');
            const sportsSec = document.getElementById('sports-section');
            if (sportsSec) sportsSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // Live Sports Filters
    const sportsFiltersContainer = document.getElementById('sports-filters');
    if (sportsFiltersContainer) {
        sportsFiltersContainer.querySelectorAll('.filter-tab').forEach(button => {
            button.addEventListener('click', (e) => {
                sportsFiltersContainer.querySelectorAll('.filter-tab').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                activeSportsFilter = button.dataset.filter;
                renderSportsGrid();
            });
        });
    }

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

    // Custom Stream Modal Handlers
    const customStreamBtn = document.getElementById('custom-stream-btn');
    const customStreamModal = document.getElementById('custom-stream-modal');
    const closeCustomModalBtn = document.getElementById('close-custom-modal');
    const playCustomBtn = document.getElementById('play-custom-btn');
    const customStreamTitle = document.getElementById('custom-stream-title');
    const customStreamUrl = document.getElementById('custom-stream-url');
    const customSearchInput = document.getElementById('custom-search-input');
    const customSearchResults = document.getElementById('custom-search-results');

    if (customStreamBtn && customStreamModal) {
        customStreamBtn.addEventListener('click', (e) => {
            e.preventDefault();
            customStreamModal.classList.add('active');
            if (customSearchInput) {
                customSearchInput.value = '';
                if (customSearchResults) customSearchResults.innerHTML = '';
                customSearchInput.focus();
            }
        });
    }

    if (closeCustomModalBtn && customStreamModal) {
        closeCustomModalBtn.addEventListener('click', () => {
            customStreamModal.classList.remove('active');
        });
    }

    if (playCustomBtn && customStreamModal) {
        playCustomBtn.addEventListener('click', () => {
            const title = customStreamTitle.value.trim() || 'Custom Stream';
            const url = customStreamUrl.value.trim();

            if (!url) {
                alert('Please enter a valid stream URL.');
                return;
            }

            customStreamModal.classList.remove('active');
            window.openPlayer('sports', url, title);
        });
    }

    if (customSearchInput && customSearchResults) {
        customSearchInput.addEventListener('input', () => {
            const query = customSearchInput.value.trim().toLowerCase();
            if (!query) {
                customSearchResults.innerHTML = '';
                return;
            }

            const matches = sportsChannels.filter(channel => 
                channel.name.toLowerCase().includes(query)
            ).slice(0, 30); // Limit to top 30 matches for UI neatness

            if (matches.length === 0) {
                customSearchResults.innerHTML = '<div style="color: var(--text-muted); padding: 5px; font-size: 0.85rem;">No channels found.</div>';
                return;
            }

            customSearchResults.innerHTML = matches.map(channel => `
                <button class="btn btn-secondary" style="text-align: left; width: 100%; padding: 0.5rem 1rem; font-size: 0.85rem; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--glass-border); border-radius: 8px; background: rgba(255,255,255,0.02); text-overflow: ellipsis; overflow: hidden; white-space: nowrap; margin-bottom: 0.3rem;" onclick="window.playSearchChannel('${channel.url}', '${channel.name.replace(/'/g, "\\'")}')">
                    <span>${channel.name}</span>
                    <span style="font-size: 0.75rem; opacity: 0.6;"><i class="fa-solid fa-play"></i> Watch</span>
                </button>
            `).join('');
        });
    }

    // Helper for playing channel from search
    window.playSearchChannel = (url, name) => {
        if (customStreamModal) customStreamModal.classList.remove('active');
        window.openPlayer('sports', url, name);
    };

    // Search
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    // See All / Show Less Movies
    const seeAllMoviesBtn = document.getElementById('see-all-movies');
    if (seeAllMoviesBtn) {
        seeAllMoviesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            isMoviesExpanded = !isMoviesExpanded;
            renderMovies();
        });
    }

    // See All / Show Less Shows
    const seeAllShowsBtn = document.getElementById('see-all-shows');
    if (seeAllShowsBtn) {
        seeAllShowsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            isShowsExpanded = !isShowsExpanded;
            renderShows();
        });
    }

    // TV Controls
    seasonSelect.addEventListener('change', () => {
        const selectedOption = seasonSelect.options[seasonSelect.selectedIndex];
        const episodeCount = selectedOption ? (selectedOption.dataset.episodeCount || 24) : 24;
        populateEpisodeSelect(episodeCount);
        
        currentMedia.season = seasonSelect.value;
        currentMedia.episode = episodeSelect.value;
        loadIframe();
    });

    episodeSelect.addEventListener('change', () => {
        currentMedia.season = seasonSelect.value;
        currentMedia.episode = episodeSelect.value;
        loadIframe();
    });
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
    currentMoviesList = demoMovies;
    currentShowsList = demoShows;
    isMoviesExpanded = false;
    isShowsExpanded = false;
    renderMovies();
    renderShows();
}

function renderMovies() {
    const list = currentMoviesList;
    const limit = isMoviesExpanded ? list.length : 10;
    moviesGrid.innerHTML = list.slice(0, limit).map(m => renderMediaCard(m, 'movie')).join('');
    
    // Update the "See All" button text and icon
    const seeAllBtn = document.getElementById('see-all-movies');
    if (seeAllBtn) {
        if (list.length <= 10) {
            seeAllBtn.style.display = 'none';
        } else {
            seeAllBtn.style.display = 'flex';
            if (isMoviesExpanded) {
                seeAllBtn.innerHTML = `Show Less <i class="fa-solid fa-chevron-up"></i>`;
            } else {
                seeAllBtn.innerHTML = `See All <i class="fa-solid fa-chevron-right"></i>`;
            }
        }
    }
}

function renderShows() {
    const list = currentShowsList;
    const limit = isShowsExpanded ? list.length : 10;
    showsGrid.innerHTML = list.slice(0, limit).map(s => renderMediaCard(s, 'tv')).join('');
    
    // Update the "See All" button text and icon
    const seeAllBtn = document.getElementById('see-all-shows');
    if (seeAllBtn) {
        if (list.length <= 10) {
            seeAllBtn.style.display = 'none';
        } else {
            seeAllBtn.style.display = 'flex';
            if (isShowsExpanded) {
                seeAllBtn.innerHTML = `Show Less <i class="fa-solid fa-chevron-up"></i>`;
            } else {
                seeAllBtn.innerHTML = `See All <i class="fa-solid fa-chevron-right"></i>`;
            }
        }
    }
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
        throw error; // Re-throw so performSearch can show the message
    }
}

async function loadContent() {
    const moviesData = await fetchFromTMDB('/trending/movie/week');
    if (moviesData && moviesData.results) {
        currentMoviesList = moviesData.results;
        renderMovies();

        // Update Hero
        const heroMovie = moviesData.results[0];
        const heroTitle = document.getElementById('hero-title');
        const heroOverview = document.getElementById('hero-overview');
        const heroBackdrop = document.querySelector('.hero-backdrop');
        const heroBtn = document.querySelector('.hero .btn-primary');

        if (heroTitle) heroTitle.textContent = heroMovie.title;
        if (heroOverview) heroOverview.textContent = heroMovie.overview;
        if (heroBackdrop) heroBackdrop.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${heroMovie.backdrop_path})`;
        if (heroBtn) heroBtn.setAttribute('onclick', `openPlayer('movie', '${heroMovie.id}', '${heroMovie.title.replace(/'/g, "\\'")}')`);
    } else {
        renderDemoContent();
    }

    const showsData = await fetchFromTMDB('/trending/tv/week');
    if (showsData && showsData.results) {
        currentShowsList = showsData.results;
        renderShows();
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
        const movieHeading = document.querySelector('.content-section:nth-of-type(1) h2');
        if (moviesSearch && moviesSearch.results && moviesSearch.results.length > 0) {
            if (movieHeading) movieHeading.textContent = `Search Results: Movies`;
            currentMoviesList = moviesSearch.results.filter(m => m.poster_path);
            isMoviesExpanded = false;
            renderMovies();
        } else {
            if (movieHeading) movieHeading.textContent = `Search Results: Movies`;
            currentMoviesList = [];
            moviesGrid.innerHTML = '<p class="no-results">No movies found.</p>';
            const seeAllBtn = document.getElementById('see-all-movies');
            if (seeAllBtn) seeAllBtn.style.display = 'none';
        }

        // Search Shows
        const showsSearch = await fetchFromTMDB(`/search/tv?query=${encodeURIComponent(query)}`);
        const showHeading = document.querySelector('.content-section:nth-of-type(2) h2');
        if (showsSearch && showsSearch.results && showsSearch.results.length > 0) {
            if (showHeading) showHeading.textContent = `Search Results: TV Shows`;
            currentShowsList = showsSearch.results.filter(s => s.poster_path);
            isShowsExpanded = false;
            renderShows();
        } else {
            if (showHeading) showHeading.textContent = `Search Results: TV Shows`;
            currentShowsList = [];
            showsGrid.innerHTML = '<p class="no-results">No shows found.</p>';
            const seeAllBtn = document.getElementById('see-all-shows');
            if (seeAllBtn) seeAllBtn.style.display = 'none';
        }

        // Search Sports
        if (sportsChannels && sportsChannels.length > 0) {
            const sportsHeading = document.querySelector('#sports-section h2');
            if (sportsHeading) sportsHeading.textContent = `Search Results: Live Sports`;
            activeSportsFilter = query; // Use query as custom filter string
            renderSportsGrid();
        }

        // Scroll down to results
        document.getElementById('movies-grid').scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (e) {
        console.error("Search Logic Error:", e);
        alert(`Search failed: ${e.message}\n\nCheck your API key or network connection.`);
    } finally {
        searchBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';
        searchBtn.disabled = false;
    }
}

let currentModalRequestId = 0;

// Player Logic
window.openPlayer = async function (type, id, title) {
    const requestId = ++currentModalRequestId;
    currentMedia.type = type;
    currentMedia.id = id;
    currentMedia.episode = 1;

    // Update title
    if (playerTitle) {
        playerTitle.textContent = title || (type === 'movie' ? 'Movie' : 'TV Show');
    }

    playerModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    iframeContainer.innerHTML = '<div style="color:var(--text-muted); display:flex; justify-content:center; align-items:center; height:100%; font-size:1.2rem;"><i class="fa-solid fa-spinner fa-spin" style="margin-right: 10px;"></i> Loading Player...</div>';

    if (type === 'tv') {
        tvControls.classList.remove('hidden');
        seasonSelect.innerHTML = '<option>Loading...</option>';
        episodeSelect.innerHTML = '<option>Loading...</option>';
        
        await loadTVDetails(id);
        
        if (requestId !== currentModalRequestId || !playerModal.classList.contains('active')) return;
        
        if (seasonSelect.options.length > 0) {
            currentMedia.season = seasonSelect.options[0].value;
            seasonSelect.value = currentMedia.season;
        } else {
            currentMedia.season = 1;
        }
    } else {
        tvControls.classList.add('hidden');
        currentMedia.season = 1;
    }

    if (episodeSelect.options.length > 0) {
        episodeSelect.value = "1";
    }

    if (requestId === currentModalRequestId && playerModal.classList.contains('active')) {
        loadIframe();
    }
};

function loadIframe() {
    if (currentMedia.type === 'sports') {
        iframeContainer.innerHTML = `
            <video id="live-player" controls autoplay style="width: 100%; height: 100%; background: #000; border-radius: 12px;"></video>
        `;
        
        const video = document.getElementById('live-player');
        const streamUrl = currentMedia.id;

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch(e => console.log("Play interrupted or autoplay blocked:", e));
            });
            window.activeHlsInstance = hls;
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = streamUrl;
            video.addEventListener('loadedmetadata', () => {
                video.play().catch(e => console.log("Play interrupted or autoplay blocked:", e));
            });
        }
    } else {
        let embedUrl = '';
        if (currentMedia.type === 'movie') {
            embedUrl = `${VIDKING_BASE_URL}/movie/${currentMedia.id}`;
        } else {
            embedUrl = `${VIDKING_BASE_URL}/tv/${currentMedia.id}/${currentMedia.season}/${currentMedia.episode}`;
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
}

function closePlayer() {
    playerModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    if (window.activeHlsInstance) {
        window.activeHlsInstance.destroy();
        window.activeHlsInstance = null;
    }

    setTimeout(() => {
        if (!playerModal.classList.contains('active')) {
            iframeContainer.innerHTML = '';
        }
    }, 300);
}

function populateSeasonSelect(seasonsData, isDataArray = false) {
    seasonSelect.innerHTML = '';
    if (isDataArray) {
        seasonsData.forEach(s => {
            const option = document.createElement('option');
            option.value = s.season_number;
            option.textContent = s.name || `Season ${s.season_number}`;
            option.dataset.episodeCount = s.episode_count;
            seasonSelect.appendChild(option);
        });
        if (seasonsData.length > 0) {
            populateEpisodeSelect(seasonsData[0].episode_count);
        } else {
            populateEpisodeSelect(24);
        }
    } else {
        const count = typeof seasonsData === 'number' ? seasonsData : 5;
        for (let i = 1; i <= count; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Season ${i}`;
            option.dataset.episodeCount = 24;
            seasonSelect.appendChild(option);
        }
        populateEpisodeSelect(24);
    }
}

function populateEpisodeSelect(count = 24) {
    episodeSelect.innerHTML = '';
    const maxEpisodes = parseInt(count) || 24;
    for (let i = 1; i <= maxEpisodes; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Episode ${i}`;
        episodeSelect.appendChild(option);
    }
}

async function loadTVDetails(id) {
    const key = getApiKey();
    if (!key) {
        populateSeasonSelect(5);
        return;
    }

    try {
        const tvData = await fetchFromTMDB(`/tv/${id}`);
        if (tvData && tvData.seasons) {
            const regularSeasons = tvData.seasons.filter(s => s.season_number > 0);
            populateSeasonSelect(regularSeasons.length > 0 ? regularSeasons : tvData.seasons, true);
        } else {
            populateSeasonSelect(5);
        }
    } catch (e) {
        console.error("Failed to fetch TV details", e);
        populateSeasonSelect(5);
    }
}

async function loadLiveSports() {
    const sportsGrid = document.getElementById('sports-grid');
    if (!sportsGrid) return;

    sportsGrid.innerHTML = '<div style="color:var(--text-muted); padding: 20px;"><i class="fa-solid fa-spinner fa-spin"></i> Loading Live Channels...</div>';

    const urls = [
        'https://iptv-org.github.io/iptv/categories/sports.m3u',
        'https://iptv-org.github.io/iptv/countries/us.m3u',
        'https://iptv-org.github.io/iptv/countries/ca.m3u',
        'https://iptv-org.github.io/iptv/countries/uk.m3u'
    ];

    try {
        // Fetch all in parallel
        const responses = await Promise.all(
            urls.map(url => fetch(url).then(r => r.text()).catch(err => {
                console.warn(`Failed to fetch playlist: ${url}`, err);
                return '';
            }))
        );

        const parsed = [];
        const seenUrls = new Set();

        responses.forEach(data => {
            if (!data) return;
            const lines = data.split('\n');
            let currentItem = {};

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line.startsWith('#EXTINF:')) {
                    const nameMatch = line.match(/,(.+)$/);
                    currentItem.name = nameMatch ? nameMatch[1].trim() : 'Unknown Channel';
                    
                    const logoMatch = line.match(/tvg-logo="([^"]+)"/);
                    currentItem.logo = logoMatch ? logoMatch[1] : '';
                } else if (line.startsWith('http')) {
                    currentItem.url = line;
                    // Deduplicate
                    if (currentItem.url && !seenUrls.has(currentItem.url)) {
                        seenUrls.add(currentItem.url);
                        parsed.push(currentItem);
                    }
                    currentItem = {};
                }
            }
        });

        // Store all parsed channels for filtering
        sportsChannels = parsed;
        renderSportsGrid();
    } catch (e) {
        console.error("Error loading sports stream:", e);
        sportsGrid.innerHTML = '<p class="no-results">Failed to load live sports streams.</p>';
    }
}

function renderSportsGrid() {
    const sportsGrid = document.getElementById('sports-grid');
    if (!sportsGrid) return;

    let filtered = sportsChannels;
    if (activeSportsFilter !== 'all') {
        filtered = sportsChannels.filter(channel => {
            const name = channel.name.toLowerCase();
            switch (activeSportsFilter) {
                case 'nfl':
                    return name.includes('nfl') || name.includes('redzone');
                case 'nba':
                    return name.includes('nba') || name.includes('basketball');
                case 'nhl':
                    return name.includes('nhl') || name.includes('hockey');
                case 'ufc':
                    return name.includes('ufc') || name.includes('mma') || name.includes('fight') || name.includes('combat') || name.includes('wrestling') || name.includes('boxing') || name.includes('dazn') || name.includes('boxeo');
                case 'ncaa':
                    return name.includes('ncaa') || name.includes('college') || name.includes('sec network') || name.includes('acc network') || name.includes('big ten') || name.includes('pac-12');
                case 'mlb':
                    return name.includes('mlb') || name.includes('baseball');
                case 'soccer':
                    return name.includes('soccer') || name.includes('laliga') || name.includes('bundesliga') || name.includes('premier league') || name.includes('champions league') || name.includes('uefa') || name.includes('mls') || (name.includes('football') && !name.includes('nfl') && !name.includes('ncaa') && !name.includes('college'));
                case 'f1':
                    return name.includes('f1') || name.includes('formula') || name.includes('motorsport') || name.includes('nascar') || name.includes('moto gp');
                default:
                    return name.includes(activeSportsFilter.toLowerCase());
            }
        });
    } else {
        // Limit to 20 stable feeds if no filter is active to prevent page bloat
        filtered = sportsChannels.slice(0, 20);
    }

    if (filtered.length === 0) {
        sportsGrid.innerHTML = '<p class="no-results">No active channels found for this filter.</p>';
        return;
    }

    sportsGrid.innerHTML = filtered.map(channel => {
        const logo = channel.logo || 'https://via.placeholder.com/300x200?text=Sports+Live';
        return `
            <div class="media-card" onclick="window.openPlayer('sports', '${channel.url}', '${channel.name.replace(/'/g, "\\'")}')">
                <div class="poster-wrapper">
                    <img src="${logo}" alt="${channel.name}" class="poster" loading="lazy" style="object-fit: contain; padding: 10px; background: #111;">
                    <div class="play-overlay">
                        <i class="fa-solid fa-circle-play"></i>
                    </div>
                </div>
                <div class="media-info">
                    <div class="media-title">${channel.name}</div>
                    <div class="media-meta">
                        <span>Live Broadcast</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}
