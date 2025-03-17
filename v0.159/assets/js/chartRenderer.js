// assets/js/chartRenderer.js

export function getRendererForChart(chartConfig) {
    const chartTypeToRenderer = {
        "bar": "plotly",       // Balkendiagramme → Plotly
        "line": "d3",          // Linien-Diagramme → D3.js
        "scatter": "plot",     // Scatter-Plots → Plot.js
        "hexbin": "plot"       // Hexbin-Charts → Plot.js
    };

    // Prüfen, ob chartType existiert, sonst Warnung ausgeben
    if (!chartConfig.chartType) {
        console.warn(`⚠ Kein chartType für Chart '${chartConfig.chartName}' definiert! Fallback auf Plot.js`);
        return "plot"; // Standard-Renderer setzen
    }

    // Passenden Renderer basierend auf chartType zurückgeben
    return chartTypeToRenderer[chartConfig.chartType] || "plot";
}
