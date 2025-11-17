import React, { useState, useEffect } from 'react';
import { auth, db, APP_ID } from '../firebase.js'; // Corrected import path
import { onSnapshot, collection, query, orderBy, limit } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";

export default function DashboardCustomers() {
  const [user, setUser] = useState(null);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    const basePath = `artifacts/${APP_ID}/users/${user.uid}`;
    const custQuery = query(collection(db, `${basePath}/customers`), orderBy('name'));
    
    const unsubscribe = onSnapshot(custQuery, (snap) => {
      setCustomers(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    });
    
    return () => unsubscribe();
  }, [user]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Customers</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Phone</th>
              <th className="p-4 text-right">Loyalty Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map(customer => (
              <tr key={customer.id}>
                <td className="p-4 font-medium text-slate-800">{customer.name}</td>
                <td className="p-4 text-slate-600">{customer.phone}</td>
                <td className="p-4 font-bold text-orange-600 text-right">{customer.points || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}