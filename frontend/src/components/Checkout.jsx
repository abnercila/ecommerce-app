import React, { useState } from 'react';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';
import { CreditCard, Truck, MapPin, ShoppingBag, ArrowLeft, Lock } from 'lucide-react';
import './Checkout.css';

const Checkout = ({ onClose, onSuccess }) => {
  const { cartItems, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [shippingInfo, setShippingInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'México'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    paymentMethod: 'CREDIT_CARD',
    cardNumber: '',
    cardHolderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  const [orderSummary, setOrderSummary] = useState(null);

  // Calcular totales
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = 99.00;
  const taxRate = 0.16;
  const taxAmount = subtotal * taxRate;
  const total = subtotal + shippingCost + taxAmount;

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateShipping = () => {
    const newErrors = {};
    
    if (!shippingInfo.name.trim()) newErrors.name = 'Nombre requerido';
    if (!shippingInfo.email.trim()) newErrors.email = 'Email requerido';
    if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) newErrors.email = 'Email inválido';
    if (!shippingInfo.phone.trim()) newErrors.phone = 'Teléfono requerido';
    if (!shippingInfo.address.trim()) newErrors.address = 'Dirección requerida';
    if (!shippingInfo.city.trim()) newErrors.city = 'Ciudad requerida';
    if (!shippingInfo.state.trim()) newErrors.state = 'Estado requerido';
    if (!shippingInfo.postalCode.trim()) newErrors.postalCode = 'Código postal requerido';
    if (!/^\d{5}$/.test(shippingInfo.postalCode)) newErrors.postalCode = 'Código postal inválido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors = {};
    
    if (paymentInfo.paymentMethod === 'CREDIT_CARD' || paymentInfo.paymentMethod === 'DEBIT_CARD') {
      if (!paymentInfo.cardNumber.trim()) newErrors.cardNumber = 'Número de tarjeta requerido';
      if (!/^\d{16}$/.test(paymentInfo.cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Número de tarjeta inválido';
      if (!paymentInfo.cardHolderName.trim()) newErrors.cardHolderName = 'Nombre del titular requerido';
      if (!paymentInfo.expiryMonth) newErrors.expiryMonth = 'Mes de expiración requerido';
      if (!paymentInfo.expiryYear) newErrors.expiryYear = 'Año de expiración requerido';
      if (!paymentInfo.cvv.trim()) newErrors.cvv = 'CVV requerido';
      if (!/^\d{3,4}$/.test(paymentInfo.cvv)) newErrors.cvv = 'CVV inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateShipping()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validatePayment()) {
      setCurrentStep(3);
    }
  };

  const handleSubmitOrder = async () => {
    if (!isAuthenticated()) {
      setErrors({ general: 'Debes iniciar sesión para completar la compra' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const checkoutData = {
        cartItems: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingInfo,
        paymentInfo: {
          ...paymentInfo,
          totalAmount: total
        }
      };

      const response = await fetch('http://localhost:8081/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(checkoutData)
      });

      const result = await response.json();

      if (result.success) {
        setOrderSummary(result.order);
        clearCart();
        setCurrentStep(4);
        if (onSuccess) onSuccess(result.order);
      } else {
        setErrors({ general: result.message || 'Error al procesar la orden' });
      }
    } catch (error) {
      console.error('Error en checkout:', error);
      setErrors({ general: 'Error de conexión. Intenta nuevamente.' });
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

  if (!isAuthenticated()) {
    return (
      <div className="checkout-overlay" onClick={onClose}>
        <div className="checkout-modal" onClick={e => e.stopPropagation()}>
          <div className="checkout-auth-required">
            <Lock size={48} />
            <h2>Inicia Sesión Requerido</h2>
            <p>Debes iniciar sesión para completar tu compra</p>
            <button onClick={onClose} className="checkout-btn">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="checkout-header">
          <button className="checkout-back" onClick={onClose}>
            <ArrowLeft size={20} />
          </button>
          <h2>Finalizar Compra</h2>
          <div className="checkout-steps">
            <span className={currentStep >= 1 ? 'active' : ''}>Envío</span>
            <span className={currentStep >= 2 ? 'active' : ''}>Pago</span>
            <span className={currentStep >= 3 ? 'active' : ''}>Revisar</span>
            <span className={currentStep >= 4 ? 'active' : ''}>Confirmación</span>
          </div>
        </div>

        <div className="checkout-content">
          {/* Step 1: Shipping Information */}
          {currentStep === 1 && (
            <div className="checkout-step">
              <div className="step-icon">
                <Truck size={24} />
              </div>
              <h3>Información de Envío</h3>
              
              {errors.general && (
                <div className="checkout-error">{errors.general}</div>
              )}

              <div className="form-grid">
                <div className="form-group">
                  <label>Nombre Completo *</label>
                  <input
                    type="text"
                    name="name"
                    value={shippingInfo.name}
                    onChange={handleShippingChange}
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleShippingChange}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label>Teléfono *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleShippingChange}
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="field-error">{errors.phone}</span>}
                </div>

                <div className="form-group full-width">
                  <label>Dirección *</label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                    className={errors.address ? 'error' : ''}
                  />
                  {errors.address && <span className="field-error">{errors.address}</span>}
                </div>

                <div className="form-group">
                  <label>Ciudad *</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <span className="field-error">{errors.city}</span>}
                </div>

                <div className="form-group">
                  <label>Estado *</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleShippingChange}
                    className={errors.state ? 'error' : ''}
                  />
                  {errors.state && <span className="field-error">{errors.state}</span>}
                </div>

                <div className="form-group">
                  <label>Código Postal *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingInfo.postalCode}
                    onChange={handleShippingChange}
                    className={errors.postalCode ? 'error' : ''}
                  />
                  {errors.postalCode && <span className="field-error">{errors.postalCode}</span>}
                </div>

                <div className="form-group">
                  <label>País *</label>
                  <select
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleShippingChange}
                  >
                    <option value="México">México</option>
                    <option value="Estados Unidos">Estados Unidos</option>
                    <option value="Canadá">Canadá</option>
                  </select>
                </div>
              </div>

              <button onClick={handleNextStep} className="checkout-btn primary">
                Continuar al Pago
              </button>
            </div>
          )}

          {/* Step 2: Payment Information */}
          {currentStep === 2 && (
            <div className="checkout-step">
              <div className="step-icon">
                <CreditCard size={24} />
              </div>
              <h3>Información de Pago</h3>

              <div className="payment-methods">
                <label className="payment-method">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CREDIT_CARD"
                    checked={paymentInfo.paymentMethod === 'CREDIT_CARD'}
                    onChange={handlePaymentChange}
                  />
                  <span>Tarjeta de Crédito</span>
                </label>
                <label className="payment-method">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="DEBIT_CARD"
                    checked={paymentInfo.paymentMethod === 'DEBIT_CARD'}
                    onChange={handlePaymentChange}
                  />
                  <span>Tarjeta de Débito</span>
                </label>
                <label className="payment-method">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="PAYPAL"
                    checked={paymentInfo.paymentMethod === 'PAYPAL'}
                    onChange={handlePaymentChange}
                  />
                  <span>PayPal</span>
                </label>
              </div>

              {(paymentInfo.paymentMethod === 'CREDIT_CARD' || paymentInfo.paymentMethod === 'DEBIT_CARD') && (
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Número de Tarjeta *</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={paymentInfo.cardNumber}
                      onChange={handlePaymentChange}
                      placeholder="1234 5678 9012 3456"
                      className={errors.cardNumber ? 'error' : ''}
                    />
                    {errors.cardNumber && <span className="field-error">{errors.cardNumber}</span>}
                  </div>

                  <div className="form-group full-width">
                    <label>Nombre del Titular *</label>
                    <input
                      type="text"
                      name="cardHolderName"
                      value={paymentInfo.cardHolderName}
                      onChange={handlePaymentChange}
                      className={errors.cardHolderName ? 'error' : ''}
                    />
                    {errors.cardHolderName && <span className="field-error">{errors.cardHolderName}</span>}
                  </div>

                  <div className="form-group">
                    <label>Mes *</label>
                    <select
                      name="expiryMonth"
                      value={paymentInfo.expiryMonth}
                      onChange={handlePaymentChange}
                      className={errors.expiryMonth ? 'error' : ''}
                    >
                      <option value="">Mes</option>
                      {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                        <option key={month} value={month.toString().padStart(2, '0')}>
                          {month.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    {errors.expiryMonth && <span className="field-error">{errors.expiryMonth}</span>}
                  </div>

                  <div className="form-group">
                    <label>Año *</label>
                    <select
                      name="expiryYear"
                      value={paymentInfo.expiryYear}
                      onChange={handlePaymentChange}
                      className={errors.expiryYear ? 'error' : ''}
                    >
                      <option value="">Año</option>
                      {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i).map(year => (
                        <option key={year} value={year.toString()}>
                          {year}
                        </option>
                      ))}
                    </select>
                    {errors.expiryYear && <span className="field-error">{errors.expiryYear}</span>}
                  </div>

                  <div className="form-group">
                    <label>CVV *</label>
                    <input
                      type="text"
                      name="cvv"
                      value={paymentInfo.cvv}
                      onChange={handlePaymentChange}
                      placeholder="123"
                      maxLength="4"
                      className={errors.cvv ? 'error' : ''}
                    />
                    {errors.cvv && <span className="field-error">{errors.cvv}</span>}
                  </div>
                </div>
              )}

              <div className="checkout-buttons">
                <button onClick={() => setCurrentStep(1)} className="checkout-btn secondary">
                  Regresar
                </button>
                <button onClick={handleNextStep} className="checkout-btn primary">
                  Revisar Orden
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Order Review */}
          {currentStep === 3 && (
            <div className="checkout-step">
              <div className="step-icon">
                <ShoppingBag size={24} />
              </div>
              <h3>Revisar Orden</h3>

              {errors.general && (
                <div className="checkout-error">{errors.general}</div>
              )}

              {/* Order Summary */}
              <div className="order-review">
                <div className="review-section">
                  <h4>Productos</h4>
                  <div className="order-items">
                    {cartItems.map(item => (
                      <div key={item.id} className="order-item">
                        <img src={item.imageUrl} alt={item.name} />
                        <div className="item-details">
                          <h5>{item.name}</h5>
                          <p>Cantidad: {item.quantity}</p>
                          <p>{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="review-section">
                  <h4>Envío</h4>
                  <div className="shipping-review">
                    <MapPin size={16} />
                    <div>
                      <p>{shippingInfo.name}</p>
                      <p>{shippingInfo.address}</p>
                      <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.postalCode}</p>
                      <p>{shippingInfo.country}</p>
                    </div>
                  </div>
                </div>

                <div className="review-section">
                  <h4>Totales</h4>
                  <div className="order-totals">
                    <div className="total-line">
                      <span>Subtotal:</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="total-line">
                      <span>Envío:</span>
                      <span>{formatPrice(shippingCost)}</span>
                    </div>
                    <div className="total-line">
                      <span>IVA (16%):</span>
                      <span>{formatPrice(taxAmount)}</span>
                    </div>
                    <div className="total-line total">
                      <span>Total:</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="checkout-buttons">
                <button onClick={() => setCurrentStep(2)} className="checkout-btn secondary">
                  Regresar
                </button>
                <button 
                  onClick={handleSubmitOrder} 
                  className="checkout-btn primary"
                  disabled={loading}
                >
                  {loading ? 'Procesando...' : 'Confirmar Orden'}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Order Confirmation */}
          {currentStep === 4 && orderSummary && (
            <div className="checkout-step">
              <div className="order-confirmation">
                <div className="success-icon">✅</div>
                <h3>¡Orden Confirmada!</h3>
                <p>Tu orden ha sido procesada exitosamente.</p>
                
                <div className="order-details">
                  <p><strong>Número de Orden:</strong> {orderSummary.orderNumber}</p>
                  <p><strong>Total:</strong> {formatPrice(orderSummary.totalAmount)}</p>
                  <p><strong>Estado:</strong> {orderSummary.status}</p>
                  <p><strong>Entrega Estimada:</strong> 7-10 días hábiles</p>
                </div>

                <div className="confirmation-buttons">
                  <button onClick={onClose} className="checkout-btn primary">
                    Continuar Comprando
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
