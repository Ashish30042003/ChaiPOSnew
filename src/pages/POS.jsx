import React, { useState, useEffect, useMemo } from 'react';
import { 
  Coffee, Plus, Minus, Trash2, Settings, History, 
  ShoppingCart, X, Archive, Users, 
  BarChart3, MapPin, Lock, LogOut, Shield,
  TrendingUp, ChefHat, MessageCircle, Gift,
  Palette, CheckCircle, Clock, BellRing, CreditCard, Star,
  List, Utensils, GlassWater, Cookie, IceCream,
  Pizza, Sandwich, Cake, Donut, Soup, Croissant, CupSoda, Package,
  Printer, Edit2, RotateCcw 
} from 'lucide-react';
import { auth, db, APP_ID } from '../firebase.js'; // Correct relative path
import { 
  signInAnonymously, onAuthStateChanged 
} from "firebase/auth";
import { 
  collection, addDoc, onSnapshot, doc, setDoc, 
  deleteDoc, updateDoc, query, orderBy, limit 
} from "firebase/firestore";

// --- Constants ---
const ORDER_STATUS = { PENDING: 'pending', PREPARING: 'preparing', READY: 'ready', SERVED: 'served' };
const COLORS = { orange: 'bg-orange-600', blue: 'bg-blue-600', green: 'bg-emerald-600', purple: 'bg-purple-600', black: 'bg-stone-900' };

const PLANS = {
  Free: { price: 0, features: ['pos', 'receipts', 'inventory'], color: 'slate' },
  Basic: { price: 299, features: ['pos', 'receipts', 'inventory', 'customers', 'reports'], color: 'blue' },
  Pro: { price: 999, features: ['pos', 'receipts', 'inventory', 'customers', 'reports', 'analytics'], color: 'orange' },
  Enterprise: { price: 2999, features: ['pos', 'receipts', 'inventory', 'customers', 'reports', 'analytics', 'kds', 'loyalty', 'whatsapp', 'white_label'], color: 'purple' }
};
const PLAN_ORDER = ['Free', 'Basic', 'Pro', 'Enterprise'];

// --- Helper Functions ---
const getItemIcon = (name) => {
  if (!name) return <Package size={20} />;
  const n = name.toLowerCase();
  
  if (n.includes('pizza')) return <Pizza size={20} />;
  if (n.includes('burger') || n.includes('sandwich') || n.includes('bun') || n.includes('pav')) return <Sandwich size={20} />;
  if (n.includes('cake') || n.includes('pastry') || n.includes('brownie') || n.includes('muffin') || n.includes('cream roll')) return <Cake size={20} />;
  if (n.includes('ice') || n.includes('cream') || n.includes('kulfi') || n.includes('dessert')) return <IceCream size={20} />;
  if (n.includes('donut') || n.includes('vada') || n.includes('doughnut') || n.includes('samosa') || n.includes('kachori') || n.includes('pattie')) return <Donut size={20} />; 
  if (n.includes('puff') || n.includes('croissant')) return <Croissant size={20} />;
  if (n.includes('soup') || n.includes('maggi') || n.includes('noodle') || n.includes('pasta') || n.includes('bowl') || n.includes('curry')) return <Soup size={20} />;
  if (n.includes('bisc') || n.includes('cookie') || n.includes('cracker') || n.includes('rusk') || n.includes('khari') || n.includes('toast') || n.includes('bread') || n.includes('maska')) return <Cookie size={20} />;
  if (n.includes('lassi') || n.includes('shake') || n.includes('juice') || n.includes('soda') || n.includes('cold') || n.includes('water') || n.includes('mojito') || n.includes('coke') || n.includes('pepsi') || n.includes('drink') || n.includes('milk')) return <CupSoda size={20} />;
  if (n.includes('snack') || n.includes('snak') || n.includes('chaat') || n.includes('bhel') || n.includes('roll') || n.includes('fry') || n.includes('fries') || n.includes('momos') || n.includes('meal') || n.includes('thali') || n.includes('poha') || n.includes('upma') || n.includes('breakfast')) return <Utensils size={20} />;
  if (n.includes('coffee') || n.includes('coffe') || n.includes('espresso') || n.includes('latte') || n.includes('cappuccino') || n.includes('mocha')) return <Coffee size={20} />;
  if (n.includes('chai') || n.includes('tea') || n.includes('kadha') || n.includes('hot')) return <Coffee size={20} />;

  return <Package size={20} />; 
};

// --- Components ---
const Modal = ({ isOpen, onClose, title, children, color = "orange" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 no-print">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className={`p-4 border-b flex justify-between items-center bg-${color}-50`}>
          <h2 className="text-lg font-bold text-stone-900">{title}</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

export default function ChaiCornerPOS() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Data
  const [menu, setMenu] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);
  const [locations, setLocations] = useState([{ id: 'main', name: 'Main Branch' }]);
  const [settings, setSettings] = useState({ store_name: 'Chai Corner', currency: '₹', theme: 'orange', plan: 'Free' });
  
  // UI State
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState('pos'); 
  const [showMobileCart, setShowMobileCart] = useState(false);
  const [lastOrderId, setLastOrderId] = useState(null);
  const [orderToPrint, setOrderToPrint] = useState(null); // <-- State to hold receipt data
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [pinInput, setPinInput] = useState('');
  const [redeemPoints, setRedeemPoints] = useState(0);
  const [settingsTab, setSettingsTab] = useState('menu'); 
  const [editingItem, setEditingItem] = useState(null); 
  const [newItem, setNewItem] = useState({ name: '', price: '', stock: '' });
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '' });
  const [activeStaff, setActiveStaff] = useState(null); // PIN Auth State

  // --- Auth ---
  useEffect(() => {
    signInAnonymously(auth);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- Data Sync (Firestore) ---
  useEffect(() => {
    if (!user) return;
    
    const basePath = `artifacts/${APP_ID}/users/${user.uid}`;

    const settingsRef = doc(db, `${basePath}/settings/config`);
    const unsubSettings = onSnapshot(settingsRef, (doc) => {
      if (doc.exists()) setSettings(doc.data());
      else setDoc(settingsRef, settings); 
    });

    const menuRef = collection(db, `${basePath}/menu`);
    const unsubMenu = onSnapshot(menuRef, (snap) => {
       setMenu(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    });

    const custRef = collection(db, `${basePath}/customers`);
    const unsubCust = onSnapshot(custRef, (snap) => {
       setCustomers(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    });

    const salesRef = collection(db, `${basePath}/sales`);
    const q = query(salesRef, orderBy('date', 'desc'), limit(100));
    const unsubSales = onSnapshot(q, (snap) => {
       setSalesHistory(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    });

    return () => {
        unsubSettings(); unsubMenu(); unsubCust(); unsubSales();
    };
  }, [user]);

  // --- Print Effect (Fixes blank print) ---
  useEffect(() => {
    if (orderToPrint) {
      window.print();
      setOrderToPrint(null); // Reset after printing
    }
  }, [orderToPrint]);


  // --- Logic ---
  const canAccess = (feature) => {
    const planFeatures = PLANS[settings.plan]?.features || [];
    return planFeatures.includes(feature);
  };

  const activeOrders = salesHistory.filter(s => s.status !== ORDER_STATUS.SERVED);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const cartTotal = Math.max(0, cartSubtotal - redeemPoints);

  const analyticsData = useMemo(() => {
    const today = new Date().toDateString();
    const todaySales = salesHistory
      .filter(s => new Date(s.date).toDateString() === today)
      .reduce((sum, s) => sum + (s.total || 0), 0);
    return { todaySales };
  }, [salesHistory]);

  // --- Actions ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === '1234') { 
      setActiveStaff({ name: 'Owner', role: 'admin' });
      setPinInput('');
    } else {
      alert('Invalid PIN (Default: 1234)');
    }
  };

  const addToCart = (item) => {
    if (item.stock <= 0) return;
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
         if(existing.qty >= item.stock) return prev;
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
    if (cart.length === 0 || !user) return;
    
    const basePath = `artifacts/${APP_ID}/users/${user.uid}`;
    const orderId = Date.now().toString();
    const earnedPoints = Math.floor(cartTotal / 10);

    const newOrder = {
        id: orderId, // Add the ID to the object
        date: new Date().toISOString(),
        items: cart,
        total: cartTotal,
        subtotal: cartSubtotal, // Store subtotal for receipt
        discount: redeemPoints, // Store discount for receipt
        customer_id: selectedCustomer?.id || null,
        customer_name: selectedCustomer?.name || 'Walk-in',
        status: ORDER_STATUS.PENDING,
        pointsEarned: earnedPoints
    };

    // 1. Save Order
    await setDoc(doc(db, `${basePath}/sales/${orderId}`), newOrder);
    
    // 2. Update Stock
    cart.forEach(async (item) => {
        const product = menu.find(p => p.id === item.id);
        if (product) {
            await updateDoc(doc(db, `${basePath}/menu/${item.id}`), {
                stock: product.stock - item.qty
            });
        }
    });

    // 3. Update Loyalty
    if (selectedCustomer) {
        const newPoints = (selectedCustomer.points || 0) - redeemPoints + earnedPoints;
        await updateDoc(doc(db, `${basePath}/customers/${selectedCustomer.id}`), {
            points: newPoints
        });
    }

    setLastOrderId(orderId); // For "Reprint Last" button
    setOrderToPrint(newOrder); // <-- THIS IS THE FIX: Triggers the print useEffect
    
    setCart([]);
    setRedeemPoints(0);
    setSelectedCustomer(null);
    setShowMobileCart(false);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !user) return;
    const basePath = `artifacts/${APP_ID}/users/${user.uid}`;
    
    const itemData = {
        name: newItem.name,
        price: parseFloat(newItem.price),
        stock: parseInt(newItem.stock) || 0,
    };

    if (editingItem) {
        await updateDoc(doc(db, `${basePath}/menu/${editingItem.id}`), itemData);
        setEditingItem(null);
    } else {
        await addDoc(collection(db, `${basePath}/menu`), itemData);
    }
    setNewItem({ name: '', price: '', stock: '' });
  };
  
  const handleReprint = (orderId) => {
    const orderToReprint = salesHistory.find(o => o.id === orderId);
    if (orderToReprint) {
        setOrderToPrint(orderToReprint); // Use the same print trigger
    }
  };

  const handleSaveCustomer = async (e) => {
      e.preventDefault();
      if (!user) return;
      const basePath = `artifacts/${APP_ID}/users/${user.uid}`;
      await addDoc(collection(db, `${basePath}/customers`), { ...newCustomer, points: 0 });
      setNewCustomer({ name: '', phone: '' });
  };

  const handleUpdateStatus = async (id, status) => {
    const basePath = `artifacts/${APP_ID}/users/${user.uid}`;
    await updateDoc(doc(db, `${basePath}/sales/${id}`), { status });
  };

  const handleUpgrade = async (plan) => {
    if(confirm(`Upgrade to ${plan}?`)) {
       const basePath = `artifacts/${APP_ID}/users/${user.uid}`;
       await setDoc(doc(db, `${basePath}/settings/config`), { plan }, { merge: true });
    }
  };

  const handleSaveSettings = async () => {
      const basePath = `artifacts/${APP_ID}/users/${user.uid}`;
      await setDoc(doc(db, `${basePath}/settings/config`), settings, { merge: true });
      alert("Saved!");
  }

  // --- Render ---
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (!activeStaff) {
    return (
      <div className="h-screen flex items-center justify-center bg-stone-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center">
            <div className="flex justify-center mb-4"><div className="bg-orange-100 p-3 rounded-full text-orange-600"><Coffee size={32}/></div></div>
            <h1 className="text-2xl font-bold mb-6">Chai Corner POS</h1>
            <form onSubmit={handleLogin} className="space-y-4">
                <input className="w-full border p-3 rounded-lg text-center text-2xl tracking-widest" type="password" placeholder="PIN" maxLength={4} value={pinInput} onChange={e=>setPinInput(e.target.value)} autoFocus />
                <button className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold">Enter POS</button>
            </form>
            <div className="mt-4 text-xs text-stone-400">Default PIN: 1234</div>
        </div>
      </div>
    );
  }

  const themeColor = settings.theme; 
  const receiptData = orderToPrint; // Use the new state variable

  return (
    <div className="h-screen w-full bg-stone-50 text-stone-800 font-sans overflow-hidden flex flex-col">
       {/* Header */}
       <header className={`bg-${themeColor}-600 text-white p-3 flex justify-between items-center shadow-lg z-10 no-print`}>
         <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg"><Coffee size={20}/></div>
            <div>
                <h1 className="font-bold leading-tight">{settings.store_name} <span className="text-[10px] bg-white/20 px-1 rounded uppercase">{settings.plan}</span></h1>
                <div className="text-xs opacity-80 font-mono">Today: {settings.currency}{analyticsData.todaySales}</div>
            </div>
         </div>
         <div className="flex gap-2">
             <button onClick={()=>setActiveTab('pos')} className="p-2 hover:bg-white/10 rounded-full"><ShoppingCart size={20}/></button>
             {canAccess('kds') && <button onClick={()=>setActiveTab('kds')} className="p-2 hover:bg-white/10 rounded-full"><ChefHat size={20}/></button>}
             {canAccess('customers') && <button onClick={()=>setActiveTab('customers')} className="p-2 hover:bg-white/10 rounded-full"><Users size={20}/></button>}
             <button onClick={()=>setActiveTab('history')} className="p-2 hover:bg-white/10 rounded-full"><History size={20}/></button>
             <button onClick={()=>setActiveTab('settings')} className="p-2 hover:bg-white/10 rounded-full"><Settings size={20}/></button>
             <button onClick={()=>setActiveStaff(null)} className="p-2 hover:bg-red-500/50 rounded-full"><LogOut size={20}/></button>
         </div>
       </header>

       {/* POS View */}
       {activeTab === 'pos' && (
         <main className="flex-1 flex overflow-hidden no-print">
             <div className="flex-1 overflow-y-auto p-4">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {menu.map(item => (
                        <div key={item.id} onClick={() => addToCart(item)} className={`bg-white border rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm cursor-pointer active:scale-95 ${item.stock <= 0 ? 'opacity-50 grayscale' : ''}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${themeColor}-50 text-${themeColor}-600`}>{getItemIcon(item.name)}</div>
                            <div className="text-center"><div className="font-bold text-sm">{item.name}</div><div className="text-xs text-stone-500 font-mono">{settings.currency}{item.price}</div></div>
                        </div>
                    ))}
                 </div>
             </div>
             <div className={`w-96 bg-white border-l flex flex-col ${showMobileCart ? 'fixed inset-0 z-50' : 'hidden md:flex'}`}>
                 <div className="p-4 flex-1 overflow-y-auto">
                    {cart.length === 0 ? 
                        <div className="h-full flex flex-col items-center justify-center text-stone-300">
                            <ShoppingCart size={48}/><p>Cart Empty</p>
                            {lastOrderId && <button onClick={()=> handleReprint(lastOrderId)} className="mt-4 text-xs border px-3 py-1 rounded flex items-center gap-1 text-stone-500"><Printer size={12}/> Reprint Last</button>}
                        </div> 
                    : cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center border-b py-3">
                            <div><div className="font-medium">{item.name}</div></div>
                            <div className="flex items-center gap-2 bg-stone-100 rounded px-1">
                                <button onClick={()=>updateCartQty(item.id, -1)} className="p-1"><Minus size={12}/></button><span className="text-xs font-bold">{item.qty}</span><button onClick={()=>updateCartQty(item.id, 1)} className="p-1"><Plus size={12}/></button>
                            </div>
                        </div>
                    ))}
                 </div>
                 <div className="p-4 border-t bg-stone-50">
                    {selectedCustomer && <div className="flex justify-between text-xs mb-2 text-stone-500"><span>Customer: {selectedCustomer.name}</span><button onClick={()=>setSelectedCustomer(null)}><X size={12}/></button></div>}
                    <div className="flex justify-between text-xl font-bold mb-4"><span>Total</span><span>{settings.currency}{cartTotal}</span></div>
                    <button onClick={handleCheckout} disabled={cart.length===0} className={`w-full py-3 rounded-lg font-bold text-white shadow-lg ${cart.length===0 ? 'bg-stone-300' : `bg-${themeColor}-600`}`}>Checkout</button>
                 </div>
             </div>
         </main>
       )}

       {/* KDS View */}
       {activeTab === 'kds' && canAccess('kds') && (
         <div className="flex-1 p-4 overflow-x-auto flex gap-4 bg-stone-100 no-print">
            {[ORDER_STATUS.PENDING, ORDER_STATUS.PREPARING, ORDER_STATUS.READY].map(status => (
                <div key={status} className="min-w-[300px] flex-1 bg-white rounded-xl shadow-sm flex flex-col border">
                    <div className="p-3 font-bold uppercase text-xs border-b bg-stone-50">{status}</div>
                    <div className="p-2 space-y-2 overflow-y-auto flex-1">
                        {activeOrders.filter(o => o.status === status).map(order => (
                            <div key={order.id} className="p-3 border rounded bg-stone-50">
                                <div className="flex justify-between font-bold text-sm mb-2"><span>#{order.id.slice(-4)}</span></div>
                                <div className="text-sm space-y-1 mb-3">{order.items.map((i, idx) => <div key={idx}>{i.qty}x {i.name}</div>)}</div>
                                <button onClick={() => handleUpdateStatus(order.id, status === ORDER_STATUS.PENDING ? ORDER_STATUS.PREPARING : status === ORDER_STATUS.PREPARING ? ORDER_STATUS.READY : ORDER_STATUS.SERVED)} className="w-full py-1 bg-blue-600 text-white rounded text-xs">Next</button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
         </div>
       )}
       
       {/* Customers */}
       <Modal isOpen={activeTab === 'customers'} onClose={()=>setActiveTab('pos')} title="Customers" color={themeColor}>
          <form onSubmit={handleSaveCustomer} className="flex gap-2 mb-4">
              <input className="flex-1 border p-2 rounded text-sm" placeholder="Name" value={newCustomer.name} onChange={e=>setNewCustomer({...newCustomer, name:e.target.value})} />
              <input className="w-32 border p-2 rounded text-sm" placeholder="Phone" value={newCustomer.phone} onChange={e=>setNewCustomer({...newCustomer, phone:e.target.value})} />
              <button className={`bg-${themeColor}-600 text-white p-2 rounded`}><Plus size={18}/></button>
          </form>
          <div className="space-y-2">
              {customers.map(c => (
                  <div key={c.id} onClick={()=>{setSelectedCustomer(c); setActiveTab('pos')}} className="flex justify-between p-3 border rounded cursor-pointer hover:bg-stone-50">
                      <div><div className="font-bold">{c.name}</div><div className="text-xs text-stone-500">{c.phone}</div></div>
                      <div className="text-right"><div className={`font-bold text-${themeColor}-600`}>{(c.points || 0)} pts</div></div>
                  </div>
              ))}
          </div>
       </Modal>
       
       {/* History Modal */}
       <Modal isOpen={activeTab === 'history'} onClose={()=>setActiveTab('pos')} title="Sales History" color={themeColor}>
         {salesHistory.map(order => (
             <div key={order.id} className="border-b py-2">
                <div className="flex justify-between text-sm font-medium"><span>#{order.id.slice(-4)}</span><span>{settings.currency}{order.total}</span></div>
                <div className="text-xs text-stone-500">{new Date(order.date).toLocaleString()} • {order.customer_name}</div>
                <div className="flex justify-end mt-2 gap-2">
                   {canAccess('whatsapp') && <button className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"><MessageCircle size={12} /> WhatsApp</button>}
                   <button onClick={() => handleReprint(order.id)} className="flex items-center gap-1 text-xs bg-stone-100 text-stone-700 px-2 py-1 rounded hover:bg-stone-200"><Printer size={12} /> Print</button>
                </div>
             </div>
         ))}
      </Modal>

       {/* Settings */}
       <Modal isOpen={activeTab === 'settings'} onClose={()=>setActiveTab('pos')} title="Settings" color={themeColor}>
          <div className="flex border-b mb-4">
              {['menu', 'general', 'subscription'].map(t => (
                  <button key={t} onClick={()=>setSettingsTab(t)} className={`flex-1 py-2 capitalize text-sm font-bold ${settingsTab===t ? `border-b-2 border-${themeColor}-600 text-${themeColor}-600` : 'text-stone-400'}`}>{t}</button>
              ))}
          </div>

          {settingsTab === 'menu' && (
              <div>
                  <form onSubmit={handleSaveItem} className="grid grid-cols-4 gap-2 mb-4 p-3 bg-stone-50 rounded border">
                      <input className="col-span-2 border rounded p-2 text-sm" placeholder="Name" value={newItem.name} onChange={e=>setNewItem({...newItem, name:e.target.value})} />
                      <input className="border rounded p-2 text-sm" type="number" placeholder="Price" value={newItem.price} onChange={e=>setNewItem({...newItem, price:e.target.value})} />
                      <input className="border rounded p-2 text-sm" type="number" placeholder="Stock" value={newItem.stock} onChange={e=>setNewItem({...newItem, stock:e.target.value})} />
                      <button className={`col-span-4 bg-${themeColor}-600 text-white rounded py-2 text-sm font-bold`}>{editingItem ? 'Update' : 'Add'}</button>
                  </form>
                  <div className="space-y-2">
                      {menu.map(item => (
                          <div key={item.id} className="flex justify-between items-center p-2 border rounded hover:bg-stone-50">
                              <span className="font-medium text-sm">{item.name}</span>
                              <div className="flex gap-3 items-center">
                                  <span className="text-xs font-mono bg-stone-100 px-2 rounded">Qty: {item.stock}</span>
                                  <button onClick={() => {setEditingItem(item); setNewItem({name:item.name, price:item.price, stock:item.stock})}}><Edit2 size={14} className="text-blue-500"/></button>
                                  <button onClick={() => deleteDoc(doc(db, `artifacts/${APP_ID}/users/${user.uid}/menu`, item.id))}><Trash2 size={14} className="text-red-500"/></button>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}
          {settingsTab === 'general' && (
              <div className="space-y-4">
                  <div><label className="block text-xs font-bold text-stone-500">Store Name</label><input className="w-full border p-2 rounded" value={settings.store_name} onChange={e=>setSettings({...settings, store_name:e.target.value})} /></div>
                  <button onClick={handleSaveSettings} className="w-full bg-black text-white py-2 rounded font-bold">Save Changes</button>
              </div>
          )}
          {settingsTab === 'subscription' && (
              <div className="space-y-3">
                  {PLAN_ORDER.map(plan => (
                      <div key={plan} className={`p-3 border rounded-xl flex justify-between items-center ${settings.plan === plan ? 'bg-green-50 border-green-500' : ''}`}>
                          <div><div className="font-bold">{plan}</div><div className="text-xs text-stone-500">₹{PLANS[plan].price}/mo</div></div>
                          {settings.plan === plan ? <CheckCircle size={20} className="text-green-600"/> : <button onClick={()=>handleUpgrade(plan)} className="text-xs bg-stone-900 text-white px-3 py-1 rounded">Upgrade</button>}
                      </div>
                  ))}
              </div>
          )}
       </Modal>

       {/* Receipt (This is the printable part) */}
       <div className="print-only hidden">
          {receiptData && (
              <div className="p-1 w-72 mx-auto text-black text-center font-mono text-xs">
                  <div className="font-bold text-lg mb-2">{settings.store_name}</div>
                  <div className="mb-2">Order #{receiptData.id.slice(-4)}</div>
                  <div className="text-xs mb-2">{new Date(receiptData.date).toLocaleString()}</div>
                  
                  <div className="border-t border-b border-dashed border-black py-2 my-2 text-left">
                      {receiptData.items.map((i, idx) => (
                          <div key={idx} className="flex mb-1">
                              <div className="flex-1">{i.name}</div>
                              <div className="w-8 text-center">{i.qty}</div>
                              <div className="w-12 text-right">₹{i.price * i.qty}</div>
                          </div>
                      ))}
                  </div>
                  
                  <div className="text-left space-y-1">
                      <div className="flex justify-between"><span>Subtotal</span><span>₹{receiptData.subtotal}</span></div>
                      {receiptData.discount > 0 && <div className="flex justify-between"><span>Discount</span><span>-₹{receiptData.discount}</span></div>}
                      <div className="flex justify-between font-bold text-lg border-t border-black pt-1"><span>TOTAL</span><span>₹{receiptData.total}</span></div>
                  </div>

                  <div className="text-center mt-4 pt-2 border-t border-dashed border-black">
                      {receiptData.customer_name !== 'Walk-in' && <div className="mb-2">Customer: {receiptData.customer_name}</div>}
                      <p>Thank you for your visit!</p>
                  </div>
              </div>
          )}
       </div>
    </div>
  );
}