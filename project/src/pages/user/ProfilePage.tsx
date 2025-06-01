import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, MapPin, CreditCard, Lock, Mail, Phone } from 'lucide-react';

interface Address {
  id: number;
  calle: string;
  ciudad: string;
  codigo_postal: string;
  provincia: string;
  pais: string;
  nombre_receptor: string;
  telefono: string;
  es_principal: boolean;
}

interface PaymentMethod {
  id: string;
  tipo: 'tarjeta' | 'paypal';
  datos: {
    numero?: string;
    nombre?: string;
    email?: string;
  };
  es_principal: boolean;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Aquí irían las llamadas a la API para obtener direcciones y métodos de pago
        // Por ahora usamos datos de ejemplo
        setAddresses([
          {
            id: 1,
            calle: "Calle 123 #45-67",
            ciudad: "Bogotá",
            codigo_postal: "110111",
            provincia: "Cundinamarca",
            pais: "Colombia",
            nombre_receptor: "Juan Pérez",
            telefono: "+57 301 234 5678",
            es_principal: true
          }
        ]);

        setPaymentMethods([
          {
            id: "card1",
            tipo: "tarjeta",
            datos: {
              numero: "**** **** **** 4242",
              nombre: "Juan Pérez"
            },
            es_principal: true
          }
        ]);

        setLoading(false);
      } catch (error) {
        setError('Error al cargar los datos del perfil');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Mi Perfil</h1>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Información personal */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <User className="w-5 h-5 text-gray-600 mr-2" />
                  <h2 className="text-lg font-bold text-gray-900">Información Personal</h2>
                </div>

                <form className="space-y-4">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      value={user?.nombre}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      disabled
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Correo electrónico
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        <Mail className="h-4 w-4" />
                      </span>
                      <input
                        type="email"
                        id="email"
                        value={user?.email}
                        className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        disabled
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                      Teléfono
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        <Phone className="h-4 w-4" />
                      </span>
                      <input
                        type="tel"
                        id="telefono"
                        placeholder="+57"
                        className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
                    >
                      Actualizar información
                    </button>
                  </div>
                </form>
              </div>

              {/* Direcciones */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-600 mr-2" />
                    <h2 className="text-lg font-bold text-gray-900">Direcciones de Envío</h2>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Agregar dirección
                  </button>
                </div>

                <div className="space-y-4">
                  {addresses.map(address => (
                    <div
                      key={address.id}
                      className="border rounded-lg p-4 relative hover:border-blue-200"
                    >
                      {address.es_principal && (
                        <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                          Principal
                        </span>
                      )}
                      <p className="font-medium text-gray-900">{address.nombre_receptor}</p>
                      <p className="text-gray-600">{address.calle}</p>
                      <p className="text-gray-600">
                        {address.ciudad}, {address.provincia} {address.codigo_postal}
                      </p>
                      <p className="text-gray-600">{address.telefono}</p>
                      <div className="mt-3 flex space-x-3">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Editar
                        </button>
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Métodos de pago */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 text-gray-600 mr-2" />
                    <h2 className="text-lg font-bold text-gray-900">Métodos de Pago</h2>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Agregar método de pago
                  </button>
                </div>

                <div className="space-y-4">
                  {paymentMethods.map(method => (
                    <div
                      key={method.id}
                      className="border rounded-lg p-4 relative hover:border-blue-200"
                    >
                      {method.es_principal && (
                        <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                          Principal
                        </span>
                      )}
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
                      <div className="mt-3 flex space-x-3">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Editar
                        </button>
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cambiar contraseña */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <Lock className="w-5 h-5 text-gray-600 mr-2" />
                  <h2 className="text-lg font-bold text-gray-900">Cambiar Contraseña</h2>
                </div>

                <form className="space-y-4">
                  <div>
                    <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                      Contraseña actual
                    </label>
                    <input
                      type="password"
                      id="current-password"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                      Nueva contraseña
                    </label>
                    <input
                      type="password"
                      id="new-password"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                      Confirmar nueva contraseña
                    </label>
                    <input
                      type="password"
                      id="confirm-password"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
                    >
                      Cambiar contraseña
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-medium text-gray-900 mb-3">Resumen de cuenta</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">Miembro desde: Enero 2024</p>
                  <p className="text-gray-600">Pedidos realizados: 5</p>
                  <p className="text-gray-600">Reseñas escritas: 3</p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-medium text-blue-900 mb-2">¿Necesitas ayuda?</h3>
                <p className="text-sm text-blue-800 mb-4">
                  Nuestro equipo de soporte está disponible 24/7 para ayudarte.
                </p>
                <button className="w-full bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition-colors text-sm">
                  Contactar soporte
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;