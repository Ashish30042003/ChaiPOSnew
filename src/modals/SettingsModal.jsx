import React, { useState } from 'react';
import { Palette, Shield, List, Trash2, CheckCircle, Edit2, RotateCcw, Gift, Settings } from 'lucide-react';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { COLORS, PLANS, PLAN_ORDER } from '../constants';
import { doc } from "firebase/firestore";

const SettingsModal = ({
  isOpen,
  onClose,
  themeColor,
  settingsTab,
  setSettingsTab,
  handleSaveItem,
  newItem,
  setNewItem,
  locationMenu,
  deleteDoc,
  db,
  appId,
  user,
  canAccess,
  storeSettings,
  setStoreSettings,
  saveSettings,
  currentPlan,
  upgradePlan,
  editingId,
  startEdit,
  cancelEdit
}) => {
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [couponCode, setCouponCode] = useState('');

  const handleUpgrade = (planName) => {
    upgradePlan(planName, couponCode);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" color={themeColor}>
      <div className="flex border-b border-stone-200 mb-4 overflow-x-auto">
        <button onClick={() => setSettingsTab('menu')} className={`flex-1 py-2 text-sm font-bold border-b-2 whitespace-nowrap ${settingsTab === 'menu' ? `border-${themeColor}-600 text-${themeColor}-600` : 'border-transparent text-stone-400'}`}>Menu</button>
        <button onClick={() => setSettingsTab('general')} className={`flex-1 py-2 text-sm font-bold border-b-2 whitespace-nowrap ${settingsTab === 'general' ? `border-${themeColor}-600 text-${themeColor}-600` : 'border-transparent text-stone-400'}`}>General</button>
        {canAccess('basic_branding') && <button onClick={() => setSettingsTab('branding')} className={`flex-1 py-2 text-sm font-bold border-b-2 whitespace-nowrap ${settingsTab === 'branding' ? `border-${themeColor}-600 text-${themeColor}-600` : 'border-transparent text-stone-400'}`}>Branding</button>}
        <button onClick={() => setSettingsTab('subscription')} className={`flex-1 py-2 text-sm font-bold border-b-2 whitespace-nowrap ${settingsTab === 'subscription' ? `border-${themeColor}-600 text-${themeColor}-600` : 'border-transparent text-stone-400'}`}>Subscription</button>
      </div>

      {settingsTab === 'menu' && (
        <div className="space-y-4">
          <h3 className="font-bold text-stone-800 flex items-center gap-2"><List size={18} /> Inventory Management</h3>
          <form onSubmit={handleSaveItem} className="grid grid-cols-4 gap-2 mb-2 p-3 bg-stone-50 rounded-lg border">
            <input className="col-span-2 border rounded px-2 py-1 text-sm" placeholder="Item Name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
            <input className="border rounded px-2 py-1 text-sm" type="number" placeholder="Price" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} />
            <input className="border rounded px-2 py-1 text-sm" type="number" placeholder="Stock" value={newItem.stock} onChange={e => setNewItem({ ...newItem, stock: e.target.value })} />
            {editingId ? (
              <div className="col-span-4 flex gap-2">
                <Button themeColor={themeColor} className="flex-1 py-1 text-sm">Update Item</Button>
                <button type="button" onClick={cancelEdit} className="px-3 py-1 text-sm bg-stone-200 hover:bg-stone-300 rounded font-medium text-stone-600 flex items-center gap-1"><RotateCcw size={14} /> Cancel</button>
              </div>
            ) : (
              <Button themeColor={themeColor} className="col-span-4 py-1 text-sm">Add to Menu</Button>
            )}
          </form>
          <div className="max-h-60 overflow-y-auto border rounded">
            {locationMenu.map(item => (
              <div key={item.id} className={`flex justify-between p-2 border-b text-sm items-center ${editingId === item.id ? 'bg-orange-50 border-l-4 border-orange-500' : 'hover:bg-stone-50'}`}>
                <span>{item.name}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-stone-500">{item.stock}</span>
                  <span className="font-mono text-xs">₹{item.price}</span>
                  <button onClick={() => startEdit(item)} className="text-blue-500 hover:text-blue-700"><Edit2 size={14} /></button>
                  <button onClick={() => deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'menu', item.id))} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
            {locationMenu.length === 0 && <div className="p-4 text-center text-sm text-stone-400">No items in menu</div>}
          </div>
        </div>
      )}

      {settingsTab === 'general' && (
        <div className="space-y-6">
          {canAccess('white_label') ? (
            <section>
              <h3 className="font-bold text-stone-800 mb-3 flex items-center gap-2"><Palette size={18} /> Branding</h3>
              <div className="bg-stone-50 p-4 rounded-xl border space-y-4">
                <div><label className="block text-xs font-bold text-stone-500 uppercase mb-1">Store Name</label><input className="w-full border rounded px-3 py-2 text-sm" value={storeSettings.name} onChange={e => setStoreSettings({ ...storeSettings, name: e.target.value })} /></div>
                <div><label className="block text-xs font-bold text-stone-500 uppercase mb-2">Accent Color</label><div className="flex gap-2">{Object.keys(COLORS).map(color => (<button key={color} onClick={() => setStoreSettings({ ...storeSettings, theme: color })} className={`w-8 h-8 rounded-full border-2 transition-all ${COLORS[color]} ${storeSettings.theme === color ? 'border-stone-800 scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`} />))}</div></div>
                <div><label className="block text-xs font-bold text-stone-500 uppercase mb-1">Currency Symbol</label><input className="w-16 border rounded px-3 py-2 text-sm text-center" value={storeSettings.currency} onChange={e => setStoreSettings({ ...storeSettings, currency: e.target.value })} /></div>
                <Button themeColor={themeColor} onClick={saveSettings} className="w-full">Save Branding</Button>
              </div>
            </section>
          ) : (
            <div className="p-4 bg-stone-100 rounded-lg text-center text-sm text-stone-500">Upgrade to Enterprise to customize branding.</div>
          )}

          {canAccess('staff') && (
            <section>
              <h3 className="font-bold text-stone-800 mb-3 flex items-center gap-2"><Shield size={18} /> Quick Access</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-3 bg-stone-100 rounded-lg text-sm font-medium hover:bg-stone-200">Manage Staff</button>
              </div>
            </section>
          )}
        </div>
      )}

      {settingsTab === 'branding' && canAccess('basic_branding') && (
        <div className="space-y-4">
          <h3 className="font-bold text-stone-800">Store Branding</h3>
          <div className="space-y-3">
            {/* Store Name - Available to ALL users */}
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Store Name</label>
              <input
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="My Tea Shop"
                value={storeSettings.name || ''}
                onChange={e => setStoreSettings({ ...storeSettings, name: e.target.value })}
              />
              <p className="text-xs text-stone-400 mt-1">This appears on receipts and throughout the app.</p>
            </div>

            {/* Advanced Branding - Only for paid users */}
            {canAccess('receipt_branding') ? (
              <>
                <div className="border-t pt-3 mt-3">
                  <p className="text-xs font-semibold text-stone-600 mb-3">Advanced Branding (Basic+ Plan)</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Store Logo</label>
                  <div className="flex flex-col gap-2">
                    {storeSettings.logo && (
                      <div className="relative w-fit">
                        <img src={storeSettings.logo} alt="Logo Preview" className="h-16 object-contain border rounded p-1" />
                        <button
                          onClick={() => setStoreSettings({ ...storeSettings, logo: '' })}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (file.size > 500000) {
                            alert("File is too large. Please upload an image under 500KB.");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setStoreSettings({ ...storeSettings, logo: reader.result });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200"
                    />
                  </div>
                  <p className="text-xs text-stone-400 mt-1">Upload an image (max 500KB). It will appear on receipts and as a watermark.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Address</label>
                  <textarea
                    className="w-full border rounded px-3 py-2 text-sm"
                    rows="2"
                    placeholder="123 Main Street, City"
                    value={storeSettings.address || ''}
                    onChange={e => setStoreSettings({ ...storeSettings, address: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Phone Number</label>
                  <input
                    className="w-full border rounded px-3 py-2 text-sm"
                    placeholder="+91 98765 43210"
                    value={storeSettings.phone || ''}
                    onChange={e => setStoreSettings({ ...storeSettings, phone: e.target.value })}
                  />
                </div>
              </>
            ) : (
              <div className="border-t pt-3 mt-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 font-medium mb-2">🎨 Want to add your logo and contact details?</p>
                  <p className="text-xs text-blue-600 mb-3">Upgrade to Basic plan or higher to customize your receipts with:</p>
                  <ul className="text-xs text-blue-600 space-y-1 mb-3 ml-4">
                    <li>• Store logo on receipts</li>
                    <li>• Address and phone number</li>
                    <li>• Professional watermark</li>
                  </ul>
                  <button
                    onClick={() => setSettingsTab('subscription')}
                    className="text-xs bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                  >
                    View Plans
                  </button>
                </div>
              </div>
            )}

            <Button themeColor={themeColor} onClick={saveSettings} className="w-full">Save Branding Settings</Button>
          </div>
        </div>
      )}

      {settingsTab === 'subscription' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Subscription Plans</h3>
            <div className="text-right">
              <div className="text-xs text-stone-500">Current Plan</div>
              <div className={`font-bold text-${themeColor}-600`}>{currentPlan}</div>
              {storeSettings.planExpiresAt && (
                <div className="text-[10px] text-stone-400">
                  Expires: {new Date(storeSettings.planExpiresAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          {/* Coupon Input */}
          <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 flex gap-2 items-center">
            <Gift size={18} className="text-stone-400" />
            <input
              type="text"
              placeholder="Have a coupon code?"
              className="bg-transparent outline-none text-sm flex-1 uppercase"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
          </div>

          <div className="grid gap-4">
            {['Basic', 'Pro', 'Enterprise'].map(planName => (
              <div key={planName} className={`border rounded-xl p-4 ${currentPlan === planName ? `border-${themeColor}-500 bg-${themeColor}-50` : 'border-stone-200'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold">{planName}</h4>
                    <div className="text-xs text-stone-500">
                      {planName === 'Basic' && 'For small stalls'}
                      {planName === 'Pro' && 'For growing shops'}
                      {planName === 'Enterprise' && 'For chains & franchises'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₹{planName === 'Basic' ? '299' : planName === 'Pro' ? '999' : '2999'}</div>
                    <div className="text-[10px] text-stone-400">/month</div>
                  </div>
                </div>

                <ul className="text-xs text-stone-600 space-y-1 mb-4">
                  {planName === 'Basic' && ['Basic POS', 'Daily Reports'].map(f => <li key={f}>• {f}</li>)}
                  {planName === 'Pro' && ['Everything in Basic', 'Inventory Tracking', 'Receipt Branding'].map(f => <li key={f}>• {f}</li>)}
                  {planName === 'Enterprise' && ['Everything in Pro', 'WhatsApp Receipts', 'Loyalty Program', 'KDS'].map(f => <li key={f}>• {f}</li>)}
                </ul>

                {currentPlan === planName ? (
                  <button disabled className="w-full bg-stone-200 text-stone-500 py-2 rounded-lg text-sm font-bold cursor-not-allowed">
                    Current Plan
                  </button>
                ) : (
                  <button
                    id={`upgrade-btn-${planName}`}
                    onClick={() => handleUpgrade(planName)}
                    className={`w-full bg-stone-900 text-white py-2 rounded-lg text-sm font-bold hover:bg-stone-800 transition-colors`}
                  >
                    Upgrade
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default SettingsModal;
