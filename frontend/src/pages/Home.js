import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            🍝 Benvenuto su IpasticcidiCiccia
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            I migliori prodotti alimentari da asporto della città. Ordina online e ritira quando preferisci!
          </p>
          <Link
            to="/menu"
            className="inline-block px-8 py-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-lg font-semibold transition-colors shadow-lg"
          >
            Guarda il Menù 👉
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Perché sceglierci?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-2xl font-semibold mb-2">Veloce</h3>
              <p className="text-gray-600">Prenota e ritira in pochi minuti. Zero attese!</p>
            </div>
            <div className="text-center p-8 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-6xl mb-4">🍎</div>
              <h3 className="text-2xl font-semibold mb-2">Fresco</h3>
              <p className="text-gray-600">Prodotti sempre freschi e di qualità premium</p>
            </div>
            <div className="text-center p-8 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-2xl font-semibold mb-2">Sicuro</h3>
              <p className="text-gray-600">Pagamenti sicuri e certificati con Stripe</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <p className="text-orange-100">Clienti Soddisfatti</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50+</div>
              <p className="text-orange-100">Prodotti Disponibili</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">24/7</div>
              <p className="text-orange-100">Ordini Online</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
