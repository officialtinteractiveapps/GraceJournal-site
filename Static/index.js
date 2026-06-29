const params = new URLSearchParams(window.location.search);
// Preview overrides for checking launch states before their real date arrives:
//   ?preview=presave  → the 26 July state (countdown + pre-order button visible)
//   ?preview=story    → the fully launched state (2 August onward)
const previewParam = params.get('preview');
const previewStory = previewParam === 'story';
const previewPresave = previewParam === 'presave';
const $ = (id) => document.getElementById(id);
const pad = (n) => String(Math.max(0, n)).padStart(2, '0');

const phases = {
  announcement: new Date('2026-06-28T00:00:00+12:00').getTime(),
  presave: new Date('2026-07-26T00:00:00+12:00').getTime(),
  launch: new Date('2026-08-02T00:00:00+12:00').getTime(),
};

const countdownNote = document.querySelector('.ann-countdown');
const countdownDate = document.querySelector('.countdown-date');

function setLaunchState(isLaunched, isAugustCountdown, isPresave) {
  document.body.classList.toggle('is-launched', isLaunched);
  document.body.classList.toggle('is-counting', !isLaunched);
  document.body.classList.toggle('is-august-countdown', isAugustCountdown);
  document.body.classList.toggle('is-presave', isPresave);
}

function getCountdownPhase(now) {
  if (now >= phases.launch) {
    return {
      target: phases.launch,
      launched: true,
      isAugustCountdown: true,
      isPresave: true,
      note: 'until 2 August',
      date: 'Sunday August 2 2026',
    };
  }

  if (now >= phases.announcement) {
    return {
      target: phases.launch,
      launched: false,
      isAugustCountdown: true,
      isPresave: now >= phases.presave,
      note: 'until 2 August',
      date: 'Sunday August 2 2026',
    };
  }

  return {
    target: phases.announcement,
    launched: false,
    isAugustCountdown: false,
    isPresave: false,
    note: '???',
    date: 'Sunday ?????? ? 2026',
  };
}

function tick() {
  const phase = getCountdownPhase(Date.now());
  // In presave preview, count down to 2 August to match the forced label.
  const target = previewPresave ? phases.launch : phase.target;
  const diff = target - Date.now();
  const launched = previewStory || phase.launched;

  // Force the 26 July pre-order state: August countdown with the pre-save
  // button visible, without waiting for the real date.
  const isAugustCountdown = previewPresave || phase.isAugustCountdown;
  const isPresave = previewPresave || phase.isPresave;

  if (countdownNote) countdownNote.textContent = previewPresave ? 'until 2 August' : phase.note;
  if (countdownDate) countdownDate.textContent = previewPresave ? 'Sunday August 2 2026' : phase.date;

  setLaunchState(launched, isAugustCountdown, isPresave);
  if (launched) return;

  $('days').textContent = pad(Math.floor(diff / 864e5));
  $('hours').textContent = pad(Math.floor((diff / 36e5) % 24));
  $('minutes').textContent = pad(Math.floor((diff / 6e4) % 60));
  $('seconds').textContent = pad(Math.floor((diff / 1e3) % 60));
}

tick();
setInterval(tick, 1000);

// Mobile menu toggle
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (navToggle && mobileMenu) {
  const setMenu = (open) => {
    document.body.classList.toggle('nav-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  navToggle.addEventListener('click', () => {
    setMenu(!document.body.classList.contains('nav-open'));
  });

  // close when the X, a menu link, or Escape is used
  const closeBtn = mobileMenu.querySelector('.mobile-menu-close');
  if (closeBtn) closeBtn.addEventListener('click', () => setMenu(false));
  mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
}

const sparkStage = document.querySelector('.spark-stage');
const mainPhone = document.querySelector('.phone-main');

if (sparkStage && mainPhone) {
  sparkStage.addEventListener('pointermove', (event) => {
    const rect = sparkStage.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    mainPhone.style.transform = `rotateY(${(-13 + x * 4).toFixed(2)}deg) rotateX(${(4 - y * 4).toFixed(2)}deg) rotateZ(1deg)`;
  });

  sparkStage.addEventListener('pointerleave', () => {
    mainPhone.style.transform = 'rotateY(-13deg) rotateX(4deg) rotateZ(1deg)';
  });
}
