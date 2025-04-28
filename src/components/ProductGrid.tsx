import React, { useState } from 'react';
import { Search, Plus, X } from 'lucide-react';
import SearchBar from './SearchBar';

type TicketType = {
  id: string;
  name: string;
  price: number;
  description: string;
};

type Event = {
  id: string;
  name: string;
  date: string;
  time: string;
  image: string;
  category: string;
  location: string;
  tickets: TicketType[];
};

const INITIAL_EVENTS: Event[] = [
  {
    id: '1',
    name: 'Zim Sables VS Zambia',
    date: '2025-05-04',
    time: '10:00',
    image: 'https://static.wixstatic.com/media/3015df_f4eef570a9c643a7912fef59ceaac768~mv2.jpeg/v1/fill/w_1104,h_1104,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/3015df_f4eef570a9c643a7912fef59ceaac768~mv2.jpeg',
    category: 'Music',
    location: 'Central Park',
    tickets: [
      { id: '1-1', name: 'General Admission', price: 5.00, description: 'Basic entry ticket' },
      { id: '1-2', name: 'VIP Access', price: 10.00, description: 'Includes meet & greet' },
     
    ]
  },
  {
    id: '2',
    name: 'Mothers Day Conference',
    date: '2024-09-20',
    time: '09:00',
    image: 'https://static.wixstatic.com/media/3015df_63d40c0fc9174e50862d3ce3ee5f9888~mv2.jpg/v1/fill/w_783,h_1104,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/3015df_63d40c0fc9174e50862d3ce3ee5f9888~mv2.jpgauto=format&fit=crop&w=200&h=200',
    category: 'Conference',
    location: 'Convention Center',
    tickets: [
      { id: '2-1', name: 'VIP Ticket', price: 50.00, description: 'VIP' },
     
    ]
  },
  {
    id: '3',
    name: 'Africa Day Golf Tournament & Dinner',
    date: '2024-08-10',
    time: '12:00',
    image: 'https://static.wixstatic.com/media/3015df_a4c9563a57b74775820f42fecae9f4f6~mv2.png/v1/fill/w_1104,h_1104,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/3015df_a4c9563a57b74775820f42fecae9f4f6~mv2.png?auto=format&fit=crop&w=200&h=200',
    category: 'Food',
    location: 'Riverfront Park',
    tickets: [
      { id: '3-1', name: 'Tasting Pass', price: 75.00, description: 'Includes 10 tasting tokens' },
      { id: '3-2', name: 'Premium Pass', price: 125.00, description: 'Unlimited tastings' }
    ]
  },
  {
    id: '4',
    name: 'Women In Waiting',
    date: '2024-06-30',
    time: '20:00',
    image: 'https://static.wixstatic.com/media/3015df_24a5657a35b04b7ea8db314b49bcc3cd~mv2.png/v1/fill/w_828,h_828,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/3015df_24a5657a35b04b7ea8db314b49bcc3cd~mv2.png',
    category: 'Entertainment',
    location: 'Laugh Factory',
    tickets: [
      { id: '4-1', name: 'Regular Seating', price: 25.00, description: 'Standard seating' },
      { id: '4-2', name: 'Front Row', price: 45.00, description: 'Premium front row seats' }
    ]
  },
   {
    id: '5',
    name: 'Chronicles Of Worship Homecoming LIVE Recording',
    date: '2024-06-30',
    time: '20:00',
    image: 'https://static.wixstatic.com/media/3015df_7dd70b467c2e4ea691e59f9292cb096a~mv2.png/v1/fill/w_1237,h_1104,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/3015df_7dd70b467c2e4ea691e59f9292cb096a~mv2.png',
    category: 'Entertainment',
    location: 'Laugh Factory',
    tickets: [
      { id: '5-1', name: 'Regular Seating', price: 25.00, description: 'Standard seating' },
      { id: '5-2', name: 'Front Row', price: 45.00, description: 'Premium front row seats' }
    ]
  },
   
];

type ProductGridProps = {
  onProductSelect: (ticket: TicketType & { eventName: string }) => void;
};

const ProductGrid: React.FC<ProductGridProps> = ({ onProductSelect }) => {
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    name: '',
    date: '',
    time: '',
    image: '',
    category: '',
    location: '',
    tickets: []
  });

  const categories = Array.from(new Set(events.map(e => e.category)));

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.name || !newEvent.date || !newEvent.category) return;

    const event: Event = {
      id: Date.now().toString(),
      name: newEvent.name,
      date: newEvent.date,
      time: newEvent.time || '00:00',
      image: newEvent.image || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=200&h=200',
      category: newEvent.category,
      location: newEvent.location || 'TBA',
      tickets: newEvent.tickets || []
    };

    setEvents(prev => [...prev, event]);
    setNewEvent({ name: '', date: '', time: '', image: '', category: '', location: '', tickets: [] });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-starbucks-green rounded-lg text-white hover:bg-starbucks-green-light transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Event
        </button>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`btn-category ${!selectedCategory ? 'active' : 'inactive'}`}
        >
          All Events
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`btn-category ${selectedCategory === category ? 'active' : 'inactive'}`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="product-card group"
          >
            <div className="relative">
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-32 object-cover rounded-lg mb-2"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 rounded-lg transition-colors" />
            </div>
            <h3 className="font-medium text-sm text-white/90">{event.name}</h3>
            <p className="text-xs text-white/60 mb-2">
              {new Date(event.date).toLocaleDateString()} at {event.time}
              <br />
              {event.location}
            </p>
            <div className="space-y-2">
              {event.tickets.map(ticket => (
                <button
                  key={ticket.id}
                  onClick={() => onProductSelect({ ...ticket, eventName: event.name })}
                  className="w-full bg-starbucks-brown/50 hover:bg-starbucks-brown p-2 rounded-lg text-left transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-white/90">{ticket.name}</span>
                    <span className="text-starbucks-gold font-medium">${ticket.price.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-white/60">{ticket.description}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-starbucks-green-dark p-6 rounded-xl shadow-xl max-w-md w-full border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Add New Event</h2>
              <button onClick={() => setShowAddForm(false)} className="text-white/60 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-1">Event Name</label>
                <input
                  type="text"
                  value={newEvent.name}
                  onChange={e => setNewEvent(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1">Date</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={e => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-white/60 mb-1">Time</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={e => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-white/60 mb-1">Category</label>
                <input
                  type="text"
                  value={newEvent.category}
                  onChange={e => setNewEvent(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-white/60 mb-1">Location</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={e => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-white/60 mb-1">Image URL (optional)</label>
                <input
                  type="url"
                  value={newEvent.image}
                  onChange={e => setNewEvent(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-starbucks-green hover:bg-starbucks-green-light text-white py-2 rounded-lg transition-colors"
              >
                Add Event
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;