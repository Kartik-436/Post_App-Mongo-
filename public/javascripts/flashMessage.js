document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        let flashMessages = document.querySelectorAll('.flash-message');

        flashMessages.forEach(flashMessage => {
            if (flashMessage) {
                gsap.to(flashMessage, {
                    opacity: 0,
                    scale: 0.3,
                    x: 120,
                    duration: 0.5,
                    ease: "elastic.out(0.5, 1.25)",
                    onComplete: () => {
                        flashMessage.classList.add("hidden")
                        flashMessage.remove();
                    }
                });
            }
        });
    }, 3500);

    document.querySelectorAll('.flash-message').forEach(flashMessage => {
        if (flashMessage) {
            flashMessage.classList.remove("hidden")
            gsap.set(flashMessage, { scale: 0.3, opacity: 0, x: 120 });

            gsap.to(flashMessage, {
                scale: 1,
                opacity: 1,
                x: 0,
                duration: 0.6,
                ease: "elastic.out(0.5, 1)"
            });
        }
    });
});
