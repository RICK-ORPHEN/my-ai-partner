/* ============================================
   AI SCHOOL PLATFORM — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

  /* --- Mobile Navigation Toggle --- */
  var hamburger = document.querySelector('.nav-hamburger');
  var navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
      });
    });
  }

  /* --- Scroll Reveal --- */
  var reveals = document.querySelectorAll('.reveal');

  function checkReveal() {
    var windowHeight = window.innerHeight;
    reveals.forEach(function(el) {
      var top = el.getBoundingClientRect().top;
      if (top < windowHeight - 80) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', checkReveal);
  checkReveal();

  /* --- Accordion --- */
  document.querySelectorAll('.accordion-header').forEach(function(header) {
    header.addEventListener('click', function() {
      var item = this.parentElement;
      item.classList.toggle('active');
    });
  });

  /* --- Navbar background on scroll --- */
  var nav = document.querySelector('.nav-bar');
  if (nav) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 10) {
        nav.style.background = 'rgba(10,10,10,0.98)';
      } else {
        nav.style.background = '#0A0A0A';
      }
    });
  }

});
