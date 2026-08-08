/**
 * Same-page anchor navigation.
 *
 * Scrolls smoothly (instantly, under reduced motion) and — the part native
 * anchors get wrong once you preventDefault — moves keyboard focus to the
 * target so the next Tab continues from the new section instead of the top of
 * the document.
 */
export function initSmoothScroll({ reducedMotion }) {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute('href');
    if (!id || id === '#') return;

    const target = document.querySelector(id);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });

    // Sections aren't focusable by default; make it focusable just long enough
    // to receive focus, without leaving a stray tab stop behind.
    const hadTabindex = target.hasAttribute('tabindex');
    if (!hadTabindex) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    if (!hadTabindex) {
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), {
        once: true,
      });
    }

    // Keep the URL shareable without triggering a second, jumpy scroll.
    if (window.history?.replaceState) {
      window.history.replaceState(null, '', id);
    }
  });
}
