const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");

if (menuBtn) {
  // support both icon-font <i> toggling and the new CSS hamburger
  const menuBtnIcon = menuBtn.querySelector("i");
  let _prevFocus = null;
  menuBtn.addEventListener("click", () => {
    const wasOpen = navLinks.classList.contains("open");
    navLinks.classList.toggle("open");
    const isOpen = navLinks.classList.contains("open");
    // manage focus: remember previous element and move focus into menu when opened
    if (isOpen && !wasOpen) {
      _prevFocus = document.activeElement;
    }
    // if icon font present, swap classes (backwards compatibility)
    if (menuBtnIcon) {
      menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
    } else {
      // animate CSS hamburger
      if (isOpen) {
        menuBtn.classList.add('is-open');
        menuBtn.setAttribute('aria-expanded','true');
        // move focus to first link inside the menu for keyboard users
        const firstLink = navLinks.querySelector('a');
        if (firstLink) firstLink.focus();
      } else {
        menuBtn.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded','false');
        // restore previous focus
        if (_prevFocus && typeof _prevFocus.focus === 'function') _prevFocus.focus();
      }
    }
  });
}

// allow closing the menu with Escape and restore focus
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' || e.key === 'Esc') {
    if (navLinks && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      const icon = menuBtn && menuBtn.querySelector('i');
      if (icon) icon.setAttribute('class','ri-menu-line');
      else if (menuBtn) {
        menuBtn.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded','false');
      }
      if (_prevFocus && typeof _prevFocus.focus === 'function') _prevFocus.focus();
    }
  }
});

if (navLinks) {
  navLinks.addEventListener("click", (e) => {
    // close mobile menu when a link is clicked
    if (e.target.tagName === 'A') {
      navLinks.classList.remove("open");
      const icon = menuBtn && menuBtn.querySelector("i");
      if (icon) {
        icon.setAttribute("class", "ri-menu-line");
      } else if (menuBtn) {
        menuBtn.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded','false');
      }
    }
  });
}

const scrollRevealOption = {
  distance: "40px",
  origin: "bottom",
  duration: 900,
};

if (window.ScrollReveal) {
  const sr = ScrollReveal();
  sr.reveal(".header-title, .header-sub", { ...scrollRevealOption });
  sr.reveal(".section-title", { ...scrollRevealOption, delay: 150 });
  sr.reveal(".pillar", { ...scrollRevealOption, interval: 120, origin: 'left' });
  sr.reveal(".service-item", { ...scrollRevealOption, interval: 120 });
  sr.reveal(".initiative", { ...scrollRevealOption, interval: 150 });
  sr.reveal(".differentiator", { ...scrollRevealOption, interval: 100 });
  sr.reveal(".contact-item", { ...scrollRevealOption, interval: 80 });
}

// optional: smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Contact form handler: tries to POST to a configured endpoint (data-endpoint attribute),
// otherwise falls back to opening the user's email client via mailto.
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const endpoint = contactForm.dataset.endpoint; // set data-endpoint="https://..." to enable direct POST

    if (endpoint) {
      try {
        const res = await fetch(endpoint, { method: 'POST', body: formData });
        if (res.ok) {
          alert('Message sent — thank you!');
          contactForm.reset();
        } else {
          alert('Submission failed — please try again or email us directly.');
        }
      } catch (err) {
        console.error(err);
        alert('Submission error — please try again or email us directly.');
      }
    } else {
      // mailto fallback
      const name = formData.get('name') || '';
      const email = formData.get('email') || '';
      const org = formData.get('organization') || '';
      const interest = formData.get('interest') || '';
      const message = formData.get('message') || '';
      const subject = encodeURIComponent('Website contact from ' + name);
      const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\nOrganization: ' + org + '\nInterest: ' + interest + '\n\n' + message);
      window.location.href = `mailto:info@zoshani.us?subject=${subject}&body=${body}`;
    }
  });
}

// mailto fallback helper button in contact page
const mailtoBtn = document.getElementById('mailto-fallback');
if (mailtoBtn) {
  mailtoBtn.addEventListener('click', () => {
    window.location.href = 'mailto:info@zoshani.us';
  });
}

// highlight active nav link based on current URL
const navLinksArray = Array.from(document.querySelectorAll('.nav__links a'));
function setActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  navLinksArray.forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    const linkPage = href.split('/').pop();
    if (linkPage === current) a.classList.add('active'); else a.classList.remove('active');
  });
}
setActiveNav();

// close mobile menu when clicking outside (mobile UX)
document.addEventListener('click', (e) => {
  const isClickInside = e.target.closest('nav');
  if (!isClickInside && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    const icon = menuBtn && menuBtn.querySelector('i');
    if (icon) icon.setAttribute('class','ri-menu-line');
    else if (menuBtn) {
      menuBtn.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded','false');
    }
  }
});

// toggle nav scrolled state and a subtle parallax on hero media
const siteNav = document.getElementById('site-nav');
const heroMedia = document.querySelector('.hero-media img');
function onScroll() {
  const y = window.scrollY || window.pageYOffset;
  if (siteNav) siteNav.classList.toggle('scrolled', y > 40);
  // gentle parallax: translate hero image on scroll (only on large screens)
  if (heroMedia && window.innerWidth > 980) {
    const t = Math.min(40, y * 0.12);
    heroMedia.style.transform = `translateY(${t}px)`;
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// IntersectionObserver to add .in-view for data-animate elements
const animateEls = document.querySelectorAll('[data-animate]');
if (animateEls.length) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if (ent.isIntersecting) {
        ent.target.classList.add('in-view');
          // once visible, run any count-up animations inside and unobserve
          const counts = ent.target.querySelectorAll('.count');
          if (counts.length) {
            counts.forEach(c => {
              const target = parseFloat(c.dataset.target || c.getAttribute('data-target') || 0);
              if (!isNaN(target)) {
                // simple count-up using requestAnimationFrame
                const duration = 1400;
                const start = performance.now();
                const from = 0;
                const step = (now) => {
                  const progress = Math.min(1, (now - start) / duration);
                  const value = Math.floor(progress * (target - from) + from);
                  c.textContent = value;
                  if (progress < 1) requestAnimationFrame(step);
                  else c.textContent = String(target);
                };
                requestAnimationFrame(step);
              }
            });
          }
          // once visible, unobserve to keep it simple
          obs.unobserve(ent.target);
      }
    });
  }, { threshold: 0.12 });
  animateEls.forEach(el => obs.observe(el));
}
