import React, { useState } from 'react';
import { ShoppingCart, Search, Clock, Menu } from 'lucide-react';
import Login from './components/Login';
import Footer from './components/Footer';
import Numpad from './components/Numpad';
import CartItems from './components/CartItems';
import ProductGrid from './components/ProductGrid';
import PaymentModal from './components/PaymentModal';
import TransactionsModal from './components/TransactionsModal';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  eventName?: string;
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeInput, setActiveInput] = useState<'quantity' | 'price' | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>('');

  const addToCart = (ticket: { id: string; name: string; price: number; eventName: string }) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === ticket.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === ticket.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...ticket, quantity: 1 }];
    });
  };

  const handleNumpadInput = (value: string) => {
    if (!activeInput) return;
    setInputValue(prev => {
      if (value === 'backspace') return prev.slice(0, -1);
      if (value === 'clear') return '';
      if (value === '.' && prev.includes('.')) return prev;
      return prev + value;
    });
  };

  const handlePayment = (paymentType: string) => {
    if (cart.length === 0) return;
    setSelectedPaymentType(paymentType);
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = () => {
    setShowPaymentModal(false);
    setCart([]);
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="h-screen flex flex-col bg-starbucks-brown-dark text-white">
      <header className="bg-starbucks-brown text-white p-3 flex items-center justify-between shrink-0 border-b border-starbucks-green/20">
        <div className="flex items-center space-x-3">
          <Menu className="h-6 w-6 text-starbucks-green" />
          <span className="text-xl font-semibold">Ticketbox Ticket Terminal</span>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => setShowTransactionsModal(true)}
            className="flex items-center gap-2 bg-starbucks-green px-4 py-2 rounded-lg hover:bg-starbucks-green-light transition-colors"
          >
            <Clock className="h-4 w-4" />
            <span className="font-medium">Recent</span>
          </button>
          <button
            onClick={handleLogout}
            className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 p-3 h-[calc(100vh-4rem)] overflow-hidden">
        <div className="md:col-span-7 bg-starbucks-brown/50 rounded-xl shadow-lg p-3 overflow-auto backdrop-blur-sm border border-starbucks-green/20">
          <ProductGrid onProductSelect={addToCart} />
        </div>

        <div className="md:col-span-5 flex flex-col gap-3 h-full">
          <div className="flex-1 bg-starbucks-brown/50 rounded-xl shadow-lg p-3 min-h-0 backdrop-blur-sm border border-starbucks-green/20">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2 text-starbucks-green" />
                Current Order
              </h2>
              <span className="text-sm text-starbucks-green/80">Tickets: {cart.length}</span>
            </div>
            
            <CartItems cart={cart} setCart={setCart} />

            <div className="border-t border-starbucks-green/20 mt-3 pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-starbucks-gold">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-starbucks-brown/50 rounded-xl shadow-lg p-4 backdrop-blur-sm border border-starbucks-green/20">
            <Numpad onInput={handleNumpadInput} onPayment={handlePayment} />
          </div>
        </div>
      </main>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handlePaymentComplete}
        amount={calculateTotal()}
        paymentType={selectedPaymentType}
        cart={cart}
      />

      <TransactionsModal
        isOpen={showTransactionsModal}
        onClose={() => setShowTransactionsModal(false)}
      />
      <Footer />
    </div>
  );
};

export default App;