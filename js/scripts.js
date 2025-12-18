// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Header dinámico: Toggle menu para móvil
    // Menú móvil animado
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const body = document.body;

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

    // Dinámica de videos y playlists
    const videoPlayer = document.getElementById('video-player');
    const playlistSelect = document.getElementById('playlist-select');
    const currentPlaylist = document.getElementById('current-playlist');
    const addPlaylistBtn = document.getElementById('add-playlist');

    // Playlists de ejemplo (puedes cargar desde URL params o storage)
    let playlists = {
        'Reacciones Música': [
            { title: 'Reacción 1', src: 'video1.mp4' },
            { title: 'Reacción 2', src: 'video2.mp4' }
        ],
        'Películas': [
            { title: 'Película 1', src: 'movie1.mp4' }
        ]
    };

    // Cargar playlists en select
    function loadPlaylists() {
        playlistSelect.innerHTML = '<option value="">Selecciona una lista</option>';
        Object.keys(playlists).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = key;
            playlistSelect.appendChild(option);
        });
    }

    loadPlaylists();

    // Cambiar playlist
    playlistSelect.addEventListener('change', (e) => {
        const selected = e.target.value;
        if (selected) {
            const list = playlists[selected];
            currentPlaylist.innerHTML = '';
            list.forEach((video, index) => {
                const li = document.createElement('li');
                li.textContent = video.title;
                li.addEventListener('click', () => playVideo(video.src));
                currentPlaylist.appendChild(li);
            });
            // Reproducir el primero por default
            if (list.length > 0) playVideo(list[0].src);
        }
    });

    function playVideo(src) {
        videoPlayer.src = src;
        videoPlayer.play();
    }

    // Agregar nueva playlist
    addPlaylistBtn.addEventListener('click', () => {
        const name = prompt('Nombre de la nueva playlist:');
        if (name) {
            playlists[name] = [];
            loadPlaylists();
            // Aquí podrías agregar lógica para agregar videos via URL o input
        }
    });

    // Dinámica via URL: Ej. ?playlist=Reacciones%20Música
    const urlParams = new URLSearchParams(window.location.search);
    const playlistParam = urlParams.get('playlist');
    if (playlistParam && playlists[playlistParam]) {
        playlistSelect.value = playlistParam;
        playlistSelect.dispatchEvent(new Event('change'));
    }

    // Para horarios: Podrías hacer dinámico similar, pero por ahora estático
});