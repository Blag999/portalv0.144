document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.querySelector(".sidebar");
  const mainTitle = document.querySelector(".main-content h1");

  // Globale Toggle-Funktion – wird über das Inline-Onclick-Attribut im HTML aufgerufen.
  window.toggleSidebar = function () {
    if (sidebar) {
      sidebar.classList.toggle("collapsed");
    }
  };

  // Submenüs ein- und ausklappen sowie dynamische Aktualisierung des h1-Titels mit Typografie-Swipe
  const menuItems = document.querySelectorAll(".sidebar ul li > a");
  menuItems.forEach(item => {
    const submenu = item.nextElementSibling;

    if (submenu) {
      // Falls ein Submenü vorhanden ist: Toggle des Submenüs
      item.addEventListener("click", function (e) {
        e.preventDefault();
        this.parentElement.classList.toggle("active");
        // Schließe andere offene Menüs
        document.querySelectorAll(".sidebar ul li").forEach(li => {
          if (li !== this.parentElement) {
            li.classList.remove("active");
          }
        });
      });
    } else {
      // Falls kein Submenü vorhanden ist: Aktualisiere den h1-Titel mit dem Typografie-Swipe-Effekt
      item.addEventListener("click", function (e) {
        e.preventDefault();
        // Optional: Setze den selected-Effekt
        document.querySelectorAll(".sidebar ul li").forEach(li => {
          li.classList.remove("selected");
        });
        this.parentElement.classList.add("selected");

        if (mainTitle) {
          // Starte den Swipe-Effekt: Ausblenden und nach links gleiten
          mainTitle.style.opacity = "0";
          mainTitle.style.transform = "translateX(-50px)";
          // Nach 300ms den Text wechseln und den neuen Titel hereingleiten lassen
          setTimeout(() => {
            mainTitle.textContent = this.textContent.trim();
            mainTitle.style.opacity = "1";
            mainTitle.style.transform = "translateX(0)";
            // Um den Unterstrich neu zu animieren, entfernen und wieder hinzufügen der Klasse:
            mainTitle.classList.remove("animate-underline");
            // Erzwinge einen Reflow, damit die Änderung erfasst wird:
            void mainTitle.offsetWidth;
            mainTitle.classList.add("animate-underline");
          }, 300);
        }
      });
    }
  });
});
