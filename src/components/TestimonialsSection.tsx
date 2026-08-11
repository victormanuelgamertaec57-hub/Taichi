import type { ReactNode } from 'react';
import { FaStar } from 'react-icons/fa';

import marliAntes400 from '../assets/testimonials/optimized/testimonio-marli-antes-400w.webp';
import marliAntes600 from '../assets/testimonials/optimized/testimonio-marli-antes-600w.webp';
import marliAntes800 from '../assets/testimonials/optimized/testimonio-marli-antes-800w.webp';
import marliDespues400 from '../assets/testimonials/optimized/testimonio-marli-despues-400w.webp';
import marliDespues600 from '../assets/testimonials/optimized/testimonio-marli-despues-600w.webp';
import marliDespues800 from '../assets/testimonials/optimized/testimonio-marli-despues-800w.webp';

import ivoneAntes400 from '../assets/testimonials/optimized/testimonio-ivone-antes-400w.webp';
import ivoneAntes600 from '../assets/testimonials/optimized/testimonio-ivone-antes-600w.webp';
import ivoneAntes800 from '../assets/testimonials/optimized/testimonio-ivone-antes-800w.webp';
import ivoneDespues400 from '../assets/testimonials/optimized/testimonio-ivone-despues-400w.webp';
import ivoneDespues600 from '../assets/testimonials/optimized/testimonio-ivone-despues-600w.webp';
import ivoneDespues800 from '../assets/testimonials/optimized/testimonio-ivone-despues-800w.webp';

const SAGE = '#5A6FD6';
const SAGE_BG = '#EEF1FB';
const GOLD = '#D4A24C';

interface PhotoSrcSet {
  src400: string;
  src600: string;
  src800: string;
}

interface FeaturedTestimonial {
  name: string;
  age: number;
  rating: number;
  quote: string;
  before: PhotoSrcSet;
  after: PhotoSrcSet;
}

interface TextTestimonial {
  name: string;
  age: number;
  rating: number;
  quote: string;
}

const FEATURED_TESTIMONIALS: FeaturedTestimonial[] = [
  {
    name: 'Marli',
    age: 54,
    rating: 5,
    quote:
      'Ya intenté gimnasio, apps de ejercicio, dietas, de todo. Esto es lo único que he logrado mantener todos los días, porque no requiere más que la silla que ya tengo en casa.',
    before: { src400: marliAntes400, src600: marliAntes600, src800: marliAntes800 },
    after: { src400: marliDespues400, src600: marliDespues600, src800: marliDespues800 },
  },
  {
    name: 'Ivone',
    age: 61,
    rating: 5,
    quote:
      'No esperaba sentir más vitalidad solo con movimientos suaves. Pero después de dos semanas, me despierto con menos cansancio y puedo jugar con mis nietos sin sentir el cuerpo pesado.',
    before: { src400: ivoneAntes400, src600: ivoneAntes600, src800: ivoneAntes800 },
    after: { src400: ivoneDespues400, src600: ivoneDespues600, src800: ivoneDespues800 },
  },
];

const TEXT_TESTIMONIALS: TextTestimonial[] = [
  {
    name: 'Marlene',
    age: 68,
    rating: 5,
    quote:
      'Después de casi caerme dos veces en el baño, me daba miedo andar sola por la casa. Con el Tai Chi en silla, sentí que mi equilibrio mejoró de una forma que no esperaba; hoy camino con mucha más seguridad.',
  },
  {
    name: 'Cristina',
    age: 49,
    rating: 5,
    quote:
      'Confieso que creí que no iba a sentir nada haciendo ejercicio sentada. En la primera semana ya noté la diferencia en la rigidez del cuello y los hombros. Hoy es la parte de mi día que más disfruto.',
  },
  {
    name: 'Vanessa',
    age: 45,
    rating: 5,
    quote:
      'Hacía de todo para controlar la ansiedad, menos esto. Los 15 minutos de Tai Chi se convirtieron en mi momento de tranquilidad antes de empezar la rutina diaria.',
  },
  {
    name: 'Adriana',
    age: 52,
    rating: 5,
    quote:
      'Tenía la boda de mi hija cerca y quería sentirme bien con mi cuerpo sin lastimarme de última hora en un gimnasio. El Tai Chi en silla fue exactamente lo que necesitaba.',
  },
  {
    name: 'Terezinha',
    age: 64,
    rating: 5,
    quote:
      'Después del diagnóstico de artrosis en la rodilla, creí que me quedaría inactiva. Incluso mi fisioterapeuta comentó que mi movilidad mejoró notablemente desde que empecé.',
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5" style={{ color: GOLD }}>
      {Array.from({ length: rating }).map((_, i) => (
        <FaStar key={i} size={14} />
      ))}
    </span>
  );
}

function DecorativeQuote({ size }: { size: number }) {
  return (
    <span
      aria-hidden="true"
      className="absolute -top-5 -left-1 select-none pointer-events-none font-serif"
      style={{ fontSize: size, lineHeight: 1, color: SAGE, opacity: 0.18 }}
    >
      &ldquo;
    </span>
  );
}

function CardShell({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl bg-white shadow-md overflow-hidden flex flex-col h-full">{children}</div>;
}

function FeaturedCard({ t }: { t: FeaturedTestimonial }) {
  return (
    <CardShell>
      <div className="flex">
        <img
          src={t.before.src400}
          srcSet={`${t.before.src400} 400w, ${t.before.src600} 600w, ${t.before.src800} 800w`}
          sizes="50vw"
          width={400}
          height={400}
          loading="lazy"
          decoding="async"
          alt={`${t.name} antes de comenzar`}
          className="w-1/2 aspect-square object-cover object-top"
        />
        <div className="w-px flex-shrink-0" style={{ backgroundColor: 'var(--color-border)' }} />
        <img
          src={t.after.src400}
          srcSet={`${t.after.src400} 400w, ${t.after.src600} 600w, ${t.after.src800} 800w`}
          sizes="50vw"
          width={400}
          height={400}
          loading="lazy"
          decoding="async"
          alt={`${t.name} después del programa`}
          className="w-1/2 aspect-square object-cover object-top"
        />
      </div>
      <div className="p-5 flex flex-col gap-3">
        <Stars rating={t.rating} />
        <div className="relative">
          <DecorativeQuote size={64} />
          <p className="relative z-10 text-sm text-main italic leading-relaxed">"{t.quote}"</p>
        </div>
        <p className="text-sm">
          <span className="font-bold text-main">{t.name}</span>
          <span className="text-secondary">, {t.age} años</span>
        </p>
      </div>
    </CardShell>
  );
}

function TextCard({ t }: { t: TextTestimonial }) {
  return (
    <CardShell>
      <div className="p-5 flex flex-col gap-3 h-full">
        <Stars rating={t.rating} />
        <div className="relative">
          <DecorativeQuote size={56} />
          <p className="relative z-10 text-sm text-main leading-relaxed">{t.quote}</p>
        </div>
        <div className="flex items-center gap-3 mt-auto pt-1">
          <span
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
            style={{ backgroundColor: SAGE_BG, color: SAGE }}
          >
            {t.name.charAt(0)}
          </span>
          <p className="text-sm">
            <span className="font-bold text-main">{t.name}</span>
            <span className="text-secondary">, {t.age} años</span>
          </p>
        </div>
      </div>
    </CardShell>
  );
}

export default function TestimonialsSection() {
  return (
    <div className="flex flex-col gap-4">
      {/* Destacadas — con foto antes/después */}
      <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
        {FEATURED_TESTIMONIALS.map((t) => (
          <FeaturedCard key={t.name} t={t} />
        ))}
      </div>

      {/* Solo texto — carrusel deslizable en mobile, grid 2 columnas en desktop */}
      <div className="md:hidden -mx-5 px-5 flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-1">
        {TEXT_TESTIMONIALS.map((t) => (
          <div key={t.name} className="snap-center flex-shrink-0 w-[85%] max-w-xs">
            <TextCard t={t} />
          </div>
        ))}
      </div>
      <div className="hidden md:grid md:grid-cols-2 gap-4">
        {TEXT_TESTIMONIALS.map((t) => (
          <TextCard key={t.name} t={t} />
        ))}
      </div>
    </div>
  );
}
