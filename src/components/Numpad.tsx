import React from 'react';
import { CreditCard, Wallet, Smartphone, Ticket } from 'lucide-react';

type NumpadProps = {
  onPayment: (type: string) => void;
};

const Numpad: React.FC<NumpadProps> = ({ onPayment }) => {
  const [selectedPayment, setSelectedPayment] = React.useState<string | null>(null);

  const handlePayment = (type: string) => {
    setSelectedPayment(type);
    onPayment(type);
  };

  const paymentOptions = [
    { type: 'Cash', icon: <Wallet className="h-6 w-6" />, color: 'bg-emerald-600' },
    { type: 'Card', icon: <CreditCard className="h-6 w-6" />, color: 'bg-blue-600' },
    { type: 'Mobile', icon: <Smartphone className="h-6 w-6" />, color: 'bg-purple-600' },
    { type: 'Coupon', icon: <Ticket className="h-6 w-6" />, color: 'bg-amber-600' }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {paymentOptions.map((payment) => (
        <button
          key={payment.type}
          onClick={() => handlePayment(payment.type)}
          className={`
            flex flex-col items-center justify-center gap-3
            p-6 rounded-xl text-white transition-all
            ${payment.color} hover:opacity-90
            ${selectedPayment === payment.type ? 'ring-2 ring-white scale-95' : 'scale-100'}
          `}
        >
          {payment.icon}
          <span className="text-lg font-semibold">{payment.type}</span>
        </button>
      ))}
    </div>
  );
};

export default Numpad;