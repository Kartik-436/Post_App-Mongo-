document.addEventListener("DOMContentLoaded", () => {
    function openEditModal(originalContent, postId) {
        const modal = document.getElementById("editModal");
        modal.classList.remove("hidden");

        document.getElementById("originalContent").value = originalContent;
        document.getElementById("editcontent").value = originalContent;
        document.getElementById("PostId").value = postId;

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
        const postId = localStorage.getItem("animateEditedPost");

        if (postId) {
            const pst = document.querySelector(`.post[data-id="${postId}"]`);

            if (pst) {
                posts.forEach(post => {
                    post.classList.remove("hidden");
                    pst.classList.add("hidden");
                    if (!(window.location.search.includes('?lanim:true'))) {
                        animateNewPost(post);
                    }
                });
            }
        }
        else {
            posts.forEach(post => {
                post.classList.remove("hidden");
                if (!(window.location.search.includes('?lanim:true'))) {
                    animateNewPost(post);
                } else {
                    gsap.set(post, { scale: 1, opacity: 1, y: 0 });
                }
            });    
        }

        const url = new URL(window.location);
        url.searchParams.delete('lanim:true');
        window.history.replaceState({}, document.title, url);
    }

    setTimeout(showPosts, 1);

    function gsapHeart(btn) {
        
        const likeF = btn.closest(".like-form");

        if (!likeF) return;

        localStorage.setItem("animateHeart", btn.dataset.id || "true");

        likeF.submit();
    }

    window.addEventListener("DOMContentLoaded", () => {
        const postId = localStorage.getItem("animateHeart");

        if (postId) {
            const heartIcon = document.querySelector(`.Heart_Icon[data-id="${postId}"]`);

            if (heartIcon) {
                let tl = gsap.timeline();
                tl.fromTo(
                    heartIcon,
                    { scale: 0.2, opacity: 0, y: 6 },
                    {
                        scale: 1,
                        opacity: 1,
                        y: 0,
                        duration: 0.55,
                        ease: "elastic.out(0.25, 1.25)",
                        delay: 0.066,
                    }
                );
            }
            localStorage.removeItem("animateHeart");
        }
    });

    function editAnimation(btn) {
        const editF = btn.closest("#editForm");
        let inp = document.getElementById("PostId")

        if (!editF) return;

        localStorage.setItem("animateEditedPost", inp.value || "true");

        editF.submit();
    }

    window.addEventListener("DOMContentLoaded", () => {
        const postId = localStorage.getItem("animateEditedPost");

        if (postId) {
            const post = document.querySelector(`.post[data-id="${postId}"]`);

            if (post) {
                let tl = gsap.timeline();

                tl.fromTo(
                    post,
                    { scale: 0.3, opacity: 0, y: -100 },
                    {
                        scale: 1,
                        opacity: 1,
                        y: 0,
                        duration: 1.2,
                        ease: "elastic.out(0.25, 1.25)",
                    }
                );
            }
            localStorage.removeItem("animateEditedPost");
        }
    });

    window.deletePost = deletePost;
    window.openEditModal = openEditModal;
    window.gsapHeart = gsapHeart;
    window.editAnimation = editAnimation;
});
