import { WEEK_1 } from '../data/weekPlan';

import manosUnidas400 from '../assets/avatars/optimized/avatar-manos-unidas-ventajas-400w.webp';
import manosUnidas600 from '../assets/avatars/optimized/avatar-manos-unidas-ventajas-600w.webp';

// Apenas 2 semanas: o desfoque da foto termina perto da metade da
// Semana 2, então uma 3ª semana ficaria "solta" sem a foto por cima.
const WEEKS = ['Semana 1', 'Semana 2'];

export default function VentajasHeader() {
  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)' }}
    >
      {/* Fondo: tabla semanal repetida como textura */}
      <div className="flex flex-col gap-4 p-5 opacity-35">
        {WEEKS.map((week) => (
          <div key={week}>
            <p className="text-xs font-bold text-secondary mb-1.5">{week}</p>
            <div className="flex flex-col gap-1">
              {WEEK_1.map((row) => (
                <div
                  key={row.day}
                  className="flex items-center justify-between text-[11px] px-2.5 py-1.5 rounded-lg bg-warm"
                >
                  <span className="font-semibold text-main">{row.day}</span>
                  <span className="text-secondary">{row.activity}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Foto superpuesta al centro, difuminada hacia abajo para fundirse con la tabla */}
      <div
        className="absolute inset-x-0 top-0 flex justify-center"
        style={{
          height: '70%',
          WebkitMaskImage: 'linear-gradient(to bottom, black 45%, transparent 92%)',
          maskImage: 'linear-gradient(to bottom, black 45%, transparent 92%)',
        }}
      >
        <img
          src={manosUnidas400}
          srcSet={`${manosUnidas400} 400w, ${manosUnidas600} 600w`}
          sizes="240px"
          width={240}
          height={430}
          loading="lazy"
          decoding="async"
          alt="Mujer con las manos unidas, en postura de calma"
          className="h-full w-auto object-contain object-top"
        />
      </div>
    </div>
  );
}
