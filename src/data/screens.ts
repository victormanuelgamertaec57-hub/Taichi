import type { AnyScreen } from '../types/quiz';

// ─────────────────────────────────────────────────────────────────────────────
// FLUJO (24 pantallas) — funnel 100% dirigido a mujeres 40+
//
//  1  intro       Edad (grilla de fotos)
//  2  info        Prueba social «No estás sola» (avatar-closeup-confianza)
//  3  question    Miedo a perder el equilibrio / caerte
//  4  stat        Caídas consolidado: «58%» (Stanford + 24 estudios, barras animadas)
//  5  question    Zonas de molestia (multi-select)
//  6  stat        «0% de carga de peso en tus articulaciones» (huella vs. silla)
//  7  stat        «Movimiento, no carga» (articulación con flechas)
//  8  question    Nivel de actividad actual
//  9  stat        «El gym te deja agotada» (reloj/fatiga, acento terracota)
// 10  question    Historia personal (open loop)
// 11  info        Empatía «Entendemos cómo te sientes» (avatar-antes-estres)
// 12  question    Nivel de energía
// 13  info        Mecanismo «Método FirmMe™» (avatar-hero-cloud-hands)
// 14  question    Evento próximo
// 15  question    Meta ideal (metaIdeal) + InfoCard «Meta realista»
// 16  date-input  Evento/fecha objetivo real (fechaObjetivo)
// 17  name-input  Nombre
// 18  email-input Correo
// 19  analysis    Análisis animado + testimonios
// 20  commitment  «¿Estás lista para asumir el compromiso?» (compromisoInicial)
// 21  projection  Gráfico de proyección (Simple-style, usa metaIdeal/fechaObjetivo)
// 22  fade-sequence  4 líneas de bienvenida en fade-in, auto-avanza
// 23  result-paywall Resultado + precios + garantía (spec: landing-resultados-precios-firmme.md)
// 24  confirmation Confirmación
// ─────────────────────────────────────────────────────────────────────────────

export const screens: AnyScreen[] = [
  // ─────────────────────────────────────────────
  // SCREEN 1 — INTRO (selección de edad)
  // NOTE: IntroScreen.tsx renders its own hardcoded age cards
  // with real photos and ignores this `options` array.
  // ─────────────────────────────────────────────
  {
    id: 1,
    type: 'intro',
    answerKey: 'userAge',
    headline: '¿Cuántos años tienes?',
    subtext:
      'Tu edad nos ayuda a crear un plan de movimiento seguro y efectivo, hecho exactamente para tu cuerpo de hoy.',
    options: [
      { id: '40-49', label: '40 – 49 años', icon: 'ti ti-leaf' },
      { id: '50-59', label: '50 – 59 años', icon: 'ti ti-plant-2' },
      { id: '60-69', label: '60 – 69 años', icon: 'ti ti-flower' },
      { id: '70+', label: '70 años o más', icon: 'ti ti-mountain' },
    ],
  },

  // ─────────────────────────────────────────────
  // SCREEN 2 — INFO: Prueba social (usa {{userAge}})
  // ─────────────────────────────────────────────
  {
    id: 2,
    type: 'info',
    headline: 'No estás sola en esto',
    subtext:
      'Miles de mujeres de tu edad ya están bajando de peso y transformando su cuerpo con FirmMe.',
    backgroundImage: 'avatar-closeup-confianza',
    checklist: [
      { icon: 'ti ti-users', text: 'Más de 8.000 mujeres de tu edad ya empezaron' },
      { icon: 'ti ti-clock-hour-4', text: 'La mayoría entre los {{userAge}} años, igual que tú' },
      { icon: 'ti ti-star', text: '4.9/5 en satisfacción de nuestras estudiantes' },
    ],
    ctaLabel: 'Continuar',
  },

  // ─────────────────────────────────────────────
  // SCREEN 3 — Miedo a caerse (pregunta clave del avatar)
  // ─────────────────────────────────────────────
  {
    id: 3,
    type: 'question',
    answerKey: 'balanceFear',
    autoAdvance: true,
    headline: '¿Te preocupa perder el equilibrio o caerte?',
    subtext: 'Selecciona la opción que mejor te describe.',
    options: [
      { id: 'often', label: 'Sí, seguido', icon: 'ti ti-alert-triangle', subtext: 'me pasa por la cabeza casi a diario' },
      { id: 'sometimes', label: 'A veces', icon: 'ti ti-cloud', subtext: 'en ciertas situaciones, como escaleras' },
      { id: 'rarely', label: 'Casi nunca', icon: 'ti ti-shield', subtext: 'pero quiero prevenir' },
      { id: 'no', label: 'No, pero quiero mejorar', icon: 'ti ti-target', subtext: 'busco sentirme aún más firme' },
    ],
  },

  // ─────────────────────────────────────────────
  // SCREEN 4 — STAT: Caídas consolidado (58%, Stanford + 24 estudios)
  // Fusiona las antiguas pantallas «1 de cada 3», «58%» y «24 estudios»
  // en una sola, con un gráfico de 3 barras animado.
  // ─────────────────────────────────────────────
  {
    id: 4,
    type: 'stat',
    stat: '58%',
    headline: 'menos caídas gracias al Tai Chi',
    subtext:
      'Es el resultado del estudio de Tai Chi más grande jamás realizado (Stanford), comparado con estiramiento tradicional — y lo confirman otros 24 estudios clínicos en adultos mayores, comparado con no hacer ningún ejercicio.',
    note:
      'Después de los 65, 1 de cada 3 mujeres se cae al menos una vez al año — pero el equilibrio no se pierde de golpe: se entrena (o se descuida) en las décadas anteriores. Empezar ahora, sin importar tu edad, es lo que marca la diferencia.',
    visual: 'fall-risk-bars',
    ctaLabel: 'Continuar',
  },

  // ─────────────────────────────────────────────
  // SCREEN 5 — Zonas de molestia (body map)
  // ─────────────────────────────────────────────
  {
    id: 5,
    type: 'question',
    answerKey: 'painZones',
    multiSelect: true,
    headline: '¿En qué zonas sientes más molestia?',
    subtext: 'Selecciona todas las que apliquen. Esto nos ayuda a adaptar tu programa.',
    options: [
      { id: 'knees', label: 'Rodillas', icon: 'ti ti-bone' },
      { id: 'lower_back', label: 'Espalda baja', icon: 'ti ti-align-justified' },
      { id: 'hips', label: 'Caderas', icon: 'ti ti-yin-yang' },
      { id: 'ankles', label: 'Tobillos', icon: 'ti ti-shoe' },
      { id: 'none', label: 'Ninguna de las anteriores', icon: 'ti ti-circle-check' },
    ],
  },

  // ─────────────────────────────────────────────
  // SCREEN 6 — STAT: 0% de carga de peso articular
  // ─────────────────────────────────────────────
  {
    id: 6,
    type: 'stat',
    stat: '0%',
    headline: 'de carga de peso en tus articulaciones',
    subtext:
      'A diferencia del gym o de correr, el Tai Chi en silla mueve tus articulaciones en todo su rango — sin cargarlas con tu peso.',
    visual: 'impact-compare',
    ctaLabel: 'Continuar',
  },

  // ─────────────────────────────────────────────
  // SCREEN 7 — STAT: Movimiento, no carga (lubricación sinovial)
  // ─────────────────────────────────────────────
  {
    id: 7,
    type: 'stat',
    headline: 'Tus articulaciones necesitan movimiento, no carga',
    subtext:
      'Los movimientos circulares y lentos favorecen la lubricación natural de rodillas, caderas y hombros — el tipo de ejercicio que recomiendan las fundaciones de artritis.',
    visual: 'joint-motion',
    ctaLabel: 'Esto es para mí',
  },

  // ─────────────────────────────────────────────
  // SCREEN 8 — Frecuencia de actividad actual
  // ─────────────────────────────────────────────
  {
    id: 8,
    type: 'question',
    answerKey: 'activityLevel',
    autoAdvance: true,
    headline: '¿Cómo describirías tu actividad física actualmente?',
    options: [
      { id: 'none', label: 'Casi no me muevo', icon: 'ti ti-sofa', subtext: 'paso la mayoría del día sentada' },
      { id: 'light', label: 'Camino un poco', icon: 'ti ti-walk', subtext: 'salgo a caminar ocasionalmente' },
      { id: 'moderate', label: 'Hago algo de ejercicio', icon: 'ti ti-run', subtext: 'algunas veces a la semana' },
      { id: 'active', label: 'Soy bastante activa', icon: 'ti ti-barbell', subtext: 'ejercicio regular pero busco algo más suave' },
    ],
  },

  // ─────────────────────────────────────────────
  // SCREEN 9 — STAT: El gym te deja agotada (acento terracota)
  // Compliance: «muchas mujeres sienten que…» en vez de afirmación categórica.
  // ─────────────────────────────────────────────
  {
    id: 9,
    type: 'stat',
    headline: 'El gym te deja agotada, no fuerte',
    subtext:
      'Muchas mujeres sienten que después de los 40 el cuerpo tarda más en recuperarse. No es falta de disciplina — es biología, y tu ejercicio debería respetarla.',
    visual: 'fatigue-clock',
    accent: 'terracotta',
    ctaLabel: 'Quiero algo distinto',
  },

  // ─────────────────────────────────────────────
  // SCREEN 10 — Historia personal (open loop)
  // ─────────────────────────────────────────────
  {
    id: 10,
    type: 'question',
    answerKey: 'personalStory',
    autoAdvance: true,
    headline: '¿Alguna vez dejaste de hacer algo que te gustaba por miedo a caerte o lastimarte?',
    subtext: 'Sigue leyendo — te contamos qué tiene esto que ver con tu plan.',
    options: [
      { id: 'yes_often', label: 'Sí, varias veces', icon: 'ti ti-door-exit' },
      { id: 'yes_once', label: 'Sí, una vez lo pensé en serio', icon: 'ti ti-alert-circle' },
      { id: 'no_but_worried', label: 'No, pero me preocupa que pase', icon: 'ti ti-eye' },
      { id: 'no', label: 'No, para nada', icon: 'ti ti-circle-check' },
    ],
  },

  // ─────────────────────────────────────────────
  // SCREEN 11 — INFO: Empatía / dolor (usa {{userAge}})
  // Puente de validación: amarra caídas + articulaciones + fatiga en un solo
  // lugar, justo antes de la última pregunta y de la revelación del Método.
  // ─────────────────────────────────────────────
  {
    id: 11,
    type: 'info',
    headline: 'Entendemos cómo te sientes',
    subtext:
      'Entre el cansancio, los cambios hormonales y cuidar de todos menos de ti, a los {{userAge}} tu cuerpo ya no responde igual — y no es tu culpa. Necesitas un movimiento diseñado para tu etapa de vida.',
    backgroundImage: 'avatar-antes-estres',
    checklist: [
      { icon: 'ti ti-heart', text: 'Movimientos suaves, pensados para tu cuerpo de hoy' },
      { icon: 'ti ti-shield-check', text: 'Sin riesgo de caídas ni impacto en tus articulaciones' },
      { icon: 'ti ti-armchair', text: 'Todo se hace sentada, desde tu propia silla' },
    ],
    ctaLabel: 'Continuar',
  },

  // ─────────────────────────────────────────────
  // SCREEN 12 — Nivel de energía
  // ─────────────────────────────────────────────
  {
    id: 12,
    type: 'question',
    answerKey: 'energyLevel',
    autoAdvance: true,
    headline: '¿Cómo describirías tu nivel de energía en un día normal?',
    options: [
      { id: 'low', label: 'Muy baja, me canso rápido', icon: 'ti ti-battery-1' },
      { id: 'medium_low', label: 'Baja, el día me la consume', icon: 'ti ti-battery-2', subtext: 'entre trabajo, casa y cuidar de otros' },
      { id: 'medium', label: 'Normal, pero podría ser mejor', icon: 'ti ti-battery-3' },
      { id: 'high', label: 'Buena, me siento activa', icon: 'ti ti-battery-4' },
    ],
  },

  // ─────────────────────────────────────────────
  // SCREEN 13 — INFO: Mecanismo «Método FirmMe™»
  // ─────────────────────────────────────────────
  {
    id: 13,
    type: 'info',
    headline: 'El Método FirmMe™: tu equilibrio, paso a paso',
    subtext:
      'No se trata de hacer más ejercicio, sino del correcto. Cada rutina combina posturas de Tai Chi con trabajo de equilibrio, adaptado a tu propio ritmo.',
    backgroundImage: 'avatar-hero-cloud-hands',
    checklist: [
      { icon: 'ti ti-target-arrow', text: 'Enfocado en equilibrio y estabilidad, no en esfuerzo' },
      { icon: 'ti ti-clock', text: 'Rutinas cortas de 10 a 20 minutos, sin agotarte' },
      { icon: 'ti ti-trending-up', text: 'Avanzas a tu propio ritmo, semana a semana' },
    ],
    ctaLabel: 'Esto me interesa',
  },

  // ─────────────────────────────────────────────
  // SCREEN 14 — Evento importante próximo
  // ─────────────────────────────────────────────
  {
    id: 14,
    type: 'question',
    answerKey: 'eventType',
    autoAdvance: true,
    headline: '¿Tienes algún evento importante en los próximos meses?',
    options: [
      { id: 'wedding', label: 'Una boda o celebración familiar', icon: 'ti ti-confetti' },
      { id: 'trip', label: 'Un viaje', icon: 'ti ti-plane' },
      { id: 'family_visit', label: 'La visita de nietos o familia', icon: 'ti ti-users' },
      { id: 'none', label: 'Ninguno en particular, solo quiero sentirme mejor', icon: 'ti ti-heart' },
    ],
  },

  // ─────────────────────────────────────────────
  // SCREEN 15 — Meta ideal (metaIdeal) + InfoCard «Meta realista»
  // ─────────────────────────────────────────────
  {
    id: 15,
    type: 'question',
    answerKey: 'metaIdeal',
    headline: '¿Qué te gustaría poder hacer sin miedo a perder el equilibrio?',
    options: [
      { id: 'grandkids', label: 'Jugar con mis nietos sin miedo a caerme', icon: 'ti ti-users' },
      { id: 'travel', label: 'Viajar y caminar tranquila por horas', icon: 'ti ti-plane' },
      { id: 'stairs', label: 'Subir y bajar escaleras con confianza', icon: 'ti ti-stairs' },
      { id: 'confidence', label: 'Simplemente sentirme segura en mi propio cuerpo', icon: 'ti ti-heart' },
    ],
    infoCard: {
      icon: 'ti ti-target',
      headline: 'Meta realista: mejorar tu equilibrio en 4 semanas.',
      body: 'FirmMe está diseñado para acompañarte de forma segura y sostenible. Las guías de fisioterapia recomiendan sesiones cortas y progresivas en vez de rutinas intensas y esporádicas que puedan generar más fatiga o riesgo en las articulaciones.',
    },
  },

  // ─────────────────────────────────────────────
  // SCREEN 16 — Fecha objetivo real (fechaObjetivo), con skip a +4 semanas
  // ─────────────────────────────────────────────
  {
    id: 16,
    type: 'date-input',
    answerKey: 'fechaObjetivo',
    headline: '¿Tienes algún evento importante próximamente?',
    subtext: 'Un viaje, una boda, una reunión familiar — cualquier momento en el que quieras sentirte segura y con energía.',
    skipLabel: 'No tengo ninguno por ahora',
    ctaLabel: 'Continuar',
  },

  // ─────────────────────────────────────────────
  // SCREEN 17 — Nombre
  // ─────────────────────────────────────────────
  {
    id: 17,
    type: 'name-input',
    answerKey: 'userName',
    headline: '¿Cómo te llamas?',
    subtext: 'Usaremos tu nombre para personalizar tu plan.',
    placeholder: 'Tu nombre...',
    ctaLabel: 'Continuar',
  },

  // ─────────────────────────────────────────────
  // SCREEN 18 — Email
  // ─────────────────────────────────────────────
  {
    id: 18,
    type: 'email-input',
    answerKey: 'userEmail',
    headline: '¿A qué correo te enviamos tu plan?',
    subtext: 'Ahí recibirás tu plan personalizado y el acceso a tu programa.',
    placeholder: 'Tu correo electrónico...',
    ctaLabel: 'Ver mi plan →',
  },

  // ─────────────────────────────────────────────
  // SCREEN 19 — ANÁLISIS (animated, usa {{userName}})
  // ─────────────────────────────────────────────
  {
    id: 19,
    type: 'analysis',
    answerKey: undefined,
    headline: 'Estamos preparando tu plan, {{userName}}',
    subtext: 'Analizando tus respuestas para crear un programa personalizado...',
    steps: [
      'Evaluando tu nivel de actividad...',
      'Adaptando los ejercicios a tu edad...',
      'Considerando tus zonas de molestia...',
      'Seleccionando las rutinas ideales...',
      '¡Tu plan personalizado está listo!',
    ],
    autoAdvanceMs: 1000,
  },

  // ─────────────────────────────────────────────
  // SCREEN 20 — COMPROMISO: «¿Estás lista para asumir el compromiso?»
  // No bloquea el avance — genera compromiso psicológico, no filtra.
  // ─────────────────────────────────────────────
  {
    id: 20,
    type: 'commitment',
    answerKey: 'compromisoInicial',
    badge: '¡CASI LISTO!',
    headline: '¿Estás lista para asumir el compromiso?',
    options: [
      { id: 'tomorrow', label: 'Sí, mañana haré mi primera sesión.', icon: 'ti ti-calendar-up' },
      { id: 'today', label: '¡Sí! Hoy haré mi primera sesión.', icon: 'ti ti-flame' },
      { id: 'not_ready', label: 'No estoy lista para asumir el compromiso.', icon: 'ti ti-clock-pause' },
    ],
  },

  // ─────────────────────────────────────────────
  // SCREEN 21 — PROYECCIÓN: gráfico estilo "Simple", usa metaIdeal/fechaObjetivo
  // ─────────────────────────────────────────────
  {
    id: 21,
    type: 'projection',
    headline: '{{userName}}, alcanza tu objetivo: {{metaIdeal}} para el {{fechaObjetivo}}',
    subtext: 'Y siéntete segura en cada paso',
    bullets: [
      'Mejora tu equilibrio con movimientos suaves pero efectivos',
      'Ejercicios diseñados para hacer sentada, sin necesidad de equipo',
      'Rutinas cortas de 10 a 20 minutos, adaptadas a tu ritmo',
      'Acompañamiento en cada paso de tu progreso',
    ],
    ctaLabel: 'Quiero mi plan',
  },

  // ─────────────────────────────────────────────
  // SCREEN 22 — FADE-SEQUENCE: 4 líneas de bienvenida, auto-avanza
  // ─────────────────────────────────────────────
  {
    id: 22,
    type: 'fade-sequence',
    lines: [
      '¡Te damos la bienvenida a FirmMe, {{userName}}!',
      'Solo 10 a 20 minutos al día...',
      'Para el {{fechaObjetivoMenos7}}, lo sentirás',
      'Para el {{fechaObjetivo}}, lo notarán',
    ],
    msPerLine: 2500,
  },

  // ─────────────────────────────────────────────
  // SCREEN 23 — RESULTADO + PRECIOS + GARANTÍA
  // Spec completo: landing-resultados-precios-firmme.md
  // ─────────────────────────────────────────────
  {
    id: 23,
    type: 'result-paywall',
    headline: '¡Tu plan de Tai Chi en Silla está listo!',
    checklist: [
      'Un nuevo plan personalizado cada semana',
      'Rutinas guiadas con video paso a paso',
      'Tai Chi en silla, sin impacto en tus articulaciones',
      'Pensado para mujeres 40+',
      'Acompañamiento en cada etapa de tu progreso',
    ],
    guaranteeHeadline: 'Tu satisfacción está garantizada',
    guaranteeBody: 'Si por cualquier motivo no estás satisfecha con el programa, te devolvemos el dinero completo — sin trámites ni excusas.',
    ctaLabel: 'Quiero mi plan',
  },

  // ─────────────────────────────────────────────
  // SCREEN 24 — CONFIRMACIÓN + ENTREGA
  // ─────────────────────────────────────────────
  {
    id: 24,
    type: 'confirmation',
    headline: '¡Listo, {{userName}}! Tu acceso está en camino',
    body: 'Revisa tu correo en los próximos minutos — ahí encontrarás el enlace para acceder a tu programa FirmMe y empezar hoy mismo.',
    badges: [
      { icon: 'ti ti-mail', text: 'Revisa tu bandeja de entrada' },
      { icon: 'ti ti-device-mobile', text: 'Accede desde tu celular o computador' },
      { icon: 'ti ti-headset', text: 'Soporte disponible por WhatsApp' },
    ],
    ctaLabel: 'Entendido',
  },
];
