import React from 'react';
import { Palette, Shield, List, Trash2, CheckCircle, Edit2, RotateCcw } from 'lucide-react';
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
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" color={themeColor}>
      <div className="flex border-b border-stone-200 mb-4 overflow-x-auto">
        <button onClick={() => setSettingsTab('menu')} className={`flex-1 py-2 text-sm font-bold border-b-2 whitespace-nowrap ${settingsTab === 'menu' ? `border-${themeColor}-600 text-${themeColor}-600` : 'border-transparent text-stone-400'}`}>Menu</button>
        <button onClick={() => setSettingsTab('general')} className={`flex-1 py-2 text-sm font-bold border-b-2 whitespace-nowrap ${settingsTab === 'general' ? `border-${themeColor}-600 text-${themeColor}-600` : 'border-transparent text-stone-400'}`}>General</button>
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

      {settingsTab === 'subscription' && (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <div className="text-sm text-stone-500">Current Plan</div>
            <div className={`text-2xl font-bold text-${PLANS[currentPlan].color}-600`}>{currentPlan}</div>
          </div>
          <div className="space-y-3">
            {PLAN_ORDER.map(planName => {
              const plan = PLANS[planName];
              const isCurrent = currentPlan === planName;
              const isUpgrade = PLAN_ORDER.indexOf(planName) > PLAN_ORDER.indexOf(currentPlan);

              return (
                <div key={planName} className={`border rounded-xl p-3 ${isCurrent ? `border-${plan.color}-500 bg-${plan.color}-50 ring-1 ring-${plan.color}-500` : 'border-stone-200 bg-white'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className={`font-bold text-${plan.color}-700`}>{planName}</h4>
                      <div className="text-xs text-stone-500">{plan.features.length} Features</div>
                    </div>
                    <div className="font-bold text-stone-800">₹{plan.price}<span className="text-xs font-normal text-stone-400">/mo</span></div>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <button className="text-xs text-stone-400 underline">View Details</button>
                    {isCurrent ? (
                      <span className="text-xs font-bold text-green-600 flex items-center gap-1"><CheckCircle size={12} /> Active</span>
                    ) : (
                      <button
                        id={`upgrade-btn-${planName}`}
                        onClick={() => upgradePlan(planName)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold ${isUpgrade ? `bg-stone-900 text-white hover:bg-stone-700` : 'bg-stone-100 text-stone-400 cursor-not-allowed'}`}
                      >
                        {isUpgrade ? 'Upgrade' : 'Downgrade'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default SettingsModal;
