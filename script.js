document.addEventListener('DOMContentLoaded', () => {
    // Initial hero animation
    // Loader Logic
    const loader = document.getElementById('loader');

    // Minimum load time of 2s for the animation to play out
    setTimeout(() => {
        loader.classList.add('loaded');

        // Trigger hero animations after loader exits
        setTimeout(() => {
            document.querySelectorAll('.hero .fade-in-up').forEach(el => {
                el.classList.add('visible');
            });
        }, 600); // Wait for curtain to go up
    }, 2500);

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
