import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [listings, setListings] = useState([
    {
      id: 1,
      seller: 'Ali',
      hall: 'North Hall',
      meal: 'lunch',
      date: '2024-05-28',
      price: 300,
      whatsapp: '03001234567',
      facebook: 'https://fb.com/ali.profile',
    },
    {
      id: 2,
      seller: 'Ahmed',
      hall: 'South Hall',
      meal: 'dinner',
      date: '2024-05-28',
      price: 250,
      whatsapp: '03009876543',
    },
  ]);
  const [myListings, setMyListings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [filterHall, setFilterHall] = useState('');
  const [filterMeal, setFilterMeal] = useState('');

  const handleListingSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const newListing = {
      id: listings.length + 1,
      seller: 'You',
      hall: form.hall.value,
      meal: form.meal.value,
      date: form.date.value,
      price: parseInt(form.price.value),
      whatsapp: form.whatsapp.value,
      facebook: form.facebook.value || '',
      status: 'active',
    };
    setListings([...listings, newListing]);
    setMyListings([...myListings, newListing]);
    form.reset();
    setActiveTab('marketplace');
  };

  const filteredListings = listings.filter((listing) =>
    (listing.seller.toLowerCase().includes(search.toLowerCase()) ||
     listing.hall.toLowerCase().includes(search.toLowerCase())) &&
    (!filterHall || listing.hall === filterHall) &&
    (!filterMeal || listing.meal === filterMeal)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <nav className="mb-6">
          <ul className="flex justify-around bg-white p-2 rounded shadow">
            <li>
              <button onClick={() => setActiveTab('marketplace')} className={`px-4 py-2 rounded ${activeTab === 'marketplace' ? 'bg-blue-500 text-white' : 'text-blue-500'}`}>
                Marketplace
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('sell')} className={`px-4 py-2 rounded ${activeTab === 'sell' ? 'bg-blue-500 text-white' : 'text-blue-500'}`}>
                Sell
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('myListings')} className={`px-4 py-2 rounded ${activeTab === 'myListings' ? 'bg-blue-500 text-white' : 'text-blue-500'}`}>
                My Listings
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('transactions')} className={`px-4 py-2 rounded ${activeTab === 'transactions' ? 'bg-blue-500 text-white' : 'text-blue-500'}`}>
                Transactions
              </button>
            </li>
          </ul>
        </nav>

        {activeTab === 'marketplace' && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Food Token Listings</h2>
              <div className="mt-4 flex flex-wrap gap-4">
                <input
                  type="text"
                  placeholder="Search by seller or hall"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border border-gray-300 p-2 rounded"
                />
                <select onChange={(e) => setFilterHall(e.target.value)} className="border border-gray-300 p-2 rounded">
                  <option value="">All Halls</option>
                  <option value="North Hall">North Hall</option>
                  <option value="South Hall">South Hall</option>
                  <option value="East Hall">East Hall</option>
                </select>
                <select onChange={(e) => setFilterMeal(e.target.value)} className="border border-gray-300 p-2 rounded">
                  <option value="">All Meals</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                </select>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredListings.map((listing) => (
                <div key={listing.id} className="p-6 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900">{listing.seller}</div>
                    <div className="text-sm text-gray-500">{listing.hall} - {listing.meal} on {new Date(listing.date).toLocaleDateString()}</div>
                    <div className="text-sm font-semibold mt-1 text-green-600">${listing.price}</div>
                  </div>
                  <div className="flex flex-col gap-2 text-sm">
                    <a href={`https://wa.me/${listing.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-white bg-green-500 px-3 py-1 rounded hover:bg-green-600">Contact Seller</a>
                    {listing.facebook && (
                      <a href={listing.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-center">Facebook</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sell' && (
          <form onSubmit={handleListingSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create a Listing</h2>
            <div className="flex gap-4">
              <input type="date" name="date" className="border border-gray-300 p-2 rounded w-1/2" required />
              <select name="hall" className="border border-gray-300 p-2 rounded w-1/2" required>
                <option value="">Select Hall</option>
                <option value="North Hall">North Hall</option>
                <option value="South Hall">South Hall</option>
                <option value="East Hall">East Hall</option>
              </select>
            </div>
            <div className="flex gap-4">
              <select name="meal" className="border border-gray-300 p-2 rounded w-1/2" required>
                <option value="">Meal Type</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
              <input type="number" name="price" placeholder="Price" className="border border-gray-300 p-2 rounded w-1/2" required />
            </div>
            <input type="text" name="whatsapp" placeholder="WhatsApp Number" className="border border-gray-300 p-2 rounded w-full" required />
            <input type="text" name="facebook" placeholder="Facebook Link (optional)" className="border border-gray-300 p-2 rounded w-full" />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Post Listing</button>
          </form>
        )}

        {activeTab === 'myListings' && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">My Listings</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {myListings.map((listing) => (
                <div key={listing.id} className="p-6 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900">{listing.meal} - {new Date(listing.date).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-500">{listing.hall} - ${listing.price}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    listing.status === 'active' ? 'bg-green-100 text-green-800' :
                    listing.status === 'sold' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {listing.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">My Transactions</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-6 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900">
                      {tx.type === 'buy' ? `Bought from ${tx.seller}` : `Sold to ${tx.buyer}`}
                    </div>
                    <div className="text-sm text-gray-500">
                      {tx.meal.charAt(0).toUpperCase() + tx.meal.slice(1)} on {new Date(tx.date).toLocaleDateString()} – ${tx.price}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tx.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
