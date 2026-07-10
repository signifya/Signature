document.addEventListener('DOMContentLoaded', () => {

    // Urgency countdown timer (resets to 4:00 on every page load)
    // Runs first and independently, so it can never be blocked by another script failing.
    try {
        const urgencyTimerEl = document.getElementById('urgencyTimer');
        if (urgencyTimerEl) {
            const totalSeconds = 4 * 60;
            const endTime = Date.now() + totalSeconds * 1000;

            const tick = () => {
                const secondsLeft = Math.max(0, Math.round((endTime - Date.now()) / 1000));
                const m = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
                const s = (secondsLeft % 60).toString().padStart(2, '0');
                urgencyTimerEl.textContent = `${m}:${s}`;
                if (secondsLeft <= 0) {
                    clearInterval(timerInterval);
                }
            };

            tick();
            const timerInterval = setInterval(tick, 1000);
        }
    } catch (e) {
        console.error('Urgency timer failed:', e);
    }

    // Initialize Lucide icons
    try {
        lucide.createIcons();
    } catch (e) {
        console.error('Lucide icons failed to load:', e);
    }

    // GSAP Animations
    try {
        gsap.registerPlugin(ScrollTrigger);

        gsap.utils.toArray('.reveal').forEach((elem) => {
            gsap.set(elem, {
                opacity: 0,
                y: 20,
                scale: 0.98,
                willChange: "transform, opacity"
            });

            gsap.to(elem, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: "expo.out",
                clearProps: "transform, scale",
                force3D: true,
                scrollTrigger: {
                    trigger: elem,
                    start: "top 92%",
                    toggleActions: "play none none none",
                    onEnter: () => {
                        elem.classList.add('revealed');
                        const links = elem.querySelectorAll('a');
                        links.forEach(link => link.style.pointerEvents = 'auto');
                    }
                }
            });
        });

        window.addEventListener('load', () => {
            ScrollTrigger.refresh();
        });
        setTimeout(() => ScrollTrigger.refresh(), 1000);
    } catch (e) {
        console.error('GSAP animations failed:', e);
    }

    // Accordion Logic
    try {
        window.toggleAccordion = function (button) {
            const allAccordions = document.querySelectorAll('.group.bg-white.rounded-3xl');
            const content = button.nextElementSibling;
            const icon = button.querySelector('[data-lucide="chevron-down"]');

            allAccordions.forEach(item => {
                const itemContent = item.querySelector('.max-h-96, .max-h-0');
                if (itemContent && itemContent !== content) {
                    itemContent.classList.remove('max-h-96');
                    itemContent.classList.add('max-h-0');
                    const otherIcon = item.querySelector('[data-lucide="chevron-down"]');
                    if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                }
            });

            if (content.classList.contains('max-h-0')) {
                content.classList.remove('max-h-0');
                content.classList.add('max-h-96');
                icon.style.transform = 'rotate(180deg)';
            } else {
                content.classList.remove('max-h-96');
                content.classList.add('max-h-0');
                icon.style.transform = 'rotate(0deg)';
            }
        };
    } catch (e) {
        console.error('Accordion logic failed:', e);
    }

    // Back to Top Logic
    try {
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 500) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            });

            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    } catch (e) {
        console.error('Back to top failed:', e);
    }

    // Smooth scroll for nav links
    try {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    } catch (e) {
        console.error('Smooth scroll failed:', e);
    }

    // Testimonial Carousel Logic
    try {
        const track = document.querySelector('.testimonial-track');
        const nextBtn = document.getElementById('nextTestimonial');
        const prevBtn = document.getElementById('prevTestimonial');

        if (track && nextBtn && prevBtn) {
            let index = 0;

            function updateCarousel() {
                const gap = window.innerWidth > 768 ? 30 : 20;
                const card = track.querySelector('.testimonial-card');
                if (!card) return;

                const cardWidth = card.offsetWidth;
                const totalStep = cardWidth + gap;

                const visibleCards = window.innerWidth > 1024 ? 3 : (window.innerWidth > 768 ? 2 : 1);
                const maxIndex = track.children.length - visibleCards;

                index = Math.max(0, Math.min(index, maxIndex));
                track.style.transform = `translateX(${-index * totalStep}px)`;

                prevBtn.disabled = index === 0;
                nextBtn.disabled = index >= maxIndex;
                prevBtn.style.opacity = index === 0 ? '0.2' : '1';
                nextBtn.style.opacity = index >= maxIndex ? '0.2' : '1';
            }

            nextBtn.addEventListener('click', () => {
                index++;
                updateCarousel();
            });

            prevBtn.addEventListener('click', () => {
                index--;
                updateCarousel();
            });

            window.addEventListener('resize', () => {
                updateCarousel();
                try { ScrollTrigger.refresh(); } catch (e) {}
            });

            setTimeout(updateCarousel, 100);
        }
    } catch (e) {
        console.error('Testimonial carousel failed:', e);
    }

    // Mobile Menu Logic
    try {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const closeMenuBtn = document.getElementById('closeMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileLinks = document.querySelectorAll('.mobile-nav-link');

        if (mobileMenuBtn && closeMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.remove('translate-x-full');
                document.body.style.overflow = 'hidden';
            });

            closeMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.add('translate-x-full');
                document.body.style.overflow = '';
            });

            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('translate-x-full');
                    document.body.style.overflow = '';
                });
            });
        }
    } catch (e) {
        console.error('Mobile menu failed:', e);
    }
});
