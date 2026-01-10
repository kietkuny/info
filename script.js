$(document).ready(function () {

  // 1. Khởi tạo AOS Animation
  AOS.init({
    duration: 1000,
    once: false,
  });

  // 2. Navbar Scroll Effect (Đổi nền menu khi lăn chuột)
  $(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
      $('.navbar').addClass('scrolled');
    } else {
      $('.navbar').removeClass('scrolled');
    }
  });

  // 3. Slick Slider cho Project
  $('.project-slider').slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
    prevArrow: '<button type="button" class="slick-prev custom-arrow prev" aria-label="Previous"></button>',
    nextArrow: '<button type="button" class="slick-next custom-arrow next" aria-label="Next"></button>',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });

  // Refresh AOS after slider initialization to recalculate offsets
  AOS.refresh();

  // 4. Typewriter Effect (Hiệu ứng gõ chữ)
  const TypeWriter = function (txtElement, words, wait = 3000) {
    this.txtElement = txtElement;
    this.words = words;
    this.txt = '';
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.type();
    this.isDeleting = false;
  }

  TypeWriter.prototype.type = function () {
    // Current index of word
    const current = this.wordIndex % this.words.length;
    // Get full text of current word
    const fullTxt = this.words[current];

    // Check if deleting
    if (this.isDeleting) {
      // Remove char
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      // Add char
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    // Insert txt into element
    this.txtElement.innerHTML = '<span class="txt">' + this.txt + '</span>';

    // Initial Type Speed
    let typeSpeed = 200;

    if (this.isDeleting) {
      typeSpeed /= 2;
    }

    // If word is complete
    if (!this.isDeleting && this.txt === fullTxt) {
      // Make pause at end
      typeSpeed = this.wait;
      // Set delete to true
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      // Move to next word
      this.wordIndex++;
      // Pause before start typing
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }

  // Init TypeWriter on DOM Load
  const txtElement = document.querySelector('.txt-type');
  const words = JSON.parse(txtElement.getAttribute('data-words'));
  const wait = txtElement.getAttribute('data-wait');

  new TypeWriter(txtElement, words, wait);

  // Ensure AOS recalculates after all resources loaded (images/fonts)
  $(window).on('load', function () {
    AOS.refresh();
  });

  // 5. Close navbar on mobile click
  $('.navbar-nav>li>a').on('click', function () {
    $('.navbar-collapse').collapse('hide');
  });

  var scrollSpy = new bootstrap.ScrollSpy(document.body, {
    target: '#mainNav', // Phải trùng với ID của thanh menu
    rootMargin: '0px 0px -40%', // Tinh chỉnh độ nhạy khi cuộn
    threshold: [0, 0.5, 1]
  });
  // Smooth scrolling on menu click + active menu toggle
  (function () {
    const nav = document.getElementById('mainNav');
    const navLinks = Array.from(document.querySelectorAll('.navbar-nav .nav-link'));
    const sections = navLinks.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);

    function setActiveLink(link) {
      navLinks.forEach(l => l.classList.remove('active'));
      if (link) link.classList.add('active');
    }

    const extraScroll = 0; // more space for AOS animations to fully show

    navLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const navHeight = nav ? nav.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.pageYOffset - (navHeight + extraScroll);
        window.scrollTo({ top: top, behavior: 'smooth' });
        setActiveLink(this);
      });
    });

    // Update active state while scrolling - activate when section is in viewport
    window.addEventListener('scroll', function () {
      const scrollPos = window.pageYOffset;
      const navHeight = nav ? nav.offsetHeight : 0;
      const viewportCenter = scrollPos + navHeight + 50;
      let currentSection = null;

      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i];
        const secTop = sec.offsetTop;
        const secBottom = secTop + sec.offsetHeight;
        // Active section when viewport center is within section bounds
        if (viewportCenter >= secTop && viewportCenter < secBottom) {
          currentSection = sec;
          break;
        }
      }

      if (currentSection) {
        const id = '#' + currentSection.id;
        const activeLink = document.querySelector('.navbar-nav .nav-link[href="' + id + '"]');
        if (activeLink) setActiveLink(activeLink);
      }
    }, { passive: true });

    // Ensure correct active on load
    window.dispatchEvent(new Event('scroll'));
  })();

});