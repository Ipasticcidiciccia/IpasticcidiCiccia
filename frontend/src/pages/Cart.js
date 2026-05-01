import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Cart({ cart, removeFromCart, updateQuantity, user }) {
  const [loading, setLoading] = useState(false);
  const [pickupDate, setPickupDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('Devi essere loggato per effettuare un ordine');
      navigate('/login');
      return;
    }

    if (!pickupDate) {
      setError('📅 Seleziona una data e ora di ritiro');
      return;
    }

    setLoading(true);

    try {
      // Create order senza pagamento
      const orderResponse = await axios.post(`${API_URL}/orders`, {
        userId: user.id,
        items: cart,
        pickupDate,
        notes,
        status: 'confirmed' // Confermato subito senza pagamento
      });

      const orderId = orderResponse.data.id;

      // Redirect to confirmation page
      navigate(`/order-confirm/${orderId}`);
    } catch (err) {
      setError('❌ ' + (err.response?.data?.message || 'Errore durante la creazione dell\'ordine'));
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-3xl font-bold mb-4">Il tuo carrello è vuoto</h1>
          <p className="text-gray-600 mb-8">Aggiungi alcuni piatti dal menù!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">🛒 Il tuo Carrello</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
            {cart.map((item, index) => (
              <div
                key={item.id}
                className={`flex justify-between items-center p-6 ${index < cart.length - 1 ? 'border-b' : ''}`}
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">€{item.price.toFixed(2)} cad.</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      −
                    </button>
                    <span className="px-4 py-2 font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-lg font-semibold w-24 text-right">
                    €{(item.price * item.quantity).toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-800 font-semibold transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Form */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-20">
          <h2 className="text-xl font-bold mb-6">📝 Conferma Ordine</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleConfirmOrder}>
            {/* Pickup Date */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">📅 Data e Ora Ritiro *</label>
              <input
                type="datetime-local"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
              />
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">📝 Note (opzionale)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Es. senza cipolla, allergie..."
                rows="3"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
              />
            </div>

            {/* Total */}
            <div className="bg-orange-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between font-bold text-lg">
                <span>Totale</span>
                <span className="text-orange-600">€{total.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">💰 Pagamento alla ritira</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '⏳ Elaborazione...' : '✅ Conferma Ordine'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Cart;
