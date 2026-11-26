
/* =========================================
   PARLE-MOI SI... — WHATSAPP & MUSIQUE
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    // =========================================
    // NUMÉROS WHATSAPP
    // =========================================

    const whatsappDaddy = "243995121796";
    const whatsappLaety = "243974130216";


    // =========================================
    // SECTIONS DE LA PAGE
    // =========================================

    const conversations = {

        epaule: {
            title: "Besoin d'une épaule",
            message: "J'avais besoin d'une épaule."
        },

        secret: {
            title: "Un secret à partager",
            message: "J'ai un petit secret à te confier..."
        },

        douceur: {
            title: "Un peu de douceur",
            message: "J'avais envie d'un peu de douceur."
        },

        mood: {
            title: "Dans le mood",
            message: "Je suis dans le mood..."
        },

        conversation: {
            title: "Envie de parler",
            message: "J'avais simplement envie de te parler."
        }

    };


    // =========================================
    // ÉLÉMENTS DE LA PAGE
    // =========================================

    const conversationCards = document.querySelectorAll(
        ".conversation-card"
    );

    let selectedConversation = null;


    // =========================================
    // CRÉER LA PETITE FENÊTRE
    // =========================================

    const recipientModal = document.createElement("div");

    recipientModal.className = "recipient-modal";
    recipientModal.setAttribute("aria-hidden", "true");

    recipientModal.innerHTML = `
        <div class="recipient-modal-content" role="dialog"
             aria-modal="true" aria-labelledby="recipientTitle">

            <button class="recipient-close"
                    type="button"
                    aria-label="Fermer">
                &times;
            </button>

            <span class="recipient-heart">♡</span>

            <h2 id="recipientTitle">
                À qui veux-tu parler ?
            </h2>

            <p class="recipient-section"></p>

            <div class="recipient-buttons">

                <button type="button"
                        class="recipient-choice"
                        data-recipient="daddy">
                    ♡ Signaler à Daddy
                </button>

                <button type="button"
                        class="recipient-choice"
                        data-recipient="laety">
                    ♡ Signaler à Laety
                </button>

            </div>

            <p class="recipient-note">
                Une petite envie de parler...
            </p>

        </div>
    `;

    document.body.appendChild(recipientModal);


    // =========================================
    // ÉLÉMENTS DE LA FENÊTRE
    // =========================================

    const recipientSection = recipientModal.querySelector(
        ".recipient-section"
    );

    const recipientButtons = recipientModal.querySelectorAll(
        ".recipient-choice"
    );

    const recipientClose = recipientModal.querySelector(
        ".recipient-close"
    );


    // =========================================
    // OUVRIR LA FENÊTRE
    // =========================================

    function openRecipientModal(conversationKey) {

        selectedConversation = conversations[conversationKey];

        if (!selectedConversation) {
            return;
        }

        recipientSection.textContent =
            `Section : ${selectedConversation.title}`;

        recipientModal.classList.add("active");

        recipientModal.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";
    }


    // =========================================
    // FERMER LA FENÊTRE
    // =========================================

    function closeRecipientModal() {

        recipientModal.classList.remove("active");

        recipientModal.setAttribute("aria-hidden", "true");

        document.body.style.overflow = "";

        selectedConversation = null;
    }


    // =========================================
    // OUVRIR WHATSAPP
    // =========================================

    function openWhatsApp(recipient) {

        if (!selectedConversation) {
            return;
        }

        let phoneNumber = "";
        let recipientName = "";

        if (recipient === "daddy") {

            phoneNumber = whatsappDaddy;
            recipientName = "Daddy";

        } else if (recipient === "laety") {

            phoneNumber = whatsappLaety;
            recipientName = "Laety";

        } else {
            return;
        }


        // Message personnalisé selon la section

        const message =
            `Coucou ${recipientName} ❤️\n\n` +
            `Je viens de ta page "Parle-moi si...".\n\n` +
            `Section : ${selectedConversation.title}\n\n` +
            `${selectedConversation.message}\n\n` +
            `♡`;


        // Préparer le lien WhatsApp

        const whatsappURL =
            `https://wa.me/${phoneNumber}?text=` +
            encodeURIComponent(message);


        // Fermer la petite fenêtre

        closeRecipientModal();


        // Ouvrir WhatsApp

        window.open(
            whatsappURL,
            "_blank",
            "noopener,noreferrer"
        );

    }


    // =========================================
    // CLIC SUR LES IMAGES
    // =========================================

    conversationCards.forEach(card => {

        card.addEventListener("click", () => {

            const conversationKey =
                card.dataset.conversation;

            openRecipientModal(conversationKey);

        });

    });


    // =========================================
    // CHOIX DU DESTINATAIRE
    // =========================================

    recipientButtons.forEach(button => {

        button.addEventListener("click", () => {

            const recipient =
                button.dataset.recipient;

            openWhatsApp(recipient);

        });

    });


    // =========================================
    // BOUTON FERMER
    // =========================================

    recipientClose.addEventListener(
        "click",
        closeRecipientModal
    );


    // =========================================
    // CLIC SUR LE FOND
    // =========================================

    recipientModal.addEventListener("click", event => {

        if (event.target === recipientModal) {
            closeRecipientModal();
        }

    });


    // =========================================
    // TOUCHE ÉCHAP
    // =========================================

    document.addEventListener("keydown", event => {

        if (
            event.key === "Escape" &&
            recipientModal.classList.contains("active")
        ) {
            closeRecipientModal();
        }

    });


    // =========================================
    // MUSIQUE DE FOND MP4
    // =========================================

    const backgroundMusic =
        document.getElementById("background-music");

    const musicButton =
        document.getElementById("music-button");

    let musicPlaying = false;


    if (backgroundMusic && musicButton) {

        musicButton.addEventListener("click", async () => {

            if (!musicPlaying) {

                try {

                    await backgroundMusic.play();

                    musicPlaying = true;

                    musicButton.classList.add("playing");

                    musicButton.setAttribute(
                        "aria-label",
                        "Désactiver la musique"
                    );

                } catch (error) {

                    console.log(
                        "La musique n'a pas pu démarrer.",
                        error
                    );

                }

            } else {

                backgroundMusic.pause();

                musicPlaying = false;

                musicButton.classList.remove("playing");

                musicButton.setAttribute(
                    "aria-label",
                    "Activer la musique"
                );

            }

        });


        // Si la musique se termine ou est arrêtée

        backgroundMusic.addEventListener("pause", () => {

            musicPlaying = false;

            musicButton.classList.remove("playing");

        });

        backgroundMusic.addEventListener("play", () => {

            musicPlaying = true;

            musicButton.classList.add("playing");

        });

    }

});
