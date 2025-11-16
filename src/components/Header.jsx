import React from 'react';
import {
  Coffee, MapPin, ShoppingCart, ChefHat, Users, History, Settings, LogOut
} from 'lucide-react';

const Header = ({
  storeSettings,
  currentPlan,
  canAccess,
  locations,
  currentLocationId,
  setCurrentLocationId,
  activeTab,
  setActiveTab,
  activeStaff,
  setActiveStaff,
  setCart
}) => {
  const themeColor = storeSettings.theme;

  return (
    <header className={`bg-${themeColor}-800 text-white p-3 flex justify-between items-center shadow-lg z-10 print:hidden transition-colors duration-500`}>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm"><Coffee size={20} /></div>
        <div>
          <h1 className="font-bold text-base leading-tight flex items-center gap-2">
            {storeSettings.name}
            <span className="bg-white/20 text-[10px] px-1.5 py-0.5 rounded font-medium tracking-wider uppercase">{currentPlan}</span>
          </h1>
          <div className="flex items-center gap-2 text-xs text-white/70 mt-0.5">
            <MapPin size={10} />
            {canAccess('multi_location') ? (
              <select className="bg-transparent border-none p-0 font-semibold text-white focus:ring-0 cursor-pointer text-xs" value={currentLocationId} onChange={(e) => setCurrentLocationId(e.target.value)}>
                {locations.map(loc => <option key={loc.id} value={loc.id} className="text-black">{loc.name}</option>)}
              </select>
            ) : (
              <span>{locations[0]?.name || 'Main Branch'}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <button onClick={() => setActiveTab('pos')} className={`p-2 rounded-full hover:bg-white/10 ${activeTab === 'pos' ? 'bg-white/20' : ''}`} title="POS"><ShoppingCart size={18} /></button>
        
        {canAccess('kds') && (
          <button onClick={() => setActiveTab('kds')} className={`p-2 rounded-full hover:bg-white/10 ${activeTab === 'kds' ? 'bg-white/20' : ''}`} title="Kitchen Display"><ChefHat size={18} /></button>
        )}
        
        {canAccess('customers') && (
          <button onClick={() => setActiveTab('customers')} className={`p-2 rounded-full hover:bg-white/10 ${activeTab === 'customers' ? 'bg-white/20' : ''}`} title="Customers"><Users size={18} /></button>
        )}
        
        <button onClick={() => setActiveTab('history')} className={`p-2 rounded-full hover:bg-white/10 ${activeTab === 'history' ? 'bg-white/20' : ''}`} title="History"><History size={18} /></button>
        
        {activeStaff.role === 'admin' && (
          <button onClick={() => setActiveTab('settings')} className={`p-2 rounded-full hover:bg-white/10 ${activeTab === 'settings' ? 'bg-white/20' : ''}`} title="Settings"><Settings size={18} /></button>
        )}
        <button onClick={() => { setActiveStaff(null); setCart([]); }} className="ml-2 bg-white/10 hover:bg-red-500/80 p-2 rounded-full transition-colors"><LogOut size={14} /></button>
      </div>
    </header>
  );
};

export default Header;
