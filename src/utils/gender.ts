export type Gender = 'female' | 'male' | '';

/**
 * Resolves "word/a" patterns (e.g. "sentado/a", "activo/a") to the single
 * correct form based on gender. Leaves the text untouched if gender is
 * still unknown (only relevant before screen 2).
 */
export function resolveGenderedText(text: string, gender: Gender): string {
  return text.replace(/([a-záéíóúñA-ZÁÉÍÓÚÑ]+)o\/a\b/g, (match, stem: string) => {
    if (gender === 'male') return `${stem}o`;
    if (gender === 'female') return `${stem}a`;
    return match;
  });
}

/**
 * Builds the event-aware phrase used on the results screen, replacing the
 * generic "en 4 semanas" copy when the user has a specific upcoming event.
 */
export function eventPhrase(eventType: string | undefined, gender: Gender): string {
  const confident = gender === 'male' ? 'seguro' : 'segura';
  switch (eventType) {
    case 'wedding':
      return `Tienes tiempo de sentirte más ${confident} antes de tu boda o celebración familiar.`;
    case 'trip':
      return `Tienes tiempo de sentirte más ${confident} antes de tu viaje.`;
    case 'family_visit':
      return `Tienes tiempo de sentirte más ${confident} antes de que lleguen tus nietos o tu familia.`;
    default:
      return 'En pocas semanas notarás la diferencia en tu equilibrio y tu energía.';
  }
}
