export interface SaboteurItem {
  id: string;
  name: string;
  percent: number;
  icon: string;
  color: string;
  description: string;
}

export interface SaboteursData {
  title: string;
  subtitle: string;
  items: SaboteurItem[];
  topSaboteur: SaboteurItem;
}

const MALE_COPY: Record<string, { name: string; icon: string; text: string }> = {
  emotional_eating: {
    name: 'Alimentación emocional',
    icon: 'ti ti-cookie',
    text: 'Eres alguien que recurre a la comida cuando se siente estresado o abrumado, tal vez a través de picoteos o antojos. No es un defecto, es cómo has estado afrontando la situación. El Tai Chi en silla te ayuda a manejar ese estrés directamente, sin pasar por la comida.',
  },
  stress_overwhelm: {
    name: 'Estrés y saturación',
    icon: 'ti ti-clock-off',
    text: 'Tu día a día no te deja espacio para cuidarte. No es falta de voluntad — es que nunca encontraste algo que cupiera en tu rutina real. Por eso FirmMe está pensado para 15 minutos, sentado, sin necesidad de reorganizar tu día.',
  },
  self_criticism: {
    name: 'Autocrítica',
    icon: 'ti ti-alert-triangle',
    text: 'Eres muy duro contigo mismo cuando no cumples. Vamos a construir este proceso sin esa presión — pequeños avances constantes, sin castigarte por un día que se te escapó.',
  },
  fear_of_failure: {
    name: 'Miedo al fracaso',
    icon: 'ti ti-shield-x',
    text: 'Ya lo intentaste antes y no funcionó, y eso pesa. Esta vez es diferente: no es una rutina genérica, es un plan hecho a tu medida, empezando desde donde estás hoy, no desde donde "deberías" estar.',
  },
};

const FEMALE_COPY: Record<string, { name: string; icon: string; text: string }> = {
  fear_of_falling: {
    name: 'Miedo a caer/inseguridad',
    icon: 'ti ti-shield-x',
    text: 'Ese miedo no te hace débil, te hace cuidadosa. El Tai Chi en silla existe justamente para que puedas fortalecer tu equilibrio sin ese riesgo — cada movimiento está pensado para que te sientas segura desde el primer día.',
  },
  lack_of_consistency: {
    name: 'Falta de constancia',
    icon: 'ti ti-refresh-off',
    text: 'No es que te falte disciplina — es que ninguna rutina anterior fue realmente sostenible para ti. Por eso FirmMe son solo 15 minutos sentada, algo que sí puede quedarse en tu vida de verdad.',
  },
  joint_pain: {
    name: 'Dolor articular',
    icon: 'ti ti-bone-off',
    text: 'Tu cuerpo te está pidiendo cuidado, no que pares del todo. El Tai Chi en silla protege tus articulaciones en vez de desgastarlas, para que puedas moverte sin miedo al dolor.',
  },
  discouragement: {
    name: 'Autoexigencia/desánimo',
    icon: 'ti ti-heart-broken',
    text: 'Te exiges mucho, y cuando los resultados no llegan rápido, te desanimas. Vamos a ir a tu ritmo — cada pequeña mejora en tu equilibrio y energía cuenta, aunque no se vea de un día para otro.',
  },
};

function getSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function calculateSaboteurs(
  userGender: 'male' | 'female',
  answers: Record<string, unknown>,
  userName = ''
): SaboteursData {
  const isMale = userGender === 'male';
  const answerKey = isMale ? 'saboteadores_masculino' : 'saboteadores_femenino';
  const copyMap = isMale ? MALE_COPY : FEMALE_COPY;
  const categories = Object.keys(copyMap);

  const selected = (answers[answerKey] as string[] | undefined) ?? [];
  
  const validSelected = selected.filter(id => categories.includes(id));
  const numSelected = validSelected.length;
  const numUnselected = categories.length - numSelected;

  const rawScores: Record<string, number> = {};
  const seed = getSeed(userName || 'usuario');

  categories.forEach((catId, idx) => {
    const isSel = validSelected.includes(catId);
    let base = 0;
    if (numSelected > 0) {
      base = isSel ? 75 / numSelected : (numUnselected > 0 ? 25 / numUnselected : 5);
    } else {
      // Default fallback distribution if no selections made
      base = 25;
    }
    const varFactor = ((seed + idx * 7) % 7) - 3;
    rawScores[catId] = Math.max(8, base + varFactor);
  });

  const total = Object.values(rawScores).reduce((a, b) => a + b, 0);
  let items: SaboteurItem[] = categories.map((catId) => {
    const pct = Math.round((rawScores[catId] / total) * 100);
    return {
      id: catId,
      name: copyMap[catId].name,
      percent: pct,
      icon: copyMap[catId].icon,
      color: 'var(--color-primary)',
      description: copyMap[catId].text,
    };
  });

  // Ensure total sum equals 100%
  const sumPct = items.reduce((acc, it) => acc + it.percent, 0);
  if (sumPct !== 100 && items.length > 0) {
    items[0].percent += 100 - sumPct;
  }

  // Sort descending by percentage
  items.sort((a, b) => b.percent - a.percent);

  // Gradient opacity steps for brand primary color
  const colors = [
    'var(--color-primary)',
    'rgba(90, 111, 214, 0.82)',
    'rgba(90, 111, 214, 0.65)',
    'rgba(90, 111, 214, 0.45)',
  ];
  items = items.map((it, rank) => ({
    ...it,
    color: colors[rank] || colors[3],
  }));

  const title = isMale
    ? 'Tus saboteadores del adelgazamiento'
    : 'Tus saboteadores del equilibrio';

  const subtitle = isMale
    ? 'A partir de tus respuestas, identificamos los motivos por los que más te cuesta bajar de peso.'
    : 'A partir de tus respuestas, identificamos lo que más te frena para recuperar tu equilibrio.';

  return {
    title,
    subtitle,
    items,
    topSaboteur: items[0],
  };
}
