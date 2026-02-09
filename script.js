// script.js — logique commune & petites animations


// --- Cursor follower & background parallax
const follower = document.getElementById('follower');
const heroCard = document.getElementById('heroCard');


document.addEventListener('mousemove', e => {
const x = e.clientX;
const y = e.clientY;
if(follower) follower.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1)`;
document.documentElement.style.setProperty('--mx', x + 'px');
document.documentElement.style.setProperty('--my', y + 'px');
if(heroCard){
const rect = heroCard.getBoundingClientRect();
const dx = (x - (rect.left + rect.width/2))/20;
const dy = (y - (rect.top + rect.height/2))/30;
heroCard.style.transform = `translate(${dx}px, ${dy}px)`;
}
});


// --- Links data injection (utilisé par links.html)
const linksData = [
{title:'YouTube',desc:"Chaîne KENZOUTV",img:'yt.jpg',href:'https://youtube.com/'},
{title:'Discord',desc:'Rejoins le serveur',img:'discord.jpg',href:'https://discord.gg/'},
{title:'Instagram',desc:"Bannière & coulisses",img:'insta.jpg',href:'https://instagram.com/'},
{title:'Portfolio',desc:'Page projet',img:'project.jpg',href:'#'}
];


function injectLinks(){
const grid = document.getElementById('linksGrid');
if(!grid) return;
linksData.forEach(l =>{
const a = document.createElement('a');
a.className = 'card link-card';
a.href = l.href; a.target = '_blank';
a.innerHTML = `<img src="${l.img}" alt="${l.title}" style="width:64px;height:64px;object-fit:cover;border-radius:8px;margin-right:12px"><div style="flex:1"><h4 style=\"margin:0\">${l.title}</h4><p class=\"muted\" style=\"margin:6px 0 0\">${l.desc}</p></div><div style=\"font-weight:800;color:var(--accent)\">→</div>`;
grid.appendChild(a);
});
}


// Run injection on DOM ready
if(document.readyState === 'loading'){
document.addEventListener('DOMContentLoaded', injectLinks);
} else {
injectLinks();
}


// --- Discord quick open (change invite in code if you have one)
['discordLink','discordLink2','discordLink3'].forEach(id=>{
const el = document.getElementById(id);
if(el) el.addEventListener('click', e=>{
e.preventDefault();
const invite = 'https://discord.gg/REMPLACE-MOI';
window.open(invite, '_blank');
});
});


// --- Small reveal for elements with class .fade
window.addEventListener('load', ()=>{
document.querySelectorAll('.fade').forEach((el, i)=>{
setTimeout(()=> el.classList.add('in'), 120 * i);
});
});
