export type Gender = 'female' | 'male' | '';

/**
 * Resolves "wordo/worda" patterns (e.g. "cansado/cansada") to the single
 * correct form based on gender. Leaves the text untouched if gender is
 * still unknown (only relevant before screen 2).
 */
export function resolveGenderedText(text: string, gender: Gender): string {
  return text.replace(/([a-záéíóúçãõA-ZÁÉÍÓÚÇÃÕ]+)o\/a\b/g, (match, stem: string) => {
    if (gender === 'male') return `${stem}o`;
    if (gender === 'female') return `${stem}a`;
    return match;
  });
}

/**
 * Builds the event-aware phrase used on the results screen, replacing the
 * generic "em 4 semanas" copy when the user has a specific upcoming event.
 */
export function eventPhrase(eventType: string | undefined, gender: Gender): string {
  const confident = gender === 'male' ? 'seguro' : 'segura';
  switch (eventType) {
    case 'wedding':
      return `Tienes tiempo para sentirte más ${confident} antes de tu boda o celebración familiar.`;
    case 'trip':
      return `Tienes tiempo para sentirte más ${confident} antes de tu viaje.`;
    case 'family_visit':
      return `Tienes tiempo para sentirte más ${confident} antes de la llegada de tus nietos o familia.`;
    default:
      return 'En pocas semanas, notarás la diferencia en tu equilibrio y energía.';
  }
}
