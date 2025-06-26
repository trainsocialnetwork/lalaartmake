/**
 * 眉アートメイク詳細ページ - JavaScript
 * Version: 1.0
 */

// ===============================================
// ページ内ナビゲーション管理
// ===============================================
class PageNavigation {
    constructor() {
        this.nav = document.getElementById('pageNav');
        this.links = document.querySelectorAll('.page-nav-link');
        this.sections = [];
        this.init();
    }
    
    init() {
        if (!this.nav || !this.links.length) return;
        
        // セクションを取得
        this.links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const section = document.querySelector(href);
                if (section) {
                    this.sections.push({
                        element: section,
                        link: link,
                        id: href.substring(1)
                    });
                }
            }
        });
        
        // スクロールイベントの監視
        this.handleScroll();
        window.addEventListener('scroll', () => this.handleScroll());
        
        // クリックイベント
        this.links.forEach(link => {
            link.addEventListener('click', (e) => this.handleClick(e));
        });
    }
    
    handleScroll() {
        const scrollPosition = window.pageYOffset + 150; // オフセット調整
        
        // 現在のセクションを判定
        let currentSection = null;
        this.sections.forEach(section => {
            const rect = section.element.getBoundingClientRect();
            const top = rect.top + window.pageYOffset;
            
            if (scrollPosition >= top) {
                currentSection = section;
            }
        });
        
        // アクティブ状態を更新
        this.links.forEach(link => link.classList.remove('active'));
        if (currentSection) {
            currentSection.link.classList.add('active');
        }
    }
    
    handleClick(e) {
        e.preventDefault();
        const href = e.currentTarget.getAttribute('href');
        const target = document.querySelector(href);
        
        if (target) {
            const headerHeight = document.querySelector('.main-header').offsetHeight;
            const navHeight = this.nav.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = targetPosition - headerHeight - navHeight - 20;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
}

// ===============================================
// アニメーション管理（簡易版）
// ===============================================
class SimpleAnimationObserver {
    constructor() {
        this.elements = document.querySelectorAll('.fade-in');
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
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        this.elements.forEach(element => {
            observer.observe(element);
        });
    }
}

// ===============================================
// 初期化
// ===============================================
document.addEventListener('DOMContentLoaded', () => {
    // ページナビゲーション
    new PageNavigation();
    
    // アニメーション
    new SimpleAnimationObserver();
    
    // FAQアコーディオン（既存のスクリプトを利用）
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    
                    // 他のアイテムを閉じる
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });
                    
                    // クリックされたアイテムをトグル
                    item.classList.toggle('active');
                });
            }
        });
    }
});
