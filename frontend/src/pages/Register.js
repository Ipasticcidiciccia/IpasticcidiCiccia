import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [error, setError] = useState('');
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
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/register`, formData);

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

      navigate('/');
    } catch (err) {
      setError('❌ ' + (err.response?.data?.message || 'Errore durante la registrazione'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">🎉 Registrati</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
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
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
              placeholder="Il tuo nome"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">📧 Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
              placeholder="tua@email.com"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">📱 Telefono</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
              placeholder="Il tuo numero"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">🔐 Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold disabled:opacity-50 transition-colors"
          >
            {loading ? '⏳ Registrazione...' : '✅ Registrati'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Hai già un account?{' '}
          <Link to="/login" className="text-orange-600 hover:text-orange-700 font-semibold">
            Login qui
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
