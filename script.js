document.addEventListener('DOMContentLoaded', () => {
    // Initial hero animation
    // Loader Logic
    const loader = document.getElementById('loader');
    const animatedElements = document.querySelectorAll('.fade-in-up');

    if (loader) {
        // Minimum load time of 2s for the animation toplay out
        setTimeout(() => {
            loader.style.transition = 'opacity 0.5s ease-out';
            loader.style.opacity = '0';

            // Remove loader from DOM after fade out
            setTimeout(() => {
                loader.style.display = 'none';
                loader.remove(); // Clean up DOM
            }, 500);

            // Trigger animations after loader starts fading
            setTimeout(() => {
                animatedElements.forEach(el => {
                    el.classList.add('visible');
                });
            }, 200);
        }, 2500);
    } else {
        // No loader (subpages), trigger animations immediately
        setTimeout(() => {
            animatedElements.forEach(el => {
                el.classList.add('visible');
            });
        }, 100);
    }

    // Scroll observer - Optimized with requestAnimationFrame batching
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    // Batch animation updates for better performance
    const animationQueue = new Set();
    let isProcessing = false;

    const processAnimations = () => {
        animationQueue.forEach(target => {
            // Apply will-change right before animation
            target.style.willChange = 'opacity, transform';
            target.classList.add('visible');
            // Remove will-change after animation completes
            setTimeout(() => {
                target.style.willChange = 'auto';
            }, 1000);
        });
        animationQueue.clear();
        isProcessing = false;
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animationQueue.add(entry.target);
                // Unobserve to prevent re-triggering
                observer.unobserve(entry.target);
            }
        });

        // Batch update using requestAnimationFrame
        if (animationQueue.size > 0 && !isProcessing) {
            isProcessing = true;
            requestAnimationFrame(processAnimations);
        }
    }, observerOptions);

    document.querySelectorAll('.scroll-trigger').forEach(el => {
        observer.observe(el);
    });

    // 3D Holographic Tilt - DISABLED for performance
    // Even with throttling, 3D transforms on mousemove can be laggy
    /*
    document.querySelectorAll('.bento-item').forEach(card => {
        let tiltRAF = null;

        card.addEventListener('mousemove', e => {
            if (tiltRAF) return; // Skip if already scheduled

            tiltRAF = requestAnimationFrame(() => {
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

                tiltRAF = null; // Ready for next frame
            });
        });

        card.addEventListener('mouseleave', () => {
            if (tiltRAF) {
                cancelAnimationFrame(tiltRAF);
                tiltRAF = null;
            }
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
    */

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

    // Text Scramble Animation - DISABLED for performance
    /*
    setTimeout(() => {
        const el = document.querySelector('.text-decode');
        if (el) {
            const fx = new TextScramble(el);
            fx.setText('Vidia Edition');
        }
    }, 3000); // Start after loader
    */

    // Neural Network Animation (Canvas) - DISABLED for performance
    // This was causing significant lag due to continuous 60fps animation
    /*
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function resize() {
            width = canvas.width = canvas.parentElement.offsetWidth;
            height = canvas.height = canvas.parentElement.offsetHeight;
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(41, 151, 255, 0.5)';
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            // Reduce particles on mobile for performance
            const particleCount = window.innerWidth < 768 ? 20 : 50;

            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animateNeural() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p, index) => {
                p.update();
                p.draw();

                // Connect particles
                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(41, 151, 255, ${0.1 - dist / 1500})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(animateNeural);
        }

        window.addEventListener('resize', () => {
            resize();
            initParticles();
        });

        resize();
        initParticles();
        animateNeural();
    }
    */

    // Parallax effect - DISABLED for performance
    // Causes jumping/jank on the metal texture background during scroll
    /*
    let parallaxRAF = null;
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;

        if (parallaxRAF) return; // Already scheduled

        parallaxRAF = requestAnimationFrame(() => {
            const parallaxBg = document.querySelector('.parallax-bg');

            if (parallaxBg) {
                parallaxBg.style.transform = `translateY(${lastScrollY * 0.5}px)`;
            }

            // Removed hero zoom effect - minimal visual benefit, high performance cost

            parallaxRAF = null; // Ready for next frame
        });
    });
    */
});
