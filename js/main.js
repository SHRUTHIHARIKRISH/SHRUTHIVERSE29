/* ============================================
   MAIN.JS — ShruthiVerse Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initNavbar();
  initMobileMenu();
  initContactForm();
  initActiveNavHighlight();
});

/* ---- Scroll Fade-In Animations ---- */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  animatedElements.forEach((el) => observer.observe(el));
}

/* ---- Navbar Scroll Effect ---- */
function initNavbar() {
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ---- Mobile Hamburger Menu ---- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

/* ---- Active Nav Link Highlight ---- */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a[href^="#"]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinksAll.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: '-80px 0px -50% 0px',
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---- Contact Form with EmailJS ---- */

// ===========================================
// EMAILJS CONFIGURATION
// To receive emails when someone contacts you:
// 1. Create a free account at https://www.emailjs.com
// 2. Add an email service (Gmail) and get your Service ID
// 3. Create an email template and get your Template ID
// 4. Get your Public Key from Account > API Keys
// 5. Replace the values below
// ===========================================
const EMAILJS_PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY';
const EMAILJS_SERVICE_ID = 'YOUR_EMAILJS_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_EMAILJS_TEMPLATE_ID';

function initContactForm() {
  // Initialize EmailJS if configured
  if (EMAILJS_PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY' && typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  const form = document.getElementById('contactForm');
  const messageEl = document.getElementById('formMessage');
  const submitBtn = document.getElementById('submitBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      showFormMessage('Please fill in all fields.', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFormMessage('Please enter a valid email address.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Sending...';

    try {
      let emailSent = false;

      // 1. Send email notification via EmailJS
      if (EMAILJS_PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY' && typeof emailjs !== 'undefined') {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          from_name: name,
          from_email: email,
          message: message,
          to_email: 'shrutiharikrishnan29@gmail.com',
        });
        emailSent = true;
      }

      // 2. Also store in Supabase DB if configured
      if (typeof supabaseClient !== 'undefined' && supabaseClient) {
        await supabaseClient
          .from('contact_messages')
          .insert([{ name, email, message }]);
      }

      if (emailSent) {
        showFormMessage('Thank you! Your message has been sent to Shruthi. 🎉', 'success');
      } else {
        showFormMessage('Thank you! Your message has been received. 🎉', 'success');
      }
      form.reset();
    } catch (err) {
      console.error('Contact form error:', err);
      showFormMessage('Oops! Something went wrong. Please email shrutiharikrishnan29@gmail.com directly.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector('span').textContent = 'Send Message';
    }
  });

  function showFormMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = `form-message ${type}`;
    setTimeout(() => {
      messageEl.className = 'form-message';
    }, 5000);
  }
}

/* ---- Resume Buttons ---- */
/* Resume preview and download use native <a href="assets/Shruthi_TH_Resume.pdf">
   links in the HTML — no JavaScript needed for this functionality. */
