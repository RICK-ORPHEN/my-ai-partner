/* ============================================
   AI SCHOOL PLATFORM - Main JavaScript
   ============================================ */

/* --- User Progress Storage --- */
const ProgressManager = {
  storageKey: 'ai_school_progress',

  // Initialize progress data
  init: function() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify({
        completedLessons: [],
        completedCourses: [],
        currentLesson: null,
        progressPercentage: 0,
        lastUpdated: new Date().toISOString()
      }));
    }
  },

  // Get all progress data
  getProgress: function() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  },

  // Mark lesson as completed
  completeLesson: function(lessonId) {
    const progress = this.getProgress();
    if (progress && !progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
      progress.lastUpdated = new Date().toISOString();
      localStorage.setItem(this.storageKey, JSON.stringify(progress));
      return true;
    }
    return false;
  },

  // Mark course as completed
  completeCourse: function(courseId) {
    const progress = this.getProgress();
    if (progress && !progress.completedCourses.includes(courseId)) {
      progress.completedCourses.push(courseId);
      progress.lastUpdated = new Date().toISOString();
      localStorage.setItem(this.storageKey, JSON.stringify(progress));
      return true;
    }
    return false;
  },

  // Check if lesson is completed
  isLessonCompleted: function(lessonId) {
    const progress = this.getProgress();
    return progress ? progress.completedLessons.includes(lessonId) : false;
  },

  // Set current lesson
  setCurrentLesson: function(lessonId) {
    const progress = this.getProgress();
    if (progress) {
      progress.currentLesson = lessonId;
      progress.lastUpdated = new Date().toISOString();
      localStorage.setItem(this.storageKey, JSON.stringify(progress));
    }
  },

  // Get completed lesson count
  getCompletedCount: function() {
    const progress = this.getProgress();
    return progress ? progress.completedLessons.length : 0;
  },

  // Reset all progress
  reset: function() {
    localStorage.removeItem(this.storageKey);
    this.init();
  }
};

/* --- Navigation Helper --- */
const Navigation = {
  // Navigate to lesson
  goToLesson: function(lessonPath) {
    window.location.href = lessonPath;
  },

  // Navigate to dashboard
  goToDashboard: function() {
    window.location.href = './dashboard.html';
  },

  // Navigate to courses
  goToCourses: function() {
    window.location.href = './dashboard-courses.html';
  },

  // Navigate to industry courses
  goToIndustryCourses: function() {
    window.location.href = './courses-industry.html';
  },

  // Navigate to onboarding
  goToOnboarding: function() {
    window.location.href = './onboarding.html';
  },

  // Navigate back with fallback
  goBack: function(fallbackUrl) {
    if (window.history.length > 1) {
      window.history.back();
    } else if (fallbackUrl) {
      window.location.href = fallbackUrl;
    }
  }
};

document.addEventListener('DOMContentLoaded', function() {
  // Initialize progress manager
  ProgressManager.init();

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
