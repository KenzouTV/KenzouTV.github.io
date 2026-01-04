// Elements
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const reportBtn = document.getElementById('reportBtn');
const reportModal = document.getElementById('reportModal');
const closeModal = document.getElementById('closeModal');
const cancelReport = document.getElementById('cancelReport');
const sendReport = document.getElementById('sendReport');
const reportText = document.getElementById('reportText');

const THEME_KEY = 'kenzou_theme';

// Utility: set the theme and icon
function setTheme(mode) {
  document.body.classList.remove('dark', 'light');
  document.body.classList.add(mode);
  localStorage.setItem(THEME_KEY, mode);

  // change icon to sun (light) or moon (dark + sun inside)
  if (mode === 'light') {
    themeIcon.innerHTML = '<path d="M6.76 4.84l-1.8-1.79L3.17 5.84l1.79 1.79 1.8-2.79zM1 13h2v-2H1v2zm10 8h2v-2h-2v2zm9-8v-2h-2v2h2zm-4.24-8.16l1.8-1.79-1.79-1.79-1.8 1.79 1.79 1.79zM12 6a6 6 0 100 12 6 6 0 000-12zM4.22 18.36l1.79-1.79-1.79-1.79-1.79 1.79 1.79 1.79zM17.78 18.36l1.79-1.79-1.79-1.79-1.79 1.79 1.79 1.79z"/>';
  } else {
    themeIcon.innerHTML = '<path d="M12 3a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1zM6.22 6.22a1 1 0 0 1 1.41 0l.7.7a1 1 0 1 1-1.41 1.41l-.7-.7a1 1 0 0 1 0-1.41zM3 13a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zm8 7a1 1 0 0 1 1-1h0a1 1 0 1 1 0 2 1 1 0 0 1-1-1zM17.78 6.22a1 1 0 0 1 0 1.41l-.7.7a1 1 0 1 1-1.41-1.41l.7-.7a1 1 0 0 1 1.41 0zM20 12a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1zM6.22 17.78a1 1 0 0 1 0-1.41l.7-.7a1 1 0 1 1 1.41 1.41l-.7.7a1 1 0 0 1-1.41 0zM17.78 17.78a1 1 0 0 1 0-1.41l.7-.7a1 1 0 1 1 1.41 1.41l-.7.7a1 1 0 0 1-1.41 0zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"/>';
  }
}

// Initialize theme from localStorage or default to dark
const saved = localStorage.getItem(THEME_KEY);
setTheme(saved === 'light' ? 'light' : 'dark');

// Toggle theme on button
themeToggle.addEventListener('click', () => {
  const now = document.body.classList.contains('light') ? 'light' : 'dark';
  setTheme(now === 'light' ? 'dark' : 'light');
});

/* Report modal logic */
function openModal() {
  reportModal.setAttribute('aria-hidden','false');
  reportText.focus();
}
function closeModalFn() {
  reportModal.setAttribute('aria-hidden','true');
  reportText.value = '';
}

reportBtn.addEventListener('click', openModal);
closeModal.addEventListener('click', closeModalFn);
cancelReport.addEventListener('click', closeModalFn);

// Prepare mailto with description + page info
sendReport.addEventListener('click', () => {
  const text = reportText.value.trim() || 'Pas de description fournie';
  const subject = encodeURIComponent('Signalement — Kenzou Links');
  const body = encodeURIComponent(`Signalement envoyé depuis : ${location.href}\n\nDescription :\n${text}`);
  const mailto = `mailto:tonemail@example.com?subject=${subject}&body=${body}`;
  // open mail client
  window.location.href = mailto;
  // give user feedback and close modal
  closeModalFn();
});
