document.addEventListener("DOMContentLoaded", () => {

  const buttons = document.querySelectorAll(".link-btn");
  const searchInput = document.getElementById("searchInput");
  const noResult = document.getElementById("noResult");
  const activeTagsContainer = document.getElementById("activeTags");
  let activeTags = [];

  const links = {
    "YouTube": "https://www.youtube.com/@Kenzou_TV",
    "Discord": "https://discord.gg/bRZqsCbPPE",
    "Twitch": "https://www.twitch.tv/kenzoutv_mc",
    "Minecraft Java": "https://fr.namemc.com/profile/Kenzo0025.1",
    "Minecraft Bedrock": "https://launch.minecraft.net/profile/FR%20KenzoYTB",
    "Instagram": "https://www.instagram.com/kenzoutv/"
  };

  // Animation d’entrée des boutons (slide-up + fade-in)
  buttons.forEach((btn, index) => {
    btn.style.opacity = 0;
    btn.style.transform = "translateY(20px)";
    setTimeout(() => {
      btn.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      btn.style.opacity = 1;
      btn.style.transform = "translateY(0)";
    }, index * 150);
  });

  // Clic sur les boutons
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.link;
      if (links[key]) {
        window.open(links[key], "_blank");
      }
    });
  });

  // Met à jour les boutons selon les tags actifs
  function updateButtons() {
    let found = false;

    buttons.forEach(btn => {
      const tags = btn.dataset.tags.toLowerCase();
      const key = btn.dataset.link.toLowerCase();
      const matchesAll = activeTags.every(tag => key.includes(tag) || tags.includes(tag));

      if (matchesAll) {
        btn.style.display = "block";
        setTimeout(() => btn.style.opacity = 1, 50);
        found = true;
      } else {
        btn.style.opacity = 0;
        setTimeout(() => btn.style.display = "none", 200);
      }
    });

    noResult.classList.toggle("hidden", found);
  }

  // Ajouter un tag
  function addTag(tag) {
    tag = tag.toLowerCase().trim();
    if (tag && !activeTags.includes(tag)) {
      activeTags.push(tag);

      const tagEl = document.createElement("div");
      tagEl.classList.add("active-tag");
      tagEl.textContent = tag;
      tagEl.addEventListener("click", () => {
        activeTags = activeTags.filter(t => t !== tag);
        tagEl.remove();
        updateButtons();
      });

      activeTagsContainer.appendChild(tagEl);
      updateButtons();
    }
  }

  // Quand l’utilisateur tape dans la barre
  searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      const value = searchInput.value.trim();
      if (value) addTag(value);
      searchInput.value = "";
    }
    // Backspace supprime le dernier tag si barre vide
    if (e.key === "Backspace" && searchInput.value === "" && activeTags.length > 0) {
      const lastTag = activeTags.pop();
      activeTagsContainer.lastChild.remove();
      updateButtons();
    }
  });

});
