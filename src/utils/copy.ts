/**
 * Short, embeddable phrase for each "meta ideal" option — used to fill
 * "alcance seu objetivo: {{metaIdeal}}" on the projection screen and in the
 * results copy.
 */
export function metaIdealLabel(metaIdeal: string | undefined): string {
  switch (metaIdeal) {
    case 'grandkids':
      return 'brincar com seus netos sem medo de cair';
    case 'travel':
      return 'viajar e caminhar tranquila por horas';
    case 'stairs':
      return 'subir e descer escadas com confiança';
    case 'confidence':
      return 'se sentir segura no seu próprio corpo';
    default:
      return 'se sentir segura e com equilíbrio';
  }
}

/**
 * Coarse level label derived from the "activityLevel" question, used in the
 * results+pricing page's "Meta / Nível" summary row.
 */
export function activityLevelLabel(activityLevel: string | undefined): string {
  switch (activityLevel) {
    case 'moderate':
    case 'active':
      return 'Intermediário';
    default:
      return 'Iniciante';
  }
}
