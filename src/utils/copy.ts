/**
 * Short, embeddable phrase for each "meta ideal" option — used to fill
 * "alcance seu objetivo: {{metaIdeal}}" on the projection screen and in the
 * results copy.
 */
export function metaIdealLabel(metaIdeal: string | undefined): string {
  switch (metaIdeal) {
    case 'grandkids':
      return 'jugar con tus nietos sin miedo a caer';
    case 'travel':
      return 'viajar y caminar tranquilo/a por horas';
    case 'stairs':
      return 'subir y bajar escaleras con confianza';
    case 'confidence':
      return 'sentirte seguro/a en tu propio cuerpo';
    default:
      return 'sentirte seguro/a y con equilibrio';
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
      return 'Intermedio';
    default:
      return 'Principiante';
  }
}
