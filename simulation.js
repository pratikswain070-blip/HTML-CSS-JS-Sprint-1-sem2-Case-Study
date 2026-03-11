// ================================================================
// CyberGuard Academy — simulation.js
// Used on simulation.html.
// Handles the lab tabs, terminal open/close, and all mini demos.
// ================================================================

var labButtons = document.querySelectorAll('.lab-btn');
var labPanels = document.querySelectorAll('.lab-panel');

function hideAllLabs() {
    for (var i = 0; i < labPanels.length; i++) {
        labPanels[i].classList.remove('active');
        labPanels[i].classList.add('hidden');
    }
}

function clearActiveLabButtons() {
    for (var i = 0; i < labButtons.length; i++) {
        labButtons[i].classList.remove('active');
    }
}

function openLab(labButton) {
    var labId = labButton.getAttribute('data-lab');
    var labPanel = document.getElementById(labId);

    clearActiveLabButtons();
    hideAllLabs();
    labButton.classList.add('active');

    if (labPanel) {
        labPanel.classList.remove('hidden');
        labPanel.classList.add('active');
    }

    trackLab(labId);
}

for (var i = 0; i < labButtons.length; i++) {
    (function (button) {
        button.addEventListener('click', function () {
            openLab(button);
        });
    })(labButtons[i]);
}

var openLabButton = document.getElementById('open-lab-btn');
var closeConsoleButton = document.getElementById('close-console-btn');
var labConsole = document.getElementById('lab-console');
var launchBox = document.getElementById('launch-box');

function showLabConsole() {
    if (!labConsole || !launchBox) return;
    labConsole.classList.remove('hidden');
    launchBox.classList.add('hidden');
}

function hideLabConsole() {
    if (!labConsole || !launchBox) return;
    labConsole.classList.add('hidden');
    launchBox.classList.remove('hidden');
}

if (openLabButton) {
    openLabButton.addEventListener('click', showLabConsole);
}

if (closeConsoleButton) {
    closeConsoleButton.addEventListener('click', hideLabConsole);
}

function getPasswordStrengthScore(password) {
    var score = password.length * 10;

    if (/[a-z]/.test(password)) score += 10;
    if (/[A-Z]/.test(password)) score += 20;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^a-zA-Z0-9]/.test(password)) score += 30;

    var commonPasswords = ['password', '123456', 'qwerty', 'letmein', 'iloveyou', 'admin'];
    var lowerPassword = password.toLowerCase();

    for (var i = 0; i < commonPasswords.length; i++) {
        if (lowerPassword.indexOf(commonPasswords[i]) !== -1) {
            return 30;
        }
    }

    return score;
}

var crackButton = document.getElementById('crack-btn');
if (crackButton) {
    var passwordInput = document.getElementById('pwd-input');
    var crackResult = document.getElementById('crack-result');

    crackButton.addEventListener('click', function () {
        var password = passwordInput.value;
        if (!password) {
            crackResult.textContent = '> Error: No password specified.';
            crackResult.style.color = 'var(--danger)';
            return;
        }

        crackButton.disabled = true;
        crackResult.style.color = 'var(--accent)';
        crackResult.textContent =
            '> Analyzing target string (length: ' + password.length + ' chars)...\n' +
            '> Calculating entropy...\n' +
            '> Running through brute-force model...\n';

        var score = getPasswordStrengthScore(password);

        setTimeout(function () {
            if (score < 50) {
                crackResult.textContent += '\n[RESULT] CRACKED INSTANTLY (< 1 second)\nReason: Too short or too common.\nFix: Use symbols, mixed case and aim for 12+ characters.';
                crackResult.style.color = 'var(--danger)';
            } else if (score < 85) {
                crackResult.textContent += '\n[RESULT] VULNERABLE — Cracked in 2-72 hours by GPU cluster.\nReason: Lacks sufficient length or complexity.\nFix: Add symbols or use a passphrase (e.g., "BluePigeonRocket-47!").';
                crackResult.style.color = 'var(--warning)';
            } else if (score < 130) {
                crackResult.textContent += '\n[RESULT] STRONG — Estimated crack time: 3 centuries.\nReason: Good entropy balance.\nTip: A passphrase of 4+ random words is even more memorable.';
                crackResult.style.color = 'var(--success)';
            } else {
                crackResult.textContent += '\n[RESULT] FORTRESS — Estimated crack time: > 4 million years.\nReason: Excellent entropy. High length + full character set.';
                crackResult.style.color = 'var(--success)';
            }

            crackButton.disabled = false;
        }, 1800);
    });
}

window.checkPhishing = function (markedAsPhishing) {
    var result = document.getElementById('phish-result');
    if (!result) return;

    if (markedAsPhishing) {
        result.textContent =
            '[CORRECT]: This is a phishing email.\n\n' +
            'Red Flags Identified:\n' +
            '  - Sender domain: "netflix-update-billing.com" is NOT netflix.com\n' +
            '  - Creates artificial urgency: "permanently suspended"\n' +
            '  - Generic greeting: "Dear Valued Customer"\n' +
            '  - Suspicious action link with no visible URL\n\n' +
            'Lesson: Always verify the sender domain and never click links in urgent emails.';
        result.style.color = 'var(--success)';
        return;
    }

    result.textContent =
        '[INCORRECT]: You were phished.\n\n' +
        'This email contained multiple red flags:\n' +
        '  1. The sender domain was a deceptive fake (not netflix.com)\n' +
        '  2. It engineered fear with "permanently suspended"\n' +
        '  3. It pressured you to click without giving you time to think.\n\n' +
        'Lesson: Slow down. Check the sender address carefully.';
    result.style.color = 'var(--danger)';
};

function getUrlRisks(url) {
    var risks = [];

    if (url.indexOf('https://') !== 0) {
        risks.push('Missing HTTPS: Connection is not encrypted. Data can be intercepted.');
    }

    if (/[a-z]0[a-z]/.test(url)) {
        risks.push('Lookalike character detected (e.g., "0" used instead of "o" to spoof a brand).');
    }

    if (url.indexOf('-login') !== -1 || url.indexOf('-verify') !== -1 || url.indexOf('-secure') !== -1 || url.indexOf('-update') !== -1) {
        risks.push('Suspicious keyword in domain (common in phishing URLs to appear legitimate).');
    }

    var dotCount = (url.match(/\./g) || []).length;
    if (dotCount > 3) {
        risks.push('Excessive subdomains — may be hiding the real domain.');
    }

    return risks;
}

var scanButton = document.getElementById('scan-btn');
if (scanButton) {
    var urlInput = document.getElementById('url-input');
    var urlResult = document.getElementById('url-result');

    scanButton.addEventListener('click', function () {
        var url = urlInput.value.trim().toLowerCase();
        if (!url) {
            urlResult.textContent = '> Error: No URL provided.';
            return;
        }

        urlResult.style.color = 'var(--accent)';
        urlResult.textContent = '> Scanning: ' + url + '\n> Running security checks...\n';
        scanButton.disabled = true;

        setTimeout(function () {
            var risks = getUrlRisks(url);

            if (risks.length === 0) {
                urlResult.textContent += '\n[SCAN RESULT: CLEAR] No obvious red flags detected.\nTip: HTTPS is present and no deceptive patterns found. Still verify the domain manually.';
                urlResult.style.color = 'var(--success)';
            } else {
                urlResult.textContent += '\n[SCAN RESULT: SUSPICIOUS] Risks Found:\n  - ' + risks.join('\n  - ');
                urlResult.style.color = 'var(--danger)';
            }

            scanButton.disabled = false;
        }, 1200);
    });
}

var socialCorrect = 0;
var socialClicked = 0;
var socialRiskCount = 3;
var socialItemCount = 4;

window.checkSocial = function (isRisk, clickedButton) {
    var result = document.getElementById('social-result');
    if (!result || clickedButton.disabled) return;

    clickedButton.disabled = true;
    socialClicked += 1;

    if (isRisk) {
        socialCorrect += 1;
        clickedButton.style.outline = '2px solid var(--danger)';
        result.style.color = 'var(--success)';
        result.textContent = '[CORRECT] — Oversharing Risk!\nScore: ' + socialCorrect + ' / ' + socialRiskCount + ' risks identified.';
    } else {
        clickedButton.style.outline = '2px solid var(--success)';
        result.style.color = 'var(--warning)';
        result.textContent = '[Not a risk] — A pet\'s name is generally harmless to share.\nScore: ' + socialCorrect + ' / ' + socialRiskCount + ' risks identified.';
    }

    if (socialClicked !== socialItemCount) return;

    result.textContent += '\n\n--- AUDIT COMPLETE ---\n';

    if (socialCorrect === socialRiskCount) {
        result.textContent += 'You identified all ' + socialRiskCount + ' oversharing risks!\n';
        result.style.color = 'var(--success)';
    } else {
        result.textContent += 'You found ' + socialCorrect + ' out of ' + socialRiskCount + ' risks.\n';
        result.style.color = 'var(--warning)';
    }

    result.textContent +=
        '\nRisks in this post:\n' +
        '  - Address: Tells criminals your home is empty\n' +
        '  - Phone number: Used for smishing/vishing attacks\n' +
        '  - Boarding pass: Can be scanned for booking details\n\n' +
        'Rule: Never post PII (Personally Identifiable Information) publicly.';
};

window.resetSocialAudit = function () {
    socialCorrect = 0;
    socialClicked = 0;

    var result = document.getElementById('social-result');
    var postTags = document.querySelectorAll('#social-lab .post-tag');

    if (result) result.textContent = '';

    for (var i = 0; i < postTags.length; i++) {
        postTags[i].disabled = false;
        postTags[i].style.outline = '';
    }
};

function isSqlInjection(value) {
    return value.indexOf("' OR 1=1") !== -1 ||
        value.indexOf("' OR '1'='1") !== -1 ||
        value.indexOf("'--") !== -1;
}

var loginButton = document.getElementById('login-btn');
if (loginButton) {
    var userInput = document.getElementById('user-input');
    var passInput = document.getElementById('pass-input');
    var loginResult = document.getElementById('login-result');

    loginButton.addEventListener('click', function () {
        var username = userInput.value;
        var password = passInput.value;

        if (isSqlInjection(username) || isSqlInjection(password)) {
            loginResult.style.color = 'var(--danger)';
            loginResult.textContent =
                '> Executing: SELECT * FROM users WHERE username=\'' + username + '\' AND password=\'' + password + '\'\n' +
                '> [!] OR clause short-circuits the AND condition.\n' +
                '> [!] 1=1 evaluates to TRUE — query bypassed.\n' +
                '> [!] -- comments out the remaining SQL.\n' +
                '> ==========================================\n' +
                '> LOGIN BYPASS SUCCESSFUL — Session elevated to ADMIN\n' +
                '> ==========================================\n' +
                '> LESSON: Use Prepared Statements / Parameterized Queries.\n' +
                '> NEVER concatenate user input into database queries.';
            return;
        }

        if (username === 'admin' && password === 'secure123') {
            loginResult.style.color = 'var(--success)';
            loginResult.textContent =
                '> Query: SELECT * FROM users WHERE username=\'admin\' AND password=\'secure123\'\n' +
                '> Login Successful. Welcome, Admin.';
            return;
        }

        loginResult.style.color = '#6b7280';
        loginResult.textContent =
            '> Query: SELECT * FROM users WHERE username=\'' + username + '\' AND password=\'' + password + '\'\n' +
            '> [ERROR] Invalid credentials. Access denied.\n\n' +
            'Hint: Try entering \' OR 1=1 -- in the password field.';
    });
}

var attackButton = document.getElementById('attack-btn');
if (attackButton) {
    var otpResult = document.getElementById('otp-result');
    var otpPrompt = document.getElementById('otp-prompt');
    var otpInput = document.getElementById('otp-input');
    var verifyButton = document.getElementById('verify-btn');
    var otpText = document.getElementById('otp-text');
    var currentCode = '';

    attackButton.addEventListener('click', function () {
        otpResult.style.color = 'var(--danger)';
        otpResult.textContent =
            '> Attacker attempting login with stolen credentials...\n' +
            '> Username: john.doe@email.com\n' +
            '> Password: MySecret123\n' +
            '> ';

        setTimeout(function () {
            otpResult.textContent += 'Password ACCEPTED.\n> Attempting dashboard access...\n> ';

            setTimeout(function () {
                currentCode = Math.floor(100000 + Math.random() * 900000).toString();
                otpResult.textContent += '[BLOCKED] Second factor required. Sending OTP to registered device...\n';

                if (otpText) {
                    otpText.textContent = 'A 6-digit code has been sent to your phone. (For demo, your code is: ' + currentCode + ')';
                }

                otpPrompt.classList.remove('hidden');
                attackButton.disabled = true;
            }, 1000);
        }, 1500);
    });

    if (verifyButton) {
        verifyButton.addEventListener('click', function () {
            if (otpInput.value.trim() !== currentCode) {
                otpInput.style.borderColor = 'var(--danger)';
                setTimeout(function () {
                    otpInput.style.borderColor = '';
                }, 1000);
                return;
            }

            otpResult.textContent +=
                '\n> [SUCCESS] 2FA Verified. Account Protected!\n' +
                '> The attacker was stopped even though they had your password.\n' +
                '> Without your physical phone, they cannot generate this code.\n' +
                '> This is why 2FA is critical for account security.';
            otpResult.style.color = 'var(--success)';
            otpPrompt.classList.add('hidden');
            attackButton.disabled = false;
            otpInput.value = '';
        });
    }
}
