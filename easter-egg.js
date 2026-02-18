(function () {
    const TRIGGER_WINDOW_MS = 900;
    const SHOW_MS = 9000;
    let clickTimes = [];
    let hideTimer = null;
    let confettiTimer = null;

    function ensureCss() {
        if (document.querySelector('link[href="easter-egg.css"]')) return;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'easter-egg.css';
        document.head.appendChild(link);
    }

    function findCopyrightEl() {
        return document.querySelector('.footer span');
    }

    function createOverlay() {
        let overlay = document.getElementById('spring-overlay');
        if (overlay) return overlay;

        overlay = document.createElement('div');
        overlay.id = 'spring-overlay';
        overlay.className = 'spring-overlay';
        overlay.innerHTML = [
            '<div class="spring-confetti" id="spring-confetti"></div>',
            '<div class="spring-card">',
            '<h2>新春快乐</h2>',
            '<p>愿你新学期顺顺利利，逢考必过，逢抽必欧。</p>',
            '<p>祝全班同学：平安喜乐，学业进步，金榜题名。</p>',
            '<p class="spring-tip">彩蛋持续 9 秒，再次三击可重复触发</p>',
            '</div>'
        ].join('');
        document.body.appendChild(overlay);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) hideOverlay();
        });
        return overlay;
    }

    function spawnConfetti() {
        const host = document.getElementById('spring-confetti');
        if (!host) return;
        const piece = document.createElement('span');
        piece.className = 'confetti-piece';
        const left = Math.floor(Math.random() * 100);
        const delay = (Math.random() * 0.18).toFixed(2);
        const duration = (1.8 + Math.random() * 1.6).toFixed(2);
        piece.style.left = left + '%';
        piece.style.animationDelay = delay + 's';
        piece.style.animationDuration = duration + 's';
        host.appendChild(piece);
        setTimeout(() => piece.remove(), 4300);
    }

    function showOverlay() {
        const overlay = createOverlay();
        overlay.classList.add('visible');
        if (hideTimer) clearTimeout(hideTimer);
        if (confettiTimer) clearInterval(confettiTimer);
        confettiTimer = setInterval(spawnConfetti, 140);
        hideTimer = setTimeout(hideOverlay, SHOW_MS);
    }

    function hideOverlay() {
        const overlay = document.getElementById('spring-overlay');
        if (overlay) overlay.classList.remove('visible');
        if (hideTimer) clearTimeout(hideTimer);
        if (confettiTimer) clearInterval(confettiTimer);
        hideTimer = null;
        confettiTimer = null;
    }

    function bindTrigger() {
        const target = findCopyrightEl();
        if (!target) return;
        target.addEventListener('click', () => {
            const now = Date.now();
            clickTimes.push(now);
            if (clickTimes.length > 3) clickTimes = clickTimes.slice(-3);
            if (clickTimes.length === 3 && clickTimes[2] - clickTimes[0] <= TRIGGER_WINDOW_MS) {
                clickTimes = [];
                showOverlay();
            }
        });
    }

    function init() {
        ensureCss();
        bindTrigger();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
