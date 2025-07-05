/**
 * Homepage JavaScript
 */

// Floating CTA Management
class FloatingCTA {
    constructor() {
        this.container = document.getElementById('floatingCTA');
        this.scrollThreshold = 300;
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        // Initial check
        this.checkScroll();
        
        // Scroll event
        window.addEventListener('scroll', () => this.checkScroll());
    }
    
    checkScroll() {
        const scrollPosition = window.pageYOffset;
        
        if (scrollPosition > this.scrollThreshold) {
            this.container.classList.add('show');
        } else {
            this.container.classList.remove('show');
        }
    }
}

// Clinic Gallery Swiper - 自動スクロール付き
class ClinicGallery {
    constructor() {
        this.init();
    }
    
    init() {
        // Swiperが読み込まれているか確認
        if (typeof Swiper === 'undefined') {
            console.error('Swiper is not loaded');
            return;
        }
        
        // ギャラリー要素の存在確認
        const galleryElement = document.querySelector('.clinic-gallery');
        if (!galleryElement) return;
        
        // Swiperの初期化
        new Swiper('.clinic-gallery', {
            slidesPerView: 'auto',
            spaceBetween: 20,
            centeredSlides: true,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                // モバイル
                320: {
                    slidesPerView: 1.2,
                    spaceBetween: 12,
                },
                // タブレット
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                    centeredSlides: false,
                },
                // デスクトップ
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                    centeredSlides: false,
                }
            }
        });
    }
}

// Mobile Menu Toggle
class MobileMenu {
    constructor() {
        this.toggle = document.getElementById('mobileMenuToggle');
        this.menu = document.getElementById('mobileMenu');
        this.closeBtn = document.getElementById('mobileMenuClose');
        this.isOpen = false;
        this.init();
    }
    
    init() {
        if (!this.toggle || !this.menu) return;
        
        this.toggle.addEventListener('click', () => this.toggleMenu());
        this.closeBtn.addEventListener('click', () => this.closeMenu());
        
        // Close on link click
        const links = this.menu.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(() => this.closeMenu(), 300);
            });
        });
    }
    
    toggleMenu() {
        this.isOpen ? this.closeMenu() : this.openMenu();
    }
    
    openMenu() {
        this.isOpen = true;
        this.menu.classList.add('active');
        this.toggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeMenu() {
        this.isOpen = false;
        this.menu.classList.remove('active');
        this.toggle.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Smooth Scroll
class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.init();
    }
    
    init() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => this.handleClick(e));
        });
    }
    
    handleClick(e) {
        const href = e.currentTarget.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (!target) return;
        
        e.preventDefault();
        
        const headerHeight = document.querySelector('.main-header').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Back to Top Button
class BackToTop {
    constructor() {
        this.button = document.getElementById('backToTop');
        this.showThreshold = 300;
        this.init();
    }
    
    init() {
        if (!this.button) return;
        
        window.addEventListener('scroll', () => this.toggleButton());
        this.button.addEventListener('click', () => this.scrollToTop());
    }
    
    toggleButton() {
        const scrollPosition = window.pageYOffset;
        
        if (scrollPosition > this.showThreshold) {
            this.button.classList.add('show');
        } else {
            this.button.classList.remove('show');
        }
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Scroll Animation
class ScrollAnimation {
    constructor() {
        this.elements = document.querySelectorAll('.service-menu-item, .voice-item, .feature-modern');
        this.init();
    }
    
    init() {
        if (!this.elements.length) return;
        
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.6s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        this.elements.forEach(element => {
            observer.observe(element);
        });
    }
}

// FAQ Accordion functionality
class ServiceFAQ {
    constructor() {
        this.items = document.querySelectorAll('.service-qa .faq-item');
        this.init();
    }
    
    init() {
        if (!this.items.length) return;
        
        this.items.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', (event) => {
                    event.stopPropagation();
                    this.toggleItem(item);
                });
            }
        });
    }
    
    toggleItem(clickedItem) {
        const isActive = clickedItem.classList.contains('active');
        
        // 他のアイテムを閉じる
        this.items.forEach(item => {
            if (item !== clickedItem && item.classList.contains('active')) {
                item.classList.remove('active');
            }
        });
        
        // クリックされたアイテムをトグル
        clickedItem.classList.toggle('active');
    }
}

// Initialize all modules
document.addEventListener('DOMContentLoaded', () => {
    new FloatingCTA();
    new ClinicGallery();
    new MobileMenu();
    new SmoothScroll();
    new BackToTop();
    new ScrollAnimation();
    new ServiceFAQ();
});
