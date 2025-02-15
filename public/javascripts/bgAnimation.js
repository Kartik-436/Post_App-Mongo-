document.addEventListener("DOMContentLoaded", () => {
    const squares = document.querySelectorAll(".square");

    squares.forEach((square) => {
        square.addEventListener("mouseenter", () => {
            gsap.to(square, {
                duration: 0.1,
                backgroundColor: "#4285F4",
                ease: "power1.inOut",
            });
        });

        square.addEventListener("mouseleave", () => {
            gsap.to(square, {
                delay: -0.35,
                duration: 1,
                backgroundColor: "#111",
                ease: "power1.inOut",
            });
        });
    });
});
