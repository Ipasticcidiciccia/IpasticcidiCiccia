import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard({ user }) {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersRes, menuRes] = await Promise.all([
          axios.get(`${API_URL}/orders`),
          axios.get(`${API_URL}/menu`)
        ]);
        setOrders(ordersRes.data);
        setMenuItems(menuRes.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${API_URL}/orders/${orderId}/status`, {
        status: newStatus
      });
      setOrders(orders.map(o =>
        o.id === orderId ? { ...o, status: newStatus } : o
      ));
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold">🔐 Accesso negato</h1>
          <p className="text-gray-600 mt-2">Devi essere loggato come admin per accedere a questa pagina</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'ready': 'bg-green-100 text-green-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const statusLabels = {
    'pending': '⏳ In Sospeso',
    'confirmed': '✅ Confermato',
    'ready': '🎉 Pronto',
    'completed': '✔️ Completato',
    'cancelled': '❌ Annullato'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">📊 Dashboard Admin</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-2 font-semibold border-b-2 transition-colors ${
            activeTab === 'orders'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          📦 Ordini ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`px-6 py-2 font-semibold border-b-2 transition-colors ${
            activeTab === 'menu'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          🍽️ Menù ({menuItems.length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">⏳ Caricamento...</div>
      ) : activeTab === 'orders' ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              Nessun ordine al momento
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">ID Ordine</th>
                    <th className="px-6 py-3 text-left font-semibold">Cliente</th>
                    <th className="px-6 py-3 text-left font-semibold">Totale</th>
                    <th className="px-6 py-3 text-left font-semibold">Data Ritiro</th>
                    <th className="px-6 py-3 text-left font-semibold">Stato</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order.id} className={`${index < orders.length - 1 ? 'border-b' : ''} hover:bg-gray-50`}>
                      <td className="px-6 py-3 font-mono text-sm">{order.id.slice(0, 8)}...</td>
                      <td className="px-6 py-3">{order.userId.slice(0, 8)}...</td>
                      <td className="px-6 py-3 font-bold text-orange-600">€{order.total.toFixed(2)}</td>
                      <td className="px-6 py-3">
                        {new Date(order.pickupDate).toLocaleString('it-IT')}
                      </td>
                      <td className="px-6 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className={`px-3 py-1 rounded-lg font-semibold border-0 focus:outline-none focus:ring-2 focus:ring-orange-600 ${getStatusColor(order.status)}`}
                        >
                          <option value="pending">⏳ In Sospeso</option>
                          <option value="confirmed">✅ Confermato</option>
                          <option value="ready">🎉 Pronto</option>
                          <option value="completed">✔️ Completato</option>
                          <option value="cancelled">❌ Annullato</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.length === 0 ? (
            <div className="col-span-3 text-center text-gray-600 py-12">
              Nessun prodotto nel menù
            </div>
          ) : (
            menuItems.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-4 h-10 overflow-hidden">{item.description}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-orange-600">€{item.price.toFixed(2)}</span>
                    <div className="text-xs text-gray-500 mt-1">{item.category}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    item.available
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.available ? '✅ Disponibile' : '⛔ Non disponibile'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
