export const ORDER_STATUS = {
  PENDING: 'pending',
  PREPARING: 'preparing',
  READY: 'ready',
  SERVED: 'served'
};

export const COLORS = {
  orange: 'bg-orange-600 text-white',
  blue: 'bg-blue-600 text-white',
  green: 'bg-emerald-600 text-white',
  purple: 'bg-purple-600 text-white',
  black: 'bg-stone-900 text-white'
};

export const PLANS = {
  Free: { price: 0, features: ['pos', 'receipts', 'local_stock', 'inventory'], color: 'slate' },
  Basic: { price: 299, features: ['pos', 'receipts', 'local_stock', 'inventory', 'cloud_sync', 'customers', 'reports'], color: 'blue' },
  Pro: { price: 999, features: ['pos', 'receipts', 'local_stock', 'inventory', 'cloud_sync', 'customers', 'reports', 'multi_location', 'staff', 'analytics'], color: 'orange' },
  Enterprise: { price: 2999, features: ['pos', 'receipts', 'local_stock', 'inventory', 'cloud_sync', 'customers', 'reports', 'multi_location', 'staff', 'analytics', 'kds', 'loyalty', 'whatsapp', 'white_label'], color: 'purple' }
};

export const PLAN_ORDER = ['Free', 'Basic', 'Pro', 'Enterprise'];
