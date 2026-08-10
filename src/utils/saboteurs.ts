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
  const validSelected = selected.filter((id) => categories.includes(id));

  // 1. Direct Selection Base Points (+40 per selected option, or +10 if none selected)
  const rawScores: Record<string, number> = {};
  categories.forEach((catId) => {
    rawScores[catId] = validSelected.length > 0
      ? (validSelected.includes(catId) ? 40 : 0)
      : 10;
  });

  // Secondary signals from quiz answers
  const stressLevel = answers.stressLevel as string | undefined;
  const energyLevel = answers.energyLevel as string | undefined;
  const energyCrashTime = answers.energyCrashTime as string | undefined;
  const personalStory = answers.personalStory as string | undefined;
  const balanceFear = answers.balanceFear as string | undefined;
  const walkingConfidence = answers.walkingConfidence as string | undefined;

  if (isMale) {
    // ── MALE CROSS SIGNALS ──
    // 1. Estrés y saturación (stress_overwhelm)
    if (stressLevel === 'yes_always') rawScores.stress_overwhelm += 18;
    else if (stressLevel === 'sometimes') rawScores.stress_overwhelm += 10;

    if (energyCrashTime === 'late_morning' || energyCrashTime === 'always_tired') rawScores.stress_overwhelm += 12;
    else if (energyCrashTime === 'after_lunch') rawScores.stress_overwhelm += 6;

    // 2. Alimentación emocional (emotional_eating)
    if (energyLevel === 'low' || energyLevel === 'medium_low') rawScores.emotional_eating += 15;
    else if (energyLevel === 'medium') rawScores.emotional_eating += 7;

    if (stressLevel === 'yes_always') rawScores.emotional_eating += 12;
    else if (stressLevel === 'sometimes') rawScores.emotional_eating += 6;

    // 3. Miedo al fracaso (fear_of_failure)
    if (balanceFear === 'often') rawScores.fear_of_failure += 18;
    else if (balanceFear === 'sometimes') rawScores.fear_of_failure += 10;

    if (personalStory === 'yes_often') rawScores.fear_of_failure += 15;
    else if (personalStory === 'yes_once') rawScores.fear_of_failure += 8;

    // 4. Autocrítica (self_criticism)
    if (walkingConfidence === 'very_low') rawScores.self_criticism += 16;
    else if (walkingConfidence === 'moderate') rawScores.self_criticism += 8;

    if (personalStory === 'yes_often' || personalStory === 'no_but_worried') rawScores.self_criticism += 10;

  } else {
    // ── FEMALE CROSS SIGNALS ──
    // 1. Miedo a caer/inseguridad (fear_of_falling)
    if (balanceFear === 'often') rawScores.fear_of_falling += 18;
    else if (balanceFear === 'sometimes') rawScores.fear_of_falling += 10;

    if (personalStory === 'yes_often') rawScores.fear_of_falling += 16;
    else if (personalStory === 'yes_once') rawScores.fear_of_falling += 8;

    // 2. Dolor articular (joint_pain)
    if (walkingConfidence === 'very_low') rawScores.joint_pain += 16;
    else if (walkingConfidence === 'moderate') rawScores.joint_pain += 8;

    if (stressLevel === 'yes_always') rawScores.joint_pain += 10;

    // 3. Falta de constancia (lack_of_consistency)
    if (energyLevel === 'low' || energyLevel === 'medium_low') rawScores.lack_of_consistency += 15;

    if (energyCrashTime === 'always_tired' || energyCrashTime === 'late_morning') rawScores.lack_of_consistency += 10;

    // 4. Autoexigencia/desánimo (discouragement)
    if (personalStory === 'yes_often' || personalStory === 'no_but_worried') rawScores.discouragement += 14;

    if (walkingConfidence === 'very_low') rawScores.discouragement += 10;
  }

  // Micro-variance seed based on userName
  const seed = getSeed(userName || 'usuario');
  categories.forEach((catId, idx) => {
    const microVar = ((seed + idx * 7) % 4) + 1; // 1 to 4 pts
    rawScores[catId] = Math.max(6, rawScores[catId] + microVar);
  });

  // Calculate sum and normalize percentages with minimum floor of 6%
  const totalPoints = Object.values(rawScores).reduce((a, b) => a + b, 0);

  let items: SaboteurItem[] = categories.map((catId) => {
    const pct = Math.max(6, Math.round((rawScores[catId] / totalPoints) * 100));
    return {
      id: catId,
      name: copyMap[catId].name,
      percent: pct,
      icon: copyMap[catId].icon,
      color: 'var(--color-primary)',
      description: copyMap[catId].text,
    };
  });

  // Ensure total sum equals 100% exactly
  const sumPct = items.reduce((acc, it) => acc + it.percent, 0);
  if (sumPct !== 100 && items.length > 0) {
    const maxIdx = items.reduce((maxI, item, i, arr) => (item.percent > arr[maxI].percent ? i : maxI), 0);
    items[maxIdx].percent += 100 - sumPct;
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
