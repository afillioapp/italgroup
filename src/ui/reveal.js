/**
 * Scroll reveal.
 *
 * Flips `[data-reveal]` to `[data-reveal="in"]` as elements enter the viewport.
 * Under reduced motion nothing is observed at all — every element is marked
 * revealed up front, so the content is never gated behind an animation the
 * visitor has asked not to see.
 */
export function initReveal({ reducedMotion }) {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  if (reducedMotion || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.setAttribute('data-reveal', 'in'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute('data-reveal', 'in');
        observer.unobserve(entry.target); // reveal once, then stop paying for it

        // Drop the compositor layer the CSS asked for once the transition is
        // done — ~20 permanently promoted layers is real memory for nothing.
        entry.target.addEventListener(
          'transitionend',
          () => {
            entry.target.style.willChange = 'auto';
          },
          { once: true }
        );
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.1 }
  );

  items.forEach((el) => observer.observe(el));
}
