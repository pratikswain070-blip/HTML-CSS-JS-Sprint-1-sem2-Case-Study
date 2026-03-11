// ================================================================
// CyberGuard Academy — auth.js
// Used on the login page.
// Keeps the forms simple: switch tabs, check inputs, login, register.
// ================================================================

function setAuthTab(tabName) {
    var loginBox = document.getElementById('login-box');
    var signupBox = document.getElementById('signup-box');
    var loginTab = document.getElementById('login-tab');
    var signupTab = document.getElementById('signup-tab');
    var showLogin = tabName === 'login';

    if (!loginBox || !signupBox || !loginTab || !signupTab) return;

    loginBox.classList.toggle('hidden', !showLogin);
    signupBox.classList.toggle('hidden', showLogin);
    loginTab.classList.toggle('active', showLogin);
    signupTab.classList.toggle('active', !showLogin);
}

window.showAuthTab = function (tabName) {
    setAuthTab(tabName);
};

window.togglePwd = function (inputId, button) {
    var input = document.getElementById(inputId);
    if (!input) return;

    if (input.type === 'password') {
        input.type = 'text';
        button.style.color = 'var(--accent)';
        return;
    }

    input.type = 'password';
    button.style.color = '';
};

function clearText(ids) {
    for (var i = 0; i < ids.length; i++) {
        var element = document.getElementById(ids[i]);
        if (element) element.textContent = '';
    }
}

function getPasswordLevel(password) {
    var score = 0;

    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    var levels = [
        { width: '0%', color: 'transparent', label: '' },
        { width: '25%', color: 'var(--danger)', label: 'Weak' },
        { width: '50%', color: 'var(--warning)', label: 'Fair' },
        { width: '75%', color: '#a78bfa', label: 'Good' },
        { width: '90%', color: 'var(--success)', label: 'Strong' },
        { width: '100%', color: 'var(--success)', label: 'Very Strong' }
    ];

    return levels[Math.min(score, 5)];
}

var passwordInput = document.getElementById('reg-password');
if (passwordInput) {
    passwordInput.addEventListener('input', function () {
        var fill = document.getElementById('pass-fill');
        var text = document.getElementById('pass-text');
        var level = getPasswordLevel(passwordInput.value);

        if (!fill || !text) return;

        fill.style.width = passwordInput.value ? level.width : '0%';
        fill.style.background = level.color;
        text.textContent = level.label;
        text.style.color = level.color;
    });
}

function findMatchingUser(email, password) {
    var users = getUsers();

    for (var i = 0; i < users.length; i++) {
        if (users[i].email === email && users[i].password === password) {
            return users[i];
        }
    }

    return null;
}

function isEmailAlreadyUsed(email) {
    var users = getUsers();

    for (var i = 0; i < users.length; i++) {
        if (users[i].email === email) {
            return true;
        }
    }

    return false;
}

function finishLogin(user, messageId, delay) {
    var message = document.getElementById(messageId);

    saveCurrentUser(user);
    if (message) {
        message.textContent = 'Signing you in...';
        message.style.color = 'var(--success)';
    }

    setTimeout(function () {
        loadProfileDashboard(user);
        setTimeout(function () {
            window.location.href = 'intro.html';
        }, 400);
    }, delay);
}

window.handleLogin = function (event) {
    event.preventDefault();

    var emailInput = document.getElementById('login-email');
    var passwordInput = document.getElementById('login-password');
    var loginMessage = document.getElementById('login-msg');
    var emailError = document.getElementById('login-email-err');
    var passwordError = document.getElementById('login-pwd-err');
    var email = emailInput.value.trim().toLowerCase();
    var password = passwordInput.value;

    clearText(['login-email-err', 'login-pwd-err', 'login-msg']);

    if (!email) {
        emailError.textContent = 'Email is required.';
        return;
    }

    if (!password) {
        passwordError.textContent = 'Password is required.';
        return;
    }

    var matchedUser = findMatchingUser(email, password);
    if (!matchedUser) {
        loginMessage.textContent = 'Incorrect email or password.';
        loginMessage.style.color = 'var(--danger)';
        return;
    }

    finishLogin(matchedUser, 'login-msg', 800);
};

window.handleRegister = function (event) {
    event.preventDefault();

    var nameInput = document.getElementById('reg-name');
    var emailInput = document.getElementById('reg-email');
    var passwordInput = document.getElementById('reg-password');
    var confirmInput = document.getElementById('reg-confirm');
    var name = nameInput.value.trim();
    var email = emailInput.value.trim().toLowerCase();
    var password = passwordInput.value;
    var confirmPassword = confirmInput.value;
    var isValid = true;

    clearText(['reg-name-err', 'reg-email-err', 'reg-pwd-err', 'reg-confirm-err', 'signup-msg']);

    if (!name || name.length < 2) {
        document.getElementById('reg-name-err').textContent = 'Please enter your full name.';
        isValid = false;
    }

    if (!email || email.indexOf('@') === -1) {
        document.getElementById('reg-email-err').textContent = 'Enter a valid email.';
        isValid = false;
    }

    if (password.length < 8) {
        document.getElementById('reg-pwd-err').textContent = 'Password must be at least 8 characters.';
        isValid = false;
    }

    if (password !== confirmPassword) {
        document.getElementById('reg-confirm-err').textContent = 'Passwords do not match.';
        isValid = false;
    }

    if (!isValid) return;

    if (isEmailAlreadyUsed(email)) {
        document.getElementById('reg-email-err').textContent = 'This email is already registered.';
        return;
    }

    var users = getUsers();
    var newUser = {
        name: name,
        email: email,
        password: password
    };

    users.push(newUser);
    saveUsers(users);

    var signupMessage = document.getElementById('signup-msg');
    signupMessage.textContent = 'Account created! Signing you in...';
    signupMessage.style.color = 'var(--success)';

    setTimeout(function () {
        loadProfileDashboard(newUser);
        saveCurrentUser(newUser);
        setTimeout(function () {
            window.location.href = 'intro.html';
        }, 400);
    }, 900);
};

window.handleLogout = function () {
    sessionStorage.removeItem('cg_current');
    window.location.href = 'index.html';
};
