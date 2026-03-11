// ================================================================
// CyberGuard Academy — theory.js
// Used on theory.html.
// Switches between theory sections.
// ================================================================

var topicButtons = document.querySelectorAll('.topic-btn');
var topicPages = document.querySelectorAll('.topic-page');

function hideAllTopicPages() {
    for (var i = 0; i < topicPages.length; i++) {
        topicPages[i].classList.remove('active');
        topicPages[i].classList.add('hidden');
    }
}

function clearActiveTopicButtons() {
    for (var i = 0; i < topicButtons.length; i++) {
        topicButtons[i].classList.remove('active');
    }
}

function showTopic(tabButton) {
    var pageId = tabButton.getAttribute('data-tab');
    var page = document.getElementById(pageId);

    clearActiveTopicButtons();
    hideAllTopicPages();
    tabButton.classList.add('active');

    if (page) {
        page.classList.remove('hidden');
        page.classList.add('active');
    }

    trackTheoryTab(pageId);
}

for (var i = 0; i < topicButtons.length; i++) {
    (function (button) {
        button.addEventListener('click', function () {
            showTopic(button);
        });
    })(topicButtons[i]);
}
