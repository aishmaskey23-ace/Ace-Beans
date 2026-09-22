/* ---------------------------------------------------------------
   Mobile navigation toggle
--------------------------------------------------------------- */
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

/* ---------------------------------------------------------------
   Dark / light theme toggle (persisted)
--------------------------------------------------------------- */
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

/* ---------------------------------------------------------------
   Sticky header shadow on scroll
--------------------------------------------------------------- */
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  if (!header) return;
  header.style.boxShadow = window.scrollY > 8 ? '0 4px 20px -10px rgba(36,22,16,0.25)' : 'none';
}, { passive: true });

/* ---------------------------------------------------------------
   Animated stat counters + fade-in reveals (single IntersectionObserver)
--------------------------------------------------------------- */
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
  }, { threshold: 0.4 });

  countEls.forEach((el) => observer.observe(el));
  revealEls.forEach((el) => observer.observe(el));
} else {
  countEls.forEach((el) => { el.textContent = el.dataset.count + (el.dataset.suffix || ''); });
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

/* ---------------------------------------------------------------
   Testimonial slider
--------------------------------------------------------------- */
const track = document.getElementById('testimonialTrack');
const dotsWrap = document.getElementById('testimonialDots');
const prevBtn = document.getElementById('prevTestimonial');
const nextBtn = document.getElementById('nextTestimonial');

if (track && dotsWrap) {
  const slides = Array.from(track.children);
  let current = 0;
  let autoplayTimer = null;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Show testimonial ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
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

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => goTo(current + 1), 6000);
  }
  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  prevBtn?.addEventListener('click', () => { goTo(current - 1); startAutoplay(); });
  nextBtn?.addEventListener('click', () => { goTo(current + 1); startAutoplay(); });
  track.addEventListener('mouseenter', stopAutoplay);
  track.addEventListener('mouseleave', startAutoplay);

  goTo(0);
  startAutoplay();
}

/* ---------------------------------------------------------------
   Newsletter form (client-side only — no backend wired up)
--------------------------------------------------------------- */
const newsletterForm = document.getElementById('newsletterForm');
const newsletterMessage = document.getElementById('newsletterMessage');
const newsletterEmail = document.getElementById('newsletterEmail');

newsletterForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = newsletterEmail.value.trim();
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  if (!isValid) {
    newsletterMessage.textContent = 'Please enter a valid email address.';
    newsletterEmail.focus();
    return;
  }

  newsletterMessage.textContent = `Thanks — we'll send the roast calendar to ${value}.`;
  newsletterForm.reset();
});

/* ---------------------------------------------------------------
   Back-to-top button
--------------------------------------------------------------- */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (!backToTop) return;
  backToTop.classList.toggle('is-visible', window.scrollY > 500);
}, { passive: true });

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------------------------------------------------------------
   FAQ — only one open at a time
--------------------------------------------------------------- */
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
