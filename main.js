document.addEventListener('DOMContentLoaded', () => {
  animateCounters();
  smoothScroll();
  handleOrderForm();
  updateActiveNavLinks();
});

function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  const options = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
          current += increment;
          if (current < target) {
            counter.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        };

        updateCounter();
        observer.unobserve(counter);
      }
    });
  }, options);

  counters.forEach(counter => {
    observer.observe(counter);
  });
}

function smoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      if (href === '#' || href === '') {
        return;
      }

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
          const bsCollapse = new bootstrap.Collapse(navbarCollapse);
          bsCollapse.hide();
        }
      }
    });
  });
}

function handleOrderForm() {
  const form = document.getElementById('orderForm');
  const messageDiv = document.getElementById('formMessage');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        deadline: document.getElementById('deadline').value,
        details: document.getElementById('details').value
      };

      messageDiv.innerHTML = `
        <div class="alert alert-success">
          <i class="fas fa-check-circle"></i>
          <strong>Thank you for your request!</strong>
          <p class="mb-0 mt-2">We've received your information and will contact you shortly with a free quote.</p>
        </div>
      `;

      form.reset();

      setTimeout(() => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('orderModal'));
        if (modal) {
          modal.hide();
        }
        messageDiv.innerHTML = '';
      }, 3000);
    });
  }
}

function updateActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
