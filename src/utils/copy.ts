/**
 * Short, embeddable phrase for each "meta ideal" option — used to fill
 * "alcanza tu objetivo: {{metaIdeal}}" on the projection screen and in the
 * results copy.
 */
export function metaIdealLabel(metaIdeal: string | undefined): string {
  switch (metaIdeal) {
    case 'grandkids':
      return 'jugar con tus nietos sin miedo a caerte';
    case 'travel':
      return 'viajar y caminar tranquila por horas';
    case 'stairs':
      return 'subir y bajar escaleras con confianza';
    case 'confidence':
      return 'sentirte segura en tu propio cuerpo';
    default:
      return 'sentirte segura y con equilibrio';
  }
}

/**
 * Coarse level label derived from the "activityLevel" question, used in the
 * results+pricing page's "Meta / Nivel" summary row.
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
