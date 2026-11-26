
/* =========================================
   PARLE-MOI SI... — INTERACTIONS
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    // Les blocs de conversation
    const conversationCards = document.querySelectorAll(
        ".conversation-card"
    );

    // La fenêtre de discussion
    const chatModal = document.getElementById("chatModal");

    // Les éléments du chat
    const chatTitle = document.getElementById("chatTitle");
    const chatSubtitle = document.getElementById("chatSubtitle");
    const welcomeMessage = document.getElementById("welcomeMessage");

    const chatMessages = document.getElementById("chatMessages");
    const chatForm = document.getElementById("chatForm");
    const messageInput = document.getElementById("messageInput");

    const closeChatButton = document.getElementById("closeChat");


    // =========================================
    // TEXTES DES CONVERSATIONS
    // =========================================

    const conversations = {

        epaule: {
            title: "Une épaule",
            subtitle: "Un petit moment de douceur",
            welcome: "Tu peux tout me dire. Je suis là."
        },

        secret: {
            title: "Un secret",
            subtitle: "Un petit secret entre nous",
            welcome: "Il y a des choses qu'on ne dit qu'à certaines personnes..."
        },

        douceur: {
            title: "Un peu de douceur",
            subtitle: "Une conversation tendre",
            welcome: "Et si on se disait de jolies choses ?"
        },

        mood: {
            title: "Dans le mood",
            subtitle: "Laisse parler ton humeur",
            welcome: "Alors, quelle est ton énergie du moment ?"
        },

        conversation: {
            title: "Juste parler",
            subtitle: "Sans raison particulière",
            welcome: "Je t'écoute. Raconte-moi."
        }

    };


    // =========================================
    // OUVRIR UNE CONVERSATION
    // =========================================

    function openChat(conversationKey) {

        const conversation = conversations[conversationKey];

        if (!conversation) {
            return;
        }

        // Modifier le titre et les textes
        chatTitle.textContent = conversation.title;
        chatSubtitle.textContent = conversation.subtitle;
        welcomeMessage.textContent = conversation.welcome;

        // Réinitialiser les messages précédents
        chatMessages.innerHTML = `
            <div class="chat-welcome">
                <span class="welcome-heart">♡</span>
                <p id="welcomeMessage">
                    ${conversation.welcome}
                </p>
            </div>
        `;

        // Afficher la fenêtre
        chatModal.classList.add("active");
        chatModal.setAttribute("aria-hidden", "false");

        // Empêcher le défilement de la page derrière
        document.body.style.overflow = "hidden";

        // Placer le curseur dans le champ
        setTimeout(() => {
            messageInput.focus();
        }, 300);
    }


    // =========================================
    // FERMER LA CONVERSATION
    // =========================================

    function closeChat() {

        // Fermer la fenêtre
        chatModal.classList.remove("active");
        chatModal.setAttribute("aria-hidden", "true");

        // Réautoriser le défilement
        document.body.style.overflow = "";

        // Effacer tous les messages de cette session
        chatMessages.innerHTML = "";

        // Vider le champ de saisie
        messageInput.value = "";
    }


    // =========================================
    // CLIC SUR LES BLOCS
    // =========================================

    conversationCards.forEach(card => {

        card.addEventListener("click", () => {

            const conversationKey = card.dataset.conversation;

            openChat(conversationKey);

        });

    });


    // =========================================
    // BOUTON DE FERMETURE
    // =========================================

    closeChatButton.addEventListener("click", closeChat);


    // =========================================
    // CLIC SUR LE FOND POUR FERMER
    // =========================================

    chatModal.addEventListener("click", event => {

        if (event.target === chatModal) {
            closeChat();
        }

    });


    // =========================================
    // FERMER AVEC LA TOUCHE ÉCHAP
    // =========================================

    document.addEventListener("keydown", event => {

        if (
            event.key === "Escape" &&
            chatModal.classList.contains("active")
        ) {
            closeChat();
        }

    });


    // =========================================
    // ENVOYER UN MESSAGE
    // =========================================

    chatForm.addEventListener("submit", event => {

        event.preventDefault();

        const messageText = messageInput.value.trim();

        // Ne rien envoyer si le champ est vide
        if (messageText === "") {
            return;
        }

        // Créer le message
        const message = document.createElement("div");

        message.classList.add("message", "sent");

        // Ajouter le texte sans interpréter le HTML
        const text = document.createElement("span");
        text.textContent = messageText;

        // Ajouter l'heure
        const time = document.createElement("span");
        time.classList.add("message-time");

        time.textContent = new Date().toLocaleTimeString(
            "fr-FR",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

        message.appendChild(text);
        message.appendChild(time);

        // Afficher le message
        chatMessages.appendChild(message);

        // Faire défiler vers le dernier message
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Vider le champ
        messageInput.value = "";
        messageInput.focus();

    });


    // =========================================
    // NETTOYAGE SI LA PAGE EST QUITTÉE
    // =========================================

    window.addEventListener("pagehide", () => {

        chatMessages.innerHTML = "";
        messageInput.value = "";

    });

});
const backgroundMusic = document.getElementById("background-music");
const musicButton = document.getElementById("music-button");

let musicPlaying = false;

musicButton.addEventListener("click", async () => {
    if (!musicPlaying) {
        try {
            await backgroundMusic.play();

            musicPlaying = true;
            musicButton.classList.add("playing");
            musicButton.textContent = "♫";
        } catch (error) {
            console.log("La musique n'a pas pu démarrer.");
        }
    } else {
        backgroundMusic.pause();

        musicPlaying = false;
        musicButton.classList.remove("playing");
        musicButton.textContent = "♫";
    }
});