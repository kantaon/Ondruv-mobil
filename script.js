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

    // 3D Holographic Tilt - Already OPTIMIZED with RAF throttling
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
                const rotateX = ((y - centerY) / centerY) * -10;
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

    // Text Decoding Animation - OPTIMIZED
    class TextScramble {
        constructor(el) {
            this.el = el;
            // OPTIMIZED: Reduced character set for faster random selection
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }

        setText(newText) {
            const oldText = this.el.textContent;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 20); // OPTIMIZED: Reduced from 40
                const end = start + Math.floor(Math.random() * 20); // OPTIMIZED: Reduced from 40
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
                    output += char;
                } else {
                    output += from;
                }
            }
            // OPTIMIZED: Use textContent instead of innerHTML
            this.el.textContent = output;
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

    // Initialize Text Scramble on Hero Title - OPTIMIZED
    // OPTIMIZED: Shortened delay from 3000ms to 2000ms
    setTimeout(() => {
        const el = document.querySelector('.text-decode');
        if (el) {
            const fx = new TextScramble(el);
            fx.setText('Vidia Edition');
        }
    }, 2000);

    // Neural Network Animation (Canvas) - OPTIMIZED
    // Only animates when visible, reduced particles, 30fps throttle
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let animationId = null;
        let isVisible = false;
        let lastFrameTime = 0;
        const fps = 30; // Throttle to 30fps (was 60fps)
        const frameInterval = 1000 / fps;

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
            // OPTIMIZED: Reduced particles 50→30 (desktop), 20→10 (mobile)
            const particleCount = window.innerWidth < 768 ? 10 : 30;

            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animateNeural(currentTime) {
            if (!isVisible) return; // Don't animate when off-screen

            animationId = requestAnimationFrame(animateNeural);

            // Throttle to 30fps
            const elapsed = currentTime - lastFrameTime;
            if (elapsed < frameInterval) return;
            lastFrameTime = currentTime - (elapsed % frameInterval);

            ctx.clearRect(0, 0, width, height);

            particles.forEach((p, index) => {
                p.update();
                p.draw();

                // OPTIMIZED: Increased distance 150→200 for fewer connections
                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 200) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(41, 151, 255, ${0.15 - dist / 2000})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });
        }

        // OPTIMIZED: IntersectionObserver - only animate when visible
        const aiSection = canvas.closest('.ai-section');
        if (aiSection) {
            const neuralObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    isVisible = entry.isIntersecting;
                    if (isVisible && !animationId) {
                        animateNeural(0);
                    } else if (!isVisible && animationId) {
                        cancelAnimationFrame(animationId);
                        animationId = null;
                    }
                });
            }, { threshold: 0.1 });

            neuralObserver.observe(aiSection);
        }

        window.addEventListener('resize', () => {
            resize();
            initParticles();
        });

        resize();
        initParticles();
    }

    // Parallax effect - OPTIMIZED
    // Using translate3d() for GPU, reduced speed, will-change management
    let parallaxRAF = null;
    let lastScrollY = 0;
    let isScrolling = false;
    let scrollTimeout;

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;

        if (parallaxRAF) return; // Already scheduled

        // Apply will-change during scroll
        const parallaxBg = document.querySelector('.parallax-bg');
        if (parallaxBg && !isScrolling) {
            parallaxBg.style.willChange = 'transform';
            isScrolling = true;
        }

        parallaxRAF = requestAnimationFrame(() => {
            if (parallaxBg) {
                // OPTIMIZED: Use translate3d() for GPU acceleration
                // OPTIMIZED: Reduced speed 0.5 → 0.3 for subtler, smoother effect
                parallaxBg.style.transform = `translate3d(0, ${lastScrollY * 0.3}px, 0)`;
            }

            parallaxRAF = null;
        });

        // Remove will-change after scrolling stops
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (parallaxBg) {
                parallaxBg.style.willChange = 'auto';
                isScrolling = false;
            }
        }, 150);
    });
});
