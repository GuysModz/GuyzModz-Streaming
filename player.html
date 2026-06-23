<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Player — GuyzModz</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
    <style>
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
            --accent: #e11d28;
            --accent-bright: #ff2d3a;
            --accent-glow: rgba(225, 29, 40, 0.45);
            --dark: #050508;
            --surface: rgba(8,8,14,0.96);
            --border: rgba(255,255,255,0.07);
            --text: #f0f0f5;
            --muted: rgba(240,240,245,0.42);
            --ease: cubic-bezier(0.4,0,0.2,1);
        }

        html, body {
            width: 100%; height: 100%;
            background: #000;
            color: var(--text);
            font-family: 'Outfit', sans-serif;
            overflow: hidden;
            user-select: none;
        }

        /* ── Loading cinematic screen ──────────────────── */
        #loading-screen {
            position: fixed; inset: 0; z-index: 100;
            background: var(--dark);
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            gap: 1.5rem;
            transition: opacity 0.6s var(--ease);
        }
        #loading-screen.out { opacity: 0; pointer-events: none; }

        .loader-logo {
            font-size: 1rem; font-weight: 800; letter-spacing: 0.25em;
            text-transform: uppercase; color: var(--muted);
        }
        .loader-logo span { color: var(--accent); }

        .loader-title {
            font-size: 2rem; font-weight: 700;
            text-align: center; max-width: 600px;
            line-height: 1.2;
        }

        .loader-bar-wrap {
            width: 200px; height: 2px;
            background: rgba(255,255,255,0.1);
            border-radius: 2px; overflow: hidden;
        }
        .loader-bar {
            height: 100%; width: 0%;
            background: var(--accent);
            border-radius: 2px;
            animation: loadBar 1.2s var(--ease) forwards;
        }
        @keyframes loadBar { to { width: 100%; } }

        /* ── Full viewport iframe ──────────────────────── */
        #video-wrap {
            position: fixed; inset: 0; z-index: 1;
            background: #000;
        }
        #video-wrap iframe,
        #video-wrap video {
            width: 100%; height: 100%;
            border: none; display: block;
        }

        /* ── Overlay (auto-hide) ───────────────────────── */
        #overlay {
            position: fixed; inset: 0; z-index: 10;
            pointer-events: none;
            transition: opacity 0.5s var(--ease);
        }
        #overlay.hidden { opacity: 0; }
        body.hide-cursor { cursor: none; }

        /* ── TOP BAR ───────────────────────────────────── */
        #bar-top {
            position: absolute; top: 0; left: 0; right: 0;
            padding: 1.4rem 2rem 3rem;
            background: linear-gradient(to bottom,
                rgba(0,0,0,0.88) 0%,
                rgba(0,0,0,0.4) 60%,
                transparent 100%);
            display: flex; align-items: center; gap: 1rem;
            flex-wrap: wrap;
            pointer-events: all;
        }

        #back-btn {
            display: inline-flex; align-items: center; gap: 0.5rem;
            padding: 0.5rem 1.1rem;
            background: rgba(255,255,255,0.06);
            border: 1px solid var(--border);
            border-radius: 10px;
            color: #fff; font-size: 0.875rem; font-weight: 600;
            text-decoration: none; cursor: pointer;
            transition: background 0.2s, border-color 0.2s;
            backdrop-filter: blur(8px);
        }
        #back-btn:hover {
            background: rgba(255,255,255,0.16);
            border-color: rgba(255,255,255,0.2);
        }

        #title-block { flex: 1; min-width: 0; }
        #title-main {
            font-size: 1.25rem; font-weight: 700;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            text-shadow: 0 2px 12px rgba(0,0,0,0.9);
        }
        #title-sub {
            font-size: 0.78rem; color: var(--muted);
            margin-top: 0.2rem; letter-spacing: 0.03em;
        }

        /* ── BOTTOM BAR ────────────────────────────────── */
        #bar-bottom {
            display: none; /* Disabled so it does not sit on top of the embed player's real controls. */
        }

        /* Fake progress bar (cosmetic) */
        #fake-progress {
            width: 100%; height: 3px;
            background: rgba(255,255,255,0.12);
            border-radius: 3px;
            margin-bottom: 1.1rem;
            position: relative;
            overflow: visible;
            cursor: pointer;
        }
        #fake-progress-fill {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, #a00, var(--accent-bright));
            border-radius: 3px;
            position: relative;
            transition: width 0.1s linear;
        }
        #fake-progress-fill::after {
            content: '';
            position: absolute; right: -5px; top: 50%;
            transform: translateY(-50%);
            width: 12px; height: 12px;
            background: #fff;
            border-radius: 50%;
            box-shadow: 0 0 8px var(--accent-glow);
            opacity: 0;
            transition: opacity 0.2s;
        }
        #fake-progress:hover #fake-progress-fill::after { opacity: 1; }

        /* Controls row */
        #controls-row {
            display: flex; align-items: center; gap: 1rem;
        }

        .ctrl-btn {
            background: none; border: none; cursor: pointer;
            color: rgba(255,255,255,0.75);
            font-size: 1.1rem;
            width: 38px; height: 38px;
            display: flex; align-items: center; justify-content: center;
            border-radius: 8px;
            transition: color 0.2s, background 0.2s;
        }
        .ctrl-btn:hover {
            color: #fff;
            background: rgba(255,255,255,0.1);
        }
        .ctrl-btn.primary {
            background: var(--accent);
            color: #fff;
            width: 44px; height: 44px;
            border-radius: 50%;
            font-size: 1rem;
            box-shadow: 0 0 20px var(--accent-glow), 0 0 40px rgba(225,29,40,0.15);
            transition: transform 0.15s, box-shadow 0.2s;
        }
        .ctrl-btn.primary:hover {
            transform: scale(1.08);
            box-shadow: 0 0 28px var(--accent-glow), 0 0 60px rgba(225,29,40,0.2);
        }

        #time-display {
            font-size: 0.78rem; font-weight: 500;
            color: var(--muted); letter-spacing: 0.04em;
            min-width: 80px;
        }

        .ctrl-sep { flex: 1; }

        /* Volume slider */
        #vol-wrap { display: flex; align-items: center; gap: 0.6rem; }
        #vol-slider {
            -webkit-appearance: none;
            width: 72px; height: 3px;
            background: rgba(255,255,255,0.18);
            border-radius: 3px; outline: none; cursor: pointer;
        }
        #vol-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 12px; height: 12px;
            border-radius: 50%;
            background: #fff;
            cursor: pointer;
        }

        /* TV controls (season/episode) */
        #tv-controls {
            display: flex; align-items: center; gap: 0.5rem;
            flex-wrap: wrap;
            background: rgba(0,0,0,0.5);
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 0.3rem;
            backdrop-filter: blur(12px);
        }
        #tv-controls.hidden { display: none; }

        .ctrl-label {
            font-size: 0.72rem; font-weight: 600;
            letter-spacing: 0.06em; text-transform: uppercase;
            color: var(--muted);
        }
        .ctrl-select {
            background: rgba(15,15,25,0.85);
            border: 1px solid rgba(255,255,255,0.12);
            border-radius: 9px;
            color: #fff; font-family: 'Outfit', sans-serif;
            font-size: 0.85rem; font-weight: 500;
            padding: 0.4rem 0.9rem;
            cursor: pointer; outline: none;
            backdrop-filter: blur(10px);
            transition: border-color 0.2s;
        }
        .ctrl-select:hover { border-color: var(--accent); }
        .ctrl-select option { background: #0c0c18; }

        /* Fullscreen btn */
        #fs-btn { margin-left: 0.2rem; }

        /* ── Ambient glow behind bar-bottom ─────────────── */
        #bar-bottom::before {
            content: '';
            position: absolute; bottom: 0; left: 10%; right: 10%; height: 1px;
            background: linear-gradient(90deg, transparent, var(--accent-glow), transparent);
            pointer-events: none;
        }
    </style>
</head>
<body>

<!-- Cinematic loading screen -->
<div id="loading-screen">
    <div class="loader-logo">Guyz<span>Modz</span> Stream</div>
    <div class="loader-title" id="load-title">Loading…</div>
    <div class="loader-bar-wrap"><div class="loader-bar"></div></div>
</div>

<!-- Full-viewport video/iframe -->
<div id="video-wrap"></div>

<!-- Overlay -->
<div id="overlay">

    <!-- Top bar -->
    <div id="bar-top">
        <a id="back-btn" href="index.html"><i class="fa-solid fa-chevron-left"></i> Back</a>
        <div id="title-block">
            <div id="title-main">Loading…</div>
            <div id="title-sub"></div>
        </div>

        <!-- TV: season/episode dropdowns moved to top so bottom embed controls stay clickable -->
        <div id="tv-controls" class="hidden">
            <span class="ctrl-label">S</span>
            <select class="ctrl-select" id="season-select"></select>
            <span class="ctrl-label">E</span>
            <select class="ctrl-select" id="episode-select"></select>
        </div>
    </div>

    <!-- Bottom bar -->
    <div id="bar-bottom">
        <!-- Cosmetic progress bar -->
        <div id="fake-progress">
            <div id="fake-progress-fill"></div>
        </div>

        <!-- Controls -->
        <div id="controls-row">
            <!-- Custom controls disabled; embed player controls are used instead. -->
            <button class="ctrl-btn primary" id="play-btn" title="Play / Pause">
                <i class="fa-solid fa-play" id="play-icon"></i>
            </button>

            <button class="ctrl-btn" title="Restart" onclick="reloadPlayer()">
                <i class="fa-solid fa-rotate-left"></i>
            </button>

            <div id="vol-wrap">
                <button class="ctrl-btn" id="mute-btn" title="Mute" onclick="toggleMute()">
                    <i class="fa-solid fa-volume-high" id="vol-icon"></i>
                </button>
                <input type="range" id="vol-slider" min="0" max="100" value="100" title="Volume">
            </div>

            <div id="time-display">0:00 / —:——</div>

            <div class="ctrl-sep"></div>

            <button class="ctrl-btn" id="fs-btn" title="Fullscreen" onclick="toggleFullscreen()">
                <i class="fa-solid fa-expand"></i>
            </button>
        </div>
    </div>

</div><!-- /overlay -->

<script src="player.js"></script>
</body>
</html>
