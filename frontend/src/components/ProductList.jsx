import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useCart } from '../CartContext';
import ProductModal from './ProductModal';
import Spinner from './Spinner';
import { Filter, Grid, List } from 'lucide-react';
import './ProductList.css';

const ProductList = ({ searchTerm }) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');

  // Traducción de categorías para mostrar
  const categoryTranslations = {
    'all': 'Todos',
    'laptops': 'Laptops',
    'monitores': 'Monitores',
    'audifonos': 'Audífonos',
    'telefonos': 'Teléfonos',
    'tablets': 'Tablets',
    'accesorios': 'Accesorios'
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Obtener productos y categorías en paralelo
        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get('http://localhost:8081/api/products'),
          axios.get('http://localhost:8081/api/products/categories')
        ]);
        
        setProducts(productsResponse.data);
        setCategories(['all', ...categoriesResponse.data]);
      } catch (err) {
        setError('No se pudieron cargar los productos. Verifica que el servidor esté funcionando.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (currentFilter !== 'all') {
      filtered = filtered.filter(product =>
        product.category && product.category.toLowerCase() === currentFilter.toLowerCase()
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-high':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, searchTerm, currentFilter, sortBy]);

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="products-loading">
        <Spinner />
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="products-container">
      {/* Search Results Info */}
      {searchTerm && (
        <div className="search-results-info">
          <h3>Resultados para: "{searchTerm}"</h3>
          <p>{filteredAndSortedProducts.length} productos encontrados</p>
        </div>
      )}

      {/* Filters and Controls */}
      <div className="products-controls">
        <div className="filter-section">
          <Filter size={20} />
          <span>Filtrar por:</span>
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`filter-btn ${currentFilter === category ? 'active' : ''}`}
                onClick={() => setCurrentFilter(category)}
              >
                {categoryTranslations[category] || category}
              </button>
            ))}
          </div>
        </div>

        <div className="sort-section">
          <label htmlFor="sort">Ordenar por:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Nombre</option>
            <option value="price-low">Precio: Menor a Mayor</option>
            <option value="price-high">Precio: Mayor a Menor</option>
          </select>
        </div>

        <div className="view-controls">
          <button
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <Grid size={18} />
          </button>
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="no-products">
          <p>No se encontraron productos {searchTerm ? `para "${searchTerm}"` : 'en esta categoría'}.</p>
        </div>
      ) : (
        <div className={`products-grid ${viewMode}`}>
          {filteredAndSortedProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  onClick={() => setSelectedProduct(product)}
                />
                <div className="product-category">
                  {categoryTranslations[product.category] || product.category}
                </div>
              </div>
              <div className="product-info">
                <h3 className="product-name" onClick={() => setSelectedProduct(product)}>
                  {product.name}
                </h3>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">{formatPrice(product.price)}</span>
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    Agregar al Carrito
                  </button>
                </div>
                <div className="product-stock">
                  Stock: {product.stock} unidades
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};

export default ProductList;