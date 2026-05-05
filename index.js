// Countdown to 24 May 2026, 00:00 NZST (UTC+12)
const target = new Date('2026-05-24T00:00:00+12:00').getTime();
const $ = (id) => document.getElementById(id);
const pad = (n) => String(Math.max(0, n)).padStart(2, '0');

function tick() {
  const diff = target - Date.now();
  if (diff <= 0) {
    $('days').textContent = '00';
    $('hours').textContent = '00';
    $('minutes').textContent = '00';
    $('seconds').textContent = '00';
    return;
  }
  $('days').textContent    = pad(Math.floor(diff / 864e5));
  $('hours').textContent   = pad(Math.floor((diff / 36e5) % 24));
  $('minutes').textContent = pad(Math.floor((diff / 6e4)  % 60));
  $('seconds').textContent = pad(Math.floor((diff / 1e3)  % 60));
}

tick();
setInterval(tick, 1000);

/* Position the verse annotations under the actual GRACE word.
   We measure the word's center-x relative to its verse-wrap parent
   and write it to a CSS variable. This keeps the arrow + "the heart
   of it" aligned with GRACE no matter how the verse wraps. */
function positionVerseAnnotation() {
  const word = document.getElementById('grace-word');
  if (!word) return;
  const wrap = word.closest('.verse-wrap');
  if (!wrap) return;
  const wordRect = word.getBoundingClientRect();
  const wrapRect = wrap.getBoundingClientRect();
  const centerX = (wordRect.left + wordRect.width / 2) - wrapRect.left;
  wrap.style.setProperty('--grace-x', centerX + 'px');
}

positionVerseAnnotation();
window.addEventListener('resize', positionVerseAnnotation);
/* Re-measure once fonts have loaded — the word's width changes when
   Fraunces swaps in, and we want the arrow under the final layout. */
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(positionVerseAnnotation);
}
