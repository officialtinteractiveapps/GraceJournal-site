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

/* Position the verse annotations under the actual verse reference.
   We measure the reference's center-x relative to its verse-wrap parent
   and write it to a CSS variable. This keeps the arrow + "the heart
   of it" aligned with the cite no matter how the verse wraps. */
function positionVerseAnnotation() {
  const reference = document.getElementById('verse-reference');
  if (!reference) return;
  const wrap = reference.closest('.verse-wrap');
  if (!wrap) return;
  const referenceRect = reference.getBoundingClientRect();
  const wrapRect = wrap.getBoundingClientRect();
  const centerX = (referenceRect.left + referenceRect.width / 2) - wrapRect.left;
  const arrowTop = (referenceRect.bottom - wrapRect.top) + 2;
  const arrowBottom = -16;
  const arrowHeight = Math.max(36, wrapRect.height - arrowTop - arrowBottom);

  wrap.style.setProperty('--verse-reference-x', centerX + 'px');
  wrap.style.setProperty('--arrow-top', arrowTop + 'px');
  wrap.style.setProperty('--arrow-bottom', arrowBottom + 'px');
  wrap.style.setProperty('--arrow-height', arrowHeight + 'px');
}

positionVerseAnnotation();
window.addEventListener('resize', positionVerseAnnotation);
/* Re-measure once fonts have loaded — the reference's width changes when
   Fraunces swaps in, and we want the arrow under the final layout. */
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(positionVerseAnnotation);
}
