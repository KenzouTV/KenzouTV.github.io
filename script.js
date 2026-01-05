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

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const text = btn.childNodes[0].textContent.trim();
      window.open(links[text], "_blank");
    });
  });

  searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();
    let found = false;

    buttons.forEach(btn => {
      const tags = btn.dataset.tags;
      const text = btn.innerText.toLowerCase();

      if (text.includes(value) || tags.includes(value)) {
        btn.style.display = "block";
        found = true;
      } else {
        btn.style.display = "none";
      }
    });

    noResult.classList.toggle("hidden", found);
  });

});
