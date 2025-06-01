import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Truck, MapPin, ChevronRight } from 'lucide-react';

interface Address {
  id: number;
  calle: string;
  ciudad: string;
  codigo_postal: string;
  provincia: string;
  pais: string;
  nombre_receptor: string;
  telefono: string;
}

interface PaymentMethod {
  id: string;
  tipo: 'tarjeta' | 'paypal';
  datos: {
    numero?: string;
    nombre?: string;
    email?: string;
  };
}

const CheckoutPage: React.FC = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Datos de ejemplo - En producción vendrían de la API
  const addresses: Address[] = [
    {
      id: 1,
      calle: "Calle 123 #45-67",
      ciudad: "Bogotá",
      codigo_postal: "110111",
      provincia: "Cundinamarca",
      pais: "Colombia",
      nombre_receptor: "Juan Pérez",
      telefono: "+57 301 234 5678"
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: "card1",
      tipo: "tarjeta",
      datos: {
        numero: "**** **** **** 4242",
        nombre: "Juan Pérez"
      }
    },
    {
      id: "paypal1",
      tipo: "paypal",
      datos: {
        email: "juan@example.com"
      }
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAddress) {
      setError('Por favor selecciona una dirección de envío');
      return;
    }

    if (!selectedPayment) {
      setError('Por favor selecciona un método de pago');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Aquí iría la lógica de creación del pedido
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulación
      clearCart();
      navigate('/pedido-confirmado');
    } catch (error) {
      setError('Error al procesar el pedido. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/carrito');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Formulario principal */}
            <div className="md:col-span-2 space-y-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Dirección de envío */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <div className="flex items-center mb-4">
                    <MapPin className="w-5 h-5 text-gray-600 mr-2" />
                    <h2 className="text-lg font-bold text-gray-900">Dirección de envío</h2>
                  </div>

                  <div className="space-y-4">
                    {addresses.map(address => (
                      <label
                        key={address.id}
                        className={`block border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedAddress === address.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-200'
                        }`}
                      >
                        <div className="flex items-start">
                          <input
                            type="radio"
                            name="address"
                            value={address.id}
                            checked={selectedAddress === address.id}
                            onChange={() => setSelectedAddress(address.id)}
                            className="mt-1"
                          />
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">{address.nombre_receptor}</p>
                            <p className="text-gray-600">{address.calle}</p>
                            <p className="text-gray-600">
                              {address.ciudad}, {address.provincia} {address.codigo_postal}
                            </p>
                            <p className="text-gray-600">{address.telefono}</p>
                          </div>
                        </div>
                      </label>
                    ))}

                    <button
                      type="button"
                      className="w-full mt-4 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                      <MapPin className="w-5 h-5 mr-2" />
                      Agregar nueva dirección
                    </button>
                  </div>
                </div>

                {/* Método de pago */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <div className="flex items-center mb-4">
                    <CreditCard className="w-5 h-5 text-gray-600 mr-2" />
                    <h2 className="text-lg font-bold text-gray-900">Método de pago</h2>
                  </div>

                  <div className="space-y-4">
                    {paymentMethods.map(method => (
                      <label
                        key={method.id}
                        className={`block border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedPayment === method.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-200'
                        }`}
                      >
                        <div className="flex items-start">
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={selectedPayment === method.id}
                            onChange={() => setSelectedPayment(method.id)}
                            className="mt-1"
                          />
                          <div className="ml-3">
                            {method.tipo === 'tarjeta' ? (
                              <>
                                <p className="font-medium text-gray-900">Tarjeta de crédito</p>
                                <p className="text-gray-600">{method.datos.numero}</p>
                                <p className="text-gray-600">{method.datos.nombre}</p>
                              </>
                            ) : (
                              <>
                                <p className="font-medium text-gray-900">PayPal</p>
                                <p className="text-gray-600">{method.datos.email}</p>
                              </>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}

                    <button
                      type="button"
                      className="w-full mt-4 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Agregar nuevo método de pago
                    </button>
                  </div>
                </div>

                {/* Envío */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <div className="flex items-center mb-4">
                    <Truck className="w-5 h-5 text-gray-600 mr-2" />
                    <h2 className="text-lg font-bold text-gray-900">Método de envío</h2>
                  </div>

                  <div className="space-y-4">
                    <label className="block border rounded-lg p-4 cursor-pointer border-blue-500 bg-blue-50">
                      <div className="flex items-start">
                        <input
                          type="radio"
                          name="shipping"
                          checked
                          readOnly
                          className="mt-1"
                        />
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">Envío estándar</p>
                          <p className="text-gray-600">Entrega estimada: 3-5 días hábiles</p>
                          <p className="text-gray-600">$12.000 COP</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </form>
            </div>

            {/* Resumen del pedido */}
            <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Resumen del pedido</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <div key={item.productoId} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.nombre} x {item.cantidad}
                    </span>
                    <span className="font-medium text-gray-900">
                      {(item.precio * item.cantidad).toLocaleString('es-CO', {
                        style: 'currency',
                        currency: 'COP'
                      })}
                    </span>
                  </div>
                ))}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{getCartTotal().toLocaleString('es-CO', {
                      style: 'currency',
                      currency: 'COP'
                    })}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 mt-2">
                    <span>Envío</span>
                    <span>$12.000</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 mt-4">
                    <span>Total</span>
                    <span>{(getCartTotal() + 12000).toLocaleString('es-CO', {
                      style: 'currency',
                      currency: 'COP'
                    })}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">IVA incluido</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                onClick={handleSubmit}
                className="w-full bg-blue-900 text-white py-3 px-4 rounded-md hover:bg-blue-800 transition-colors flex items-center justify-center font-medium disabled:bg-gray-400"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                      <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  <>
                    Confirmar pedido
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;