import React, { useState, useEffect } from 'react';
import { AlertTriangle, Package, X, RefreshCw } from 'lucide-react';
import './InventoryAlert.css';

const InventoryAlert = ({ isVisible, onClose }) => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [outOfStockProducts, setOutOfStockProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isVisible) {
      fetchInventoryData();
    }
  }, [isVisible]);

  const fetchInventoryData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [lowStockResponse, outOfStockResponse] = await Promise.all([
        fetch('http://localhost:8081/api/products/low-stock'),
        fetch('http://localhost:8081/api/products/out-of-stock')
      ]);

      const lowStockData = await lowStockResponse.json();
      const outOfStockData = await outOfStockResponse.json();

      if (lowStockData.success) {
        setLowStockProducts(lowStockData.products);
      }

      if (outOfStockData.success) {
        setOutOfStockProducts(outOfStockData.products);
      }
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      setError('Error al cargar los datos de inventario');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (!isVisible) return null;

  return (
    <div className="inventory-alert-overlay">
      <div className="inventory-alert-modal">
        <div className="inventory-alert-header">
          <div className="header-title">
            <Package size={24} />
            <h2>Alertas de Inventario</h2>
          </div>
          <div className="header-actions">
            <button 
              className="refresh-btn"
              onClick={fetchInventoryData}
              disabled={loading}
              title="Actualizar datos"
            >
              <RefreshCw size={16} className={loading ? 'spinning' : ''} />
            </button>
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="inventory-alert-content">
          {loading ? (
            <div className="loading-state">
              <RefreshCw size={32} className="spinning" />
              <p>Cargando datos de inventario...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <AlertTriangle size={32} />
              <p>{error}</p>
              <button onClick={fetchInventoryData} className="retry-btn">
                Reintentar
              </button>
            </div>
          ) : (
            <>
              {/* Productos Agotados */}
              <div className="alert-section critical">
                <div className="section-header">
                  <AlertTriangle size={20} />
                  <h3>Productos Agotados ({outOfStockProducts.length})</h3>
                </div>
                
                {outOfStockProducts.length === 0 ? (
                  <div className="empty-state">
                    <p>✅ No hay productos agotados</p>
                  </div>
                ) : (
                  <div className="products-list">
                    {outOfStockProducts.map(product => (
                      <div key={product.id} className="product-item critical">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="product-image"
                        />
                        <div className="product-info">
                          <h4>{product.name}</h4>
                          <p className="product-category">{product.category}</p>
                          <p className="product-price">{formatPrice(product.price)}</p>
                        </div>
                        <div className="stock-info critical">
                          <span className="stock-value">0</span>
                          <span className="stock-label">Agotado</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Productos con Stock Bajo */}
              <div className="alert-section warning">
                <div className="section-header">
                  <AlertTriangle size={20} />
                  <h3>Stock Bajo ({lowStockProducts.length})</h3>
                </div>
                
                {lowStockProducts.length === 0 ? (
                  <div className="empty-state">
                    <p>✅ No hay productos con stock bajo</p>
                  </div>
                ) : (
                  <div className="products-list">
                    {lowStockProducts.map(product => (
                      <div key={product.id} className="product-item warning">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="product-image"
                        />
                        <div className="product-info">
                          <h4>{product.name}</h4>
                          <p className="product-category">{product.category}</p>
                          <p className="product-price">{formatPrice(product.price)}</p>
                        </div>
                        <div className="stock-info warning">
                          <span className="stock-value">{product.stock}</span>
                          <span className="stock-label">
                            {product.stock === 1 ? 'unidad' : 'unidades'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Resumen */}
              <div className="inventory-summary">
                <div className="summary-item">
                  <span className="summary-label">Total productos monitoreados:</span>
                  <span className="summary-value">
                    {lowStockProducts.length + outOfStockProducts.length}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Requieren atención inmediata:</span>
                  <span className="summary-value critical">
                    {outOfStockProducts.length}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Stock bajo (reabastecer pronto):</span>
                  <span className="summary-value warning">
                    {lowStockProducts.length}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="inventory-alert-footer">
          <p className="last-update">
            Última actualización: {new Date().toLocaleString('es-MX')}
          </p>
          <button onClick={onClose} className="close-footer-btn">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryAlert;
