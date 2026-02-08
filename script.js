// script.js
document.addEventListener('DOMContentLoaded', () => {
  // elements communs
  const linksContainer = document.getElementById('linksContainer');
  const searchInput = document.getElementById('searchInput');
  const activeTags = document.getElementById('activeTags');
  const noResult = document.getElementById('noResult');
  const dateBanner = document.getElementById('dateBanner');

  // ouvrir les éléments cliqués (link-btn, link-card, btn)
  function setupClickTargets() {
    document.querySelectorAll('[data-link]').forEach(el => {
      el.style.cursor = 'pointer';
      el.addEventListener('click', (e) => {
        const url = el.dataset.link;
        // shift pour copier
        if (e.shiftKey) {
          navigator.clipboard?.writeText(url || '').then(()=> alert('Lien copié !')).catch(()=>{});
          return;
        }
        if (!url || url === '#') {
          // placeholder : peut ouvrir modal
          flashMessage('Lien temporaire', 1200);
          return;
        }
        window.open(url, '_blank');
      });
    });
  }

  setupClickTargets();

  // recherche live (si présent)
  function filterLinks(query, selectedTags = []) {
    if (!linksContainer) return;
    const btns = Array.from(linksContainer.querySelectorAll('[data-link]'));
    const q = (query || '').trim().toLowerCase();
    let visible = 0;
    btns.forEach(el => {
      const text = (el.textContent || '').toLowerCase();
      const tags = (el.dataset.tags || '').toLowerCase();
      const matchQuery = !q || text.includes(q) || tags.includes(q);
      const matchTags = selectedTags.length === 0 || selectedTags.every(t => tags.includes(t));
      if (matchQuery && matchTags) {
        el.style.display = '';
        visible++;
      } else {
        el.style.display = 'none';
      }
    });
    if (noResult) noResult.classList.toggle('hidden', visible !== 0);
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      filterLinks(searchInput.value, [...activeTags.querySelectorAll('.tag-pill')].map(t=>t.dataset.tag));
    });
  }

  // tags cliquables (créer / supprimer)
  if (linksContainer && activeTags) {
    linksContainer.addEventListener('click', e => {
      const el = e.target.closest('[data-tags]');
      if (!el) return;
      const tagsText = (el.dataset.tags || '').split(' ')[0] || '';
      const tag = tagsText.replace('#','');
      if (!tag) return;
      toggleTag(tag);
    });
  }

  function toggleTag(tag) {
    const existing = activeTags.querySelector(`[data-tag="${tag}"]`);
    if (existing) { existing.remove(); updateFilter(); return; }
    const pill = document.createElement('div');
    pill.className = 'tag-pill';
    pill.dataset.tag = tag;
    pill.textContent = `#${tag} ✕`;
    pill.addEventListener('click', () => { pill.remove(); updateFilter(); });
    activeTags.appendChild(pill);
    updateFilter();
  }
  function updateFilter() {
    const tags = [...activeTags.querySelectorAll('.tag-pill')].map(t=>t.dataset.tag);
    filterLinks(searchInput ? searchInput.value : '', tags);
  }

  // date banner (1er janvier)
  (function showDateBanner(){
    if (!dateBanner) return;
    const today = new Date();
    if (today.getDate() === 1 && (today.getMonth()+1) === 1) {
      dateBanner.classList.remove('hidden');
      dateBanner.classList.add('yellow');
      dateBanner.textContent = `Bonne année ${today.getFullYear()} ! 🎉`;
      dateBanner.style.opacity = '0';
      dateBanner.style.transform = 'translate(-50%,-8px) scale(.98)';
      setTimeout(()=> { dateBanner.style.transition = 'all .45s'; dateBanner.style.opacity='1'; dateBanner.style.transform='translate(-50%,0) scale(1)'; }, 20);
      setTimeout(()=> dateBanner.classList.add('hidden'), 7000);
    }
  })();

  // petites fonctions utilitaires
  function flashMessage(txt, ms=1000) {
    const d = document.createElement('div');
    d.textContent = txt;
    d.style.position='fixed'; d.style.left='50%'; d.style.top='24px';
    d.style.transform='translateX(-50%)'; d.style.background='rgba(0,0,0,.7)';
    d.style.color='#fff'; d.style.padding='8px 12px'; d.style.borderRadius='8px'; d.style.zIndex='9999';
    document.body.appendChild(d);
    setTimeout(()=> d.style.opacity='0', ms-200);
    setTimeout(()=> d.remove(), ms);
  }

  // Idle animations : ajoute un delay aléatoire pour rendre le mouvement organique
  (function staggerIdle(){
    const idles = Array.from(document.querySelectorAll('.idle'));
    idles.forEach((el,i) => {
      const r = (Math.random()*1.8).toFixed(2);
      el.style.animationDelay = `${r}s`;
      // petite variation de durée
      const dur = 5 + Math.random()*3;
      el.style.animationDuration = `${dur}s`;
    });
  })();

  // effet "tilt" 3D léger suivant la souris sur les éléments .card
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width/2) / r.width;
      const dy = (e.clientY - r.top - r.height/2) / r.height;
      card.style.transform = `perspective(900px) rotateX(${ -dy * 6 }deg) rotateY(${ dx * 8 }deg) translateZ(6px)`;
      card.style.transition = 'transform .08s';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // contact form (studio)
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const formMsg = document.getElementById('formMsg');
      formMsg.textContent = 'Message envoyé (simulé) — merci !';
      form.reset();
      setTimeout(()=> formMsg.textContent = '', 3000);
    });
  }

  // relancer setup au cas où nouvelles pages DOM load
  setupClickTargets();
});
