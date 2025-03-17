console.log("Theme geladen:", window.chartTheme);
import { getRendererForChart } from "./chartRenderer.js";


// -------------------------------------------------
// 1) Globale Variable cardData
// -------------------------------------------------
const cardData = [
  { id: "card1", title: "Größen- & Gewichtsanalyse", type: "chart", chartName: "hexbin", renderer: "plot" },
  { id: "card2", title: "Aktienchart AAPL", type: "chart", chartName: "aapl", renderer: "d3" },
  { id: "card3", title: "Balkendiagramm", type: "chart", chartName: "bar", renderer: "plotly" },
  { id: "card4", title: "Neue Analyse 1", type: "chart", chartName: "new_chart1", renderer: "plot" },
  { id: "card5", title: "Neue Analyse 2", type: "chart", chartName: "new_chart2", renderer: "plotly" },
  { id: "card6", title: "Neue Analyse 3", type: "chart", chartName: "new_chart3", renderer: "d3" },
  { id: "card7", title: "Neue Analyse 4", type: "chart", chartName: "new_chart4", renderer: "plot" }
];

// -------------------------------------------------
// 2) DOMContentLoaded: Hauptlogik für die Charts
// -------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  // Prüfe, ob Plot.js verfügbar ist
  if (!window.Plot) {
    console.error("Plot.js ist nicht verfügbar. Stelle sicher, dass es korrekt geladen wurde.");
    return;
  }

  // Selektiere das Grid-Element
  const grid = d3.select("#anzeigeGrid");

  // Erzeuge Cards auf Basis von cardData
  const cards = grid.selectAll(".anzeige-card")
    .data(cardData)
    .enter()
    .append("div")
    .attr("class", "anzeige-card")
    .attr("id", d => d.id);

  let chartCounter = 1;

  // Struktur in jeder Card anlegen
  cards.each(function (d) {
    const card = d3.select(this);
    if (d.type === "chart") {
      card.append("div")
          .attr("class", "d3-container")
          .attr("id", "chart" + chartCounter);
      chartCounter++;
    }
    // Titel + Beschreibung
    card.append("h2").text(d.title);
    card.append("p").text(d.description);
  });

  // Alle Charts rendern
  let chartIndex = 1;
  cardData.forEach((d) => {
    if (d.type === "chart") {
      const container = document.getElementById("chart" + chartIndex);
      if (container) {
        console.log("Rendering Chart:", d.chartName);
        renderChart(container, d);
      } else {
        console.error("Chart-Container nicht gefunden für", d.id);
      }
      chartIndex++;
    }
  });

  // Klick-Logik (statt Karte verschieben klonen wir sie)
  cards.on("click", function (event, d) {
    console.log("Card clicked:", d.id);
    createOverlayClone(this);
  });

  // -------------------------------------------------
  // Overlay-Klon erzeugen (Maximieren einer Card)
  // -------------------------------------------------
  function createOverlayClone(originalCardElem) {
    // Falls bereits ein Clone existiert -> Abbrechen
    const existingClone = document.querySelector(".overlay-clone[data-origin='" + originalCardElem.id + "']");
    if (existingClone) return;

    // 1) Klonen
    const clone = originalCardElem.cloneNode(true);
    clone.classList.add("overlay-clone", "maximized");
    clone.setAttribute("data-origin", originalCardElem.id);

    // 2) Overlay ins Grid einhängen
    const gridElem = document.getElementById("anzeigeGrid");
    gridElem.appendChild(clone);

    // 3) Schließen-Button
    let closeBtn = clone.querySelector(".close-btn");
    if (!closeBtn) {
      closeBtn = document.createElement("div");
      closeBtn.classList.add("close-btn");
      closeBtn.innerHTML = "✖";
      clone.appendChild(closeBtn);
    }
    closeBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      closeOverlayClone(clone);
    });

    // 4) Chart im Overlay neu rendern
    const chartContainer = clone.querySelector(".d3-container");
    chartContainer.innerHTML = "";

    // Ermittle Index aus ID (z.B. "card1" -> 1 -> Index 0)
    const cardIndex = parseInt(originalCardElem.id.replace("card", ""), 10) - 1;
    const chartDataObj = cardData[cardIndex];

    // Neu: Falls Chartname = "bar", verwenden wir im Overlay ebenfalls Chart.js
    if (chartDataObj.chartName === "bar") {
      createOverlayBarChartJS(chartContainer);
    } else {
      // Ansonsten weiterhin Plot.js
      const maximizedChart = Plot.plot({
        ...window.chartTheme,
        width: chartContainer.clientWidth - 40,
        height: chartContainer.clientHeight - 100,
        marks: getMarksForChart(chartDataObj.chartName, chartDataObj)
      });
      chartContainer.appendChild(maximizedChart);
    }
  }

  // -------------------------------------------------
  // Schließ-Animation fürs Overlay
  // -------------------------------------------------
	function closeOverlayClone(cloneElem) {
		cloneElem.classList.add("closing");
		setTimeout(() => {
		  cloneElem.remove();
			}, 600);
	}

  // -------------------------------------------------
  // 3) renderChart ruft je nach chartName eine Funktion auf
  // -------------------------------------------------
	function renderChart(container, config) {
		// Automatische Renderer-Zuweisung nutzen
		config.renderer = getRendererForChart(config);

		const chartFunctions = {
			"hexbin": drawHexbinChart,
			"aapl": drawAaplChart,
			"bar": drawBarChart,  
			"new_chart1": drawNewChart1,
			"new_chart2": drawBarChart,
			"new_chart3": drawNewChart3,
			"new_chart4": drawNewChart4
		};

		if (chartFunctions[config.chartName]) {
			chartFunctions[config.chartName](container, config);
		} else {
			console.error("Unbekannter chartName:", config.chartName);
		}
	}


  // -------------------------------------------------
  // Diagrammfunktionen
  // -------------------------------------------------
	function drawHexbinChart(container) {
		console.log("Rendering Hexbin Chart");
		const data = d3.range(200).map(() => ({ x: Math.random() * 10, y: Math.random() * 10 }));
		const chart = Plot.plot({
		  ...window.chartTheme,
		  marks: [Plot.dot(data, { x: "x", y: "y", fill: window.chartTheme.colorScheme.hexbin })]
		});
		container.appendChild(chart);
	}

  function drawAaplChart(container) {
    console.log("Rendering AAPL Chart");
    const data = [
      { date: "2024-01-01", value: 150 },
      { date: "2024-01-02", value: 155 },
      { date: "2024-01-03", value: 152 },
      { date: "2024-01-04", value: 157 }
    ];
    const chart = Plot.plot({
      ...window.chartTheme,
      marks: [
        Plot.line(data, {
          x: "date",
          y: "value",
          stroke: window.chartTheme.colorScheme.line,
          ...window.chartTheme.typeSpecific.line
        })
      ]
    });
    container.appendChild(chart);
  }

  // -------------------------------------------------
  // Balkendiagramm mit Chart.js (normale Card)
  // -------------------------------------------------
function drawBarChart(container, config) {
    console.log(`Rendering Bar Chart für ${config.chartName}`);

    const data = [
        { category: "A", value: 30 },
        { category: "B", value: 45 },
        { category: "C", value: 25 }
    ];

    // Canvas für das Chart.js- oder Plotly-Diagramm erstellen
    container.innerHTML = "";
    const canvas = document.createElement("canvas");
    container.appendChild(canvas);

    // Labels & Werte aus den Daten extrahieren
    const labels = data.map(d => d.category);
    const values = data.map(d => d.value);

    // Einheitliche Konfiguration für alle Balkendiagramme
    new Chart(canvas, {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Werte",
                data: values,
                backgroundColor: "#FB8C00",
                borderColor: "#FF6F00",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}


  function drawNewChart1(container) {
    console.log("Rendering New Chart 1");
    const data = d3.range(100).map(() => ({ x: Math.random(), y: Math.random() }));
    const chart = Plot.plot({
      ...window.chartTheme,
      marks: [
        Plot.dot(data, {
          x: "x",
          y: "y",
          fill: window.chartTheme.colorScheme.scatter,
          ...window.chartTheme.typeSpecific.scatter
        })
      ]
    });
    container.appendChild(chart);
  }

  function drawNewChart2(container) {
    console.log("Rendering New Chart 2");
    const data = [
      { category: "X", value: 40 },
      { category: "Y", value: 60 }
    ];
    const chart = Plot.plot({
      ...window.chartTheme,
      marks: [
        Plot.barY(data, {
          x: "category",
          y: "value",
          fill: window.chartTheme.colorScheme.bar,
          ...window.chartTheme.typeSpecific.bar
        })
      ]
    });
    container.appendChild(chart);
  }
});

// -------------------------------------------------
// 4) Letzte Chart-Funktionen außerhalb DOMContentLoaded
// -------------------------------------------------
function drawNewChart3(container) {
  console.log("Rendering New Chart 3");
  const data = [
    { date: "2025-01-01", value: 20 },
    { date: "2025-02-01", value: 35 }
  ];
  const chart = Plot.plot({
    ...window.chartTheme,
    marks: [Plot.line(data, { x: "date", y: "value", stroke: window.chartTheme.colorScheme.line })]
  });
  container.appendChild(chart);
}

function drawNewChart4(container) {
  console.log("Rendering New Chart 4");
  const data = d3.range(50).map(() => ({ x: Math.random(), y: Math.random() }));
  const chart = Plot.plot({
    ...window.chartTheme,
    marks: [Plot.dot(data, { x: "x", y: "y", fill: window.chartTheme.colorScheme.scatter })]
  });
  container.appendChild(chart);
}

// -------------------------------------------------
// 5) Responsive-Neu-Render-Logik
// -------------------------------------------------
window.addEventListener("resize", debounce(() => {
  // Leere zunächst alle Charts
  d3.selectAll(".d3-container").html("");

  // Rendere Charts neu
  let chartIndex = 1;
  cardData.forEach((d) => {
    if (d.type === "chart") {
      const container = document.getElementById("chart" + chartIndex);
      if (container) {
        renderChart(container, d);
      }
      chartIndex++;
    }
  });
}, 250));

// Hilfsfunktion zum Debouncen (verhindert zu häufige Aufrufe)
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// -------------------------------------------------
// 6) Overlay-Hilfsfunktion für Bar Chart (Chart.js)
// -------------------------------------------------
function createOverlayBarChartJS(container) {
  // Beispiel-Daten (du kannst sie dynamisch laden, falls gewünscht)
  const data = [
    { category: "A", value: 30 },
    { category: "B", value: 45 },
    { category: "C", value: 25 }
  ];

  // Canvas erzeugen, passend zur Overlay-Größe
  const canvas = document.createElement("canvas");
  // Breite/Höhe nach Container berechnen
  canvas.style.width = (container.clientWidth - 40) + "px";
  canvas.style.height = (container.clientHeight - 100) + "px";

  container.appendChild(canvas);

  const labels = data.map(d => d.category);
  const values = data.map(d => d.value);

  // Chart.js im Overlay
  new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Werte (Overlay)",
        data: values,
        backgroundColor: "#FB8C00",
        borderColor: "#FF6F00",
        borderWidth: 1
      }]
    },
    options: {
      responsive: false,          // Wir haben statische Größe
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// -------------------------------------------------
// 7) Daten für Overlay via Plot (für die anderen Charts)
// -------------------------------------------------
function getMarksForChart(chartName, chartData) {
  switch (chartName) {
    case "hexbin":
      const hexbinData = d3.range(200).map(() => ({ x: Math.random() * 10, y: Math.random() * 10 }));
      return [Plot.dot(hexbinData, { x: "x", y: "y", fill: window.chartTheme.colorScheme.hexbin })];

    case "aapl":
      const lineData = [
        { date: "2024-01-01", value: 150 },
        { date: "2024-01-02", value: 155 },
        { date: "2024-01-03", value: 152 },
        { date: "2024-01-04", value: 157 }
      ];
      return [Plot.line(lineData, { x: "date", y: "value", stroke: window.chartTheme.colorScheme.line })];

    case "bar":
      // Nur für Overlay-Fall, falls du nicht "bar" abfängst -> hier: Plot-Version
      // (Wird in diesem Code aber nicht mehr erreicht, weil wir es in createOverlayClone abfangen.)
      const barData = [
        { category: "A", value: 10 },
        { category: "B", value: 20 },
        { category: "C", value: 15 }
      ];
      return [
        Plot.barY(barData, {
          x: "category",
          y: "value",
          fill: window.chartTheme.colorScheme.bar
        })
      ];

    case "new_chart1":
      const scatterData = d3.range(100).map(() => ({ x: Math.random(), y: Math.random() }));
      return [Plot.dot(scatterData, { x: "x", y: "y", fill: window.chartTheme.colorScheme.scatter })];

    case "new_chart2":
      const barData2 = [
        { category: "X", value: 40 },
        { category: "Y", value: 60 }
      ];
      return [Plot.barY(barData2, { x: "category", y: "value", fill: window.chartTheme.colorScheme.bar })];

    case "new_chart3":
      const newLineData = [
        { date: "2025-01-01", value: 20 },
        { date: "2025-02-01", value: 35 }
      ];
      return [Plot.line(newLineData, { x: "date", y: "value", stroke: window.chartTheme.colorScheme.line })];

    case "new_chart4":
      const newScatterData = d3.range(50).map(() => ({ x: Math.random(), y: Math.random() }));
      return [Plot.dot(newScatterData, { x: "x", y: "y", fill: window.chartTheme.colorScheme.scatter })];

    default:
      console.error("Unbekannter chartName:", chartName);
      return [];
  }
}
