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

/* Position the verse annotations under the actual GRACE word, and
   dynamically size the curved arrow so its tip always sits a consistent
   distance below GRACE regardless of how the verse wraps.

   The horizontal piece (--grace-x) is what aligns the arrow + "the heart
   of it" handwriting under GRACE.

   The vertical piece is more interesting: a fixed-height arrow looks fine
   on desktop (one-line verse) but on narrow screens the verse wraps to
   two lines, GRACE moves up, and the tip ends up crowding the word. So
   we measure GRACE.bottom each time and recompute:
     - --arrow-top:    where the SVG's top edge sits (just below GRACE)
     - --arrow-height: how tall the SVG is (so its tail stays anchored at
                       wrap.bottom + 1rem, matching the original look)

   The SVG's viewBox is also re-set to 1:1 with pixel dimensions, so the
   arrowhead at viewBox y=6..14 stays exactly 8px tall in pixels no matter
   how long the arrow gets. Only the curved line redraws. */
function positionVerseAnnotation() {
  const word = document.getElementById('grace-word');
  if (!word) return;
  const wrap = word.closest('.verse-wrap');
  if (!wrap) return;

  const wordRect = word.getBoundingClientRect();
  const wrapRect = wrap.getBoundingClientRect();

  // Center-x of GRACE → drives both the arrow's horizontal position
  // and the "the heart of it" annotation underneath it.
  const centerX = (wordRect.left + wordRect.width / 2) - wrapRect.left;
  // Bottom-y of GRACE → drives the arrow's tip position.
  const bottomY = wordRect.bottom - wrapRect.top;
  wrap.style.setProperty('--grace-x', centerX + 'px');

  const arrow = wrap.querySelector('.ann-arrow-verse');
  if (!arrow) return;

  const TIP_INSET     = 6;   // arrowhead tip y-coord inside the path
  const TOP_GAP       = 6;   // SVG.top sits this many px below GRACE.bottom
  const TAIL_OVERHANG = 16;  // matches CSS bottom: -1rem

  const arrowTop    = bottomY + TOP_GAP;
  const arrowBottom = wrapRect.height + TAIL_OVERHANG;
  const arrowHeight = Math.max(40, arrowBottom - arrowTop);

  wrap.style.setProperty('--arrow-top', arrowTop + 'px');
  wrap.style.setProperty('--arrow-height', arrowHeight + 'px');

  // 1:1 viewBox-to-pixel mapping → arrowhead stays a fixed pixel size.
  arrow.setAttribute('viewBox', `0 0 55 ${arrowHeight}`);

  // Redraw the curved line to span the new height. Control points scale
  // proportionally so the curve keeps roughly the same shape — a soft
  // hook from the bottom-right up to the tip on the upper-left.
  // Arrowhead path (paths[1]) is fixed at the top and doesn't change.
  const paths = arrow.querySelectorAll('path');
  if (paths[0]) {
    const sy = arrowHeight - 5;        // tail just inside the bottom edge
    const cp1y = arrowHeight * 0.65;
    const cp2y = arrowHeight * 0.35;
    const cp3y = arrowHeight * 0.15;
    paths[0].setAttribute(
      'd',
      `M 32 ${sy} Q 24 ${cp1y}, 19 ${cp2y} Q 16 ${cp3y}, 14 ${TIP_INSET}`
    );
  }
}

positionVerseAnnotation();
window.addEventListener('resize', positionVerseAnnotation);

/* Re-measure once fonts have loaded — the word's width changes when
   Fraunces swaps in, and we want the arrow under the final layout. */
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(positionVerseAnnotation);
}
