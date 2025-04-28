import React, { useState } from 'react';
import { X, Download, Search, ChevronDown, ArrowUpDown } from 'lucide-react';

type Transaction = {
  id: string;
  date: string;
  eventName: string;
  amount: number;
  status: 'completed' | 'refunded' | 'failed';
  customerName: string;
  paymentMethod: string;
  tickets: number;
};

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'TX-001',
    date: '2024-03-15T14:30:00',
    eventName: 'Zim Sables VS Zambia',
    amount: 150.00,
    status: 'completed',
    customerName: 'John Doe',
    paymentMethod: 'Card',
    tickets: 2
  },
  {
    id: 'TX-002',
    date: '2024-03-15T15:45:00',
    eventName: 'Mothers Day Conference',
    amount: 75.00,
    status: 'completed',
    customerName: 'Jane Smith',
    paymentMethod: 'Mobile',
    tickets: 1
  },
  {
    id: 'TX-003',
    date: '2024-03-14T11:20:00',
    eventName: 'Africa Day Golf Tournament',
    amount: 225.00,
    status: 'refunded',
    customerName: 'Mike Johnson',
    paymentMethod: 'Cash',
    tickets: 3
  }
];

type TransactionsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const TransactionsModal: React.FC<TransactionsModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortField, setSortField] = useState<keyof Transaction>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<Transaction['status'] | 'all'>('all');

  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredTransactions = MOCK_TRANSACTIONS
    .filter(tx => {
      const matchesSearch = 
        tx.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDateRange = 
        (!startDate || new Date(tx.date) >= new Date(startDate)) &&
        (!endDate || new Date(tx.date) <= new Date(endDate));
      
      const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
      
      return matchesSearch && matchesDateRange && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const direction = sortDirection === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * direction;
      }
      return ((aValue as number) - (bValue as number)) * direction;
    });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 backdrop-blur-sm z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl mx-auto text-gray-800">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Recent Transactions</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[240px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Transaction['status'] | 'all')}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-10"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="refunded">Refunded</option>
                <option value="failed">Failed</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export XLSX
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export PDF
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">
                    <button 
                      onClick={() => handleSort('id')}
                      className="flex items-center gap-2 text-sm font-medium text-gray-600"
                    >
                      Transaction ID
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4">
                    <button 
                      onClick={() => handleSort('date')}
                      className="flex items-center gap-2 text-sm font-medium text-gray-600"
                    >
                      Date & Time
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4">
                    <button 
                      onClick={() => handleSort('eventName')}
                      className="flex items-center gap-2 text-sm font-medium text-gray-600"
                    >
                      Event
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-left py-3 px-4">Payment Method</th>
                  <th className="text-right py-3 px-4">
                    <button 
                      onClick={() => handleSort('tickets')}
                      className="flex items-center gap-2 text-sm font-medium text-gray-600 ml-auto"
                    >
                      Tickets
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </th>
                  <th className="text-right py-3 px-4">
                    <button 
                      onClick={() => handleSort('amount')}
                      className="flex items-center gap-2 text-sm font-medium text-gray-600 ml-auto"
                    >
                      Amount
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4">
                    <button 
                      onClick={() => handleSort('status')}
                      className="flex items-center gap-2 text-sm font-medium text-gray-600"
                    >
                      Status
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-700">{tx.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {new Date(tx.date).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{tx.eventName}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{tx.customerName}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{tx.paymentMethod}</td>
                    <td className="py-3 px-4 text-sm text-gray-700 text-right">{tx.tickets}</td>
                    <td className="py-3 px-4 text-sm text-gray-700 text-right">${tx.amount.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`
                        inline-block px-2 py-1 rounded-full text-xs font-medium
                        ${tx.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                        ${tx.status === 'refunded' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${tx.status === 'failed' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsModal;