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
