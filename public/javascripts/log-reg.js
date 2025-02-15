document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.querySelector('input[name="password"]');
    const passWarn = document.getElementById("PassWarn");

    passwordInput.addEventListener("input", function () {
        passWarn.classList.remove("hidden");
    });

    passwordInput.addEventListener("blur", function () {
        passWarn.classList.add("hidden");
    });
});
