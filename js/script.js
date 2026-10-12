const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');

if (navToggle && primaryNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  primaryNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      primaryNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (event) => {
    const clickedInsideNav = primaryNav.contains(event.target) || navToggle.contains(event.target);
    if (!clickedInsideNav) {
      primaryNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

function applyTheme(theme) {
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    themeToggle?.setAttribute('aria-pressed', 'true');
    themeToggle?.setAttribute('aria-label', 'Switch to light mode');
  } else {
    root.removeAttribute('data-theme');
    themeToggle?.setAttribute('aria-pressed', 'false');
    themeToggle?.setAttribute('aria-label', 'Switch to dark mode');
  }
}

(function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem('acebeans-theme'); } catch (e) { /* storage unavailable */ }
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));
})();

themeToggle?.addEventListener('click', () => {
  const isDark = root.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('acebeans-theme', next); } catch (e) { /* storage unavailable */ }
});

const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  if (!header) return;
  header.style.boxShadow = window.scrollY > 8 ? '0 4px 20px -10px rgba(36,22,16,0.25)' : 'none';
}, { passive: true });

function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  if (Number.isNaN(target)) return;
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const countEls = document.querySelectorAll('[data-count]');
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      if (entry.target.hasAttribute('data-count')) {
        animateCount(entry.target);
      } else {
        entry.target.classList.add('is-visible');
      }
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  countEls.forEach((el) => observer.observe(el));
  revealEls.forEach((el) => observer.observe(el));
} else {
  countEls.forEach((el) => { el.textContent = el.dataset.count + (el.dataset.suffix || ''); });
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

const track = document.getElementById('testimonialTrack');
const dotsWrap = document.getElementById('testimonialDots');
const prevBtn = document.getElementById('prevTestimonial');
const nextBtn = document.getElementById('nextTestimonial');
const pauseBtn = document.getElementById('pauseTestimonial');
const slider = document.getElementById('testimonialSlider');

if (track && dotsWrap) {
  const slides = Array.from(track.children);
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let autoplayTimer = null;
  let userPaused = reduceMotion;   // no autoplay for people who asked for less motion
  let hoverOrFocus = false;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Show testimonial ${i + 1}`);
    dot.addEventListener('click', () => { goTo(i); syncAutoplay(); });
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goTo(index) {
    slides[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    dots[current].classList.add('is-active');
  }

  function syncAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = null;
    const running = !userPaused && !hoverOrFocus;
    if (running) autoplayTimer = setInterval(() => goTo(current + 1), 6000);
    // Only announce slide changes to screen readers when they are not rotating on their own
    track.setAttribute('aria-live', running ? 'off' : 'polite');
    if (pauseBtn) {
      pauseBtn.textContent = userPaused ? '▶' : '❚❚';
      pauseBtn.setAttribute('aria-label', userPaused ? 'Play testimonials' : 'Pause testimonials');
      pauseBtn.setAttribute('aria-pressed', String(userPaused));
    }
  }

  prevBtn?.addEventListener('click', () => { goTo(current - 1); syncAutoplay(); });
  nextBtn?.addEventListener('click', () => { goTo(current + 1); syncAutoplay(); });
  pauseBtn?.addEventListener('click', () => { userPaused = !userPaused; syncAutoplay(); });

  // Pause on mouse hover AND keyboard focus anywhere inside the slider
  slider?.addEventListener('mouseenter', () => { hoverOrFocus = true; syncAutoplay(); });
  slider?.addEventListener('mouseleave', () => { hoverOrFocus = false; syncAutoplay(); });
  slider?.addEventListener('focusin', () => { hoverOrFocus = true; syncAutoplay(); });
  slider?.addEventListener('focusout', () => { hoverOrFocus = false; syncAutoplay(); });

  goTo(0);
  syncAutoplay();
}

/* Newsletter
   Set NEWSLETTER_ENDPOINT to a real form endpoint (e.g. a Formspree URL) to switch signups on.
   Until then the form is honest: it does NOT pretend to have saved the email. */
const NEWSLETTER_ENDPOINT = '';
const WHATSAPP_NUMBER = '9779746553700';

const newsletterForm = document.getElementById('newsletterForm');
const newsletterMessage = document.getElementById('newsletterMessage');
const newsletterEmail = document.getElementById('newsletterEmail');

newsletterForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const value = newsletterEmail.value.trim();
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  newsletterMessage.textContent = '';

  if (!isValid) {
    newsletterMessage.textContent = 'Please enter a valid email address.';
    newsletterEmail.focus();
    return;
  }

  if (!NEWSLETTER_ENDPOINT) {
    const text = encodeURIComponent(`Hi Ace Beans, please add ${value} to the roast calendar email list.`);
    const link = document.createElement('a');
    link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = 'Send us your email on WhatsApp →';
    newsletterMessage.append('Email signups aren’t switched on yet. ', link);
    return;
  }

  try {
    const res = await fetch(NEWSLETTER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email: value })
    });
    if (!res.ok) throw new Error('Request failed');
    newsletterMessage.textContent = `Thanks — we'll send the roast calendar to ${value}.`;
    newsletterForm.reset();
  } catch (err) {
    newsletterMessage.textContent = 'Something went wrong. Please try again, or message us on WhatsApp.';
  }
});

const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (!backToTop) return;
  backToTop.classList.toggle('is-visible', window.scrollY > 500);
}, { passive: true });

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const faqItems = document.querySelectorAll('.faq-list details');
faqItems.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    }
  });
});
