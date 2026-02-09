// léger script: parallax background focal point + hero parallax
(() => {
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
mouseX = e.clientX;
mouseY = e.clientY;
document.documentElement.style.setProperty('--mx', mouseX + 'px');
document.documentElement.style.setProperty('--my', mouseY + 'px');
});


// parallax on hero card
const hero = document.querySelector('.hero-card');
if (hero) {
document.addEventListener('mousemove', e => {
const r = hero.getBoundingClientRect();
const dx = (e.clientX - (r.left + r.width/2)) / 30;
const dy = (e.clientY - (r.top + r.height/2)) / 40;
hero.style.transform = `translate(${dx}px, ${dy}px)`;
});
hero.addEventListener('mouseleave', ()=> hero.style.transform = '');
}
})();
