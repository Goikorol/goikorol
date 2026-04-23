function getEmbedUrl(video) {
    switch (video.platform) {
        case "youtube":
            return `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`;
        case "rumble":
            return `https://rumble.com/embed/${video.id}/?autoplay=2`;
        default:
            return null;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get("video");

    if (!videoId) return;

    const response = await fetch("data/videos.json");
    const videos = await response.json();
    const video = videos.find(v => v.id === videoId);

    if (!video) return;

    const player = document.getElementById("video-player");

    const embedUrl = getEmbedUrl(video);

    if (embedUrl) {
        player.src = embedUrl;
    } else {
        player.outerHTML = "<p>⚠ Plataforma no soportada</p>";
    }

    document.getElementById("player-title").textContent = video.title;
    document.querySelector(".player-description").textContent = video.description;
    document.querySelector(".player-date").textContent = `Publicado: ${video.date}`;
});

const player = document.getElementById("video-player");

function getEmbedUrl(video) {
    if (video.platform === "youtube") {
        return `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`;
    }

    if (video.platform === "rumble") {
        // Si ya guardaste la URL completa
        if (video.id.startsWith("http")) {
            return video.id;
        }

        // Si guardás solo el ID
        return `https://rumble.com/embed/${video.id}/?autoplay=2`;
    }

    return null;
}

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get("video");

    if (!videoId) return;

    const response = await fetch("data/videos.json");
    const videos = await response.json();
    const video = videos.find(v => v.id === videoId);

    if (!video) return;

    const player = document.getElementById("video-player");
    const embedUrl = getEmbedUrl(video);

    if (embedUrl) {
        player.src = embedUrl;
    } else {
        player.outerHTML = "<p>⚠ Plataforma no soportada</p>";
    }

    document.getElementById("player-title").textContent = video.title;
    document.querySelector(".player-description").textContent = video.description;
    document.querySelector(".player-date").textContent = `Publicado: ${video.date}`;
});

// cuando cargás el video:
player.src = getEmbedUrl(video);