import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, ChevronLeft, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h2>
            <p className="text-gray-600 mb-8">
              ¿No sabes qué comprar? ¡Miles de productos te esperan!
            </p>
            <Link
              to="/catalogo"
              className="inline-flex items-center justify-center bg-blue-900 text-white px-6 py-3 rounded-md hover:bg-blue-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Continuar comprando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.productoId} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.nombre}</h3>
                      <p className="text-gray-600">
                        {(item.precio).toLocaleString('es-CO', {
                          style: 'currency',
                          currency: 'COP'
                        })}
                      </p>
                      
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => updateQuantity(item.productoId, item.cantidad - 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="mx-3">{item.cantidad}</span>
                        <button
                          onClick={() => updateQuantity(item.productoId, item.cantidad + 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {(item.precio * item.cantidad).toLocaleString('es-CO', {
                          style: 'currency',
                          currency: 'COP'
                        })}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.productoId)}
                        className="mt-2 text-red-600 hover:text-red-700 flex items-center"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen del pedido */}
            <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Resumen del pedido</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{getCartTotal().toLocaleString('es-CO', {
                    style: 'currency',
                    currency: 'COP'
                  })}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span>Calculado en el checkout</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>Total</span>
                    <span>{getCartTotal().toLocaleString('es-CO', {
                      style: 'currency',
                      currency: 'COP'
                    })}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">IVA incluido</p>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full bg-blue-900 text-white py-3 px-4 rounded-md hover:bg-blue-800 transition-colors flex items-center justify-center font-medium"
              >
                Proceder al pago
              </Link>

              <Link
                to="/catalogo"
                className="w-full mt-3 text-blue-900 hover:text-blue-800 py-3 px-4 rounded-md border border-blue-900 flex items-center justify-center font-medium"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;