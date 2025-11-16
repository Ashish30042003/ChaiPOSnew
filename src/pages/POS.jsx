import React, { useState, useEffect, useMemo } from 'react';
import { 
  Coffee, Plus, Minus, Trash2, Settings, History, 
  ShoppingCart, X, Archive, Users, 
  Cloud, CloudOff, UserPlus, Calendar,
  BarChart3, MapPin, Lock, LogOut, Shield,
  TrendingUp, ChefHat, MessageCircle, Gift,
  Palette, CheckCircle, Clock, BellRing, CreditCard, Star,
  List, Utensils, GlassWater, Cookie, IceCream,
  Pizza, Sandwich, Cake, Donut, Soup, Croissant, CupSoda, Package,
  Printer, Edit2, RotateCcw 
} from 'lucide-react';
import { supabase } from '../supabase'; // Using Supabase client

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
  if (n.includes('burger') || n.includes('sandwich')) return <Sandwich size={20} />;
  if (n.includes('cake') || n.includes('muffin')) return <Cake size={20} />;
  if (n.includes('ice') || n.includes('kulfi')) return <IceCream size={20} />;
  if (n.includes('samosa') || n.includes('vada')) return <Utensils size={20} />;
  if (n.includes('lassi') || n.includes('shake') || n.includes('soda')) return <CupSoda size={20} />;
  if (n.includes('chai') || n.includes('tea') || n.includes('coffee')) return <Coffee size={20} />;
  return <Package size={20} />; 
};

// --- Components ---
const Modal = ({ isOpen, onClose, title, children, color = "orange" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
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
  // --- State ---
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Data
  const [menu, setMenu] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);
  const [settings, setSettings] = useState({ store_name: 'Chai Corner', currency: '₹', theme: 'orange', plan: 'Free' });
  
  // UI
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState('pos'); 
  const [showMobileCart, setShowMobileCart] = useState(false);
  const [lastOrderId, setLastOrderId] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [redeemPoints, setRedeemPoints] = useState(0);
  const [settingsTab, setSettingsTab] = useState('menu'); 
  const [editingItem, setEditingItem] = useState(null); 
  
  // Forms
  const [newItem, setNewItem] = useState({ name: '', price: '', stock: '' });
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '' });

  // --- Init & Auth ---
  useEffect(() => {
    const initSession = async () => {
       try {
         const { data: { session } } = await supabase.auth.getSession();
         setSession(session);
       } catch (e) {
         console.log('Supabase not configured yet');
       }
       setLoading(false);
    };
    
    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- Data Fetching (Realtime) ---
  useEffect(() => {
    if (!session) return;

    const fetchData = async () => {
      const { data: menuData } = await supabase.from('menu_items').select('*').order('name');
      if (menuData) setMenu(menuData);

      const { data: custData } = await supabase.from('customers').select('*');
      if (custData) setCustomers(custData);

      const { data: salesData } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(100);
      if (salesData) setSalesHistory(salesData);

      const { data: settingsData } = await supabase.from('settings').select('*').single();
      if (settingsData) setSettings(settingsData);
      else {
        const { data: newSettings } = await supabase.from('settings').insert([{ user_id: session.user.id }]).select().single();
        if (newSettings) setSettings(newSettings);
      }
    };

    fetchData();

    const channel = supabase.channel('db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_items' }, payload => {
         if(payload.eventType === 'INSERT') setMenu(prev => [...prev, payload.new]);
         if(payload.eventType === 'UPDATE') setMenu(prev => prev.map(i => i.id === payload.new.id ? payload.new : i));
         if(payload.eventType === 'DELETE') setMenu(prev => prev.filter(i => i.id !== payload.old.id));
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, payload => {
         setSalesHistory(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [session]);

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
      .filter(s => new Date(s.created_at).toDateString() === today)
      .reduce((sum, s) => sum + (s.total || 0), 0);
    return { todaySales };
  }, [salesHistory]);

  // --- Actions ---
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = isLogin 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    
    if (error) alert(error.message);
    setLoading(false);
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
    if (cart.length === 0 || !session) return;
    
    const newOrder = {
      user_id: session.user.id,
      items: cart,
      total: cartTotal,
      customer_id: selectedCustomer?.id || null,
      customer_name: selectedCustomer?.name || 'Walk-in',
      status: ORDER_STATUS.PENDING
    };

    const { data: order, error } = await supabase.from('orders').insert([newOrder]).select().single();
    
    if (!error) {
      for (const item of cart) {
        const product = menu.find(p => p.id === item.id);
        if (product) {
          await supabase.from('menu_items').update({ stock: product.stock - item.qty }).eq('id', item.id);
        }
      }
      setLastOrderId(order.id);
      setCart([]);
      setRedeemPoints(0);
      setSelectedCustomer(null);
      setShowMobileCart(false);
      setTimeout(() => window.print(), 500);
    }
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !session) return;
    
    const itemData = {
        user_id: session.user.id,
        name: newItem.name,
        price: parseFloat(newItem.price),
        stock: parseInt(newItem.stock),
    };

    if (editingItem) {
        await supabase.from('menu_items').update(itemData).eq('id', editingItem.id);
        setEditingItem(null);
    } else {
        await supabase.from('menu_items').insert([itemData]);
    }
    setNewItem({ name: '', price: '', stock: '' });
  };

  const handleUpdateStatus = async (id, status) => {
    await supabase.from('orders').update({ status }).eq('id', id);
  };

  const handleUpgrade = async (plan) => {
    if(confirm(`Upgrade to ${plan}?`)) {
       await supabase.from('settings').update({ plan }).eq('user_id', session.user.id);
       setSettings(prev => ({ ...prev, plan }));
    }
  };

  const handleSaveSettings = async () => {
      await supabase.from('settings').update(settings).eq('user_id', session.user.id);
      alert("Saved!");
  }

  // --- KDS Render Helper ---
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
                <span className="text-[10px] text-stone-400">{new Date(order.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
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
                  <button onClick={() => handleUpdateStatus(order.id, status === ORDER_STATUS.READY ? ORDER_STATUS.PREPARING : ORDER_STATUS.PENDING)} className="flex-1 py-1 bg-stone-100 hover:bg-stone-200 rounded text-xs font-medium">Back</button>
                )}
                <button 
                  onClick={() => handleUpdateStatus(order.id, status === ORDER_STATUS.PENDING ? ORDER_STATUS.PREPARING : status === ORDER_STATUS.PREPARING ? ORDER_STATUS.READY : ORDER_STATUS.SERVED)} 
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

  // --- Views ---

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center bg-stone-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
            <div className="flex justify-center mb-4"><div className="bg-orange-100 p-3 rounded-full text-orange-600"><Coffee size={32}/></div></div>
            <h1 className="text-2xl font-bold text-center mb-1">Chai Corner</h1>
            <p className="text-center text-stone-500 mb-6">{isLogin ? 'Login to your POS' : 'Create Account'}</p>
            <form onSubmit={handleAuth} className="space-y-4">
                <input className="w-full border p-3 rounded-lg" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
                <input className="w-full border p-3 rounded-lg" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
                <button className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold">{isLogin ? 'Login' : 'Sign Up'}</button>
            </form>
            <div className="mt-4 text-center text-sm">
                <button onClick={() => setIsLogin(!isLogin)} className="text-orange-600 font-medium hover:underline">
                    {isLogin ? 'Need an account? Sign Up' : 'Have an account? Login'}
                </button>
            </div>
        </div>
      </div>
    );
  }

  const themeColor = settings.theme; 
  const receiptData = salesHistory.find(o => o.id === lastOrderId);

  return (
    <div className="h-screen w-full bg-stone-50 text-stone-800 font-sans overflow-hidden flex flex-col">
       {/* Header */}
       <header className={`bg-${themeColor}-600 text-white p-3 flex justify-between items-center shadow-lg z-10 print:hidden`}>
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
             <button onClick={()=>supabase.auth.signOut()} className="p-2 hover:bg-red-500/50 rounded-full"><LogOut size={20}/></button>
         </div>
       </header>

       {/* Main Views */}
       {activeTab === 'pos' && (
         <main className="flex-1 flex overflow-hidden print:hidden">
             {/* Menu Grid */}
             <div className="flex-1 overflow-y-auto p-4">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {menu.map(item => (
                        <div key={item.id} onClick={() => addToCart(item)} className={`bg-white border rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm cursor-pointer active:scale-95 ${item.stock <= 0 ? 'opacity-50 grayscale' : ''}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${themeColor}-50 text-${themeColor}-600`}>{getItemIcon(item.name)}</div>
                            <div className="text-center">
                                <div className="font-bold text-sm">{item.name}</div>
                                <div className="text-xs text-stone-500 font-mono">{settings.currency}{item.price}</div>
                            </div>
                        </div>
                    ))}
                 </div>
             </div>
             {/* Cart */}
             <div className={`w-96 bg-white border-l flex flex-col ${showMobileCart ? 'fixed inset-0 z-50' : 'hidden md:flex'}`}>
                 <div className="p-4 flex-1 overflow-y-auto">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-stone-300">
                            <ShoppingCart size={48}/>
                            <p>Cart Empty</p>
                            {lastOrderId && <button onClick={()=> {setLastOrderId(lastOrderId); setTimeout(()=>window.print(), 200);}} className="mt-4 text-xs border px-3 py-1 rounded flex items-center gap-1 text-stone-500"><Printer size={12}/> Reprint Last</button>}
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex justify-between items-center border-b py-3">
                                <div>
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-xs text-stone-400">{settings.currency}{item.price} x {item.qty}</div>
                                </div>
                                <div className="flex items-center gap-2 bg-stone-100 rounded px-1">
                                    <button onClick={()=>updateCartQty(item.id, -1)} className="p-1"><Minus size={12}/></button>
                                    <span className="text-xs font-bold">{item.qty}</span>
                                    <button onClick={()=>updateCartQty(item.id, 1)} className="p-1"><Plus size={12}/></button>
                                </div>
                                <div className="text-sm font-bold">{settings.currency}{item.price * item.qty}</div>
                            </div>
                        ))
                    )}
                 </div>
                 <div className="p-4 border-t bg-stone-50">
                    <div className="flex justify-between text-xl font-bold mb-4"><span>Total</span><span>{settings.currency}{cartTotal}</span></div>
                    <button onClick={handleCheckout} disabled={cart.length===0} className={`w-full py-3 rounded-lg font-bold text-white shadow-lg ${cart.length===0 ? 'bg-stone-300' : `bg-${themeColor}-600`}`}>Checkout</button>
                 </div>
             </div>
         </main>
       )}

       {/* KDS View */}
       {activeTab === 'kds' && (
         <div className="flex-1 p-4 overflow-x-auto flex gap-4 bg-stone-100">
            {[ORDER_STATUS.PENDING, ORDER_STATUS.PREPARING, ORDER_STATUS.READY].map(status => (
                <div key={status} className="min-w-[300px] flex-1 bg-white rounded-xl shadow-sm flex flex-col border">
                    <div className="p-3 font-bold uppercase text-xs border-b bg-stone-50">{status}</div>
                    <div className="p-2 space-y-2 overflow-y-auto flex-1">
                        {activeOrders.filter(o => o.status === status).map(order => (
                            <div key={order.id} className="p-3 border rounded bg-stone-50">
                                <div className="flex justify-between font-bold text-sm mb-2"><span>#{order.id.slice(-4)}</span><span>{new Date(order.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span></div>
                                <div className="text-sm space-y-1 mb-3">{order.items.map((i, idx) => <div key={idx}>{i.qty}x {i.name}</div>)}</div>
                                <button onClick={() => handleUpdateStatus(order.id, status === ORDER_STATUS.PENDING ? ORDER_STATUS.PREPARING : status === ORDER_STATUS.PREPARING ? ORDER_STATUS.READY : ORDER_STATUS.SERVED)} className="w-full py-1 bg-blue-600 text-white rounded text-xs">Next</button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
         </div>
       )}

       {/* Sales History */}
       {activeTab === 'history' && (
          <div className="flex-1 p-4 overflow-y-auto bg-stone-50">
             {salesHistory.map(order => (
                 <div key={order.id} className="bg-white p-4 rounded-lg border mb-2 flex justify-between items-center">
                     <div>
                         <div className="font-bold">Order #{order.id}</div>
                         <div className="text-xs text-stone-500">{new Date(order.created_at).toLocaleString()}</div>
                     </div>
                     <div className="flex items-center gap-4">
                         <div className="font-bold text-green-600">{settings.currency}{order.total}</div>
                         <button onClick={() => {setLastOrderId(order.id); setTimeout(()=>window.print(), 200);}} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200"><Printer size={16}/></button>
                     </div>
                 </div>
             ))}
          </div>
       )}

       {/* Settings Modal */}
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
                      {editingItem && <button type="button" onClick={() => {setEditingItem(null); setNewItem({name:'',price:'',stock:''})}} className="col-span-4 text-xs text-red-500 underline">Cancel Edit</button>}
                  </form>
                  <div className="space-y-2">
                      {menu.map(item => (
                          <div key={item.id} className="flex justify-between items-center p-2 border rounded hover:bg-stone-50">
                              <span className="font-medium text-sm">{item.name}</span>
                              <div className="flex gap-3 items-center">
                                  <span className="text-xs font-mono bg-stone-100 px-2 rounded">Qty: {item.stock}</span>
                                  <button onClick={() => {setEditingItem(item); setNewItem({name:item.name, price:item.price, stock:item.stock})}}><Edit2 size={14} className="text-blue-500"/></button>
                                  <button onClick={() => supabase.from('menu_items').delete().eq('id', item.id)}><Trash2 size={14} className="text-red-500"/></button>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {settingsTab === 'general' && (
              <div className="space-y-4">
                  <div><label className="block text-xs font-bold text-stone-500">Store Name</label><input className="w-full border p-2 rounded" value={settings.store_name} onChange={e=>setSettings({...settings, store_name:e.target.value})} /></div>
                  <div><label className="block text-xs font-bold text-stone-500">Currency</label><input className="w-full border p-2 rounded" value={settings.currency} onChange={e=>setSettings({...settings, currency:e.target.value})} /></div>
                  <div>
                      <label className="block text-xs font-bold text-stone-500 mb-2">Theme</label>
                      <div className="flex gap-2">{Object.keys(COLORS).map(c => <button key={c} onClick={()=>setSettings({...settings, theme:c})} className={`w-8 h-8 rounded-full ${COLORS[c]} ${settings.theme===c ? 'ring-2 ring-offset-2 ring-black' : ''}`} />)}</div>
                  </div>
                  <button onClick={handleSaveSettings} className="w-full bg-black text-white py-2 rounded font-bold">Save Changes</button>
              </div>
          )}

          {settingsTab === 'subscription' && (
              <div className="space-y-3">
                  {PLAN_ORDER.map(plan => (
                      <div key={plan} className={`p-3 border rounded-xl flex justify-between items-center ${settings.plan === plan ? 'bg-green-50 border-green-500' : ''}`}>
                          <div>
                              <div className="font-bold">{plan}</div>
                              <div className="text-xs text-stone-500">₹{PLANS[plan].price}/mo</div>
                          </div>
                          {settings.plan === plan ? <CheckCircle size={20} className="text-green-600"/> : <button onClick={()=>handleUpgrade(plan)} className="text-xs bg-stone-900 text-white px-3 py-1 rounded">Upgrade</button>}
                      </div>
                  ))}
              </div>
          )}
       </Modal>

       {/* Thermal Receipt Hidden */}
       <div className="hidden print:block bg-white p-2 w-[300px] mx-auto text-black font-mono text-xs">
          {receiptData && (
              <>
                  <div className="text-center mb-4 font-bold text-xl">{settings.store_name}</div>
                  <div className="text-center mb-2">Order #{receiptData.id}</div>
                  <div className="border-y border-black border-dashed py-2">
                      {receiptData.items.map((i, idx) => (
                          <div key={idx} className="flex justify-between mb-1">
                              <span>{i.name} x{i.qty}</span>
                              <span>{i.price * i.qty}</span>
                          </div>
                      ))}
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-2"><span>Total</span><span>{receiptData.total}</span></div>
                  <div className="text-center mt-4">Thank you!</div>
              </>
          )}
       </div>

       <style>{`@media print { @page { margin: 0; } body { visibility: hidden; } .print\\:block, .print\\:block * { visibility: visible; } .print\\:block { position: absolute; left: 0; top: 0; width: 100%; } }`}</style>
    </div>
  );
}