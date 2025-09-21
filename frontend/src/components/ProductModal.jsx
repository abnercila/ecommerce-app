import React, { useEffect } from 'react';
import './ProductModal.css';

const ProductModal = ({ product, onClose, onAddToCart }) => {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Add escape key listener
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="product-modal">
        <button className="modal-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="modal-content">
          <div className="modal-image">
            <img src={product.imageUrl} alt={product.name} />
            <div className="image-badge">Premium</div>
          </div>
          
          <div className="modal-info">
            <div className="product-category">Tecnología</div>
            <h2 className="product-title">{product.name}</h2>
            <p className="product-description">{product.description}</p>
            
            <div className="product-features">
              <h3>Características destacadas:</h3>
              <ul>
                <li>✓ Calidad premium garantizada</li>
                <li>✓ Garantía extendida incluida</li>
                <li>✓ Envío gratuito a domicilio</li>
                <li>✓ Soporte técnico especializado</li>
              </ul>
            </div>
            
            <div className="product-price-section">
              <div className="price-main">
                <span className="currency">$</span>
                <span className="amount">{product.price.toFixed(2)}</span>
              </div>
              <div className="price-info">
                <span className="shipping">Envío gratuito</span>
                <span className="availability">En stock</span>
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="add-to-cart-modal" onClick={handleAddToCart}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="m1 1 4 4 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Añadir al Carrito
              </button>
              
              <button className="buy-now-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16,3 21,8 21,13 16,13"></polygon>
                  <line x1="9" y1="9" x2="9" y2="13"></line>
                </svg>
                Comprar Ahora
              </button>
            </div>
            
            <div className="product-meta">
              <div className="meta-item">
                <span className="meta-label">SKU:</span>
                <span className="meta-value">TECH-{product.id.toString().padStart(4, '0')}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Categoría:</span>
                <span className="meta-value">Tecnología</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;