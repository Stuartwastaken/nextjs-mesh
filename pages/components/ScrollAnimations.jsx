/**
 * ScrollAnimations.js
 * A lightweight utility to handle scroll-based animations without dependencies.
 */

// Initialize scroll animations when imported
export function initScrollAnimations() {
  if (typeof window !== 'undefined') {
    // Only run in browser environment
    window.addEventListener('DOMContentLoaded', () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            // Add the 'animate' class when element is visible
            if (entry.isIntersecting) {
              entry.target.classList.add('animate');
            }
          });
        },
        { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
      );

      // Target elements by their IDs since module CSS classnames are dynamically generated
      document.querySelectorAll('#step-1, #step-2, #step-3, #feature-1, #feature-2, #feature-3, #testimonial-1, #testimonial-2, #cta-section').forEach(el => {
        observer.observe(el);
      });
    });

    // Find elements by their IDs for header animations
    window.addEventListener('load', () => {
      // Add a utility class for animations to the document
      const style = document.createElement('style');
      style.textContent = `
        .animate {
          animation: fadeInUp 0.8s ease forwards !important;
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `;
      document.head.appendChild(style);
      
      // Find the hero section and add animation classes to its children
      const heroSection = document.querySelector('.heroSection');
      if (heroSection) {
        heroSection.querySelectorAll('h1, p, .highlightBox').forEach(el => {
          el.classList.add('animate');
        });
      }
    });
  }
}

// Helper function to add animation delay
export function addAnimationDelays() {
  if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
      // Apply custom animation delays to create a staggered effect
      const steps = document.querySelectorAll('#step-1, #step-2, #step-3');
      steps.forEach((el, index) => {
        el.style.animationDelay = `${0.2 + (index * 0.2)}s`;
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      });

      const features = document.querySelectorAll('#feature-1, #feature-2, #feature-3');
      features.forEach((el, index) => {
        el.style.animationDelay = `${0.4 + (index * 0.2)}s`;
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      });

      const testimonials = document.querySelectorAll('#testimonial-1, #testimonial-2');
      testimonials.forEach((el, index) => {
        el.style.animationDelay = `${0.6 + (index * 0.2)}s`;
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      });
      
      const cta = document.querySelector('#cta-section');
      if (cta) {
        cta.style.animationDelay = '0.8s';
        cta.style.opacity = '0';
        cta.style.transform = 'translateY(40px)';
        cta.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      }
    });
  }
}

export default {
  initScrollAnimations,
  addAnimationDelays
}; 