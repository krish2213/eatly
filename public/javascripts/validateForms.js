(function () {
    'use strict'

    const forms = document.querySelectorAll('.validated-form')

    Array.from(forms).forEach(function (form) {
        form.addEventListener('submit', function (event) {
            const username = form.querySelector('input[name="username"]');
            const usernamePattern = /^[A-Za-z0-9_]+$/;
            if (username && !usernamePattern.test(username.value)) {
                username.setCustomValidity('Username can only contain letters, numbers, and underscores.');
            } 
            else{
                username.setCustomValidity('');
            }
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})();
