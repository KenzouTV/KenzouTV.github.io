document.addEventListener("DOMContentLoaded", () => {

  const buttons = document.querySelectorAll(".link-btn");
  const searchInput = document.getElementById("searchInput");
  const noResult = document.getElementById("noResult");

  const links = {
    "YouTube": "https://www.youtube.com/@Kenzou_TV",
    "Discord": "https://discord.gg/bRZqsCbPPE",
    "Twitch": "https://www.twitch.tv/kenzoutv_mc",
    "Minecraft": "https://fr.namemc.com/profile/Kenzo0025.1",
    "Instagram": "https://www.instagram.com/kenzoutv/"
  };

  // Clic sur les boutons
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.link;
      if (links[key]) {
        window.open(links[key], "_blank");
      }
    });
  });

  // Recherche en direct
  searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();
    let found = false;

    buttons.forEach(btn => {
      const tags = btn.dataset.tags.toLowerCase();
      const key = btn.dataset.link.toLowerCase();

      if (key.includes(value) || tags.includes(value)) {
        btn.style.display = "block";
        found = true;
      } else {
        btn.style.display = "none";
      }
    });

    noResult.classList.toggle("hidden", found);
  });

  // Optionnel : appuyer sur "Entrée" dans la recherche ouvre le premier résultat
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const firstVisible = Array.from(buttons).find(btn => btn.style.display !== "none");
      if (firstVisible) {
        const key = firstVisible.dataset.link;
        window.open(links[key], "_blank");
      }
    }
  });

});
