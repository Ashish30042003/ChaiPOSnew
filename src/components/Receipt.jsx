import React from 'react';

const Receipt = ({ receiptData, storeSettings, locations }) => {
  if (!receiptData) return null;

  return (
    <div className="hidden print:block bg-white p-2 w-[300px] mx-auto text-black font-mono text-xs">
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold uppercase">{storeSettings.name}</h1>
        <p>Order #{receiptData.id.slice(-4)}</p>
        <p>{new Date(receiptData.date).toLocaleString()}</p>
      </div>
      <div className="border-y border-dashed border-black py-2 mb-2">
        {receiptData.items.map((item, idx) => (
          <div key={idx} className="flex mb-1">
            <span className="flex-1">{item.name}</span>
            <span className="w-8 text-center">{item.qty}</span>
            <span className="w-12 text-right">{item.price * item.qty}</span>
          </div>
        ))}
      </div>
      <div className="space-y-1 mb-2">
        <div className="flex justify-between"><span>Subtotal</span><span>{receiptData.subtotal}</span></div>
        {receiptData.discount > 0 && <div className="flex justify-between"><span>Points Red.</span><span>-{receiptData.discount}</span></div>}
        <div className="flex justify-between text-lg font-bold border-t border-black pt-1"><span>TOTAL</span><span>{receiptData.total}</span></div>
      </div>
      <div className="text-center mt-2 pt-2 border-t border-dashed border-black">
        {receiptData.customerId && (
          <div className="mb-2">
            <p>Customer: {receiptData.customerName}</p>
            {receiptData.pointsEarned > 0 && <p>Points Earned: {receiptData.pointsEarned}</p>}
          </div>
        )}
        <p>Thank you for visiting!</p>
      </div>
    </div>
  );
};

export default Receipt;
