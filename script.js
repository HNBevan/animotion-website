// ===== AniMotion Website JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initTitleLetterFall();
    initNavbar();
    initHeroCardStack();
    initMascotEyes();
    initScrollAnimations();
    initStatCounters();
    initVideoCards();
    initHeroBounce();
    initMascotBounce();
    initEdgePeeks();
});

// ===== Edge Peek Characters =====
function initEdgePeeks() {
    const chars = ['🐱','🐼','🦊','🐵','🐙','👽'];
    const edges = ['left','right','top','bottom'];
    let lastChar = '';

    function peek() {
        let char;
        do { char = chars[Math.floor(Math.random() * chars.length)]; } while (char === lastChar);
        lastChar = char;

        const edge = edges[Math.floor(Math.random() * edges.length)];
        const phrases = ['I can see you!', 'Peek-a-boo!', 'Watcha doing?', 'BOO!', 'You still here?'];
        const phrase = phrases[Math.floor(Math.random() * phrases.length)];

        const el = document.createElement('div');
        el.className = 'edge-peek';
        el.innerHTML = `<div class="peek-bubble">${phrase}</div><div class="peek-head">${char}</div>`;

        const size = 100;
        const margin = 120;
        const rot = { left: 90, right: -90, top: 180, bottom: 0 }[edge];

        if (edge === 'left' || edge === 'right') {
            const y = margin + Math.random() * (window.innerHeight - margin * 2);
            el.style.top = y + 'px';
            el.style[edge] = (-size) + 'px';
        } else {
            const x = margin + Math.random() * (window.innerWidth - margin * 2);
            el.style.left = x + 'px';
            el.style[edge] = (-size) + 'px';
        }

        // Pre-rotate before appending so only translation animates on slide-in
        el.style.transition = 'none';
        el.style.transform = `rotate(${rot}deg)`;
        document.body.appendChild(el);

        requestAnimationFrame(() => requestAnimationFrame(() => {
            el.style.transition = 'transform 0.6s ease-out';
            if      (edge === 'left')   el.style.transform = `translateX(${size * 0.65}px) rotate(${rot}deg)`;
            else if (edge === 'right')  el.style.transform = `translateX(-${size * 0.65}px) rotate(${rot}deg)`;
            else if (edge === 'top')    el.style.transform = `translateY(${size * 0.65}px) rotate(${rot}deg)`;
            else                        el.style.transform = `translateY(-${size * 0.65}px) rotate(${rot}deg)`;
            setTimeout(() => el.classList.add('peeked'), 100);
        }));

        // Retreat — slide back out
        setTimeout(() => {
            el.style.transition = 'transform 1.8s ease-in';
            el.style.transform = `rotate(${rot}deg)`;
            setTimeout(() => {
                el.remove();
                setTimeout(peek, 1200);
            }, 1900);
        }, 2500);
    }

    setTimeout(peek, 2000);
}

// ===== H1 Letter Fall Animation =====
function initTitleLetterFall() {
    const lines = document.querySelectorAll('.hero-title .title-line');
    let globalIdx = 0;
    lines.forEach((line) => {
        const isHighlight = line.classList.contains('highlight');
        const text = line.textContent;
        line.textContent = '';
        text.split('').forEach(char => {
            if (char === ' ') {
                line.appendChild(document.createTextNode('\u00A0'));
            } else {
                const span = document.createElement('span');
                span.textContent = char;
                span.classList.add('letter-fall');
                span.style.animationDelay = (0.1 + globalIdx * 0.055) + 's';
                if (isHighlight) {
                    span.style.background = 'linear-gradient(135deg, #7C3AED 0%, #EC4899 50%, #F97316 100%)';
                    span.style.webkitBackgroundClip = 'text';
                    span.style.webkitTextFillColor = 'transparent';
                    span.style.backgroundClip = 'text';
                }
                line.appendChild(span);
                globalIdx++;
            }
        });
    });
}

// ===== Navbar Scroll Effect =====
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Scroll effect — hide on scroll down, show on scroll up
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const currentY = window.scrollY;
        if (currentY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        if (currentY > lastScrollY && currentY > 120) {
            navbar.classList.add('nav-hidden');
        } else {
            navbar.classList.remove('nav-hidden');
        }
        lastScrollY = currentY;
    }, { passive: true });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ===== Hero Card Stack - Peel Animation =====
function initHeroCardStack() {
    const cards = document.querySelectorAll('.stack-card');
    let currentCard = 0;
    let isAnimating = false;
    let autoPlayInterval;

    // Start auto-play
    startAutoPlay();

    // Click on corner to peel
    cards.forEach((card, index) => {
        const peelCorner = card.querySelector('.peel-corner');

        card.addEventListener('click', () => {
            if (!isAnimating && card.classList.contains('active')) {
                peelCard();
            }
        });

        // Hover effect on active card
        card.addEventListener('mouseenter', () => {
            if (card.classList.contains('active')) {
                stopAutoPlay();
            }
        });

        card.addEventListener('mouseleave', () => {
            startAutoPlay();
        });
    });

    function peelCard() {
        if (isAnimating) return;
        isAnimating = true;

        const activeCard = document.querySelector('.stack-card.active');
        const character = activeCard.querySelector('.card-character');

        // Trigger character pop-out animation
        if (character) {
            activeCard.classList.add('popping');
        }

        // Wait a moment for character to start popping, then peel the card
        setTimeout(() => {
            // Animate the peel — smooth ease-in-out, gentle rotation
            activeCard.style.transition = 'transform 1s ease-in-out, opacity 0.8s ease-in-out';
            activeCard.style.transform = 'translateX(-50%) translateX(-130%) rotateY(-12deg)';
            activeCard.style.opacity = '0';
        }, 200);

        setTimeout(() => {
            // Snap card back to neutral instantly (no transition)
            activeCard.classList.remove('active', 'popping');
            activeCard.style.transition = 'none';
            activeCard.style.transform = '';
            activeCard.style.opacity = '';

            // Reset character animation
            if (character) {
                character.style.animation = '';
            }

            // Cycle to next card and reorder
            currentCard = (currentCard + 1) % cards.length;
            reorderCards();

            // Re-enable CSS transitions after the snap so next interactions animate
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    activeCard.style.transition = '';
                });
            });

            isAnimating = false;
        }, 1050);
    }

    function reorderCards() {
        const cardOrder = [
            (currentCard) % cards.length,
            (currentCard + 1) % cards.length,
            (currentCard + 2) % cards.length
        ];

        cards.forEach((card, index) => {
            card.classList.remove('active', 'card-1', 'card-2', 'card-3');

            if (index === cardOrder[0]) {
                card.classList.add('active', 'card-1');
                card.style.zIndex = 3;
            } else if (index === cardOrder[1]) {
                card.classList.add('card-2');
                card.style.zIndex = 2;
            } else {
                card.classList.add('card-3');
                card.style.zIndex = 1;
            }
        });
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(() => {
            if (!isAnimating) {
                peelCard();
            }
        }, 4000);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }
}

// ===== Mascot Eyes Follow Cursor =====
function initMascotEyes() {
    // Hero mascot
    const mascot = document.querySelector('.mascot');

    // Service icon mascots
    const iconMascots = document.querySelectorAll('.icon-mascot');

    // Card characters
    const cardCharacters = document.querySelectorAll('.card-character');

    document.addEventListener('mousemove', (e) => {
        // Hero mascot eyes
        if (mascot) {
            const pupils = mascot.querySelectorAll('.pupil');
            const mascotRect = mascot.getBoundingClientRect();
            const mascotCenterX = mascotRect.left + mascotRect.width / 2;
            const mascotCenterY = mascotRect.top + mascotRect.height / 2;

            const angle = Math.atan2(e.clientY - mascotCenterY, e.clientX - mascotCenterX);
            const distance = Math.min(5, Math.hypot(e.clientX - mascotCenterX, e.clientY - mascotCenterY) / 50);

            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            pupils.forEach(pupil => {
                pupil.style.animation = 'none';
                pupil.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
            });
        }

        // Service icon mascot eyes
        iconMascots.forEach(iconMascot => {
            const miniPupils = iconMascot.querySelectorAll('.mini-pupil');
            const iconRect = iconMascot.getBoundingClientRect();
            const iconCenterX = iconRect.left + iconRect.width / 2;
            const iconCenterY = iconRect.top + iconRect.height / 2;

            const angle = Math.atan2(e.clientY - iconCenterY, e.clientX - iconCenterX);
            const distance = Math.min(3, Math.hypot(e.clientX - iconCenterX, e.clientY - iconCenterY) / 80);

            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            miniPupils.forEach(pupil => {
                pupil.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
            });
        });

        // Card character eyes
        cardCharacters.forEach(character => {
            // Skip if character is in pop-out animation
            if (character.closest('.popping')) return;

            const charPupils = character.querySelectorAll('.char-pupil');
            const charRect = character.getBoundingClientRect();
            const charCenterX = charRect.left + charRect.width / 2;
            const charCenterY = charRect.top + charRect.height / 2;

            const angle = Math.atan2(e.clientY - charCenterY, e.clientX - charCenterX);
            const distance = Math.min(4, Math.hypot(e.clientX - charCenterX, e.clientY - charCenterY) / 60);

            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            charPupils.forEach(pupil => {
                pupil.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
            });
        });
    });

    // Reset eyes when mouse leaves viewport
    document.addEventListener('mouseleave', () => {
        if (mascot) {
            const pupils = mascot.querySelectorAll('.pupil');
            pupils.forEach(pupil => {
                pupil.style.animation = '';
                pupil.style.transform = '';
            });
        }

        iconMascots.forEach(iconMascot => {
            const miniPupils = iconMascot.querySelectorAll('.mini-pupil');
            miniPupils.forEach(pupil => {
                pupil.style.transform = '';
            });
        });

        cardCharacters.forEach(character => {
            const charPupils = character.querySelectorAll('.char-pupil');
            charPupils.forEach(pupil => {
                pupil.style.transform = '';
            });
        });
    });
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    // Elements to animate
    const animateElements = [
        '.service-card',
        '.video-card',
        '.stat-card',
        '.section-header',
        '.about-text',
        '.feature',
        '.process-step',
        '.benefit-card',
        '.pricing-card'
    ];

    // Create observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Add stagger delay for grid items
                const siblings = entry.target.parentElement.children;
                const index = Array.from(siblings).indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 0.1}s`;
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all elements
    animateElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('fade-in-up');
            observer.observe(el);
        });
    });

    // Reveal service rows left/right
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal-left, .reveal-right').forEach(el => {
        revealObserver.observe(el);
    });

    // Scattered pop-in for video cards
    const gridObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.video-card');
                cards.forEach((card, i) => {
                    setTimeout(() => card.classList.add('card-popped'), i * 110);
                });
                gridObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.video-grid').forEach(el => gridObserver.observe(el));

    // ── Typewriter for section headings ──
    function typeWriter(el, speed) {
        speed = speed || 38;
        var temp = document.createElement('div');
        temp.innerHTML = el.innerHTML;
        var segments = [];
        temp.childNodes.forEach(function(node) {
            if (node.nodeType === 3) {
                segments.push({ type: 'text', content: node.textContent });
            } else if (node.nodeName === 'BR') {
                segments.push({ type: 'br' });
            } else if (node.nodeType === 1) {
                segments.push({ type: 'elem', tag: node.tagName, cls: node.className, content: node.textContent });
            }
        });
        el.innerHTML = '<span class="tw-cursor"></span>';
        var si = 0, ci = 0;
        function tick() {
            if (si >= segments.length) {
                var cur = el.querySelector('.tw-cursor');
                if (cur) setTimeout(function(){ cur.remove(); }, 700);
                return;
            }
            var seg = segments[si];
            var cursor = el.querySelector('.tw-cursor');
            if (seg.type === 'text') {
                if (ci < seg.content.length) {
                    cursor.before(document.createTextNode(seg.content[ci++]));
                    setTimeout(tick, speed);
                } else { si++; ci = 0; setTimeout(tick, speed); }
            } else if (seg.type === 'br') {
                cursor.before(document.createElement('br'));
                si++; setTimeout(tick, 60);
            } else if (seg.type === 'elem') {
                var span = document.createElement(seg.tag);
                span.className = seg.cls;
                cursor.before(span);
                var j = 0;
                (function typeSpan() {
                    if (j < seg.content.length) {
                        span.textContent = seg.content.substring(0, ++j);
                        setTimeout(typeSpan, speed);
                    } else { si++; ci = 0; setTimeout(tick, speed); }
                })();
            }
        }
        tick();
    }

    var twObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                typeWriter(entry.target);
                twObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.section-title').forEach(function(el) {
        twObs.observe(el);
    });

    // Parallax for floating shapes
    const shapes = document.querySelectorAll('.floating-shapes .shape');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        shapes.forEach((shape, index) => {
            const speed = 0.1 + (index * 0.05);
            shape.style.transform = `translateY(${scrollY * speed}px) rotate(${scrollY * 0.02}deg)`;
        });
    });
}

// ===== Stat Counter Animation =====
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        observer.observe(statsSection);
    }

    function animateCounters() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target;
                }
            };

            updateCounter();
        });
    }
}

// ===== Video Card Interactions =====
function initVideoCards() {
    const videoCards = document.querySelectorAll('.video-card');

    videoCards.forEach(card => {
        const playBtn = card.querySelector('.play-button');

        card.addEventListener('mouseenter', () => {
            // Add ripple effect to play button
            if (playBtn) {
                playBtn.style.animation = 'playPulse 1s ease-in-out infinite';
            }
        });

        card.addEventListener('mouseleave', () => {
            if (playBtn) {
                playBtn.style.animation = '';
            }
        });

        // Click to play (placeholder - would open video modal)
        card.addEventListener('click', () => {
            // Add click effect
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);

            // Here you would typically open a video modal
            console.log('Video clicked - implement modal here');
        });
    });

    // Add play pulse animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes playPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.4); }
            50% { box-shadow: 0 0 0 15px rgba(124, 58, 237, 0); }
        }
    `;
    document.head.appendChild(style);
}

// ===== Smooth Scroll for Nav Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Add Sparkle Effect on CTA Buttons =====
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mouseenter', createSparkles);
});

function createSparkles(e) {
    const btn = e.target;
    const sparkleCount = 5;

    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('span');
        sparkle.className = 'sparkle';
        sparkle.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: var(--accent-yellow);
            border-radius: 50%;
            pointer-events: none;
            animation: sparkleAnim 0.6s ease forwards;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 600);
    }
}

// Add sparkle animation
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkleAnim {
        0% { transform: scale(0) rotate(0deg); opacity: 1; }
        100% { transform: scale(1.5) rotate(180deg); opacity: 0; }
    }
`;
document.head.appendChild(sparkleStyle);


// ===== Page Load Animation =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Trigger initial animations
    setTimeout(() => {
        document.querySelectorAll('.hero .fade-in-up').forEach(el => {
            el.classList.add('visible');
        });
    }, 100);
});

// ===== Contact Form Submit =====
(function initContactForm() {
    const form = document.getElementById('contactForm');
    const successMsg = document.getElementById('formSuccess');
    const progressBar = document.getElementById('formProgressBar');
    const progressLabel = document.getElementById('formProgressLabel');
    if (!form) return;

    const LABELS = [
        'Start filling in your details...',
        'Nice start! Keep going ✨',
        'You\'re on a roll! 🎉',
        'Almost there... 🚀',
        'Just one more thing!',
        'Ready to send! Hit that button 🎯'
    ];

    // ── Progress bar ──
    function updateProgress() {
        const name        = form.querySelector('#contactName').value.trim();
        const email       = form.querySelector('#contactEmail').value.trim();
        const chipChecked = form.querySelectorAll('.chip input:checked').length > 0;
        const budget      = form.querySelector('#contactBudget').value;
        const message     = form.querySelector('#contactMessage').value.trim();
        const filled      = [name, email, chipChecked, budget, message].filter(Boolean).length;
        const pct         = (filled / 5) * 100;
        if (progressBar)  progressBar.style.width = pct + '%';
        if (progressLabel) progressLabel.textContent = LABELS[filled];

        // Field checkmarks
        updateCheck(form.querySelector('#contactName').closest('.fg-icon'), !!name);
        updateCheck(form.querySelector('#contactEmail').closest('.fg-icon'), !!email);
        updateCheck(form.querySelector('#contactBudget').closest('.fg-icon'), !!budget);
    }

    function updateCheck(el, filled) {
        if (!el) return;
        el.classList.toggle('is-filled', filled);
    }

    form.querySelectorAll('input, select, textarea').forEach(el => {
        el.addEventListener('input', updateProgress);
        el.addEventListener('change', updateProgress);
    });

    // ── Character counter ──
    const msgArea  = form.querySelector('#contactMessage');
    const msgCount = document.getElementById('msgCount');
    const counter  = form.querySelector('.fg-counter');
    if (msgArea && msgCount) {
        msgArea.addEventListener('input', () => {
            const len = msgArea.value.length;
            msgCount.textContent = len;
            counter.classList.toggle('warn',  len > 400);
            counter.classList.toggle('limit', len > 490);
        });
    }

    // ── Chip bounce ──
    form.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            chip.classList.remove('chip-pop');
            void chip.offsetWidth;
            chip.classList.add('chip-pop');
            chip.addEventListener('animationend', () => chip.classList.remove('chip-pop'), { once: true });
            updateProgress();
        });
    });

    // ── Confetti burst ──
    function burstFormConfetti() {
        const colors = ['#7C3AED','#EC4899','#F97316','#FBBF24','#10B981','#3B82F6'];
        const shapes = ['⭐','🌟','✨','💫','★','✦'];
        const btn    = document.getElementById('submitBtn');
        const rect   = btn ? btn.getBoundingClientRect() : null;
        const cx     = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
        const cy     = rect ? rect.top : window.innerHeight / 2;
        for (let i = 0; i < 55; i++) {
            const el    = document.createElement('div');
            el.className = 'form-confetti';
            const angle = (Math.random() * 360) * (Math.PI / 180);
            const speed = 100 + Math.random() * 300;
            const tx    = Math.cos(angle) * speed;
            const ty    = Math.sin(angle) * speed - 150;
            const rot   = (Math.random() - 0.5) * 720;
            const dur   = (0.7 + Math.random() * 0.9).toFixed(2) + 's';
            el.style.cssText = `left:${cx}px;top:${cy}px;background:${colors[i % colors.length]};--tx:${tx}px;--ty:${ty}px;--rot:${rot}deg;--dur:${dur};`;
            document.body.appendChild(el);
            el.addEventListener('animationend', () => el.remove());
        }
        for (let i = 0; i < 18; i++) {
            const el = document.createElement('div');
            el.style.cssText = `position:fixed;font-size:${16+Math.random()*18}px;left:${cx}px;top:${cy}px;pointer-events:none;z-index:99999;--tx:${(Math.random()-0.5)*380}px;--ty:${-(60+Math.random()*280)}px;--rot:${(Math.random()-0.5)*720}deg;--dur:${(0.9+Math.random()*0.7).toFixed(2)}s;animation:confettiFall var(--dur) ease-out forwards;`;
            el.textContent = shapes[i % shapes.length];
            document.body.appendChild(el);
            el.addEventListener('animationend', () => el.remove());
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        btn.disabled = true;
        btn.classList.add('launching');
        burstFormConfetti();
        setTimeout(() => {
            form.reset();
            form.querySelectorAll('.chip input').forEach(c => c.checked = false);
            form.querySelectorAll('.fg-icon').forEach(el => el.classList.remove('is-filled'));
            if (msgCount) msgCount.textContent = '0';
            btn.disabled = false;
            btn.classList.remove('launching');
            successMsg.classList.add('visible');
            if (progressBar)   progressBar.style.width = '0%';
            if (progressLabel) progressLabel.textContent = LABELS[0];
            setTimeout(() => successMsg.classList.remove('visible'), 6000);
        }, 1400);
    });
}());

// ===== Magnetic Button Effect =====
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

console.log('🎬 AniMotion website loaded successfully!');

// ===== Custom Cursor =====
(function initCursor() {
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mx = -200, my = -200, rx = -200, ry = -200;
    let trailTick = 0;
    const COLORS = ['#7C3AED','#EC4899','#F97316','#FBBF24','#06B6D4','#34D399'];

    document.addEventListener('mousemove', (e) => {
        mx = e.clientX; my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top  = my + 'px';
        if (++trailTick % 4 === 0) spawnTrail(mx, my);
    });

    // Smooth lagging ring
    (function animateRing() {
        rx += (mx - rx) * 0.13;
        ry += (my - ry) * 0.13;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
        requestAnimationFrame(animateRing);
    }());

    // Click burst
    document.addEventListener('mousedown', () => document.body.classList.add('cur-click'));
    document.addEventListener('mouseup',   () => document.body.classList.remove('cur-click'));

    // Hover state on interactive elements
    const hoverSel = 'a,button,.btn,.chip,.play-button,.alien-arm,.alien-belly,.alien-legs,.alien-mouth,.alien-eye,.alien-ant-ball,.video-card,.svc-cta,.hamburger,.logo';
    document.querySelectorAll(hoverSel).forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cur-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cur-hover'));
    });

    let colorIdx = 0;
    function spawnTrail(x, y) {
        const el = document.createElement('div');
        el.className = 'cursor-trail';
        const size = 6 + Math.random() * 8;
        el.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;background:${COLORS[colorIdx++ % COLORS.length]};animation-duration:${0.4 + Math.random() * 0.25}s`;
        document.body.appendChild(el);
        el.addEventListener('animationend', () => el.remove());
    }
}());

// ===== Mascot Bounce on Click =====
function initMascotBounce() {
    const mascot = document.querySelector('.mascot');
    if (!mascot) return;

    const mascotBody = mascot.querySelector('.mascot-body');
    let isBouncing = false;
    let posX = 0, posY = 0;
    let vx = 0, vy = 0;
    let squishTimer = null;

    const SIZE = 100;
    const GRAVITY = 0.5;
    const BOUNCINESS = 0.72;
    const FRICTION = 0.88;

    let animFrame = null;
    const originalParent = mascot.parentElement;

    mascot.style.cursor = 'pointer';

    // Speech bubble hint
    const hint = document.createElement('div');
    hint.className = 'mascot-hint';
    hint.textContent = 'Click me!';
    mascot.appendChild(hint);
    hint.addEventListener('animationend', () => hint.remove());

    mascot.addEventListener('click', (e) => {
        e.stopPropagation();
        hint.remove();

        if (!isBouncing) {
            const rect = mascot.getBoundingClientRect();
            posX = rect.left;
            posY = rect.top;

            mascot.classList.add('mascot--bouncing');
            mascot.style.position = 'fixed';
            mascot.style.left = posX + 'px';
            mascot.style.top  = posY + 'px';
            mascot.style.bottom = 'auto';
            mascot.style.right  = 'auto';
            mascot.style.zIndex = '9998';
            document.body.appendChild(mascot);

            isBouncing = true;
            vx = (Math.random() - 0.5) * 16;
            vy = -(14 + Math.random() * 8);

            loop();
        } else {
            // Stop bouncing and return to original position
            cancelAnimationFrame(animFrame);
            isBouncing = false;

            mascot.classList.remove('mascot--bouncing');
            mascot.style.position = '';
            mascot.style.left     = '';
            mascot.style.top      = '';
            mascot.style.bottom   = '';
            mascot.style.right    = '';
            mascot.style.zIndex   = '';
            originalParent.appendChild(mascot);
        }
    });

    function squish(sx, sy) {
        clearTimeout(squishTimer);
        mascotBody.style.transition = 'transform 0.07s ease-out';
        mascotBody.style.transform  = `scaleX(${sx}) scaleY(${sy})`;
        squishTimer = setTimeout(() => {
            mascotBody.style.transition = 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)';
            mascotBody.style.transform  = '';
        }, 70);
    }

    function loop() {
        vy += GRAVITY;
        posX += vx;
        posY += vy;

        const navbar = document.querySelector('.navbar');
        const navH   = navbar ? navbar.offsetHeight : 0;
        const maxX = window.innerWidth  - SIZE;
        const maxY = window.innerHeight - SIZE;

        if (posX <= 0) {
            posX = 0;
            vx = Math.abs(vx) * BOUNCINESS;
            squish(0.65, 1.35);
        } else if (posX >= maxX) {
            posX = maxX;
            vx = -Math.abs(vx) * BOUNCINESS;
            squish(0.65, 1.35);
        }

        if (posY <= navH) {
            posY = navH;
            vy = Math.abs(vy) * BOUNCINESS;
            squish(1.35, 0.65);
        } else if (posY >= maxY) {
            posY = maxY;
            vy = -Math.abs(vy) * BOUNCINESS;
            vx *= FRICTION;
            // Never let it settle flat — always keep a minimum bounce height
            if (Math.abs(vy) < 7) vy = -(7 + Math.random() * 4);
            if (Math.abs(vx) < 1.5) vx = (Math.random() - 0.5) * 10;
            squish(1.5, 0.55);
        }

        mascot.style.left = posX + 'px';
        mascot.style.top  = posY + 'px';

        animFrame = requestAnimationFrame(loop);
    }
}

// ===== Hero Click – Bouncing Ball =====
function initHeroBounce() {
    const hero = document.querySelector('.hero');

    // Subtle "click anywhere" hint
    const hint = document.createElement('div');
    hint.className = 'hero-play-hint';
    hint.textContent = 'Click anywhere to play!';
    hero.appendChild(hint);

    hero.addEventListener('click', (e) => {
        // Ignore clicks on interactive elements / cards
        if (e.target.closest('a, button, .peel-corner, .stack-card, .mascot, .scroll-indicator')) return;
        spawnBounceBall(e.clientX, e.clientY);
    });
}

function spawnBounceBall(startX, startY) {
    const colors = ['#7C3AED', '#EC4899', '#3B82F6', '#FBBF24', '#10B981', '#F97316', '#06B6D4'];

    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 48 + Math.random() * 20;

    const ball = document.createElement('div');
    ball.className = 'hero-bounce-ball';
    ball.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        left: ${startX - size / 2}px;
        top: ${startY - size / 2}px;
        background: ${color};
        border-radius: 50%;
        z-index: 9999;
        pointer-events: none;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${size * 0.42}px;
        box-shadow: 0 6px 24px rgba(0,0,0,0.25), inset 0 -5px 0 rgba(0,0,0,0.18), inset 4px 4px 0 rgba(255,255,255,0.25);
        transform: scale(0);
        transition: transform 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        will-change: left, top, transform;
    `;
    document.body.appendChild(ball);

    // Pop in
    requestAnimationFrame(() => { ball.style.transform = 'scale(1)'; });

    // Physics state
    let vx = (Math.random() - 0.5) * 18;
    let vy = -(12 + Math.random() * 10);
    const gravity = 0.55;
    const bounciness = 0.68;
    const friction = 0.88;
    let posX = startX - size / 2;
    let posY = startY - size / 2;

    const startTime = Date.now();
    const lifetime = 7000;
    let floorBounces = 0;
    let squishTimer = null;
    let animFrame;

    function squish(sx, sy) {
        clearTimeout(squishTimer);
        ball.style.transition = 'transform 0.08s ease-out';
        ball.style.transform = `scale(1) scaleX(${sx}) scaleY(${sy})`;
        squishTimer = setTimeout(() => {
            ball.style.transition = 'transform 0.15s cubic-bezier(0.34,1.56,0.64,1)';
            ball.style.transform = 'scale(1)';
        }, 80);
    }

    function update() {
        vy += gravity;
        posX += vx;
        posY += vy;

        const w = window.innerWidth;
        const h = window.innerHeight;

        if (posX <= 0) {
            posX = 0;
            vx = Math.abs(vx) * bounciness;
            squish(0.6, 1.4);
        } else if (posX + size >= w) {
            posX = w - size;
            vx = -Math.abs(vx) * bounciness;
            squish(0.6, 1.4);
        }

        if (posY <= 0) {
            posY = 0;
            vy = Math.abs(vy) * bounciness;
            squish(1.4, 0.6);
        } else if (posY + size >= h) {
            posY = h - size;
            vy = -Math.abs(vy) * bounciness;
            vx *= friction;
            squish(1.5, 0.55);
            floorBounces++;
        }

        ball.style.left = posX + 'px';
        ball.style.top = posY + 'px';

        const age = Date.now() - startTime;
        const speed = Math.sqrt(vx * vx + vy * vy);
        const done = age >= lifetime || (floorBounces >= 6 && speed < 1.5);

        if (done) {
            ball.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            ball.style.opacity = '0';
            ball.style.transform = 'scale(0)';
            setTimeout(() => ball.remove(), 400);
        } else {
            animFrame = requestAnimationFrame(update);
        }
    }

    // Small delay so pop-in is visible first
    setTimeout(() => { animFrame = requestAnimationFrame(update); }, 150);
}

// =============================================
//  INTERACTIVE ALIEN
// =============================================
(function () {
    'use strict';

    const alien      = document.getElementById('alien');
    const belly      = document.getElementById('alienBelly');
    const legs       = document.getElementById('alienLegs');
    const armL       = document.getElementById('alienArmL');
    const armR       = document.getElementById('alienArmR');
    const eyeC       = document.getElementById('alienEyeC');
    const mouth      = document.getElementById('alienMouth');
    const speech     = document.getElementById('alienSpeech');
    const speechText = document.getElementById('alienSpeechText');

    if (!alien) return;

    const Q = {
        belly: ['WHEEE I love jumping!! 🤸', 'Can\'t stop won\'t stop!! 🐸', 'My planet called — I\'m late!! 🚀', 'Bouncy bouncy boing!! 😂', 'This is my cardio!! 💚'],
        legs:  ['NOO not the legs!! 😱',     'My kneecaps!! 😭',             'TELL MY MOM I LOVE HER 😭',         'Gravity is NOT my friend', 'I did NOT consent to this!!'],
        grab:  ['Put me DOWN I have rights! ✊', 'I come in peace but—', 'My planet is watching 👀', 'Is this a kidnapping?!', 'I\'ll call space court!'],
        throw: ['WHEEEEE!! 🚀',               'THIS IS NOT FINE!!',    'Did NOT sign up for this!',             'MUM?? 👽',                 'Warn me next time!!'],
        wave:  ['I come in peace ✌️', 'Greetings hooman!! 👋'],
        back:  ['I\'m okay!! Just a scratch 😅', 'Landing: 7/10 🛸',    'Did everyone see that?? 😎',           'Totally meant to do that', 'Space court is calling...'],
        cry:    ['OW THAT\'S MY GOOD EYE!! 😭',  'Why would you DO that?!', 'I am literally crying rn 😢',       'That HURT you monster!!',  'This is NOT okay 😭😭'],
        tongue: ['BLEP 👅', 'You didn\'t see that 😶', 'Taste the rainbow 🌈', 'My therapist said express yourself', 'Earth air tastes WEIRD 😝'],
        antenna:['DON\'T touch those!! 😤', 'That\'s my WiFi signal!!', 'I just lost 4 bars!! 😱', 'Ow my Bluetooth!! 📡', 'Those are PERSONAL antennae!!']
    };

    let state       = 'idle';
    let alienX      = 0, alienY = 0;
    let vx          = 0, vy    = 0;
    let dragOffX    = 0, dragOffY = 0;
    let lastPX      = 0, lastPY  = 0, lastT = 0;
    let homeX       = 0, homeY   = 0;
    let loopFrame   = null;
    let speechTimer = null;

    const GRAVITY = 0.5, BOUNCE = 0.55, FRIC = 0.984;

    /* ── Helpers ── */
    function say(type) {
        const arr = Q[type];
        speechText.textContent = arr[Math.floor(Math.random() * arr.length)];
        speech.classList.add('show');
        clearTimeout(speechTimer);
        speechTimer = setTimeout(() => speech.classList.remove('show'), 2800);
    }

    function clearState() {
        alien.classList.remove('grabbing', 'flying', 'scared', 'happy');
        state = 'idle';
    }

    function recordHome() {
        const r = alien.getBoundingClientRect();
        homeX = r.left;
        homeY = r.top;
    }

    function pinFixed() {
        const r = alien.getBoundingClientRect();
        alienX = r.left;
        alienY = r.top;
        alien.style.cssText = 'position:fixed;left:' + alienX + 'px;top:' + alienY + 'px;margin:0;transform:none;animation:none;transition:none;z-index:9999;';
    }

    function unpin() { alien.style.cssText = ''; }

    function returnHome() {
        alien.classList.remove('scared', 'happy');
        alien.style.transform = 'none';
        alien.style.transition = 'left 0.7s cubic-bezier(0.25,0.46,0.45,0.94), top 0.7s cubic-bezier(0.25,0.46,0.45,0.94)';
        alien.style.left = homeX + 'px';
        alien.style.top  = homeY + 'px';
        setTimeout(() => { unpin(); clearState(); }, 950);
    }

    /* ── MOUTH → tongue out ── */
    if (mouth) {
        mouth.style.cursor = 'pointer';
        mouth.addEventListener('mousedown', function (e) { e.stopPropagation(); });
        mouth.addEventListener('touchstart', function (e) { e.stopPropagation(); }, { passive: true });
        mouth.addEventListener('click', function (e) {
            e.stopPropagation();
            if (alien.classList.contains('tongue-out')) return;
            say('tongue');
            alien.classList.add('tongue-out');
            setTimeout(() => alien.classList.remove('tongue-out'), 2000);
        });
    }

    /* ── CENTER EYE → cry ── */
    if (eyeC) {
        eyeC.style.cursor = 'pointer';
        eyeC.addEventListener('mousedown', function (e) { e.stopPropagation(); });
        eyeC.addEventListener('touchstart', function (e) { e.stopPropagation(); }, { passive: true });
        eyeC.addEventListener('click', function (e) {
            e.stopPropagation();
            if (state !== 'idle') return;
            say('cry');
            alien.classList.add('crying');
            setTimeout(() => alien.classList.remove('crying'), 6000);
        });
    }

    /* ── ANTENNAE → sparkles ── */
    const SPARKLE_COLORS = ['#FBBF24','#F97316','#EC4899','#A855F7','#38BDF8','#34D399','#fff'];
    function burstSparkles(el) {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top  + r.height / 2;
        for (let i = 0; i < 10; i++) {
            const s = document.createElement('div');
            s.className = 'alien-sparkle';
            const angle = (i / 10) * Math.PI * 2 + Math.random() * 0.4;
            const dist  = 40 + Math.random() * 55;
            const midX  = Math.cos(angle) * dist * 0.45 + 'px';
            const midY  = Math.sin(angle) * dist * 0.45 + 'px';
            const endX  = Math.cos(angle) * dist + 'px';
            const endY  = Math.sin(angle) * dist + 'px';
            const size  = 10 + Math.random() * 14;
            s.style.cssText = `left:${cx - size/2}px;top:${cy - size/2}px;width:${size}px;height:${size}px;background:${SPARKLE_COLORS[i % SPARKLE_COLORS.length]};--sx:${midX};--sy:${midY};--ex:${endX};--ey:${endY};animation-delay:${Math.random()*0.15}s`;
            document.body.appendChild(s);
            s.addEventListener('animationend', () => s.remove());
        }
    }

    [document.getElementById('alienAntL'), document.getElementById('alienAntR')].forEach(function (el) {
        if (!el) return;
        el.style.cursor = 'pointer';
        el.addEventListener('mousedown', function (e) { e.stopPropagation(); });
        el.addEventListener('touchstart', function (e) { e.stopPropagation(); }, { passive: true });
        el.addEventListener('click', function (e) { e.stopPropagation(); burstSparkles(el); say('antenna'); });
    });

    /* ── Stop mousedown bubbling on interactive parts so drag doesn't swallow clicks ── */
    [belly, legs, armL, armR].forEach(function (el) {
        if (el) el.addEventListener('mousedown', function (e) { e.stopPropagation(); });
        if (el) el.addEventListener('touchstart', function (e) { e.stopPropagation(); }, { passive: true });
    });

    /* ── BELLY → bounce around the hero ── */
    belly.addEventListener('click', function (e) {
        e.stopPropagation();
        if (state !== 'idle') return;
        say('belly');
        alien.classList.add('happy');
        pinFixed();
        state = 'bouncing';
        cancelAnimationFrame(loopFrame);

        // Full hero section bounds
        const hero    = document.querySelector('.hero');
        const heroR   = hero ? hero.getBoundingClientRect() : { top: 0, bottom: window.innerHeight, left: 0, right: window.innerWidth };
        const bTop    = heroR.top    + 10;
        const bBottom = heroR.bottom - 10;
        const bLeft   = heroR.left   + 10;
        const bRight  = heroR.right  - 10;

        // Start with a big chaotic kick
        vy = -28;
        vx = (Math.random() - 0.5) * 22;

        let bounces = 0;
        function bounceLoop() {
            if (state !== 'bouncing') return;
            vy += GRAVITY;
            alienX += vx;
            alienY += vy;
            vx *= 0.998;

            const w = alien.offsetWidth, h = alien.offsetHeight;

            if (alienX < bLeft)       { alienX = bLeft;       vx =  Math.abs(vx) * 0.85; }
            if (alienX + w > bRight)  { alienX = bRight - w;  vx = -Math.abs(vx) * 0.85; }
            if (alienY < bTop)        { alienY = bTop;         vy =  Math.abs(vy) * 0.8; }
            if (alienY + h > bBottom) {
                alienY = bBottom - h;
                vy = -Math.abs(vy) * 0.82;
                vx = (Math.random() - 0.5) * 24;
                bounces++;
            }

            alien.style.left = alienX + 'px';
            alien.style.top  = alienY + 'px';

            if (bounces >= 5 && Math.abs(vy) < 2) {
                state = 'settled';
                setTimeout(returnHome, 400);
                return;
            }
            loopFrame = requestAnimationFrame(bounceLoop);
        }
        bounceLoop();
    });

    /* ── LEGS → fall off screen ── */
    legs.addEventListener('click', function (e) {
        e.stopPropagation();
        if (state !== 'idle') return;
        say('legs');
        alien.classList.add('scared');
        pinFixed();
        state = 'falling';
        cancelAnimationFrame(loopFrame);

        vx = (Math.random() - 0.5) * 4;
        vy = 1;
        let rot = 0;
        const rotDir = (Math.random() > 0.5 ? 1 : -1) * 7;

        function fallLoop() {
            if (state !== 'falling') return;
            vy += GRAVITY * 1.6;
            alienX += vx;
            alienY += vy;
            rot += rotDir;
            alien.style.left = alienX + 'px';
            alien.style.top  = alienY + 'px';
            alien.style.transform = 'rotate(' + rot + 'deg)';

            if (alienY > window.innerHeight + 80) {
                state = 'returning';
                setTimeout(function () {
                    say('back');
                    alien.style.transform = 'none';
                    alien.classList.remove('scared');
                    returnHome();
                }, 700);
                return;
            }
            loopFrame = requestAnimationFrame(fallLoop);
        }
        fallLoop();
    });

    /* ── ARMS → wave ── */
    let waveIdx = 0;
    function doWave(arm, cls) {
        if (state !== 'idle') return;
        const phrases = Q['wave'];
        speechText.textContent = phrases[waveIdx % phrases.length];
        waveIdx++;
        speech.classList.add('show');
        clearTimeout(speechTimer);
        speechTimer = setTimeout(() => speech.classList.remove('show'), 2800);
        arm.classList.remove(cls);
        void arm.offsetWidth; // reflow
        arm.classList.add(cls);
        arm.addEventListener('animationend', () => arm.classList.remove(cls), { once: true });
    }
    if (armL) armL.addEventListener('click', function (e) { e.stopPropagation(); doWave(armL, 'waving'); });
    if (armR) armR.addEventListener('click', function (e) { e.stopPropagation(); doWave(armR, 'waving'); });

    /* ── DRAG ── */
    function onDown(e) {
        if (state !== 'idle') return;
        e.preventDefault();
        cancelAnimationFrame(loopFrame);
        recordHome();
        pinFixed();

        const px = e.touches ? e.touches[0].clientX : e.clientX;
        const py = e.touches ? e.touches[0].clientY : e.clientY;
        dragOffX = px - alienX;
        dragOffY = py - alienY;
        lastPX = px; lastPY = py; lastT = Date.now();
        vx = 0; vy = 0;

        state = 'dragging';
        alien.classList.add('grabbing');
        say('grab');

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup',   onUp);
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend',  onUp);
    }

    function onMove(e) {
        if (state !== 'dragging') return;
        if (e.cancelable) e.preventDefault();
        const px = e.touches ? e.touches[0].clientX : e.clientX;
        const py = e.touches ? e.touches[0].clientY : e.clientY;
        const now = Date.now(), dt = Math.max(now - lastT, 1);
        vx = (px - lastPX) / dt * 16;
        vy = (py - lastPY) / dt * 16;
        lastPX = px; lastPY = py; lastT = now;
        alienX = px - dragOffX;
        alienY = py - dragOffY;
        alien.style.left = alienX + 'px';
        alien.style.top  = alienY + 'px';
    }

    function onUp() {
        if (state !== 'dragging') return;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup',   onUp);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend',  onUp);

        if (Math.hypot(vx, vy) > 3) {
            state = 'flying';
            alien.classList.remove('grabbing');
            alien.classList.add('flying');
            say('throw');
            flyLoop();
        } else {
            returnHome();
        }
    }

    /* ── THROW physics (spin + bounce) ── */
    function flyLoop() {
        if (state !== 'flying') return;
        vy += GRAVITY;
        alienX += vx;
        alienY += vy;
        vx *= FRIC;

        const w = alien.offsetWidth, h = alien.offsetHeight;
        const mw = window.innerWidth, mh = window.innerHeight;
        if (alienX < 0)      { alienX = 0;      vx =  Math.abs(vx) * BOUNCE; }
        if (alienX + w > mw) { alienX = mw - w; vx = -Math.abs(vx) * BOUNCE; }
        if (alienY < 0)      { alienY = 0;       vy =  Math.abs(vy) * BOUNCE; }
        if (alienY + h > mh) { alienY = mh - h;  vy = -Math.abs(vy) * BOUNCE; vx *= 0.82; }

        alien.style.left = alienX + 'px';
        alien.style.top  = alienY + 'px';

        if (Math.abs(vx) < 0.4 && Math.abs(vy) < 0.4 && alienY + h >= mh - 2) {
            state = 'settled';
            alien.classList.remove('flying');
            setTimeout(returnHome, 1100);
            return;
        }
        loopFrame = requestAnimationFrame(flyLoop);
    }

    alien.addEventListener('mousedown',  onDown);
    alien.addEventListener('touchstart', onDown, { passive: false });

    if (document.readyState === 'complete') { recordHome(); }
    else { window.addEventListener('load', recordHome); }
}());
