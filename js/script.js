// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', function () {

    // --- Mobile Menu Functionality ---
    const mobileMenuButton = document.getElementById('mobile-menu-button'); // The hamburger icon button
    const mobileMenuCloseButton = document.getElementById('mobile-menu-close-button'); // The 'X' button inside the mobile menu
    const mobileMenu = document.getElementById('mobile-menu'); // The mobile menu itself
    const mobileNavLinksForClose = document.querySelectorAll('#mobile-menu a.mobile-nav-link'); // All navigation links within the mobile menu

    // Function to open the mobile menu
    function openMobileMenu() {
        if (mobileMenu) {
            console.log("Opening mobile menu");
            if (mobileMenu.classList.contains('mobile-menu-closed')) {
                mobileMenu.classList.remove('mobile-menu-closed'); // Remove the closed class if it exists
            }
            mobileMenu.classList.add('mobile-menu-open');   // Class that shows the menu
            document.body.style.overflow = 'hidden'; // Prevent scrolling of the page when menu is open
        }
    }

    // Function to close the mobile menu
    function closeMobileMenu() {
        if (mobileMenu) {
            console.log("Closing mobile menu");
            mobileMenu.classList.remove('mobile-menu-open');
            mobileMenu.classList.add('mobile-menu-closed');
            document.body.style.overflow = ''; // Restore scrolling of the page
        }
    }

    // Event listener for the mobile menu open button (hamburger)
    if (mobileMenuButton) {
        console.log("Attached mobile menu open button");
        mobileMenuButton.addEventListener('click', openMobileMenu);
    }

    // Event listener for the mobile menu close button (the 'X')
    if (mobileMenuCloseButton) {
        console.log("Attached mobile menu close button");
        mobileMenuCloseButton.addEventListener('click', closeMobileMenu);
    }

    // Event listeners for each link in the mobile menu
    // This ensures the menu closes when a user taps on a navigation link
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
            // Reset specific mobile active styles if any were applied directly by JS,
            // though CSS should primarily handle active states.
            // Example: link.style.color = ''; // Or remove a specific class
        }
        if (linkPage === currentPage) {
            link.classList.add('nav-link-active');
            if (link.classList.contains('mobile-nav-link')) {
                link.classList.add('font-bold'); // Example: make active mobile link bold
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

    // --- Contact Form Handling for Discord Webhook via Serverless Function ---
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevent default HTML form submission

            const nameInput = contactForm.querySelector('#name');
            const emailInput = contactForm.querySelector('#email');
            const subjectInput = contactForm.querySelector('#subject');
            const messageInput = contactForm.querySelector('#message');

            // Basic validation
            if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
                formMessage.textContent = "Please fill out all required fields (Name, Email, Message).";
                formMessage.className = 'mt-4 text-center error'; // Ensure 'error' class is styled in CSS
                return;
            }
            if (!emailInput.value.includes('@')) { // Simple email format check
                formMessage.textContent = "Please enter a valid email address.";
                formMessage.className = 'mt-4 text-center error';
                return;
            }

            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                subject: subjectInput.value.trim() || "New Portfolio Contact", // Default subject if empty
                message: messageInput.value.trim()
            };

            formMessage.textContent = "Opening your email client...";
            setTimeout(() => {
                formMessage.textContent = ""; // Clear message after 1 second
            }, 2000)
            formMessage.className = 'mt-4 text-center'; // Neutral message styling

            const subject = encodeURIComponent(formData.subject);
            const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`);

            window.location.href = `mailto:${formData.email}?subject=${subject}&body=${body}`;
        });
    }

    // --- Interactive Card Rotation (for Leadership section) ---
    const interactiveCards = document.querySelectorAll('.interactive-card');
    interactiveCards.forEach(card => {
        card.addEventListener('click', function() {
            if (!this.closest('.experience-tabs-container')) {
                 this.classList.toggle('is-flipped');
            }
        });
    });

    // --- Tabbed Work Experience Functionality (Hover) ---
    const experienceNavButtons = document.querySelectorAll('#experience-nav .experience-tab-button');
    const experienceDetailContents = document.querySelectorAll('#experience-details-container .experience-detail-content');
    // let activeExperienceTab = null; // Not strictly needed if we always reset

    function showExperienceDetail(targetId) {
        experienceDetailContents.forEach(content => {
            content.style.display = 'none';
            content.classList.remove('active-detail');
        });
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
            targetContent.style.display = 'block';
            targetContent.classList.add('active-detail');
            // activeExperienceTab = targetContent; // Not strictly needed
        }
    }

    if (experienceNavButtons.length > 0 && experienceDetailContents.length > 0) {
        experienceNavButtons.forEach(button => {
            button.addEventListener('mouseenter', function() { 
                experienceNavButtons.forEach(btn => btn.classList.remove('active-tab'));
                this.classList.add('active-tab');
                const targetId = this.getAttribute('data-target');
                showExperienceDetail(targetId);
            });
        });
        // Ensure the first tab is active on page load
        if (experienceNavButtons[0]) {
            experienceNavButtons[0].classList.add('active-tab');
            const firstTargetId = experienceNavButtons[0].getAttribute('data-target');
            showExperienceDetail(firstTargetId);
        }
    }

}); // End of DOMContentLoaded
