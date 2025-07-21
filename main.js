// Variables globales
let isMenuOpen = false;
let scrollTimeout;

// Éléments DOM
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('back-to-top');
const loadingScreen = document.getElementById('loading-screen');

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// Fonction d'initialisation principale
function initializeApp() {
    // Masquer l'écran de chargement après un délai
    setTimeout(() => {
        hideLoadingScreen();
    }, 1500);

    // Initialiser tous les event listeners
    initEventListeners();
    
    // Initialiser les animations
    initScrollAnimations();
    
    // Initialiser les effets visuels
    initVisualEffects();
}

// Masquer l'écran de chargement
function hideLoadingScreen() {
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Initialiser tous les event listeners
function initEventListeners() {
    // Menu mobile toggle
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Fermer le menu mobile au clic sur un lien
    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    // Gestion du scroll
    window.addEventListener('scroll', handleScroll);
    
    // Bouton retour en haut
    if (backToTop) {
        backToTop.addEventListener('click', scrollToTop);
    }

    // Navigation smooth scroll
    initSmoothScrolling();
    
    // Gestion du redimensionnement
    window.addEventListener('resize', handleResize);
    
    // Gestion des touches clavier
    document.addEventListener('keydown', handleKeyPress);
    
    // Effets de particules (desktop uniquement)
    if (!isMobile()) {
        document.addEventListener('mousemove', createParticles);
    }
}

// Toggle du menu mobile
function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    navLinks.classList.toggle('active');
    
    // Changer l'icône du menu
    const icon = menuToggle.querySelector('i');
    if (icon) {
        icon.className = isMenuOpen ? 'fas fa-times' : 'fas fa-bars';
    }
    
    // Empêcher le scroll du body quand le menu est ouvert
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
}

// Fermer le menu mobile
function closeMobileMenu() {
    if (isMenuOpen) {
        isMenuOpen = false;
        navLinks.classList.remove('active');
        
        // Restaurer l'icône du menu
        const icon = menuToggle.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-bars';
        }
        
        // Restaurer le scroll du body
        document.body.style.overflow = '';
    }
}

// Gestion du scroll
function handleScroll() {
    // Throttle pour optimiser les performances
    if (scrollTimeout) {
        return;
    }
    
    scrollTimeout = setTimeout(() => {
        const scrollY = window.scrollY;
        
        // Effet navbar au scroll
        if (navbar) {
            if (scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        // Bouton retour en haut
        if (backToTop) {
            if (scrollY > 300) {
                backToTop.style.display = 'block';
                backToTop.style.opacity = '1';
                backToTop.style.transform = 'scale(1)';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    if (window.scrollY <= 300) {
                        backToTop.style.display = 'none';
                    }
                }, 300);
            }
        }
        
        scrollTimeout = null;
    }, 10);
}

// Retour en haut de page
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Navigation smooth scroll
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offset = 80; // Hauteur de la navbar
                const targetPosition = target.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Fermer le menu mobile après navigation
                closeMobileMenu();
            }
        });
    });
}

// Initialiser les animations au scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Observer les sections pour les animations
    const sections = document.querySelectorAll('.games, .about, .contact');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Observer les cartes de jeux pour animation séquentielle
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateX(-50px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// Effets visuels et interactions
function initVisualEffects() {
    // Animation des cartes de jeux au hover
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.zIndex = '1';
        });
    });

    // Effet de glow sur les boutons
    const buttons = document.querySelectorAll('.play-btn, .cta-btn, .contact-link');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.boxShadow = '';
        });
    });
}

// Créer des particules au mouvement de la souris
function createParticles(e) {
    // Réduire la fréquence pour optimiser les performances
    if (Math.random() > 0.85) {
        const particle = document.createElement('div');
        particle.className = 'cursor-particle';
        
        // Position de la particule
        const x = e.clientX;
        const y = e.clientY;
        
        // Style de la particule
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: var(--primary-cyan);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0.7;
            transform: scale(1);
        `;
        
        document.body.appendChild(particle);
        
        // Animation et suppression
        setTimeout(() => {
            particle.style.opacity = '0';
            particle.style.transform = 'scale(0)';
        }, 100);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1000);
    }
}

// Gestion du redimensionnement
function handleResize() {
    // Fermer le menu mobile lors du redimensionnement
    if (window.innerWidth > 768 && isMenuOpen) {
        closeMobileMenu();
    }
    
    // Recalculer les animations si nécessaire
    if (window.innerWidth > 768) {
        document.body.style.overflow = '';
    }
}

// Gestion des touches clavier
function handleKeyPress(e) {
    switch(e.key) {
        case 'Escape':
            if (isMenuOpen) {
                closeMobileMenu();
            }
            break;
        case 'Home':
            if (e.ctrlKey) {
                e.preventDefault();
                scrollToTop();
            }
            break;
    }
}

// Détection mobile
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 768);
}

// Animation de typing pour le titre (optionnel)
function typewriterEffect(element, text, speed = 100) {
    if (!element) return;
    
    element.textContent = '';
    let i = 0;
    
    function typeChar() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeChar, speed);
        }
    }
    
    typeChar();
}

// Effet parallax léger pour le hero
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent && !isMobile()) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (scrolled < hero.offsetHeight) {
                heroContent.style.transform = `translateY(${rate}px)`;
            }
        });
    }
}

// Optimisation des performances
function optimizePerformance() {
    // Lazy loading pour les images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Gestion des erreurs
function handleErrors() {
    window.addEventListener('error', (e) => {
        console.warn('Une erreur s\'est produite:', e.error);
    });
    
    // Fallback pour les navigateurs plus anciens
    if (!window.IntersectionObserver) {
        // Afficher tous les éléments sans animation
        document.querySelectorAll('[style*="opacity: 0"]').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }
}

// Analytics et tracking (optionnel)
function trackUserInteractions() {
    // Tracker les clics sur les boutons de jeu
    document.querySelectorAll('.play-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const gameName = e.target.closest('.game-card').dataset.game;
            console.log(`Jeu lancé: ${gameName}`);
            // Ici vous pouvez ajouter votre code d'analytics
        });
    });
    
    // Tracker le temps passé sur la page
    let startTime = Date.now();
    window.addEventListener('beforeunload', () => {
        const timeSpent = Date.now() - startTime;
        console.log(`Temps passé: ${Math.round(timeSpent / 1000)} secondes`);
    });
}

// Mode sombre/clair (fonctionnalité bonus)
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            localStorage.setItem('theme', 
                document.body.classList.contains('light-theme') ? 'light' : 'dark'
            );
        });
        
        // Restaurer le thème sauvegardé
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
        }
    }
}

// État de l'application
const AppState = {
    isLoaded: false,
    currentSection: 'home',
    animationsEnabled: true,
    
    init() {
        this.isLoaded = true;
        this.detectSection();
    },
    
    detectSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            if (scrollPos >= section.offsetTop && 
                scrollPos < section.offsetTop + section.offsetHeight) {
                this.currentSection = section.id;
            }
        });
    }
};

// Service Worker pour mise en cache (optionnel)
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker enregistré');
            })
            .catch(error => {
                console.log('Erreur Service Worker:', error);
            });
    }
}

// Initialisation finale
window.addEventListener('load', () => {
    // Initialiser les fonctionnalités avancées
    initParallaxEffect();
    optimizePerformance();
    handleErrors();
    trackUserInteractions();
    initThemeToggle();
    
    // Initialiser l'état de l'application
    AppState.init();
    
    // Animation d'entrée pour les éléments principaux
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Export pour utilisation dans d'autres modules (si nécessaire)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleMobileMenu,
        closeMobileMenu,
        scrollToTop,
        isMobile,
        AppState
    };
}