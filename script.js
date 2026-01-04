const themeBtn = document.getElementById("themeToggle");
const minecraftBtn = document.getElementById("minecraftBtn");
const backBtn = document.getElementById("backBtn");

const mainLinks = document.getElementById("mainLinks");
const minecraftLinks = document.getElementById("minecraftLinks");

/* Thème */
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");

  themeBtn.textContent = document.body.classList.contains("dark") ? "🌙" : "☀️";
});

/* Navigation fausse page Minecraft */
minecraftBtn.addEventListener("click", () => {
  mainLinks.classList.add("hidden");
  minecraftLinks.classList.remove("hidden");
});

backBtn.addEventListener("click", () => {
  minecraftLinks.classList.add("hidden");
  mainLinks.classList.remove("hidden");
});
