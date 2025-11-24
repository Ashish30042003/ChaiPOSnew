import React from 'react';

const Receipt = ({ receiptData, storeSettings, locations }) => {
  if (!receiptData) return null;

  return (
    <div className="hidden print:block bg-white p-2 w-[300px] mx-auto text-black font-mono text-xs relative overflow-hidden">
      {/* Watermark Logo */}
      {storeSettings.logo && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            opacity: 0.05,
            zIndex: 0
          }}
        >
          <img
            src={storeSettings.logo}
            alt="Watermark"
            className="max-w-[200px] max-h-[200px] object-contain"
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Header with Logo */}
        <div className="text-center mb-4">
          {storeSettings.logo && (
            <img
              src={storeSettings.logo}
              alt={storeSettings.name}
              className="w-16 h-16 mx-auto mb-2 object-contain"
            />
          )}
          <h1 className="text-xl font-bold uppercase">{storeSettings.name}</h1>
          {storeSettings.address && (
            <p className="text-xs mt-1">{storeSettings.address}</p>
          )}
          {storeSettings.phone && (
            <p className="text-xs">Tel: {storeSettings.phone}</p>
          )}
          <p className="mt-2">Order #{receiptData.id.slice(-4)}</p>
          <p>{new Date(receiptData.date).toLocaleString()}</p>
        </div>

        {/* Items */}
        <div className="border-y border-dashed border-black py-2 mb-2">
          {receiptData.items.map((item, idx) => (
            <div key={idx} className="flex mb-1">
              <span className="flex-1">{item.name}</span>
              <span className="w-8 text-center">{item.qty}</span>
              <span className="w-12 text-right">{item.price * item.qty}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-1 mb-2">
          <div className="flex justify-between"><span>Subtotal</span><span>{receiptData.subtotal}</span></div>
          {receiptData.discount > 0 && <div className="flex justify-between"><span>Points Red.</span><span>-{receiptData.discount}</span></div>}
          <div className="flex justify-between text-lg font-bold border-t border-black pt-1"><span>TOTAL</span><span>{receiptData.total}</span></div>
        </div>

        {/* Footer */}
        <div className="text-center mt-2 pt-2 border-t border-dashed border-black">
          {receiptData.customerId && (
            <div className="mb-2">
              <p>Customer: {receiptData.customerName}</p>
              {receiptData.pointsEarned > 0 && <p>Points Earned: {receiptData.pointsEarned}</p>}
            </div>
          )}
          <p>Thank you for visiting!</p>
          <p className="text-xs mt-1">Powered by ChaiPOS</p>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
