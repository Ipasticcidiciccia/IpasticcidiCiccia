import React from 'react';
import { Link } from 'react-router-dom';

function Cart({ cart, removeFromCart, updateQuantity }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-3xl font-bold mb-4">Il tuo carrello è vuoto</h1>
          <p className="text-gray-600 mb-8">Aggiungi alcuni piatti dal menù!</p>
          <Link to="/menu" className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold transition-colors">
            Continua lo shopping 👉
          </Link>
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

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-20">
          <h2 className="text-xl font-bold mb-6">💰 Riepilogo Ordine</h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotale</span>
              <span className="font-semibold">€{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Consegna</span>
              <span className="font-semibold">€0.00</span>
            </div>
            <div className="border-t pt-4 flex justify-between font-bold text-lg">
              <span>Totale</span>
              <span className="text-orange-600">€{total.toFixed(2)}</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="block w-full px-6 py-3 bg-orange-600 text-white text-center rounded-lg hover:bg-orange-700 font-semibold transition-colors"
          >
            Procedi al Pagamento ✅
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
