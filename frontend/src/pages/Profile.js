import React, { useState } from 'react';
import axios from 'axios';

function Profile({ user, setUser }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.put(`${API_URL}/users/${user.id}`, formData);
      const updatedUser = { ...user, ...response.data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setMessage('✅ Profilo aggiornato con successo');
    } catch (error) {
      setMessage('❌ Errore durante l\'aggiornamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">👤 Il mio Profilo</h1>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('✅')
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">👤 Nome</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-600"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">📧 Email (non modificabile)</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2 border bg-gray-100 rounded-lg cursor-not-allowed text-gray-600"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">📱 Telefono</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-600"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">🏠 Indirizzo</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-600"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">🌆 Città</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold disabled:opacity-50 transition-colors"
          >
            {loading ? '⏳ Aggiornamento...' : '✅ Aggiorna Profilo'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
