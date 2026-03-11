// ================================================================
// CyberGuard Academy — quiz.js
// Used on quiz.html.
// Checks answers, shows feedback, and reveals the certificate flow.
// ================================================================

var quizForm = document.getElementById('quiz-form');

if (quizForm) {
    var quizMessage = document.getElementById('quiz-msg');
    var quizBox = document.getElementById('quiz-box');
    var certBox = document.getElementById('cert-box');
    var videoBox = document.getElementById('cert-video-box');
    var videoPlayer = document.getElementById('cert-video-player');
    var correctAnswers = {
        q1: 'b', q2: 'a', q3: 'c', q4: 'b', q5: 'b',
        q6: 'a', q7: 'c', q8: 'b', q9: 'c', q10: 'c'
    };

    function showCertificate() {
        if (videoPlayer) {
            videoPlayer.pause();
            videoPlayer.currentTime = 0;
        }

        if (videoBox) videoBox.classList.remove('active');
        if (quizBox) quizBox.classList.add('hidden');
        if (certBox) certBox.classList.remove('hidden');

        document.getElementById('cert-date').textContent = new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    function countQuizResult(formData) {
        var score = 0;
        var answered = 0;

        for (var key in correctAnswers) {
            if (!formData.has(key)) continue;

            answered += 1;
            if (formData.get(key) === correctAnswers[key]) {
                score += 1;
            }
        }

        return {
            score: score,
            answered: answered
        };
    }

    function highlightWrongAnswers(formData) {
        for (var key in correctAnswers) {
            var selectedValue = formData.get(key);
            if (!selectedValue || selectedValue === correctAnswers[key]) continue;

            var wrongInput = quizForm.querySelector('input[name="' + key + '"][value="' + selectedValue + '"]');
            if (wrongInput) {
                wrongInput.closest('.radio-label').style.color = 'var(--danger)';
            }
        }
    }

    window.skipCertVideo = function () {
        showCertificate();
    };

    if (videoPlayer) {
        videoPlayer.addEventListener('ended', function () {
            showCertificate();
        });
    }

    quizForm.addEventListener('submit', function (event) {
        event.preventDefault();

        var formData = new FormData(quizForm);
        var result = countQuizResult(formData);

        if (result.answered < 10) {
            quizMessage.innerHTML = '<span style="color:var(--danger)">Please answer all 10 questions before submitting.</span>';
            return;
        }

        trackQuiz(result.score, 10);

        if (result.score === 10) {
            quizMessage.innerHTML = '<span style="color:var(--success)">Perfect Score — 10/10! Loading your reward...</span>';

            setTimeout(function () {
                quizMessage.textContent = '';

                if (videoBox && videoPlayer) {
                    videoBox.classList.add('active');
                    videoPlayer.play().catch(function () {
                        showCertificate();
                    });
                    return;
                }

                showCertificate();
            }, 1200);

            return;
        }

        quizMessage.innerHTML = '<span style="color:var(--danger)">Score: ' + result.score + '/10. You need 100% to earn the certificate.<br>Review the Theory section and try again!</span>';
        highlightWrongAnswers(formData);
    });
}
