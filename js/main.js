/* ============================================================
   Austro Kredit – main.js
   Vanilla JS – no build step required
   ============================================================ */

(function () {
    'use strict';

    /* ── CONFIG – all magic numbers in one place ─────────────── */
    var CONFIG = {
        SCROLL_THRESHOLD_PX:  40,     // header gets .scrolled
        COUNTUP_DURATION_MS:  1800,   // count-up animation length
        AUTOPLAY_MS:          5000,   // testimonial autoplay interval
        SWIPE_THRESHOLD_PX:   50,     // min swipe distance for carousel
        LOAN_RATE_FACTOR:     1.069,  // effective annual rate (6.9%)
        LOAN_RATE_DISPLAY:    '6,9',  // display string (de-AT format)
        IO_THRESHOLD:         0.3,    // IntersectionObserver threshold
        AOS_OFFSET:           60,
        AOS_DURATION:         550,
    };


    /* ──────────────────────────────────────────────────────────
       1. AOS INIT
    ────────────────────────────────────────────────────────── */
    document.addEventListener('DOMContentLoaded', function () {
        if (typeof AOS !== 'undefined') {
            AOS.init({ once: true, offset: CONFIG.AOS_OFFSET, duration: CONFIG.AOS_DURATION });
        }
    });


    /* ──────────────────────────────────────────────────────────
       2. HEADER – scroll backdrop + light/dark switching + mobile menu
    ────────────────────────────────────────────────────────── */
    var header    = document.getElementById('site-header');
    var hamburger = document.getElementById('hamburger-btn');
    var mobileMenu  = document.getElementById('mobile-menu');
    var backdrop    = document.getElementById('mobile-backdrop');
    var hamIcon     = document.getElementById('hamburger-icon');
    var closeIcon   = document.getElementById('close-icon');

    window.addEventListener('scroll', function () {
        if (!header) return;
        header.classList.toggle('scrolled', window.scrollY > CONFIG.SCROLL_THRESHOLD_PX);
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

    // Cache selector — avoids repeated DOM query on every input event
    var mutedDisplayEls = document.querySelectorAll('.form-display.muted');

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

        var monthly = (amount / months) * CONFIG.LOAN_RATE_FACTOR;
        if (rateDisplay) rateDisplay.textContent = monthly.toLocaleString('de-AT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (rateHint)    rateHint.textContent = 'Eff. Jahreszins ca. ' + CONFIG.LOAN_RATE_DISPLAY + ' % p.a. – bonitätsabhängig';

        // Use cached reference — no DOM query on each event
        mutedDisplayEls.forEach(function (el) { el.classList.remove('muted'); });
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
        var duration = CONFIG.COUNTUP_DURATION_MS;
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
        }, { threshold: CONFIG.IO_THRESHOLD });
        countEls.forEach(function (el) { io.observe(el); });
    } else {
        countEls.forEach(runCountUp);
    }


    /* ──────────────────────────────────────────────────────────
       5. MARQUEE — clone Set A in JS so HTML only needs one set
    ────────────────────────────────────────────────────────── */
    var marqueeTrack = document.getElementById('marquee-track');
    if (marqueeTrack && marqueeTrack.children.length) {
        var setA = Array.from(marqueeTrack.children);
        setA.forEach(function (node) {
            marqueeTrack.appendChild(node.cloneNode(true));
        });
    }


    /* ──────────────────────────────────────────────────────────
       6. TESTIMONIALS CAROUSEL
    ────────────────────────────────────────────────────────── */
    var reviews = [
        {
            name: 'Martin K.',     city: 'Wien',      date: 'März 2024',
            rating: 5,
            text: 'Trotz KSV-Eintrag haben sie für mich eine Lösung gefunden. Sehr kompetent und diskret. Ich kann Austro Kredit nur weiterempfehlen!',
            bg: 'linear-gradient(135deg,#D40100,#B80000)'   /* brand red */
        },
        {
            name: 'Sandra M.',     city: 'Linz',      date: 'Januar 2024',
            rating: 5,
            text: 'Super schnelle Abwicklung! Anfrage gestellt, am nächsten Tag schon eine Rückmeldung erhalten. Der Kredit war innerhalb einer Woche auf meinem Konto.',
            bg: 'linear-gradient(135deg,#D40100,#B80000)'   /* brand red */
        },
        {
            name: 'Thomas B.',     city: 'Graz',      date: 'Februar 2024',
            rating: 5,
            text: 'Ich war skeptisch, aber das Team hat mich eines Besseren belehrt. Professionelle Beratung, keine versteckten Kosten, genau wie versprochen.',
            bg: 'linear-gradient(135deg,#D40100,#B80000)'   /* brand red */
        },
        {
            name: 'Claudia W.',    city: 'Salzburg',  date: 'April 2024',
            rating: 5,
            text: 'Bereits zum zweiten Mal in Anspruch genommen. Immer wieder top! Umschuldung hat uns monatlich über 200 € gespart. Danke!',
            bg: 'linear-gradient(135deg,#D40100,#B80000)'   /* brand red */
        },
        {
            name: 'Peter H.',      city: 'Innsbruck', date: 'Dezember 2023',
            rating: 5,
            text: 'Andere Banken haben mich abgewiesen – Austro Kredit hat Wege gefunden. Sehr empfehlenswert für alle, die Unterstützung brauchen.',
            bg: 'linear-gradient(135deg,#D40100,#B80000)'   /* brand red */
        }
    ];

    var reviewDisplay      = document.getElementById('review-display');
    var reviewDotsWrap     = document.getElementById('review-dots');
    var btnPrev            = document.getElementById('review-prev');
    var btnNext            = document.getElementById('review-next');
    var btnPrevMobile      = document.getElementById('review-prev-mobile');
    var btnNextMobile      = document.getElementById('review-next-mobile');
    var testimonialsSlider = document.getElementById('testimonials-slider');

    var currentIdx = 0;
    var timer      = null;

    /* Build a single star SVG element (safe, no innerHTML) */
    function createStarSVG() {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '14'); svg.setAttribute('height', '14');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', '#D40100'); svg.setAttribute('stroke', '#D40100');
        svg.setAttribute('stroke-width', '1');
        var poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        poly.setAttribute('points', '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2');
        svg.appendChild(poly);
        return svg;
    }

    /* Build quote icon SVG element */
    function createQuoteIcon() {
        var wrap = document.createElement('div');
        wrap.className = 'review-quote-icon';
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '56'); svg.setAttribute('height', '56');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'currentColor'); svg.setAttribute('stroke', 'none');
        var p1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p1.setAttribute('d', 'M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z');
        var p2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p2.setAttribute('d', 'M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z');
        svg.appendChild(p1); svg.appendChild(p2);
        wrap.appendChild(svg);
        return wrap;
    }

    /* Build check SVG for "Verifiziert" badge */
    function createCheckSVG() {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '13'); svg.setAttribute('height', '13');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none'); svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '1.5');
        svg.setAttribute('stroke-linecap', 'round'); svg.setAttribute('stroke-linejoin', 'round');
        var p1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p1.setAttribute('d', 'M22 11.08V12a10 10 0 1 1-5.93-9.14');
        var p2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p2.setAttribute('d', 'm9 11 3 3L22 4');
        svg.appendChild(p1); svg.appendChild(p2);
        return svg;
    }

    /* Build review card using DOM API — safe, no innerHTML string concat */
    function createReviewCard(r) {
        var initials = r.name.split(' ').map(function (w) { return w[0]; }).join('');

        /* Root card */
        var card = document.createElement('div');
        card.className = 'review-card';

        /* Accent strip */
        var strip = document.createElement('div');
        strip.className = 'review-accent-strip';
        strip.style.background = 'linear-gradient(to bottom, var(--brand), transparent)';
        card.appendChild(strip);

        /* Body */
        var body = document.createElement('div');
        body.className = 'review-body';

        /* Author column */
        var author = document.createElement('div');
        author.className = 'review-author';

        var avatar = document.createElement('div');
        avatar.className = 'review-avatar';
        avatar.style.background = r.bg;
        avatar.textContent = initials;
        author.appendChild(avatar);

        var authorInfo = document.createElement('div');
        authorInfo.className = 'review-author-info';

        var nameEl = document.createElement('div');
        nameEl.className = 'name';
        nameEl.textContent = r.name;
        authorInfo.appendChild(nameEl);

        var locEl = document.createElement('div');
        locEl.className = 'review-location';

        var dot = document.createElement('div');
        dot.className = 'dot';
        dot.style.background = 'var(--navy)';
        locEl.appendChild(dot);

        var locSpan = document.createElement('span');
        locSpan.textContent = r.city + '  ·  ' + r.date;
        locEl.appendChild(locSpan);
        authorInfo.appendChild(locEl);
        author.appendChild(authorInfo);

        /* Stars */
        var starsEl = document.createElement('div');
        starsEl.className = 'review-stars';
        for (var i = 0; i < r.rating; i++) starsEl.appendChild(createStarSVG());
        author.appendChild(starsEl);

        /* Verified badge */
        var verifiedEl = document.createElement('div');
        verifiedEl.className = 'review-verified';
        verifiedEl.appendChild(createCheckSVG());
        var verSpan = document.createElement('span');
        verSpan.textContent = 'Verifiziert';
        verifiedEl.appendChild(verSpan);
        author.appendChild(verifiedEl);

        body.appendChild(author);

        /* Vertical divider */
        var divider = document.createElement('div');
        divider.className = 'review-divider-v';
        body.appendChild(divider);

        /* Content column */
        var content = document.createElement('div');
        content.className = 'review-content';

        content.appendChild(createQuoteIcon());

        var textEl = document.createElement('p');
        textEl.className = 'review-text';
        textEl.textContent = r.text;  // textContent — XSS safe
        content.appendChild(textEl);

        var progress = document.createElement('div');
        progress.className = 'review-progress';
        var bar = document.createElement('div');
        bar.className = 'review-progress-bar playing';
        bar.id = 'review-progress-bar';
        progress.appendChild(bar);
        content.appendChild(progress);

        body.appendChild(content);
        card.appendChild(body);
        return card;
    }

    function renderReview(idx) {
        if (!reviewDisplay) return;
        reviewDisplay.innerHTML = '';
        reviewDisplay.appendChild(createReviewCard(reviews[idx]));
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
        timer = setInterval(function () { goTo(currentIdx + 1); }, CONFIG.AUTOPLAY_MS);
    }

    if (reviewDisplay) {
        renderReview(0);
        renderDots();
        timer = setInterval(function () { goTo(currentIdx + 1); }, CONFIG.AUTOPLAY_MS);

        if (btnPrev)       btnPrev.addEventListener('click',       function () { goTo(currentIdx - 1); });
        if (btnNext)       btnNext.addEventListener('click',       function () { goTo(currentIdx + 1); });
        if (btnPrevMobile) btnPrevMobile.addEventListener('click', function () { goTo(currentIdx - 1); });
        if (btnNextMobile) btnNextMobile.addEventListener('click', function () { goTo(currentIdx + 1); });

        if (testimonialsSlider) {
            testimonialsSlider.addEventListener('mouseenter', function () { clearInterval(timer); });
            testimonialsSlider.addEventListener('mouseleave', function () {
                timer = setInterval(function () { goTo(currentIdx + 1); }, CONFIG.AUTOPLAY_MS);
            });
        }

        /* Touch swipe */
        var tx = 0;
        reviewDisplay.addEventListener('touchstart', function (e) { tx = e.changedTouches[0].clientX; }, { passive: true });
        reviewDisplay.addEventListener('touchend',   function (e) {
            var dx = e.changedTouches[0].clientX - tx;
            if (Math.abs(dx) > CONFIG.SWIPE_THRESHOLD_PX) dx < 0 ? goTo(currentIdx + 1) : goTo(currentIdx - 1);
        }, { passive: true });
    }


    /* ──────────────────────────────────────────────────────────
       7. FAQ ACCORDION
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

    /* Track currently open item — avoids querySelectorAll on every click */
    var openFaqItem = null;

    function buildFAQItem(faq, idx) {
        var item = document.createElement('div');
        item.className = 'faq-item closed';

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

        btn.addEventListener('click', function () {
            var isOpen = item.classList.contains('open');

            /* Close currently open item — O(1), no DOM query */
            if (openFaqItem && openFaqItem !== item) {
                openFaqItem.classList.replace('open', 'closed');
                openFaqItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                openFaqItem.querySelector('.faq-answer').style.maxHeight = '0';
                openFaqItem = null;
            }

            if (!isOpen) {
                item.classList.replace('closed', 'open');
                btn.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = inner.scrollHeight + 24 + 'px';
                openFaqItem = item;
            } else {
                item.classList.replace('open', 'closed');
                btn.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = '0';
                openFaqItem = null;
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
       8. SMOOTH SCROLL — event delegation (one listener vs N)
    ────────────────────────────────────────────────────────── */
    document.addEventListener('click', function (e) {
        var anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;
        var href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        var headerH = header ? header.offsetHeight : 0;
        window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - headerH - 16,
            behavior: 'smooth'
        });
    });

    /* ── Mobile touch-active feedback (hover equivalent) ──────
       Adds .touch-active for 350ms after tap so CSS hover effects
       are visible on touch devices.
    ─────────────────────────────────────────────────────────── */
    (function () {
        if (!('ontouchstart' in window)) return;

        var CARD_SEL = [
            '.service-card',
            '.step-card',
            '.feature-card',
            '.problem-card',
            '.stat-card',
            '.solution-card',
            '.mini-feature'
        ].join(', ');

        var activeEl = null;
        var timer    = null;

        function deactivate(el) {
            el.classList.remove('touch-active');
            if (activeEl === el) activeEl = null;
        }

        document.querySelectorAll(CARD_SEL).forEach(function (el) {
            el.addEventListener('touchstart', function () {
                /* clear previous card */
                if (activeEl && activeEl !== el) {
                    clearTimeout(timer);
                    deactivate(activeEl);
                }
                el.classList.add('touch-active');
                activeEl = el;
            }, { passive: true });

            el.addEventListener('touchend', function () {
                timer = setTimeout(function () { deactivate(el); }, 350);
            }, { passive: true });

            el.addEventListener('touchcancel', function () {
                clearTimeout(timer);
                deactivate(el);
            }, { passive: true });
        });
    }());

})();
