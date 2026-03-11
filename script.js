/* ===== AMI Creative — Main Script ===== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Navbar scroll behavior ---
  const navbar = document.querySelector('.navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Active nav link on scroll ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');

  const updateActiveLink = () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  };
  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // --- Mobile menu ---
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // --- Scroll animations (Intersection Observer) ---
  const animateObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        animateObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('[data-animate], [data-animate-stagger]').forEach(el => {
    animateObserver.observe(el);
  });

  // --- Portfolio filter ---
  const filterTabs = document.querySelectorAll('.filter-tab');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;

      portfolioCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --- Gallery lightbox ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const galleryItems = document.querySelectorAll('.gallery-item');
  let currentGalleryIndex = 0;

  const galleryImages = Array.from(galleryItems).map(item =>
    item.querySelector('img').src
  );

  const openLightbox = (index) => {
    currentGalleryIndex = index;
    lightboxImg.src = galleryImages[index];
    lightboxImg.alt = galleryItems[index].querySelector('img').alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  const nextImage = () => {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[currentGalleryIndex];
  };

  const prevImage = () => {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentGalleryIndex];
  };

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', prevImage);
  lightbox.querySelector('.lightbox-next').addEventListener('click', nextImage);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  // --- Testimonial carousel ---
  // NOTE: Testimonials are placeholders — replace with real testimonials when available
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  let currentSlide = 0;
  let autoplayTimer;

  const goToSlide = (index) => {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    currentSlide = index;
    slides[index].classList.add('active');
    dots[index].classList.add('active');
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  const startAutoplay = () => {
    autoplayTimer = setInterval(nextSlide, 5000);
  };

  const stopAutoplay = () => {
    clearInterval(autoplayTimer);
  };

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      stopAutoplay();
      goToSlide(i);
      startAutoplay();
    });
  });

  // Carousel arrow buttons
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoplay(); prevSlide(); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoplay(); nextSlide(); startAutoplay(); });

  const carousel = document.querySelector('.testimonial-carousel');
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);

  startAutoplay();

  // --- Touch swipe for carousel ---
  let touchStartX = 0;
  carousel.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  carousel.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      stopAutoplay();
      diff > 0 ? nextSlide() : prevSlide();
      startAutoplay();
    }
  }, { passive: true });

  // --- Touch swipe for lightbox ---
  let lbTouchX = 0;
  lightbox.addEventListener('touchstart', (e) => { lbTouchX = e.changedTouches[0].screenX; }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const diff = lbTouchX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextImage() : prevImage();
    }
  }, { passive: true });

  // --- Contact form ---
  const form = document.getElementById('contact-form');
  const formSuccess = document.querySelector('.form-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.submit-btn');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    // Simulate form submission (replace with Formspree/Netlify in production)
    setTimeout(() => {
      form.style.display = 'none';
      formSuccess.classList.add('active');
    }, 1200);
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
