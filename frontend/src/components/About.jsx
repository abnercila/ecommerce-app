import React from 'react';
import { X, Shield, Truck, HeartHandshake, Award, Users, Clock } from 'lucide-react';
import './About.css';

const About = ({ onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const features = [
    {
      icon: <Shield size={32} />,
      title: "Productos Garantizados",
      description: "Todos nuestros productos cuentan con garantía oficial y soporte técnico especializado."
    },
    {
      icon: <Truck size={32} />,
      title: "Envío Gratuito",
      description: "Disfruta de envío gratis en compras superiores a $50. Entregas rápidas y seguras."
    },
    {
      icon: <HeartHandshake size={32} />,
      title: "Atención Personalizada",
      description: "Nuestro equipo de expertos te ayuda a encontrar la tecnología perfecta para ti."
    },
    {
      icon: <Award size={32} />,
      title: "Calidad Premium",
      description: "Seleccionamos cuidadosamente las mejores marcas y productos del mercado tecnológico."
    }
  ];

  const stats = [
    { number: "50,000+", label: "Clientes Satisfechos" },
    { number: "10,000+", label: "Productos Vendidos" },
    { number: "5", label: "Años de Experiencia" },
    { number: "99%", label: "Satisfacción del Cliente" }
  ];

  return (
    <div className="about-overlay" onClick={handleOverlayClick}>
      <div className="about-modal">
        <button className="about-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="about-content">
          {/* Header */}
          <div className="about-header">
            <h1>Acerca de TechStore</h1>
            <p className="about-subtitle">
              Tu destino premium para la mejor tecnología
            </p>
          </div>

          {/* Main Story */}
          <div className="about-story">
            <div className="story-content">
              <h2>Nuestra Historia</h2>
              <p>
                Desde 2019, <strong>TechStore</strong> se ha consolidado como el líder en venta de tecnología premium. 
                Nacimos con la visión de democratizar el acceso a la mejor tecnología, ofreciendo productos 
                de calidad excepcional a precios justos.
              </p>
              <p>
                Nuestro compromiso va más allá de la venta. Creamos experiencias memorables, proporcionando 
                asesoramiento experto y soporte continuo para que cada cliente encuentre la solución 
                tecnológica perfecta para sus necesidades.
              </p>
            </div>
            <div className="story-image">
              <div className="tech-illustration">
                <Users size={80} className="main-icon" />
                <div className="floating-icons">
                  <Shield size={24} className="floating-icon" />
                  <Award size={24} className="floating-icon" />
                  <Clock size={24} className="floating-icon" />
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="about-features">
            <h2>¿Por qué elegirnos?</h2>
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">
                    {feature.icon}
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="about-stats">
            <h2>Nuestros Números</h2>
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mission */}
          <div className="about-mission">
            <h2>Nuestra Misión</h2>
            <div className="mission-content">
              <p>
                En <strong>TechStore</strong>, nuestra misión es empoderar a las personas a través de la tecnología. 
                Creemos que la innovación tecnológica debe ser accesible para todos, y trabajamos incansablemente 
                para ofrecer productos que mejoren la vida de nuestros clientes.
              </p>
              <div className="mission-values">
                <div className="value">
                  <strong>Innovación:</strong> Siempre a la vanguardia de la tecnología
                </div>
                <div className="value">
                  <strong>Calidad:</strong> Solo los mejores productos llegan a nuestros clientes
                </div>
                <div className="value">
                  <strong>Confianza:</strong> Relaciones duraderas basadas en la transparencia
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="about-cta">
            <h3>¿Listo para descubrir la mejor tecnología?</h3>
            <p>Únete a miles de clientes satisfechos y descubre por qué somos la primera opción en tecnología premium.</p>
            <button className="cta-button" onClick={onClose}>
              Explorar Productos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
