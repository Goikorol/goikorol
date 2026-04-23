// ===============================
// scripts.js
// ===============================

// ===============================
// VARIABLES GLOBALES
// ===============================
let ALL_VIDEOS = [];

/* ===============================
   CONFIG HOME
=============================== */

// 👉 PEGÁ ACÁ el ID del video destacado (YouTube ID)
const FEATURED_VIDEO_ID = "Gp8Brla6ltk";
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
const urlParams = new URLSearchParams(window.location.search);
const videoId = urlParams.get('video');

if (videoId) {
    async function loadDetails() {
        const response = await fetch('data/videos.json');
        const videos = await response.json();
        const video = videos.find(v => v.id === videoId);

        if (!video) return;

        const embedUrl = getEmbedUrl(video);
        const player = document.getElementById('youtube-player');

        if (embedUrl) {
            player.src = embedUrl;
        } else {
            player.outerHTML = "<p>⚠ Plataforma no soportada</p>";
        }

        document.getElementById('player-title').textContent = video.title;
        document.querySelector('.player-description').textContent = video.description;
        document.querySelector('.player-date').textContent = `Publicado: ${video.date}`;
    }

    loadDetails();
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

        if (hash && document.getElementById(hash)) {
            activateTab(hash);
        } else if (savedTab && document.getElementById(savedTab)) {
            activateTab(savedTab);
        } else {
            activateTab('home'); // 👈 default SIEMPRE
            localStorage.setItem('activeTab', 'home');
        }

    // ===== CARGA INICIAL =====
    loadVideos();
    loadPlaylists();
    setupGlobalSearch(); // 🔍 BUSCADOR UNIVERSAL
});



function sortGridByDate(category, oldestFirst) {
    const grid = document.querySelector(
        `.video-grid[data-category="${category}"]`
    );
    if (!grid) return;

    const cards = Array.from(grid.children);

    cards.sort((a, b) => {
        const dateA = new Date(
            a.querySelector('.video-date').textContent.replace('📅 ', '')
        );
        const dateB = new Date(
            b.querySelector('.video-date').textContent.replace('📅 ', '')
        );

        return oldestFirst
            ? dateA - dateB
            : dateB - dateA;
    });

    

    cards.forEach(card => grid.appendChild(card));
}
// ===== ORDEN POR FECHA =====
document.querySelectorAll('.order-toggle').forEach(toggle => {
    toggle.addEventListener('change', () => {
        const category = toggle.dataset.category;
        const oldestFirst = toggle.checked;

        sortGridByDate(category, oldestFirst);
    });


    // ===============================
// BOTÓN VOLVER ARRIBA
// ===============================
const toTopBtn = document.getElementById('toTopBtn');

if (toTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            toTopBtn.classList.add('show');
        } else {
            toTopBtn.classList.remove('show');
        }
    });

    toTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
});


function renderHomeVideos() {
    const featuredContainer = document.getElementById("featured-video");
//  const latestContainer = document.getElementById("latest-video");

//   if (!featuredContainer || !latestContainer || !ALL_VIDEOS.length) return;

    // ===============================
    // VIDEO DESTACADO (MANUAL)
    // ===============================
    const featuredVideo = ALL_VIDEOS.find(
        v => v.id === FEATURED_VIDEO_ID
    );

    if (featuredVideo) {
        featuredContainer.innerHTML = createHomeVideoCard(featuredVideo);
    } else {
        featuredContainer.innerHTML =
            "<p class='loading-text'>Video destacado no encontrado.</p>";
    }

    // ===============================
    // ÚLTIMO VIDEO (AUTOMÁTICO)
    // ===============================
//    const latestVideo = [...ALL_VIDEOS]
//        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
//
//    if (latestVideo) {
//        latestContainer.innerHTML = createHomeVideoCard(latestVideo);
//    }
}

// ===============================
// TEMPLATE CARD HOME
// ===============================
function createHomeVideoCard(video) {
    return `
        <div class="video-card home-video" onclick="location.href='player.html?video=${video.id}'">
            <div class="thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}">
                <div class="play-icon">▶</div>
            </div>
            <div class="video-info">
                <h3>${video.title}</h3>
                <p>${video.description || ""}</p>
                <p class="video-date">📅 ${video.date}</p>
            </div>
        </div>
    `;
}


function renderFeaturedVideo() {
    const container = document.getElementById("featured-video");
    if (!container || !FEATURED_VIDEO_ID) return;

    const video = findVideoById(FEATURED_VIDEO_ID);
    if (!video) {
        container.innerHTML = "<p class='loading-text'>Video destacado no encontrado</p>";
        return;
    }

    container.innerHTML = createHomeVideoCard(video);
}

function renderLatestVideo() {
    const container = document.getElementById("latest-video");
    if (!container || !allVideos.length) return;

    const latest = [...allVideos].sort((a, b) =>
        new Date(b.date) - new Date(a.date)
    )[0];

    container.innerHTML = createHomeVideoCard(latest);
}

/* UTILIDADES */

function findVideoById(videoId) {
    return allVideos.find(video => video.id === videoId);
}

function createHomeVideoCard(video) {
    return `
        <div class="video-card home-video" onclick="location.href='player.html?video=${video.id}'">
            <div class="thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}">
                <div class="play-icon">▶</div>
            </div>
            <div class="video-info">
                <h3>${video.title}</h3>
                <p>${video.channel}</p>
                <div class="video-date">${video.date}</div>
            </div>
        </div>
    `;
}



// ===============================
// ANUNCIOS – ÚLTIMOS VIDEOS POR SECCIÓN
// ===============================
function renderLatestVideosAnnouncements() {
    if (!ALL_VIDEOS.length) return;

    const categories = [
        { key: "goikorol", label: "Goikorol", el: "latest-goikorol" },
        { key: "themoviesniper", label: "The Movie Sniper", el: "latest-moviesniper" },
        { key: "gameplays", label: "Gameplays", el: "latest-gameplays" }
    ];

    categories.forEach(cat => {
        const container = document.getElementById(cat.el);
        if (!container) return;

        const videos = ALL_VIDEOS
            .filter(v => v.category === cat.key)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        if (!videos.length) {
            container.textContent = `${cat.label}: sin videos todavía`;
            return;
        }

        const latest = videos[0];

        container.innerHTML = `
            <strong>${cat.label}:</strong>
            <a href="player.html?video=${latest.id}">
                ${latest.title}
            </a>
        `;
    });
}


/* ===============================
   ANUNCIO → IR A COMUNIDAD
=============================== */

document.addEventListener("DOMContentLoaded", () => {
    const communityCard = document.querySelector(".announcement-community");

    if (!communityCard) return;

    communityCard.addEventListener("click", () => {
        localStorage.setItem("activeTab", "comunidad");
        activateTab("comunidad");

        // Scroll suave al inicio del contenido
        document
            .querySelector(".tabs-container")
            ?.scrollIntoView({ behavior: "smooth" });
    });
});