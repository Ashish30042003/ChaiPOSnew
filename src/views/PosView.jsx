import React from 'react';
import { Plus, Minus, ShoppingCart, UserPlus, Gift, X, Users, Printer } from 'lucide-react';
import Button from '../components/Button';
import { getItemIcon } from '../utils/helpers';

const PosView = ({
  locationMenu,
  addToCart,
  cart,
  storeSettings,
  showMobileCart,
  setShowMobileCart,
  selectedCustomer,
  setSelectedCustomer,
  setRedeemPoints,
  redeemPoints,
  cartSubtotal,
  setActiveTab,
  updateCartQty,
  discountAmount,
  cartTotal,
  handleCheckout,
  canAccess,
  menu,
  lastOrderId,
  handleReprint
}) => {
  const themeColor = storeSettings.theme;

  return (
    <main className="flex-1 flex overflow-hidden print:hidden relative">
      {/* Menu */}
      <div className="flex-1 overflow-y-auto p-4 bg-stone-100/50">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-24 md:pb-4">
          {locationMenu.map((item) => (
            <div key={item.id} onClick={() => addToCart(item)} className={`relative overflow-hidden rounded-xl shadow-sm border transition-all cursor-pointer select-none bg-white ${item.stock === 0 ? 'opacity-60 grayscale' : `hover:border-${themeColor}-400 hover:shadow-md active:scale-95`}`}>
              <div className="p-4 flex flex-col items-center text-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.stock === 0 ? 'bg-stone-200' : `bg-${themeColor}-50 text-${themeColor}-600`}`}>{getItemIcon(item.name)}</div>
                <div className="flex-1"><h3 className="font-bold text-stone-800 text-sm leading-tight line-clamp-2">{item.name}</h3><div className={`text-${themeColor}-700 font-bold text-sm mt-1`}>{storeSettings.currency}{item.price}</div></div>
                <div className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${item.stock === 0 ? 'bg-red-100 text-red-600' : 'bg-stone-100 text-stone-600'}`}>{item.stock === 0 ? 'Sold Out' : `${item.stock} left`}</div>
              </div>
              {cart.find(c => c.id === item.id) && <div className={`absolute top-2 right-2 bg-${themeColor}-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm animate-bounce`}>{cart.find(c => c.id === item.id).qty}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:static md:bg-transparent md:w-[360px] md:border-l md:border-stone-200 md:flex md:flex-col bg-white ${showMobileCart ? 'opacity-100 visible' : 'opacity-0 invisible md:opacity-100 md:visible'}`}>
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl flex flex-col h-[85vh] md:h-full md:rounded-none md:relative">
          
          {/* Customer & Loyalty */}
          {canAccess('customers') ? (
            <div className="p-3 bg-white border-b space-y-2">
               {selectedCustomer ? (
                 <div className="flex flex-col gap-2 bg-stone-50 border border-stone-200 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                       <div className="flex items-center gap-2 text-stone-800 font-bold text-sm"><Users size={16} className={`text-${themeColor}-600`} />{selectedCustomer.name}</div>
                       <button onClick={() => {setSelectedCustomer(null); setRedeemPoints(0);}} className="text-stone-400 hover:text-red-500"><X size={16}/></button>
                    </div>
                    {canAccess('loyalty') && (
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-stone-500">Points: <span className="font-bold text-stone-800">{selectedCustomer.points || 0}</span></span>
                        {(selectedCustomer.points || 0) > 0 && (
                          redeemPoints === 0 ? (
                            <button onClick={() => setRedeemPoints(Math.min(selectedCustomer.points, Math.floor(cartSubtotal)))} className={`text-${themeColor}-600 font-bold hover:underline flex items-center gap-1`}><Gift size={12} /> Redeem</button>
                          ) : (
                            <button onClick={() => setRedeemPoints(0)} className="text-red-500 font-bold hover:underline">Remove</button>
                          )
                        )}
                      </div>
                    )}
                    {redeemPoints > 0 && <div className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">Redeeming {redeemPoints} points</div>}
                 </div>
               ) : (
                 <button onClick={() => setActiveTab('customers')} className="w-full py-3 border border-dashed border-stone-300 rounded-lg text-stone-500 hover:bg-stone-50 hover:border-stone-400 flex items-center justify-center gap-2 text-sm"><UserPlus size={16} /> Select Customer</button>
               )}
            </div>
          ) : (
             <div className="p-3 bg-stone-100 border-b text-center text-xs text-stone-400">Customer tracking available in Basic plan</div>
          )}

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-stone-300">
                <ShoppingCart size={48} className="mb-2 opacity-20" />
                <p className="text-sm mb-4">Start adding items</p>
                {lastOrderId && (
                    <button 
                      onClick={() => handleReprint(lastOrderId)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-600 text-xs font-bold transition-colors"
                    >
                      <Printer size={14} /> Reprint Last Order
                    </button>
                )}
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-stone-50 p-2 rounded-lg border border-stone-100">
                  <div className="flex-1"><div className="font-medium text-sm text-stone-800">{item.name}</div><div className="text-[10px] text-stone-500">{storeSettings.currency}{item.price} x {item.qty}</div></div>
                  <div className="flex items-center gap-2 bg-white rounded border px-1 py-0.5 shadow-sm">
                    <button onClick={() => updateCartQty(item.id, -1)} className="p-1 hover:bg-stone-100 rounded text-stone-500"><Minus size={12} /></button>
                    <span className="w-4 text-center text-xs font-bold">{item.qty}</span>
                    <button onClick={() => updateCartQty(item.id, 1, menu.find(m => m.id === item.id).stock)} className={`p-1 hover:bg-${themeColor}-50 text-${themeColor}-600 rounded`}><Plus size={12} /></button>
                  </div>
                  <div className="w-14 text-right font-bold text-sm text-stone-700">{storeSettings.currency}{item.price * item.qty}</div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-white border-t shadow-2xl space-y-3 z-10">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-stone-500"><span>Subtotal</span><span>{storeSettings.currency}{cartSubtotal}</span></div>
              {redeemPoints > 0 && <div className="flex justify-between text-green-600"><span>Loyalty Discount</span><span>-{storeSettings.currency}{discountAmount}</span></div>}
              <div className="flex justify-between text-xl font-bold text-stone-800 pt-2 border-t border-dashed border-stone-300"><span>Total</span><span>{storeSettings.currency}{cartTotal}</span></div>
            </div>
            <Button themeColor={themeColor} onClick={handleCheckout} disabled={cart.length === 0} className="w-full py-3 text-base shadow-lg">Checkout & Print</Button>
          </div>
        </div>
      </div>
      <div className="md:hidden fixed bottom-6 right-6 z-30 print:hidden"><button onClick={() => setShowMobileCart(true)} className={`relative bg-${themeColor}-700 text-white p-4 rounded-full shadow-xl active:scale-90 transition-transform`}><ShoppingCart size={24} />{cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">{cart.reduce((a, b) => a + b.qty, 0)}</span>}</button></div>
    </main>
  );
};

export default PosView;
