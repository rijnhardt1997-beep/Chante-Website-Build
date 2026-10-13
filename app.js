const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  nav.classList.toggle('open', open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Open navigation');
}));
const care = {
  everyday: {title: 'Women’s & pelvic health', description: 'Bladder leakage, pelvic floor concerns and changes around menopause can affect everyday life. Talk with Chante Groenewald Physiotherapy about your symptoms, questions and goals, and whether a pelvic health assessment is appropriate for you.'},
  active: {title: 'Postpartum recovery', description: 'Recovery after pregnancy and birth is individual. Discuss pelvic health, changes in movement and your goals for returning to exercise. An assessment can help guide a conversation about appropriate next steps for your situation.'},
  recovery: {title: 'Return to running & sport', description: 'Whether you are returning after childbirth or navigating pelvic health concerns during exercise, your activity goals matter. Discuss your current symptoms, running or training routine and a suitable path forward with the practice.'}
};
const dialog = document.querySelector('#care-dialog');
document.querySelectorAll('[data-care]').forEach(button => button.addEventListener('click', () => {
  const item = care[button.dataset.care];
  document.querySelector('#dialog-title').textContent = item.title;
  document.querySelector('#dialog-description').textContent = item.description;
  dialog.showModal();
  document.body.classList.add('modal-open');
}));
dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
document.querySelector('#dialog-contact').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
document.querySelector('#year').textContent = new Date().getFullYear();

// Reveal text once as it enters the viewport; content stays visible without JS.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !motionPreference.matches) {
  const textBlocks = document.querySelectorAll('main h1, main h2, main h3, main p, main .eyebrow, main .art-label-message');
  const reveal = element => {
    element.classList.add('is-visible');
    observer.unobserve(element);
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) reveal(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -24px 0px' });
  textBlocks.forEach(element => {
    element.classList.add('reveal-ready');
    observer.observe(element);
  });
  // Keyboard users see all text in the control they are interacting with.
  document.querySelector('main').addEventListener('focusin', event => {
    const block = event.target.closest('button, details, section');
    if (block) block.querySelectorAll('.reveal-ready').forEach(reveal);
  });
  motionPreference.addEventListener('change', event => {
    if (event.matches) {
      textBlocks.forEach(reveal);
      observer.disconnect();
    }
  });
}

const enquiryDialog = document.querySelector('#enquiry-dialog');
const enquiryForm = document.querySelector('#enquiry-form');
const emailField = document.querySelector('#enquiry-email');
const phoneField = document.querySelector('#enquiry-phone');
const contactError = document.querySelector('#contact-error');
const enquiryStatus = document.querySelector('#enquiry-status');
document.querySelector('#open-enquiry').addEventListener('click', () => {
  enquiryStatus.textContent = '';
  enquiryDialog.showModal();
  document.body.classList.add('modal-open');
});
enquiryDialog.querySelector('.close-dialog').addEventListener('click', () => enquiryDialog.close());
enquiryDialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
enquiryDialog.addEventListener('click', event => {
  const rect = enquiryDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) enquiryDialog.close();
});
const clearContactError = () => {
  emailField.setCustomValidity('');
  phoneField.setCustomValidity('');
  emailField.removeAttribute('aria-invalid');
  phoneField.removeAttribute('aria-invalid');
  contactError.hidden = true;
};
[emailField, phoneField].forEach(field => field.addEventListener('input', clearContactError));
enquiryForm.querySelectorAll('[required]').forEach(field => field.addEventListener('input', () => field.setCustomValidity('')));
enquiryForm.querySelectorAll('[name="delivery"]').forEach(field => field.addEventListener('change', () => {
  document.querySelector('#prepare-enquiry').firstChild.textContent = field.value === 'email' ? 'Open email draft ' : 'Open WhatsApp draft ';
  enquiryStatus.textContent = '';
}));
enquiryForm.addEventListener('submit', event => {
  event.preventDefault();
  clearContactError();
  enquiryStatus.textContent = '';
  enquiryForm.querySelectorAll('[required]').forEach(field => {
    field.setCustomValidity(field.value.trim() ? '' : 'Please complete this field.');
  });
  const email = emailField.value.trim();
  const phone = phoneField.value.trim();
  if (!email && !phone) {
    const message = 'Please provide an email address or phone number.';
    emailField.setCustomValidity(message);
    emailField.setAttribute('aria-invalid', 'true');
    phoneField.setAttribute('aria-invalid', 'true');
    contactError.textContent = message;
    contactError.hidden = false;
  } else if (phone && (!/^\+?[\d\s().-]+$/.test(phone) || phone.replace(/\D/g, '').length < 7 || phone.replace(/\D/g, '').length > 15)) {
    phoneField.setCustomValidity('Please enter a valid phone number, including the area or country code.');
    phoneField.setAttribute('aria-invalid', 'true');
  }
  if (!enquiryForm.reportValidity()) return;
  const data = new FormData(enquiryForm);
  const topic = data.get('topic');
  const text = `${topic}\n\nName: ${data.get('firstName').trim()} ${data.get('surname').trim()}\nEmail: ${email || 'Not provided'}\nPhone: ${phone || 'Not provided'}\n\n${data.get('message').trim()}`;
  if (data.get('delivery') === 'whatsapp') {
    window.open(`https://wa.me/27661680935?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    enquiryStatus.textContent = 'Continue in WhatsApp to review and send your message. If it did not open, check your browser’s popup settings.';
  } else {
    window.location.href = `mailto:admin@cgphysio.co.za?subject=${encodeURIComponent(topic)}&body=${encodeURIComponent(text)}`;
    enquiryStatus.textContent = 'Continue in your email app to review and send. If no email app opens, select WhatsApp or email admin@cgphysio.co.za directly.';
  }
});
