"use strict";


/* =========================
   ÉTOILES
========================= */

const starsContainer = document.getElementById("stars");

for (let i = 0; i < 80; i++) {

    const star = document.createElement("div");

    star.className = "star";

    star.style.left = Math.random() * 100 + "%";

    star.style.top = Math.random() * 100 + "%";

    const size = Math.random() * 3 + 1;

    star.style.width = size + "px";
    star.style.height = size + "px";

    star.style.animationDuration =
        (Math.random() * 8 + 5) + "s";

    star.style.animationDelay =
        (Math.random() * 8) + "s";

    starsContainer.appendChild(star);
}


/* =========================
   ÉLÉMENTS
========================= */

const audio = document.getElementById("audio");

const playButton =
    document.getElementById("playButton");

const lyricsContainer =
    document.getElementById("lyrics");


/* =========================
   CHARGEMENT DES PAROLES
========================= */

let lyrics = [];


fetch("assets/lyrics/valentine.json")
    .then(response => {

        if (!response.ok) {
            throw new Error(
                "Impossible de charger valentine.json"
            );
        }

        return response.json();
    })

    .then(data => {

        lyrics = data.paroles || [];

        afficherParoles();

    })

    .catch(error => {

        console.error(error);

        lyricsContainer.innerHTML = `
            <p class="loading">
                Impossible de charger les paroles.
            </p>
        `;
    });


/* =========================
   AFFICHER PAROLES
========================= */

function afficherParoles() {

    lyricsContainer.innerHTML = "";

    lyrics.forEach((ligne, index) => {

        const p = document.createElement("p");

        p.className = "lyric-line";

        p.dataset.index = index;

        p.textContent = ligne.text;

        lyricsContainer.appendChild(p);
    });
}


/* =========================
   PLAY / PAUSE
========================= */

playButton.addEventListener("click", () => {

    if (audio.paused) {

        audio.play()
            .then(() => {

                playButton.textContent = "⏸ Pause";

            })
            .catch(error => {

                console.error(
                    "Impossible de lancer la musique :",
                    error
                );

            });

    } else {

        audio.pause();

        playButton.textContent = "▶ Écouter";
    }
});


/* =========================
   SYNCHRONISATION
========================= */

audio.addEventListener("timeupdate", () => {

    if (lyrics.length === 0) {
        return;
    }

    const currentTime = audio.currentTime;

    let currentIndex = -1;


    for (let i = 0; i < lyrics.length; i++) {

        if (currentTime >= lyrics[i].time) {

            currentIndex = i;

        } else {

            break;

        }
    }


    const lines =
        document.querySelectorAll(".lyric-line");


    lines.forEach((line, index) => {

        line.classList.toggle(
            "active",
            index === currentIndex
        );

    });


    if (currentIndex >= 0) {

        const activeLine =
            lines[currentIndex];

        if (activeLine) {

            activeLine.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }
    }
});


/* =========================
   FIN DE MUSIQUE
========================= */

audio.addEventListener("ended", () => {

    playButton.textContent = "▶ Écouter";

});