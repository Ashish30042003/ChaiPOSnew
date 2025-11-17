import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Store, TrendingUp, Search, Shield, CreditCard, AlertTriangle } from 'lucide-react';

export default function Admin() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
     // Simulating data fetch since client-side listing is restricted
     setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) return <div className="p-10 text-center text-slate-400">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Platform Admin</h1>
        <div className="bg-white border rounded-full px-4 py-2 text-sm shadow-sm flex items-center gap-2"><Shield size={14} className="text-green-500"/> Secure Mode</div>
      </header>
      
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 flex gap-3 text-blue-800">
         <AlertTriangle size={20} />
         <div>
            <strong>Demo Mode Active</strong>
            <p className="text-sm">Admin dashboard is using mock data.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="text-slate-500 text-sm">Total Shops</div>
            <div className="text-3xl font-bold mt-2">124</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="text-slate-500 text-sm">Monthly Revenue</div>
            <div className="text-3xl font-bold mt-2 text-green-600">₹4.2L</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="text-slate-500 text-sm">Active Subscriptions</div>
            <div className="text-3xl font-bold mt-2 text-blue-600">85</div>
        </div>
      </div>
    </div>
  );
}