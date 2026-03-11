// ================================================================
// CyberGuard Academy — intro.js
// Used on intro.html.
// Plays the intro video, then sends the user to the home page.
// ================================================================

function goHome() {
    window.location.href = 'home.html';
}

function goToLogin() {
    window.location.href = 'index.html';
}

function checkLogin() {
    try {
        var savedUser = sessionStorage.getItem('cg_current');

        if (!savedUser || savedUser === 'null') {
            goToLogin();
            return;
        }

        var user = JSON.parse(savedUser);
        if (!user) {
            goToLogin();
        }
    } catch (error) {
        goToLogin();
    }
}

checkLogin();

var introVideo = document.getElementById('intro-video');

if (introVideo) {
    introVideo.addEventListener('ended', goHome);
    introVideo.addEventListener('error', goHome);
}
