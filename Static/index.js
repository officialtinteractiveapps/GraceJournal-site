const params = new URLSearchParams(window.location.search);
const previewStory = params.get('preview') === 'story';
const $ = (id) => document.getElementById(id);

function setLaunchState(isLaunched) {
  document.body.classList.toggle('is-launched', isLaunched);
  document.body.classList.toggle('is-counting', !isLaunched);
}

if (previewStory) {
  setLaunchState(true);
} else {
  setLaunchState(false);
  ['days', 'hours', 'minutes', 'seconds'].forEach((id) => {
    const el = $(id);
    if (el) el.textContent = '??';
  });
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
