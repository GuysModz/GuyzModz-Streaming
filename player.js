const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const EMBED_PROVIDERS = {
    vidking: (type, id, season, episode) => 
        type === 'movie' ? `https://www.vidking.net/embed/movie/${id}` : `https://www.vidking.net/embed/tv/${id}/${season}/${episode}`,
    vidsrc_cc: (type, id, season, episode) => 
        type === 'movie' ? `https://vidsrc.in/embed/movie/${id}` : `https://vidsrc.in/embed/tv/${id}/${season}/${episode}`,
    embed2: (type, id, season, episode) => 
        type === 'movie' ? `https://www.2embed.cc/embed/${id}` : `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`
};

// Get params from URL
const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get('type');
const id = urlParams.get('id');
const title = urlParams.get('title');

const playerTitle = document.getElementById('page-player-title');
const iframeContainer = document.getElementById('page-iframe-container');
const tvControls = document.getElementById('page-tv-controls');
const seasonSelect = document.getElementById('page-season-select');
const episodeSelect = document.getElementById('page-episode-select');
const pageServerSelect = document.getElementById('page-server-select');
const pageReloadBtn = document.getElementById('page-reload-btn');

let currentMedia = {
    type: type,
    id: id,
    season: 1,
    episode: 1,
    server: 'vidking'
};

function getApiKey() {
    const stored = localStorage.getItem('tmdb_api_key');
    const DEFAULT_API_KEY = 'b80a71388447e647e1ff09bd1fd41a4f';
    if (stored) return stored;
    if (DEFAULT_API_KEY && !DEFAULT_API_KEY.includes('PLACEHOLDER')) return DEFAULT_API_KEY;
    return null;
}

document.addEventListener('DOMContentLoaded', async () => {
    // Redirect back to home if no ID is present
    if (!id) {
        window.location.href = 'index.html';
        return;
    }

    if (playerTitle) {
        playerTitle.textContent = title || (type === 'movie' ? 'Watching Movie' : 'Watching TV Show');
    }

    if (type === 'tv') {
        tvControls.classList.remove('hidden');
        await loadTVDetails(id);
        
        if (seasonSelect.options.length > 0) {
            currentMedia.season = seasonSelect.options[0].value;
            seasonSelect.value = currentMedia.season;
        }
    } else {
        currentMedia.season = 1;
    }

    if (episodeSelect && episodeSelect.options.length > 0) {
        episodeSelect.value = "1";
    }

    loadIframe();

    // Event listeners for TV controls
    if (seasonSelect) {
        seasonSelect.addEventListener('change', () => {
            const selectedOption = seasonSelect.options[seasonSelect.selectedIndex];
            const episodeCount = selectedOption ? (selectedOption.dataset.episodeCount || 24) : 24;
            populateEpisodeSelect(episodeCount);
            
            currentMedia.season = seasonSelect.value;
            currentMedia.episode = episodeSelect.value;
            loadIframe();
        });
    }

    if (episodeSelect) {
        episodeSelect.addEventListener('change', () => {
            currentMedia.season = seasonSelect.value;
            currentMedia.episode = episodeSelect.value;
            loadIframe();
        });
    }

    if (pageServerSelect) {
        pageServerSelect.addEventListener('change', (e) => {
            currentMedia.server = e.target.value;
            loadIframe();
        });
    }

    if (pageReloadBtn) {
        pageReloadBtn.addEventListener('click', () => {
            loadIframe();
        });
    }
});

function loadIframe() {
    const providerFunc = EMBED_PROVIDERS[currentMedia.server] || EMBED_PROVIDERS.vidking;
    const embedUrl = providerFunc(currentMedia.type, currentMedia.id, currentMedia.season, currentMedia.episode);

    iframeContainer.innerHTML = `
        <iframe 
            src="${embedUrl}" 
            width="100%" 
            height="100%" 
            frameborder="0" 
            allowfullscreen
            sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen; accelerometer; gyroscope">
        </iframe>
    `;
}

async function fetchFromTMDB(endpoint) {
    const key = getApiKey();
    if (!key) return null;
    try {
        const separator = endpoint.includes('?') ? '&' : '?';
        const url = `${TMDB_BASE_URL}${endpoint}${separator}api_key=${key}&language=en-US`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`TMDB Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function loadTVDetails(id) {
    const tvData = await fetchFromTMDB(`/tv/${id}`);
    if (tvData && tvData.seasons) {
        const regularSeasons = tvData.seasons.filter(s => s.season_number > 0);
        populateSeasonSelect(regularSeasons.length > 0 ? regularSeasons : tvData.seasons, true);
    } else {
        populateSeasonSelect(5);
    }
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
