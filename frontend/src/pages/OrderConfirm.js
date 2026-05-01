import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function OrderConfirm({ setCart }) {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/orders/${orderId}`);
        setOrder(response.data);
        setCart([]); // Svuota il carrello
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, setCart]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">⏳ Caricamento...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">❌ Ordine non trovato</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Ordine Confermato!</h1>
          <p className="text-gray-600">Il tuo ordine è stato registrato con successo</p>
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">📦 Dettagli Ordine</h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Numero Ordine:</span>
              <span className="font-semibold font-mono">{order.id.slice(0, 12)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Data Ordine:</span>
              <span className="font-semibold">{new Date(order.createdAt).toLocaleString('it-IT')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Data Ritiro:</span>
              <span className="font-semibold">{new Date(order.pickupDate).toLocaleString('it-IT')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Stato:</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold text-sm">
                ✅ {order.status === 'confirmed' ? 'Confermato' : order.status}
              </span>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-bold mb-4">🛍️ Articoli Ordinati</h3>
            <div className="space-y-2">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>
                    {item.name} <strong>x{item.quantity}</strong>
                  </span>
                  <span>€{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t mt-6 pt-6">
            <div className="flex justify-between font-bold text-lg text-orange-600">
              <span>Totale da Pagare</span>
              <span>€{order.total?.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">💰 Pagamento in contanti al ritiro</p>
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="bg-blue-50 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-600"><strong>Note:</strong> {order.notes}</p>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h3 className="font-bold mb-3">📋 Cosa Fare Ora</h3>
          <ul className="space-y-2 text-sm">
            <li>✅ Ordine confermato e registrato nel sistema</li>
            <li>⏰ Presentati alla data e ora indicata per il ritiro</li>
            <li>💳 Porta i soldi per il pagamento in contanti</li>
            <li>🎉 Ritira il tuo ordine pronto!</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <Link
            to="/menu"
            className="flex-1 px-6 py-3 bg-orange-600 text-white text-center rounded-lg hover:bg-orange-700 font-semibold transition-colors"
          >
            Continua Shopping
          </Link>
          <Link
            to="/"
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 text-center rounded-lg hover:bg-gray-300 font-semibold transition-colors"
          >
            Torna alla Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirm;
