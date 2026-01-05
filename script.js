document.addEventListener("DOMContentLoaded", () => {

  const buttons = document.querySelectorAll(".link-btn");
  const searchInput = document.getElementById("searchInput");
  const noResult = document.getElementById("noResult");

  // Liens associés à chaque bouton
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
      // On utilise le dataset "link" pour être sûr
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

});
