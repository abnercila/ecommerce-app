import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import './Contact.css';

const Contact = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envío del formulario
    try {
      // Aquí iría la lógica para enviar el formulario al backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitMessage('¡Mensaje enviado exitosamente! Te contactaremos pronto.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitMessage('Error al enviar el mensaje. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail size={24} />,
      title: "Email",
      content: "contacto@techstore.com",
      description: "Respuesta en 24 horas"
    },
    {
      icon: <Phone size={24} />,
      title: "Teléfono",
      content: "+52 55 1234 5678",
      description: "Lun - Vie, 9:00 AM - 6:00 PM"
    },
    {
      icon: <MapPin size={24} />,
      title: "Dirección",
      content: "Av. Tecnología 123, CDMX",
      description: "Ciudad de México, México"
    },
    {
      icon: <Clock size={24} />,
      title: "Horarios",
      content: "Lun - Vie: 9:00 - 18:00",
      description: "Sáb: 10:00 - 16:00"
    }
  ];

  const faqItems = [
    {
      question: "¿Cuál es el tiempo de entrega?",
      answer: "Entregamos en 24-48 horas en CDMX y 3-5 días hábiles en el interior de la república."
    },
    {
      question: "¿Ofrecen garantía?",
      answer: "Todos nuestros productos incluyen garantía oficial del fabricante y soporte técnico."
    },
    {
      question: "¿Puedo cambiar mi producto?",
      answer: "Sí, tienes 30 días para cambios y devoluciones sin costo adicional."
    },
    {
      question: "¿Aceptan pagos a meses?",
      answer: "Sí, ofrecemos planes de financiamiento sin intereses de 3, 6, 9 y 12 meses."
    }
  ];

  return (
    <div className="contact-overlay" onClick={handleOverlayClick}>
      <div className="contact-modal">
        <button className="contact-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="contact-content">
          {/* Header */}
          <div className="contact-header">
            <h1>Contáctanos</h1>
            <p className="contact-subtitle">
              Estamos aquí para ayudarte con cualquier duda o consulta
            </p>
          </div>

          <div className="contact-main">
            {/* Contact Form */}
            <div className="contact-form-section">
              <h2>Envíanos un mensaje</h2>
              {submitMessage && (
                <div className={`submit-message ${submitMessage.includes('Error') ? 'error' : 'success'}`}>
                  {submitMessage}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Nombre completo</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Asunto</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecciona un asunto</option>
                    <option value="ventas">Consulta de ventas</option>
                    <option value="soporte">Soporte técnico</option>
                    <option value="garantia">Garantía</option>
                    <option value="devolucion">Devolución/Cambio</option>
                    <option value="otros">Otros</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Mensaje</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    placeholder="Describe tu consulta o mensaje..."
                  ></textarea>
                </div>

                <button type="submit" className="submit-button" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Enviar mensaje
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="contact-info-section">
              <h2>Información de contacto</h2>
              <div className="contact-info-grid">
                {contactInfo.map((info, index) => (
                  <div key={index} className="contact-info-item">
                    <div className="contact-icon">
                      {info.icon}
                    </div>
                    <div className="contact-details">
                      <h3>{info.title}</h3>
                      <p className="contact-main-info">{info.content}</p>
                      <p className="contact-sub-info">{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* FAQ Section */}
              <div className="faq-section">
                <h3>
                  <MessageCircle size={20} />
                  Preguntas frecuentes
                </h3>
                <div className="faq-list">
                  {faqItems.map((item, index) => (
                    <div key={index} className="faq-item">
                      <h4>{item.question}</h4>
                      <p>{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
