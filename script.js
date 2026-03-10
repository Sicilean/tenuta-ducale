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
  'hero.home.title': 'Tenuta Ducale',
  'hero.home.subtitle': 'Loving Passion',
  'hero.home.cta': 'Discover Our Oil',

  /* --- Home: Intro --- */
  'home.intro.title': 'Our Passion',
  'home.intro.text': 'We have been producing quality extra virgin olive oil for generations, focusing on quality and the genuineness of the essential ingredient: love for our land. A tradition passed down from father to son, a passion that gave birth to a unique and precious product.',
  'home.intro.cta': 'Learn more about us',

  /* --- Home: Olio --- */
  'home.oil.title': 'Our Extra Virgin Olive Oil',
  'home.oil.subtitle': 'Tenuta Ducale extra virgin olive oil, single-variety Nocellara Del Belice PGI Sicily Organic.',
  'home.oil.f1.title': 'Organic',
  'home.oil.f1.text': 'Certified organic farming, in harmony with nature and respecting biodiversity.',
  'home.oil.f2.title': 'Nocellara del Belice',
  'home.oil.f2.text': 'An indigenous Sicilian cultivar, renowned for its extraordinary organoleptic qualities.',
  'home.oil.f3.title': 'Cold Pressed',
  'home.oil.f3.text': 'Cold extraction within hours of harvest to preserve all nutritional and sensory properties.',
  'home.oil.cta': 'Discover the oil',

  /* --- Home: Video --- */
  'home.video.title': 'Loving Passion',

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
  'footer.tagline': 'Loving Passion',
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
  'hero.about.subtitle': 'A story to tell',
  'about.story.title': 'A Story to Tell',
  'about.story.p1': 'Our story has its roots in the ancient ruins of Valle del Belice. Our grandparents and great-grandparents, tireless farmers, immediately recognised the value of the lands with their typical reddish colour, which were cultivated with rudimentary tools.',
  'about.story.p2': 'We haven\'t always been olive growers. As true Sicilians, we worked in various fields of agriculture: growing wheat during the First World War, then turning to citrus fruits, and in the 1950s–60s using those same fields for viticulture.',
  'about.story.p3': 'The proximity of the sea and the salty winds proved particularly suited for cultivating Nocellara del Belice olive groves. With the passage of time and changing policies, our grandparents\' decision to transform entire rows of vines into olive trees was immediate. Thus the expansion of Nocellara del Belice in our territory has almost made other crops disappear, becoming the primary income and economy of the area.',
  'about.story.p4': 'In the early 2000s, Tenuta Ducale was born — a small family-run farm named after the ancient Palazzo Ducale, the hub of agricultural activities in our town and the birthplace of the company\'s founder. Today, father Nino\'s commitment is dedicated to the revaluation of Belice olive growing, using new planting, cultivation and production techniques. The fields that belonged to our ancestors now produce the green nectar that we proudly bring to your tables.',
  'about.values.title': 'Our Values',
  'about.v1.title': 'Organic & PGI',
  'about.v1.text': 'Certified organic and Protected Geographical Indication products: the guarantee of an oil of excellence in the European agri-food landscape.',
  'about.v2.title': 'Love for the Land',
  'about.v2.text': 'A deep bond with the reddish lands of Valle del Belice, respect for the environment, energy sources, and the natural rhythms of the territory.',
  'about.v3.title': 'Family Tradition',
  'about.v3.text': 'From tireless great-grandparent farmers to father Nino\'s daily commitment: generations passing down knowledge, passion and love for olive growing.',
  'about.v4.title': 'Superior Quality',
  'about.v4.text': 'Meticulous organoleptic and laboratory tests for every harvest, ensuring an oil well above the parameters of EEC regulation 2568/91.',
  'about.philosophy.title': 'Our Philosophy',
  'about.philosophy.p1': 'Our production philosophy goes hand in hand with love for the land, respect for the environment, energy sources and biodiversity; and it is precisely the latter that is guaranteed through the use of the indigenous Nocellara del Belice cultivar, which it is our duty to protect and respect.',
  'about.philosophy.p2': 'As a company, but above all as individuals, we firmly believe in bio-sustainable agriculture that respects the environment, but also people. This is why we commit every day to improving our cultivation techniques to produce more responsibly, seeking to bring customers closer to understanding our production, raising awareness of the value of quality and biodiversity.',
  'about.philosophy.p3': 'Climate change and soil desiccation have pushed us towards cultivation methods that aim to save natural resources and agriculture entirely free from pesticides. We use eco-compatible pest control techniques and best agricultural practice models, because we want to demonstrate that it is possible to produce in a healthy, responsible, and sustainable way.',
  'about.philosophy.p4': 'We are proud of the quality and uniqueness of our product, the result of careful selection and monitoring work. Every year we carry out meticulous organoleptic and laboratory tests to check each harvest, also highlighting the subtle differences attributable to pedoclimatic conditions.',
  'about.philosophy.p5': 'We are proud to offer our customers a superior quality oil. Thanks to this process of control and evaluation, we guarantee that our oil always meets the highest expectations, well above the parameters provided by EEC regulation 2568/91.',

  /* --- L'Olio --- */
  'hero.oil.title': 'The Oil',
  'hero.oil.subtitle': 'Organic extra virgin olive oil from Nocellara del Belice',
  'oil.intro.title': 'Our Extra Virgin Olive Oil',
  'oil.intro.p1': 'The unique flavour of Tenuta Ducale extra virgin olive oil is the result of care and attention that accompany every phase of its production. The oil comes exclusively from olives grown in our groves and hand-picked while still green, just at the beginning of the ripening phase (veraison), when the greatest accumulation of volatile compounds and polyphenols occurs.',
  'oil.intro.p2': 'Milling is carried out within a few hours of harvest and the oil is stored in stainless steel drums at controlled temperature, awaiting bottling, without undergoing any chemical treatment. This extra virgin olive oil is the fruit of artisanal work passed down through generations, giving life to a product of excellence.',
  'oil.nocellara.title': 'Our Trees',
  'oil.nocellara.p1': 'Our olive groves are exclusively Nocellara del Belice, an indigenous cultivar of the Valle del Belice, used both for oil production and as table olives.',
  'oil.nocellara.p2': 'The tree, sometimes centuries old, has self-incompatibility characteristics: in our plots it is possible to find pollinator plant varieties such as the Biancolilla cultivar, the Giarraffa, or even wild olive trees commonly called "Oleastro", so that the flowers — or "zagare" — of the plant can be pollinated, thus making olive oil production possible.',
  'oil.cert.title': 'Certifications & Analysis',
  'oil.cert.subtitle': 'Transparency and certified quality: view and download the chemical and sensory analyses of our oils, year by year.',
  'oil.chart1.title': 'Acidity & Peroxides',
  'oil.chart2.title': 'Total Polyphenols',
  'oil.chart3.title': 'Sensory Analysis',
  'oil.pdf.toggle': 'Download Analysis PDFs',
  'oil.process.title': 'From Field to Bottle',
  'oil.process.subtitle': 'Every drop tells the journey of our olives: from hand-picking to the mill, following the ancient family tradition.',
  'oil.step1.title': 'Harvest',
  'oil.step1.text': 'Our farm follows the ancient tradition of our grandparents. We harvest olives from October to November exclusively by hand-picking, using perforated crates (Bins) to promote ventilation during transport to the mill. The oil extraction process takes place within 12 hours of harvest, preserving intact aromas and prized organoleptic characteristics.',
  'oil.step2.title': 'Milling',
  'oil.step2.text': 'The milling process takes place in a modern mill with a continuous-cycle mechanical extraction system that guarantees the product\'s originality. Olives are unloaded into a collection tank and carried by a conveyor belt to a defoliator and a washing tank, then arrive perfectly clean to a crusher where they are transformed into paste.',
  'oil.step2.text2': 'The olive paste is fed into stainless steel gramolation tanks, where micro oil particles aggregate before passing to a centrifuge. Here begins the separation of water, oil, and pomace particles. This process takes on average 40–45 minutes, occurs in a near oxygen-free environment to prevent oxidation, and is carried out cold (temperature <27°C), monitored by instrumentation.',
  'oil.step3.title': 'Tree Rest',
  'oil.step3.text': 'Annually we carry out two pruning interventions: a more vigorous mechanical one immediately after harvest, using a chainsaw, removing the largest branches to control the shape and harmonious development of the tree; and a manual one in the spring period, after fruiting, to promote aeration and sun exposure of the fruits. In doing so, we control total production and reduce the risk of parasitic infestations, with a consequent increase in oil quality.',
  'oil.step4.title': 'Storage & Bottling',
  'oil.step4.text': 'The milled oil is stored in a cool, dry place away from light, in special stainless steel drums compliant with regulations. Our company does not use filtering: the oil is decanted naturally. This process, lasting about 30–35 days, allows the sediment to settle at the bottom of the container.',
  'oil.step4.text2': 'After this period, the oil is transferred to new stainless steel drums, separating it from the sediment so that its enzymes do not damage the oil\'s properties. Once this process is complete, we subject our product to careful chemical and sensory analyses to deliver it flawless directly to your tables.',
  /* --- Olio: Video Frantoio --- */
  'oil.video.title': 'The Art of Milling',

  'oil.tips.title': 'Tips',
  'oil.tips.p1': 'Our EVO is a superior quality oil, golden in colour with greenish reflections, with a medium-intense fruity flavour, featuring notes of tomato, almond, artichoke, fresh grass, and apple. Balanced in gustatory sensations, with medium-intensity spicy and bitter notes.',
  'oil.tips.p2': 'It lends itself well to being used raw on vegetables, salads, soups, pinzimonio, bruschetta, grilled meat and fish. We like to think that our EVO is the perfect pairing with traditional Belicina dishes. We are proud to offer our customers a genuine, high-quality product that can enhance the value and flavour of your dishes.',

  /* --- Contatti --- */
  'hero.contact.title': 'Contact Us',
  'hero.contact.subtitle': 'We are here for you',
  'contact.info.title': 'How to Reach Us',
  'contact.info.text': 'For information about our products, orders or visits to our farm, do not hesitate to contact us.',
  'contact.company': 'Company',
  'contact.email': 'Email',
  'contact.phone': 'Mobile',
  'contact.address': 'Address',
  'contact.social': 'Follow Us',
  'contact.awards.title': 'Publications & Awards',
  'contact.awards.subtitle': 'The recognitions that testify to the quality of our oil on the national and international stage.',
  'contact.awards.publications': 'Publications',
  'contact.awards.prizes': 'Awards',
  'contact.awards.certificates': 'Certificates & Diplomas',
  'contact.awards.oroitalia': "L'Oro d'Italia",

  /* --- Premi e Pubblicazioni --- */
  'awards.pub1.title': 'Slow Food Guide',
  'awards.pub2.title': 'Il Golosario',
  'awards.pub3.title': 'Publication',
  'awards.prize1.title': "Sol D'Oro",
  'awards.prize1.desc': "2nd International Sol D'Oro Competition",
  'awards.prize1.result': 'Grand Mention — intense fruity category',
  'awards.prize2.title': "Cibus Med — Leone d'Oro",
  'awards.prize2.desc': "12th International Leone d'Oro Competition of Master Olive Growers",
  'awards.prize2.result': '1st place — delicate fruity category',
  'awards.prize3.title': 'Festambiente — 16th Edition',
  'awards.prize3.desc': '9th National Exhibition for Extra Virgin Olive Oil',
  'awards.prize3.result': '3rd place — light fruity category',
  'awards.prize4.title': "L'Orciolo d'Oro",
  'awards.prize4.desc': '13th National Competition for Extra Virgin Olive Oils',

  /* --- Privacy Policy --- */
  'privacy.hero.title': 'Privacy Policy',
  'privacy.updated': '<strong>Last updated:</strong> March 2026',
  'privacy.intro': 'This privacy policy describes how Tenuta Ducale (hereinafter "we", "our" or "Tenuta Ducale") collects, uses and protects the personal information you provide through our website <strong>www.tenutaducale.com</strong>.',
  'privacy.s1.title': '1. Data Controller',
  'privacy.s1.p1': 'The data controller for personal data is:',
  'privacy.s1.list': '<li><strong>Company name:</strong> Az. Agricola Antonino Di Maria</li><li><strong>Address:</strong> Via G. Marconi n. 86, 91021 Campobello di Mazara (Trapani)</li><li><strong>VAT No.:</strong> 01486760810</li><li><strong>Tax Code:</strong> DMRNNN57C31B521N</li><li><strong>Email:</strong> <a href="mailto:info@tenutaducale.com">info@tenutaducale.com</a></li>',
  'privacy.s2.title': '2. Data Collected',
  'privacy.s2.p1': 'We collect the following categories of personal data:',
  'privacy.s2.list': '<li><strong>Contact data:</strong> name, email address, phone number, voluntarily provided through the contact form on the website.</li><li><strong>Browsing data:</strong> IP address, browser type, pages visited, visit duration, automatically collected through technical and analytical cookies (see our <a href="cookie-policy.html">Cookie Policy</a>).</li>',
  'privacy.s3.title': '3. Purpose of Processing',
  'privacy.s3.p1': 'Personal data is processed for the following purposes:',
  'privacy.s3.list': '<li>Responding to information requests sent through the contact form.</li><li>Improving the browsing experience and website functionality.</li><li>Complying with legal obligations.</li>',
  'privacy.s4.title': '4. Legal Basis',
  'privacy.s4.p1': 'The processing of personal data is based on:',
  'privacy.s4.list': '<li><strong>Consent:</strong> for sending communications through the contact form.</li><li><strong>Legitimate interest:</strong> for website improvement and aggregated traffic analysis.</li><li><strong>Legal obligation:</strong> for regulatory compliance.</li>',
  'privacy.s5.title': '5. Data Retention',
  'privacy.s5.p1': 'Personal data will be retained for the time strictly necessary to achieve the purposes for which it was collected and, in any case, not beyond the terms provided by current regulations.',
  'privacy.s6.title': '6. Data Sharing',
  'privacy.s6.p1': 'Personal data will not be shared with third parties, except for:',
  'privacy.s6.list': '<li>Technical service providers (e.g. hosting, email service) acting as data processors.</li><li>Competent authorities, when required by law.</li>',
  'privacy.s7.title': "7. Data Subject's Rights",
  'privacy.s7.p1': 'Under EU Regulation 2016/679 (GDPR), you have the right to:',
  'privacy.s7.list': '<li>Access your personal data.</li><li>Request rectification or deletion of data.</li><li>Restrict or object to processing.</li><li>Request data portability.</li><li>Withdraw consent at any time.</li><li>Lodge a complaint with the Data Protection Authority.</li>',
  'privacy.s7.p2': 'To exercise your rights, contact us at: <a href="mailto:info@tenutaducale.com">info@tenutaducale.com</a>',
  'privacy.s8.title': '8. Security',
  'privacy.s8.p1': 'We adopt adequate technical and organisational security measures to protect personal data from unauthorised access, loss, destruction or alteration.',
  'privacy.s9.title': '9. Changes to the Privacy Policy',
  'privacy.s9.p1': 'We reserve the right to update this policy. Any changes will be published on this page with an indication of the last update date.',

  /* --- Cookie Policy --- */
  'cookiep.hero.title': 'Cookie Policy',
  'cookiep.updated': '<strong>Last updated:</strong> March 2026',
  'cookiep.intro': 'This Cookie Policy explains what cookies are, how they are used by the website <strong>www.tenutaducale.com</strong> (hereinafter "the Site") managed by Tenuta Ducale, and how you can manage your preferences.',
  'cookiep.s1.title': '1. What Are Cookies',
  'cookiep.s1.p1': 'Cookies are small text files that are saved on your device (computer, smartphone, tablet) when you visit a website. They are used to store information about your visit, such as your language preferences and other settings, to make browsing easier and more personalised.',
  'cookiep.s2.title': '2. Types of Cookies Used',
  'cookiep.s2.h3a': 'Technical Cookies (necessary)',
  'cookiep.s2.p1': 'These are essential for the proper functioning of the Site. Without these cookies, the site may not work correctly. They include:',
  'cookiep.s2.list1': '<li><strong>cookieConsent:</strong> stores your choice regarding the acceptance or rejection of cookies. Duration: 365 days.</li><li><strong>lang:</strong> stores your language preference (Italian/English). Duration: persistent until manual deletion.</li>',
  'cookiep.s2.h3b': 'Analytical Cookies',
  'cookiep.s2.p2': 'Currently the Site does not use third-party analytical cookies. Should they be implemented in the future (e.g. Google Analytics), this policy will be updated accordingly and your consent will be requested before their activation.',
  'cookiep.s2.h3c': 'Profiling Cookies',
  'cookiep.s2.p3': 'The Site does not use profiling cookies.',
  'cookiep.s3.title': '3. Third-Party Cookies',
  'cookiep.s3.p1': 'The Site may include content or services provided by third parties (e.g. Google Fonts for typography). These services may set their own cookies. We invite you to consult the privacy policies of the respective providers:',
  'cookiep.s4.title': '4. How to Manage Cookies',
  'cookiep.s4.p1': 'You can manage your cookie preferences in several ways:',
  'cookiep.s4.list1': '<li><strong>Cookie banner:</strong> on your first visit to the Site, a banner is displayed that allows you to accept or reject cookies. You can change your preferences at any time by clicking the cookie settings icon (bottom left).</li><li><strong>Browser settings:</strong> you can configure your browser to block or delete cookies. Below are links to guides for the main browsers:</li>',
  'cookiep.s5.title': '5. Legal Basis',
  'cookiep.s5.p1': 'Technical cookies are installed on the basis of our legitimate interest in ensuring the proper functioning of the Site. For cookies that are not strictly necessary, we request your explicit consent through the cookie banner.',
  'cookiep.s6.title': '6. Updates',
  'cookiep.s6.p1': 'This Cookie Policy may be updated periodically. We invite you to visit this page regularly to stay informed of any changes.',
  'cookiep.s7.title': '7. Contact',
  'cookiep.s7.p1': 'For any questions regarding this Cookie Policy, you can contact us at: <a href="mailto:info@tenutaducale.com">info@tenutaducale.com</a>',
};
