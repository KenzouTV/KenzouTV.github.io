const themeBtn = document.getElementById("themeToggle");
const reportBtn = document.getElementById("reportBtn");

themeBtn.onclick = () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
};

reportBtn.onclick = () => {
  alert("Signale le problème par Discord ou par mail ✉️");
};
