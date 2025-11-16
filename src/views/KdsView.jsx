import React from 'react';
import { Clock, ChefHat, BellRing } from 'lucide-react';
import { ORDER_STATUS } from '../constants';

const KdsView = ({ activeOrders, updateOrderStatus }) => {
  
  const renderKDSColumn = (title, status, icon, colorClass) => (
    <div className="flex-1 bg-stone-100 rounded-xl p-2 flex flex-col h-full overflow-hidden">
      <div className={`flex items-center gap-2 p-2 mb-2 font-bold uppercase text-xs tracking-wider ${colorClass}`}>
        {icon} {title} ({activeOrders.filter(o => o.status === status).length})
      </div>
      <div className="flex-1 overflow-y-auto space-y-2">
        {activeOrders.filter(o => o.status === status).map(order => (
           <div key={order.id} className="bg-white p-3 rounded-lg shadow-sm border border-stone-200 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm">#{order.id.slice(-4)}</span>
                <span className="text-[10px] text-stone-400">{new Date(order.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
              </div>
              <div className="space-y-1 mb-3">
                {order.items.map((item, i) => (
                  <div key={i} className="text-sm text-stone-700 flex justify-between">
                    <span>{item.qty}x {item.name}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                {status !== ORDER_STATUS.PENDING && (
                  <button onClick={() => updateOrderStatus(order.id, status === ORDER_STATUS.READY ? ORDER_STATUS.PREPARING : ORDER_STATUS.PENDING)} className="flex-1 py-1 bg-stone-100 hover:bg-stone-200 rounded text-xs font-medium">Back</button>
                )}
                <button 
                  onClick={() => updateOrderStatus(order.id, status === ORDER_STATUS.PENDING ? ORDER_STATUS.PREPARING : status === ORDER_STATUS.PREPARING ? ORDER_STATUS.READY : ORDER_STATUS.SERVED)} 
                  className={`flex-1 py-1 rounded text-xs font-bold text-white shadow-sm ${status === ORDER_STATUS.PENDING ? 'bg-orange-500' : status === ORDER_STATUS.PREPARING ? 'bg-blue-500' : 'bg-green-600'}`}
                >
                  {status === ORDER_STATUS.PENDING ? 'Cook' : status === ORDER_STATUS.PREPARING ? 'Ready' : 'Serve'}
                </button>
              </div>
           </div>
        ))}
      </div>
    </div>
  );

  return (
    <main className="flex-1 overflow-hidden p-4 bg-stone-200">
      <div className="flex gap-4 h-full overflow-x-auto pb-2">
        {renderKDSColumn('Pending', ORDER_STATUS.PENDING, <Clock size={14}/>, 'text-orange-600')}
        {renderKDSColumn('Preparing', ORDER_STATUS.PREPARING, <ChefHat size={14}/>, 'text-blue-600')}
        {renderKDSColumn('Ready', ORDER_STATUS.READY, <BellRing size={14}/>, 'text-green-600')}
      </div>
    </main>
  );
};

export default KdsView;
