import type { OrderStatus } from './types';

export const STATUS_LABEL: Record<OrderStatus, string> = {
  nouvelle: 'À confirmer', confirmee: 'Interac attendu', payee: 'Payée', preparation: 'En préparation', prete: 'Prête', recuperee: 'Récupérée', annulee: 'Annulée'
};
