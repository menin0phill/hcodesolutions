/**
 * Core Application Logic for Portfolio Landing Page
 * Handles scrolling, cursor effects, navigation, mobile menus, and form submission.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- Setup Elements ---
  const header = document.getElementById('main-header');
  const cursorGlow = document.getElementById('cursor-glow');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const formSubmitBtn = document.getElementById('form-submit-btn');
  
  // --- 1. Navbar Scroll Effect ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- 2. Custom Cursor Glow Tracking ---
  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth cursor follow (Spring interpolation)
  function updateCursorGlow() {
    // Lerp coordinates
    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;

    if (cursorGlow) {
      // Offset by 150px because the glow is 300px wide (centered)
      cursorGlow.style.transform = `translate3d(${currentX - 150}px, ${currentY - 150}px, 0)`;
    }
    requestAnimationFrame(updateCursorGlow);
  }
  updateCursorGlow();

  // --- 3. Mobile Navigation Menu ---
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      
      // Prevent body scrolling when menu is open
      if (mobileMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close mobile menu when links are clicked
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- 4. Intersection Observer for Scroll Reveals ---
  // We'll target several elements and add transition classes dynamically
  const revealElements = [];
  
  // Collect elements to animate on scroll
  document.querySelectorAll('.section-title, .section-subtitle, .lead-text, .philosophy-cards > div, .project-card, .skill-category, .contact-box').forEach(el => {
    el.classList.add('reveal-element');
    revealElements.push(el);
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once animated to keep performance high
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15, // trigger when 15% of the element is visible
    rootMargin: '0px 0px -50px 0px' // offset bottom slightly
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // --- 5. Contact Form Submission (Simulated) ---
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const messageInput = document.getElementById('form-message');
      
      if (!nameInput.value || !emailInput.value || !messageInput.value) {
        showFeedback('Por favor, preencha todos os campos.', 'error');
        return;
      }

      // Enter sending state
      formSubmitBtn.disabled = true;
      const originalBtnText = formSubmitBtn.querySelector('span').innerText;
      formSubmitBtn.querySelector('span').innerText = 'Enviando...';
      formSubmitBtn.classList.add('loading');
      
      // Simulate network request
      setTimeout(() => {
        // Success feedback
        showFeedback(`Obrigado, ${nameInput.value}! Sua mensagem foi enviada.`, 'success');
        
        // Reset form
        contactForm.reset();
        
        // Exit sending state
        formSubmitBtn.disabled = false;
        formSubmitBtn.querySelector('span').innerText = originalBtnText;
        formSubmitBtn.classList.remove('loading');
      }, 1800);
    });
  }

  function showFeedback(message, type) {
    if (!formFeedback) return;
    
    formFeedback.innerText = message;
    formFeedback.className = `form-feedback ${type}`;
    
    // Hide feedback after 5 seconds
    setTimeout(() => {
      formFeedback.innerText = '';
      formFeedback.className = 'form-feedback';
    }, 5000);
  }

  // --- 6. Smooth Scroll navigation with adjustment for header height ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- 7. Interactive 2D Constellation Canvas Background (Tech Visual) ---
  const heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 45; // Subtle and elegant density
    const connectionDistance = 80;
    
    let mouse = { x: null, y: null, active: false };
    
    function resize() {
      const rect = heroCanvas.getBoundingClientRect();
      width = heroCanvas.width = rect.width;
      height = heroCanvas.height = rect.height;
    }
    
    resize();
    window.addEventListener('resize', resize);
    
    // Mouse tracking relative to canvas container
    const container = document.getElementById('hero-visual-container');
    if (container) {
      container.addEventListener('mousemove', (e) => {
        const rect = heroCanvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
      });
      
      container.addEventListener('mouseleave', () => {
        mouse.active = false;
      });
    }
    
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = 1.2 + Math.random() * 1.8;
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off canvas edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
        
        // Mouse push effect
        if (mouse.active) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            const force = (90 - dist) / 1100;
            this.vx -= (dx / dist) * force;
            this.vy -= (dy / dist) * force;
            
            // Limit speed to prevent chaotic acceleration
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > 1.2) {
              this.vx = (this.vx / speed) * 1.2;
              this.vy = (this.vy / speed) * 1.2;
            }
          }
        }
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(197, 160, 89, 0.40)'; // Metallic Gold particle
        ctx.fill();
      }
    }
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    function animate() {
      ctx.clearRect(0, 0, width, height);
      
      // Draw gridlines (Tech HUD style)
      ctx.strokeStyle = 'rgba(197, 160, 89, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = 35;
      
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      
      // Update & Draw particles
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            
            // Fading lines based on distance
            const alpha = (1 - dist / connectionDistance) * 0.15;
            ctx.strokeStyle = `rgba(197, 160, 89, ${alpha})`;
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animate);
    }
    
    animate();
  }

});
