import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Checkout({ cart, user, setCart }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [pickupDate, setPickupDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('Devi essere loggato per effettuare un ordine');
      navigate('/login');
      return;
    }

    if (!pickupDate) {
      setError('⚠️ Seleziona una data e ora di ritiro');
      return;
    }

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      // Create order
      const orderResponse = await axios.post(`${API_URL}/orders`, {
        userId: user.id,
        items: cart,
        pickupDate,
        notes
      });

      const orderId = orderResponse.data.id;

      // Create payment intent
      const paymentResponse = await axios.post(`${API_URL}/payments/create-intent`, {
        amount: total,
        orderId: orderId,
        email: user.email
      });

      // Confirm payment
      const cardElement = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(
        paymentResponse.data.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: user.name,
              email: user.email
            }
          }
        }
      );

      if (result.error) {
        setError('❌ ' + result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        // Update order status
        await axios.put(`${API_URL}/orders/${orderId}/status`, {
          status: 'confirmed'
        });

        setSuccess(true);
        setCart([]);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      setError('❌ ' + (err.response?.data?.message || 'Errore durante il pagamento'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">💳 Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              ✅ Pagamento effettuato con successo! Reindirizzamento in corso...
            </div>
          )}

          {/* Pickup Date */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">📅 Data e Ora di Ritiro *</label>
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
            <label className="block text-sm font-semibold mb-2">📝 Note Aggiuntive</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Es. senza cipolla, allergie, preferenze..."
              rows="4"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
            />
          </div>

          {/* Card Details */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">💳 Dettagli Carta *</label>
            <div className="p-4 border rounded-lg focus-within:border-orange-600 focus-within:ring-1 focus-within:ring-orange-600">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Test card: 4242 4242 4242 4242</p>
          </div>

          <button
            type="submit"
            disabled={loading || !stripe}
            className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '⏳ Elaborazione...' : '✅ Completa Pagamento'}
          </button>
        </form>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-20">
          <h2 className="text-xl font-bold mb-6">📦 Riepilogo</h2>

          <div className="space-y-2 mb-6 max-h-96 overflow-y-auto border-b pb-4">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="flex-1">
                  {item.name} <strong>x{item.quantity}</strong>
                </span>
                <span className="font-semibold">€{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotale</span>
              <span className="font-semibold">€{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Consegna</span>
              <span className="font-semibold">€0.00</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg text-orange-600">
              <span>Totale da pagare</span>
              <span>€{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
