import React from 'react';
import { Lock } from 'lucide-react';

const LoginView = ({ storeSettings, handleLogin, pinInput, setPinInput }) => {
  const themeColor = storeSettings.theme || 'orange';
  return (
    <div className={`h-screen w-full bg-${themeColor}-50 flex items-center justify-center flex-col p-4`}>
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center border border-stone-100">
        <div className={`w-16 h-16 bg-${themeColor}-100 text-${themeColor}-600 rounded-full flex items-center justify-center mx-auto mb-4`}>
          <Lock size={32} />
        </div>
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{storeSettings.name}</h1>
        <p className="text-stone-500 text-sm mb-6">POS System</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            inputMode="numeric"
            className={`w-full text-center text-2xl tracking-[0.5em] p-3 border rounded-lg focus:ring-2 focus:ring-${themeColor}-500 outline-none`}
            placeholder="••••"
            maxLength={4}
            value={pinInput}
            onChange={e => setPinInput(e.target.value)}
            autoFocus
          />
          <button className={`w-full py-3 text-lg rounded-lg font-bold text-white bg-${themeColor}-600 hover:bg-${themeColor}-700 transition-colors`}>
            Login
          </button>
        </form>
        <div className="mt-6 text-xs text-stone-400">Admin: 1234</div>
      </div>
    </div>
  );
};

export default LoginView;
