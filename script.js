document.addEventListener("DOMContentLoaded", () => {

  const search = document.getElementById("search");
  const links = document.querySelectorAll(".link");
  const noResult = document.getElementById("noResult");
  const btn = document.getElementById("themeToggle");

  /* sécurité : si un élément manque, on évite le crash */
  if (!search || !btn) return;

  search.addEventListener("input", () => {
    const value = search.value.toLowerCase();
    let found = false;

    links.forEach(link => {
      const tags = link.dataset.tags || "";
      if (tags.includes(value)) {
        link.style.display = "block";
        found = true;
      } else {
        link.style.display = "none";
      }
    });

    noResult.style.display = found ? "none" : "block";
  });

  /* thème */
  let dark = true;

  btn.addEventListener("click", () => {
    dark = !dark;

    document.body.style.background = dark ? "#0e0e0e" : "#f1f1f1";
    document.body.style.color = dark ? "white" : "black";

    btn.textContent = dark ? "🌙" : "☀️";
    btn.style.color = dark ? "white" : "black";
  });

});
