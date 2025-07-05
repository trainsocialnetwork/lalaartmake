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
// Clinic Gallery Swiper - 修正版
class ClinicGallery {
    constructor() {
        this.galleryElement = null;
        this.swiper = null;
        this.init();
    }
    
    init() {
        // DOMの読み込みを確実に待つ
        this.initializeGallery();
    }
    
    initializeGallery() {
        this.galleryElement = document.querySelector('.clinic-gallery');
        if (!this.galleryElement) return;
        
        // ギャラリーの表示状態を初期化
        this.galleryElement.style.opacity = '0';
        this.galleryElement.style.transform = 'translateY(20px)';
        
        const isMobile = window.innerWidth <= 768;
        
        // Swiperの初期化
        this.swiper = new Swiper('.clinic-gallery', {
            slidesPerView: isMobile ? 1.15 : 3,
            spaceBetween: isMobile ? 12 : 24,
            centeredSlides: isMobile ? true : false,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },
            speed: 600,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: false
            },
            breakpoints: {
                320: {
                    slidesPerView: 1.15,
                    spaceBetween: 12,
                    centeredSlides: true
                },
                480: {
                    slidesPerView: 1.2,
                    spaceBetween: 16,
                    centeredSlides: true
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                    centeredSlides: false
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                    centeredSlides: false
                }
            },
            on: {
                init: () => {
                    // Swiper初期化完了後にギャラリー全体をフェードイン
                    setTimeout(() => {
                        this.galleryElement.style.transition = 'all 0.6s ease';
                        this.galleryElement.style.opacity = '1';
                        this.galleryElement.style.transform = 'translateY(0)';
                        
                        // 各スライドにアニメーション適用
                        this.animateSlides();
                    }, 100);
                },
                slideChangeTransitionEnd: () => {
                    // スライド変更後のアニメーション
                    this.updateSlideStyles();
                }
            }
        });
        
        // IntersectionObserverでビューポート内に入った時のアニメーション
        this.setupIntersectionObserver();
    }
    
    animateSlides() {
        if (!this.swiper) return;
        
        const slides = this.swiper.slides;
        slides.forEach((slide, index) => {
            // 初期状態を設定
            slide.style.opacity = '0';
            slide.style.transform = 'scale(0.9)';
            
            // 順番にアニメーション
            setTimeout(() => {
                slide.style.transition = 'all 0.5s ease';
                slide.style.opacity = '1';
                slide.style.transform = 'scale(1)';
            }, index * 100);
        });
    }
    
    updateSlideStyles() {
        if (!this.swiper) return;
        
        const activeSlide = this.swiper.slides[this.swiper.activeIndex];
        const slides = this.swiper.slides;
        
        // 全スライドのスタイルをリセット
        slides.forEach(slide => {
            slide.style.transition = 'all 0.3s ease';
            if (window.innerWidth <= 768) {
                slide.style.opacity = '0.7';
                slide.style.transform = 'scale(0.95)';
            }
        });
        
        // アクティブスライドを強調
        if (activeSlide && window.innerWidth <= 768) {
            activeSlide.style.opacity = '1';
            activeSlide.style.transform = 'scale(1)';
        }
    }
    
    setupIntersectionObserver() {
        const options = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.galleryElement.classList.contains('animated')) {
                    this.galleryElement.classList.add('animated');
                    // 再度アニメーションをトリガー
                    this.animateSlides();
                }
            });
        }, options);
        
        observer.observe(this.galleryElement);
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
