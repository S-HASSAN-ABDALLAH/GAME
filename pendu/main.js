// =============================================
//                JEU DU PENDU - COMPLET
// =============================================

// 📝 CHAPITRE 1 : DONNÉES
const mots = ["CHAT", "CHIEN", "MAISON", "VOITURE", "FLEUR", "LIVRE", "SOLEIL", "OCEAN", "MONTAGNE", "ETOILE"];

// Variables d'état du jeu
let motSecret = "";
let motAffiche = [];
let lettresEssayees = [];
let erreurs = 0;
let jeuTermine = false;

// 🎮 CHAPITRE 2 : INITIALISATION
function demarrer() {
    console.log("🎯 Démarrage d'une nouvelle partie");
    
    // Choisir un mot au hasard
    motSecret = mots[Math.floor(Math.random() * mots.length)];
    console.log("Mot secret choisi :", motSecret);
    
    // Préparer l'affichage du mot
    motAffiche = [];
    for (let i = 0; i < motSecret.length; i++) {
        motAffiche.push("_");
    }
    
    // Remettre les compteurs à zéro
    lettresEssayees = [];
    erreurs = 0;
    jeuTermine = false;
    
    // Mettre à jour l'interface
    mettreAJourInterface();
    cacherPendu();
    
    // Message de démarrage
    afficherMessage("Devinez le mot en proposant des lettres !", "");
    
    // Focus sur l'input
    document.getElementById("lettre").focus();
}

// 🔄 Cacher toutes les parties du pendu
function cacherPendu() {
    const parties = document.querySelectorAll(".partie");
    for (let i = 0; i < parties.length; i++) {
        parties[i].classList.remove("visible");
    }
}

// 🎯 CHAPITRE 3 : LOGIQUE DE JEU
function jouer() {
    if (jeuTermine) {
        afficherMessage("La partie est terminée ! Cliquez sur Recommencer.", "error");
        return;
    }

    console.log("Le joueur tente une lettre");
    
    // Récupérer et nettoyer la saisie
    const input = document.getElementById("lettre");
    const lettre = input.value.toUpperCase().trim();
    
    // Valider la saisie
    if (!validerSaisie(lettre, input)) {
        return; // Arrêter si la saisie n'est pas valide
    }
    
    // Enregistrer la lettre tentée
    lettresEssayees.push(lettre);
    console.log("Lettres essayées :", lettresEssayees);
    
    // Vérifier si la lettre est dans le mot
    if (motSecret.includes(lettre)) {
        traiterBonneLettre(lettre);
    } else {
        traiterMauvaiseLettre();
    }
    
    // Mettre à jour l'affichage
    mettreAJourInterface();
    
    // Nettoyer et remettre le focus
    input.value = "";
    input.focus();
    
    // Vérifier si la partie est terminée
    verifierFinDePartie();
}

// ✅ Valider la saisie de l'utilisateur
function validerSaisie(lettre, input) {
    // Vérifier si vide
    if (lettre === "") {
        afficherMessage("Tapez une lettre !", "error");
        input.focus();
        return false;
    }
    
    // Vérifier si c'est bien une lettre
    if (!/^[A-Z]$/.test(lettre)) {
        afficherMessage("Tapez seulement des lettres !", "error");
        input.value = "";
        input.focus();
        return false;
    }
    
    // Vérifier si déjà essayée
    if (lettresEssayees.includes(lettre)) {
        afficherMessage("Lettre déjà essayée !", "error");
        input.value = "";
        input.focus();
        return false;
    }
    
    return true;
}

// ✅ Traiter une bonne lettre
function traiterBonneLettre(lettre) {
    console.log("✅ Bonne lettre");
    
    // Révéler toutes les occurrences de cette lettre
    for (let i = 0; i < motSecret.length; i++) {
        if (motSecret[i] === lettre) {
            motAffiche[i] = lettre;
        }
    }
    
    afficherMessage("✅ Bonne lettre !", "success");
}

// ❌ Traiter une mauvaise lettre
function traiterMauvaiseLettre() {
    console.log("❌ Mauvaise lettre");
    
    // Augmenter le compteur d'erreurs
    erreurs++;
    
    // Afficher une partie du pendu
    const parties = document.querySelectorAll(".partie");
    if (erreurs <= parties.length) {
        parties[erreurs - 1].classList.add("visible");
    }
    
    afficherMessage("❌ Mauvaise lettre !", "error");
}

// 🖥️ CHAPITRE 4 : INTERFACE UTILISATEUR
function mettreAJourInterface() {
    // Mettre à jour l'affichage du mot
    document.getElementById("mot").textContent = motAffiche.join(" ");
    
    // Mettre à jour le compteur d'erreurs
    document.getElementById("erreurs").textContent = erreurs;
    
    // Mettre à jour la liste des lettres essayées
    const liste = document.getElementById("liste");
    if (lettresEssayees.length === 0) {
        liste.textContent = "Aucune";
    } else {
        liste.textContent = lettresEssayees.join(", ");
    }
}

// 📢 Afficher un message
function afficherMessage(texte, type = "") {
    const messageDiv = document.getElementById("message");
    messageDiv.textContent = texte;
    
    // Retirer les anciennes classes
    messageDiv.classList.remove("success", "error");
    
    // Ajouter la nouvelle classe si spécifiée
    if (type) {
        messageDiv.classList.add(type);
    }
}

// 🏁 CHAPITRE 5 : FIN DE PARTIE
function verifierFinDePartie() {
    // Vérifier si le mot est complètement trouvé
    if (!motAffiche.includes("_")) {
        jeuTermine = true;
        afficherMessage("🎉 Félicitations ! Vous avez gagné !", "success");
        console.log("🎉 Partie gagnée !");
        return;
    }
    
    // Vérifier si le joueur a fait trop d'erreurs
    if (erreurs >= 6) {
        jeuTermine = true;
        afficherMessage(`💀 Perdu ! Le mot était : ${motSecret}`, "error");
        console.log("💀 Partie perdue !");
        return;
    }
}

// 🔄 Recommencer une partie
function recommencer() {
    console.log("🔄 Recommencer une nouvelle partie");
    demarrer();
}

// 🚀 CHAPITRE 6 : DÉMARRAGE AUTOMATIQUE
window.onload = function() {
    console.log("🌟 Page chargée, initialisation du jeu");
    demarrer();
};

// Bonus : Permettre d'appuyer sur Entrée pour jouer
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && !jeuTermine) {
        jouer();
    }
});