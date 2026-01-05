document.addEventListener("DOMContentLoaded", () => {

  const buttons = document.querySelectorAll(".link-btn");
  const searchInput = document.getElementById("searchInput");
  const noResult = document.getElementById("noResult");

  const links = {
    "YouTube": "https://www.youtube.com/@Kenzou_TV",
    "Discord": "https://discord.gg/bRZqsCbPPE",
    "Twitch": "https://www.twitch.tv/kenzoutv_mc",
    "Minecraft Java": "https://fr.namemc.com/profile/Kenzo0025.1",
    "Minecraft Bedrock": "https://launch.minecraft.net/profile/FR%20KenzoYTB",
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

  // Recherche en direct avec fade
  searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();
    let found = false;

    buttons.forEach(btn => {
      const tags = btn.dataset.tags.toLowerCase();
      const key = btn.dataset.link.toLowerCase();

      if (key.includes(value) || tags.includes(value)) {
        btn.style.display = "block";
        setTimeout(() => btn.style.opacity = 1, 50);
        found = true;
      } else {
        btn.style.opacity = 0;
        setTimeout(() => btn.style.display = "none", 200);
      }
    });

    noResult.classList.toggle("hidden", found);
  });

  // Enter ouvre le premier lien visible
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
