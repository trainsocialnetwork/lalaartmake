// Homepage JavaScript

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

// Clinic Gallery - 無限スクロール
class ClinicGallery {
    constructor() {
        this.init();
    }
    
    init() {
        const galleryWrapper = document.querySelector('.clinic-gallery-wrapper');
        if (!galleryWrapper) return;
        
        // マウスホバーで一時停止する機能はCSSで実装済み
        // タッチデバイスでの操作性向上
        let isTouch = false;
        
        galleryWrapper.addEventListener('touchstart', () => {
            isTouch = true;
            const track = galleryWrapper.querySelector('.gallery-track');
            if (track) {
                track.style.animationPlayState = 'paused';
            }
        });
        
        galleryWrapper.addEventListener('touchend', () => {
            setTimeout(() => {
                const track = galleryWrapper.querySelector('.gallery-track');
                if (track && isTouch) {
                    track.style.animationPlayState = 'running';
                }
                isTouch = false;
            }, 3000); // 3秒後に再開
        });
        
        // アクセシビリティ: キーボード操作で一時停止
        galleryWrapper.setAttribute('tabindex', '0');
        galleryWrapper.setAttribute('role', 'region');
        galleryWrapper.setAttribute('aria-label', 'クリニック施設ギャラリー');
        
        galleryWrapper.addEventListener('keydown', (e) => {
            const track = galleryWrapper.querySelector('.gallery-track');
            if (!track) return;
            
            if (e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                const isPaused = track.style.animationPlayState === 'paused';
                track.style.animationPlayState = isPaused ? 'running' : 'paused';
            }
        });
        
        // スクロール速度の動的調整（画面幅に応じて）
        this.adjustScrollSpeed();
        window.addEventListener('resize', () => this.adjustScrollSpeed());
    }
    
    adjustScrollSpeed() {
        const track = document.querySelector('.gallery-track');
        if (!track) return;
        
        const width = window.innerWidth;
        let duration = '40s'; // デフォルト
        
        if (width < 480) {
            duration = '25s';
        } else if (width < 768) {
            duration = '30s';
        } else if (width < 1024) {
            duration = '35s';
        }
        
        track.style.animationDuration = duration;
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
    new SmoothScroll();
    new BackToTop();
    new ScrollAnimation();
    new ServiceFAQ();
});
