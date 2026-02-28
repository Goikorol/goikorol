// ===============================
// scripts.js
// ===============================

// ===============================
// VARIABLES GLOBALES
// ===============================
let ALL_VIDEOS = [];

// ===============================
// TABS
// ===============================
function activateTab(tabId) {
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === tabId);
    });
}

// ===============================
// CARGA DE VIDEOS
// ===============================
async function loadVideos() {
    const grids = document.querySelectorAll('.video-grid');
    if (!grids.length) return;

    try {
        const response = await fetch('data/videos.json');
        const videos = await response.json();

        // 🔹 Guardamos todos los videos para el buscador universal
        ALL_VIDEOS = videos;

        grids.forEach(grid => {
            const category = grid.dataset.category;
            grid.innerHTML = '';

            const filtered = videos.filter(v => v.category === category);

            if (!filtered.length) {
                grid.innerHTML = '<p>No hay videos todavía.</p>';
                return;
            }

            filtered.forEach(video => {
                const card = document.createElement('div');
                card.className = 'video-card';
                card.dataset.playlist = video.playlist;

                card.onclick = () => {
                    window.location.href = `player.html?video=${video.id}`;
                };

                card.innerHTML = `
                    <div class="thumbnail">
                        <img src="${video.thumbnail}" alt="${video.title}">
                        <div class="play-icon">▶</div>
                    </div>
                    <div class="video-info">
                        <h3>${video.title}</h3>
                        <p>${video.description}</p>
                        <p class="video-date">📅 ${video.date}</p>
                    </div>
                `;

                grid.appendChild(card);
            });
        });

    } catch (err) {
        console.error('Error cargando videos:', err);
    }
}

// ===============================
// FILTROS DE PLAYLIST
// ===============================
async function loadPlaylists() {
    const selects = document.querySelectorAll('.playlist-filter');
    if (!selects.length) return;

    const response = await fetch('data/videos.json');
    const videos = await response.json();

    selects.forEach(select => {
        const category = select.dataset.category;

        const playlists = [
            ...new Set(
                videos
                    .filter(v => v.category === category)
                    .map(v => v.playlist)
            )
        ];

        playlists.forEach(pl => {
            const option = document.createElement('option');
            option.value = pl;
            option.textContent = pl;
            select.appendChild(option);
        });

        select.addEventListener('change', () => {
            const value = select.value;

            document
                .querySelectorAll(
                    `.video-grid[data-category="${category}"] .video-card`
                )
                .forEach(card => {
                    const show =
                        value === 'all' || card.dataset.playlist === value;

                    card.style.display = show ? 'block' : 'none';
                });
        });
    });
}

// ===============================
// BUSCADOR UNIVERSAL
// ===============================
function setupGlobalSearch() {
    const input = document.getElementById('global-search');
    const info = document.getElementById('search-results-info');
    if (!input) return;

    input.addEventListener('input', () => {
        const query = input.value.toLowerCase().trim();
        let totalResults = 0;

        document.querySelectorAll('.video-card').forEach(card => {
            const text = card.innerText.toLowerCase();
            const match = text.includes(query);

            card.style.display = match || !query ? 'block' : 'none';
            if (match) totalResults++;
        });

        if (!query) {
            info.textContent = '';
            return;
        }

        info.textContent = `🎬 ${totalResults} resultado(s) encontrados`;
        autoSwitchTab();
    });
}

// ===============================
// CAMBIO AUTOMÁTICO DE TAB
// ===============================
function autoSwitchTab() {
    const visibleCards = document.querySelectorAll(
        '.video-card:not([style*="display: none"])'
    );

    if (!visibleCards.length) return;

    const firstCard = visibleCards[0];
    const grid = firstCard.closest('.video-grid');
    if (!grid) return;

    const category = grid.dataset.category;
    activateTab(category);
}

// ===============================
// INIT
// ===============================
document.addEventListener('DOMContentLoaded', () => {

    // ===== MENÚ MÓVIL =====
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            body.classList.toggle('menu-open');
        });

        document.querySelectorAll('#nav-menu-mobile a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                body.classList.remove('menu-open');
            });
        });

        body.addEventListener('click', e => {
            if (
                body.classList.contains('menu-open') &&
                !mobileMenu.contains(e.target) &&
                !menuToggle.contains(e.target)
            ) {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    }

    // ===== TABS =====
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.dataset.tab;

            localStorage.setItem('activeTab', tab);

            if (!document.getElementById(tab)) {
                window.location.href = `index.html#${tab}`;
                return;
            }

            activateTab(tab);
        });
    });

    // Activar tab desde hash o storage
    const savedTab = localStorage.getItem('activeTab');
    const hash = window.location.hash.replace('#', '');

    if (hash) {
        activateTab(hash);
    } else if (savedTab && document.getElementById(savedTab)) {
        activateTab(savedTab);
    }

    // ===== CARGA INICIAL =====
    loadVideos();
    loadPlaylists();
    setupGlobalSearch(); // 🔍 BUSCADOR UNIVERSAL
});