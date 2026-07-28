import type { AnyScreen } from '../types/quiz';

// ─────────────────────────────────────────────────────────────────────────────
// FLUJO (24 pantallas) — funil 100% direcionado a mulheres 40+
//
//  1  intro       Idade (grade de fotos)
//  2  info        Prova social «Você não está sozinha» (avatar-closeup-confianza)
//  3  question    Medo de perder o equilíbrio / cair
//  4  stat        Quedas consolidado: «58%» (Stanford + 24 estudos, barras animadas)
//  5  question    Regiões de desconforto (multi-select)
//  6  stat        «0% de carga de peso nas suas articulações» (pegada vs. cadeira)
//  7  stat        «Movimento, não carga» (articulação com setas)
//  8  question    Nível de atividade atual
//  9  stat        «A academia te deixa exausta» (relógio/fadiga, acento terracota)
// 10  question    História pessoal (open loop)
// 11  info        Empatia «A gente entende como você se sente» (avatar-antes-estres)
// 12  question    Nível de energia
// 13  info        Mecanismo «Método FirmMe™» (avatar-hero-cloud-hands)
// 14  question    Evento próximo
// 15  question    Meta ideal (metaIdeal) + InfoCard «Meta realista»
// 16  date-input  Evento/data objetivo real (fechaObjetivo)
// 17  name-input  Nome
// 18  email-input E-mail
// 19  analysis    Análise animada + depoimentos
// 20  commitment  «Você está pronta para assumir o compromisso?» (compromisoInicial)
// 21  projection  Gráfico de projeção (estilo Simple, usa metaIdeal/fechaObjetivo)
// 22  fade-sequence  4 linhas de boas-vindas em fade-in, auto-avança
// 23  result-paywall Resultado + preços + garantia (spec: landing-resultados-precios-firmme.md)
// 24  confirmation Confirmação
// ─────────────────────────────────────────────────────────────────────────────

export const screens: AnyScreen[] = [
  // ─────────────────────────────────────────────
  // SCREEN 1 — INTRO (seleção de idade)
  // NOTE: IntroScreen.tsx renderiza seus próprios cards de idade hardcoded
  // com fotos reais e ignora este array `options`.
  // ─────────────────────────────────────────────
  {
    id: 1,
    type: 'intro',
    answerKey: 'userAge',
    headline: 'Quantos anos você tem?',
    subtext:
      'Sua idade nos ajuda a criar um plano de movimento seguro e eficaz, feito exatamente para o seu corpo hoje.',
    options: [
      { id: '40-49', label: '40 – 49 anos', icon: 'ti ti-leaf' },
      { id: '50-59', label: '50 – 59 anos', icon: 'ti ti-plant-2' },
      { id: '60-69', label: '60 – 69 anos', icon: 'ti ti-flower' },
      { id: '70+', label: '70 anos ou mais', icon: 'ti ti-mountain' },
    ],
  },

  // ─────────────────────────────────────────────
  // SCREEN 2 — INFO: Prova social (usa {{userAge}})
  // ─────────────────────────────────────────────
  {
    id: 2,
    type: 'info',
    headline: 'Você não está sozinha nisso',
    subtext:
      'Milhares de mulheres da sua idade já estão melhorando o corpo e a disposição com a FirmMe.',
    backgroundImage: 'avatar-closeup-confianza',
    checklist: [
      { icon: 'ti ti-users', text: 'Mais de 8.000 mulheres da sua idade já começaram' },
      { icon: 'ti ti-clock-hour-4', text: 'A maioria tem entre {{userAge}} anos, igual a você' },
      { icon: 'ti ti-star', text: '4,9/5 de satisfação das nossas alunas' },
    ],
    ctaLabel: 'Continuar',
  },

  // ─────────────────────────────────────────────
  // SCREEN 3 — Medo de cair (pergunta-chave do avatar)
  // ─────────────────────────────────────────────
  {
    id: 3,
    type: 'question',
    answerKey: 'balanceFear',
    autoAdvance: true,
    headline: 'Você se preocupa em perder o equilíbrio ou cair?',
    subtext: 'Escolha a opção que melhor descreve você.',
    options: [
      { id: 'often', label: 'Sim, sempre', icon: 'ti ti-alert-triangle', subtext: 'penso nisso quase todo dia' },
      { id: 'sometimes', label: 'Às vezes', icon: 'ti ti-cloud', subtext: 'em certas situações, como em escadas' },
      { id: 'rarely', label: 'Quase nunca', icon: 'ti ti-shield', subtext: 'mas quero me prevenir' },
      { id: 'no', label: 'Não, mas quero melhorar', icon: 'ti ti-target', subtext: 'quero me sentir ainda mais firme' },
    ],
  },

  // ─────────────────────────────────────────────
  // SCREEN 4 — STAT: Quedas consolidado (58%, Stanford + 24 estudos)
  // Funde as antigas telas «1 em cada 3», «58%» e «24 estudos»
  // em uma só, com um gráfico de 3 barras animado.
  // ─────────────────────────────────────────────
  {
    id: 4,
    type: 'stat',
    stat: '58%',
    headline: 'menos quedas graças ao Tai Chi',
    subtext:
      'É o resultado do maior estudo de Tai Chi já realizado (Stanford), comparado com alongamento tradicional — e é confirmado por outros 24 estudos clínicos em adultos mais velhos, em comparação com não fazer nenhum exercício.',
    note:
      'Depois dos 65 anos, 1 em cada 3 mulheres cai pelo menos uma vez por ano — mas o equilíbrio não se perde de uma vez: ele se treina (ou se negligencia) nas décadas anteriores. Começar agora, não importa a sua idade, é o que faz a diferença.',
    visual: 'fall-risk-bars',
    ctaLabel: 'Continuar',
  },

  // ─────────────────────────────────────────────
  // SCREEN 5 — Regiões de desconforto (body map)
  // ─────────────────────────────────────────────
  {
    id: 5,
    type: 'question',
    answerKey: 'painZones',
    multiSelect: true,
    headline: 'Em quais regiões você sente mais desconforto?',
    subtext: 'Selecione todas as opções que se aplicam. Isso nos ajuda a adaptar seu programa.',
    options: [
      { id: 'knees', label: 'Joelhos', icon: 'ti ti-bone' },
      { id: 'lower_back', label: 'Lombar', icon: 'ti ti-align-justified' },
      { id: 'hips', label: 'Quadris', icon: 'ti ti-yin-yang' },
      { id: 'ankles', label: 'Tornozelos', icon: 'ti ti-shoe' },
      { id: 'none', label: 'Nenhuma das anteriores', icon: 'ti ti-circle-check' },
    ],
  },

  // ─────────────────────────────────────────────
  // SCREEN 6 — STAT: 0% de carga de peso articular
  // ─────────────────────────────────────────────
  {
    id: 6,
    type: 'stat',
    stat: '0%',
    headline: 'de carga de peso nas suas articulações',
    subtext:
      'Diferente da academia ou da corrida, o Tai Chi na cadeira move suas articulações em toda a amplitude — sem carregá-las com o seu peso.',
    visual: 'impact-compare',
    ctaLabel: 'Continuar',
  },

  // ─────────────────────────────────────────────
  // SCREEN 7 — STAT: Movimento, não carga (lubrificação sinovial)
  // ─────────────────────────────────────────────
  {
    id: 7,
    type: 'stat',
    headline: 'Suas articulações precisam de movimento, não de carga',
    subtext:
      'Os movimentos circulares e lentos favorecem a lubrificação natural de joelhos, quadris e ombros — o tipo de exercício recomendado pelas fundações de artrite.',
    visual: 'joint-motion',
    ctaLabel: 'Isso é para mim',
  },

  // ─────────────────────────────────────────────
  // SCREEN 8 — Frequência de atividade atual
  // ─────────────────────────────────────────────
  {
    id: 8,
    type: 'question',
    answerKey: 'activityLevel',
    autoAdvance: true,
    headline: 'Como você descreveria sua atividade física hoje?',
    options: [
      { id: 'none', label: 'Quase não me mexo', icon: 'ti ti-sofa', subtext: 'passo a maior parte do dia sentada' },
      { id: 'light', label: 'Ando um pouco', icon: 'ti ti-walk', subtext: 'saio para caminhar de vez em quando' },
      { id: 'moderate', label: 'Faço um pouco de exercício', icon: 'ti ti-run', subtext: 'algumas vezes por semana' },
      { id: 'active', label: 'Sou bem ativa', icon: 'ti ti-barbell', subtext: 'me exercito, mas quero algo mais suave' },
    ],
  },

  // ─────────────────────────────────────────────
  // SCREEN 9 — STAT: A academia te deixa exausta (acento terracota)
  // Compliance: «muitas mulheres sentem que…» em vez de afirmação categórica.
  // ─────────────────────────────────────────────
  {
    id: 9,
    type: 'stat',
    headline: 'A academia te deixa exausta, não forte',
    subtext:
      'Muitas mulheres sentem que, depois dos 40, o corpo demora mais para se recuperar. Não é falta de disciplina — é biologia, e o seu exercício precisa respeitar isso.',
    visual: 'fatigue-clock',
    accent: 'terracotta',
    ctaLabel: 'Quero algo diferente',
  },

  // ─────────────────────────────────────────────
  // SCREEN 10 — História pessoal (open loop)
  // ─────────────────────────────────────────────
  {
    id: 10,
    type: 'question',
    answerKey: 'personalStory',
    autoAdvance: true,
    headline: 'Você já deixou de fazer algo de que gostava por medo de cair ou se machucar?',
    subtext: 'Continue lendo — vamos te contar o que isso tem a ver com o seu plano.',
    options: [
      { id: 'yes_often', label: 'Sim, várias vezes', icon: 'ti ti-door-exit' },
      { id: 'yes_once', label: 'Sim, uma vez pensei sério', icon: 'ti ti-alert-circle' },
      { id: 'no_but_worried', label: 'Não, mas me preocupa que aconteça', icon: 'ti ti-eye' },
      { id: 'no', label: 'Não, de jeito nenhum', icon: 'ti ti-circle-check' },
    ],
  },

  // ─────────────────────────────────────────────
  // SCREEN 11 — INFO: Empatia / dor (usa {{userAge}})
  // Ponte de validação: amarra quedas + articulações + fadiga em um só
  // lugar, logo antes da última pergunta e da revelação do Método.
  // ─────────────────────────────────────────────
  {
    id: 11,
    type: 'info',
    headline: 'A gente entende como você se sente',
    subtext:
      'Entre o cansaço, as mudanças hormonais e cuidar de todo mundo menos de você, aos {{userAge}} seu corpo já não responde igual — e não é culpa sua. Você precisa de um movimento pensado para a sua fase de vida.',
    backgroundImage: 'avatar-antes-estres',
    checklist: [
      { icon: 'ti ti-heart', text: 'Movimentos suaves, pensados para o seu corpo hoje' },
      { icon: 'ti ti-shield-check', text: 'Sem risco de quedas nem impacto nas articulações' },
      { icon: 'ti ti-armchair', text: 'Tudo é feito sentada, na sua própria cadeira' },
    ],
    ctaLabel: 'Continuar',
  },

  // ─────────────────────────────────────────────
  // SCREEN 12 — Nível de energia
  // ─────────────────────────────────────────────
  {
    id: 12,
    type: 'question',
    answerKey: 'energyLevel',
    autoAdvance: true,
    headline: 'Como você descreveria seu nível de energia em um dia normal?',
    options: [
      { id: 'low', label: 'Muito baixa, me canso rápido', icon: 'ti ti-battery-1' },
      { id: 'medium_low', label: 'Baixa, o dia me consome', icon: 'ti ti-battery-2', subtext: 'entre trabalho, casa e cuidar dos outros' },
      { id: 'medium', label: 'Normal, mas podia ser melhor', icon: 'ti ti-battery-3' },
      { id: 'high', label: 'Boa, me sinto ativa', icon: 'ti ti-battery-4' },
    ],
  },

  // ─────────────────────────────────────────────
  // SCREEN 13 — INFO: Mecanismo «Método FirmMe™»
  // ─────────────────────────────────────────────
  {
    id: 13,
    type: 'info',
    headline: 'O Método FirmMe™: seu equilíbrio, passo a passo',
    subtext:
      'Não é sobre fazer mais exercício, e sim sobre o exercício certo. Cada rotina combina posturas de Tai Chi com trabalho de equilíbrio, no seu ritmo.',
    backgroundImage: 'avatar-hero-cloud-hands',
    checklist: [
      { icon: 'ti ti-target-arrow', text: 'Foco em equilíbrio e estabilidade, não em esforço' },
      { icon: 'ti ti-clock', text: 'Rotinas curtas de 10 a 20 minutos, sem te agotar' },
      { icon: 'ti ti-trending-up', text: 'Você avança no seu ritmo, semana a semana' },
    ],
    ctaLabel: 'Isso me interessa',
  },

  // ─────────────────────────────────────────────
  // SCREEN 14 — Evento importante próximo
  // ─────────────────────────────────────────────
  {
    id: 14,
    type: 'question',
    answerKey: 'eventType',
    autoAdvance: true,
    headline: 'Você tem algum evento importante nos próximos meses?',
    options: [
      { id: 'wedding', label: 'Um casamento ou celebração em família', icon: 'ti ti-confetti' },
      { id: 'trip', label: 'Uma viagem', icon: 'ti ti-plane' },
      { id: 'family_visit', label: 'A visita de netos ou família', icon: 'ti ti-users' },
      { id: 'none', label: 'Nenhum, só quero me sentir melhor', icon: 'ti ti-heart' },
    ],
  },

  // ─────────────────────────────────────────────
  // SCREEN 15 — Meta ideal (metaIdeal) + InfoCard «Meta realista»
  // ─────────────────────────────────────────────
  {
    id: 15,
    type: 'question',
    answerKey: 'metaIdeal',
    headline: 'O que você gostaria de poder fazer sem medo de perder o equilíbrio?',
    options: [
      { id: 'grandkids', label: 'Brincar com meus netos sem medo de cair', icon: 'ti ti-users' },
      { id: 'travel', label: 'Viajar e caminhar tranquila por horas', icon: 'ti ti-plane' },
      { id: 'stairs', label: 'Subir e descer escadas com confiança', icon: 'ti ti-stairs' },
      { id: 'confidence', label: 'Simplesmente me sentir segura no meu próprio corpo', icon: 'ti ti-heart' },
    ],
    infoCard: {
      icon: 'ti ti-target',
      headline: 'Meta realista: melhorar seu equilíbrio em 4 semanas.',
      body: 'A FirmMe foi pensada para te acompanhar de forma segura e sustentável. Os guias de fisioterapia recomendam sessões curtas e progressivas em vez de rotinas intensas e esporádicas, que podem gerar mais cansaço ou risco para as articulações.',
    },
  },

  // ─────────────────────────────────────────────
  // SCREEN 16 — Data objetivo real (fechaObjetivo), com skip a +4 semanas
  // ─────────────────────────────────────────────
  {
    id: 16,
    type: 'date-input',
    answerKey: 'fechaObjetivo',
    headline: 'Você tem algum evento importante em breve?',
    subtext: 'Uma viagem, um casamento, um encontro em família — qualquer momento em que você queira se sentir segura e com energia.',
    skipLabel: 'Não tenho nenhum por enquanto',
    ctaLabel: 'Continuar',
  },

  // ─────────────────────────────────────────────
  // SCREEN 17 — Nome
  // ─────────────────────────────────────────────
  {
    id: 17,
    type: 'name-input',
    answerKey: 'userName',
    headline: 'Como você se chama?',
    subtext: 'Vamos usar seu nome para personalizar seu plano.',
    placeholder: 'Seu nome...',
    ctaLabel: 'Continuar',
  },

  // ─────────────────────────────────────────────
  // SCREEN 18 — E-mail
  // ─────────────────────────────────────────────
  {
    id: 18,
    type: 'email-input',
    answerKey: 'userEmail',
    headline: 'Para qual e-mail enviamos seu plano?',
    subtext: 'Lá você recebe seu plano personalizado e o acesso ao programa.',
    placeholder: 'Seu e-mail...',
    ctaLabel: 'Ver meu plano →',
  },

  // ─────────────────────────────────────────────
  // SCREEN 19 — ANÁLISE (animada, usa {{userName}})
  // ─────────────────────────────────────────────
  {
    id: 19,
    type: 'analysis',
    answerKey: undefined,
    headline: 'Estamos preparando seu plano, {{userName}}',
    subtext: 'Analisando suas respostas para criar um programa personalizado...',
    steps: [
      'Avaliando seu nível de atividade...',
      'Adaptando os exercícios à sua idade...',
      'Considerando as regiões de desconforto...',
      'Selecionando as rotinas ideais...',
      'Seu plano personalizado está pronto!',
    ],
    autoAdvanceMs: 1000,
  },

  // ─────────────────────────────────────────────
  // SCREEN 20 — COMPROMISSO: «Você está pronta para assumir o compromisso?»
  // Não bloqueia o avanço — gera compromisso psicológico, não filtra.
  // ─────────────────────────────────────────────
  {
    id: 20,
    type: 'commitment',
    answerKey: 'compromisoInicial',
    badge: 'QUASE LÁ!',
    headline: 'Você está pronta para assumir o compromisso?',
    options: [
      { id: 'tomorrow', label: 'Sim, amanhã faço minha primeira sessão.', icon: 'ti ti-calendar-up' },
      { id: 'today', label: 'Sim! Hoje faço minha primeira sessão.', icon: 'ti ti-flame' },
      { id: 'not_ready', label: 'Não estou pronta para assumir o compromisso.', icon: 'ti ti-clock-pause' },
    ],
  },

  // ─────────────────────────────────────────────
  // SCREEN 21 — PROJEÇÃO: gráfico estilo "Simple", usa metaIdeal/fechaObjetivo
  // ─────────────────────────────────────────────
  {
    id: 21,
    type: 'projection',
    headline: '{{userName}}, alcance seu objetivo: {{metaIdeal}} até {{fechaObjetivo}}',
    subtext: 'E se sinta segura a cada passo',
    bullets: [
      'Melhore seu equilíbrio com movimentos suaves, mas eficazes',
      'Exercícios feitos para fazer sentada, sem precisar de equipamento',
      'Rotinas curtas de 10 a 20 minutos, no seu ritmo',
      'Acompanhamento em cada passo do seu progresso',
    ],
    ctaLabel: 'Quero meu plano',
  },

  // ─────────────────────────────────────────────
  // SCREEN 22 — FADE-SEQUENCE: 4 linhas de boas-vindas, auto-avança
  // ─────────────────────────────────────────────
  {
    id: 22,
    type: 'fade-sequence',
    lines: [
      'Bem-vinda à FirmMe, {{userName}}!',
      'Apenas 10 a 20 minutos por dia...',
      'Em {{fechaObjetivoMenos7}}, você vai sentir',
      'Em {{fechaObjetivo}}, todo mundo vai notar',
    ],
    msPerLine: 2500,
  },

  // ─────────────────────────────────────────────
  // SCREEN 23 — RESULTADO + PREÇOS + GARANTIA
  // Spec completo: landing-resultados-precios-firmme.md
  // ─────────────────────────────────────────────
  {
    id: 23,
    type: 'result-paywall',
    headline: 'Seu plano de Tai Chi na Cadeira está pronto!',
    checklist: [
      'Um novo plano personalizado a cada semana',
      'Rotinas guiadas com vídeo, passo a passo',
      'Tai Chi na cadeira, sem impacto nas suas articulações',
      'Pensado para mulheres 40+',
      'Acompanhamento em cada etapa do seu progresso',
    ],
    guaranteeHeadline: 'Sua satisfação está garantida',
    guaranteeBody: 'Se por qualquer motivo você não ficar satisfeita com o programa, devolvemos seu dinheiro inteiro — sem burocracia, sem desculpas.',
    ctaLabel: 'Quero meu plano',
  },

  // ─────────────────────────────────────────────
  // SCREEN 24 — CONFIRMAÇÃO + ENTREGA
  // ─────────────────────────────────────────────
  {
    id: 24,
    type: 'confirmation',
    headline: 'Pronto, {{userName}}! Seu acesso está a caminho',
    body: 'Confira seu e-mail nos próximos minutos — lá você encontra o link para acessar seu programa FirmMe e começar hoje mesmo.',
    badges: [
      { icon: 'ti ti-mail', text: 'Confira sua caixa de entrada' },
      { icon: 'ti ti-device-mobile', text: 'Acesse pelo celular ou computador' },
      { icon: 'ti ti-headset', text: 'Suporte disponível por WhatsApp' },
    ],
    ctaLabel: 'Entendi',
  },
];
