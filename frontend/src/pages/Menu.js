import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Menu({ addToCart }) {
  const [menuItems, setMenuItems] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API_URL}/menu`);
      setMenuItems(response.data);
    } catch (error) {
      setError('Errore nel caricamento del menù');
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'All',
    ...new Set(menuItems.map(item => item.category))
  ];

  const filteredItems = category === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">📋 Menù</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Category Filter */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-6 py-2 rounded-lg whitespace-nowrap font-semibold transition-colors ${
              category === cat
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {cat === 'All' ? '🌟 Tutti' : cat}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-xl text-gray-600">⏳ Caricamento menù...</div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-xl text-gray-600">Nessun prodotto disponibile in questa categoria</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-4 h-12 overflow-hidden">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-orange-600">
                    €{item.price.toFixed(2)}
                  </span>
                  {item.available ? (
                    <button
                      onClick={() => addToCart(item)}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                    >
                      Aggiungi 🛒
                    </button>
                  ) : (
                    <span className="text-gray-500 text-sm font-medium">⛔ Non disponibile</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Menu;
