// ================================================================
// CyberGuard Academy — home.js
// Used on home.html.
// Animates the stat numbers when the hero section appears.
// ================================================================

function animateOneCounter(counter) {
    var target = parseInt(counter.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    var current = 0;
    var step = Math.ceil(target / 30);
    var timer = setInterval(function () {
        current += step;

        if (current > target) {
            current = target;
        }

        counter.textContent = current;

        if (current >= target) {
            clearInterval(timer);
        }
    }, 40);
}

function animateCounters() {
    var counters = document.querySelectorAll('.stat-number');

    for (var i = 0; i < counters.length; i++) {
        animateOneCounter(counters[i]);
    }
}

var heroBox = document.querySelector('.hero-box');

if (heroBox) {
    var hasAnimated = false;
    var observer = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting || hasAnimated) return;

        hasAnimated = true;
        animateCounters();
    }, { threshold: 0.3 });

    observer.observe(heroBox);
}
