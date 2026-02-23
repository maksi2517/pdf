/* ============================================================
   Austro Kredit – main.js
   Vanilla JS – no build step required
   ============================================================ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────────
     1. AOS INIT
  ────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    if (typeof AOS !== 'undefined') {
      AOS.init({ once: true, offset: 60, duration: 550 });
    }
  });


  /* ──────────────────────────────────────────────────────────
     2. HEADER – scroll backdrop + mobile menu
  ────────────────────────────────────────────────────────── */
  var header      = document.getElementById('site-header');
  var hamburger   = document.getElementById('hamburger-btn');
  var mobileMenu  = document.getElementById('mobile-menu');
  var backdrop    = document.getElementById('mobile-backdrop');
  var hamIcon     = document.getElementById('hamburger-icon');
  var closeIcon   = document.getElementById('close-icon');

  window.addEventListener('scroll', function () {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('open');
    if (backdrop)  backdrop.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    if (hamIcon)   hamIcon.style.display  = 'none';
    if (closeIcon) closeIcon.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    if (backdrop)  backdrop.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    if (hamIcon)   hamIcon.style.display  = 'block';
    if (closeIcon) closeIcon.style.display = 'none';
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      mobileMenu && mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
    });
  }

  if (backdrop) backdrop.addEventListener('click', closeMenu);

  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });


  /* ──────────────────────────────────────────────────────────
     3. LOAN CALCULATOR
  ────────────────────────────────────────────────────────── */
  var amountSlider   = document.getElementById('loan-amount-slider');
  var amountDisplay  = document.getElementById('loan-amount-display');
  var durationSelect = document.getElementById('loan-duration');
  var rateDisplay    = document.getElementById('monthly-rate-display');
  var rateHint       = document.getElementById('rate-hint');

  function fmt(n) {
    return Math.round(n).toLocaleString('de-AT');
  }

  function updateSliderFill() {
    if (!amountSlider) return;
    var min = +amountSlider.min, max = +amountSlider.max, val = +amountSlider.value;
    amountSlider.style.setProperty('--fill', ((val - min) / (max - min) * 100) + '%');
  }

  function updateCalc() {
    if (!amountSlider) return;
    var amount = +amountSlider.value;
    var months = durationSelect ? +durationSelect.value : 0;

    if (amountDisplay) amountDisplay.textContent = fmt(amount);
    updateSliderFill();

    if (!months) {
      if (rateDisplay) rateDisplay.textContent = '—';
      if (rateHint)    rateHint.textContent = 'Bitte Laufzeit wählen';
      return;
    }

    var monthly = (amount / months) * 1.035;
    if (rateDisplay) rateDisplay.textContent = (monthly).toLocaleString('de-AT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (rateHint)    rateHint.textContent = 'Eff. Jahreszins ca. 3,5 % p.a. – bonitätsabhängig';

    document.querySelectorAll('.form-display.muted').forEach(function (el) {
      el.classList.remove('muted');
    });
  }

  if (amountSlider) {
    amountSlider.addEventListener('input', updateCalc);
    updateSliderFill();
  }
  if (durationSelect) durationSelect.addEventListener('change', updateCalc);


  /* ──────────────────────────────────────────────────────────
     4. COUNT-UP (stats section)
  ────────────────────────────────────────────────────────── */
  function runCountUp(el) {
    var target   = parseInt(el.dataset.target, 10);
    var locale   = el.hasAttribute('data-locale');
    var duration = 1800;
    var start    = null;

    (function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var v = Math.floor((1 - Math.pow(1 - p, 3)) * target);
      el.textContent = locale ? v.toLocaleString('de-AT') : v;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = locale ? target.toLocaleString('de-AT') : target;
    })(performance.now());
  }

  var countEls = document.querySelectorAll('.count-up');
  if ('IntersectionObserver' in window && countEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCountUp(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.3 });
    countEls.forEach(function (el) { io.observe(el); });
  } else {
    countEls.forEach(runCountUp);
  }


  /* ──────────────────────────────────────────────────────────
     5. TESTIMONIALS CAROUSEL
  ────────────────────────────────────────────────────────── */
  var reviews = [
    {
      name: 'Martin K.',     city: 'Wien',      date: 'März 2024',
      rating: 5,
      text: 'Trotz KSV-Eintrag haben sie für mich eine Lösung gefunden. Sehr kompetent und diskret. Ich kann Austro Kredit nur weiterempfehlen!',
      bg: 'linear-gradient(135deg,#D40100,#8a0000)'
    },
    {
      name: 'Sandra M.',     city: 'Linz',      date: 'Januar 2024',
      rating: 5,
      text: 'Super schnelle Abwicklung! Anfrage gestellt, am nächsten Tag schon eine Rückmeldung erhalten. Der Kredit war innerhalb einer Woche auf meinem Konto.',
      bg: 'linear-gradient(135deg,#B80000,#700000)'
    },
    {
      name: 'Thomas B.',     city: 'Graz',      date: 'Februar 2024',
      rating: 5,
      text: 'Ich war skeptisch, aber das Team hat mich eines Besseren belehrt. Professionelle Beratung, keine versteckten Kosten, genau wie versprochen.',
      bg: 'linear-gradient(135deg,#8a0000,#500000)'
    },
    {
      name: 'Claudia W.',    city: 'Salzburg',  date: 'April 2024',
      rating: 5,
      text: 'Bereits zum zweiten Mal in Anspruch genommen. Immer wieder top! Umschuldung hat uns monatlich über 200 € gespart. Danke!',
      bg: 'linear-gradient(135deg,#D40100,#8a0000)'
    },
    {
      name: 'Peter H.',      city: 'Innsbruck', date: 'Dezember 2023',
      rating: 5,
      text: 'Andere Banken haben mich abgewiesen – Austro Kredit hat Wege gefunden. Sehr empfehlenswert für alle, die Unterstützung brauchen.',
      bg: 'linear-gradient(135deg,#B80000,#700000)'
    }
  ];

  var reviewDisplay      = document.getElementById('review-display');
  var reviewDotsWrap     = document.getElementById('review-dots');
  var btnPrev            = document.getElementById('review-prev');
  var btnNext            = document.getElementById('review-next');
  var btnPrevMobile      = document.getElementById('review-prev-mobile');
  var btnNextMobile      = document.getElementById('review-next-mobile');
  var testimonialsSlider = document.getElementById('testimonials-slider');

  var currentIdx  = 0;
  var timer       = null;
  var AUTOPLAY_MS = 5000;

  function starsSVG(n) {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#D40100" stroke="#D40100" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
    var out = '';
    for (var i = 0; i < n; i++) out += svg;
    return out;
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function renderReview(idx) {
    if (!reviewDisplay) return;
    var r = reviews[idx];
    var initials = r.name.split(' ').map(function (w) { return w[0]; }).join('');

    reviewDisplay.innerHTML =
      '<div class="review-card">' +
        '<div class="review-accent-strip" style="background:linear-gradient(to bottom,var(--brand),transparent)"></div>' +
        '<div class="review-body">' +
          '<div class="review-author">' +
            '<div class="review-avatar" style="background:' + r.bg + '">' + esc(initials) + '</div>' +
            '<div class="review-author-info">' +
              '<div class="name">' + esc(r.name) + '</div>' +
              '<div class="review-location">' +
                '<div class="dot" style="background:var(--brand)"></div>' +
                '<span>' + esc(r.city) + ' &nbsp;·&nbsp; ' + esc(r.date) + '</span>' +
              '</div>' +
            '</div>' +
            '<div class="review-stars">' + starsSVG(r.rating) + '</div>' +
            '<div class="review-verified">' +
              '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>' +
              '<span>Verifiziert</span>' +
            '</div>' +
          '</div>' +
          '<div class="review-divider-v"></div>' +
          '<div class="review-content">' +
            '<div class="review-quote-icon">' +
              '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>' +
            '</div>' +
            '<p class="review-text">' + esc(r.text) + '</p>' +
            '<div class="review-progress"><div class="review-progress-bar playing" id="review-progress-bar"></div></div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function renderDots() {
    if (!reviewDotsWrap) return;
    reviewDotsWrap.innerHTML = '';
    reviews.forEach(function (_, i) {
      var btn = document.createElement('button');
      btn.className = 'dot-btn' + (i === currentIdx ? ' active' : '');
      btn.setAttribute('aria-label', 'Bewertung ' + (i + 1));
      var span = document.createElement('span');
      span.style.width = (i === currentIdx ? '28px' : '8px');
      btn.appendChild(span);
      btn.addEventListener('click', function () { goTo(i); });
      reviewDotsWrap.appendChild(btn);
    });
  }

  function goTo(idx) {
    currentIdx = ((idx % reviews.length) + reviews.length) % reviews.length;
    renderReview(currentIdx);
    renderDots();
    clearInterval(timer);
    timer = setInterval(function () { goTo(currentIdx + 1); }, AUTOPLAY_MS);
  }

  if (reviewDisplay) {
    renderReview(0);
    renderDots();
    timer = setInterval(function () { goTo(currentIdx + 1); }, AUTOPLAY_MS);

    if (btnPrev)       btnPrev.addEventListener('click',       function () { goTo(currentIdx - 1); });
    if (btnNext)       btnNext.addEventListener('click',       function () { goTo(currentIdx + 1); });
    if (btnPrevMobile) btnPrevMobile.addEventListener('click', function () { goTo(currentIdx - 1); });
    if (btnNextMobile) btnNextMobile.addEventListener('click', function () { goTo(currentIdx + 1); });

    if (testimonialsSlider) {
      testimonialsSlider.addEventListener('mouseenter', function () { clearInterval(timer); });
      testimonialsSlider.addEventListener('mouseleave', function () {
        timer = setInterval(function () { goTo(currentIdx + 1); }, AUTOPLAY_MS);
      });
    }

    // Touch swipe
    var tx = 0;
    reviewDisplay.addEventListener('touchstart', function (e) { tx = e.changedTouches[0].clientX; }, { passive: true });
    reviewDisplay.addEventListener('touchend',   function (e) {
      var dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 50) dx < 0 ? goTo(currentIdx + 1) : goTo(currentIdx - 1);
    }, { passive: true });
  }


  /* ──────────────────────────────────────────────────────────
     6. FAQ ACCORDION
  ────────────────────────────────────────────────────────── */
  var faqs = [
    {
      q: 'Ist die Anfrage wirklich kostenlos?',
      a: 'Ja, vollständig kostenlos und unverbindlich. Wir arbeiten ausschließlich auf Erfolgsbasis – Sie zahlen nur dann, wenn Sie tatsächlich einen Kredit erhalten.'
    },
    {
      q: 'Kann ich auch mit einem KSV-Eintrag einen Kredit bekommen?',
      a: 'Ja! Wir sind auf schwierige Fälle spezialisiert. Auch bei KSV-Einträgen, Mahnungen oder laufenden Exekutionen haben wir eine Erfolgsquote von über 92 %.'
    },
    {
      q: 'Wie lange dauert die Bearbeitung meiner Anfrage?',
      a: 'Sie erhalten in der Regel innerhalb von 24 Stunden eine erste Rückmeldung. In dringenden Fällen bemühen wir uns, noch schneller zu reagieren.'
    },
    {
      q: 'Welche Unterlagen benötige ich für eine Anfrage?',
      a: 'Für die erste Anfrage benötigen Sie keine Unterlagen. Erst nach unserer Vorprüfung benötigen wir Lohnzettel, Kontoauszüge und einen gültigen Ausweis.'
    },
    {
      q: 'Wie viel kann ich maximal beantragen?',
      a: 'Die Kreditbeträge reichen von € 1.000 bis € 100.000, mit Laufzeiten zwischen 24 und 180 Monaten – abhängig von Ihrer Bonität und Ihrem Einkommen.'
    },
    {
      q: 'In welchen Bundesländern sind Sie tätig?',
      a: 'Wir sind österreichweit tätig – von Wien bis Vorarlberg. Alle Bundesländer werden durch unser Netzwerk abgedeckt.'
    },
    {
      q: 'Was ist der Unterschied zwischen Kreditvermittlung und direktem Bankkredit?',
      a: 'Als unabhängiger Kreditvermittler vergleichen wir Angebote von über 20 Banken und finden für Sie die günstigsten Konditionen – ohne dass Sie selbst aufwändig vergleichen müssen.'
    },
    {
      q: 'Ist die Anfrage auch telefonisch möglich?',
      a: 'Selbstverständlich. Sie können uns telefonisch, per E-Mail oder über unser Online-Formular kontaktieren – ganz wie es Ihnen am liebsten ist.'
    }
  ];

  var faqColLeft  = document.getElementById('faq-col-left');
  var faqColRight = document.getElementById('faq-col-right');

  function buildFAQItem(faq, idx) {
    var item = document.createElement('div');
    item.className = 'faq-item closed';

    // Button (question row)
    var btn = document.createElement('button');
    btn.className = 'faq-question';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'faq-ans-' + idx);

    var qText = document.createElement('span');
    qText.className = 'faq-question-text';
    qText.textContent = faq.q;

    var toggle = document.createElement('span');
    toggle.className = 'faq-toggle';
    toggle.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';

    btn.appendChild(qText);
    btn.appendChild(toggle);

    // Answer panel
    var answer = document.createElement('div');
    answer.className = 'faq-answer';
    answer.id = 'faq-ans-' + idx;
    answer.style.maxHeight = '0';

    var inner = document.createElement('div');
    inner.className = 'faq-answer-inner';

    var divider = document.createElement('div');
    divider.className = 'faq-divider';

    var p = document.createElement('p');
    p.className = 'faq-answer-text';
    p.textContent = faq.a;

    inner.appendChild(divider);
    inner.appendChild(p);
    answer.appendChild(inner);

    item.appendChild(btn);
    item.appendChild(answer);

    // Toggle logic
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        openItem.classList.replace('open', 'closed');
        openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        openItem.querySelector('.faq-answer').style.maxHeight = '0';
      });

      if (!isOpen) {
        item.classList.replace('closed', 'open');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = inner.scrollHeight + 24 + 'px';
      }
    });

    return item;
  }

  if (faqColLeft && faqColRight) {
    var half = Math.ceil(faqs.length / 2);
    faqs.forEach(function (faq, i) {
      var el = buildFAQItem(faq, i);
      el.setAttribute('data-aos', 'fade-up');
      el.setAttribute('data-aos-delay', String((i % half) * 60));
      (i < half ? faqColLeft : faqColRight).appendChild(el);
    });
    if (typeof AOS !== 'undefined') AOS.refresh();
  }


  /* ──────────────────────────────────────────────────────────
     7. SMOOTH SCROLL
  ────────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (!href || href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var headerH = header ? header.offsetHeight : 0;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - headerH - 16, behavior: 'smooth' });
    });
  });

})();
