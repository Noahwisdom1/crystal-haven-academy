/**
 * Crystal Haven Academy – Main JavaScript
 * Handles: navbar scroll state, back-to-top, scroll animations,
 *          contact form validation, footer year, mobile nav auto-close.
 */

(function () {
  'use strict';

  /* ---------------------------------------------------------------
     1. DOM-ready helper
  --------------------------------------------------------------- */
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  /* ---------------------------------------------------------------
     2. Navbar — shrink on scroll
  --------------------------------------------------------------- */
  function initNavbarScroll() {
    const navbar = document.querySelector('.cha-navbar');
    if (!navbar) return;

    function onScroll() {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* ---------------------------------------------------------------
     3. Back-to-top button
  --------------------------------------------------------------- */
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    function onScroll() {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    onScroll();
  }

  /* ---------------------------------------------------------------
     4. Scroll-triggered animations (IntersectionObserver)
  --------------------------------------------------------------- */
  function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;

    // Elements that fade in individually
    const fadeEls = document.querySelectorAll(
      '.programme-card, .why-card, .facility-card, ' +
      '.contact-card, .adm-step, .about-pillars li, ' +
      '.gallery-item, .stat-item'
    );

    const fadeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up', 'visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    fadeEls.forEach(function (el, index) {
      el.classList.add('fade-in-up');
      // Stagger siblings within the same parent
      const siblings = Array.from(el.parentElement.children);
      const delay = siblings.indexOf(el) * 80;
      el.style.transitionDelay = delay + 'ms';
      fadeObserver.observe(el);
    });

    // Section headings slide in
    const headings = document.querySelectorAll(
      '.section-heading, .section-label, .section-intro, .hero-eyebrow'
    );

    const headingObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up', 'visible');
            headingObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    headings.forEach(function (el) {
      el.classList.add('fade-in-up');
      headingObserver.observe(el);
    });
  }

  /* ---------------------------------------------------------------
     5. Contact form — client-side validation
  --------------------------------------------------------------- */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    const successMsg = document.getElementById('formSuccess');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Bootstrap's built-in validation styles
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }

      // Frontend validation passed — show the contact details notice.
      // NOTE: No data is transmitted. A backend or email service must be
      //       configured before this form can deliver submissions.
      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn.textContent;

      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Validating…';

      setTimeout(function () {
        form.reset();
        form.classList.remove('was-validated');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        if (successMsg) {
          successMsg.classList.remove('d-none');
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

          setTimeout(function () {
            successMsg.classList.add('d-none');
          }, 10000);
        }
      }, 800);
    });
  }

  /* ---------------------------------------------------------------
     6. Mobile nav — close on link click
  --------------------------------------------------------------- */
  function initMobileNavClose() {
    const navCollapse = document.getElementById('mainNav');
    if (!navCollapse) return;

    const links = navCollapse.querySelectorAll('.nav-link, .btn');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      });
    });
  }

  /* ---------------------------------------------------------------
     7. Footer — dynamic year
  --------------------------------------------------------------- */
  function initFooterYear() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  /* ---------------------------------------------------------------
     8. Smooth scroll for in-page anchor links
  --------------------------------------------------------------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href').slice(1);
        if (!targetId) return;

        const target = document.getElementById(targetId);
        if (!target) return;

        e.preventDefault();

        const navbar = document.querySelector('.cha-navbar');
        const offset = navbar ? navbar.offsetHeight + 16 : 80;

        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ---------------------------------------------------------------
     9. Initialise everything
  --------------------------------------------------------------- */
  ready(function () {
    initNavbarScroll();
    initBackToTop();
    initScrollAnimations();
    initContactForm();
    initMobileNavClose();
    initFooterYear();
    initSmoothScroll();
  });

})();
