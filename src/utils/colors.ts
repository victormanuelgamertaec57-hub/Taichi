// Accent color rotation for icon circles in checklists / stat lists.
// Order: sage green -> slate blue -> mustard, repeating.
export const ACCENT_COLORS = [
  { fg: '#5B8A72', bg: '#E8F0E9' },
  { fg: '#6B8CAE', bg: '#E7EEF3' },
  { fg: '#D4A24C', bg: '#F6EEDD' },
];

export function accentColor(index: number) {
  return ACCENT_COLORS[index % ACCENT_COLORS.length];
}
