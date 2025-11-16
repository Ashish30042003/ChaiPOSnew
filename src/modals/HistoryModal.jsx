import React from 'react';
import { MessageCircle, Printer } from 'lucide-react';
import Modal from '../components/Modal';

const HistoryModal = ({
  isOpen,
  onClose,
  themeColor,
  salesHistory,
  storeSettings,
  lastOrderId,
  canAccess,
  sendWhatsAppReceipt,
  handleReprint
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sales History" color={themeColor}>
      {salesHistory.map(order => (
        <div key={order.id} className="border-b py-2">
          <div className="flex justify-between text-sm font-medium">
            <span>#{order.id.slice(-4)}</span>
            <span>{storeSettings.currency}{order.total}</span>
          </div>
          <div className="text-xs text-stone-500">
            {new Date(order.date).toLocaleString()} • {order.customerName}
          </div>
          <div className="flex justify-end mt-2 gap-2">
            {canAccess('whatsapp') && (
              <button onClick={() => sendWhatsAppReceipt(order)} className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200">
                <MessageCircle size={12} /> WhatsApp
              </button>
            )}
            <button onClick={() => handleReprint(order.id)} className="flex items-center gap-1 text-xs bg-stone-100 text-stone-700 px-2 py-1 rounded hover:bg-stone-200">
              <Printer size={12} /> Print
            </button>
          </div>
        </div>
      ))}
    </Modal>
  );
};

export default HistoryModal;
