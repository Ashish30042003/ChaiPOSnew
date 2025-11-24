import React, { useState } from 'react';
import { Settings, Save, Shield, Bell, Lock, Globe, Database } from 'lucide-react';

export default function SettingsView() {
    const [settings, setSettings] = useState({
        platformName: 'Chai Corner POS',
        maintenanceMode: false,
        allowNewRegistrations: true,
        emailNotifications: true,
        backupFrequency: 'daily',
        supportEmail: 'support@chaicorner.com'
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = () => {
        // In a real app, this would save to Firebase
        alert('Settings saved successfully!');
    };

    return (
        <div className="p-8 bg-stone-50 min-h-full">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
                        <Settings className="text-orange-600" />
                        Platform Settings
                    </h1>
                    <p className="text-stone-500">Manage global configurations</p>
                </div>
                <button
                    onClick={handleSave}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm"
                >
                    <Save size={18} />
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* General Settings */}
                <div className="lg:col-span-2 space-y-8">
                    <Section title="General Configuration" icon={<Globe size={20} />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Platform Name"
                                name="platformName"
                                value={settings.platformName}
                                onChange={handleChange}
                            />
                            <Input
                                label="Support Email"
                                name="supportEmail"
                                value={settings.supportEmail}
                                onChange={handleChange}
                            />
                        </div>
                    </Section>

                    <Section title="Security & Access" icon={<Lock size={20} />}>
                        <div className="space-y-4">
                            <Toggle
                                label="Maintenance Mode"
                                description="Disable access for all non-admin users. Use with caution."
                                name="maintenanceMode"
                                checked={settings.maintenanceMode}
                                onChange={handleChange}
                                danger
                            />
                            <div className="h-px bg-stone-100"></div>
                            <Toggle
                                label="Allow New Registrations"
                                description="If disabled, no new shops can sign up."
                                name="allowNewRegistrations"
                                checked={settings.allowNewRegistrations}
                                onChange={handleChange}
                            />
                        </div>
                    </Section>

                    <Section title="System & Data" icon={<Database size={20} />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">Backup Frequency</label>
                                <select
                                    name="backupFrequency"
                                    value={settings.backupFrequency}
                                    onChange={handleChange}
                                    className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                                >
                                    <option value="hourly">Hourly</option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                </select>
                            </div>
                        </div>
                    </Section>
                </div>

                {/* Sidebar / Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                        <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
                            <Shield size={18} className="text-blue-600" />
                            Admin Access
                        </h3>
                        <p className="text-sm text-stone-500 mb-4">
                            You are logged in as a Super Admin. You have full access to all system settings.
                        </p>
                        <div className="text-xs bg-stone-100 p-3 rounded text-stone-600 font-mono">
                            Session ID: {Math.random().toString(36).substr(2, 9)}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                        <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
                            <Bell size={18} className="text-orange-600" />
                            System Status
                        </h3>
                        <div className="space-y-3">
                            <StatusItem label="Database" status="Operational" color="green" />
                            <StatusItem label="API Gateway" status="Operational" color="green" />
                            <StatusItem label="Storage" status="Operational" color="green" />
                            <StatusItem label="Payments" status="Operational" color="green" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Section({ title, icon, children }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
            <h2 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2 pb-4 border-b border-stone-100">
                <span className="text-stone-400">{icon}</span>
                {title}
            </h2>
            {children}
        </div>
    );
}

function Input({ label, name, value, onChange }) {
    return (
        <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">{label}</label>
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
            />
        </div>
    );
}

function Toggle({ label, description, name, checked, onChange, danger }) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h4 className={`font-medium ${danger ? 'text-red-600' : 'text-stone-800'}`}>{label}</h4>
                <p className="text-sm text-stone-500">{description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    name={name}
                    checked={checked}
                    onChange={onChange}
                    className="sr-only peer"
                />
                <div className={`w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${danger ? 'peer-checked:bg-red-600' : 'peer-checked:bg-orange-600'}`}></div>
            </label>
        </div>
    );
}

function StatusItem({ label, status, color }) {
    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-stone-600">{label}</span>
            <span className={`flex items-center gap-1.5 font-medium text-${color}-600`}>
                <div className={`w-2 h-2 rounded-full bg-${color}-500`}></div>
                {status}
            </span>
        </div>
    );
}
