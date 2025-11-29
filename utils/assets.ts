
// Helper to safely encode SVG for data URIs without using btoa (which can fail with unicode)
export const getSvgUrl = (svgString: string) => {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
}

const PRIMARY_COLOR = "#312E81"; // Indigo 900
const ACCENT_COLOR = "#D97706";  // Amber 600

// Recreated SVG for Luximed Sun Icon
export const LUXIMED_ICON_SVG = `
<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="20" fill="white"/>
  <path d="M50 0V15M50 85V100M0 50H15M85 50H100M14.6 14.6L25.2 25.2M74.8 74.8L85.4 85.4M14.6 85.4L25.2 74.8M74.8 25.2L85.4 14.6" stroke="${ACCENT_COLOR}" stroke-width="8" stroke-linecap="round"/>
  <circle cx="50" cy="50" r="35" stroke="${ACCENT_COLOR}" stroke-width="4" stroke-dasharray="10 10"/>
</svg>
`;

// Full Logo SVG
export const LUXIMED_FULL_LOGO_SVG = `
<svg viewBox="0 0 300 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Icon Part -->
  <g transform="translate(10, 10) scale(0.6)">
    <circle cx="50" cy="50" r="20" fill="${PRIMARY_COLOR}"/>
    <path d="M50 0V15M50 85V100M0 50H15M85 50H100M14.6 14.6L25.2 25.2M74.8 74.8L85.4 85.4M14.6 85.4L25.2 74.8M74.8 25.2L85.4 14.6" stroke="${ACCENT_COLOR}" stroke-width="8" stroke-linecap="round"/>
  </g>
  <!-- Text Part -->
  <text x="80" y="55" font-family="sans-serif" font-weight="bold" font-size="48" fill="${PRIMARY_COLOR}">Luximed</text>
</svg>
`;

export const ASSETS = {
  logoFull: getSvgUrl(LUXIMED_FULL_LOGO_SVG),
  logoIcon: getSvgUrl(LUXIMED_ICON_SVG),
};
