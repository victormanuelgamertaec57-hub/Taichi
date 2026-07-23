import type { PricingPlan } from '../types/quiz';

// PLACEHOLDER — ajustar valores reales antes de publicar campañas.
// Único lugar donde viven los precios; todo lo demás los referencia desde aquí.
export const pricingPlans: PricingPlan[] = [
  {
    id: 'trial',
    label: 'Prueba de 7 días',
    price: '$9.99', // placeholder, confirmar
    dailyEquivalent: '~$1.43/día',
    hotmartUrl: '#HOTMART_LINK_TRIAL',
  },
  {
    id: 'plan4weeks',
    label: 'Plan de 4 semanas',
    badge: 'EL MÁS POPULAR',
    price: '$16.99', // confirmado
    dailyEquivalent: '~$0.61/día',
    hotmartUrl: '#HOTMART_LINK_4WEEKS',
    highlighted: true,
  },
  {
    id: 'plan12weeks',
    label: 'Plan de 12 semanas',
    badge: 'Mejor valor',
    price: '$37.00', // placeholder, confirmar
    dailyEquivalent: '~$0.44/día',
    hotmartUrl: '#HOTMART_LINK_12WEEKS',
  },
];
