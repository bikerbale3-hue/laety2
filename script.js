"use strict";

/* LISTE DES CHANSONS */

const songs = [
    {
        id: "valentine",
        title: "Valentine",
        artist: "Andy Bumuntu",
        audio: "assets/music/valentine.mp4",
        lyrics: "assets/lyrics/valentine.json"
    },
    {
        id: "lento",
        title: "Lento",
        artist: "Daniel Santacruz",
        audio: "assets/music/lento.mp4",
        lyrics: "assets/lyrics/lento.json"
    }
];

/* ELEMENTS */

const playlist = document.getElementById("playlist");
const audio = document.getElementById("audio");
const lyricsContainer = document.getElementById("lyrics");
const songTitle = document.getElementById("songTitle");
const playerTitle = document.getElementById("playerTitle");
const playerArtist = document.getElementById("playerArtist");

let currentLyrics = [];
let currentSong = null;
let activeIndex = -1;

/* CREATION DES ETOILES */

const starsContainer = document.getElementById("stars");

for (let i = 0; i < 80; i++) {
    const star = document.createElement("div");
    star.className = "star";

    const size = Math.random() * 3 + 1;

    star.style.width = size + "px";
    star.style.height = size + "px";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDuration = (Math.random() * 8 + 5) + "s";
    star.style.animationDelay = (Math.random() * 8) + "s";

    starsContainer.appendChild(star);
}

/* AFFICHER LA PLAYLIST */

function displayPlaylist() {
    playlist.innerHTML = "";

    songs.forEach(song => {
        const card = document.createElement("div");
        card.className = "music-card";

        card.innerHTML = `
            <div class="music-info">
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
            </div>
            <button type="button">▶ Écouter</button>
        `;

        card.querySelector("button").addEventListener("click", () => {
            loadSong(song);
        });

        playlist.appendChild(card);
    });
}

/* CHARGER UNE CHANSON */

async function loadSong(song) {
    currentSong = song;
    currentLyrics = [];
    activeIndex = -1;

    audio.pause();
    audio.removeAttribute("src");
    audio.load();

    playerTitle.textContent = song.title;
    playerArtist.textContent = song.artist;
    songTitle.textContent = song.title + " — " + song.artist;

    lyricsContainer.innerHTML = `
        <p class="loading">Chargement des paroles...</p>
    `;

    try {
        const response = await fetch(song.lyrics);

        if (!response.ok) {
            throw new Error("Fichier JSON introuvable : " + song.lyrics);
        }

        const data = await response.json();

        if (!Array.isArray(data.paroles)) {
            throw new Error("Format du fichier JSON incorrect.");
        }

        currentLyrics = data.paroles;
        displayLyrics();

        audio.src = song.audio;
        audio.load();

        const playPromise = audio.play();

        if (playPromise) {
            await playPromise;
        }

    } catch (error) {
        console.error(error);

        lyricsContainer.innerHTML = `
            <p class="loading">
                Impossible de charger la chanson ou ses paroles.
                Vérifie les chemins des fichiers.
            </p>
        `;
    }
}

/* AFFICHER LES PAROLES */

function displayLyrics() {
    lyricsContainer.innerHTML = "";

    currentLyrics.forEach((line, index) => {
        const p = document.createElement("p");

        p.className = "lyric-line";
        p.dataset.index = index;
        p.textContent = line.text;

        lyricsContainer.appendChild(p);
    });
}

/* SYNCHRONISATION DES PAROLES */

audio.addEventListener("timeupdate", () => {
    if (!currentLyrics.length) return;

    const time = audio.currentTime;

    let index = -1;

    for (let i = 0; i < currentLyrics.length; i++) {
        if (time >= Number(currentLyrics[i].time)) {
            index = i;
        } else {
            break;
        }
    }

    if (index === activeIndex) return;

    activeIndex = index;

    const lines = document.querySelectorAll(".lyric-line");

    lines.forEach((line, i) => {
        line.classList.toggle("active", i === activeIndex);
    });

    if (activeIndex >= 0 && lines[activeIndex]) {
        lines[activeIndex].scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
});

/* ERREURS AUDIO */

audio.addEventListener("error", () => {
    if (!currentSong) return;

    console.error("Impossible de lire le fichier audio :", currentSong.audio);
});

/* INITIALISATION */

displayPlaylist();