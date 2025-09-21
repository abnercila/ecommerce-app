import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Login from './components/Login';
import Register from './components/Register';
import About from './components/About';
import Contact from './components/Contact';
import { CartProvider } from './CartContext';
import { AuthProvider } from './AuthContext';
import './App.css';

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleCart = () => setCartOpen(!cartOpen);

  const handleLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const handleRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const closeAuth = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  const switchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const switchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handleAbout = () => {
    setShowAbout(true);
  };

  const handleContact = () => {
    setShowContact(true);
  };

  const closeAbout = () => {
    setShowAbout(false);
  };

  const closeContact = () => {
    setShowContact(false);
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="App">
          <Navbar 
            onCartClick={toggleCart}
            onLoginClick={handleLogin}
            onRegisterClick={handleRegister}
            onSearchChange={handleSearchChange}
            onAboutClick={handleAbout}
            onContactClick={handleContact}
          />
          <main className="main-content">
            <HeroBanner />
            <section id="products" className="products-section">
              <ProductList searchTerm={searchTerm} />
            </section>
          </main>
          
          {cartOpen && <Cart onClose={toggleCart} />}
          
          {showLogin && (
            <Login 
              onClose={closeAuth}
              onSwitchToRegister={switchToRegister}
            />
          )}
          
          {showRegister && (
            <Register 
              onClose={closeAuth}
              onSwitchToLogin={switchToLogin}
            />
          )}

          {showAbout && (
            <About onClose={closeAbout} />
          )}

          {showContact && (
            <Contact onClose={closeContact} />
          )}
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;