import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Search, Filter } from 'lucide-react';

interface Order {
  id: number;
  fecha_creacion: string;
  estado: 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';
  total: number;
  num_items: number;
  tracking_number?: string;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('todos');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Aquí iría la llamada a la API
        // Por ahora usamos datos de ejemplo
        const mockOrders: Order[] = [
          {
            id: 1,
            fecha_creacion: '2024-02-20T10:30:00',
            estado: 'entregado',
            total: 299900,
            num_items: 2,
            tracking_number: 'SP123456789CO'
          },
          {
            id: 2,
            fecha_creacion: '2024-02-15T15:45:00',
            estado: 'enviado',
            total: 149900,
            num_items: 1,
            tracking_number: 'SP987654321CO'
          },
          {
            id: 3,
            fecha_creacion: '2024-02-10T09:15:00',
            estado: 'procesando',
            total: 599900,
            num_items: 3
          }
        ];

        setOrders(mockOrders);
        setLoading(false);
      } catch (error) {
        setError('Error al cargar los pedidos');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: Order['estado']) => {
    switch (status) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'procesando':
        return 'bg-blue-100 text-blue-800';
      case 'enviado':
        return 'bg-purple-100 text-purple-800';
      case 'entregado':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['estado']) => {
    const statusMap = {
      pendiente: 'Pendiente',
      procesando: 'Procesando',
      enviado: 'Enviado',
      entregado: 'Entregado',
      cancelado: 'Cancelado'
    };
    return statusMap[status];
  };

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
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Mis Pedidos</h1>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Filtros y búsqueda */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Buscar pedidos..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>

              <div className="flex items-center gap-4">
                <Filter className="text-gray-400" size={20} />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border rounded-lg px-4 py-2"
                >
                  <option value="todos">Todos los pedidos</option>
                  <option value="pendiente">Pendientes</option>
                  <option value="procesando">En proceso</option>
                  <option value="enviado">Enviados</option>
                  <option value="entregado">Entregados</option>
                  <option value="cancelado">Cancelados</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lista de pedidos */}
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tienes pedidos aún
                </h3>
                <p className="text-gray-600 mb-4">
                  ¡Explora nuestro catálogo y realiza tu primera compra!
                </p>
                <Link
                  to="/catalogo"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  Ir al catálogo
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Link>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        Pedido #{order.id.toString().padStart(6, '0')}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.fecha_creacion).toLocaleDateString('es-CO', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.estado)}`}>
                      {getStatusText(order.estado)}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.total.toLocaleString('es-CO', {
                          style: 'currency',
                          currency: 'COP'
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.num_items} {order.num_items === 1 ? 'artículo' : 'artículos'}
                      </p>
                    </div>

                    <div className="mt-4 sm:mt-0 space-y-2 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row">
                      {order.tracking_number && (
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Seguir envío
                        </button>
                      )}
                      <Link
                        to={`/pedidos/${order.id}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Ver detalles
                        <ChevronRight className="w-5 h-5 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;