import React, { useState } from 'react';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';
import { Menu, X, ShoppingCart, User, LogIn, LogOut, Search, Package, AlertTriangle } from 'lucide-react';
import CartIcon from './CartIcon';
import OrderHistory from './OrderHistory';
import InventoryAlert from './InventoryAlert';
import './Navbar.css';

const Navbar = ({ onCartClick, onLoginClick, onRegisterClick, onSearchChange, onAboutClick, onContactClick }) => {
  const { cartItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [showInventoryAlert, setShowInventoryAlert] = useState(false);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(searchTerm);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <h2>TechStore</h2>
          <span className="logo-subtitle">Premium Tech</span>
        </div>

        {/* Search Bar */}
        <div className="navbar-search">
          <form className="search-container" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <Search size={20} />
            </button>
          </form>
        </div>

        {/* Navigation Links */}
        <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-nav">
            <li className="nav-item">
              <a href="#home" className="nav-link">Inicio</a>
            </li>
            <li className="nav-item">
              <a href="#products" className="nav-link">Productos</a>
            </li>
            <li className="nav-item">
              <button onClick={onAboutClick} className="nav-link nav-button">Acerca de</button>
            </li>
            <li className="nav-item">
              <button onClick={onContactClick} className="nav-link nav-button">Contacto</button>
            </li>
          </ul>
        </div>

        {/* Right Section - Auth, Cart */}
        <div className="navbar-right">
          {/* Auth Section */}
          {isAuthenticated() ? (
            <div className="user-section">
              <div className="user-info" onClick={() => setShowUserMenu(!showUserMenu)}>
                <div className="user-avatar">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="user-name">{user?.name || 'Usuario'}</span>
                <User size={16} />
              </div>
              
              {showUserMenu && (
                <div className="user-menu">
                  <div className="user-menu-header">
                    <p>{user?.name}</p>
                    <small>{user?.email}</small>
                  </div>
                  <hr />
                  <button className="user-menu-item">
                    <User size={16} />
                    Mi Perfil
                  </button>
                  <button className="user-menu-item" onClick={() => {
                    setShowOrderHistory(true);
                    setShowUserMenu(false);
                  }}>
                    <Package size={16} />
                    Mis Pedidos
                  </button>
                  
                  {/* Mostrar opción de inventario solo para administradores */}
                  {user?.role === 'ADMIN' && (
                    <button className="user-menu-item" onClick={() => {
                      setShowInventoryAlert(true);
                      setShowUserMenu(false);
                    }}>
                      <AlertTriangle size={16} />
                      Alertas de Inventario
                    </button>
                  )}
                  
                  <hr />
                  <button className="user-menu-item logout" onClick={handleLogout}>
                    <LogOut size={16} />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="auth-btn login-btn" onClick={onLoginClick}>
                <LogIn size={18} />
                <span>Ingresar</span>
              </button>
              <button className="auth-btn register-btn" onClick={onRegisterClick}>
                <User size={18} />
                <span>Registro</span>
              </button>
            </div>
          )}

          {/* Cart */}
          <button className="cart-button" onClick={onCartClick}>
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle" 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            {/* Mobile Search */}
            <div className="mobile-search">
              <form className="mobile-search-container" onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="mobile-search-input"
                />
                <button type="submit" className="mobile-search-button">
                  <Search size={20} />
                </button>
              </form>
            </div>
            <ul className="mobile-nav-list">
              <li><a href="#home" onClick={toggleMobileMenu}>Inicio</a></li>
              <li><a href="#products" onClick={toggleMobileMenu}>Productos</a></li>
              <li><button onClick={() => { onAboutClick(); toggleMobileMenu(); }} className="mobile-nav-button">Acerca de</button></li>
              <li><button onClick={() => { onContactClick(); toggleMobileMenu(); }} className="mobile-nav-button">Contacto</button></li>
            </ul>
            <div className="mobile-auth">
              <button className="mobile-auth-btn" onClick={() => { onLoginClick(); toggleMobileMenu(); }}>
                <LogIn size={18} />
                Ingresar
              </button>
              <button className="mobile-auth-btn" onClick={() => { onRegisterClick(); toggleMobileMenu(); }}>
                <User size={18} />
                Registro
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showOrderHistory && (
        <OrderHistory onClose={() => setShowOrderHistory(false)} />
      )}
      
      {showInventoryAlert && user && user.role === 'admin' && (
        <InventoryAlert onClose={() => setShowInventoryAlert(false)} />
      )}
    </nav>
  );
};

export default Navbar;