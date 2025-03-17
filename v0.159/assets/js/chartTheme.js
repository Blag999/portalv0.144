window.chartTheme = {
  style: {
    background: "none",
    fontFamily: "Arial, sans-serif"
  },
  x: {
    grid: true,
    labelAnchor: "center",
    labelOffset: 35,
    tickSize: 6
  },
  y: {
    grid: true,
    labelAnchor: "center",
    labelOffset: 35,
    tickSize: 6
  },
  colorScheme: {
    line: "steelblue",
    bar: "#FB8C00",
    scatter: "steelblue",
    hexbin: "purple"
  },
  typeSpecific: {
    line: { strokeWidth: 2 },
    bar: { stroke: "black" },
    scatter: { stroke: "none" }
  },
  // Entferne explizite width und height oder setze nur height:
  height: 400
};

if (window.Chart) {
  // Beispiel: Weißer Text, Standard-Font, Achsenlinien in Orange
  Chart.defaults.color = "#ffffff";
  Chart.defaults.font.family = "Arial, sans-serif";
  Chart.defaults.borderColor = "rgba(255, 165, 0, 0.4)";
  Chart.defaults.plugins.legend.display = false; // Legende global deaktivieren, falls du sie nicht brauchst
  Chart.defaults.datasets.bar.barPercentage = 0.5; // 50% der verfügbaren Kategorie-Breite
  Chart.defaults.datasets.bar.categoryPercentage = 0.5;
  // Du kannst noch mehr globale Einstellungen tätigen:
  // Chart.defaults.font.size = 14;
  // Chart.defaults.elements.bar.borderWidth = 2;
  // usw.

  // Optional: Du kannst selbst Plugins konfigurieren, z.B. Tooltip, Title, etc.
  // Chart.defaults.plugins.title.display = true;
  // Chart.defaults.plugins.title.text = 'Standardtitel';
  // ...
}

console.log("✅ chartTheme erfolgreich geladen:", window.chartTheme);


