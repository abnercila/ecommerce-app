import React from 'react';
import './HeroBanner.css';

const HeroBanner = () => {
  return (
    <section className="hero-banner">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            Tecnología <span className="highlight">Premium</span>
          </h1>
          <p className="hero-subtitle">
            Descubre los mejores productos tecnológicos con la calidad que mereces
          </p>
          <div className="hero-features">
            <div className="feature">
              <div className="feature-icon">🚀</div>
              <span>Envío Rápido</span>
            </div>
            <div className="feature">
              <div className="feature-icon">🔒</div>
              <span>Pago Seguro</span>
            </div>
            <div className="feature">
              <div className="feature-icon">✨</div>
              <span>Calidad Premium</span>
            </div>
          </div>
          <button className="hero-cta">
            Explorar Productos
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="card-content">
              <div className="card-icon">💻</div>
              <h3>Laptops</h3>
              <p>Potencia y rendimiento</p>
            </div>
          </div>
          <div className="floating-card card-2">
            <div className="card-content">
              <div className="card-icon">📱</div>
              <h3>Dispositivos</h3>
              <p>Última tecnología</p>
            </div>
          </div>
          <div className="floating-card card-3">
            <div className="card-content">
              <div className="card-icon">🎧</div>
              <h3>Accesorios</h3>
              <p>Complementos perfectos</p>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
    </section>
  );
};

export default HeroBanner;
