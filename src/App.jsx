import React, { useState, useEffect, useMemo } from 'react';
import { 
  Coffee, Plus, Minus, Trash2, Settings, History, 
  ShoppingCart, X, Users, UserPlus, MapPin, 
  Lock, LogOut, Shield, ChefHat, MessageCircle, Gift,
  Palette, CheckCircle, Clock, BellRing, List
} from 'lucide-react';
import { 
  signInAnonymously, 
  onAuthStateChanged,
  signInWithCustomToken
} from "firebase/auth";
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc,
  limit,
  where,
  updateDoc
} from "firebase/firestore";

import { auth, db, appId, __initial_auth_token } from '../firebase/config';
import { ORDER_STATUS, PLANS, PLAN_ORDER, COLORS } from '../constants';
import Modal from '../components/Modal';
import Button from '../components/Button';
import LoginView from '../components/LoginView';
import Header from '../components/Header';
import KdsView from '../views/KdsView';
import PosView from '../views/PosView';
import SettingsModal from '../modals/SettingsModal';
import CustomersModal from '../modals/CustomersModal';
import HistoryModal from '../modals/HistoryModal';
import Receipt from '../components/Receipt';

// --- Main Application ---
export default function ChaiCornerPOS() {
  // --- State ---
  const [user, setUser] = useState(null);
  
  // Data State
  const [menu, setMenu] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);
  const [locations, setLocations] = useState([{ id: 'main', name: 'Main Branch' }]);
  const [staffList, setStaffList] = useState([]);
  
  // Settings / White Label / Plan
  const [storeSettings, setStoreSettings] = useState({
    name: 'Chai Corner',
    currency: '₹',
    theme: 'orange', 
    address: '123 Tea Street, Mumbai',
    plan: 'Free' // Default Plan
  });

  // Session
  const [currentLocationId, setCurrentLocationId] = useState('main');
  const [activeStaff, setActiveStaff] = useState(null);
  
  // UI State
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState('pos'); 
  const [showMobileCart, setShowMobileCart] = useState(false);
  const [lastOrderId, setLastOrderId] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [pinInput, setPinInput] = useState('');
  const [redeemPoints, setRedeemPoints] = useState(0);
  const [settingsTab, setSettingsTab] = useState('menu'); 
  const [editingId, setEditingId] = useState(null); // Track item being edited
  
  // Forms
  const [newItem, setNewItem] = useState({ name: '', price: '', stock: '' });
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '' });
  const [newStaff, setNewStaff] = useState({ name: '', pin: '', role: 'staff' });

  // --- Init ---
  useEffect(() => {
    const init = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else {
        await signInAnonymously(auth);
      }
    };
    init();
    onAuthStateChanged(auth, setUser);
  }, []);

  // --- Sync ---
  useEffect(() => {
    if (!user) return;

    const settingsRef = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'config');
    onSnapshot(settingsRef, (doc) => {
      if (doc.exists()) setStoreSettings(doc.data());
      else setDoc(settingsRef, storeSettings);
    });

    const locRef = collection(db, 'artifacts', appId, 'users', user.uid, 'locations');
    onSnapshot(locRef, (snap) => {
       if (!snap.empty) setLocations(snap.docs.map(d => ({...d.data(), id: d.id})));
       else setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'locations', 'main'), { name: 'Main Branch' });
    });

    const staffRef = collection(db, 'artifacts', appId, 'users', user.uid, 'staff');
    onSnapshot(staffRef, (snap) => setStaffList(snap.docs.map(d => ({...d.data(), id: d.id}))));

    const custRef = collection(db, 'artifacts', appId, 'users', user.uid, 'customers');
    onSnapshot(custRef, (snap) => setCustomers(snap.docs.map(d => ({...d.data(), id: d.id}))));

    const menuRef = collection(db, 'artifacts', appId, 'users', user.uid, 'menu');
    onSnapshot(menuRef, (snap) => setMenu(snap.docs.map(d => ({...d.data(), id: d.id}))));

    const salesRef = collection(db, 'artifacts', appId, 'users', user.uid, 'sales');
    const salesQ = query(salesRef, orderBy('date', 'desc'), limit(200));
    onSnapshot(salesQ, (snap) => setSalesHistory(snap.docs.map(d => ({...d.data(), id: d.id}))));

  }, [user]);


  // --- Helpers & Logic ---
  
  // Feature Gating Logic
  const currentPlan = storeSettings.plan || 'Free';
  const canAccess = (feature) => {
    const planFeatures = PLANS[currentPlan]?.features || [];
    return planFeatures.includes(feature);
  };

  const locationMenu = menu.filter(m => m.locationId === currentLocationId || (!m.locationId && currentLocationId === 'main'));
  const activeOrders = salesHistory.filter(s => s.status !== ORDER_STATUS.SERVED && s.locationId === currentLocationId);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discountAmount = redeemPoints;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount);

  // --- Actions ---

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === '1234') { 
      setActiveStaff({ name: 'Owner', role: 'admin', id: 'owner' });
      setPinInput('');
      return;
    }
    const staffMember = staffList.find(s => s.pin === pinInput);
    if (staffMember) {
      setActiveStaff(staffMember);
      setPinInput('');
    } else {
      alert('Invalid PIN');
      setPinInput('');
    }
  };

  const upgradePlan = async (newPlan) => {
    if (!user) return;
    
    // Optimistic Update (Immediate UI Change)
    setStoreSettings(prev => ({ ...prev, plan: newPlan }));
    
    if (confirm(`Confirm upgrade to ${newPlan}? 
Your card will be charged ₹${PLANS[newPlan].price}.`)) {
       const btn = document.getElementById('upgrade-btn-' + newPlan);
       if(btn) btn.innerText = "Processing...";
       
       setTimeout(async () => {
         // Using setDoc with merge: true fixes the issue where updateDoc failed if the doc didn't exist yet
         await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'config'), {
           plan: newPlan
         }, { merge: true });
         alert(`Welcome to ${newPlan}! New features unlocked.`);
       }, 1000);
    } else {
        // Revert if cancelled
        setStoreSettings(prev => ({ ...prev, plan: currentPlan }));
    }
  };

  const addToCart = (item) => {
    if (item.stock <= 0) return;
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        if (existing.qty >= item.stock) return prev;
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateCartQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        const product = menu.find(m => m.id === id);
        if (delta > 0 && newQty > product.stock) return item;
        return { ...item, qty: newQty };
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    const orderId = Date.now().toString();
    const earnedPoints = canAccess('loyalty') ? Math.floor(cartTotal / 10) : 0;

    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      items: [...cart],
      subtotal: cartSubtotal,
      discount: discountAmount,
      total: cartTotal,
      customerId: selectedCustomer ? selectedCustomer.id : null,
      customerName: selectedCustomer ? selectedCustomer.name : 'Walk-in',
      locationId: currentLocationId,
      staffId: activeStaff?.id,
      staffName: activeStaff?.name,
      status: ORDER_STATUS.PENDING,
      pointsEarned: earnedPoints,
      pointsRedeemed: redeemPoints
    };

    if (user) {
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'sales', orderId), newOrder);
      cart.forEach(async (item) => {
        const product = menu.find(p => p.id === item.id);
        if (product) {
           await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'menu', product.id), {
             stock: product.stock - item.qty
           });
        }
      });
      if (selectedCustomer && canAccess('loyalty')) {
        const newPointBalance = (selectedCustomer.points || 0) - redeemPoints + earnedPoints;
        await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'customers', selectedCustomer.id), {
          points: newPointBalance,
          lastVisit: new Date().toISOString()
        });
      }
    }

    setLastOrderId(orderId);
    setCart([]);
    setSelectedCustomer(null);
    setRedeemPoints(0);
    setShowMobileCart(false);
    setTimeout(() => window.print(), 500);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    if (user) await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'sales', orderId), { status: newStatus });
  };

  const sendWhatsAppReceipt = () => {
    if (!canAccess('whatsapp')) return alert("Upgrade to Enterprise for WhatsApp Integration!");
    alert(`WhatsApp receipt sent!`);
  };

  const saveSettings = async () => {
    if (user) {
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'config'), storeSettings, { merge: true });
      alert("Brand settings saved!");
    }
  };

  const handleReprint = (orderId) => {
    setLastOrderId(orderId);
    setTimeout(() => window.print(), 200);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if(!newItem.name || !user) return;
    
    const productData = {
      name: newItem.name,
      price: parseFloat(newItem.price),
      stock: parseInt(newItem.stock) || 0,
      locationId: currentLocationId
    };

    if (editingId) {
        await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'menu', editingId), productData);
        setEditingId(null);
    } else {
        await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'menu'), productData);
    }
    setNewItem({ name: '', price: '', stock: '' });
  };

  const startEdit = (item) => {
    setNewItem({ name: item.name, price: item.price, stock: item.stock });
    setEditingId(item.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewItem({ name: '', price: '', stock: '' });
  };

      {/* --- Views --- */}
      
      {/* 1. KDS View (Gated) */}
      {activeTab === 'kds' && canAccess('kds') && (
        <KdsView 
          activeOrders={activeOrders}
          updateOrderStatus={updateOrderStatus}
        />
      )}

      {/* 2. POS View */}
      {activeTab === 'pos' && (
        <PosView
          locationMenu={locationMenu}
          addToCart={addToCart}
          cart={cart}
          storeSettings={storeSettings}
          showMobileCart={showMobileCart}
          setShowMobileCart={setShowMobileCart}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          setRedeemPoints={setRedeemPoints}
          redeemPoints={redeemPoints}
          cartSubtotal={cartSubtotal}
          setActiveTab={setActiveTab}
          updateCartQty={updateCartQty}
          discountAmount={discountAmount}
          cartTotal={cartTotal}
          handleCheckout={handleCheckout}
          canAccess={canAccess}
          menu={menu}
        />
      )}

      {/* --- MODALS --- */}

      <SettingsModal
        isOpen={activeTab === 'settings'}
        onClose={() => setActiveTab('pos')}
        themeColor={themeColor}
        settingsTab={settingsTab}
        setSettingsTab={setSettingsTab}
        handleSaveItem={handleSaveItem}
        newItem={newItem}
        setNewItem={setNewItem}
        locationMenu={locationMenu}
        deleteDoc={deleteDoc}
        doc={doc}
        db={db}
        appId={appId}
        user={user}
        canAccess={canAccess}
        storeSettings={storeSettings}
        setStoreSettings={setStoreSettings}
        saveSettings={saveSettings}
        currentPlan={currentPlan}
        upgradePlan={upgradePlan}
        editingId={editingId}
        startEdit={startEdit}
        cancelEdit={cancelEdit}
      />

      <CustomersModal
        isOpen={activeTab === 'customers'}
        onClose={() => setActiveTab('pos')}
        themeColor={themeColor}
        canAccess={canAccess}
        addDoc={addDoc}
        collection={collection}
        db={db}
        appId={appId}
        user={user}
        newCustomer={newCustomer}
        setNewCustomer={setNewCustomer}
        customers={customers}
        setSelectedCustomer={setSelectedCustomer}
        setActiveTab={setActiveTab}
        setSettingsTab={setSettingsTab}
      />

      <HistoryModal
        isOpen={activeTab === 'history'}
        onClose={() => setActiveTab('pos')}
        themeColor={themeColor}
        salesHistory={salesHistory}
        storeSettings={storeSettings}
        lastOrderId={lastOrderId}
        canAccess={canAccess}
        sendWhatsAppReceipt={sendWhatsAppReceipt}
        handleReprint={handleReprint}
      />

      <Receipt
        receiptData={receiptData}
        storeSettings={storeSettings}
        locations={locations}
      />
      
      <style>{`@media print { @page { margin: 0; size: auto; } body * { visibility: hidden; } .print\\:block, .print\\:block * { visibility: visible; } .print\\:block { position: absolute; left: 0; top: 0; width: 100%; } }`}</style>
    </div>
  );
}