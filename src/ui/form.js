/**
 * Contact form: client-side validation plus an honest submission path.
 *
 * There is NO backend in this project. Rather than show a "message sent"
 * confirmation for a message that goes nowhere — which would quietly cost this
 * business real leads — a valid submit hands the content off to the visitor's
 * email client, and the status text says exactly that, with the phone number
 * and address as a fallback if no mail client opens.
 *
 * To make this actually deliver, POST to a form service here and only then
 * show a success state. See README.md → "Contact form".
 */
const CONTACT_EMAIL = 'info@italgroup.ca';
const CONTACT_PHONE = '416-557-2381';

// Deliberately permissive: something@something.tld. Anything stricter starts
// rejecting addresses that are perfectly valid.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function initForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  const status = form.querySelector('.form__status');
  const fields = [
    { el: form.querySelector('#name'), label: 'Name', required: true },
    { el: form.querySelector('#email'), label: 'Email', required: true, email: true },
    { el: form.querySelector('#phone'), label: 'Phone', required: false },
    { el: form.querySelector('#message'), label: 'Message', required: true },
  ].filter((f) => f.el);

  function errorFor(field) {
    const value = field.el.value.trim();
    if (field.required && !value) return 'This field is required.';
    if (field.email && value && !EMAIL_RE.test(value)) return 'Enter a valid email address.';
    return null;
  }

  function showError(field, message) {
    const id = `${field.el.id}-error`;
    let node = document.getElementById(id);

    if (message) {
      if (!node) {
        node = document.createElement('p');
        node.className = 'field-error';
        node.id = id;
        field.el.insertAdjacentElement('afterend', node);
      }
      node.textContent = message;
      field.el.setAttribute('aria-invalid', 'true');
      field.el.setAttribute('aria-describedby', id);
    } else {
      node?.remove();
      field.el.removeAttribute('aria-invalid');
      field.el.removeAttribute('aria-describedby');
    }
  }

  function setStatus(message, state) {
    if (!status) return;
    status.textContent = message;
    if (state) status.setAttribute('data-state', state);
    else status.removeAttribute('data-state');
  }

  // Validate on blur, but once a field is already flagged, re-check as the
  // visitor types so the error clears the moment it's fixed.
  for (const field of fields) {
    field.el.addEventListener('blur', () => showError(field, errorFor(field)));
    field.el.addEventListener('input', () => {
      if (field.el.getAttribute('aria-invalid') === 'true') {
        showError(field, errorFor(field));
      }
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let firstInvalid = null;
    for (const field of fields) {
      const message = errorFor(field);
      showError(field, message);
      if (message && !firstInvalid) firstInvalid = field;
    }

    if (firstInvalid) {
      setStatus('Please check the highlighted fields and try again.', 'error');
      firstInvalid.el.focus();
      return;
    }

    const value = (sel) => form.querySelector(sel)?.value.trim() ?? '';
    const name = value('#name');
    const phone = value('#phone');

    const body = [
      `Name: ${name}`,
      `Email: ${value('#email')}`,
      phone ? `Phone: ${phone}` : null,
      '',
      value('#message'),
    ]
      .filter((line) => line !== null)
      .join('\n');

    const href =
      `mailto:${CONTACT_EMAIL}` +
      `?subject=${encodeURIComponent(`Project enquiry from ${name}`)}` +
      `&body=${encodeURIComponent(body)}`;

    setStatus(
      `Opening your email app with this message ready to send to ${CONTACT_EMAIL}. ` +
        `If nothing opens, email us directly or call ${CONTACT_PHONE}.`,
      'success'
    );

    window.location.href = href;
  });
}
