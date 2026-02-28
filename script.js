/* ============================================
   Girne Taksi - script.js
   Interactive functionality
   girnetaksi.com.tr
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ==================== PRELOADER ====================
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 800);
    });

    // Fallback: hide preloader after 3 seconds  
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 3000);

    // ==================== MOBILE NAVIGATION ====================
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    function openMenu() {
        navMenu.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        navMenu.classList.remove('show');
        document.body.style.overflow = '';
    }

    if (navToggle) navToggle.addEventListener('click', openMenu);
    if (navClose) navClose.addEventListener('click', closeMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('show') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            closeMenu();
        }
    });

    // ==================== HEADER SCROLL EFFECT ====================
    const header = document.getElementById('header');
    const backToTop = document.getElementById('back-to-top');

    function handleScroll() {
        const scrollY = window.scrollY;

        // Header background
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button
        if (scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active nav link based on scroll position
        updateActiveNavLink();
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    // Back to top click
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==================== ACTIVE NAV LINK ====================
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ==================== COUNTER ANIMATION ====================
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        
        counters.forEach(counter => {
            if (counter.dataset.animated) return;
            
            const target = parseFloat(counter.getAttribute('data-target'));
            const duration = 2000;
            const start = performance.now();
            const isDecimal = target % 1 !== 0;

            function updateCounter(currentTime) {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out cubic
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = target * easeOut;

                if (isDecimal) {
                    counter.textContent = current.toFixed(1);
                } else if (target >= 1000) {
                    counter.textContent = Math.floor(current).toLocaleString('tr-TR');
                } else {
                    counter.textContent = Math.floor(current);
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    if (isDecimal) {
                        counter.textContent = target.toFixed(1);
                    } else if (target >= 1000) {
                        counter.textContent = target.toLocaleString('tr-TR');
                    } else {
                        counter.textContent = target;
                    }
                    counter.dataset.animated = 'true';
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    // ==================== SCROLL ANIMATIONS ====================
    function setupScrollAnimations() {
        const animElements = document.querySelectorAll(
            '.service-card, .why-card, .price-card, .fleet-feature, .faq-item, .contact-card, .stat-item'
        );
        
        animElements.forEach(el => {
            el.classList.add('animate-on-scroll');
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Stagger animation for siblings
                    const parent = entry.target.parentElement;
                    const siblings = parent.querySelectorAll('.animate-on-scroll');
                    const index = Array.from(siblings).indexOf(entry.target);
                    
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, index * 100);

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animElements.forEach(el => observer.observe(el));

        // Counter animation observer
        const statsSection = document.querySelector('.hero-stats');
        if (statsSection) {
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounters();
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            counterObserver.observe(statsSection);
        }
    }

    setupScrollAnimations();

    // ==================== FAQ ACCORDION ====================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other FAQs
            faqItems.forEach(other => {
                if (other !== item) {
                    other.classList.remove('active');
                    const otherAnswer = other.querySelector('.faq-answer');
                    otherAnswer.style.maxHeight = '0';
                    other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current
            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = '0';
                question.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ==================== TESTIMONIALS SLIDER ====================
    const track = document.querySelector('.testimonial-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    const dotsContainer = document.getElementById('testimonial-dots');

    let currentSlide = 0;
    let slidesPerView = 3;
    let totalSlides = cards.length;
    let autoSlideInterval;

    function updateSlidesPerView() {
        if (window.innerWidth < 768) {
            slidesPerView = 1;
        } else if (window.innerWidth < 1024) {
            slidesPerView = 2;
        } else {
            slidesPerView = 3;
        }
    }

    function getMaxSlide() {
        return Math.max(0, totalSlides - slidesPerView);
    }

    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        const maxSlide = getMaxSlide();
        for (let i = 0; i <= maxSlide; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        if (!dotsContainer) return;
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(index) {
        const maxSlide = getMaxSlide();
        currentSlide = Math.max(0, Math.min(index, maxSlide));
        const offset = -(currentSlide * (100 / slidesPerView));
        track.style.transform = `translateX(${offset}%)`;
        updateDots();
    }

    function nextSlide() {
        const maxSlide = getMaxSlide();
        goToSlide(currentSlide >= maxSlide ? 0 : currentSlide + 1);
    }

    function prevSlide() {
        const maxSlide = getMaxSlide();
        goToSlide(currentSlide <= 0 ? maxSlide : currentSlide - 1);
    }

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoSlide(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoSlide(); });

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    if (track) {
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoSlide();
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
            }
            startAutoSlide();
        }, { passive: true });
    }

    function initSlider() {
        updateSlidesPerView();
        createDots();
        goToSlide(0);
        startAutoSlide();
    }

    window.addEventListener('resize', () => {
        updateSlidesPerView();
        createDots();
        goToSlide(Math.min(currentSlide, getMaxSlide()));
    });

    initSlider();

    // ==================== CONTACT FORM ====================
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const pickup = document.getElementById('pickup').value.trim();
            const dropoff = document.getElementById('dropoff').value.trim();
            const message = document.getElementById('message').value.trim();

            // Validation
            if (!name || !phone || !pickup) {
                showNotification('Lütfen gerekli alanları doldurun!', 'error');
                return;
            }

            // Phone validation
            const phoneRegex = /^[0-9+\-\s()]{7,15}$/;
            if (!phoneRegex.test(phone)) {
                showNotification('Geçerli bir telefon numarası girin!', 'error');
                return;
            }

            // Build WhatsApp message
            let whatsappMsg = `Merhaba, Girne Taksi web sitesinden taksi çağırmak istiyorum.\n\n`;
            whatsappMsg += `📋 *Bilgiler:*\n`;
            whatsappMsg += `👤 Ad: ${name}\n`;
            whatsappMsg += `📱 Tel: ${phone}\n`;
            whatsappMsg += `📍 Alınma: ${pickup}\n`;
            if (dropoff) whatsappMsg += `🏁 Bırakılma: ${dropoff}\n`;
            if (message) whatsappMsg += `💬 Not: ${message}\n`;

            const encodedMsg = encodeURIComponent(whatsappMsg);
            const whatsappUrl = `https://wa.me/905488700000?text=${encodedMsg}`;

            // Show success and redirect
            showNotification('Yönlendiriliyorsunuz... WhatsApp açılıyor!', 'success');
            
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
            }, 1000);

            contactForm.reset();
        });
    }

    // ==================== NOTIFICATION SYSTEM ====================
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 24px;
            z-index: 10001;
            padding: 16px 24px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 12px;
            animation: slideInRight 0.4s ease;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            max-width: 400px;
            backdrop-filter: blur(10px);
        `;

        if (type === 'success') {
            notification.style.background = 'rgba(34, 197, 94, 0.9)';
            notification.style.color = 'white';
            notification.style.border = '1px solid rgba(34, 197, 94, 0.5)';
        } else if (type === 'error') {
            notification.style.background = 'rgba(239, 68, 68, 0.9)';
            notification.style.color = 'white';
            notification.style.border = '1px solid rgba(239, 68, 68, 0.5)';
        }

        const notifContent = notification.querySelector('.notification-content');
        if (notifContent) {
            notifContent.style.cssText = 'display: flex; align-items: center; gap: 10px;';
        }

        document.body.appendChild(notification);

        // Auto remove
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.4s ease forwards';
            setTimeout(() => notification.remove(), 400);
        }, 4000);
    }

    // Add notification animations
    const notifStyle = document.createElement('style');
    notifStyle.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(notifStyle);

    // ==================== SMOOTH SCROLL FIX ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPos = targetEl.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==================== PARALLAX EFFECT ON HERO ====================
    const heroBg = document.querySelector('.hero-bg img');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
                heroBg.style.transform = `scale(${1 + scrollY * 0.0002}) translateY(${scrollY * 0.3}px)`;
            }
        }, { passive: true });
    }

    // ==================== LAZY LOADING IMAGES ====================
    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imgObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imgObserver.observe(img);
        });
    }

    console.log('🚕 Girne Taksi website loaded successfully!');
    console.log('📞 Telefon: 0548 870 00 00');
    console.log('🌐 Website: girnetaksi.com.tr');
});
