// src/App.js
import React, { useState, useEffect } from 'react';
import { Search, Plus, User, Calendar, Clock, MapPin, DollarSign, Filter, Bell, MessageCircle, Facebook } from 'lucide-react';

const FoodTokenMarketplace = () => {
  const [user, setUser] = useState({ name: 'John Doe', hall: 'North Hall', balance: 150 });
  const [activeTab, setActiveTab] = useState('marketplace');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterHall, setFilterHall] = useState('all');
  const [filterMeal, setFilterMeal] = useState('all');

  // Sample data - in real app this would come from backend
  const [listings, setListings] = useState([
    { id: 1, seller: 'Alice Smith', hall: 'North Hall', date: '2025-05-28', meal: 'lunch', price: 15, quantity: 2, whatsapp: '+1234567890', facebook: 'alice.smith.123' },
    { id: 2, seller: 'Bob Johnson', hall: 'South Hall', date: '2025-05-28', meal: 'dinner', price: 18, quantity: 1, whatsapp: '+1234567891', facebook: 'bob.johnson.456' },
    { id: 3, seller: 'Carol Davis', hall: 'East Hall', date: '2025-05-29', meal: 'lunch', price: 14, quantity: 3, whatsapp: '+1234567892', facebook: 'carol.davis.789' },
    { id: 4, seller: 'David Wilson', hall: 'West Hall', date: '2025-05-29', meal: 'dinner', price: 17, quantity: 2, whatsapp: '+1234567893', facebook: 'david.wilson.012' },
    { id: 5, seller: 'Emma Brown', hall: 'North Hall', date: '2025-05-30', meal: 'lunch', price: 15, quantity: 1, whatsapp: '+1234567894', facebook: 'emma.brown.345' }
  ]);

  const [myListings, setMyListings] = useState([
    { id: 101, date: '2025-05-30', meal: 'dinner', price: 16, quantity: 1, status: 'active', whatsapp: '+1234567895', facebook: 'john.doe.678' }
  ]);

  const [transactions, setTransactions] = useState([
    { id: 201, type: 'buy', seller: 'Alice Smith', date: '2025-05-27', meal: 'lunch', price: 15, status: 'completed' },
    { id: 202, type: 'sell', buyer: 'Mike Chen', date: '2025-05-26', meal: 'dinner', price: 18, status: 'completed' }
  ]);

  const halls = ['North Hall', 'South Hall', 'East Hall', 'West Hall'];
  const meals = ['lunch', 'dinner'];

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.hall.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHall = filterHall === 'all' || listing.hall === filterHall;
    const matchesMeal = filterMeal === 'all' || listing.meal === filterMeal;
    return matchesSearch && matchesHall && matchesMeal;
  });

  const buyToken = (listing) => {
    // Show contact information and instructions
    const whatsappLink = `https://wa.me/${listing.whatsapp.replace(/\D/g, '')}?text=Hi! I'm interested in buying your ${listing.meal} token for ${listing.date}. Price: $${listing.price}`;
    const facebookLink = `https://facebook.com/${listing.facebook}`;
    
    const contactInfo = `Contact ${listing.seller}:
    
WhatsApp: ${listing.whatsapp}
Facebook: ${listing.facebook}

Click OK to open WhatsApp, or contact via Facebook to arrange the token transfer.`;
    
    if (window.confirm(contactInfo)) {
      window.open(whatsappLink, '_blank');
    }
  };

  

  const CreateListingForm = () => {
    const [formData, setFormData] = useState({
      date: '',
      meal: 'lunch',
      price: '',
      quantity: 1,
      whatsapp: '',
      facebook: ''
    });

    const handleSubmit = () => {
      if (!formData.date || !formData.price || !formData.whatsapp) {
        alert('Please fill in all required fields (Date, Price, and WhatsApp)');
        return;
      }
      const newListing = {
        id: Date.now(),
        seller: user.name,
        hall: user.hall,
        ...formData,
        price: parseFloat(formData.price)
      };
      setListings(prev => [...prev, newListing]);
      setMyListings(prev => [...prev, { ...newListing, status: 'active' }]);
      setFormData({ date: '', meal: 'lunch', price: '', quantity: 1, whatsapp: '', facebook: '' });
      alert('Listing created successfully!');
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Create New Listing</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Meal</label>
            <select
              value={formData.meal}
              onChange={(e) => setFormData(prev => ({ ...prev, meal: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number *</label>
            <input
              type="tel"
              placeholder="+1234567890"
              value={formData.whatsapp}
              onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Facebook Profile (Optional)</label>
            <input
              type="text"
              placeholder="your.profile.name or profile URL"
              value={formData.facebook}
              onChange={(e) => setFormData(prev => ({ ...prev, facebook: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Create Listing
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Food Token Marketplace</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="h-6 w-6 text-gray-400" />
              <div className="flex items-center space-x-2">
                <User className="h-6 w-6 text-gray-400" />
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-gray-500">{user.hall}</div>
                </div>
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Balance: ${user.balance}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {['marketplace', 'sell', 'my-listings', 'transactions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'marketplace' && (
          <div>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by seller or hall..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filterHall}
                  onChange={(e) => setFilterHall(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Halls</option>
                  {halls.map(hall => (
                    <option key={hall} value={hall}>{hall}</option>
                  ))}
                </select>
                <select
                  value={filterMeal}
                  onChange={(e) => setFilterMeal(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Meals</option>
                  {meals.map(meal => (
                    <option key={meal} value={meal}>{meal.charAt(0).toUpperCase() + meal.slice(1)}</option>
                  ))}
                </select>
                <button className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </button>
              </div>
            </div>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <div key={listing.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{listing.seller}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {listing.hall}
                      </div>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {listing.quantity} token{listing.quantity > 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(listing.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {listing.meal.charAt(0).toUpperCase() + listing.meal.slice(1)}
                    </div>
                    <div className="flex items-center text-lg font-bold text-green-600">
                      <DollarSign className="h-5 w-5 mr-1" />
                      {listing.price}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Contact Info</div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {listing.whatsapp}
                      </div>
                      {listing.facebook && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Facebook className="h-4 w-4 mr-2" />
                          Facebook
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => buyToken(listing)}
                    className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors flex items-center justify-center"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Seller
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sell' && <CreateListingForm />}

        {activeTab === 'my-listings' && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">My Listings</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {myListings.map((listing) => (
                <div key={listing.id} className="p-6 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900">
                      {listing.meal.charAt(0).toUpperCase() + listing.meal.slice(1)} - {new Date(listing.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      Price: ${listing.price} | Quantity: {listing.quantity}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      listing.status === 'active' ? 'bg-green-100 text-green-800' : 
                      listing.status === 'sold' ? 'bg-blue-100 text-blue-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {listing.status}
                    </span>
                    <button className="text-red-600 hover:text-red-800 text-sm">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="p-6 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900">
                      {transaction.type === 'buy' ? 'Purchased from' : 'Sold to'} {transaction.seller || transaction.buyer}
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.meal.charAt(0).toUpperCase() + transaction.meal.slice(1)} - {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">${transaction.price}</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FoodTokenMarketplace;


