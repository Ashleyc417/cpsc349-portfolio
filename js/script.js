// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', function () {

    // --- Mobile Menu Functionality ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenuCloseButton = document.getElementById('mobile-menu-close-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinksForClose = document.querySelectorAll('#mobile-menu a.mobile-nav-link');

    function openMobileMenu() {
        if (mobileMenu) {
            mobileMenu.classList.remove('mobile-menu-closed');
            mobileMenu.classList.add('mobile-menu-open');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeMobileMenu() {
        if (mobileMenu) {
            mobileMenu.classList.remove('mobile-menu-open');
            mobileMenu.classList.add('mobile-menu-closed');
            document.body.style.overflow = '';
        }
    }

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', openMobileMenu);
    }
    if (mobileMenuCloseButton) {
        mobileMenuCloseButton.addEventListener('click', closeMobileMenu);
    }
    if (mobileNavLinksForClose) {
        mobileNavLinksForClose.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    // --- Footer Copyright Year ---
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // --- Active Navigation Link Highlighting ---
    const desktopNavLinks = document.querySelectorAll('header nav > div.hidden a.nav-link');
    const mobileNavLinksJS = document.querySelectorAll('#mobile-menu a.mobile-nav-link');
    const allNavLinks = [...desktopNavLinks, ...mobileNavLinksJS];
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    allNavLinks.forEach(link => {
        const linkFileName = link.getAttribute('href').split("/").pop();
        const linkPage = (linkFileName === "" || linkFileName === null) ? "index.html" : linkFileName;
        link.classList.remove('nav-link-active', 'font-bold');
        if (link.classList.contains('mobile-nav-link')) {
            link.style.color = '';
        }
        if (linkPage === currentPage) {
            link.classList.add('nav-link-active');
            if (link.classList.contains('mobile-nav-link')) {
                link.classList.add('font-bold');
            }
        }
    });

    // --- Intersection Observer for Fade-In Sections ---
    const sectionsToFade = document.querySelectorAll('.fade-in-section');
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    sectionsToFade.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Contact Form Handling with Formspree AJAX ---
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(contactForm);
            const formAction = contactForm.getAttribute('action');
            const nameInput = contactForm.querySelector('#name');
            const emailInput = contactForm.querySelector('#email');
            const messageInput = contactForm.querySelector('#message');
            let isValid = true;
            let feedbackMessage = "";

            if (!nameInput || nameInput.value.trim() === "") {
                isValid = false;
                feedbackMessage = "Please enter your name.";
            } else if (!emailInput || emailInput.value.trim() === "" || !emailInput.value.includes('@')) {
                isValid = false;
                feedbackMessage = "Please enter a valid email address.";
            } else if (!messageInput || messageInput.value.trim() === "") {
                isValid = false;
                feedbackMessage = "Please enter your message.";
            }

            if (!isValid) {
                formMessage.textContent = feedbackMessage;
                formMessage.className = 'mt-4 text-center error';
                return;
            }

            formMessage.textContent = "Sending...";
            formMessage.className = 'mt-4 text-center';

            fetch(formAction, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    formMessage.textContent = "Thank you! Your message has been sent.";
                    formMessage.className = 'mt-4 text-center success';
                    contactForm.reset();
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            formMessage.textContent = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            formMessage.textContent = "Oops! There was a problem sending your message.";
                        }
                        formMessage.className = 'mt-4 text-center error';
                    }).catch(error => {
                        formMessage.textContent = "Oops! There was a problem sending your message. (Error parsing response)";
                        formMessage.className = 'mt-4 text-center error';
                    });
                }
            }).catch(error => {
                formMessage.textContent = "Oops! There was a problem sending your message. Please try again.";
                formMessage.className = 'mt-4 text-center error';
            });
        });
    }

    // --- Interactive Card Rotation (for Leadership section) ---
    const interactiveCards = document.querySelectorAll('.interactive-card'); // This will still apply to leadership cards
    interactiveCards.forEach(card => {
        card.addEventListener('click', function() {
            // Only flip if it's not part of the new experience tabs
            if (!this.closest('.experience-tabs-container')) {
                 this.classList.toggle('is-flipped');
            }
        });
    });

    // --- Tabbed Work Experience Functionality ---
    const experienceNavButtons = document.querySelectorAll('#experience-nav .experience-tab-button');
    const experienceDetailContents = document.querySelectorAll('#experience-details-container .experience-detail-content');

    if (experienceNavButtons.length > 0 && experienceDetailContents.length > 0) {
        experienceNavButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active state from all buttons
                experienceNavButtons.forEach(btn => btn.classList.remove('active-tab'));
                // Add active state to clicked button
                this.classList.add('active-tab');

                const targetId = this.getAttribute('data-target');

                // Hide all detail content
                experienceDetailContents.forEach(content => {
                    content.style.display = 'none'; // Hide by setting display to none
                    content.classList.remove('active-detail'); // Remove active class if used for styling visibility
                });

                // Show target detail content
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.style.display = 'block'; // Show by setting display to block
                    targetContent.classList.add('active-detail'); // Add active class
                }
            });
        });

        // Optional: Ensure the first tab is active on page load
        if (experienceNavButtons[0]) {
            experienceNavButtons[0].classList.add('active-tab');
        }
        experienceDetailContents.forEach((content, index) => {
            if (index === 0) {
                content.style.display = 'block';
                content.classList.add('active-detail');
            } else {
                content.style.display = 'none';
            }
        });
    }

}); // End of DOMContentLoaded
