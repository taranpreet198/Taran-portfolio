/**
 * Taranpreet Singh - Portfolio Interactivity
 * Clean, lightweight vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Current Year in Footer ---
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --- 2. Mobile Navigation Toggle ---
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const navLinks = document.querySelectorAll('.nav-link');

  function openMenu() {
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('open');
    menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent scrolling while drawer is open
  }

  function closeMenu() {
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (menuOverlay) {
      menuOverlay.addEventListener('click', closeMenu);
    }

    // Close mobile menu when any nav link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          closeMenu();
        }
      });
    });
  }

  // --- 3. Header Shadow on Scroll ---
  const siteHeader = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  // --- 4. Active Section Highlighting in Navbar ---
  const sections = document.querySelectorAll('section[id]');
  
  function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 120; // offset for navbar height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (matchingLink) {
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          navLinks.forEach(link => link.classList.remove('active'));
          matchingLink.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink);
  updateActiveNavLink(); // initial check

  // --- 5. Toast Notification System ---
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  const toastIcon = document.getElementById('toastIcon');
  let toastTimer = null;

  function showToast(message, isSuccess = true) {
    if (!toastNotification || !toastMessage) return;

    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    toastMessage.textContent = message;
    if (toastIcon) {
      toastIcon.innerHTML = isSuccess ? '&#10003;' : '&#9888;';
      toastIcon.style.background = isSuccess ? 'var(--accent-emerald)' : 'var(--accent-amber)';
    }

    toastNotification.classList.add('show');

    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 4000);
  }

  // --- 6. Copy Email to Clipboard ---
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const userEmailText = document.getElementById('userEmailText');

  if (copyEmailBtn && userEmailText) {
    copyEmailBtn.addEventListener('click', async () => {
      const emailToCopy = userEmailText.textContent.trim();

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(emailToCopy);
        } else {
          // Fallback for non-HTTPS / older browsers
          const textArea = document.createElement('textarea');
          textArea.value = emailToCopy;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }
        showToast('Email copied to clipboard!');
      } catch (err) {
        showToast('Failed to copy email', false);
      }
    });
  }

  // --- 7. Working Contact Form with Mailto & Validation ---
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const subjectError = document.getElementById('subjectError');
  const messageError = document.getElementById('messageError');

  function clearErrors() {
    if (nameError) nameError.textContent = '';
    if (emailError) emailError.textContent = '';
    if (subjectError) subjectError.textContent = '';
    if (messageError) messageError.textContent = '';
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      let hasError = false;
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const subject = subjectInput.value.trim();
      const message = messageInput.value.trim();

      if (!name) {
        if (nameError) nameError.textContent = 'Please enter your name.';
        hasError = true;
      }

      if (!email) {
        if (emailError) emailError.textContent = 'Please enter your email address.';
        hasError = true;
      } else if (!validateEmail(email)) {
        if (emailError) emailError.textContent = 'Please enter a valid email format (e.g. name@domain.com).';
        hasError = true;
      }

      if (!subject) {
        if (subjectError) subjectError.textContent = 'Please specify a subject.';
        hasError = true;
      }

      if (!message) {
        if (messageError) messageError.textContent = 'Please write your message.';
        hasError = true;
      }

      if (hasError) return;

      // Construct mailto link
      const recipient = userEmailText ? userEmailText.textContent.trim() : 'taranpreet.singh@example.com';
      const mailtoSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject}`);
      const mailtoBody = encodeURIComponent(
        `Hi Taranpreet,\n\n${message}\n\nFrom:\n${name}\nEmail: ${email}`
      );

      const mailtoURL = `mailto:${recipient}?subject=${mailtoSubject}&body=${mailtoBody}`;

      // Open mail client
      window.location.href = mailtoURL;

      // Display feedback toast
      showToast('Opening your email client... Message ready to send!');

      // Reset form fields
      contactForm.reset();
    });
  }

  // --- 8. Smooth Scrolling Enhancement ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
});

