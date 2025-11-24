import React, { useState } from 'react';
import {
  Coffee, MapPin, ShoppingCart, ChefHat, Users, History, Settings, LogOut, BarChart3, LayoutDashboard, Shield, TrendingUp
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

const Header = ({
  user,
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
  setCart,
  analyticsData,
  setSettingsTab
}) => {
  const themeColor = storeSettings.theme || 'orange';

  // Helper for navigation buttons
  const NavButton = ({ active, onClick, icon, label, locked, className }) => (
    <button
      onClick={locked ? null : onClick}
      className={`
        relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all
        ${active ? 'bg-white/20 text-white shadow-sm' : 'text-white/70 hover:bg-white/10 hover:text-white'}
        ${locked ? 'opacity-50 cursor-not-allowed' : ''}
        ${className || ''}
      `}
      title={label}
    >
      {icon}
      <span className="hidden lg:block text-sm font-medium">{label}</span>
      {locked && <div className="absolute -top-1 -right-1"><Shield size={10} className="text-stone-400" /></div>}
    </button>
  );

  return (
    <header className={`bg-${themeColor}-800 text-white p-3 flex justify-between items-center shadow-lg z-10 print:hidden transition-colors duration-500`}>
      {/* Left: Brand & Location */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm"><Coffee size={20} /></div>
        <div>
          <h1 className="font-bold text-base leading-tight flex items-center gap-2">
            {storeSettings.name}
            <span className="bg-white/20 text-[10px] px-1.5 py-0.5 rounded font-medium tracking-wider uppercase">{currentPlan}</span>
              <span className="text-[10px] font-bold text-white bg-red-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Shield size={10} /> Admin
              </span>
            )}
          </h1>
          <div className="flex items-center gap-3 text-xs text-white/70 mt-0.5">
            <div className="flex items-center gap-1">
              <MapPin size={10} />
              {canAccess('multi_location') ? (
                <select className="bg-transparent border-none p-0 font-semibold text-white focus:ring-0 cursor-pointer text-xs" value={currentLocationId} onChange={(e) => setCurrentLocationId(e.target.value)}>
                  {locations.map(loc => <option key={loc.id} value={loc.id} className="text-black">{loc.name}</option>)}
                </select>
              ) : (
                <span>{locations[0]?.name || 'Main Branch'}</span>
              )}
            </div>
            <div className="h-3 w-px bg-white/20"></div>
            <div className="font-mono font-bold text-white/90" title="Today's Collection">Today: {storeSettings.currency}{analyticsData?.todaySales?.toLocaleString() || 0}</div>
          </div>
        </div>
      </div>

      {/* Center: Navigation */}
      <div className="flex items-center gap-1 md:gap-2">
        {/* Upgrade Button for Free Plan */}
        {currentPlan === 'Free' && (
          <button
            onClick={() => {
              setSettingsTab('subscription');
              setActiveTab('settings');
            }}
            className="hidden md:block bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg hover:scale-105 transition-transform animate-pulse mr-2"
          >
            Upgrade Now
          </button>
        )}

        <button onClick={() => setActiveTab('dashboard')} className={`p-2 rounded-full hover:bg-white/10 ${activeTab === 'dashboard' ? 'bg-white/20' : ''}`} title="Dashboard"><LayoutDashboard size={18} /></button>
        <button onClick={() => setActiveTab('pos')} className={`p-2 rounded-full hover:bg-white/10 ${activeTab === 'pos' ? 'bg-white/20' : ''}`} title="POS"><ShoppingCart size={18} /></button>

        {canAccess('kds') && (
          <button onClick={() => setActiveTab('kds')} className={`p-2 rounded-full hover:bg-white/10 ${activeTab === 'kds' ? 'bg-white/20' : ''}`} title="Kitchen Display"><ChefHat size={18} /></button>
        )}

        {canAccess('customers') && (
          <button onClick={() => setActiveTab('customers')} className={`p-2 rounded-full hover:bg-white/10 ${activeTab === 'customers' ? 'bg-white/20' : ''}`} title="Customers"><Users size={18} /></button>
        )}

        {canAccess('analytics') && (
          <button onClick={() => setActiveTab('analytics')} className={`p-2 rounded-full hover:bg-white/10 ${activeTab === 'analytics' ? 'bg-white/20' : ''}`} title="Analytics"><BarChart3 size={18} /></button>
        )}

        <button onClick={() => setActiveTab('history')} className={`p-2 rounded-full hover:bg-white/10 ${activeTab === 'history' ? 'bg-white/20' : ''}`} title="History"><History size={18} /></button>

        <button onClick={() => setActiveTab('settings')} className={`p-2 rounded-full hover:bg-white/10 ${activeTab === 'settings' ? 'bg-white/20' : ''}`} title="Settings"><Settings size={18} /></button>

          <button
          >
            <Shield size={18} />
          </button>
        )}

        <button
          onClick={() => {
            if (confirm("Are you sure you want to log out?")) {
              signOut(auth);
            }
          }}
          className="ml-2 bg-white/10 hover:bg-red-500/80 p-2 rounded-full transition-colors"
          title="Log Out"
        >
          <LogOut size={14} />
        </button>
      </div>
    </header>
  );
};

export default Header;
