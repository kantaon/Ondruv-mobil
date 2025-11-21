document.addEventListener('DOMContentLoaded', () => {
    // Initial hero animation
    // Loader Logic
    const loader = document.getElementById('loader');
    const animatedElements = document.querySelectorAll('.fade-in-up');

    if (loader) {
        // Minimum load time of 2s for the animation to play out
        setTimeout(() => {
            loader.classList.add('loaded');

            // Trigger animations after loader exits
            setTimeout(() => {
                animatedElements.forEach(el => {
                    el.classList.add('visible');
                });
            }, 600);
        }, 2500);
    } else {
        // No loader (subpages), trigger animations immediately
        setTimeout(() => {
            animatedElements.forEach(el => {
                el.classList.add('visible');
            });
        }, 100);
    }

    // Scroll observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-trigger').forEach(el => {
        observer.observe(el);
    });

    // 3D Holographic Tilt
    document.querySelectorAll('.bento-item').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation (max 10 degrees)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10; // Invert Y for natural tilt
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

            // Update spotlight
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // Text Decoding Animation
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }

        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];

            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }

            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }

        update() {
            let output = '';
            let complete = 0;

            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="dud">${char}</span>`;
                } else {
                    output += from;
                }
            }

            this.el.innerHTML = output;

            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }

        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    // Initialize Text Scramble on Hero Title
    setTimeout(() => {
        const el = document.querySelector('.text-decode');
        if (el) {
            const fx = new TextScramble(el);
            fx.setText('Vidia Edition');
        }
    }, 3000); // Start after loader

    // Parallax effect
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const parallaxBg = document.querySelector('.parallax-bg');
        const hero = document.querySelector('.hero');

        if (parallaxBg) {
            parallaxBg.style.transform = `translateY(${scrolled * 0.5}px)`;
        }

        if (hero) {
            // Zoom effect: scale up slightly as we scroll down
            const scale = 1 + (scrolled * 0.0005);
            // Limit the scale to avoid pixelation or excessive zoom
            if (scale < 1.5) {
                hero.style.backgroundSize = `${100 * scale}%`;
            }
        }
    });
});
