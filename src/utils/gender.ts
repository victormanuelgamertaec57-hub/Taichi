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
      return `Você tem tempo de se sentir mais ${confident} antes do seu casamento ou celebração em família.`;
    case 'trip':
      return `Você tem tempo de se sentir mais ${confident} antes da sua viagem.`;
    case 'family_visit':
      return `Você tem tempo de se sentir mais ${confident} antes da chegada dos seus netos ou família.`;
    default:
      return 'Em poucas semanas, você vai notar a diferença no seu equilíbrio e na sua energia.';
  }
}
