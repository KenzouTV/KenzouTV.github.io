// script.js - version robuste (évite les erreurs si un élément manque)
document.addEventListener('DOMContentLoaded', () => {
  // récupération optionnelle
  const linksContainer = document.getElementById('linksContainer');
  const searchInput = document.getElementById('searchInput');
  const activeTags = document.getElementById('activeTags');
  const noResult = document.getElementById('noResult');
  const dateBanner = document.getElementById('dateBanner');
  const avatar = document.getElementById('avatar');

  /* petit helper d'affichage */
  function flashMessage(txt, ms = 1300) {
    try {
      const d = document.createElement('div');
      d.textContent = txt;
      Object.assign(d.style, {
        position: 'fixed',
        left: '50%',
        top: '18px',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.78)',
        color: '#fff',
        padding: '8px 12px',
        borderRadius: '8px',
        zIndex: 9999,
      });
      document.body.appendChild(d);
      setTimeout(() => { d.style.opacity = '0'; }, ms - 200);
      setTimeout(() => d.remove(), ms);
    } catch (err) { console.warn('flashMessage error', err); }
  }

  /* Setup safe pour tous les éléments portant data-link */
  function setupClickTargets() {
    try {
      const els = Array.from(document.querySelectorAll('[data-link]'));
      els.forEach(el => {
        if (el.__clickAttached) return;
        el.__clickAttached = true;
        el.style.cursor = 'pointer';
        el.addEventListener('click', (e) => {
          const url = el.dataset.link;
          if (e.shiftKey) {
            navigator.clipboard?.writeText(url || '').then(()=> flashMessage('Lien copié !')).catch(()=> flashMessage('Impossible de copier'));
            return;
          }
          if (!url || url === '#') { flashMessage('Lien non configuré (placeholder)'); return; }
          window.open(url, '_blank');
        });
      });
    } catch (err) { console.warn('setupClickTargets error', err); }
  }
  setupClickTargets();

  /* Recherche + filtres (s'il y a une zone de liens avec data-tags) */
  function getFilterable() {
    return Array.from(document.querySelectorAll('[data-link][data-tags]'));
  }

  function filterLinks(query = '', selectedTags = []) {
    try {
      const q = (query || '').trim().toLowerCase();
      const items = getFilterable();
      let visible = 0;
      items.forEach(it => {
        const text = (it.textContent || '').toLowerCase();
        const tags = (it.dataset.tags || '').toLowerCase();
        const okQ = !q || text.includes(q) || tags.includes(q);
        const okTags = selectedTags.length === 0 || selectedTags.every(t => tags.includes(t));
        if (okQ && okTags) { it.style.display = ''; visible++; }
        else { it.style.display = 'none'; }
      });
      if (noResult) noResult.classList.toggle('hidden', visible !== 0);
    } catch (err) { console.warn('filterLinks error', err); }
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const tags = activeTags ? [...activeTags.querySelectorAll('.tag-pill')].map(t=>t.dataset.tag) : [];
      filterLinks(searchInput.value, tags);
    });
  }

  /* clique sur la liste pour ajouter tag filtrant */
  if (linksContainer && activeTags) {
    linksContainer.addEventListener('click', (e) => {
      try {
        const el = e.target.closest('[data-tags]');
        if (!el) return;
        const firstTag = (el.dataset.tags || '').split(' ')[0] || '';
        const tag = firstTag.replace('#','');
        if (!tag) return;
        toggleTag(tag);
      } catch (err) { console.warn('linksContainer click error', err); }
    });
  }

  function toggleTag(tag) {
    if (!activeTags) return;
    const existing = activeTags.querySelector(`[data-tag="${tag}"]`);
    if (existing) { existing.remove(); updateFilter(); return; }
    const pill = document.createElement('div');
    pill.className = 'tag-pill';
    pill.dataset.tag = tag;
    pill.textContent = `#${tag} ✕`;
    pill.style.cursor = 'pointer';
    pill.addEventListener('click', () => { pill.remove(); updateFilter(); });
    activeTags.appendChild(pill);
    updateFilter();
  }

  function updateFilter() {
    const tags = activeTags ? [...activeTags.querySelectorAll('.tag-pill')].map(t=>t.dataset.tag) : [];
    filterLinks(searchInput ? searchInput.value : '', tags);
  }

  /* date banner (1er janvier) */
  (function dateBannerInit(){
    if (!dateBanner) return;
    try {
      const d = new Date();
      if (d.getDate() === 1 && (d.getMonth()+1) === 1) {
        dateBanner.classList.remove('hidden');
        dateBanner.classList.add('yellow');
        dateBanner.textContent = `Bonne année ${d.getFullYear()} ! 🎉`;
        dateBanner.style.opacity = '0';
        dateBanner.style.transform = 'translate(-50%,-8px) scale(.98)';
        setTimeout(()=> { dateBanner.style.transition = 'all .45s'; dateBanner.style.opacity='1'; dateBanner.style.transform='translate(-50%,0) scale(1)'; }, 20);
        setTimeout(()=> dateBanner.classList.add('hidden'), 7000);
      }
    } catch (err) { console.warn('dateBannerInit error', err); }
  })();

  /* avatar tilt */
  if (avatar) {
    avatar.addEventListener('mousemove', e => {
      try {
        const rect = avatar.getBoundingClientRect();
        const cx = rect.left + rect.width/2;
        const cy = rect.top + rect.height/2;
        const dx = (e.clientX - cx) / rect.width;
        const dy = (e.clientY - cy) / rect.height;
        avatar.style.transform = `perspective(900px) rotateY(${dx*8}deg) rotateX(${-dy*8}deg) translateZ(6px)`;
      } catch(e){/* silencieux */}
    });
    avatar.addEventListener('mouseleave', () => avatar.style.transform = '');
  }

  /* idle animation stagger (safe) */
  (function idleStagger(){
    try {
      const idles = Array.from(document.querySelectorAll('.idle'));
      idles.forEach((el) => {
        const r = (Math.random()*1.6).toFixed(2);
        el.style.animationDelay = `${r}s`;
        const dur = 5 + Math.random()*3;
        el.style.animationDuration = `${dur}s`;
        if (window.matchMedia && window.matchMedia('(hover: none)').matches) el.style.animation = 'none';
      });
    } catch (err) { console.warn('idleStagger error', err); }
  })();

  /* tilt 3D sur cartes (au survol) */
  try {
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width/2) / r.width;
        const dy = (e.clientY - r.top - r.height/2) / r.height;
        card.style.transform = `perspective(900px) rotateX(${ -dy * 6 }deg) rotateY(${ dx * 8 }deg) translateZ(6px)`;
        card.style.transition = 'transform .08s';
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  } catch (err) { /* ignore */ }

  /* contact form (studio) */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const fm = document.getElementById('formMsg');
      if (fm) fm.textContent = 'Message envoyé (simulé)';
      contactForm.reset();
      flashMessage('Message envoyé ✅');
      setTimeout(()=> { if (fm) fm.textContent = ''; }, 3000);
    });
  }

  /* BlockFrame handlers (join / request access) */
  const joinBtn = document.getElementById('joinBlock');
  const requestAccessBtn = document.getElementById('requestAccessBtn');
  const accessForm = document.getElementById('accessForm');
  const accessFeedback = document.getElementById('accessFeedback');

  if (joinBtn) {
    joinBtn.addEventListener('click', () => {
      const invite = 'https://discord.gg/TON_INVITE_ICI';
      if (!invite || invite === '#' || invite.includes('TON_INVITE_ICI')) {
        flashMessage("Serveur restreint — utilise 'Demander l'accès'.");
        return;
      }
      window.open(invite, '_blank');
    });
  }
  if (requestAccessBtn) {
    requestAccessBtn.addEventListener('click', () => {
      const p = document.querySelector('#accessForm input[name="pseudo"]');
      if (p) p.focus();
      flashMessage('Remplis le formulaire pour demander l’accès');
    });
  }
  if (accessForm) {
    accessForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(accessForm);
      const pseudo = data.get('pseudo') || 'Anonyme';
      const role = data.get('role') || '—';
      const msg = data.get('msg') || '';
      console.log('Demande accès BlockFrame :', { pseudo, role, msg, t: new Date().toISOString() });
      if (accessFeedback) accessFeedback.textContent = "Demande envoyée — je te répondrai sur Discord si accepté.";
      accessForm.reset();
      flashMessage('Demande envoyée ✅');
      setTimeout(()=> { if (accessFeedback) accessFeedback.textContent = ''; }, 6000);
    });
  }

  // reset button
  const resetFormBtn = document.getElementById('resetForm');
  if (resetFormBtn) resetFormBtn.addEventListener('click', () => { const f = document.getElementById('accessForm'); if (f) f.reset(); flashMessage('Formulaire réinitialisé'); });

  // Dernière passe : setup click targets et filtre initial
  setupClickTargets();
  filterLinks('', []);
});
