/* ================================================================
   SCRIPT: script.js
   PAGE: services_or_products.html (Products page)
   AUTHOR: [Palesa Dikolane] 
   MODULE: WEDE5020 — Part 3

   WHAT THIS FILE DOES:
   1. Product Search & Category Filter — lets a visitor type a
      keyword or click a category button to show/hide product
      sections without reloading the page (dynamic content).
   2. Image Gallery Lightbox — clicking any product image opens
      a full-screen viewer with next/previous navigation.
   3. FAQ Accordion — expands/collapses answers when a question
      is clicked.
   4. Scroll Animations — product and FAQ sections fade/slide in
      as the visitor scrolls down the page (IntersectionObserver).
   ================================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ==============================================================
     0. MOBILE NAVIGATION MENU TOGGLE
     The .menu-toggle button (hamburger) is shown on tablet and
     mobile via CSS. Clicking it toggles the .navigation nav open
     and closed. Clicking a nav link or outside the header closes
     the menu automatically.
     ============================================================== */
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu    = document.querySelector('.navigation');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('nav-open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      menuToggle.textContent = isOpen ? '\u2715' : '\u2630';
    });

    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('nav-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = '\u2630';
      });
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('header')) {
        navMenu.classList.remove('nav-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = '\u2630';
      }
    });
  }


  /* ==============================================================
     1. PRODUCT SEARCH & CATEGORY FILTER
     ============================================================== */
  const searchInput   = document.getElementById('productSearch');
  const filterButtons  = document.querySelectorAll('.filter-btn');
  const productSections = document.querySelectorAll('.product-section');
  const noResultsMsg   = document.getElementById('noResultsMessage');

  // Tracks which category button is currently active ("all" by default)
  let activeCategory = 'all';

  // Re-runs every time the search box OR a filter button changes
  function applyProductFilter() {
    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
    let visibleCount = 0;

    productSections.forEach(function (section) {
      const sectionCategory = section.dataset.category || '';
      const matchesCategory = (activeCategory === 'all' || sectionCategory === activeCategory);

      // Search across the section's heading, overview text and list items
      const sectionText = section.textContent.toLowerCase();
      const matchesSearch = (searchTerm === '' || sectionText.includes(searchTerm));

      const isVisible = matchesCategory && matchesSearch;
      section.classList.toggle('filtered-out', !isVisible);
      if (isVisible) visibleCount++;
    });

    // Show a friendly message if the search/filter combination matches nothing
    if (noResultsMsg) {
      noResultsMsg.hidden = visibleCount !== 0;
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyProductFilter);
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      activeCategory = btn.dataset.filter;
      applyProductFilter();
    });
  });


  /* ==============================================================
     2. IMAGE GALLERY LIGHTBOX
     ============================================================== */
  const galleryImages = Array.from(document.querySelectorAll('img.style'));
  const lightbox       = document.getElementById('lightbox');
  const lightboxImg     = document.querySelector('.lightbox-img');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxClose   = document.querySelector('.lightbox-close');
  const lightboxPrev    = document.querySelector('.lightbox-prev');
  const lightboxNext    = document.querySelector('.lightbox-next');

  let currentImageIndex = 0;

  function openLightbox(index) {
    currentImageIndex = index;
    updateLightboxImage();
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open'); // stops background scrolling
    lightboxClose.focus(); // accessibility: move focus into the dialog
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove('lightbox-open');
  }

  function updateLightboxImage() {
    const img = galleryImages[currentImageIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = img.alt;
  }

  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightboxImage();
  }

  function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
  }

  if (lightbox && galleryImages.length > 0) {
    galleryImages.forEach(function (img, index) {
      img.style.cursor = 'zoom-in';
      img.setAttribute('tabindex', '0'); // keyboard-focusable
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', 'View larger image: ' + img.alt);

      img.addEventListener('click', function () { openLightbox(index); });
      img.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(index);
        }
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', showNextImage);
    lightboxPrev.addEventListener('click', showPrevImage);

    // Click on the dark overlay (but not the image itself) closes the lightbox
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard support: Escape closes, arrow keys navigate
    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNextImage();
      if (e.key === 'ArrowLeft') showPrevImage();
    });
  }


  /* ==============================================================
     3. FAQ ACCORDION
     ============================================================== */
  const accordionTriggers = document.querySelectorAll('.accordion-trigger');

  accordionTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      const panel = trigger.nextElementSibling;
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Close any other open accordion item first (single-open accordion)
      accordionTriggers.forEach(function (otherTrigger) {
        otherTrigger.setAttribute('aria-expanded', 'false');
        otherTrigger.nextElementSibling.style.maxHeight = null;
        otherTrigger.classList.remove('open');
      });

      // Then re-open this one only if it was previously closed
      if (!isOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        trigger.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });


  /* ==============================================================
     4. SCROLL ANIMATIONS (fade + slide in as sections enter view)
     ============================================================== */
  const animatedSections = document.querySelectorAll('.fade-in-section');

  if ('IntersectionObserver' in window && animatedSections.length > 0) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once only
        }
      });
    }, { threshold: 0.15 });

    animatedSections.forEach(function (section) { observer.observe(section); });
  } else {
    // Fallback for very old browsers without IntersectionObserver support
    animatedSections.forEach(function (section) { section.classList.add('visible'); });
  }

});
