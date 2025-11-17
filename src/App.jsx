import React from 'react';
import { BrowserRouter, Routes, Route, Link, Outlet, useLocation } from 'react-router-dom';
import { Coffee, LayoutDashboard, Users, Settings, ExternalLink, History as HistoryIcon } from 'lucide-react';

// Import all our pages (Using capital 'P' in Pages to match your folder)
import Landing from './Pages/Landing';
import POS from './Pages/POS';
import Admin from './Pages/Admin';
import DashboardHome from './Pages/DashboardHome';
import DashboardOrders from './Pages/DashboardOrders';
import DashboardCustomers from './Pages/DashboardCustomers';

/**
 * This is the main Layout for the shop owner's dashboard.
 */
function DashboardLayout() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/app', icon: LayoutDashboard },
    { name: 'Orders', path: '/app/orders', icon: HistoryIcon }, // Fixed History bug
    { name: 'Customers', path: '/app/customers', icon: Users },
    { name: 'Settings', path: '/app/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <nav className="w-64 bg-white border-r border-slate-200 flex flex-col no-print">
        <div className="p-4 border-b border-slate-200">
          <h1 className="text-xl font-bold text-orange-600 flex items-center gap-2">
            <Coffee /> Chai Corner
          </h1>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 mx-4 rounded-lg font-medium text-sm
                  ${isActive 
                    ? 'bg-orange-50 text-orange-700' 
                    : 'text-slate-600 hover:bg-slate-100'}
                `}
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-200">
          <Link 
            to="/pos" 
            target="_blank"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            Go to POS <ExternalLink size={16} />
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet /> {/* Renders the child routes (Home, Orders, etc) */}
      </main>
    </div>
  );
}

/**
 * This is the main App Router
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        {/* Shop Owner Dashboard Routes */}
        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="orders" element={<DashboardOrders />} />
          <Route path="customers" element={<DashboardCustomers />} />
          <Route path="settings" element={<div>Settings Page</div>} /> 
        </Route>

        {/* Fullscreen POS (Ordering Screen) */}
        <Route path="/pos" element={<POS />} /> 

        {/* SaaS Admin (Your Dashboard) */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;