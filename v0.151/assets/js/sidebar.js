document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.querySelector(".sidebar");
  const toggleButton = document.querySelector(".toggle-btn");

  // Globale Funktion definieren, die vom Inline-Onclick-Attribut genutzt wird.
  window.toggleSidebar = function () {
    if (sidebar) {
      sidebar.classList.toggle("collapsed");
    }
  };

  // (Optional) Falls du den Toggle auch per Event Listener (statt Inline) nutzen möchtest,
  // entferne das onclick-Attribut im HTML und aktiviere den folgenden Code:
  // if (toggleButton) {
  //   toggleButton.addEventListener("click", window.toggleSidebar);
  // }

  // Submenüs ein- und ausklappen
  const menuItems = document.querySelectorAll(".sidebar ul li > a");
  menuItems.forEach(item => {
    const submenu = item.nextElementSibling;
    if (submenu) {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        // Aktuelles Menü toggeln
        this.parentElement.classList.toggle("active");
        // Andere offene Menüs schließen
        document.querySelectorAll(".sidebar ul li").forEach(li => {
          if (li !== this.parentElement) {
            li.classList.remove("active");
          }
        });
      });
    }
  });
});
