/**
 * LALA アートメイク - メインJavaScript
 * Version: 2.0
 * Updated: 2025
 */

// ===============================================
// 1. グローバル変数とユーティリティ
// ===============================================
const LALA = {
    // ブレークポイント
    breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1440
    },
    
    // アニメーション設定
    animation: {
        duration: 300,
        easing: 'ease-out'
    },
    
    // スクロール設定
    scroll: {
        headerOffset: 80,
        smoothDuration: 800
    }
};

// デバウンス関数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// スロットル関数
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===============================================
// CSS読み込み確認機能を追加した LoadingAnimation クラス
// ===============================================
class LoadingAnimation {
    constructor() {
        this.loader = document.getElementById('loader');
        this.cssLoaded = false;
        this.domReady = false;
        this.init();
    }
    
    init() {
        // CSS読み込みチェック
        this.checkCSSLoaded();
        
        // DOM読み込み完了チェック
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.domReady = true;
                this.checkHideLoader();
            });
        } else {
            this.domReady = true;
            this.checkHideLoader();
        }
        
        // 全リソース読み込み完了時も念のためチェック
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.checkHideLoader();
            }, 100);
        });
        
        // タイムアウト処理（最大3秒待機）
        setTimeout(() => {
            this.hideLoader();
        }, 3000);
    }
    
    checkCSSLoaded() {
        const cssLink = document.querySelector('link[href*="artmake.css"]');
        
        if (cssLink) {
            // 方法1: sheet プロパティの確認
            if (cssLink.sheet) {
                this.cssLoaded = true;
                this.checkHideLoader();
            } else {
                // loadイベントリスナーを追加
                cssLink.addEventListener('load', () => {
                    this.cssLoaded = true;
                    this.checkHideLoader();
                });
                
                // エラー時の処理
                cssLink.addEventListener('error', () => {
                    console.error('CSS loading failed');
                    this.hideLoader(); // エラー時でもローダーを隠す
                });
            }
            
            // 方法2: スタイルが適用されているかチェック
            this.checkStylesApplied();
        } else {
            // CSSリンクが見つからない場合は即座に処理
            this.cssLoaded = true;
            this.checkHideLoader();
        }
    }
    
    checkStylesApplied() {
        // 特定の要素のスタイルが適用されているかチェック
        const checkElement = document.querySelector('.main-header');
        if (checkElement) {
            const styles = window.getComputedStyle(checkElement);
            // CSSが適用されていれば背景色が設定されているはず
            if (styles.backgroundColor !== 'rgba(0, 0, 0, 0)' && styles.backgroundColor !== 'transparent') {
                this.cssLoaded = true;
                this.checkHideLoader();
                return;
            }
        }
        
        // まだ適用されていない場合は再チェック
        if (!this.cssLoaded) {
            setTimeout(() => this.checkStylesApplied(), 50);
        }
    }
    
    checkHideLoader() {
        // CSSとDOMの両方が準備できたらローダーを隠す
        if (this.cssLoaded && this.domReady) {
            this.hideLoader();
        }
    }
    
    hideLoader() {
        if (this.loader && !this.loader.classList.contains('hidden')) {
            this.loader.classList.add('hidden');
            setTimeout(() => {
                if (this.loader) {
                    this.loader.style.display = 'none';
                }
            }, 500);
        }
    }
}

// ===============================================
// 3. ヘッダー管理
// ===============================================
class HeaderManager {
    constructor() {
        this.header = document.querySelector('.main-header');
        this.lastScroll = 0;
        this.scrollThreshold = 100;
        this.init();
    }
    
    init() {
        this.handleScroll();
        window.addEventListener('scroll', throttle(() => this.handleScroll(), 100));
    }
    
    handleScroll() {
        const currentScroll = window.pageYOffset;
        
        // スクロール位置に応じてヘッダーのスタイルを変更
        if (currentScroll > this.scrollThreshold) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
        
        // スクロール方向に応じてヘッダーの表示/非表示
        if (currentScroll > this.lastScroll && currentScroll > 300) {
            this.header.classList.add('hidden');
        } else {
            this.header.classList.remove('hidden');
        }
        
        this.lastScroll = currentScroll;
    }
}

// ===============================================
// 4. モバイルメニュー
// ===============================================
class MobileMenu {
    constructor() {
        this.toggle = document.getElementById('mobileMenuToggle');
        this.menu = document.getElementById('mobileMenu');
        this.closeBtn = document.getElementById('mobileMenuClose');
        this.menuLinks = document.querySelectorAll('.mobile-nav a');
        this.isOpen = false;
        this.init();
    }
    
    init() {
        if (!this.toggle || !this.menu) return;
        
        this.toggle.addEventListener('click', () => this.toggleMenu());
        this.closeBtn.addEventListener('click', () => this.closeMenu());
        
        // メニューリンククリックで閉じる
        this.menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(() => this.closeMenu(), 300);
            });
        });
        
        // 背景クリックで閉じる
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.menu.contains(e.target) && !this.toggle.contains(e.target)) {
                this.closeMenu();
            }
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

// ===============================================
// 5. スムーススクロール
// ===============================================
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
        e.preventDefault();
        const href = e.currentTarget.getAttribute('href');
        
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (!target) return;
        
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition - LALA.scroll.headerOffset;
        
        this.animateScroll(startPosition, distance, LALA.scroll.smoothDuration);
    }
    
    animateScroll(start, distance, duration) {
        let startTime = null;
        
        const animation = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            window.scrollTo(0, start + distance * this.easeInOutQuad(progress));
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };
        
        requestAnimationFrame(animation);
    }
    
    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
}

// ===============================================
// 6. キャンペーンスライダー
// ===============================================
class CampaignSlider {
    constructor() {
        this.init();
    }
    
    init() {
        const swiperElement = document.querySelector('.campaign-slider');
        if (!swiperElement) return;
        
        new Swiper('.campaign-slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true, // 追加：モバイルでの見やすさ向上
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            // 追加：ブレークポイント設定
            breakpoints: {
                768: {
                    navigation: {
                        enabled: true
                    }
                },
                0: {
                    navigation: {
                        enabled: false
                    }
                }
            }
        });
    }
}

// ===============================================
// 7. タブ切り替え（症例写真）
// ===============================================
class TabSwitcher {
    constructor() {
        this.tabs = document.querySelectorAll('.tab-button');
        this.contents = document.querySelectorAll('.tab-content');
        this.init();
    }
    
    init() {
        if (!this.tabs.length) return;
        
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab));
        });
    }
    
    switchTab(clickedTab) {
        const targetId = clickedTab.getAttribute('data-tab');
        
        // タブのアクティブ状態を切り替え
        this.tabs.forEach(tab => {
            tab.classList.toggle('active', tab === clickedTab);
        });
        
        // コンテンツの表示切り替え
        this.contents.forEach(content => {
            const contentId = content.id.replace('-cases', '');
            content.classList.toggle('active', contentId === targetId);
        });
    }
}

// ===============================================
// 8. FAQ アコーディオン
// ===============================================
class FAQAccordion {
    constructor() {
        this.items = document.querySelectorAll('.faq-item');
        this.init();
    }
    
    init() {
        if (!this.items.length) return;
        
        this.items.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => this.toggleItem(item));
            }
        });
    }
    
    toggleItem(clickedItem) {
        const isActive = clickedItem.classList.contains('active');
        
        // 他のアイテムを閉じる
        this.items.forEach(item => {
            if (item !== clickedItem && item.classList.contains('active')) {
                item.classList.remove('active');
                this.setMaxHeight(item.querySelector('.faq-answer'), 0);
            }
        });
        
        // クリックされたアイテムをトグル
        clickedItem.classList.toggle('active');
        const answer = clickedItem.querySelector('.faq-answer');
        
        if (!isActive) {
            const scrollHeight = answer.scrollHeight;
            this.setMaxHeight(answer, scrollHeight);
        } else {
            this.setMaxHeight(answer, 0);
        }
    }
    
    setMaxHeight(element, height) {
        if (element) {
            element.style.maxHeight = height + 'px';
        }
    }
}

// ===============================================
// 9. インタラクションオブザーバー（アニメーション）
// ===============================================
class AnimationObserver {
    constructor() {
        this.elements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
        this.options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }
    
    init() {
        if (!this.elements.length) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, this.options);
        
        this.elements.forEach(element => {
            observer.observe(element);
        });
    }
}

// ===============================================
// 10. バックトゥトップボタン
// ===============================================
class BackToTop {
    constructor() {
        this.button = document.getElementById('backToTop');
        this.showThreshold = 300;
        this.init();
    }
    
    init() {
        if (!this.button) return;
        
        // スクロール監視
        window.addEventListener('scroll', throttle(() => this.toggleButton(), 100));
        
        // クリックイベント
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

// ===============================================
// 11. フォームバリデーション
// ===============================================
class FormValidator {
    constructor() {
        this.form = document.querySelector('.contact-form form');
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // リアルタイムバリデーション
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
        });
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        if (this.validateForm()) {
            // フォーム送信処理（実際の実装では適切なエンドポイントに送信）
            this.showSuccessMessage();
            this.form.reset();
        }
    }
    
    validateForm() {
        const inputs = this.form.querySelectorAll('[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        let isValid = true;
        
        // 必須チェック
        if (field.hasAttribute('required') && !value) {
            this.showError(field, '必須項目です');
            isValid = false;
        }
        // メールアドレスチェック
        else if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showError(field, '正しいメールアドレスを入力してください');
                isValid = false;
            }
        }
        // 電話番号チェック
        else if (type === 'tel' && value) {
            const telRegex = /^[0-9-+\s]+$/;
            if (!telRegex.test(value)) {
                this.showError(field, '正しい電話番号を入力してください');
                isValid = false;
            }
        }
        
        if (isValid) {
            this.clearError(field);
        }
        
        return isValid;
    }
    
    showError(field, message) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        // 既存のエラーメッセージを削除
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // エラーメッセージを追加
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '12px';
        errorElement.style.marginTop = '5px';
        errorElement.style.display = 'block';
        
        formGroup.appendChild(errorElement);
        field.classList.add('error');
    }
    
    clearError(field) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        
        field.classList.remove('error');
    }
    
    showSuccessMessage() {
        // 成功メッセージの表示（実装例）
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'お問い合わせありがとうございます。内容を確認後、ご連絡させていただきます。';
        successMessage.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #27ae60;
            color: white;
            padding: 20px 30px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideDown 0.3s ease-out;
        `;
        
        document.body.appendChild(successMessage);
        
        setTimeout(() => {
            successMessage.style.animation = 'slideUp 0.3s ease-out';
            setTimeout(() => {
                successMessage.remove();
            }, 300);
        }, 5000);
    }
}

// ===============================================
// 12. 画像遅延読み込み
// ===============================================
class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.options = {
            threshold: 0.01,
            rootMargin: '50px 0px'
        };
        this.init();
    }
    
    init() {
        if (!this.images.length) return;
        
        // Intersection Observer対応チェック
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        imageObserver.unobserve(entry.target);
                    }
                });
            }, this.options);
            
            this.images.forEach(img => imageObserver.observe(img));
        } else {
            // フォールバック
            this.loadAllImages();
        }
    }
    
    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;
        
        img.src = src;
        img.removeAttribute('data-src');
        
        // ロード完了時の処理
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
    }
    
    loadAllImages() {
        this.images.forEach(img => this.loadImage(img));
    }
}

// ===============================================
// 13. アクセシビリティ改善
// ===============================================
class AccessibilityEnhancer {
    constructor() {
        this.init();
    }
    
    init() {
        this.handleKeyboardNavigation();
        this.addAriaLabels();
        this.handleFocusStyles();
    }
    
    handleKeyboardNavigation() {
        // Escキーでモバイルメニューを閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    document.getElementById('mobileMenuClose').click();
                }
            }
        });
        
        // Tabキーでのナビゲーション改善
        const focusableElements = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const focusables = document.querySelectorAll(focusableElements);
        
        if (focusables.length) {
            const firstFocusable = focusables[0];
            const lastFocusable = focusables[focusables.length - 1];
            
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey && document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            });
        }
    }
    
    addAriaLabels() {
        // ボタンにaria-labelを追加
        const buttons = document.querySelectorAll('button:not([aria-label])');
        buttons.forEach(button => {
            if (!button.textContent.trim() && button.querySelector('i')) {
                const icon = button.querySelector('i');
                if (icon.classList.contains('fa-times')) {
                    button.setAttribute('aria-label', '閉じる');
                } else if (icon.classList.contains('fa-chevron-up')) {
                    button.setAttribute('aria-label', 'ページトップへ戻る');
                }
            }
        });
        
        // フォーム要素の改善
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            const label = group.querySelector('label');
            const input = group.querySelector('input, textarea, select');
            
            if (label && input && !input.getAttribute('aria-labelledby')) {
                const labelId = 'label-' + Math.random().toString(36).substr(2, 9);
                label.setAttribute('id', labelId);
                input.setAttribute('aria-labelledby', labelId);
            }
        });
    }
    
    handleFocusStyles() {
        // フォーカス時のスタイル改善
        const style = document.createElement('style');
        style.textContent = `
            :focus-visible {
                outline: 2px solid var(--primary-brown);
                outline-offset: 2px;
            }
            
            .skip-link {
                position: absolute;
                top: -40px;
                left: 0;
                background: var(--primary-brown);
                color: white;
                padding: 8px;
                text-decoration: none;
                border-radius: 0 0 4px 0;
                z-index: 10000;
            }
            
            .skip-link:focus {
                top: 0;
            }
        `;
        document.head.appendChild(style);
        
        // スキップリンクの追加
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'メインコンテンツへスキップ';
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
}

// ===============================================
// 14. パフォーマンス最適化
// ===============================================
// ===============================================
// PerformanceOptimizer の改善
// ===============================================
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.optimizeImages();
        // CSSの遅延読み込みを無効化（問題の原因の可能性があるため）
        // this.deferNonCriticalCSS();
        this.preloadCriticalAssets();
    }
    
    optimizeImages() {
        // WebP対応チェック（既存のコード）
        const checkWebPSupport = () => {
            return new Promise((resolve) => {
                const webP = new Image();
                webP.onload = webP.onerror = () => {
                    resolve(webP.height === 2);
                };
                webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
            });
        };
        
        checkWebPSupport().then(hasWebP => {
            if (hasWebP) {
                document.documentElement.classList.add('webp');
            } else {
                document.documentElement.classList.add('no-webp');
            }
        });
    }
    
    // CSS遅延読み込みを削除またはコメントアウト
    /*
    deferNonCriticalCSS() {
        // この機能は初回ロード時のCSS問題の原因となる可能性があるため無効化
    }
    */
    
    preloadCriticalAssets() {
        // クリティカルアセットのプリロード（既存のコード）
        const criticalAssets = [
            { href: './css/artmake.css', as: 'style' }, // メインCSSをプリロード対象に追加
            { href: '/fonts/NotoSansJP-Regular.woff2', as: 'font', type: 'font/woff2' },
            { href: '/fonts/NotoSansJP-Bold.woff2', as: 'font', type: 'font/woff2' }
        ];
        
        criticalAssets.forEach(asset => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = asset.href;
            link.as = asset.as;
            if (asset.type) link.type = asset.type;
            if (asset.as === 'font') {
                link.crossOrigin = 'anonymous';
            }
            document.head.appendChild(link);
        });
    }
}

// ===============================================
// 15. アプリケーション初期化
// ===============================================
class LALAApp {
    constructor() {
        this.modules = [];
        this.init();
    }
    
    init() {
        // DOMContentLoaded を待つ
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initModules());
        } else {
            this.initModules();
        }
    }
    
    initModules() {
        // 各モジュールのインスタンス化
        this.modules = [
            new LoadingAnimation(),
            new HeaderManager(),
            new MobileMenu(),
            new SmoothScroll(),
            new CampaignSlider(),
            new TabSwitcher(),
            new FAQAccordion(),
            new AnimationObserver(),
            new BackToTop(),
            new FormValidator(),
            new LazyLoader(),
            new AccessibilityEnhancer(),
            new PerformanceOptimizer(),
            new BubbleAnimation(),
            new MobileFixedCTA() // 追加
        ];
        
        // グローバルイベントの設定
        this.setupGlobalEvents();
        
        console.log('LALA Artmake App initialized');
    }
    
    setupGlobalEvents() {
        // ウィンドウリサイズ時の処理
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
        
        // プリント時の処理
        window.addEventListener('beforeprint', () => {
            document.body.classList.add('printing');
        });
        
        window.addEventListener('afterprint', () => {
            document.body.classList.remove('printing');
        });
    }
    
    handleResize() {
        const width = window.innerWidth;
        
        // ブレークポイントに応じたクラスの付与
        document.body.classList.toggle('is-mobile', width < LALA.breakpoints.mobile);
        document.body.classList.toggle('is-tablet', width >= LALA.breakpoints.mobile && width < LALA.breakpoints.tablet);
        document.body.classList.toggle('is-desktop', width >= LALA.breakpoints.tablet);
    }
}

// ===============================================
// 16. 泡アニメーション
// ===============================================
class BubbleAnimation {
    constructor() {
        this.container = document.getElementById('heroBubbles');
        this.bubbleCount = window.innerWidth < 768 ? 7 : 15; // 泡の数
        this.bubbles = [];
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        // 初期の泡を生成
        this.createBubbles();
        
        // ビューポートのリサイズ時に泡を再生成
        window.addEventListener('resize', debounce(() => {
            this.clearBubbles();
            this.createBubbles();
        }, 500));
    }
    
    createBubbles() {
        for (let i = 0; i < this.bubbleCount; i++) {
            this.createBubble(i);
        }
    }
    
    createBubble(index) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        // ランダムなサイズ（20px〜80px）
        const size = Math.random() * 60 + 20;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        
        // ランダムな水平位置
        const leftPosition = Math.random() * 100;
        bubble.style.left = `${leftPosition}%`;
        
        // ランダムなアニメーション時間（15秒〜30秒）
        const duration = Math.random() * 15 + 15;
        bubble.style.setProperty('--duration', `${duration}s`);
        
        // ランダムな遅延（0秒〜10秒）
        const delay = Math.random() * 10;
        bubble.style.setProperty('--delay', `${delay}s`);
        
        // 揺れのランダム値
        const wobbleRange = 30;
        bubble.style.setProperty('--wobble1', `${(Math.random() - 0.5) * wobbleRange}px`);
        bubble.style.setProperty('--wobble2', `${(Math.random() - 0.5) * wobbleRange}px`);
        bubble.style.setProperty('--wobble3', `${(Math.random() - 0.5) * wobbleRange}px`);
        bubble.style.setProperty('--wobble4', `${(Math.random() - 0.5) * wobbleRange}px`);
        bubble.style.setProperty('--wobble5', `${(Math.random() - 0.5) * wobbleRange}px`);
        bubble.style.setProperty('--wobble6', `${(Math.random() - 0.5) * wobbleRange}px`);
        
        this.container.appendChild(bubble);
        this.bubbles.push(bubble);
        
        // アニメーション終了時に泡を再生成
        bubble.addEventListener('animationiteration', () => {
            // ランダムな新しい位置とサイズを設定
            const newSize = Math.random() * 60 + 20;
            const newLeft = Math.random() * 100;
            
            bubble.style.width = `${newSize}px`;
            bubble.style.height = `${newSize}px`;
            bubble.style.left = `${newLeft}%`;
            
            // 新しい揺れの値
            bubble.style.setProperty('--wobble1', `${(Math.random() - 0.5) * wobbleRange}px`);
            bubble.style.setProperty('--wobble2', `${(Math.random() - 0.5) * wobbleRange}px`);
            bubble.style.setProperty('--wobble3', `${(Math.random() - 0.5) * wobbleRange}px`);
            bubble.style.setProperty('--wobble4', `${(Math.random() - 0.5) * wobbleRange}px`);
            bubble.style.setProperty('--wobble5', `${(Math.random() - 0.5) * wobbleRange}px`);
            bubble.style.setProperty('--wobble6', `${(Math.random() - 0.5) * wobbleRange}px`);
        });
    }
    
    clearBubbles() {
        this.bubbles.forEach(bubble => bubble.remove());
        this.bubbles = [];
    }
}

// ===============================================
// 17. モバイル固定CTAボタン
// ===============================================
class MobileFixedCTA {
    constructor() {
        this.button = document.getElementById('mobileFixedCTA');
        this.heroSection = document.querySelector('.hero, .page-hero');
        this.lastScrollTop = 0;
        this.isShown = false;
        this.heroThreshold = 0;
        this.init();
    }
    
    init() {
        if (!this.button || !this.heroSection) return;
        
        // モバイルでのみ動作
        if (window.innerWidth > 768) return;
        
        // Hero sectionの高さを取得
        this.calculateHeroThreshold();
        
        // スクロールイベントの監視
        window.addEventListener('scroll', throttle(() => this.handleScroll(), 100));
        
        // リサイズ時の再計算
        window.addEventListener('resize', debounce(() => {
            if (window.innerWidth > 768) {
                this.hideButton();
            } else {
                this.calculateHeroThreshold();
            }
        }, 250));
        
        // スムーススクロール対応
        const ctaLink = this.button.querySelector('a');
        if (ctaLink) {
            ctaLink.addEventListener('click', () => {
                // クリック時に一時的に非表示
                setTimeout(() => {
                    this.hideButton();
                }, 100);
            });
        }
    }
    
    calculateHeroThreshold() {
        const heroRect = this.heroSection.getBoundingClientRect();
        const heroHeight = heroRect.height;
        this.heroThreshold = heroHeight - 100; // Hero sectionの高さから100px引いた位置
    }
    
    handleScroll() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDirection = currentScrollTop > this.lastScrollTop ? 'down' : 'up';
        
        // Hero sectionを通過したかチェック
        const passedHero = currentScrollTop > this.heroThreshold;
        
        // 表示/非表示の制御
        if (passedHero) {
            if (scrollDirection === 'down' && !this.isShown) {
                this.showButton();
            } else if (scrollDirection === 'up' && this.isShown) {
                this.hideButton();
            }
        } else {
            // Hero section内にいる場合は常に非表示
            if (this.isShown) {
                this.hideButton();
            }
        }
        
        this.lastScrollTop = currentScrollTop;
    }
    
    showButton() {
        this.button.classList.add('show');
        this.button.classList.remove('hide');
        this.isShown = true;
    }
    
    hideButton() {
        this.button.classList.remove('show');
        this.button.classList.add('hide');
        this.isShown = false;
    }
}

// アプリケーションの起動
const app = new LALAApp();

// グローバルに公開（必要に応じて）
window.LALA = LALA;
window.LALAApp = app;
