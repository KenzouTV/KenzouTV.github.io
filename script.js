const btn = document.getElementById("themeToggle");

btn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");

  // emoji toujours visible
  btn.textContent = document.body.classList.contains("dark")
    ? "🌙"
    : "☀️";
});
