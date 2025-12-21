/**
 * Utility functions for Chart.js configurations in the GEO Infographic
 */

export const palette = {
    gold: '#D4AF37',       // Brand Gold
    goldLight: '#F3E5AB',  // Champagne/Light Gold
    dark: '#171717',       // Neutral 900
    neutral: '#737373',    // Neutral 500
    white: '#FFFFFF'
};

/**
 * Wraps labels that exceed 16 characters into multiple lines.
 * @param {string} label - The label to wrap.
 * @returns {string|string[]} - The wrapped label (array of strings) or original label.
 */
export const wrapLabel = (label) => {
    if (typeof label !== 'string' || label.length <= 16) return label;
    const words = label.split(' ');
    const lines = [];
    let currentLine = "";
    words.forEach(word => {
        if ((currentLine + word).length > 16) {
            lines.push(currentLine.trim());
            currentLine = word + " ";
        } else {
            currentLine += word + " ";
        }
    });
    lines.push(currentLine.trim());
    return lines;
};

/**
 * Global Tooltip Options to handle multiline titles.
 */
export const globalTooltipOptions = {
    callbacks: {
        title: function (tooltipItems) {
            const item = tooltipItems[0];
            let label = item.chart.data.labels[item.dataIndex];
            return Array.isArray(label) ? label.join(' ') : label;
        }
    }
};
