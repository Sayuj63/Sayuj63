// Micro-interactions for Indirepair

document.addEventListener('DOMContentLoaded', function() {
  // FAQ Accordion
  document.querySelectorAll('.accordion-header').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const item = btn.parentElement;
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // Button press scale effect
  document.querySelectorAll('.btn').forEach(function(btn) {
    btn.addEventListener('mousedown', function() {
      btn.style.transform = 'scale(0.96)';
    });
    btn.addEventListener('mouseup', function() {
      btn.style.transform = '';
    });
    btn.addEventListener('mouseleave', function() {
      btn.style.transform = '';
    });
  });

  // Form success fade-in
  function showFormSuccess(formId, successId) {
    const form = document.getElementById(formId);
    const success = document.getElementById(successId);
    if (form && success) {
      form.style.display = 'none';
      success.style.display = 'block';
      success.style.opacity = 0;
      setTimeout(() => {
        success.style.transition = 'opacity 0.6s';
        success.style.opacity = 1;
      }, 50);
    }
  }
  const heroForm = document.getElementById('heroForm');
  if (heroForm) {
    heroForm.addEventListener('submit', function(e) {
      e.preventDefault();
      showFormSuccess('heroForm', 'heroFormSuccess');
    });
  }
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      showFormSuccess('bookingForm', 'bookingFormSuccess');
    });
  }

  // Pricing table row hover effect
  document.querySelectorAll('.pricing tbody tr').forEach(function(row) {
    row.addEventListener('mouseenter', function() {
      row.style.transition = 'background 0.3s';
      row.style.background = '#dbefff';
    });
    row.addEventListener('mouseleave', function() {
      row.style.background = '';
    });
  });

  // Navbar shadow on scroll
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;
  window.addEventListener('scroll', function() {
    if (!navbar) return;
    if (window.scrollY > 10) {
      navbar.style.boxShadow = '0 4px 18px #1e90ff22';
    } else {
      navbar.style.boxShadow = '0 2px 8px rgba(10,42,77,0.06)';
    }
    lastScroll = window.scrollY;
  });
});
