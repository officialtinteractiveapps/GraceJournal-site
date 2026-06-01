const target = new Date('2026-05-24T00:00:00+12:00').getTime();
const params = new URLSearchParams(window.location.search);
const previewStory = params.get('preview') === 'story';
const $ = (id) => document.getElementById(id);
const pad = (n) => String(Math.max(0, n)).padStart(2, '0');

function setLaunchState(isLaunched) {
  document.body.classList.toggle('is-launched', isLaunched);
  document.body.classList.toggle('is-counting', !isLaunched);
}

function tick() {
  const diff = target - Date.now();
  const launched = previewStory || diff <= 0;

  setLaunchState(launched);
  if (launched) return;

  $('days').textContent = pad(Math.floor(diff / 864e5));
  $('hours').textContent = pad(Math.floor((diff / 36e5) % 24));
  $('minutes').textContent = pad(Math.floor((diff / 6e4) % 60));
  $('seconds').textContent = pad(Math.floor((diff / 1e3) % 60));
}

tick();
setInterval(tick, 1000);

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
