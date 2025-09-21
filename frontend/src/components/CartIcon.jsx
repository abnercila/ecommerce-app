import React from 'react';
import { useCart } from '../CartContext';

const CartIcon = ({ onOpen }) => {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <button className="cart-icon" onClick={onOpen}>
      <span>🛒</span>
      {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
    </button>
  );
};

export default CartIcon;