// Accent color rotation for icon circles in checklists / stat lists.
// Order: periwinkle indigo -> slate blue -> mustard, repeating.
export const ACCENT_COLORS = [
  { fg: '#5A6FD6', bg: '#EEF1FB' },
  { fg: '#5A6FD6', bg: '#EEF1FB' },
  { fg: '#D4A24C', bg: '#F6EEDD' },
];

export function accentColor(index: number) {
  return ACCENT_COLORS[index % ACCENT_COLORS.length];
}
