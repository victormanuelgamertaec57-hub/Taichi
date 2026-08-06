// ─── Screen Types ─────────────────────────────────────────────────────────────

export type ScreenType =
  | 'pre-intro'    // Pre-framing hook with animation
  | 'gender'       // Gender selection
  | 'intro'         // Age selection (no back button)
  | 'question'      // Generic single or multi-choice question
  | 'info'          // Informational / empathy screen with CTA to continue
  | 'stat'          // Science/stat support screen (big number + SVG visual)
  | 'name-input'    // Text input for name only
  | 'email-input'   // Text input for email only
  | 'date-input'    // Date picker with a "skip / no date" default
  | 'commitment'    // Psychological-commitment question (non-blocking)
  | 'projection'    // "Simple"-style projection chart before results
  | 'fade-sequence' // Auto-advancing fade-in text interstitial
  | 'analysis'      // Animated progress + testimonials
  | 'result-paywall' // Consolidated results + pricing + guarantee landing page
  | 'confirmation'; // Post-purchase confirmation + delivery

// ─── Question Options ─────────────────────────────────────────────────────────

export interface QuestionOption {
  id: string;
  label: string;
  icon?: string; // Tabler icon class, e.g. "ti ti-bone"
  emoji?: string; // retrocompatibility
  subtext?: string;
  skipNextScreen?: boolean; // if selected, jumps 2 screens ahead instead of 1 (branching)
}

// ─── Screen Config ────────────────────────────────────────────────────────────

export interface BaseScreen {
  id: number;
  type: ScreenType;
  answerKey?: string; // key used in answers store
  trackingName?: string; // stable slug for Meta Pixel QuizStep custom event
  stageId?: number; // 1-8 stages model
  stageName?: string; // stage name
}

export interface PreIntroScreen extends BaseScreen {
  type: 'pre-intro';
  headline: string;
  subtext: string;
  ctaLabel: string;
}

export interface GenderScreen extends BaseScreen {
  type: 'gender';
  headline: string;
  subtext: string;
  options: QuestionOption[];
}

export interface IntroScreen extends BaseScreen {
  type: 'intro';
  headline: string;
  subtext: string;
  options: QuestionOption[];
}

export interface InfoCardData {
  icon: string;   // Tabler icon class, e.g. "ti ti-target"
  headline: string; // short, bold
  body: string;      // explanatory paragraph
}

export interface QuestionScreen extends BaseScreen {
  type: 'question';
  headline: string;
  subtext?: string;
  multiSelect?: boolean;
  options: QuestionOption[];
  ctaLabel?: string; // Label for the continue button (multi-select only)
  autoAdvance?: boolean;
  infoCard?: InfoCardData; // optional context card rendered below the options
}

export type GenderVariant<T> = T | { female: T; male: T };

export interface InfoChecklistItem {
  icon: string; // Tabler icon class, e.g. "ti ti-check"
  text: string;
}

export interface InfoScreen extends BaseScreen {
  type: 'info';
  headline: GenderVariant<string>;       // supports {{userName}} {{userAge}} tokens
  subtext?: GenderVariant<string>;       // subtítulo de apoyo
  backgroundImage: GenderVariant<string>; // key into InfoScreen's IMAGE_MAP (e.g. "avatar-closeup-confianza")
  checklist: GenderVariant<InfoChecklistItem[]>;
  ctaLabel: string;
}

// ─── Stat / science support screens ───────────────────────────────────────────

export type StatVisualKind =
  | 'fall-risk-bars'      // barras animadas: sin ejercicio / estiramiento / Tai Chi
  | 'fatigue-clock'       // reloj/fatiga (terracota)
  | 'impact-compare'      // huella de impacto vs. silla con ondas suaves
  | 'joint-motion'        // articulación con flechas circulares
  | 'fall-risk-1'         // gráfico de riesgo de caídas aumentando con la edad
  | 'fall-risk-2'         // curva de estabilidad primeras 4 semanas
  | 'fall-risk-3';        // comparador final de índice de estabilidad científico

export interface StatScreen extends BaseScreen {
  type: 'stat';
  stat?: string;          // big number shown above headline, e.g. "58%" / "1 de cada 3"
  headline: string;
  subtext: string;
  note?: string;          // supporting note, shown in smaller text below the visual
  visual: StatVisualKind;
  accent?: 'terracotta';  // only screen "gym te deja agotada" uses the terracotta accent
  ctaLabel: string;
}

export interface NameInputScreen extends BaseScreen {
  type: 'name-input';
  headline: string;
  subtext: string;
  placeholder: string;
  ctaLabel: string;
}

export interface EmailInputScreen extends BaseScreen {
  type: 'email-input';
  headline: string;
  subtext: string;
  placeholder: string;
  ctaLabel: string;
}

export interface DateInputScreen extends BaseScreen {
  type: 'date-input';
  headline: string;
  subtext?: string;
  skipLabel: string;  // e.g. "No tengo ninguno por ahora"
  ctaLabel: string;
}

// ─── Commitment screen (psychological, non-blocking) ──────────────────────────

export interface CommitmentScreen extends BaseScreen {
  type: 'commitment';
  badge: string;    // e.g. "¡CASI LISTO!"
  headline: string; // supports {{userName}} tokens; "lista" is highlighted in the component
  options: QuestionOption[];
}

// ─── Projection screen (Simple-style chart before results) ───────────────────

export interface ProjectionScreen extends BaseScreen {
  type: 'projection';
  headline: string; // supports {{userName}} {{metaIdeal}} {{fechaObjetivo}} tokens
  subtext: string;
  bullets: string[];
  ctaLabel: string;
}

// ─── Fade-in text sequence (auto-advancing interstitial) ─────────────────────

export interface FadeSequenceScreen extends BaseScreen {
  type: 'fade-sequence';
  lines: string[];   // supports {{userName}} {{fechaObjetivo}} {{fechaObjetivoMenos7}} tokens
  msPerLine?: number; // default 2500
}

export interface AnalysisScreen extends BaseScreen {
  type: 'analysis';
  headline: string;       // supports tokens
  subtext: string;
  steps: string[];        // loading steps shown in sequence
  autoAdvanceMs?: number; // ms after complete before advancing
}

export interface GuaranteeBadgeItem {
  icon: string; // Tabler icon class
  text: string;
}

// ─── Consolidated results + pricing + guarantee landing page ─────────────────
// Structural copy for the fixed sections (comparison, phone mockup, testimonials,
// Stanford stat closer) lives in the component itself — this only holds the
// pieces that follow the rest of the app's screens.ts-driven-copy convention.

export interface ResultPaywallScreen extends BaseScreen {
  type: 'result-paywall';
  headline: string;       // section 2 headline, supports {{userName}} tokens
  checklist: string[];    // section 5 advantages
  guaranteeHeadline: string; // section 8
  guaranteeBody: string;     // section 8
  ctaLabel: string;          // section 3 CTA, e.g. "Quiero mi plan"
}

export interface ConfirmationScreen extends BaseScreen {
  type: 'confirmation';
  headline: string;       // supports {{userName}} token
  body: string;
  badges: GuaranteeBadgeItem[];
  ctaLabel: string;
}

export type AnyScreen =
  | PreIntroScreen
  | GenderScreen
  | IntroScreen
  | QuestionScreen
  | InfoScreen
  | StatScreen
  | NameInputScreen
  | EmailInputScreen
  | DateInputScreen
  | CommitmentScreen
  | ProjectionScreen
  | FadeSequenceScreen
  | AnalysisScreen
  | ResultPaywallScreen
  | ConfirmationScreen;

// ─── Testimonial ──────────────────────────────────────────────────────────────

export interface Testimonial {
  name: string;
  age: number;
  location: string;
  text: string;
  rating: number;
  icon: string; // Tabler icon class
  gender: 'female' | 'male';
}

// ─── Pricing Plan ─────────────────────────────────────────────────────────────

export type PricingPlanId = 'mensal' | 'trimestral' | 'semestral';

export interface PricingPlan {
  id: PricingPlanId;
  label: string;
  badge?: string;          // e.g. "EL MÁS POPULAR" / "Mejor valor"
  price: string;
  dailyEquivalent: string; // e.g. "~$0.61/día"
  hotmartUrl: string;
  highlighted?: boolean;
}
