import React, { useState, useEffect, useMemo } from 'react';
import {
  Coffee, Plus, Minus, Trash2, Settings, History,
  ShoppingCart, X, Users, UserPlus, MapPin,
  Lock, LogOut, Shield, ChefHat, MessageCircle, Gift,
  Palette, CheckCircle, Clock, BellRing, List
} from 'lucide-react';
import {
  onAuthStateChanged,
  signOut
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

import { auth, db, appId, functions } from './firebase/config';
import { httpsCallable } from 'firebase/functions';
import { ORDER_STATUS, PLANS, PLAN_ORDER, COLORS } from './constants';
import Modal from './components/Modal';
import Button from './components/Button';
import LoginView from './components/LoginView';
import Header from './components/Header';
import Auth from './components/Auth';
import KdsView from './views/KdsView';
import PosView from './views/PosView';
import SettingsModal from './modals/SettingsModal';
import CustomersModal from './modals/CustomersModal';
import HistoryModal from './modals/HistoryModal';
import Receipt from './components/Receipt';
import AnalyticsView from './views/AnalyticsView';
import DashboardView from './views/DashboardView';

// --- Main Application ---
export default function ChaiCornerPOS() {
  console.log("ChaiCornerPOS mounting...");

  // --- State ---
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    // Fallback: If auth doesn't trigger in 5s, stop loading (user will see login screen)
    const timeout = setTimeout(() => {
      setAuthLoading(prev => {
        if (prev) {
          console.warn("Auth state change timed out, defaulting to logged out.");
          return false;
        }
        return prev;
      });
    }, 5000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  // --- Sync ---
  useEffect(() => {
    if (!user) return;

    // Create/update user profile document (needed for admin panel to list users)
    const userProfileRef = doc(db, 'artifacts', appId, 'users', user.uid);
    setDoc(userProfileRef, {
      email: user.email,
      displayName: user.displayName || user.email?.split('@')[0] || 'User',
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }, { merge: true }).catch(err => console.error('Error creating user profile:', err));

    const settingsRef = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'config');
    onSnapshot(settingsRef, (doc) => {
      if (doc.exists()) setStoreSettings(doc.data());
      else setDoc(settingsRef, storeSettings);
    });

    const locRef = collection(db, 'artifacts', appId, 'users', user.uid, 'locations');
    onSnapshot(locRef, (snap) => {
      if (!snap.empty) setLocations(snap.docs.map(d => ({ ...d.data(), id: d.id })));
      else setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'locations', 'main'), { name: 'Main Branch' });
    });

    const staffRef = collection(db, 'artifacts', appId, 'users', user.uid, 'staff');
    onSnapshot(staffRef, (snap) => setStaffList(snap.docs.map(d => ({ ...d.data(), id: d.id }))));

    const custRef = collection(db, 'artifacts', appId, 'users', user.uid, 'customers');
    onSnapshot(custRef, (snap) => setCustomers(snap.docs.map(d => ({ ...d.data(), id: d.id }))));

    const menuRef = collection(db, 'artifacts', appId, 'users', user.uid, 'menu');
    onSnapshot(menuRef, (snap) => setMenu(snap.docs.map(d => ({ ...d.data(), id: d.id }))));

    const salesRef = collection(db, 'artifacts', appId, 'users', user.uid, 'sales');
    const salesQ = query(salesRef, orderBy('date', 'desc'), limit(200));
    onSnapshot(salesQ, (snap) => setSalesHistory(snap.docs.map(d => ({ ...d.data(), id: d.id }))));

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
  const locationSales = salesHistory.filter(s => s.locationId === currentLocationId || (!s.locationId && currentLocationId === 'main'));

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discountAmount = redeemPoints;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount);

  // --- Analytics Calculations ---
  const analyticsData = useMemo(() => {
    // 1. Daily Collection (Today's Total Sales)
    const today = new Date().toDateString();
    const todaySales = locationSales
      .filter(s => new Date(s.date).toDateString() === today)
      .reduce((sum, s) => sum + s.total, 0);

    // 2. Peak Hours (Timing)
    const hours = new Array(24).fill(0);
    locationSales.forEach(order => {
      const h = new Date(order.date).getHours();
      hours[h]++;
    });
    const relevantHours = hours.map((count, h) => ({ label: `${h}:00`, value: count })).slice(7, 23); // 7 AM to 11 PM

    // 3. Top Selling Items (Analysis)
    const itemCounts = {};
    locationSales.forEach(order => {
      order.items.forEach(item => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + item.qty;
      });
    });
    const topItems = Object.entries(itemCounts)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    return { todaySales, relevantHours, topItems, totalOrders: locationSales.length };
  }, [locationSales]);

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

    try {
      const btn = document.getElementById('upgrade-btn-' + newPlan);
      if (btn) {
        btn.innerText = "Processing...";
        btn.disabled = true;
      }

      // 1. Create Order via Cloud Function
      const createOrderFn = httpsCallable(functions, 'createRazorpayOrder');
      const planDetails = PLANS[newPlan];

      const orderResponse = await createOrderFn({
        amount: planDetails.price,
        plan: newPlan,
        currency: storeSettings.currency === '₹' ? 'INR' : 'USD'
      });

      const { id: orderId, amount: orderAmount, currency: orderCurrency } = orderResponse.data;

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        alert("Razorpay Key is missing! Please set VITE_RAZORPAY_KEY_ID in your .env file and restart the server.");
        if (btn) {
          btn.innerText = "Upgrade";
          btn.disabled = false;
        }
        return;
      }

      const options = {
        key: razorpayKey,
        amount: orderAmount,
        currency: orderCurrency,
        name: "Chai Corner POS",
        description: `Upgrade to ${newPlan} Plan`,
        image: "https://cdn-icons-png.flaticon.com/512/1047/1047503.png",
        order_id: orderId,
        handler: async function (response) {
          try {
            // 2. Verify Payment via Cloud Function
            const verifyPaymentFn = httpsCallable(functions, 'verifyRazorpayPayment');
            const verificationResponse = await verifyPaymentFn({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              plan: newPlan
            });

            if (verificationResponse.data.status === 'success') {
              const newSettings = { ...storeSettings, plan: newPlan };
              setStoreSettings(newSettings);
              await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'config'), { plan: newPlan }, { merge: true });
              alert(`Payment Successful! Welcome to ${newPlan}.`);
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (verifyError) {
            console.error("Verification Error:", verifyError);
            alert("Payment verification failed: " + verifyError.message);
          } finally {
            if (btn) {
              btn.innerText = "Upgrade";
              btn.disabled = false;
            }
          }
        },
        prefill: {
          name: user.displayName || "Chai Owner",
          email: user.email || "owner@chaicorner.com",
          contact: "9999999999"
        },
        theme: {
          color: "#F97316"
        },
        modal: {
          ondismiss: function () {
            if (btn) {
              btn.innerText = "Upgrade";
              btn.disabled = false;
            }
          }
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        alert("Payment Failed: " + response.error.description);
        if (btn) {
          btn.innerText = "Upgrade";
          btn.disabled = false;
        }
      });
      rzp1.open();

    } catch (error) {
      console.error("Order Creation Error:", error);
      alert("Failed to initiate payment: " + error.message);
      const btn = document.getElementById('upgrade-btn-' + newPlan);
      if (btn) {
        btn.innerText = "Upgrade";
        btn.disabled = false;
      }
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
      staffId: activeStaff?.id || null,
      staffName: activeStaff?.name || 'Owner',
      status: ORDER_STATUS.PENDING,
      pointsEarned: earnedPoints,
      pointsRedeemed: redeemPoints
    };

    try {
      if (user) {
        await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'sales', orderId), newOrder);

        // Update stock
        for (const item of cart) {
          const product = menu.find(p => p.id === item.id);
          if (product) {
            await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'menu', product.id), {
              stock: product.stock - item.qty
            });
          }
        }

        // Update loyalty
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

      // Delay print to ensure state updates
      setTimeout(() => {
        window.print();
      }, 500);

    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Checkout failed: " + error.message);
    }
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
    if (!newItem.name || !user) return;

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

  const themeColor = storeSettings.theme;
  const receiptData = salesHistory.find(s => s.id === lastOrderId) || null;

  if (authLoading) {
    return <div className="h-screen w-full flex items-center justify-center bg-stone-50 text-stone-400">Loading...</div>;
  }

  if (!user) {
    return <Auth themeColor={storeSettings.theme} />;
  }

  return (
    <div className={`h-dvh flex flex-col bg-stone-100 font-sans text-stone-900 theme-${themeColor} overflow-hidden`}>
      <Header
        user={user}
        storeSettings={storeSettings}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartItemCount={cart.reduce((acc, item) => acc + item.qty, 0)}
        setShowMobileCart={setShowMobileCart}
        canAccess={canAccess}
        locations={locations}
        currentLocationId={currentLocationId}
        setCurrentLocationId={setCurrentLocationId}
        activeStaff={activeStaff}
        setActiveStaff={setActiveStaff}
        setCart={setCart}
        analyticsData={analyticsData}
        currentPlan={currentPlan}
        setSettingsTab={setSettingsTab}
      />

      {/* Dashboard View */}
      {activeTab === 'dashboard' && (
        <DashboardView
          storeSettings={storeSettings}
          salesHistory={salesHistory}
          menu={menu}
          activeOrders={activeOrders}
          currentPlan={currentPlan}
          setActiveTab={setActiveTab}
          setSettingsTab={setSettingsTab}
          themeColor={themeColor}
        />
      )}

      {/* 1. Analytics Dashboard */}
      {activeTab === 'analytics' && canAccess('analytics') && (
        <AnalyticsView
          analyticsData={analyticsData}
          storeSettings={storeSettings}
          menu={menu}
        />
      )}

      {/* 2. KDS View (Gated) */}
      {activeTab === 'kds' && canAccess('kds') && (
        <KdsView
          activeOrders={activeOrders}
          updateOrderStatus={updateOrderStatus}
        />
      )}

      {/* 3. POS View */}
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
          lastOrderId={lastOrderId}
          handleReprint={handleReprint}
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
