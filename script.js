/* script.js - gestion recherche, tags, clics, et bandeau date */
document.addEventListener('DOMContentLoaded', () => {
  const linksContainer = document.getElementById('linksContainer');
  const searchInput = document.getElementById('searchInput');
  const activeTags = document.getElementById('activeTags');
  const noResult = document.getElementById('noResult');
  const dateBanner = document.getElementById('dateBanner');

  // ouvre les boutons link dans un nouvel onglet
  document.querySelectorAll('.link-btn, .btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const url = btn.dataset.link;
      if (!url || url === '#') return;
      window.open(url, '_blank');
    });
  });

  // recherche live
  function filterLinks(query, selectedTags = []) {
    const btns = Array.from(linksContainer.querySelectorAll('.link-btn'));
    const q = (query || '').trim().toLowerCase();
    let visible = 0;
    btns.forEach(btn => {
      const text = btn.textContent.toLowerCase();
      const tags = (btn.dataset.tags || '').toLowerCase();
      const matchQuery = !q || text.includes(q) || tags.includes(q);
      const matchTags = selectedTags.length === 0 || selectedTags.every(t => tags.includes(t));
      if (matchQuery && matchTags) {
        btn.classList.remove('hidden');
        btn.style.display = 'flex';
        visible++;
      } else {
        btn.style.display = 'none';
      }
    });
    noResult.classList.toggle('hidden', visible !== 0);
  }

  // ajouter tags quand on clique sur une tag (ex. dans .tags)
  linksContainer.addEventListener('click', e => {
    const btn = e.target.closest('.link-btn');
    if (!btn) return;
    const tagsText = btn.dataset.tags || '';
    // si shift clique => copie lien
    if (e.shiftKey) {
      navigator.clipboard?.writeText(btn.dataset.link || '').then(()=> {
        alert('Lien copié !');
      }).catch(()=>{});
      return;
    }
    // sinon on ajoute la première tag comme filtre rapide
    const tag = (tagsText.split(' ')[0] || '').replace('#','');
    if (!tag) return;
    addTagFilter(tag);
  });

  function addTagFilter(tag) {
    // si déjà présent, la supprime
    const existing = activeTags.querySelector(`[data-tag="${tag}"]`);
    const selectedTags = [...activeTags.querySelectorAll('.tag-pill')].map(t=>t.dataset.tag);
    if (existing) {
      existing.remove();
      filterLinks(searchInput.value, selectedTags.filter(t => t !== tag));
      return;
    }
    const el = document.createElement('div');
    el.className = 'tag-pill';
    el.dataset.tag = tag;
    el.textContent = `#${tag} ✕`;
    el.addEventListener('click', () => {
      el.remove();
      filterLinks(searchInput.value, [...activeTags.querySelectorAll('.tag-pill')].map(t=>t.dataset.tag));
    });
    activeTags.appendChild(el);
    filterLinks(searchInput.value, [...activeTags.querySelectorAll('.tag-pill')].map(t=>t.dataset.tag));
  }

  // recherche input
  searchInput.addEventListener('input', () => filterLinks(searchInput.value, [...activeTags.querySelectorAll('.tag-pill')].map(t=>t.dataset.tag)));

  // affiche bandeau "Bonne année" le 1er janvier
  (function showDateBanner(){
    const today = new Date();
    const d = today.getDate();
    const m = today.getMonth() + 1;
    const y = today.getFullYear();
    if (d === 1 && m === 1) {
      dateBanner.classList.remove('hidden');
      dateBanner.classList.add('yellow');
      dateBanner.textContent = `Bonne année ${y} ! 🎉`;
      // petite animation d'apparition
      dateBanner.style.opacity = '0';
      dateBanner.style.transform = 'translate(-50%, -10px) scale(.98)';
      setTimeout(()=> { dateBanner.style.transition = 'all .45s cubic-bezier(.2,.9,.3,1)'; dateBanner.style.opacity='1'; dateBanner.style.transform='translate(-50%, 0) scale(1)'; }, 20);
      // et disparait au bout de 6s
      setTimeout(()=> dateBanner.classList.add('fadeout'), 7000);
    }
  })();

  // effet "tilt" léger sur l'avatar
  const avatar = document.getElementById('avatar');
  if (avatar) {
    avatar.addEventListener('mousemove', e => {
      const rect = avatar.getBoundingClientRect();
      const cx = rect.left + rect.width/2;
      const cy = rect.top + rect.height/2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      avatar.style.transform = `perspective(800px) rotateY(${dx*6}deg) rotateX(${-dy*6}deg) translateZ(4px)`;
    });
    avatar.addEventListener('mouseleave', () => {
      avatar.style.transform = '';
    });
  }

  // initial filter (vide)
  filterLinks('', []);
});
