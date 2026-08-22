/* ═══════════════════════════════════════════════════════════════
   SILËN Agency — Ultra Premium Hospitality
   Apple-inspired interactions · Smooth · Understated
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Preloader ─────────────────────────────────────────────── */
  const preloader = document.getElementById('preloader');
  document.body.style.overflow = 'hidden';

  const dismissPreloader = () => {
    if (preloader.classList.contains('done')) return;
    preloader.classList.add('done');
    document.body.style.overflow = '';
  };

  window.addEventListener('load', () => setTimeout(dismissPreloader, 2600));
  setTimeout(dismissPreloader, 5000); // safety fallback

  /* ── Header: hero-mode + scrolled ──────────────────────────── */
  const header  = document.getElementById('header');
  const hero    = document.getElementById('hero');

  const updateHeader = () => {
    if (!header || !hero) return;
    const heroBottom = hero.getBoundingClientRect().bottom;
    const pastHero   = heroBottom <= header.offsetHeight;

    header.classList.toggle('hero-mode', !pastHero);
    header.classList.toggle('scrolled', pastHero);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('resize', updateHeader, { passive: true });

  /* ── Mobile Menu ───────────────────────────────────────────── */
  const burger    = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('[data-mobile]');

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const opening = !mobileMenu.classList.contains('open');
      burger.classList.toggle('open', opening);
      mobileMenu.classList.toggle('open', opening);
      document.body.style.overflow = opening ? 'hidden' : '';

      // When menu opens over hero, keep header text dark
      if (opening) {
        header.classList.remove('hero-mode');
        header.classList.add('scrolled');
      } else {
        updateHeader();
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        updateHeader();
      });
    });
  }

  /* ── Smooth Scroll ─────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = header ? header.offsetHeight + 10 : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Reveal on Scroll (IntersectionObserver) ───────────────── */
  const reveals = document.querySelectorAll('.reveal-fade');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show everything
    reveals.forEach(el => el.classList.add('visible'));
  }

  /* ── Animated Counters ─────────────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');

  if ('IntersectionObserver' in window && counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const duration = 2200;
          const start  = performance.now();

          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4); // ease-out quartic
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  /* ── Hero Video Fallback ───────────────────────────────────── */
  const video = document.getElementById('hero-video');
  if (video) {
    video.addEventListener('error', () => {
      video.style.display = 'none';
      const media = video.closest('.hero-media');
      if (media) {
        media.style.background = 'linear-gradient(135deg, #1a1917 0%, #2c2a27 40%, #1a1917 100%)';
      }
    });
    video.play().catch(() => {});
  }

  /* ── Contact Form (placeholder submission) ─────────────────── */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      if (!btn) return;
      const original = btn.innerHTML;

      btn.innerHTML = '<span>Envoyé ✓</span>';
      btn.style.background = 'var(--olive)';
      btn.style.color = 'var(--white)';
      btn.style.borderColor = 'var(--olive)';

      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.style.color = '';
        btn.style.borderColor = '';
        form.reset();
      }, 3000);
    });
  }

  /* ── Reduced Motion ────────────────────────────────────────── */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveals.forEach(el => el.classList.add('visible'));
  }

});
