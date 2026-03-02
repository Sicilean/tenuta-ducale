/* =============================================
   TENUTA DUCALE - Main Script
   =============================================
   Funzionalità:
   1. Navbar scroll (transparent → white)
   2. Mobile menu toggle
   3. Cookie banner + settings button
   4. Gallery lightbox
   5. Scroll-reveal animations
   6. Form honeypot validation
   7. Multilingua IT/EN
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------
     1. Navbar Scroll Behavior
     ------------------------------------------ */
  const navbar = document.querySelector('.navbar');

  function handleNavbarScroll() {
    if (!navbar) return;
    const scrolled = window.scrollY > 60;
    navbar.classList.toggle('navbar--scrolled', scrolled);
    navbar.classList.toggle('navbar--transparent', !scrolled);
  }

  handleNavbarScroll();
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  /* ------------------------------------------
     2. Mobile Menu
     ------------------------------------------ */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('.mobile-menu__link') : [];

  function toggleMobileMenu() {
    if (!hamburger || !mobileMenu) return;
    const isOpen = mobileMenu.classList.toggle('mobile-menu--open');
    hamburger.classList.toggle('hamburger--active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', String(isOpen));
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu && mobileMenu.classList.contains('mobile-menu--open')) {
        toggleMobileMenu();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('mobile-menu--open')) {
      toggleMobileMenu();
    }
  });

  /* ------------------------------------------
     3. Cookie Banner
     ------------------------------------------ */
  const cookieBanner = document.querySelector('.cookie-banner');
  const cookieAccept = document.querySelector('.cookie-btn--accept');
  const cookieReject = document.querySelector('.cookie-btn--reject');
  const cookieSettingsBtn = document.querySelector('.cookie-settings-btn');

  function showCookieBanner() {
    if (cookieBanner) {
      setTimeout(() => cookieBanner.classList.add('cookie-banner--visible'), 600);
    }
  }

  function hideCookieBanner() {
    if (cookieBanner) {
      cookieBanner.classList.remove('cookie-banner--visible');
    }
  }

  function setCookieConsent(value) {
    localStorage.setItem('cookieConsent', value);
    hideCookieBanner();
  }

  if (!localStorage.getItem('cookieConsent')) {
    showCookieBanner();
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => setCookieConsent('accepted'));
  }
  if (cookieReject) {
    cookieReject.addEventListener('click', () => setCookieConsent('rejected'));
  }
  if (cookieSettingsBtn) {
    cookieSettingsBtn.addEventListener('click', () => {
      localStorage.removeItem('cookieConsent');
      showCookieBanner();
    });
  }

  /* ------------------------------------------
     4. Gallery Lightbox
     ------------------------------------------ */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('.lightbox__img') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox__close') : null;
  const lightboxPrev = lightbox ? lightbox.querySelector('.lightbox__prev') : null;
  const lightboxNext = lightbox ? lightbox.querySelector('.lightbox__next') : null;
  const galleryItems = document.querySelectorAll('.gallery-item img');
  let currentIndex = 0;

  function openLightbox(index) {
    if (!lightbox || !lightboxImg || !galleryItems.length) return;
    currentIndex = index;
    lightboxImg.src = galleryItems[index].src;
    lightboxImg.alt = galleryItems[index].alt;
    lightbox.classList.add('lightbox--open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('lightbox--open');
    document.body.style.overflow = '';
  }

  function navigateLightbox(dir) {
    if (!galleryItems.length) return;
    currentIndex = (currentIndex + dir + galleryItems.length) % galleryItems.length;
    lightboxImg.src = galleryItems[currentIndex].src;
    lightboxImg.alt = galleryItems[currentIndex].alt;
  }

  galleryItems.forEach((img, i) => {
    const item = img.closest('.gallery-item');
    if (item) {
      item.addEventListener('click', () => openLightbox(i));
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', img.alt || 'Apri immagine galleria');
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
      });
    }
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox(1));

  if (lightbox) {
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('lightbox--open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    });
  }

  /* ------------------------------------------
     5. Gallery Carousel Nav (mobile)
     ------------------------------------------ */
  const galleryGrid = document.querySelector('.gallery-grid');
  const galleryPrev = document.querySelector('.gallery-nav__prev');
  const galleryNext = document.querySelector('.gallery-nav__next');

  if (galleryGrid && galleryPrev && galleryNext) {
    function scrollGallery(dir) {
      const item = galleryGrid.querySelector('.gallery-item');
      if (!item) return;
      const scrollAmount = item.offsetWidth + 12;
      galleryGrid.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' });
    }

    galleryPrev.addEventListener('click', () => scrollGallery(-1));
    galleryNext.addEventListener('click', () => scrollGallery(1));
  }

  /* ------------------------------------------
     6. Scroll-reveal Animations
     ------------------------------------------ */
  const fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window && fadeEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => observer.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ------------------------------------------
     6. Form Honeypot Validation
     ------------------------------------------ */
  document.querySelectorAll('.contact-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      const honey = form.querySelector('[name="_honey"]');
      if (honey && honey.value) {
        e.preventDefault();
      }
    });
  });

  /* ------------------------------------------
     7. Multilingua IT/EN
     ------------------------------------------ */
  const langToggles = document.querySelectorAll('.lang-toggle');

  function switchLanguage(lang) {
    /* textContent */
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (lang === 'en' && TRANSLATIONS_EN[key]) {
        if (!el.hasAttribute('data-i18n-it')) {
          el.setAttribute('data-i18n-it', el.textContent);
        }
        el.textContent = TRANSLATIONS_EN[key];
      } else if (lang === 'it') {
        const orig = el.getAttribute('data-i18n-it');
        if (orig !== null) el.textContent = orig;
      }
    });

    /* innerHTML (per link interni al testo) */
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (lang === 'en' && TRANSLATIONS_EN[key]) {
        if (!el.hasAttribute('data-i18n-html-it')) {
          el.setAttribute('data-i18n-html-it', el.innerHTML);
        }
        el.innerHTML = TRANSLATIONS_EN[key];
      } else if (lang === 'it') {
        const orig = el.getAttribute('data-i18n-html-it');
        if (orig !== null) el.innerHTML = orig;
      }
    });

    /* placeholder */
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      if (lang === 'en' && TRANSLATIONS_EN[key]) {
        if (!el.hasAttribute('data-i18n-ph-it')) {
          el.setAttribute('data-i18n-ph-it', el.placeholder);
        }
        el.placeholder = TRANSLATIONS_EN[key];
      } else if (lang === 'it') {
        const orig = el.getAttribute('data-i18n-ph-it');
        if (orig !== null) el.placeholder = orig;
      }
    });

    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);

    langToggles.forEach(btn => {
      btn.textContent = lang === 'it' ? 'EN' : 'IT';
      btn.setAttribute('aria-label',
        lang === 'it' ? 'Switch to English' : "Passa all'italiano"
      );
    });
  }

  langToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const cur = document.documentElement.lang || 'it';
      switchLanguage(cur === 'it' ? 'en' : 'it');
    });
  });

  if (localStorage.getItem('lang') === 'en') {
    switchLanguage('en');
  }

});

/* =============================================
   Traduzioni EN
   ============================================= */
const TRANSLATIONS_EN = {

  /* --- Navigazione --- */
  'nav.home': 'Home',
  'nav.about': 'About Us',
  'nav.oil': 'The Oil',
  'nav.contact': 'Contact',

  /* --- Hero Home --- */
  'hero.home.title': 'Family Olive Oil, Organic',
  'hero.home.subtitle': 'From Valle del Belice, an extra virgin olive oil that tells the story of our land and our family.',
  'hero.home.cta': 'Discover Our Oil',

  /* --- Home: Intro --- */
  'home.intro.title': 'Our Promise',
  'home.intro.text': 'Tenuta Ducale is a small family-run farm in the heart of Valle del Belice, Sicily. For generations, we have cultivated the land with respect and dedication, producing organic extra virgin olive oil from Nocellara del Belice olives — a genuine, traceable product rooted in its territory.',
  'home.intro.cta': 'Learn more about us',

  /* --- Home: Olio --- */
  'home.oil.title': 'Our Extra Virgin Olive Oil',
  'home.oil.subtitle': 'Meticulous care in every phase, from harvest to bottle.',
  'home.oil.f1.title': 'Organic',
  'home.oil.f1.text': 'Certified organic farming, in harmony with nature and respecting biodiversity.',
  'home.oil.f2.title': 'Nocellara del Belice',
  'home.oil.f2.text': 'An indigenous Sicilian cultivar, renowned for its extraordinary organoleptic qualities.',
  'home.oil.f3.title': 'Cold Pressed',
  'home.oil.f3.text': 'Cold extraction within hours of harvest to preserve all nutritional and sensory properties.',
  'home.oil.cta': 'Discover the oil',

  /* --- Home: Territorio --- */
  'home.territory.title': 'The Territory',
  'home.territory.p1': 'Valle del Belice, in western Sicily, is a land of ancient beauty where olive growing has centuries-old roots. The characteristic reddish earth, Mediterranean climate, and sea breezes create the ideal conditions for cultivating Nocellara del Belice.',
  'home.territory.p2': 'Our olive groves stretch across these hills, where each tree tells a story of dedication and respect for nature.',

  /* --- Home: Gallery --- */
  'home.gallery.title': 'Our Gallery',
  'home.gallery.subtitle': 'Images from our land, our olive groves, and our production.',

  /* --- Form (tutte le pagine) --- */
  'form.title': 'Write to Us',
  'form.subtitle': 'Do you have questions or want to know more about our products? Contact us — we will be happy to answer.',
  'form.name': 'Name',
  'form.email': 'Email',
  'form.phone': 'Phone',
  'form.message': 'Message',
  'form.whatsapp': 'You can contact me on WhatsApp',
  'form.submit': 'Send Message',
  'form.name.ph': 'Your name',
  'form.email.ph': 'Your email address',
  'form.phone.ph': 'Your phone number',
  'form.message.ph': 'Your message…',

  /* --- Footer --- */
  'footer.tagline': 'Family olive oil, organic',
  'footer.nav': 'Navigation',
  'footer.legal': 'Legal',
  'footer.contact': 'Contact',
  'footer.privacy': 'Privacy Policy',
  'footer.cookie': 'Cookie Policy',
  'footer.rights': 'All rights reserved.',
  'footer.developed': 'Developed by',

  /* --- Cookie Banner --- */
  'cookie.text': 'We use cookies to improve your browsing experience. <a href="cookie-policy.html">More info</a>',
  'cookie.accept': 'Accept',
  'cookie.reject': 'Reject',

  /* --- Chi Siamo --- */
  'hero.about.title': 'About Us',
  'hero.about.subtitle': 'A family, a land, a passion.',
  'about.story.title': 'Our Story',
  'about.story.p1': 'The history of Tenuta Ducale has its roots in the ancient ruins of Valle del Belice, where our grandparents and great-grandparents, tireless farmers, immediately recognised the value of the lands with their typical reddish colour.',
  'about.story.p2': 'Over time, the family worked in various areas of agriculture — from wheat during the First World War to citrus fruits and, in the 1950s–60s, viticulture.',
  'about.story.p3': 'The proximity of the sea and the salty winds revealed a particular vocation of these lands for cultivating Nocellara del Belice olive groves, leading to the transformation of vine rows into olive trees.',
  'about.story.p4': 'Today, in the small family-run farm named after the ancient Palazzo Ducale, father Nino\'s commitment is dedicated to the revaluation of Belice olive growing with new planting, cultivation and production techniques, to bring the "green nectar" of our ancestors to the table.',
  'about.values.title': 'Our Values',
  'about.v1.title': 'Quality',
  'about.v1.text': 'Meticulous care of the product at every stage, from harvest to bottle.',
  'about.v2.title': 'Love for the Land',
  'about.v2.text': 'Deep connection with the territory and respect for its natural rhythms.',
  'about.v3.title': 'Family Tradition',
  'about.v3.text': 'Continuity between generations, preserving ancestral knowledge.',
  'about.v4.title': 'Organic Agriculture',
  'about.v4.text': 'Commitment to the environment, people and biodiversity.',
  'about.philosophy.title': 'Our Philosophy',
  'about.philosophy.p1': 'Our production philosophy combines love for the land, respect for the environment and protection of biodiversity, which we preserve through the cultivation of the indigenous Nocellara del Belice cultivar.',
  'about.philosophy.p2': 'As a company, and even before that as people, we believe in bio-sustainable agriculture that respects the environment and people. Every day we work to improve our cultivation techniques, produce more responsibly, and bring customers closer to understanding our production.',

  /* --- L'Olio --- */
  'hero.oil.title': 'The Oil',
  'hero.oil.subtitle': 'Organic extra virgin olive oil from Nocellara del Belice',
  'oil.intro.title': 'Our Extra Virgin Olive Oil',
  'oil.intro.p1': 'Tenuta Ducale extra virgin olive oil is the result of centuries-old passion and the care we put into every phase of production. From the careful selection of olives to cold pressing, every step is designed to preserve the authenticity and quality of our product.',
  'oil.intro.p2': 'Our oil is characterised by an intense fruity flavour, with notes of fresh herbs and a pleasant almond aftertaste. The golden-green colour tells of the richness of the Sicilian land.',
  'oil.nocellara.title': 'Nocellara del Belice',
  'oil.nocellara.p1': 'Nocellara del Belice is an indigenous Sicilian olive cultivar, considered one of the finest in the world. Originally from the Valle del Belice area, this variety produces olives of extraordinary quality.',
  'oil.nocellara.p2': 'The extra virgin olive oil obtained is distinguished by its low acidity, high polyphenol content, and a balanced flavour profile combining fruity, bitter and spicy notes.',
  'oil.process.title': 'From Field to Bottle',
  'oil.step1.title': 'Harvest',
  'oil.step1.text': 'Olives are carefully hand-picked at the optimal ripeness to ensure the highest quality.',
  'oil.step2.title': 'Pressing',
  'oil.step2.text': 'Cold extraction within hours of harvest preserves all organoleptic and nutritional properties.',
  'oil.step3.title': 'Storage',
  'oil.step3.text': 'The oil is stored in stainless steel tanks at controlled temperature, away from light.',
  'oil.step4.title': 'Bottling',
  'oil.step4.text': 'Bottled in dark glass to protect from light and preserve freshness and flavour.',

  /* --- Contatti --- */
  'hero.contact.title': 'Contact Us',
  'hero.contact.subtitle': 'We are here for you',
  'contact.info.title': 'How to Reach Us',
  'contact.info.text': 'For information about our products, orders or visits to our farm, do not hesitate to contact us.',
  'contact.email': 'Email',
  'contact.phone': 'Phone',
  'contact.address': 'Address',
  'contact.hours': 'Hours',
  'contact.hours.text': 'Mon–Sat: 9:00 – 18:00',
};
