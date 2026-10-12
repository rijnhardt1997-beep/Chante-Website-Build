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
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
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
