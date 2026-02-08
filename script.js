// script.js — Version complète pour index.html, links.html et studio.html
document.addEventListener('DOMContentLoaded', () => {
  // éléments potentiels (s'ils existent sur la page)
  const linksContainer = document.getElementById('linksContainer');
  const searchInput = document.getElementById('searchInput');
  const activeTags = document.getElementById('activeTags');
  const noResult = document.getElementById('noResult');
  const dateBanner = document.getElementById('dateBanner');
  const avatar = document.getElementById('avatar');

  /* ---------------------- utilitaires ---------------------- */
  function flashMessage(txt, ms = 1200) {
    const d = document.createElement('div');
    d.textContent = txt;
    Object.assign(d.style, {
      position: 'fixed',
      left: '50%',
      top: '18px',
      transform: 'translateX(-50%)',
      background: 'rgba(0,0,0,0.75)',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: '8px',
      zIndex: 9999,
      transition: 'opacity .25s',
    });
    document.body.appendChild(d);
    setTimeout(() => { d.style.opacity = '0'; }, ms - 220);
    setTimeout(() => { d.remove(); }, ms);
  }

  /* ---------------------- clics / ouverture liens ---------------------- */
  function setupClickTargets() {
    document.querySelectorAll('[data-link]').forEach(el => {
      // évite d'ajouter plusieurs fois
      if (el.__clickAttached) return;
      el.__clickAttached = true;
      el.style.cursor = 'pointer';
      el.addEventListener('click', (e) => {
        const url = el.dataset.link;
        // SHIFT + clic => copie le lien
        if (e.shiftKey) {
          navigator.clipboard?.writeText(url || '').then(() => {
            flashMessage('Lien copié !');
          }).catch(() => { flashMessage('Impossible de copier'); });
          return;
        }
        if (!url || url === '#') {
          flashMessage('Lien non configuré (placeholder)', 1400);
          return;
        }
        // ouvre dans un nouvel onglet
        window.open(url, '_blank');
      });
    });
  }

  setupClickTargets();

  /* ---------------------- recherche + filtrage par tags ---------------------- */
  // sélectionne tous les éléments filtrables (ayant data-link ET data-tags)
  function getFilterableElements() {
    return Array.from(document.querySelectorAll('[data-link][data-tags]'));
  }

  function filterLinks(query = '', selectedTags = []) {
    const q = (query || '').trim().toLowerCase();
    const btns = getFilterableElements();
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
      const tags = activeTags ? [...activeTags.querySelectorAll('.tag-pill')].map(t => t.dataset.tag) : [];
      filterLinks(searchInput.value, tags);
    });
  }

  // clic dans la liste pour ajouter un tag filtre (clic simple sur un lien)
  if (linksContainer && activeTags) {
    linksContainer.addEventListener('click', (e) => {
      const el = e.target.closest('[data-tags]');
      if (!el) return;
      const firstTag = (el.dataset.tags || '').split(' ')[0] || '';
      const tag = firstTag.replace('#','');
      if (!tag) return;
      toggleTag(tag);
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

  /* ---------------------- bandeau date (1er janvier) ---------------------- */
  (function showDateBanner(){
    if (!dateBanner) return;
    try {
      const today = new Date();
      if (today.getDate() === 1 && (today.getMonth() + 1) === 1) {
        dateBanner.classList.remove('hidden');
        dateBanner.classList.add('yellow');
        dateBanner.textContent = `Bonne année ${today.getFullYear()} ! 🎉`;
        dateBanner.style.opacity = '0';
        dateBanner.style.transform = 'translate(-50%,-8px) scale(.98)';
        setTimeout(()=> { dateBanner.style.transition = 'all .45s cubic-bezier(.2,.9,.3,1)'; dateBanner.style.opacity='1'; dateBanner.style.transform='translate(-50%,0) scale(1)'; }, 20);
        setTimeout(()=> dateBanner.classList.add('hidden'), 7000);
      }
    } catch (err) { console.warn('Date banner error', err); }
  })();

  /* ---------------------- avatar tilt (souris) ---------------------- */
  if (avatar) {
    avatar.addEventListener('mousemove', e => {
      const rect = avatar.getBoundingClientRect();
      const cx = rect.left + rect.width/2;
      const cy = rect.top + rect.height/2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      avatar.style.transform = `perspective(900px) rotateY(${dx*8}deg) rotateX(${-dy*8}deg) translateZ(6px)`;
    });
    avatar.addEventListener('mouseleave', () => { avatar.style.transform = ''; });
  }

  /* ---------------------- idle animations (stagger) ---------------------- */
  (function staggerIdle(){
    const idles = Array.from(document.querySelectorAll('.idle'));
    idles.forEach((el, i) => {
      const r = (Math.random()*1.6).toFixed(2);
      el.style.animationDelay = `${r}s`;
      const dur = 5 + Math.random()*3;
      el.style.animationDuration = `${dur}s`;
      // Pour éviter trop de mouvement sur mobile
      if (window.matchMedia && window.matchMedia('(hover: none)').matches) {
        el.style.animation = 'none';
      }
    });
  })();

  /* ---------------------- tilt 3D sur .card (au survol) ---------------------- */
  document.querySelectorAll('.card').forEach(card => {
    // souris
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width/2) / r.width;
      const dy = (e.clientY - r.top - r.height/2) / r.height;
      card.style.transform = `perspective(900px) rotateX(${ -dy * 6 }deg) rotateY(${ dx * 8 }deg) translateZ(6px)`;
      card.style.transition = 'transform .08s';
    });
    // reset
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ---------------------- contact form (studio) ---------------------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const formMsg = document.getElementById('formMsg');
      if (formMsg) formMsg.textContent = 'Message envoyé (simulé) — merci !';
      contactForm.reset();
      setTimeout(()=> { if (formMsg) formMsg.textContent = ''; }, 3000);
      flashMessage('Message envoyé ✅', 1300);
    });
  }

  /* ---------------------- BlockFrame : rejoindre / demande d'accès ---------------------- */
  const joinBtn = document.getElementById('joinBlock');
  const requestAccessBtn = document.getElementById('requestAccessBtn');
  const accessForm = document.getElementById('accessForm');
  const accessFeedback = document.getElementById('accessFeedback');

  if (joinBtn) {
    joinBtn.addEventListener('click', () => {
      // mets ton lien d'invite réel ici :
      const invite = 'https://discord.gg/TON_INVITE_ICI';
      if (!invite || invite === '#' || invite.includes('TON_INVITE_ICI')) {
        flashMessage('Serveur restreint — utilise "Demander l\'accès".', 2000);
        return;
      }
      window.open(invite, '_blank');
    });
  }

  if (requestAccessBtn) {
    requestAccessBtn.addEventListener('click', () => {
      const pseudoInput = document.querySelector('#accessForm input[name="pseudo"]');
      if (pseudoInput) pseudoInput.focus();
      flashMessage('Remplis le formulaire pour demander l’accès', 1600);
    });
  }

  if (accessForm) {
    accessForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(accessForm);
      const pseudo = data.get('pseudo') || 'Anonyme';
      const role = data.get('role') || '—';
      const msg = data.get('msg') || '';
      // simulation : ici tu pourrais envoyer vers un webhook si tu veux
      console.log('Demande accès BlockFrame:', { pseudo, role, msg, time: new Date().toISOString() });
      if (accessFeedback) accessFeedback.textContent = 'Demande envoyée — je vérifierai et te répondrai sur Discord si accepté.';
      accessForm.reset();
      flashMessage('Demande envoyée ✅', 1600);
      setTimeout(()=> { if (accessFeedback) accessFeedback.textContent = ''; }, 6000);
    });
  }

  const resetFormBtn = document.getElementById('resetForm');
  if (resetFormBtn) {
    resetFormBtn.addEventListener('click', () => {
      const f = document.getElementById('accessForm');
      if (f) f.reset();
      flashMessage('Formulaire réinitialisé', 900);
    });
  }

  /* ---------------------- final setup / initial filter ---------------------- */
  // s'assure que les click targets sont prêtes (après potentiels ajouts dynamiques)
  setupClickTargets();
  // filtre initial (vide)
  filterLinks('', []);
});
