// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Header dinámico: Toggle menu para móvil
    // Menú móvil animado
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const body = document.body;

if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
    });

    // Cerrar menú al hacer click en un enlace
    document.querySelectorAll('#nav-menu-mobile a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });

    // Click fuera
    body.addEventListener('click', (e) => {
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

// Cerrar menú al hacer click en un enlace
document.querySelectorAll('#nav-menu-mobile a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        body.classList.remove('menu-open');
    });
});

// Cerrar menú al hacer click fuera (en el overlay)
body.addEventListener('click', (e) => {
    if (body.classList.contains('menu-open') && !mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        body.classList.remove('menu-open');
    }
});

    // Función para agregar/quitar secciones en el header
    function addHeaderSection(name, id) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${id}`;
        a.textContent = name;
        li.appendChild(a);
        navMenu.appendChild(li);
    }

    function removeHeaderSection(name) {
        const items = navMenu.querySelectorAll('li');
        items.forEach(item => {
            if (item.textContent === name) {
                item.remove();
            }
        });
    }

    // Ejemplo: Agregar una sección nueva (puedes llamar estas funciones desde consola o integrar en UI)
    // addHeaderSection('Nueva Sección', 'new-section');

    
// SISTEMA DE TABS GLOBAL (funciona entre páginas)
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        const tab = button.dataset.tab;

        // Si NO estamos en index.html → navegar
        if (!document.getElementById(tab)) {
            window.location.href = `index.html#${tab}`;
            return;
        }

        activateTab(tab);
    });
});

// Activar tab por nombre
function activateTab(tabId) {
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === tabId);
    });
}

// Activar tab desde hash al cargar
document.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
        activateTab(hash);
    }
});

// Cargar videos dinámicamente desde videos.json
async function loadVideos() {
    const grids = document.querySelectorAll('.video-grid');
    if (!grids.length) return;

    try {
        const response = await fetch('data/videos.json');
        const videos = await response.json();

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
        console.error(err);
    }
}

document.addEventListener('DOMContentLoaded', loadVideos);

// Ejecutar cuando la página cargue
document.addEventListener('DOMContentLoaded', loadVideos);

// Llamar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    loadVideos();
    // ... tu otro código de tabs, menú, etc.
});

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

document.addEventListener('DOMContentLoaded', loadPlaylists);
});