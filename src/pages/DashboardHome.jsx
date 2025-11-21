import React, { useState, useEffect, useMemo } from 'react';
import { auth, db, APP_ID } from '../firebase.js'; // Corrected import path
import { onSnapshot, collection, query, orderBy, limit, where, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";
import { TrendingUp, Users, ShoppingBag, DollarSign, History } from 'lucide-react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

// Stat Card Component
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
    <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
      {icon}
    </div>
    <div>
      <div className="text-sm font-medium text-slate-500">{title}</div>
      <div className="text-3xl font-bold text-slate-900">{value}</div>
    </div>
  </div>
);

export default function DashboardHome() {
  const [user, setUser] = useState(null);
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    const basePath = `artifacts/${APP_ID}/users/${user.uid}`;

    // Get Sales
    const salesQuery = query(collection(db, `${basePath}/sales`), orderBy('date', 'desc'), limit(500));
    const unsubSales = onSnapshot(salesQuery, (snap) => {
      setSales(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    });

    // Get Customers
    const custQuery = query(collection(db, `${basePath}/customers`));
    const unsubCust = onSnapshot(custQuery, (snap) => {
      setCustomers(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    });

    return () => { unsubSales(); unsubCust(); };
  }, [user]);

  // --- Analytics Memo ---
  const analytics = useMemo(() => {
    const today = new Date().toDateString();
    
    const todaySales = sales
      .filter(s => new Date(s.date).toDateString() === today)
      .reduce((sum, s) => sum + s.total, 0);

    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);

    const totalCustomers = customers.length;

    // Chart Data: Revenue over last 7 days
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toDateString();
    }).reverse();

    const revenueByDay = last7Days.map(day => {
      return sales
        .filter(s => new Date(s.date).toDateString() === day)
        .reduce((sum, s) => sum + s.total, 0);
    });
    
    const topItems = sales
      .flatMap(s => s.items)
      .reduce((acc, item) => {
          acc[item.name] = (acc[item.name] || 0) + item.qty;
          return acc;
      }, {});
      
    const sortedTopItems = Object.entries(topItems)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    return { todaySales, totalRevenue, totalCustomers, revenueByDay, last7Days, sortedTopItems };
  }, [sales, customers]);

  const revenueChartData = {
    labels: analytics.last7Days.map(d => d.slice(4, 10)),
    datasets: [{
      label: 'Revenue (₹)',
      data: analytics.revenueByDay,
      borderColor: '#ea580c',
      backgroundColor: 'rgba(234, 88, 12, 0.1)',
      fill: true,
      tension: 0.3
    }]
  };
  
  const topItemsChartData = {
    labels: analytics.sortedTopItems.map(item => item[0]),
    datasets: [{
      label: 'Quantity Sold',
      data: analytics.sortedTopItems.map(item => item[1]),
      backgroundColor: '#f97316',
      borderRadius: 4
    }]
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Dashboard</h1>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Revenue" value={`₹${analytics.totalRevenue.toLocaleString()}`} icon={<DollarSign />} color="green" />
        <StatCard title="Today's Sales" value={`₹${analytics.todaySales.toLocaleString()}`} icon={<TrendingUp />} color="orange" />
        <StatCard title="Total Customers" value={analytics.totalCustomers} icon={<Users />} color="blue" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Revenue (Last 7 Days)</h3>
          <div className="h-64">
            <Line data={revenueChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Top Selling Items</h3>
          <div className="h-64">
            <Bar data={topItemsChartData} options={{ maintainAspectRatio: false, indexAxis: 'y' }} />
          </div>
        </div>
      </div>
    </div>
  );
}