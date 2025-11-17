import React, { useState, useEffect } from 'react';
import { auth, db, APP_ID } from '../firebase.js'; // Corrected import path
import { onSnapshot, collection, query, orderBy, limit } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";

export default function DashboardOrders() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    const basePath = `artifacts/${APP_ID}/users/${user.uid}`;
    const ordersQuery = query(collection(db, `${basePath}/sales`), orderBy('date', 'desc'), limit(50));
    
    const unsubscribe = onSnapshot(ordersQuery, (snap) => {
      setOrders(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    });
    
    return () => unsubscribe();
  }, [user]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Recent Orders</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map(order => (
              <tr key={order.id}>
                <td className="p-4 font-mono text-slate-500">#{order.id.slice(-6)}</td>
                <td className="p-4 font-medium text-slate-800">{order.customer_name}</td>
                <td className="p-4">{new Date(order.date).toLocaleString()}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium 
                    ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'ready' ? 'bg-green-100 text-green-800' :
                      'bg-slate-100 text-slate-600'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 font-bold text-slate-900 text-right">₹{order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}