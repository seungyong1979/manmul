// =========================================================
// 만물공동회 2026 - Landing Page Interactions
// =========================================================
document.addEventListener('DOMContentLoaded', function () {

  // ---- Mobile nav toggle ----
  var navToggle = document.getElementById('nav-toggle');
  var mainNav = document.getElementById('main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navToggle.classList.toggle('active', isOpen);
    });

    // Close menu when a nav link is clicked (mobile)
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Header shrink / shadow on scroll ----
  var header = document.getElementById('site-header');
  var toTopBtn = document.getElementById('to-top');

  function onScroll() {
    var scrolled = window.scrollY > 40;
    if (header) {
      header.style.boxShadow = scrolled ? '0 4px 12px rgba(0,0,0,0.15)' : 'none';
    }
    if (toTopBtn) {
      toTopBtn.style.display = window.scrollY > 480 ? 'flex' : 'none';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Back to top ----
  if (toTopBtn) {
    toTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Scroll reveal for cards/sections ----
  var revealTargets = document.querySelectorAll(
    '.flow-step, .booth-card, .mini-card, .quest-card, .aq-card, .conf-session, .info-card, .species-chip'
  );
  revealTargets.forEach(function (el) {
    el.setAttribute('data-reveal', '');
  });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // ---- Active nav link highlighting based on section in view ----
  var sections = document.querySelectorAll('section[id]');
  var navLinks = mainNav ? mainNav.querySelectorAll('a') : [];

  function highlightNav() {
    var current = '';
    sections.forEach(function (sec) {
      var rect = sec.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) {
        current = sec.id;
      }
    });
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href').replace('#', '');
      link.style.color = href === current ? '#1E3F8C' : '';
      link.style.textDecoration = href === current ? 'underline' : 'none';
    });
  }
  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();
});
