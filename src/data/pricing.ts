import type { PricingPlan } from '../types/quiz';

// Único lugar donde viven los precios; todo lo demás los referencia desde aquí.
export const pricingPlans: PricingPlan[] = [
  {
    id: 'mensal',
    label: 'Plan Mensual',
    price: 'R$77,90',
    dailyEquivalent: 'R$2,60/día',
    hotmartUrl: 'https://pay.hotmart.com/N106896758T?checkoutMode=2&off=gj6hcxhu',
  },
  {
    id: 'trimestral',
    label: 'Plan Trimestral',
    badge: 'RECOMENDADO',
    price: 'R$132,90',
    dailyEquivalent: 'R$1,48/día',
    hotmartUrl: 'https://pay.hotmart.com/N106896758T?checkoutMode=2&off=wrzjhjvz',
    highlighted: true,
  },
  {
    id: 'semestral',
    label: 'Plan Semestral',
    badge: 'Mejor relación calidad-precio',
    price: 'R$239,90',
    dailyEquivalent: 'R$1,33/día',
    hotmartUrl: 'https://pay.hotmart.com/N106896758T?checkoutMode=2&off=6d5ogulh',
  },
];
