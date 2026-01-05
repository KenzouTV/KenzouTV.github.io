const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const search = document.getElementById("search");
const linksZone = document.getElementById("linksZone");

/* ===== THEME ===== */
function setTheme(theme) {
  body.className = theme;
  themeToggle.textContent = theme === "dark" ? "🌙" : "☀️";
  localStorage.setItem("theme", theme);
}

setTheme(localStorage.getItem("theme") || "dark");

themeToggle.onclick = () => {
  setTheme(body.classList.contains("dark") ? "light" : "dark");
};

/* ===== TAG SEARCH PRIORITY ===== */
search.addEventListener("input", () => {
  const value = search.value.toLowerCase();

  const links = Array.from(linksZone.querySelectorAll(".link"));

  links.forEach(link => {
    const tags = link.dataset.tags || "";
    const match = tags.includes(value) || link.textContent.toLowerCase().includes(value);
    link.style.order = match ? -1 : 1;
    link.style.display = value === "" || match ? "block" : "none";
  });
});
