/**
 * Mobile navigation toggle.
 *
 * Opens/closes the menu via the `.is-open` hook on `#nav` (CONTRACTS.md §3),
 * keeps `aria-expanded` truthful, and closes on Escape, on outside click, and
 * on link activation so the menu never strands a visitor mid-page.
 */
export function initNav() {
  const nav = document.querySelector('#nav');
  const toggle = nav?.querySelector('.nav__toggle');
  const links = nav?.querySelector('.nav__links');
  if (!nav || !toggle || !links) return;

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };

  const isOpen = () => nav.classList.contains('is-open');

  toggle.addEventListener('click', () => setOpen(!isOpen()));

  // Any nav link closes the menu — on a one-pager every link is same-page, so
  // leaving it open would cover the section the visitor just asked for.
  links.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      setOpen(false);
      toggle.focus(); // don't drop focus into a now-hidden menu
    }
  });

  document.addEventListener('click', (e) => {
    if (isOpen() && !nav.contains(e.target)) setOpen(false);
  });

  // Returning to desktop width must not leave the mobile state latched on.
  const desktop = window.matchMedia('(min-width: 768px)');
  const onChange = (e) => {
    if (e.matches) setOpen(false);
  };
  desktop.addEventListener('change', onChange);
}
