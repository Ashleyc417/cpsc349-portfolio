// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', function () {

    // --- Mobile Menu Functionality ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenuCloseButton = document.getElementById('mobile-menu-close-button');
    const mobileMenu = document.getElementById('mobile-menu');
    // Select all links within the mobile menu specifically for closing it on click
    const mobileNavLinksForClose = document.querySelectorAll('#mobile-menu a.mobile-nav-link');

    // Function to open the mobile menu
    function openMobileMenu() {
        if (mobileMenu) {
            mobileMenu.classList.remove('mobile-menu-closed');
            mobileMenu.classList.add('mobile-menu-open');
            document.body.style.overflow = 'hidden'; // Prevent scrolling of the page when menu is open
        }
    }

    // Function to close the mobile menu
    function closeMobileMenu() {
        if (mobileMenu) {
            mobileMenu.classList.remove('mobile-menu-open');
            mobileMenu.classList.add('mobile-menu-closed');
            document.body.style.overflow = ''; // Restore scrolling of the page
        }
    }

    // Event listener for the mobile menu open button
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', openMobileMenu);
    }

    // Event listener for the mobile menu close button
    if (mobileMenuCloseButton) {
        mobileMenuCloseButton.addEventListener('click', closeMobileMenu);
    }

    // Event listeners for each link in the mobile menu to close it on click
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
    // Select all navigation links (desktop and mobile)
    const desktopNavLinks = document.querySelectorAll('header nav > div.hidden a.nav-link');
    const mobileNavLinks = document.querySelectorAll('#mobile-menu a.mobile-nav-link'); // Already selected above, but good for clarity
    const allNavLinks = [...desktopNavLinks, ...mobileNavLinks]; // Combine node lists

    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    allNavLinks.forEach(link => {
        const linkFileName = link.getAttribute('href').split("/").pop();
        const linkPage = (linkFileName === "" || linkFileName === null) ? "index.html" : linkFileName;

        // Remove any existing active classes first
        link.classList.remove('nav-link-active');
        if (link.classList.contains('mobile-nav-link')) {
            link.classList.remove('font-bold'); // Specific to mobile active state
            // Reset color if active styles were applied directly by JS (though CSS should handle this)
        }

        // Add active class if the link matches the current page
        if (linkPage === currentPage) {
            link.classList.add('nav-link-active');
            if (link.classList.contains('mobile-nav-link')) {
                link.classList.add('font-bold'); // Add bold for active mobile link
                // Active color for mobile links is handled by CSS:
                // #mobile-menu a.mobile-nav-link.font-heading.font-bold
                // or #mobile-menu a.mobile-nav-link.nav-link-active
            }
        }
    });

    // --- Intersection Observer for Fade-In Sections ---
    const sectionsToFade = document.querySelectorAll('.fade-in-section');
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once the animation has triggered
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the section is visible
    });

    sectionsToFade.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Basic Contact Form Handling (Front-end only feedback) ---
    const contactForm = document.getElementById('contactForm'); // Assuming your form has id="contactForm"
    const formMessage = document.getElementById('formMessage'); // Assuming you have an element with id="formMessage" for feedback

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission

            // Basic validation (can be expanded)
            const nameInput = contactForm.querySelector('#name'); // Ensure your inputs have these IDs
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
                formMessage.className = 'mt-4 text-center error'; // Ensure 'error' class is styled in CSS
                return;
            }

            // Simulate form submission success
            formMessage.textContent = "Thank you for your message! (This is a demo and not actually sent)";
            formMessage.className = 'mt-4 text-center success'; // Ensure 'success' class is styled in CSS
            contactForm.reset(); // Clear the form fields

            // IMPORTANT: To make this form actually send emails, you would need to:
            // 1. Change the form's `action` attribute to a backend endpoint or a service like Formspree.
            // 2. Change the form's `method` attribute to "POST".
            // 3. Remove `event.preventDefault()` or handle the submission with `fetch()` as shown in previous examples.
            // For example, using Formspree, you'd set up your form in HTML like:
            // <form id="contactForm" action="https://formspree.io/f/YOUR_FORMSPREE_ID" method="POST">
            // And then you might not even need this JS part for submission, or you'd use fetch for AJAX submission.
        });
    }

}); // End of DOMContentLoaded
