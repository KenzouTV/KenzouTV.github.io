const themeBtn = document.getElementById("themeToggle");

themeBtn.onclick = () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");

  // change emoji pour rester visible
  themeBtn.textContent =
    document.body.classList.contains("dark") ? "🌙" : "☀️";
};
