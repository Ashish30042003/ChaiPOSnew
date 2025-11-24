import React from 'react';
import { Lock, Plus } from 'lucide-react';
import Modal from '../components/Modal';
import Button from '../components/Button';

import { doc, updateDoc, increment } from "firebase/firestore";

const CustomersModal = ({
  isOpen,
  onClose,
  themeColor,
  canAccess,
  addDoc,
  collection,
  db,
  appId,
  user,
  newCustomer,
  setNewCustomer,
  customers,
  setSelectedCustomer,
  setActiveTab,
  setSettingsTab
}) => {

  const handleSettle = async (e, customer) => {
    e.stopPropagation();
    if (!customer.balance || customer.balance <= 0) return;
    if (window.confirm(`Settle full debt of ₹${customer.balance} for ${customer.name}?`)) {
      await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'customers', customer.id), {
        balance: 0
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Loyalty & Customers" color={themeColor}>
      {canAccess('customers') ? (
        <>
          <form onSubmit={(e) => { e.preventDefault(); addDoc(collection(db, 'artifacts', appId, 'users', user?.uid, 'customers'), { ...newCustomer, points: 0, balance: 0, joinedAt: new Date().toISOString() }); setNewCustomer({ name: '', phone: '' }); }} className="flex gap-2 mb-4">
            <input className="flex-1 border rounded px-3 py-2 text-sm" placeholder="Customer Name" required value={newCustomer.name} onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })} />
            <input className="w-32 border rounded px-3 py-2 text-sm" placeholder="Phone" value={newCustomer.phone} onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })} />
            <Button themeColor={themeColor}><Plus size={18} /></Button>
          </form>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {customers.map(c => (
              <div key={c.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-stone-50 group cursor-pointer" onClick={() => { setSelectedCustomer(c); setActiveTab('pos'); }}>
                <div>
                  <div className="font-bold text-stone-800">{c.name}</div>
                  <div className="text-xs text-stone-500">{c.phone}</div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    {canAccess('loyalty') && <div className={`font-bold text-${themeColor}-600 text-xs`}>{c.points || 0} pts</div>}
                    {c.balance > 0 && <div className="text-red-600 font-bold text-sm">Due: ₹{c.balance}</div>}
                  </div>
                  {c.balance > 0 && (
                    <button
                      onClick={(e) => handleSettle(e, c)}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold hover:bg-green-200"
                    >
                      Settle
                    </button>
                  )}
                </div>
              </div>
            ))}
            {customers.length === 0 && <div className="text-center text-stone-400 py-4">No customers yet</div>}
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <Lock size={48} className="mx-auto text-stone-300 mb-4" />
          <h3 className="font-bold text-stone-700">Feature Locked</h3>
          <p className="text-sm text-stone-500 mb-4">Upgrade to Basic Plan to manage customers.</p>
          <button onClick={() => { setActiveTab('settings'); setSettingsTab('subscription'); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold">View Plans</button>
        </div>
      )}
    </Modal>
  );
};

export default CustomersModal;
