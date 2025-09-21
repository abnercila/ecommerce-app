import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import './OrderHistory.css';

const OrderHistory = ({ onClose }) => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchOrders();
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/orders/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setOrders(result.orders || []);
      } else {
        setError('Error al cargar las órdenes');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock size={16} className="status-icon pending" />;
      case 'CONFIRMED':
        return <CheckCircle size={16} className="status-icon confirmed" />;
      case 'SHIPPED':
        return <Truck size={16} className="status-icon shipped" />;
      case 'DELIVERED':
        return <Package size={16} className="status-icon delivered" />;
      case 'CANCELLED':
        return <XCircle size={16} className="status-icon cancelled" />;
      default:
        return <Clock size={16} className="status-icon pending" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'CONFIRMED':
        return 'Confirmada';
      case 'SHIPPED':
        return 'Enviada';
      case 'DELIVERED':
        return 'Entregada';
      case 'CANCELLED':
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated()) {
    return (
      <div className="order-history-overlay" onClick={onClose}>
        <div className="order-history-modal" onClick={e => e.stopPropagation()}>
          <div className="order-history-auth-required">
            <Package size={48} />
            <h2>Inicia Sesión Requerido</h2>
            <p>Debes iniciar sesión para ver tu historial de órdenes</p>
            <button onClick={onClose} className="order-history-btn">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history-overlay" onClick={onClose}>
      <div className="order-history-modal" onClick={e => e.stopPropagation()}>
        <div className="order-history-header">
          <h2>Historial de Órdenes</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="order-history-content">
          {loading ? (
            <div className="order-history-loading">
              <div className="spinner"></div>
              <p>Cargando órdenes...</p>
            </div>
          ) : error ? (
            <div className="order-history-error">
              <XCircle size={48} />
              <h3>Error</h3>
              <p>{error}</p>
              <button onClick={fetchOrders} className="retry-btn">
                Reintentar
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="order-history-empty">
              <Package size={48} />
              <h3>No hay órdenes</h3>
              <p>Aún no has realizado ninguna compra</p>
              <button onClick={onClose} className="order-history-btn">
                Continuar Comprando
              </button>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3>Orden #{order.orderNumber}</h3>
                      <p className="order-date">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="order-status">
                      {getStatusIcon(order.status)}
                      <span>{getStatusText(order.status)}</span>
                    </div>
                  </div>

                  <div className="order-items">
                    {order.items && order.items.map(item => (
                      <div key={item.id} className="order-item">
                        <img 
                          src={item.product?.imageUrl || '/placeholder-product.jpg'} 
                          alt={item.product?.name || 'Producto'}
                          onError={(e) => {
                            e.target.src = '/placeholder-product.jpg';
                          }}
                        />
                        <div className="item-details">
                          <h4>{item.product?.name || 'Producto'}</h4>
                          <p>Cantidad: {item.quantity}</p>
                          <p className="item-price">{formatPrice(item.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>{formatPrice(order.subtotal || 0)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Envío:</span>
                      <span>{formatPrice(order.shippingCost || 0)}</span>
                    </div>
                    <div className="summary-row">
                      <span>IVA:</span>
                      <span>{formatPrice(order.taxAmount || 0)}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total:</span>
                      <span>{formatPrice(order.totalAmount)}</span>
                    </div>
                  </div>

                  {order.shippingInfo && (
                    <div className="shipping-info">
                      <h4>Información de Envío</h4>
                      <p>{order.shippingInfo.name}</p>
                      <p>{order.shippingInfo.address}</p>
                      <p>{order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.postalCode}</p>
                      <p>{order.shippingInfo.country}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
