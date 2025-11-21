import React from 'react';
import { TrendingUp, Clock, Star } from 'lucide-react';
import SimpleBarChart from '../components/SimpleBarChart';

const AnalyticsView = ({ analyticsData, storeSettings, menu }) => {
  const themeColor = storeSettings.theme;

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-stone-50">
      <h2 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
        <TrendingUp size={24} className={`text-${themeColor}-600`} /> Business Insights
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <h3 className="text-stone-500 text-xs font-bold uppercase tracking-wide">Today's Collection</h3>
          <div className={`text-3xl font-bold text-${themeColor}-600 mt-2`}>
            {storeSettings.currency}{analyticsData.todaySales.toLocaleString()}
          </div>
          <div className="text-xs text-stone-400 mt-1">Sales made today</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <h3 className="text-stone-500 text-xs font-bold uppercase tracking-wide">Total Orders</h3>
          <div className="text-3xl font-bold text-stone-800 mt-2">{analyticsData.totalOrders}</div>
          <div className="text-xs text-stone-400 mt-1">All time volume</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <h3 className="text-stone-500 text-xs font-bold uppercase tracking-wide">Inventory Value</h3>
          <div className="text-3xl font-bold text-green-600 mt-2">
            {storeSettings.currency}{menu.reduce((a, b) => a + (b.price * b.stock), 0).toLocaleString()}
          </div>
          <div className="text-xs text-stone-400 mt-1">Stock on hand</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
            <Clock size={18} className="text-stone-400" /> Peak Hours (Timing)
          </h3>
          <SimpleBarChart data={analyticsData.relevantHours} color={themeColor} />
          <div className="text-center text-xs text-stone-400 mt-2">Order Volume by Hour (7 AM - 11 PM)</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
            <Star size={18} className="text-stone-400" /> Top Selling Items
          </h3>
          <div className="space-y-3">
            {analyticsData.topItems.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm border-b border-stone-50 pb-2 last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full bg-${themeColor}-50 text-${themeColor}-600 flex items-center justify-center text-xs font-bold`}>{i + 1}</span>
                  <span className="font-medium text-stone-700">{item.name}</span>
                </div>
                <span className="font-mono text-stone-500">{item.qty} sold</span>
              </div>
            ))}
            {analyticsData.topItems.length === 0 && <div className="text-center text-stone-400 py-4">No sales data yet</div>}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AnalyticsView;
