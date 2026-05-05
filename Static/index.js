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

/* Position + size the curved arrow that points up at GRACE.

   Two things move with the layout:

   1. Horizontal — `--grace-x` is set to GRACE's center-x (relative to
      .verse-wrap). Both the arrow and the "the heart of it" handwriting
      use this so they always sit in GRACE's column.

   2. Vertical — the arrow's tip is anchored to the GAP between the
      verse text and the cite (i.e. the cite's `margin-top` area). NOT
      to GRACE.bottom. When the verse wraps to multiple lines, GRACE
      sits on line 1 with text on line 2 immediately below it — placing
      the tip "just below GRACE" puts it INSIDE that line 2 text (the
      tip ends up kissing "is made…"). The cite sits below the entire
      verse with a comfortable 1.1rem margin above it, so anchoring
      there keeps the tip in clear empty space regardless of line count.

      The tail still anchors to wrap.bottom + 1rem (matching the
      original look), so the arrow simply grows taller on narrow
      screens — the diagonal hook gets longer, still pointing at GRACE.

   The SVG's viewBox is re-set to 1:1 with pixel dimensions on every
   measurement, so the arrowhead at viewBox y=6..14 stays exactly 8px
   tall in pixels regardless of arrow length. Only the curved line
   (paths[0]) gets redrawn; the arrowhead (paths[1]) is untouched. */
function positionVerseAnnotation() {
  const word = document.getElementById('grace-word');
  if (!word) return;
  const wrap = word.closest('.verse-wrap');
  if (!wrap) return;

  const wordRect = word.getBoundingClientRect();
  const wrapRect = wrap.getBoundingClientRect();

  const centerX = (wordRect.left + wordRect.width / 2) - wrapRect.left;
  wrap.style.setProperty('--grace-x', centerX + 'px');

  const arrow = wrap.querySelector('.ann-arrow-verse');
  if (!arrow) return;

  // Anchor the tip 6px above the cite — that's inside the cite's top
  // margin, comfortably below the last verse line and above the cite
  // text. Falls back to "12px below GRACE" if the cite somehow isn't
  // there (e.g. someone restructures the markup).
  const cite = wrap.querySelector('.verse cite');
  const tipY = cite
    ? (cite.getBoundingClientRect().top - wrapRect.top) - 6
    : (wordRect.bottom - wrapRect.top) + 12;

  const TIP_INSET     = 6;   // arrowhead tip y-coord inside the path
  const TAIL_OVERHANG = 16;  // matches CSS bottom: -1rem

  const arrowTop    = tipY - TIP_INSET;
  const arrowBottom = wrapRect.height + TAIL_OVERHANG;
  const arrowHeight = Math.max(40, arrowBottom - arrowTop);

  wrap.style.setProperty('--arrow-top', arrowTop + 'px');
  wrap.style.setProperty('--arrow-height', arrowHeight + 'px');

  arrow.setAttribute('viewBox', `0 0 55 ${arrowHeight}`);

  // Redraw the curved line to span the new height. Control points scale
  // proportionally so the curve keeps its soft-hook shape.
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
