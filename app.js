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
  const textBlocks = [...document.querySelectorAll('main h1, main h2, main h3, main p, main .eyebrow, main .art-label-message')].filter(element => !element.closest('.game-card'));
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
const appointmentDate = document.querySelector('#appointment-date');
const localToday = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};
appointmentDate.min = localToday();
// Detect a phone browser, not just a narrow desktop window. Fall back for Safari.
const isPhone = navigator.userAgentData?.mobile ?? /iPhone|iPod|Android.*Mobile|Windows Phone/i.test(navigator.userAgent);
const deliveryOptions = enquiryForm.querySelector('.delivery-options');
deliveryOptions.hidden = !isPhone;
enquiryForm.querySelector('[value="whatsapp"]').disabled = !isPhone;
document.querySelector('#delivery-explanation').textContent = isPhone ? 'This opens a draft in your email app or WhatsApp.' : 'This opens a draft in your email app.';
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
    field.setCustomValidity(field.type === 'checkbox' ? (field.checked ? '' : 'Please acknowledge how your details are used.') : (field.value.trim() ? '' : 'Please complete this field.'));
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
  appointmentDate.min = localToday();
  if (!enquiryForm.reportValidity()) return;
  const data = new FormData(enquiryForm);
  const topic = 'Appointment request';
  const text = `Appointment request\n\nName: ${data.get('firstName').trim()} ${data.get('surname').trim()}\nEmail: ${email || 'Not provided'}\nPhone: ${phone || 'Not provided'}\nPreferred date: ${data.get('appointmentDate')}\nPrivacy acknowledgement: accepted\n\nPlease contact me to confirm availability.`;
  if (isPhone && data.get('delivery') === 'whatsapp') {
    window.open(`https://wa.me/27661680935?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    enquiryStatus.textContent = 'Continue in WhatsApp to review and send your message. If it did not open, check your browser’s popup settings.';
  } else {
    window.location.href = `mailto:admin@cgphysio.co.za?subject=${encodeURIComponent(topic)}&body=${encodeURIComponent(text)}`;
    enquiryStatus.textContent = isPhone ? 'Continue in your email app to review and send. If no email app opens, select WhatsApp or email admin@cgphysio.co.za directly.' : 'Continue in your email app to review and send. If no email app opens, email admin@cgphysio.co.za directly.';
  }
});

// Educational game: no symptom assessment, score, storage or submission.
const myths = [
  { statement: 'Bladder leakage is something you simply have to live with.', answer: 'myth', explanation: 'Bladder leakage deserves a conversation. Assessment and support may be available; what is appropriate depends on your individual situation.' },
  { statement: 'Pelvic health matters only after childbirth.', answer: 'myth', explanation: 'Pelvic health concerns can occur at different stages of life, including around menopause. You do not need to have given birth to discuss your concerns.' },
  { statement: 'Everyone should do the same pelvic floor exercises.', answer: 'myth', explanation: 'People have different needs. Pelvic floor exercises are not a one-size-fits-all solution; individual assessment can help guide appropriate advice.' },
  { statement: 'Returning to running after birth looks different for everyone.', answer: 'fact', explanation: 'Recovery, symptoms, previous activity and personal goals can all differ. Discuss a return to activity that suits your situation rather than relying on a single timeline.' },
  { statement: 'You can bring your exercise goals into a pelvic health appointment.', answer: 'fact', explanation: 'Your activity goals are a useful part of the conversation. Tell your physiotherapist what you enjoy and what you would like to return to.' }
];
let mythIndex = 0;
let mythAnswered = false;
const gameWelcome = document.querySelector('#game-welcome');
const gamePanel = document.querySelector('#game-question-panel');
const gameComplete = document.querySelector('#game-complete');
const gameQuestion = document.querySelector('#game-question');
const gameFeedback = document.querySelector('#game-feedback');
const gameNext = document.querySelector('#game-next');
const gameAnswers = [...document.querySelectorAll('[data-answer]')];
const showMythQuestion = () => {
  mythAnswered = false;
  gameQuestion.textContent = myths[mythIndex].statement;
  document.querySelector('#game-count').textContent = `${mythIndex + 1} of ${myths.length}`;
  const progress = document.querySelector('#game-progress');
  progress.value = mythIndex + 1;
  progress.textContent = `${mythIndex + 1} of ${myths.length}`;
  gameFeedback.hidden = true;
  gameNext.hidden = true;
  gameAnswers.forEach(button => { button.disabled = false; button.setAttribute('aria-pressed', 'false'); });
  gameQuestion.focus({ preventScroll: true });
};
const startMythGame = () => {
  mythIndex = 0;
  gameWelcome.hidden = true;
  gameComplete.hidden = true;
  gamePanel.hidden = false;
  showMythQuestion();
};
const gameStart = document.querySelector('#game-start');
gameStart.hidden = false;
gameStart.addEventListener('click', startMythGame);
document.querySelector('#game-replay').addEventListener('click', startMythGame);
gameAnswers.forEach(button => button.addEventListener('click', () => {
  if (mythAnswered) return;
  mythAnswered = true;
  const question = myths[mythIndex];
  gameAnswers.forEach(answer => { answer.disabled = true; answer.setAttribute('aria-pressed', String(answer === button)); });
  document.querySelector('#game-feedback-label').textContent = button.dataset.answer === question.answer ? `That’s right — ${question.answer}.` : `This one is a ${question.answer}.`;
  document.querySelector('#game-explanation').textContent = question.explanation;
  gameFeedback.hidden = false;
  gameNext.textContent = mythIndex === myths.length - 1 ? 'Finish' : 'Next question';
  gameNext.hidden = false;
  gameFeedback.focus({ preventScroll: true });
}));
gameNext.addEventListener('click', () => {
  if (!mythAnswered) return;
  mythIndex += 1;
  if (mythIndex < myths.length) showMythQuestion();
  else {
    gamePanel.hidden = true;
    gameComplete.hidden = false;
    document.querySelector('#game-complete-heading').focus({ preventScroll: true });
  }
});
document.querySelector('#game-appointment').addEventListener('click', () => document.querySelector('#open-enquiry').click());

// Decorative motion: one gentle arrival, then a small scroll drift while visible.
const contactSection = document.querySelector('#contact');
if ('IntersectionObserver' in window && !motionPreference.matches) {
  let contactVisible = false;
  let driftFrame = 0;
  const updateDrift = () => {
    driftFrame = 0;
    if (!contactVisible || motionPreference.matches) return;
    const position = contactSection.getBoundingClientRect();
    const amount = Math.max(-18, Math.min(18, (innerHeight / 2 - position.top - position.height / 2) * .045));
    contactSection.style.setProperty('--sy-drift', `${amount}px`);
  };
  const scheduleDrift = () => {
    if (contactVisible && !driftFrame && !motionPreference.matches) driftFrame = requestAnimationFrame(updateDrift);
  };
  const contactObserver = new IntersectionObserver(entries => {
    contactVisible = entries[0].isIntersecting;
    if (contactVisible) {
      contactSection.classList.add('sy-in-view');
      scheduleDrift();
    }
  });
  contactObserver.observe(contactSection);
  window.addEventListener('scroll', scheduleDrift, { passive: true });
  motionPreference.addEventListener('change', event => {
    if (event.matches) {
      contactObserver.disconnect();
      window.removeEventListener('scroll', scheduleDrift);
      cancelAnimationFrame(driftFrame);
      contactSection.style.removeProperty('--sy-drift');
    }
  });
}
