import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';

const OfflineIndicator = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showReconnected, setShowReconnected] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setShowReconnected(true);
            // Hide reconnected message after 3 seconds
            setTimeout(() => setShowReconnected(false), 3000);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShowReconnected(false);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (isOnline && !showReconnected) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-50 animate-slide-down">
            {!isOnline ? (
                <div className="bg-amber-500 text-white px-4 py-3 shadow-lg">
                    <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
                        <WifiOff className="w-5 h-5" />
                        <span className="font-medium">You're offline. Changes will sync when reconnected.</span>
                    </div>
                </div>
            ) : showReconnected ? (
                <div className="bg-green-500 text-white px-4 py-3 shadow-lg">
                    <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
                        <Wifi className="w-5 h-5" />
                        <span className="font-medium">Back online! Syncing data...</span>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default OfflineIndicator;
