import { useState } from 'react';
import { equipment, equipmentCategories, getEquipmentByCategory } from '../data/equipment.js';
import './Shop.css';

function Shop({ money, maxWeight, currentWeight, onPurchase, onConfirm }) {
  const [selectedCategory, setSelectedCategory] = useState('survival');
  const [cart, setCart] = useState({});

  const addToCart = (itemId, quantity) => {
    setCart(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + quantity)
    }));
  };

  const getCartTotal = () => {
    let totalPrice = 0;
    let totalWeight = 0;
    Object.entries(cart).forEach(([itemId, quantity]) => {
      if (quantity > 0) {
        const item = equipment.find(eq => eq.id === itemId);
        if (item) {
          totalPrice += item.price * quantity;
          totalWeight += item.weight * quantity;
        }
      }
    });
    return { price: totalPrice, weight: totalWeight };
  };

  const handleConfirm = () => {
    const cartItems = Object.entries(cart)
      .filter(([_, qty]) => qty > 0)
      .map(([itemId, quantity]) => ({
        item: equipment.find(eq => eq.id === itemId),
        quantity
      }));
    
    onPurchase(cartItems, getCartTotal());
    setCart({});
  };

  const categoryItems = getEquipmentByCategory(selectedCategory);
  const cartTotal = getCartTotal();
  const canAfford = cartTotal.price <= money;
  const weightOK = (currentWeight + cartTotal.weight) <= maxWeight;

  return (
    <div className="shop-container">
      <div className="shop-header">
        <div className="shop-title">Outdoor Equipment Store</div>
        <div className="shop-stats">
          <div className="shop-stat">
            <span className="stat-icon">💰</span>
            <span>Money: {money}</span>
          </div>
          <div className="shop-stat">
            <span className="stat-icon">🎒</span>
            <span>Weight: {currentWeight.toFixed(1)} / {maxWeight}kg</span>
          </div>
        </div>
      </div>

      <div className="shop-categories">
        {Object.entries(equipmentCategories).map(([key, name]) => (
          <button
            key={key}
            className={`category-tab ${selectedCategory === key ? 'active' : ''}`}
            onClick={() => setSelectedCategory(key)}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="shop-items">
        {categoryItems.map(item => {
          const quantity = cart[item.id] || 0;
          return (
            <div key={item.id} className="shop-item">
              <div className="item-icon">📦</div>
              <div className="item-info">
                <div className="item-name">{item.name}</div>
                <div className="item-specs">
                  <span>Weight: {item.weight}kg</span>
                  <span className="item-price">
                    <span className="price-icon">💰</span>
                    {item.price}
                  </span>
                </div>
                <div className="item-description">{item.description}</div>
              </div>
              <div className="item-quantity">
                <button 
                  className="qty-btn" 
                  onClick={() => addToCart(item.id, -1)}
                  disabled={quantity <= 0}
                >
                  -
                </button>
                <span className="qty-value">{quantity}</span>
                <button 
                  className="qty-btn" 
                  onClick={() => addToCart(item.id, 1)}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="shop-footer">
        <div className="cart-summary">
          <div>Total: <span className="price-icon">💰</span> {cartTotal.price}</div>
          <div>Weight: {cartTotal.weight.toFixed(1)}kg</div>
        </div>
        <button 
          className="btn-confirm"
          onClick={handleConfirm}
          disabled={!canAfford || !weightOK || cartTotal.price === 0}
        >
          Selected, Depart →
        </button>
      </div>
    </div>
  );
}

export default Shop;

