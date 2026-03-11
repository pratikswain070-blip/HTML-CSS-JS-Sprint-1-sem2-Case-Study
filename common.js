// ================================================================
// CyberGuard Academy — common.js
// Shared on most pages.
// Keeps the nav active, saves progress, and restores the user session.
// ================================================================

// Add a small shadow to the nav after the user scrolls.
var mainNav = document.getElementById('main-nav');

function updateNavOnScroll() {
    if (!mainNav) return;

    if (window.scrollY > 20) {
        mainNav.classList.add('scrolled');
    } else {
        mainNav.classList.remove('scrolled');
    }
}

if (mainNav) {
    window.addEventListener('scroll', updateNavOnScroll);
}

// Read a saved array from sessionStorage.
function getStoredArray(key) {
    try {
        return JSON.parse(sessionStorage.getItem(key) || '[]');
    } catch (error) {
        return [];
    }
}

function saveStoredArray(key, items) {
    sessionStorage.setItem(key, JSON.stringify(items));
}

function addUniqueItem(key, value) {
    var items = getStoredArray(key);

    if (items.indexOf(value) === -1) {
        items.push(value);
        saveStoredArray(key, items);
    }
}

function trackTheoryTab(tabId) {
    addUniqueItem('cg_theory_visited', tabId);
}

function trackLab(labId) {
    addUniqueItem('cg_labs_done', labId);
}

function trackQuiz(score, total) {
    sessionStorage.setItem('cg_quiz_score', score);
    sessionStorage.setItem('cg_quiz_total', total);

    if (score === total) {
        sessionStorage.setItem('cg_cert_earned', 'true');
    }
}

function setBar(fillId, rateId, textId, percent, message) {
    var fill = document.getElementById(fillId);
    var rate = document.getElementById(rateId);
    var text = document.getElementById(textId);

    if (fill) fill.style.width = percent + '%';
    if (rate) rate.textContent = percent + '%';
    if (text) text.textContent = message;
}

function getPercent(done, total) {
    return Math.round((done / total) * 100);
}

function loadProgressTracker() {
    var theoryVisited = getStoredArray('cg_theory_visited');
    var finishedLabs = getStoredArray('cg_labs_done');
    var quizScore = parseInt(sessionStorage.getItem('cg_quiz_score'), 10) || 0;
    var quizTotal = parseInt(sessionStorage.getItem('cg_quiz_total'), 10) || 10;
    var hasCertificate = sessionStorage.getItem('cg_cert_earned') === 'true';
    var quizWasAttempted = sessionStorage.getItem('cg_quiz_score') !== null;

    var theoryPercent = getPercent(theoryVisited.length, 3);
    var labsPercent = getPercent(finishedLabs.length, 6);
    var quizPercent = quizWasAttempted ? getPercent(quizScore, quizTotal) : 0;
    var certificatePercent = hasCertificate ? 100 : 0;

    setBar('theory-fill', 'theory-rate', 'theory-text', theoryPercent, theoryVisited.length + ' / 3 tabs visited');
    setBar('labs-fill', 'labs-rate', 'labs-text', labsPercent, finishedLabs.length + ' / 6 labs completed');
    setBar('quiz-fill', 'quiz-rate', 'quiz-text', quizPercent, quizWasAttempted ? 'Scored ' + quizScore + ' / ' + quizTotal : 'Not attempted yet');
    setBar('cert-fill', 'cert-rate', 'cert-text', certificatePercent, hasCertificate ? 'Certificate earned!' : 'Complete the quiz with 10/10 to earn it');

    var labsCount = document.getElementById('labs-count');
    var certCount = document.getElementById('cert-count');
    var totalRate = document.getElementById('total-rate');
    var overallPercent = Math.round((theoryPercent + labsPercent + quizPercent + certificatePercent) / 4);

    if (labsCount) labsCount.textContent = finishedLabs.length;
    if (certCount) certCount.textContent = hasCertificate ? 1 : 0;
    if (totalRate) totalRate.textContent = overallPercent + '%';
}

function getUsers() {
    try {
        return JSON.parse(sessionStorage.getItem('cg_users') || '[]');
    } catch (error) {
        return [];
    }
}

function saveUsers(users) {
    sessionStorage.setItem('cg_users', JSON.stringify(users));
}

function getCurrentUser() {
    try {
        return JSON.parse(sessionStorage.getItem('cg_current') || 'null');
    } catch (error) {
        return null;
    }
}

function saveCurrentUser(user) {
    sessionStorage.setItem('cg_current', JSON.stringify(user));
}

function getNameParts(fullName) {
    return fullName.trim().split(/\s+/);
}

function getUserInitials(fullName) {
    var nameParts = getNameParts(fullName);

    if (nameParts.length > 1) {
        return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    }

    return nameParts[0].substring(0, 2).toUpperCase();
}

function loadProfileDashboard(user) {
    var authBox = document.getElementById('auth-box');
    var profileBox = document.getElementById('profile-box');
    var userName = document.getElementById('user-name');
    var userEmail = document.getElementById('user-email');
    var avatarText = document.getElementById('avatar-text');
    var navUserText = document.getElementById('nav-user-text');
    var nameParts = getNameParts(user.name);

    if (!authBox || !profileBox) return;

    authBox.classList.add('hidden');
    profileBox.classList.remove('hidden');

    if (userName) userName.textContent = user.name;
    if (userEmail) userEmail.textContent = user.email;
    if (avatarText) avatarText.textContent = getUserInitials(user.name);
    if (navUserText) navUserText.textContent = nameParts[0];

    document.body.classList.remove('locked');
    loadProgressTracker();
}

(function restoreSession() {
    var currentUser = getCurrentUser();
    var isLoginPage = document.getElementById('auth-box') !== null;

    if (isLoginPage) {
        if (currentUser) {
            document.body.classList.remove('locked');
            loadProfileDashboard(currentUser);
        }
        return;
    }

    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    var navUserText = document.getElementById('nav-user-text');
    if (navUserText) {
        navUserText.textContent = getNameParts(currentUser.name)[0];
    }
})();
