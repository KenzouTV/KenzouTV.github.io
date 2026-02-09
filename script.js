// cursor follower with a tiny easing to be smooth but safe
(() => {
  const follower = document.getElementById('follower');
  if (!follower) return;

  let mouseX = 0, mouseY = 0;
  let posX = 0, posY = 0;
  const ease = 0.18;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // update CSS vars for background focal point
    document.documentElement.style.setProperty('--mx', mouseX + 'px');
    document.documentElement.style.setProperty('--my', mouseY + 'px');
  });

  function raf() {
    posX += (mouseX - posX) * ease;
    posY += (mouseY - posY) * ease;
    follower.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // small parallax on hero card if present
  const hero = document.querySelector('.hero-card');
  if (hero) {
    document.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width/2)) / 30;
      const dy = (e.clientY - (r.top + r.height/2)) / 40;
      hero.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    // reset on leave
    hero.addEventListener('mouseleave', ()=> hero.style.transform = '');
  }
})();
