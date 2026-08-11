import type { PricingPlan } from '../types/quiz';

// Único lugar donde viven los precios y los links de checkout.
// Si Hotmart cambia los links, se actualizan solo aquí y el botón del paywall
// (en ambos pedidos del scroll) usa el URL del plan seleccionado.
export const pricingPlans: PricingPlan[] = [
  {
    id: 'mensal',
    label: 'Plan Mensual',
    price: 'R$77,90',
    dailyEquivalent: 'R$2,60/día',
    checkoutUrl: 'https://pay.hotmart.com/N106896758T?off=gj6hcxhu&checkoutMode=10',
  },
  {
    id: 'trimestral',
    label: 'Plan Trimestral',
    badge: 'RECOMENDADO',
    price: 'R$132,90',
    dailyEquivalent: 'R$1,48/día',
    checkoutUrl: 'https://pay.hotmart.com/N106896758T?off=wrzjhjvz&checkoutMode=10',
    highlighted: true,
  },
  {
    id: 'semestral',
    label: 'Plan Semestral',
    badge: 'Mejor relación calidad-precio',
    price: 'R$239,90',
    dailyEquivalent: 'R$1,33/día',
    checkoutUrl: 'https://pay.hotmart.com/N106896758T?off=6d5ogulh&checkoutMode=10',
  },
];
