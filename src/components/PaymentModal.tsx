import React, { useState } from 'react';
import { Check, Loader2, X, Printer } from 'lucide-react';
import TicketPreview from './TicketPreview';
import type { CartItem } from '../App';

type CustomerInfo = {
  name: string;
  email: string;
  phone: string;
};

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  paymentType: string;
  cart: CartItem[];
};

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, amount, paymentType, cart }) => {
  const [status, setStatus] = useState<'info' | 'processing' | 'success'>('info');
  const [showTicketPreview, setShowTicketPreview] = useState(false);
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('processing');
    
    setTimeout(() => {
      setStatus('success');
    }, 2000);
  };

  const handleClose = () => {
    setStatus('info');
    setCustomerInfo({ name: '', email: '', phone: '' });
    setCurrentTicketIndex(0);
    onClose();
  };

  const handleTicketPrintComplete = () => {
    if (currentTicketIndex < getTotalTickets() - 1) {
      setCurrentTicketIndex(prev => prev + 1);
    } else {
      setShowTicketPreview(false);
      handleClose();
    }
  };

  const getTotalTickets = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCurrentTicketData = () => {
    let ticketCount = 0;
    for (const item of cart) {
      for (let i = 0; i < item.quantity; i++) {
        if (ticketCount === currentTicketIndex) {
          return {
            eventName: item.eventName || '',
            ticketType: item.name,
            customerName: customerInfo.name,
            ticketId: `TIX-${Date.now()}-${currentTicketIndex + 1}`,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            location: 'Event Location',
            seatNumber: `SEAT-${String(i + 1).padStart(3, '0')}`,
            ticketNumber: `${currentTicketIndex + 1}/${getTotalTickets()}`
          };
        }
        ticketCount++;
      }
    }
    return null;
  };

  if (!isOpen) return null;

  const ticketData = getCurrentTicketData();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm z-50">
      <div className="bg-starbucks-brown p-8 rounded-xl shadow-xl max-w-md w-full border border-starbucks-green/20">
        {status === 'info' ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Customer Information</h2>
              <button 
                onClick={handleClose}
                className="text-white/60 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white"
                  placeholder="Enter customer name"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white"
                  placeholder="Enter phone number"
                />
              </div>

              <div className="mt-6 p-4 bg-white/5 rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/60">Total Tickets</span>
                  <span className="text-starbucks-gold font-medium">{getTotalTickets()}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/60">Amount</span>
                  <span className="text-starbucks-gold font-medium">${amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Payment Method</span>
                  <span className="text-white/90">{paymentType}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-starbucks-green hover:bg-starbucks-green-light text-white py-3 rounded-lg transition-colors mt-4"
              >
                Proceed to Payment
              </button>
            </form>
          </>
        ) : status === 'processing' ? (
          <>
            <Loader2 className="h-12 w-12 text-starbucks-green animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-center text-white">Processing Payment</h2>
            <p className="text-white/60 mb-4 text-center">Please wait while we process your payment...</p>
          </>
        ) : (
          <>
            <div className="h-12 w-12 rounded-full bg-starbucks-green mx-auto mb-4 flex items-center justify-center">
              <Check className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-center text-white">Payment Successful!</h2>
            <p className="text-white/60 text-center">Thank you for your purchase</p>
            
            <div className="mt-6 p-4 bg-white/5 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/60">Customer</span>
                <span className="text-white/90">{customerInfo.name}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/60">Total Tickets</span>
                <span className="text-starbucks-gold font-medium">{getTotalTickets()}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/60">Amount</span>
                <span className="text-starbucks-gold font-medium">${amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Payment Method</span>
                <span className="text-white/90">{paymentType}</span>
              </div>
            </div>

            <button
              onClick={() => setShowTicketPreview(true)}
              className="w-full bg-starbucks-green hover:bg-starbucks-green-light text-white py-3 rounded-lg transition-colors mt-6 flex items-center justify-center gap-2"
            >
              <Printer className="h-5 w-5" />
              Print Tickets
            </button>
          </>
        )}
      </div>

      {ticketData && (
        <TicketPreview
          isOpen={showTicketPreview}
          onClose={handleTicketPrintComplete}
          ticketData={ticketData}
        />
      )}
    </div>
  );
};

export default PaymentModal;