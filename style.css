:root {
    --bg-color: #050505;
    --card-bg: rgba(255, 255, 255, 0.02);
    --card-border: rgba(255, 0, 0, 0.1);
    --primary-glow: rgba(220, 38, 38, 0.5);
    --primary-color: #ff0000;
    --primary-hover: #cc0000;
    --secondary-color: #991b1b;
    --text-main: #ffffff;
    --text-muted: #9ca3af;
    --glass-bg: rgba(10, 0, 0, 0.7);
    --glass-border: rgba(255, 0, 0, 0.2);
    --glass-blur: blur(15px);
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Outfit', sans-serif;
    background-color: var(--bg-color);
    color: var(--text-main);
    overflow-x: hidden;
    line-height: 1.5;
}

/* Background Effects */
.background-effects {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    overflow: hidden;
    pointer-events: none;
}

.glow-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.4;
    animation: float 20s infinite alternate ease-in-out;
}

.orb-1 {
    top: -10%;
    left: -10%;
    width: 500px;
    height: 500px;
    background: #ff0000;
}

.orb-2 {
    bottom: -20%;
    right: -10%;
    width: 600px;
    height: 600px;
    background: #450a0a;
    animation-delay: -5s;
}

.orb-3 {
    top: 40%;
    left: 50%;
    width: 300px;
    height: 300px;
    background: #7f1d1d;
    opacity: 0.2;
    animation-delay: -10s;
}

@keyframes float {
    0% { transform: translate(0, 0) scale(1); }
    100% { transform: translate(50px, 50px) scale(1.1); }
}

/* Navbar */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 5%;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 100;
    background: linear-gradient(to bottom, rgba(5,5,8,0.9), transparent);
    backdrop-filter: blur(5px);
    transition: var(--transition);
}

.navbar.scrolled {
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    border-bottom: 1px solid var(--glass-border);
    padding: 1rem 5%;
}

.logo {
    font-size: 1.8rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
}

.logo i {
    color: var(--primary-color);
    filter: drop-shadow(0 0 10px var(--primary-glow));
}

.logo span {
    color: var(--secondary-color);
    font-weight: 400;
}

.search-container {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--glass-border);
    border-radius: 30px;
    padding: 0.5rem 1rem;
    width: 100%;
    max-width: 400px;
    transition: var(--transition);
}

.search-container:focus-within {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--primary-color);
    box-shadow: 0 0 15px rgba(139, 92, 246, 0.3);
}

#search-input {
    background: transparent;
    border: none;
    color: white;
    outline: none;
    width: 100%;
    padding: 0.5rem;
    font-family: inherit;
    font-size: 1rem;
}

#search-input::placeholder {
    color: var(--text-muted);
}

#search-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 1.2rem;
    transition: var(--transition);
}

#search-btn:hover {
    color: var(--primary-color);
}

.nav-links {
    display: flex;
    gap: 2rem;
}

.nav-links a {
    color: var(--text-main);
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1rem;
    transition: var(--transition);
    position: relative;
}

.nav-links a:hover, .nav-links a.active {
    color: var(--primary-color);
}

.nav-links a::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0%;
    height: 2px;
    background: var(--primary-color);
    transition: var(--transition);
    box-shadow: 0 0 10px var(--primary-glow);
}

.nav-links a:hover::after, .nav-links a.active::after {
    width: 100%;
}

/* Layout */
.container {
    padding: 0 5%;
    padding-top: 100px;
}

/* Hero Section */
.hero {
    position: relative;
    height: 70vh;
    border-radius: 30px;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
    padding: 4rem;
    margin-bottom: 4rem;
    border: 1px solid var(--card-border);
    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}

.hero-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16ZAKAAyX68k.jpg') center/cover;
    z-index: 1;
    transition: var(--transition);
}

.hero-backdrop::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, rgba(5,5,8,0.9) 0%, rgba(5,5,8,0.4) 50%, rgba(5,5,8,0.1) 100%),
                linear-gradient(to top, rgba(5,5,8,1) 0%, transparent 40%);
}

.hero-content {
    position: relative;
    z-index: 2;
    max-width: 600px;
    animation: slideUp 1s ease-out;
}

@keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}

.badge {
    display: inline-block;
    padding: 0.3rem 1rem;
    background: rgba(225, 29, 72, 0.2);
    border: 1px solid #e11d48;
    color: #fda4af;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.hero h1 {
    font-size: 4rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 1rem;
    text-shadow: 0 2px 10px rgba(0,0,0,0.5);
}

.hero p {
    font-size: 1.1rem;
    color: var(--text-muted);
    margin-bottom: 2rem;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.hero-buttons {
    display: flex;
    gap: 1rem;
}

.btn {
    padding: 0.8rem 1.8rem;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: var(--transition);
    font-family: inherit;
    border: none;
}

.btn-primary {
    background: var(--primary-color);
    color: white;
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
}

.btn-primary:hover {
    background: var(--primary-hover);
    transform: translateY(-2px);
    box-shadow: 0 5px 25px rgba(139, 92, 246, 0.6);
}

.btn-secondary {
    background: var(--glass-bg);
    color: white;
    border: 1px solid var(--glass-border);
    backdrop-filter: var(--glass-blur);
}

.btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
}

.btn-small {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
}

.btn-icon {
    background: transparent;
    color: var(--text-muted);
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
}

.btn-icon:hover {
    color: white;
}

/* Content Sections */
.content-section {
    margin-bottom: 4rem;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 2rem;
}

.section-header h2 {
    font-size: 2rem;
    font-weight: 600;
    position: relative;
    padding-left: 1rem;
}

.section-header h2::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 70%;
    background: var(--primary-color);
    border-radius: 4px;
    box-shadow: 0 0 10px var(--primary-glow);
}

.see-all {
    color: var(--text-muted);
    text-decoration: none;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: var(--transition);
}

.see-all:hover {
    color: var(--primary-color);
}

.media-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 2rem;
}

.media-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 16px;
    overflow: hidden;
    transition: var(--transition);
    cursor: pointer;
    position: relative;
}

.media-card:hover {
    transform: translateY(-10px) scale(1.02);
    border-color: var(--primary-color);
    box-shadow: 0 15px 30px rgba(0,0,0,0.4), 0 0 20px rgba(139, 92, 246, 0.2);
}

.poster-wrapper {
    position: relative;
    aspect-ratio: 2/3;
    overflow: hidden;
}

.poster {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: var(--transition);
}

.media-card:hover .poster {
    transform: scale(1.1);
}

.play-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: var(--transition);
    backdrop-filter: blur(3px);
}

.media-card:hover .play-overlay {
    opacity: 1;
}

.play-overlay i {
    font-size: 3rem;
    color: white;
    filter: drop-shadow(0 0 10px rgba(255,255,255,0.5));
    transform: scale(0.8);
    transition: var(--transition);
}

.media-card:hover .play-overlay i {
    transform: scale(1);
}

.media-info {
    padding: 1rem;
}

.media-title {
    font-weight: 600;
    font-size: 1.1rem;
    margin-bottom: 0.2rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.media-meta {
    display: flex;
    justify-content: space-between;
    color: var(--text-muted);
    font-size: 0.9rem;
}

.rating i {
    color: #fbbf24;
    margin-right: 0.3rem;
}

/* Modals */
.player-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.9);
    backdrop-filter: blur(10px);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    pointer-events: none;
    transition: var(--transition);
}

.player-modal.active {
    opacity: 1;
    pointer-events: all;
}

.modal-content {
    width: 90%;
    max-width: 1200px;
    background: var(--bg-color);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    position: relative;
    padding: 1rem;
    transform: scale(0.95);
    transition: var(--transition);
    box-shadow: 0 0 50px rgba(0,0,0,0.8);
}

.player-modal.active .modal-content {
    transform: scale(1);
}

/* Full Window Modal Styling */
.full-window-modal {
    width: 100% !important;
    height: 100% !important;
    max-width: none !important;
    border-radius: 0 !important;
    border: none !important;
    display: flex;
    flex-direction: column;
    padding: 1.5rem 5% !important;
    background: var(--bg-color);
    transform: translateY(100%);
    opacity: 0;
}

.player-modal.active .full-window-modal {
    transform: translateY(0);
    opacity: 1;
}

.player-top-bar {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 1rem;
}

.player-top-bar .close-modal {
    position: static;
    width: auto;
    height: auto;
    border-radius: 8px;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    box-shadow: none;
    transform: none !important;
    display: flex;
    gap: 0.5rem;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--glass-border);
}

.player-top-bar .close-modal:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--primary-color);
}

.player-top-bar #player-title {
    font-size: 1.5rem;
    font-weight: 600;
}

.full-window-modal .iframe-container {
    flex-grow: 1;
    height: auto;
    aspect-ratio: auto;
    border-radius: 12px;
}

.close-modal {
    position: absolute;
    top: -20px;
    right: -20px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--primary-color);
    color: white;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 15px rgba(139, 92, 246, 0.5);
    z-index: 10;
    transition: var(--transition);
}

.close-modal:hover {
    background: #e11d48;
    box-shadow: 0 0 15px rgba(225, 29, 72, 0.5);
    transform: rotate(90deg);
}

.iframe-container {
    width: 100%;
    aspect-ratio: 16/9;
    border-radius: 12px;
    overflow: hidden;
    background: black;
}

.iframe-container iframe {
    width: 100%;
    height: 100%;
    border: none;
}

.tv-controls {
    margin-top: 1.5rem;
    display: flex;
    gap: 1rem;
    align-items: center;
    background: var(--card-bg);
    padding: 1rem;
    border-radius: 12px;
    border: 1px solid var(--card-border);
}

.tv-controls.hidden {
    display: none;
}

.control-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.control-group label {
    font-weight: 600;
    color: var(--text-muted);
}

select {
    background: rgba(0,0,0,0.5);
    color: white;
    border: 1px solid var(--glass-border);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-family: inherit;
    outline: none;
    cursor: pointer;
}

select:focus {
    border-color: var(--primary-color);
}

/* API Notice */
.api-notice {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-border);
    border-left: 4px solid #fbbf24;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    z-index: 50;
    transform: translateX(120%);
    transition: var(--transition);
}

.api-notice.show {
    transform: translateX(0);
}

.notice-content {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.notice-content i.fa-triangle-exclamation {
    color: #fbbf24;
    font-size: 1.5rem;
}

.notice-content p {
    font-size: 0.95rem;
    margin: 0;
}

/* API Key Modal Specifics */
.key-modal-content {
    max-width: 500px;
    padding: 2rem;
    text-align: center;
}

.key-modal-content h2 {
    margin-bottom: 1rem;
    color: white;
}

.key-modal-content p {
    color: var(--text-muted);
    margin-bottom: 1.5rem;
}

.form-input {
    width: 100%;
    padding: 1rem;
    background: rgba(0,0,0,0.3);
    border: 1px solid var(--glass-border);
    border-radius: 8px;
    color: white;
    font-size: 1rem;
    font-family: inherit;
    margin-bottom: 1rem;
    outline: none;
    transition: var(--transition);
}

.form-input:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 10px var(--primary-glow);
}

.help-text {
    font-size: 0.85rem;
    margin-bottom: 1.5rem;
}

.help-text a {
    color: var(--secondary-color);
    text-decoration: none;
}

.help-text a:hover {
    text-decoration: underline;
}

/* Footer */
footer {
    text-align: center;
    padding: 3rem 5%;
    margin-top: 4rem;
    border-top: 1px solid var(--card-border);
    background: rgba(0,0,0,0.2);
}

.disclaimer {
    color: var(--text-muted);
    font-size: 0.85rem;
    margin-top: 0.5rem;
}

/* Responsive */
@media (max-width: 1024px) {
    .hero h1 { font-size: 3rem; }
    .nav-links { gap: 1rem; }
}

@media (max-width: 768px) {
    .navbar { padding: 1rem 5%; }
    .nav-links, .search-container { display: none; }
    
    .mobile-actions { display: flex; gap: 1rem; }
    
    .hero {
        height: auto;
        padding: 2rem;
        padding-top: 8rem;
        margin-bottom: 2rem;
        border-radius: 20px;
    }
    
    .hero h1 { font-size: 2.2rem; }
    .hero p { font-size: 1rem; }
    
    .media-grid {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 1rem;
    }
    
    .modal-content {
        width: 95%;
        padding: 0.5rem;
    }
    
    .close-modal {
        top: -15px;
        right: 0;
    }
    
    .tv-controls {
        flex-direction: column;
        align-items: stretch;
        gap: 0.8rem;
    }
}

/* Mobile Search Active State */
.navbar.search-active .search-container {
    display: flex;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    max-width: none;
    background: var(--bg-color);
    border-radius: 0;
    border-top: 1px solid var(--glass-border);
    padding: 0.8rem 5%;
}

/* Mobile Menu */
.mobile-menu {
    position: fixed;
    top: 0;
    right: -100%;
    width: 100%;
    height: 100%;
    background: var(--bg-color);
    z-index: 2000;
    transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 2rem;
}

.mobile-menu.active {
    right: 0;
}

.mobile-menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3rem;
}

.mobile-menu-links {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.mobile-menu-links a {
    color: white;
    text-decoration: none;
    font-size: 1.8rem;
    font-weight: 700;
}

.nav-key-mobile {
    margin-top: 2rem;
    color: var(--primary-color) !important;
    font-size: 1.2rem !important;
}

.mobile-actions {
    display: none;
}

/* Ad-Block Toggle Styles */
.adblock-toggle-container {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    margin-left: 1rem;
    padding-left: 1rem;
    border-left: 1px solid var(--glass-border);
}

.toggle-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* Switch UI */
.switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255,255,255,0.1);
    transition: .4s;
    border: 1px solid var(--glass-border);
}

.slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
}

input:checked + .slider {
    background-color: var(--secondary-color);
    border-color: var(--secondary-color);
    box-shadow: 0 0 10px rgba(14, 165, 233, 0.4);
}

input:checked + .slider:before {
    transform: translateX(20px);
}

.slider.round {
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
}

/* Player Header Styles */
.player-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding: 0 0.5rem;
}

#player-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: white;
}

.adblock-status {
    font-size: 0.85rem;
    font-weight: 600;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 0.4rem;
}

.adblock-status.active {
    background: rgba(34, 197, 94, 0.15);
    color: #4ade80;
    border: 1px solid rgba(34, 197, 94, 0.3);
}

.adblock-status.inactive {
    background: rgba(239, 68, 68, 0.15);
    color: #f87171;
    border: 1px solid rgba(239, 68, 68, 0.3);
}

/* Ad Shield Styles */
.iframe-container {
    position: relative;
}

.ad-shield {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.01);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: var(--transition);
}

.ad-shield:not(.hidden)::after {
    content: 'Click to Unlock Player (Ads Blocked)';
    background: var(--primary-color);
    color: white;
    padding: 0.8rem 1.5rem;
    border-radius: 30px;
    font-weight: 600;
    font-size: 1rem;
    box-shadow: 0 0 20px var(--primary-glow);
    animation: pulse 2s infinite;
    pointer-events: none;
}

.ad-shield.hidden {
    display: none;
    pointer-events: none;
}

@keyframes pulse {
    0% { transform: scale(1); opacity: 0.9; }
    50% { transform: scale(1.05); opacity: 1; }
    100% { transform: scale(1); opacity: 0.9; }
}

/* Sports Filters */
.filter-tabs {
    display: flex;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.03);
    padding: 0.3rem;
    border-radius: 30px;
    border: 1px solid var(--glass-border);
    backdrop-filter: var(--glass-blur);
}

.filter-tab {
    background: transparent;
    border: none;
    color: var(--text-muted);
    padding: 0.5rem 1.2rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    font-family: inherit;
}

.filter-tab:hover {
    color: white;
}

.filter-tab.active {
    background: var(--primary-color);
    color: white;
    box-shadow: 0 0 15px var(--primary-glow);
}

@media (max-width: 768px) {
    .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
    .filter-tabs {
        width: 100%;
        overflow-x: auto;
        white-space: nowrap;
        border-radius: 12px;
        padding: 0.5rem;
    }
}

/* ══════════════════════════════════════════════
   CINEBY-STYLE ADDITIONS
══════════════════════════════════════════════ */

/* ── Hero Enhancements ── */
.hero {
    position: relative;
    min-height: 80vh;
    display: flex;
    align-items: flex-end;
    padding: 4rem 5% 3rem;
    margin-bottom: 3rem;
    border-radius: 0;
    overflow: hidden;
}
.hero-backdrop {
    position: absolute; inset: 0;
    background-size: cover; background-position: center top;
    z-index: 0;
}
.hero-backdrop::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(to top, #050505 0%, rgba(5,5,5,0.7) 50%, rgba(5,5,5,0.2) 100%);
}
.hero-content { position: relative; z-index: 1; max-width: 600px; }
.hero-meta { display: flex; align-items: center; gap: 1rem; margin: 0.5rem 0 1rem; color: var(--text-muted); font-size: 0.95rem; flex-wrap: wrap; }
.hero-rating { display: flex; align-items: center; gap: 0.3rem; color: #fbbf24; font-weight: 600; }
.type-badge { background: var(--primary-color); color: white; font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 6px; letter-spacing: 0.5px; }
.hero-buttons { display: flex; gap: 0.8rem; flex-wrap: wrap; }

/* ── Section Blocks ── */
.section-block { margin-bottom: 3.5rem; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.5rem; }
.section-header h2 { font-size: 1.6rem; font-weight: 700; position: relative; padding-left: 1rem; }
.section-header h2::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 4px; height: 70%; background: var(--primary-color); border-radius: 4px; box-shadow: 0 0 10px var(--primary-glow); }

/* ── Tab Switcher ── */
.tab-switcher { display: flex; gap: 0; background: rgba(255,255,255,0.05); border-radius: 8px; overflow: hidden; border: 1px solid var(--glass-border); }
.tab-btn { background: transparent; border: none; color: var(--text-muted); padding: 0.45rem 1.1rem; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: var(--transition); font-family: inherit; }
.tab-btn.active { color: white; border-bottom: 2px solid var(--primary-color); }
.tab-btn:hover { color: white; }

/* ── Top 10 Row ── */
.top10-row { display: flex; gap: 1.2rem; overflow-x: auto; padding-bottom: 1rem; scrollbar-width: thin; scrollbar-color: var(--primary-color) transparent; }
.top10-row::-webkit-scrollbar { height: 4px; }
.top10-row::-webkit-scrollbar-track { background: transparent; }
.top10-row::-webkit-scrollbar-thumb { background: var(--primary-color); border-radius: 4px; }
.top10-card { display: flex; align-items: flex-end; gap: 0; flex-shrink: 0; cursor: pointer; transition: var(--transition); }
.top10-card:hover { transform: translateY(-6px); }
.top10-rank {
    font-size: 5rem; font-weight: 900; line-height: 1; color: transparent;
    -webkit-text-stroke: 2px rgba(255,255,255,0.25); letter-spacing: -4px;
    min-width: 60px; text-align: right; flex-shrink: 0;
    transition: var(--transition); margin-right: -8px; z-index: 1;
    font-family: 'Outfit', sans-serif;
    text-shadow: none;
}
.top10-card:hover .top10-rank { -webkit-text-stroke-color: var(--primary-color); }
.top10-poster-wrap { position: relative; width: 120px; flex-shrink: 0; border-radius: 10px; overflow: hidden; aspect-ratio: 2/3; }
.top10-poster { width: 100%; height: 100%; object-fit: cover; }
.top10-info { width: 130px; flex-shrink: 0; padding: 0.5rem 0.5rem 0; }
.top10-info .media-title { font-size: 0.85rem; font-weight: 600; margin-bottom: 0.3rem; }
.top10-info .media-meta { font-size: 0.75rem; flex-direction: column; align-items: flex-start; gap: 0.2rem; }

/* ── Wide Card Row (Trending, Top Rated) ── */
.wide-row { display: flex; gap: 1.2rem; overflow-x: auto; padding-bottom: 1rem; scrollbar-width: thin; scrollbar-color: var(--primary-color) transparent; }
.wide-row::-webkit-scrollbar { height: 4px; }
.wide-row::-webkit-scrollbar-thumb { background: var(--primary-color); border-radius: 4px; }
.wide-card { flex-shrink: 0; width: 300px; cursor: pointer; border-radius: 12px; overflow: hidden; background: var(--card-bg); border: 1px solid var(--card-border); transition: var(--transition); }
.wide-card:hover { transform: translateY(-6px); border-color: var(--primary-color); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
.wide-card-img { width: 100%; height: 170px; background-size: cover; background-position: center; position: relative; }
.wide-card-img .play-overlay { opacity: 0; transition: var(--transition); }
.wide-card:hover .wide-card-img .play-overlay { opacity: 1; }
.wide-card-info { padding: 0.8rem; }
.wide-card-info .media-title { font-size: 0.95rem; font-weight: 600; margin-bottom: 0.3rem; }

/* ── DETAIL PAGE ── */
.detail-page { position: fixed; inset: 0; z-index: 900; overflow-y: auto; background: var(--bg-color); }
.detail-page.hidden { display: none; }
.detail-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 50vh; background-size: cover; background-position: center top; z-index: 0; }
.detail-backdrop::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(5,5,5,0.3) 0%, #050505 100%); }
.detail-content { position: relative; z-index: 1; padding: 1.5rem 5% 4rem; max-width: 1400px; margin: 0 auto; }
.detail-back-btn { display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.1); border: 1px solid var(--glass-border); color: white; font-size: 1.2rem; cursor: pointer; transition: var(--transition); margin-bottom: 2rem; margin-top: 1rem; }
.detail-back-btn:hover { background: rgba(255,255,255,0.2); border-color: var(--primary-color); }
.detail-hero { display: flex; gap: 2.5rem; align-items: flex-start; margin-bottom: 3rem; }
.detail-poster { width: 220px; flex-shrink: 0; border-radius: 16px; aspect-ratio: 2/3; object-fit: cover; box-shadow: 0 20px 50px rgba(0,0,0,0.6); }
.detail-logo { max-width: 250px; max-height: 80px; object-fit: contain; margin-bottom: 0.5rem; }
.detail-info { flex: 1; padding-top: 6rem; }
.detail-info h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem; }
.detail-meta { display: flex; align-items: center; gap: 1rem; margin: 0.5rem 0 1rem; flex-wrap: wrap; }
.detail-rating { display: flex; align-items: center; gap: 0.3rem; color: #fbbf24; font-weight: 700; font-size: 1.1rem; }
.detail-meta span { color: var(--text-muted); }
.detail-info p { color: var(--text-muted); line-height: 1.7; margin-bottom: 1.5rem; max-width: 600px; font-size: 1rem; }
.detail-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
.detail-section { margin-bottom: 3rem; }
.detail-section-title { font-size: 1.4rem; font-weight: 700; margin-bottom: 1.5rem; position: relative; padding-left: 1rem; }
.detail-section-title::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 4px; height: 70%; background: var(--primary-color); border-radius: 4px; }

/* ── Actors Grid ── */
.actors-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.actor-card { display: flex; align-items: center; gap: 0.8rem; background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 12px; padding: 0.75rem; transition: var(--transition); cursor: default; }
.actor-card:hover { border-color: var(--glass-border); background: rgba(255,255,255,0.04); }
.actor-photo { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.actor-name { font-weight: 600; font-size: 0.9rem; color: var(--primary-color); }
.actor-char { font-size: 0.8rem; color: var(--text-muted); margin-top: 0.1rem; }

/* ── Episodes ── */
.episodes-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
.episodes-header h3 { font-size: 1.1rem; font-weight: 700; }
.season-select-styled { background: rgba(0,0,0,0.5); color: white; border: 1px solid var(--glass-border); padding: 0.4rem 0.8rem; border-radius: 8px; font-family: inherit; cursor: pointer; outline: none; }
.season-select-styled:focus { border-color: var(--primary-color); }
.episodes-list { display: flex; flex-direction: column; gap: 0.5rem; max-height: 320px; overflow-y: auto; padding-right: 0.3rem; }
.episodes-list::-webkit-scrollbar { width: 4px; }
.episodes-list::-webkit-scrollbar-thumb { background: var(--primary-color); border-radius: 4px; }
.episode-item { display: flex; align-items: flex-start; gap: 0.8rem; background: rgba(255,255,255,0.03); border: 1px solid var(--card-border); border-radius: 10px; padding: 0.8rem; cursor: pointer; transition: var(--transition); position: relative; }
.episode-item:hover { background: rgba(255,255,255,0.07); border-color: var(--primary-color); }
.episode-watching { background: rgba(220,38,38,0.08) !important; border-color: var(--primary-color) !important; }
.watching-badge { position: absolute; top: 0.5rem; left: 0.5rem; background: var(--primary-color); color: white; font-size: 0.65rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 4px; display: flex; align-items: center; gap: 0.3rem; letter-spacing: 0.5px; }
.episode-num { color: var(--text-muted); font-weight: 700; font-size: 0.9rem; min-width: 20px; padding-top: 0.15rem; }
.episode-still { width: 90px; height: 54px; object-fit: cover; border-radius: 6px; flex-shrink: 0; }
.episode-text { flex: 1; }
.episode-title { font-weight: 600; font-size: 0.9rem; margin-bottom: 0.2rem; }
.episode-desc { font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; }
.episode-runtime { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.3rem; }

/* ── Search Dropdown ── */
.search-bar-wrapper { display: flex; align-items: center; position: relative; }
.search-icon { color: var(--text-muted); margin-right: 0.5rem; font-size: 1rem; flex-shrink: 0; }
.search-close-x { background: transparent; border: none; color: var(--text-muted); cursor: pointer; font-size: 1rem; padding: 0.3rem; transition: var(--transition); }
.search-close-x:hover { color: white; }
.search-filter-dropdown { display: flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.08); border: 1px solid var(--glass-border); border-radius: 20px; padding: 0.3rem 0.8rem; cursor: pointer; font-size: 0.85rem; font-weight: 600; white-space: nowrap; flex-shrink: 0; transition: var(--transition); margin-left: 0.5rem; }
.search-filter-dropdown:hover { background: rgba(255,255,255,0.12); }
.search-filter-dropdown i { font-size: 0.75rem; transition: transform 0.2s; }
.search-container { position: relative; }
.search-filter-menu { position: absolute; top: calc(100% + 8px); right: 0; background: #1a1a1a; border: 1px solid var(--glass-border); border-radius: 12px; overflow: hidden; z-index: 500; display: none; min-width: 180px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
.search-filter-menu.open { display: block; }
.filter-option { padding: 0.7rem 1rem; cursor: pointer; font-size: 0.9rem; font-weight: 600; transition: background 0.2s; }
.filter-option:hover { background: rgba(255,255,255,0.05); }
.filter-option.active { color: var(--primary-color); }
.search-dropdown { position: absolute; top: calc(100% + 8px); left: 0; right: 0; background: #1a1a1a; border: 1px solid var(--glass-border); border-radius: 14px; z-index: 400; overflow: hidden; box-shadow: 0 15px 40px rgba(0,0,0,0.7); display: none; }
.search-dropdown.show-results { display: block; }
.search-recent-header { display: flex; justify-content: space-between; align-items: center; padding: 0.7rem 1rem 0.3rem; }
.search-recent-header span { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); letter-spacing: 0.5px; }
.search-recent-header button { background: transparent; border: none; color: var(--text-muted); font-size: 0.8rem; cursor: pointer; }
.search-recent-header button:hover { color: white; }
.recent-item { display: flex; align-items: center; gap: 0.7rem; padding: 0.6rem 1rem; cursor: pointer; color: var(--text-muted); font-size: 0.9rem; transition: background 0.2s; }
.recent-item:hover { background: rgba(255,255,255,0.05); color: white; }
.search-result-item { display: flex; align-items: center; gap: 0.8rem; padding: 0.6rem 1rem; cursor: pointer; transition: background 0.2s; }
.search-result-item:hover { background: rgba(255,255,255,0.05); }
.search-result-poster { width: 40px; height: 60px; object-fit: cover; border-radius: 6px; flex-shrink: 0; }
.search-result-poster-ph { width: 40px; height: 60px; border-radius: 6px; background: rgba(255,255,255,0.05); flex-shrink: 0; }
.search-result-title { font-weight: 600; font-size: 0.9rem; }
.search-result-meta { font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem; }
.search-loading { padding: 1rem; text-align: center; color: var(--text-muted); }
.no-results-small { padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.9rem; }

/* ── Browse Modal ── */
.browse-modal-content { max-width: 380px; width: 90%; padding: 2rem; border-radius: 20px; position: relative; background: #161616; }
.browse-close-btn { position: absolute; top: 1rem; right: 1rem; background: transparent; border: none; color: var(--text-muted); font-size: 1.3rem; cursor: pointer; }
.browse-close-btn:hover { color: white; }
.browse-title { font-size: 1.4rem; font-weight: 800; text-align: center; margin-bottom: 1.5rem; }
.browse-section-label { font-size: 0.7rem; font-weight: 700; color: var(--text-muted); letter-spacing: 1px; margin: 1.2rem 0 0.7rem; }
.browse-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.8rem; }
.browse-grid-2 { grid-template-columns: repeat(2, 1fr); }
.browse-item { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.04); border: 1px solid var(--card-border); border-radius: 14px; padding: 1rem 0.5rem; cursor: pointer; transition: var(--transition); text-align: center; font-size: 0.85rem; font-weight: 600; }
.browse-item:hover { background: rgba(255,255,255,0.08); border-color: var(--glass-border); transform: translateY(-2px); }
.browse-item.wide { flex-direction: row; gap: 0.7rem; padding: 1rem 1.2rem; font-size: 0.95rem; }
.browse-icon { width: 50px; height: 50px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; }

/* ── Responsive Detail ── */
@media (max-width: 768px) {
    .detail-hero { flex-direction: column; }
    .detail-poster { width: 150px; }
    .detail-info { padding-top: 1rem; }
    .detail-info h1 { font-size: 1.8rem; }
    .actors-grid { grid-template-columns: 1fr 1fr; }
    .wide-card { width: 240px; }
    .top10-card { display: flex; }
    .top10-rank { font-size: 3.5rem; min-width: 40px; }
    .top10-poster-wrap { width: 90px; }
}

/* ── Player Full Screen ── */
.player-modal.active .full-window-modal { display: flex; flex-direction: column; }
.full-window-modal .iframe-container { flex: 1; }

