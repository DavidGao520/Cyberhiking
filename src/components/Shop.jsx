import { useState } from 'react';
import { equipment, equipmentCategories, getEquipmentByCategory } from '../data/equipment.js';
import './Shop.css';

const ITEM_ICONS = {
  'backpack-ultralight': '🎒', 'backpack-standard': '🎒',
  'trekking-poles': '🥾', 'knee-pads': '🦵', 'tent-4season': '⛺',
  'raincoat': '🧥', 'goggles': '🥽', 'gloves': '🧤', 'sleeping-bag': '🛏️',
  'food-ration': '🍱', 'water-bottle': '💧', 'first-aid': '🩹',
  'gps-device': '📡', 'satellite-phone': '📱', 'solar-charger': '🔋'
};

const CAT_ICONS = { core: '🎒', survival: '🏕️', supplies: '📦', special: '⚡' };

function getEffectTags(item) {
  const tags = [];
  const e = item.effect;
  if (e.maxWeight) tags.push({ label: `${e.maxWeight}kg capacity`, color: '#818cf8' });
  if (e.energyReduction) tags.push({ label: `-${(e.energyReduction * 100).toFixed(0)}% energy`, color: '#fbbf24' });
  if (e.canCamp) tags.push({ label: 'Camp anywhere', color: '#34d399' });
  if (e.coldResistance) tags.push({ label: `Cold +${e.coldResistance}`, color: '#60a5fa' });
  if (e.rainProtection) tags.push({ label: 'Rain proof', color: '#38bdf8' });
  if (e.windProtection) tags.push({ label: 'Wind proof', color: '#a78bfa' });
  if (e.restBonus) tags.push({ label: `Rest ×${e.restBonus}`, color: '#f472b6' });
  if (e.navigationBonus) tags.push({ label: `Nav +${(e.navigationBonus * 100).toFixed(0)}%`, color: '#2dd4bf' });
  if (e.emergencyHelp) tags.push({ label: 'SOS rescue', color: '#f87171' });
  if (e.devicePower) tags.push({ label: 'Power devices', color: '#facc15' });
  if (e.food) tags.push({ label: `+${e.food}k cal`, color: '#4ade80' });
  if (e.water) tags.push({ label: `+${e.water}L water`, color: '#38bdf8' });
  if (e.health) tags.push({ label: `+${e.health} health`, color: '#f87171' });
  if (e.downhillProtection) tags.push({ label: 'Downhill guard', color: '#a78bfa' });
  if (e.visibilityBonus) tags.push({ label: `Visibility +${e.visibilityBonus}`, color: '#c084fc' });
  return tags;
}

function Shop({ money, maxWeight, currentWeight, onPurchase }) {
  const [selectedCategory, setSelectedCategory] = useState('core');
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
    let count = 0;
    Object.entries(cart).forEach(([itemId, quantity]) => {
      if (quantity > 0) {
        const item = equipment.find(eq => eq.id === itemId);
        if (item) {
          totalPrice += item.price * quantity;
          totalWeight += item.weight * quantity;
          count += quantity;
        }
      }
    });
    return { price: totalPrice, weight: totalWeight, count };
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
  const remaining = money - cartTotal.price;
  const totalWeight = currentWeight + cartTotal.weight;
  const canAfford = remaining >= 0;
  const weightOK = totalWeight <= maxWeight;
  const weightPct = Math.min(100, (totalWeight / maxWeight) * 100);

  return (
    <div className="shop-container">
      {/* Header */}
      <div className="shop-header">
        <div className="shop-header-left">
          <h2 className="shop-title">Outfitter</h2>
          <p className="shop-subtitle">Gear up before you hit the Pacific Crest Trail</p>
        </div>
        <div className="shop-budget">
          <div className="budget-item">
            <span className="budget-label">Budget</span>
            <span className={`budget-value ${!canAfford ? 'over' : ''}`}>
              ${remaining.toLocaleString()}
              <span className="budget-total">/ ${money.toLocaleString()}</span>
            </span>
          </div>
          <div className="budget-item">
            <span className="budget-label">Pack Weight</span>
            <div className="weight-bar-wrap">
              <div className="weight-bar-track">
                <div
                  className={`weight-bar-fill ${weightPct > 90 ? 'danger' : weightPct > 70 ? 'warn' : ''}`}
                  style={{ width: `${weightPct}%` }}
                ></div>
              </div>
              <span className={`weight-text ${!weightOK ? 'over' : ''}`}>
                {totalWeight.toFixed(1)} / {maxWeight}kg
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="shop-categories">
        {Object.entries(equipmentCategories).map(([key, name]) => (
          <button
            key={key}
            className={`category-tab ${selectedCategory === key ? 'active' : ''}`}
            onClick={() => setSelectedCategory(key)}
          >
            <span className="cat-icon">{CAT_ICONS[key]}</span>
            {name}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="shop-items">
        {categoryItems.map(item => {
          const quantity = cart[item.id] || 0;
          const tags = getEffectTags(item);
          const tooExpensive = item.price > remaining + (quantity * item.price);
          return (
            <div key={item.id} className={`shop-item ${quantity > 0 ? 'in-cart' : ''}`}>
              <div className="item-icon-wrap">
                <span className="item-icon-emoji">{ITEM_ICONS[item.id] || '📦'}</span>
              </div>
              <div className="item-body">
                <div className="item-top">
                  <span className="item-name">{item.name}</span>
                  <span className="item-price-tag">${item.price.toLocaleString()}</span>
                </div>
                <p className="item-desc">{item.description}</p>
                <div className="item-meta">
                  <span className="item-weight">⚖️ {item.weight}kg</span>
                  <div className="item-tags">
                    {tags.map((t, i) => (
                      <span key={i} className="effect-tag" style={{ '--tag-color': t.color }}>{t.label}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="item-actions">
                <button
                  className="qty-btn minus"
                  onClick={() => addToCart(item.id, -1)}
                  disabled={quantity <= 0}
                >−</button>
                <span className={`qty-value ${quantity > 0 ? 'active' : ''}`}>{quantity}</span>
                <button
                  className="qty-btn plus"
                  onClick={() => addToCart(item.id, 1)}
                  disabled={tooExpensive && quantity === 0}
                >+</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="shop-footer">
        <div className="cart-info">
          <div className="cart-row">
            <span>🛒 {cartTotal.count} items</span>
            <span className="cart-price">${cartTotal.price.toLocaleString()}</span>
          </div>
          <div className="cart-row sub">
            <span>Weight added</span>
            <span>+{cartTotal.weight.toFixed(1)}kg</span>
          </div>
          {!canAfford && <div className="cart-warn">Over budget!</div>}
          {!weightOK && <div className="cart-warn">Too heavy!</div>}
        </div>
        <button
          className="btn-depart"
          onClick={handleConfirm}
          disabled={!canAfford || !weightOK || cartTotal.count === 0}
        >
          Purchase & Depart →
        </button>
      </div>
    </div>
  );
}

export default Shop;
