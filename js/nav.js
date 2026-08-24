/* Mobile navigation toggle.
   The nav must never simply disappear on small screens — it did once, which
   left phones with no way to reach the other pages. This hides it behind a
   button instead, and the button only exists below 760px (see .navtoggle in
   site.css). If this script fails to load the nav stays visible, because the
   collapsed state is applied by CSS only when JS has added .js-nav. */
(function () {
  var btn = document.querySelector('.navtoggle');
  var nav = document.getElementById('sitenav');
  if (!btn || !nav) return;

  document.documentElement.classList.add('js-nav');

  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Close after tapping a link, so in-page anchors don't leave the menu open.
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('open');
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();
