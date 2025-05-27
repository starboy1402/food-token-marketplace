import React, { useState } from 'react';
import { Search, User, Calendar, MessageCircle, Facebook, XCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const halls = ['all', 'Hall 1', 'Hall 2', 'Hall 3', 'Hall 4', 'Hall 5'];

const initialListings = [
  {
    id: uuidv4(),
    seller: 'John Doe',
    hall: 'Hall 1',
    date: '2023-07-01',
    meal: 'lunch',
    price: 5,
    quantity: 2,
    whatsapp: '+1234567890',
    facebook: 'john.doe',
    status: 'active',
  },
  {
    id: uuidv4(),
    seller: 'Jane Smith',
    hall: 'Hall 2',
    date: '2023-07-02',
    meal: 'dinner',
    price: 6,
    quantity: 1,
    whatsapp: '+0987654321',
    facebook: 'https://facebook.com/jane.smith',
    status: 'active',
  },
];

const user = {
  name: 'Alice Johnson',
  hall: 'Hall 1',
  balance: 20,
};

function getFacebookLink(facebookInput) {
  if (!facebookInput) return null;
  if (facebookInput.startsWith('http://') || facebookInput.startsWith('https://')) {
    return facebookInput;
  }
  return `https://facebook.com/${facebookInput}`;
}

export default function App() {
  const [listings, setListings] = useState(initialListings);
  const [myListings, setMyListings] = useState(
    initialListings.filter((l) => l.seller === user.name)
  );
  const [transactions, setTransactions] = useState([]);
  const [tab, setTab] = useState('marketplace');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterHall, setFilterHall] = useState('all');
  const [filterMeal, setFilterMeal] = useState('all');

  // Filtered listings based on search and filters
  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.hall.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHall = filterHall === 'all' || listing.hall === filterHall;
    const matchesMeal = filterMeal === 'all' || listing.meal === filterMeal;
    return matchesSearch && matchesHall && matchesMeal && listing.status === 'active' && listing.quantity > 0;
  });

  const buyToken = (listing) => {
    const message = `Hi! I'm interested in buying your ${listing.meal} token for ${listing.date}. Price: $${listing.price}`;
    const whatsappNumber = listing.whatsapp.replace(/\D/g, '');
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    if (
      window.confirm(
        `Contact ${listing.seller}:\nWhatsApp: ${listing.whatsapp}\nFacebook: ${listing.facebook}\n\nClick OK to open WhatsApp.`
      )
    ) {
      window.open(whatsappLink, '_blank');

      // Update listings quantity and status
      setListings((prevListings) =>
        prevListings.map((item) => {
          if (item.id === listing.id) {
            const newQuantity = item.quantity - 1;
            return {
              ...item,
              quantity: newQuantity,
              status: newQuantity <= 0 ? 'sold out' : item.status,
            };
          }
          return item;
        })
      );

      // Optionally, add to transactions
      setTransactions((prev) => [
        ...prev,
        {
          id: uuidv4(),
          type: 'buy',
          listingId: listing.id,
          date: new Date().toISOString(),
          seller: listing.seller,
          buyer: user.name,
          price: listing.price,
          meal: listing.meal,
          quantity: 1,
        },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Food Token Marketplace</h1>
        <div className="flex items-center space-x-4">
          <User size={24} />
          <div>
            <p>{user.name}</p>
            <p className="text-sm text-gray-600">{user.hall}</p>
          </div>
          <div className="ml-4 font-semibold">${user.balance.toFixed(2)}</div>
          <MessageCircle size={24} />
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="flex space-x-4 mb-6">
        {['marketplace', 'sell', 'myListings', 'transactions'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded ${
              tab === t ? 'bg-blue-600 text-white' : 'bg-white border'
            }`}
          >
            {t === 'marketplace' && 'Marketplace'}
            {t === 'sell' && 'Sell'}
            {t === 'myListings' && 'My Listings'}
            {t === 'transactions' && 'Transactions'}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      {tab === 'marketplace' && (
        <MarketplaceTab
          listings={filteredListings}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterHall={filterHall}
          setFilterHall={setFilterHall}
          filterMeal={filterMeal}
          setFilterMeal={setFilterMeal}
          buyToken={buyToken}
        />
      )}

      {tab === 'sell' && (
        <CreateListingForm
          user={user}
          setListings={setListings}
          setMyListings={setMyListings}
        />
      )}

      {tab === 'myListings' && <MyListings listings={myListings} />}

      {tab === 'transactions' && <Transactions transactions={transactions} />}
    </div>
  );
}

function MarketplaceTab({
  listings,
  searchTerm,
  setSearchTerm,
  filterHall,
  setFilterHall,
  filterMeal,
  setFilterMeal,
  buyToken,
}) {
  return (
    <>
      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center border rounded px-2 py-1 bg-white flex-1 min-w-[200px]">
          <Search size={16} className="mr-2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by seller or hall"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="outline-none w-full"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')}>
              <XCircle size={16} className="text-gray-400" />
            </button>
          )}
        </div>

        <select
          value={filterHall}
          onChange={(e) => setFilterHall(e.target.value)}
          className="border rounded px-2 py-1 bg-white"
        >
          {halls.map((hall) => (
            <option key={hall} value={hall}>
              {hall === 'all' ? 'All Halls' : hall}
            </option>
          ))}
        </select>

        <select
          value={filterMeal}
          onChange={(e) => setFilterMeal(e.target.value)}
          className="border rounded px-2 py-1 bg-white"
        >
          <option value="all">All Meals</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
        </select>
      </div>

      {/* Listings Grid */}
      {listings.length === 0 ? (
        <p>No listings found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-white rounded shadow p-4 flex flex-col justify-between">
              <div>
                <p className="font-semibold">{listing.seller}</p>
                <p className="text-sm text-gray-600">{listing.hall}</p>
                <p className="text-sm">
                  <Calendar size={14} className="inline mr-1" />
                  {listing.date}
                </p>
                <p className="text-sm capitalize">{listing.meal}</p>
                <p className="text-lg font-bold">${listing.price.toFixed(2)}</p>
                <p className="text-sm">Quantity: {listing.quantity}</p>
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => buyToken(listing)}
                  className="flex-1 bg-green-600 text-white rounded py-2 hover:bg-green-700 transition"
                >
                  Buy
                </button>
                <a
                  href={`https://wa.me/${listing.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 text-white rounded py-2 flex items-center justify-center space-x-2 hover:bg-blue-700 transition"
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp</span>
                </a>
                {listing.facebook && (
                  <a
                    href={getFacebookLink(listing.facebook)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-800 text-white rounded py-2 flex items-center justify-center space-x-2 hover:bg-blue-900 transition"
                  >
                    <Facebook size={16} />
                    <span>Facebook</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function CreateListingForm({ user, setListings, setMyListings }) {
  const [formData, setFormData] = useState({
    date: '',
    meal: 'lunch',
    price: '',
    quantity: 1,
    whatsapp: '',
    facebook: '',
  });

  const handleSubmit = () => {
    if (!formData.date || !formData.price || !formData.whatsapp) {
      alert('Please fill in all required fields (Date, Price, and WhatsApp)');
      return;
    }
    if (parseFloat(formData.price) <= 0) {
      alert('Price must be greater than zero');
      return;
    }

    const newListing = {
      id: uuidv4(),
      seller: user.name,
      hall: user.hall,
      date: formData.date,
      meal: formData.meal,
      price: parseFloat(formData.price),
      quantity: formData.quantity,
      whatsapp: formData.whatsapp,
      facebook: formData.facebook,
      status: 'active',
    };

    setListings((prev) => [...prev, newListing]);
    setMyListings((prev) => [...prev, newListing]);

    setFormData({
      date: '',
      meal: 'lunch',
      price: '',
      quantity: 1,
      whatsapp: '',
      facebook: '',
    });

    alert('Listing created successfully!');
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create New Listing</h2>
      <label className="block mb-2">
        Date:
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
          className="border rounded px-2 py-1 w-full"
        />
      </label>
      <label className="block mb-2">
        Meal:
        <select
          value={formData.meal}
          onChange={(e) => setFormData((prev) => ({ ...prev, meal: e.target.value }))}
          className="border rounded px-2 py-1 w-full"
        >
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
        </select>
      </label>
      <label className="block mb-2">
        Price:
        <input
          type="number"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
          className="border rounded px-2 py-1 w-full"
        />
      </label>
      <label className="block mb-2">
        Quantity:
        <input
          type="number"
          min="1"
          value={formData.quantity}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            setFormData((prev) => ({ ...prev, quantity: val > 0 ? val : 1 }));
          }}
          className="border rounded px-2 py-1 w-full"
        />
      </label>
      <label className="block mb-2">
        WhatsApp Number:
        <input
          type="tel"
          placeholder="+1234567890"
          value={formData.whatsapp}
          onChange={(e) => setFormData((prev) => ({ ...prev, whatsapp: e.target.value }))}
          className="border rounded px-2 py-1 w-full"
        />
      </label>
      <label className="block mb-4">
        Facebook Profile (username or full URL):
        <input
          type="text"
          placeholder="john.doe or https://facebook.com/john.doe"
          value={formData.facebook}
          onChange={(e) => setFormData((prev) => ({ ...prev, facebook: e.target.value }))}
          className="border rounded px-2 py-1 w-full"
        />
      </label>
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
      >
        Create Listing
      </button>
    </div>
  );
}

function MyListings({ listings }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Listings</h2>
      {listings.length === 0 ? (
        <p>You have no active listings.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-white rounded shadow p-4">
              <p className="font-semibold">{listing.seller}</p>
              <p>{listing.hall}</p>
              <p>{listing.date}</p>
              <p className="capitalize">{listing.meal}</p>
              <p>${listing.price.toFixed(2)}</p>
              <p>Quantity: {listing.quantity}</p>
              <p>Status: {listing.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Transactions({ transactions }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Transactions</h2>
      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Type</th>
              <th className="border px-2 py-1">Seller</th>
              <th className="border px-2 py-1">Buyer</th>
              <th className="border px-2 py-1">Meal</th>
              <th className="border px-2 py-1">Price</th>
              <th className="border px-2 py-1">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td className="border px-2 py-1">{new Date(tx.date).toLocaleString()}</td>
                <td className="border px-2 py-1 capitalize">{tx.type}</td>
                <td className="border px-2 py-1">{tx.seller}</td>
                <td className="border px-2 py-1">{tx.buyer}</td>
                <td className="border px-2 py-1 capitalize">{tx.meal}</td>
                <td className="border px-2 py-1">${tx.price.toFixed(2)}</td>
                <td className="border px-2 py-1">{tx.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
