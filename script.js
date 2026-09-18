/* ==========================================================================
   Vista Cleaning Operations — interactions
   Vanilla JS. No external dependencies, no APIs, no env vars.
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;
  var $  = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };

  /* ---------------------------------------------------------------
     Mobile navigation
     --------------------------------------------------------------- */
  var nav      = $('#primaryNav');
  var toggle   = $('#navToggle');
  var backdrop = null;

  var closeTimer = null;

  function openNav() {
    if (!nav || !toggle) return;
    if (closeTimer) { window.clearTimeout(closeTimer); closeTimer = null; }
    nav.classList.remove('is-closing');
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    doc.body.classList.add('nav-open');

    backdrop = doc.createElement('div');
    backdrop.className = 'nav-backdrop';
    doc.body.appendChild(backdrop);
    // force reflow so the opacity transition runs
    void backdrop.offsetWidth;
    backdrop.classList.add('is-on');
    backdrop.addEventListener('click', closeNav);
  }

  function closeNav() {
    if (!nav || !toggle) return;

    // Play the slide-out, then drop the drawer out of layout entirely
    if (nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      nav.classList.add('is-closing');
      if (closeTimer) window.clearTimeout(closeTimer);
      closeTimer = window.setTimeout(function () {
        nav.classList.remove('is-closing');
        closeTimer = null;
      }, 280);
    }

    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    doc.body.classList.remove('nav-open');

    if (backdrop) {
      var b = backdrop;
      backdrop = null;
      b.classList.remove('is-on');
      window.setTimeout(function () {
        if (b && b.parentNode) b.parentNode.removeChild(b);
      }, 300);
    }
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) closeNav();
      else openNav();
    });
  }

  // Close the drawer after tapping any nav link
  $$('#primaryNav a').forEach(function (a) {
    a.addEventListener('click', closeNav);
  });

  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav && nav.classList.contains('is-open')) {
      closeNav();
      toggle.focus();
    }
  });

  // Reset the drawer if the viewport grows past the mobile breakpoint
  var mq = window.matchMedia('(min-width: 821px)');
  var onMq = function (e) { if (e.matches) closeNav(); };
  if (mq.addEventListener) mq.addEventListener('change', onMq);
  else if (mq.addListener) mq.addListener(onMq);

  /* ---------------------------------------------------------------
     Sticky header shadow + back-to-top visibility
     --------------------------------------------------------------- */
  var header = $('#siteHeader');
  var toTop  = $('#toTop');
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset || doc.documentElement.scrollTop;
    if (header) header.classList.toggle('is-stuck', y > 8);
    if (toTop)  toTop.classList.toggle('is-visible', y > 600);
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  /* ---------------------------------------------------------------
     FAQ accordion (accessible, one panel open at a time)
     --------------------------------------------------------------- */
  $$('#faqList .faq__item').forEach(function (item) {
    var btn = $('.faq__q', item);
    if (!btn) return;

    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');

      // collapse any other open panel
      $$('#faqList .faq__item.is-open').forEach(function (other) {
        if (other !== item) {
          other.classList.remove('is-open');
          var ob = $('.faq__q', other);
          if (ob) ob.setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('is-open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ---------------------------------------------------------------
     Service card "Learn more" → preselect that service in the form
     --------------------------------------------------------------- */
  var serviceSelect = $('#qService');

  $$('[data-service]').forEach(function (link) {
    link.addEventListener('click', function () {
      var wanted = link.getAttribute('data-service');
      if (!serviceSelect || !wanted) return;

      Array.prototype.forEach.call(serviceSelect.options, function (opt) {
        if (opt.text.trim().toLowerCase() === wanted.trim().toLowerCase()) {
          serviceSelect.value = opt.value || opt.text;
        }
      });

      var field = serviceSelect.closest('.field');
      if (field) field.classList.remove('is-invalid');
    });
  });

  /* ---------------------------------------------------------------
     Quote form — client-side validation + confirmation
     --------------------------------------------------------------- */
  var form    = $('#quoteForm');
  var success = $('#quoteSuccess');
  var summary = $('#quoteSummary');

  function setError(input, message) {
    var field = input.closest('.field');
    if (!field) return;
    var slot = $('[data-err]', field);
    if (message) {
      field.classList.add('is-invalid');
      if (slot) slot.textContent = message;
      input.setAttribute('aria-invalid', 'true');
    } else {
      field.classList.remove('is-invalid');
      if (slot) slot.textContent = '';
      input.removeAttribute('aria-invalid');
    }
  }

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  }

  function validPhone(v) {
    var digits = v.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 15;
  }

  function validateField(input) {
    var v = (input.value || '').trim();

    if (input.hasAttribute('required') && !v) {
      setError(input, 'This field is required.');
      return false;
    }
    if (input.type === 'email' && v && !validEmail(v)) {
      setError(input, 'Enter a valid email address.');
      return false;
    }
    if (input.type === 'tel' && v && !validPhone(v)) {
      setError(input, 'Enter a valid phone number.');
      return false;
    }
    setError(input, '');
    return true;
  }

  if (form) {
    var fields = $$('input, select, textarea', form);

    fields.forEach(function (input) {
      input.addEventListener('blur', function () { validateField(input); });
      input.addEventListener('input', function () {
        if (input.closest('.field').classList.contains('is-invalid')) validateField(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var ok = true;
      var firstBad = null;

      fields.forEach(function (input) {
        if (!validateField(input)) {
          ok = false;
          if (!firstBad) firstBad = input;
        }
      });

      if (!ok) {
        if (success) success.hidden = true;
        if (firstBad) firstBad.focus();
        return;
      }

      var service = ($('#qService', form) || {}).value || 'a cleaning';
      var name    = (($('#qName', form) || {}).value || '').trim();
      var date    = (($('#qDate', form) || {}).value || '').trim();

      var msg = 'We have your ' + service + ' request';
      if (name) msg += ' for ' + name;
      if (date) msg += ' on ' + date;
      msg += '. Call 202-910-2247 (Mon–Fri, 8am–5pm) to confirm scope, timing and access details right away.';

      if (summary) summary.textContent = msg;
      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      form.reset();
      fields.forEach(function (input) { setError(input, ''); });
    });
  }

  /* ---------------------------------------------------------------
     Scroll reveal
     --------------------------------------------------------------- */
  var reveals = $$('.reveal');

  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        window.setTimeout(function () { el.classList.add('is-in'); }, i * 70);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    reveals.forEach(function (el) { io.observe(el); });
  }

})();
