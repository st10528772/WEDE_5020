/* ================================================================
   SCRIPT: forms.js
   PAGES: enquiry.html and contact_us.html
   AUTHOR: [Palesa Dikolane] 

 MODULE: WEDE5020 — Part 3

   WHAT THIS FILE DOES:
   - Validates both forms on the client side (required fields,
     email format, message length) before anything is submitted.
   - Shows inline error messages next to invalid fields instead of
     relying on browser default pop-ups alone.
   - ENQUIRY FORM: submits the validated data asynchronously (AJAX,
     using the Fetch API) to a test API endpoint, then displays a
     generated response message about availability/pricing — this
     site has no real backend/database, so JSONPlaceholder
     (https://jsonplaceholder.typicode.com) is used purely to
     demonstrate genuine asynchronous form submission as required
     by the brief. See README references.
   - CONTACT FORM: compiles the validated input into an email
     (subject + body) and opens it as a mailto: link addressed to
     Makro's customer care inbox, so the visitor's own email client
     sends it — appropriate for a static front-end site with no
     mail server of its own.
   ================================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ----------------------------------------------------------------
     SHARED VALIDATION HELPERS
     ---------------------------------------------------------------- */
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Accepts SA numbers like 0821234567, +27821234567, 082 123 4567
  const phonePattern = /^(\+27|0)[\s-]?[0-9][\s-]?[0-9]{3}[\s-]?[0-9]{3,4}$/;

  function showError(input, message) {
    const errorEl = document.getElementById(input.id + 'Error');
    input.classList.add('invalid');
    input.setAttribute('aria-invalid', 'true');
    if (errorEl) errorEl.textContent = message;
  }

  function clearError(input) {
    const errorEl = document.getElementById(input.id + 'Error');
    input.classList.remove('invalid');
    input.setAttribute('aria-invalid', 'false');
    if (errorEl) errorEl.textContent = '';
  }

  function validateField(input) {
    const value = input.value.trim();

    if (input.hasAttribute('required') && value === '') {
      showError(input, 'This field is required.');
      return false;
    }
    if (input.type === 'email' && value !== '' && !emailPattern.test(value)) {
      showError(input, 'Please enter a valid email address, e.g. name@example.com.');
      return false;
    }
    if (input.dataset.validate === 'phone' && value !== '' && !phonePattern.test(value)) {
      showError(input, 'Please enter a valid South African phone number, e.g. 082 123 4567.');
      return false;
    }
    if (input.tagName === 'TEXTAREA' && value.length < 10) {
      showError(input, 'Please enter at least 10 characters so we understand your request.');
      return false;
    }

    clearError(input);
    return true;
  }


  /* ----------------------------------------------------------------
     ENQUIRY FORM (enquiry.html)
     ---------------------------------------------------------------- */
  const enquiryForm = document.getElementById('enquiryForm');

  if (enquiryForm) {
    const fieldsToValidate = enquiryForm.querySelectorAll('input[required], textarea[required], select[required]');

    // Live validation as the visitor leaves each field
    fieldsToValidate.forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
    });

    enquiryForm.addEventListener('submit', function (e) {
      e.preventDefault(); // stop the normal full-page submission/reload

      let formIsValid = true;
      fieldsToValidate.forEach(function (field) {
        if (!validateField(field)) formIsValid = false;
      });

      if (!formIsValid) {
        const firstInvalid = enquiryForm.querySelector('.invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const responseBox = document.getElementById('enquiryResponse');
      const submitBtn = enquiryForm.querySelector('button[type="submit"]');

      const formData = {
        name: document.getElementById('enquiryName').value.trim(),
        email: document.getElementById('enquiryEmail').value.trim(),
        phone: document.getElementById('enquiryPhone').value.trim(),
        enquiryType: document.getElementById('enquiryType').value,
        category: document.getElementById('enquiryCategory').value,
        message: document.getElementById('enquiryMessage').value.trim()
      };

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      responseBox.hidden = true;

      // AJAX submission using the Fetch API (asynchronous — no page reload)
      fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
        .then(function (res) { return res.json(); })
        .then(function () {
          // Build a response message that reflects the visitor's own selections
          const categoryLabels = {
            groceries: 'Groceries',
            household: 'Household',
            outdoor: 'Outdoor & Camping'
          };
          const categoryName = categoryLabels[formData.category] || 'General';

          responseBox.innerHTML =
            '<strong>Thank you, ' + formData.name + '!</strong> Your ' +
            formData.enquiryType.toLowerCase() + ' enquiry about our ' + categoryName +
            ' range has been received. A specialist from that department will contact you ' +
            'at <strong>' + formData.email + '</strong> within 24 hours with availability and pricing details.';
          responseBox.hidden = false;
          responseBox.scrollIntoView({ behavior: 'smooth', block: 'center' });

          enquiryForm.reset();
        })
        .catch(function () {
          responseBox.innerHTML = 'Something went wrong sending your enquiry. Please check your internet connection and try again.';
          responseBox.hidden = false;
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Enquiry';
        });
    });
  }


  /* ----------------------------------------------------------------
     CONTACT FORM (contact_us.html)
     ---------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    const fieldsToValidate = contactForm.querySelectorAll('input[required], textarea[required], select[required]');

    fieldsToValidate.forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let formIsValid = true;
      fieldsToValidate.forEach(function (field) {
        if (!validateField(field)) formIsValid = false;
      });

      if (!formIsValid) {
        const firstInvalid = contactForm.querySelector('.invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const name    = document.getElementById('contactName').value.trim();
      const email   = document.getElementById('contactEmail').value.trim();
      const subject = document.getElementById('contactSubject').value;
      const message = document.getElementById('contactMessage').value.trim();

      // Recipient address — update this to Makro's real customer care inbox
      const recipient = 'customercare@makro.co.za';

      const emailSubject = 'Website Contact Form: ' + subject;
      const emailBody =
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Subject: ' + subject + '\n\n' +
        'Message:\n' + message;

      const mailtoLink =
        'mailto:' + recipient +
        '?subject=' + encodeURIComponent(emailSubject) +
        '&body=' + encodeURIComponent(emailBody);

      const responseBox = document.getElementById('contactResponse');
      responseBox.innerHTML =
        'Your message has been compiled. Your email app should now be open with the message ' +
        'addressed to <strong>' + recipient + '</strong> — just hit <strong>Send</strong> there to deliver it.';
      responseBox.hidden = false;

      // Opens the visitor's default email application, prefilled
      window.location.href = mailtoLink;

      contactForm.reset();
    });
  }

});
