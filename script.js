"use strict";

const songs = [
  { id: "valentine",
  title: "Valentine",
  artist: "Andy Bumuntu",
  audio: "assets/music/valentine.mp4",
  lyrics: "assets/lyrics/valentine.json" },


  { id: "lento",
  title: "Lento",
  artist: "Daniel Santacruz",
  audio: "assets/music/lento.mp4",
  lyrics: "assets/lyrics/lento.json" },

  {id: "colorado",
  title: "Colorado",
  artist: "Zugo",
  audio: "assets/music/colorado.mp4",
  lyrics: "assets/lyrics/colorado.json"
}];

// Conserve ici le numéro WhatsApp déjà configuré dans ton projet.
const WHATSAPP_NUMBER = "243995121796";

const $ = (id) => document.getElementById(id);
const playlist = $("playlist");
const audio = $("audio");
const lyricsContainer = $("lyrics");
const songTitle = $("songTitle");
const playerTitle = $("playerTitle");
const playerArtist = $("playerArtist");
const openStoryButton = $("openStory");
const closeStoryButton = $("closeStory");
const storyOverlay = $("storyOverlay");
const chatMessages = $("chatMessages");
const nextMessageButton = $("nextMessage");
const whatsappButton = $("whatsappButton");

let currentSong = null;
let currentLyrics = [];
let messageIndex = 0;

const storyMessages = [
  "Parce que je t'aime sincèrement, bien sûr. ❤️",
  "Tu m'as choisi comme ton meilleur ami, et j'aime ça… vraiment.",
  "Mais je veux aussi que tu saches une chose : aucun garçon ne t'aimera comme moi. Jamais.",
  "T'es une princesse qui mérite d'être protégée. 👑❤️ Et il n'y a personne de plus fort que moi pour être là pour toi.",
  "Et surtout… ne réponds pas après sur WhatsApp. Ne sois pas triste pour moi.",
  "Être ton meilleur ami me suffit déjà. ❤️"
];

function createBackgroundStars() {
  const container = $("stars");
  if (!container) return;
  container.replaceChildren();
  for (let i = 0; i < 80; i++) {
    const star = document.createElement("div");
    star.className = "star";
    const size = Math.random() * 3 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDuration = `${Math.random() * 8 + 5}s`;
    star.style.animationDelay = `${Math.random() * 8}s`;
    container.appendChild(star);
  }
}

function renderLyrics() {
  if (!lyricsContainer) return;
  lyricsContainer.replaceChildren();
  if (!currentLyrics.length) {
    lyricsContainer.innerHTML = '<p class="loading">Les paroles ne sont pas disponibles.</p>';
    return;
  }
  currentLyrics.forEach((line, index) => {
    const paragraph = document.createElement("p");
    paragraph.className = "lyric-line";
    paragraph.dataset.index = String(index);
    paragraph.textContent = line.text;
    lyricsContainer.appendChild(paragraph);
  });
}

async function selectSong(song) {
  if (!audio) return;
  currentSong = song;
  currentLyrics = [];
  if (playerTitle) playerTitle.textContent = song.title;
  if (playerArtist) playerArtist.textContent = song.artist;
  if (songTitle) songTitle.textContent = `${song.title} — ${song.artist}`;
  audio.src = song.audio;
  audio.load();
  if (lyricsContainer) lyricsContainer.innerHTML = '<p class="loading">Chargement des paroles…</p>';
  try {
    const response = await fetch(song.lyrics);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    currentLyrics = Array.isArray(data.paroles) ? data.paroles : [];
    renderLyrics();
  } catch (error) {
    console.error("Impossible de charger les paroles JSON :", error);
    if (lyricsContainer) lyricsContainer.innerHTML = '<p class="loading">Impossible de charger les paroles. Ouvre le site avec un serveur HTTP local.</p>';
  }
}

function displayPlaylist() {
  if (!playlist) return;
  playlist.replaceChildren();
  songs.forEach((song) => {
    const card = document.createElement("div");
    card.className = "music-card";
    const info = document.createElement("div");
    info.className = "music-info";
    const title = document.createElement("h3");
    title.textContent = song.title;
    const artist = document.createElement("p");
    artist.textContent = song.artist;
    info.append(title, artist);
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Écouter";
    button.addEventListener("click", () => selectSong(song));
    card.append(info, button);
    playlist.appendChild(card);
  });
}

function openConversation() {
  if (!storyOverlay || !chatMessages || !nextMessageButton) return;
  messageIndex = 0;
  chatMessages.replaceChildren();
  const firstBubble = document.createElement("div");
  firstBubble.className = "chat-bubble mine";
  firstBubble.textContent = "Laety… tu sais pourquoi j'ai créé ce site ?";
  chatMessages.appendChild(firstBubble);
  nextMessageButton.textContent = "Pourquoi ? 👀";
  nextMessageButton.hidden = false;
  if (whatsappButton) whatsappButton.hidden = true;
  storyOverlay.classList.add("open");
  storyOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeConversation() {
  if (!storyOverlay) return;
  storyOverlay.classList.remove("open");
  storyOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function showNextMessage() {
  if (!chatMessages || messageIndex >= storyMessages.length) return;
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble mine";
  bubble.textContent = storyMessages[messageIndex];
  chatMessages.appendChild(bubble);
  messageIndex += 1;
  if (messageIndex < storyMessages.length) {
    nextMessageButton.textContent = "Continuer ❤️";
  } else {
    nextMessageButton.hidden = true;
    if (whatsappButton && /^\d{8,15}$/.test(WHATSAPP_NUMBER)) {
      const reply = encodeURIComponent("J'ai lu ton message jusqu'au bout. ❤️");
      whatsappButton.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${reply}`;
      whatsappButton.hidden = false;
    }
  }
  bubble.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

if (openStoryButton) openStoryButton.addEventListener("click", openConversation);
if (closeStoryButton) closeStoryButton.addEventListener("click", closeConversation);
if (nextMessageButton) nextMessageButton.addEventListener("click", showNextMessage);
if (storyOverlay) storyOverlay.addEventListener("click", (event) => {
  if (event.target === storyOverlay) closeConversation();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && storyOverlay?.classList.contains("open")) closeConversation();
});

if (audio) {
  audio.addEventListener("timeupdate", () => {
    if (!currentLyrics.length || !lyricsContainer) return;
    let active = -1;
    currentLyrics.forEach((line, index) => { if (audio.currentTime >= Number(line.time)) active = index; });
    lyricsContainer.querySelectorAll(".lyric-line").forEach((line, index) => {
      line.classList.toggle("active", index === active);
    });
    const activeLine = lyricsContainer.querySelector(".lyric-line.active");
    if (activeLine) activeLine.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
  audio.addEventListener("error", () => {
    if (currentSong) console.error("Impossible de lire le fichier audio :", currentSong.audio);
  });
}

createBackgroundStars();
displayPlaylist();
