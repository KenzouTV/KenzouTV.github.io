const body = document.body;
const themeToggle = document.getElementById("themeToggle");

const mainLinks = document.getElementById("mainLinks");
const minecraftLinks = document.getElementById("minecraftLinks");

const minecraftBtn = document.getElementById("minecraftBtn");
const backBtn = document.getElementById("backBtn");

const search = document.getElementById("search");

/* ===== THEME ===== */
function setTheme(theme) {
  body.className = theme;
  themeToggle.textContent = theme === "dark" ? "🌙" : "☀️";
  localStorage.setItem("theme", theme);
}

themeToggle.addEventListener("click", () => {
  setTheme(body.classList.contains("dark") ? "light" : "dark");
});

setTheme(localStorage.getItem("theme") || "dark");

/* ===== NAV MINECRAFT ===== */
minecraftBtn.addEventListener("click", () => {
  mainLinks.classList.add("hidden");
  minecraftLinks.classList.remove("hidden");
});

backBtn.addEventListener("click", () => {
  minecraftLinks.classList.add("hidden");
  mainLinks.classList.remove("hidden");
});

/* ===== RECHERCHE ===== */
search.addEventListener("input", () => {
  const value = search.value.toLowerCase();
  document.querySelectorAll(".link").forEach(link => {
    link.style.display = link.textContent.toLowerCase().includes(value)
      ? "block"
      : "none";
  });
});
