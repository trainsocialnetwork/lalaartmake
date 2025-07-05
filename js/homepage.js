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
        
        const scrollContainer = document.querySelector('.clinic-gallery-scroll');
        const track = galleryWrapper.querySelector('.gallery-track');
        if (!track || !scrollContainer) return;
        
        // タッチ操作を確実に検出するための設定
        galleryWrapper.style.touchAction = 'pan-y pinch-zoom';
        scrollContainer.style.touchAction = 'pan-y pinch-zoom';
        
        // タッチ操作用の変数
        let touchStartX = 0;
        let touchEndX = 0;
        let currentTranslateX = 0;
        let isDragging = false;
        let animationPaused = false;
        let lastTouchTime = 0;
        
        // アニメーションの一時停止/再開関数
        const pauseAnimation = () => {
            if (!animationPaused) {
                track.style.animationPlayState = 'paused';
                animationPaused = true;
            }
        };
        
        const resumeAnimation = () => {
            if (animationPaused) {
                track.style.animationPlayState = 'running';
                animationPaused = false;
            }
        };
        
        // タッチ開始
        galleryWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            isDragging = true;
            lastTouchTime = Date.now();
            pauseAnimation();
            
            // 現在のtransform値を取得
            const computedStyle = window.getComputedStyle(track);
            const matrix = new WebKitCSSMatrix(computedStyle.transform);
            currentTranslateX = matrix.m41;
            
            // トランジションを無効化
            track.style.transition = 'none';
        }, { passive: true });
        
        // タッチ移動
        galleryWrapper.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            touchEndX = e.touches[0].clientX;
            const diffX = touchEndX - touchStartX;
            
            // スワイプに応じて移動
            track.style.transform = `translateX(${currentTranslateX + diffX}px)`;
        }, { passive: true });
        
        // タッチ終了
        galleryWrapper.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            
            const touchDuration = Date.now() - lastTouchTime;
            const diffX = touchEndX - touchStartX;
            const velocity = Math.abs(diffX) / touchDuration;
            
            // トランジションを有効化（スムーズな戻り）
            track.style.transition = 'transform 0.3s ease-out';
            
            // スワイプの閾値（50px以上または高速スワイプ）
            if (Math.abs(diffX) > 50 || velocity > 0.5) {
                // スワイプ方向に応じて追加の移動
                const additionalMove = diffX > 0 ? 200 : -200;
                track.style.transform = `translateX(${currentTranslateX + diffX + additionalMove}px)`;
            } else {
                // 元の位置に戻す
                track.style.transform = `translateX(${currentTranslateX}px)`;
            }
            
            // アニメーションを3秒後に再開
            setTimeout(() => {
                track.style.transition = '';
                track.style.transform = '';
                resumeAnimation();
            }, 3000);
        });
        
        // マウスホバーで一時停止
        galleryWrapper.addEventListener('mouseenter', pauseAnimation);
        galleryWrapper.addEventListener('mouseleave', resumeAnimation);
        
        // キーボード操作
        galleryWrapper.setAttribute('tabindex', '0');
        galleryWrapper.setAttribute('role', 'region');
        galleryWrapper.setAttribute('aria-label', 'クリニック施設ギャラリー');
        
        galleryWrapper.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                if (animationPaused) {
                    resumeAnimation();
                } else {
                    pauseAnimation();
                }
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                pauseAnimation();
                
                const computedStyle = window.getComputedStyle(track);
                const matrix = new WebKitCSSMatrix(computedStyle.transform);
                const currentX = matrix.m41;
                const moveDistance = e.key === 'ArrowLeft' ? 300 : -300;
                
                track.style.transition = 'transform 0.3s ease-out';
                track.style.transform = `translateX(${currentX + moveDistance}px)`;
                
                setTimeout(() => {
                    track.style.transition = '';
                    track.style.transform = '';
                    resumeAnimation();
                }, 3000);
            }
        });
        
        // スクロール速度の動的調整
        this.adjustScrollSpeed();
        window.addEventListener('resize', () => this.adjustScrollSpeed());
    }
    
    adjustScrollSpeed() {
        const track = document.querySelector('.gallery-track');
        if (!track) return;
        
        const width = window.innerWidth;
        let duration = '60s'; // デフォルトをより遅く
        
        if (width < 480) {
            duration = '45s';
        } else if (width < 768) {
            duration = '50s';
        } else if (width < 1024) {
            duration = '55s';
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
