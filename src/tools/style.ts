function hexToRGBA(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function rgbToRGBA(rgb: string, alpha: number) {
  const [r, g, b] = rgb.match(/\d+/g) ?? [];
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
export function colorWithOpacity(color: string, opacity: number) {
  if (color.startsWith("#")) {
    return hexToRGBA(color, opacity);
  } else {
    return rgbToRGBA(color, opacity);
  }
}
