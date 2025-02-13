document.addEventListener("DOMContentLoaded", () => {
    function openEditModal(originalContent) {
        const modal = document.getElementById("editModal");
        modal.classList.remove("hidden");

        document.getElementById("originalContent").value = originalContent;
        document.getElementById("editcontent").value = originalContent;

        gsap.set(".modal-content", { scale: 0, opacity: 0, y: 500 });

        gsap.to(".modal-content", {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "elastic.out(0.25, 1.75)"
        });
    }

    function closeEditModal() {
        gsap.to(".modal-content", {
            scale: 0,
            opacity: 0,
            y: 500,
            duration: 0.26,
            ease: "power2.in",
            onComplete: () => {
                document.getElementById("editModal").classList.add("hidden");
            }
        });
    }

    document.getElementById("editForm").addEventListener("submit", function (e) {
        e.preventDefault();
        closeEditModal();

        setTimeout(() => {
            this.submit();
        }, 300);
    });

    document.getElementById("closeModal").addEventListener("click", closeEditModal);

    document.getElementById("editForm").addEventListener("submit", function (e) {
        closeEditModal();
    });

    function deletePost(form) {
        const postDiv = form.closest(".post");

        gsap.to(postDiv, {
            y: 20,
            z: 100,
            duration: 0.15,
            ease: "power1.inOut",
            onComplete: () => {
                gsap.to(postDiv, {
                    z: 100,
                    x: 500,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power3.inOut",
                    onComplete: () => {
                        form.submit();
                    }
                });
            }
        });
    }

    function animateNewPost(postElement) {
        gsap.set(postElement, { scale: 0.3, opacity: 0, y: -100 });
        gsap.to(postElement, {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "elastic.out(0.25, 1.25)",
            delay: 0.32
        });
    }

    function showPosts() {
        const posts = document.querySelectorAll(".post.hidden");

        posts.forEach(post => {
            post.classList.remove("hidden");
            // if (window.location.search.includes('panim=true')) {
            animateNewPost(post);
            // } else {
            //     gsap.set(post, { scale: 1, opacity: 1, y: 0 });
            // }
        });
    }

    setTimeout(showPosts, 0);

    // function gsapHeart(btn) {
    //     const heartIcon = btn.querySelector('.Heart_Icon');
    //     gsap.fromTo(
    //         heartIcon,
    //         { scale: 0.2, opacity: 0, y: 6 },
    //         {
    //             scale: 1,
    //             opacity: 1,
    //             y: 0,
    //             duration: 0.45,
    //             ease: "elastic.out(0.25, 1.25)",
    //         }
    //     );
    // }

    // function animeH(button) {
    //     const likeForm = button.closest(".like-form");
    
    //     likeForm.addEventListener("submit", function (e) {
    //         e.preventDefault(); // Prevent default form submission
    
    //         fetch(likeForm.action, {
    //             method: likeForm.method,
    //             body: new FormData(likeForm),
    //         })
    //         .then(response => response) // Wait for backend response
    //         .then(data => {
    //             // Run animation only after receiving backend response
    //             gsap.fromTo(
    //                 button.querySelector('.Heart_Icon'),
    //                 { scale: 0.2, opacity: 0, y: 6 },
    //                 {
    //                     scale: 1,
    //                     opacity: 1,
    //                     y: 0,
    //                     duration: 0.8,
    //                     ease: "elastic.out(0.25, 1.25)",
    //                     oncompl
    //                 }
    //             );
    //         })
    //         .catch(error => console.error("Error:", error));
    //     }, { once: true }); // Ensures event listener runs only once per click
    // }

    function openConfirmModal() {
        const modal = document.getElementById("ConfirmModal");
        modal.classList.remove("hidden");

        gsap.set(".confirm-modal-content", { scale: 0, opacity: 0, y: 500 });

        gsap.to(".confirm-modal-content", {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "elastic.out(0.25, 1.75)"
        });
    }

    function closeConfirmModal() {
        gsap.to(".confirm-modal-content", {
            scale: 0,
            opacity: 0,
            y: 500,
            duration: 0.26,
            ease: "power2.in",
            onComplete: () => {
                document.getElementById("ConfirmModal").classList.add("hidden");
            }
        });
    }

    document.getElementById("confirmForm").addEventListener("submit", function (e) {
        e.preventDefault();
        closeConfirmModal();

        setTimeout(() => {
            this.submit();
        }, 300);
    });

    document.getElementById("closeConfirmModal").addEventListener("click", closeConfirmModal);

    document.getElementById("confirmForm").addEventListener("submit", function (e) {
        closeConfirmModal();
    });

    window.deletePost = deletePost;
    window.openEditModal = openEditModal;
    window.openConfirmModal = openConfirmModal;
    // window.animeH = animeH;
});
