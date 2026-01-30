// Equipment shop data
export const equipmentCategories = {
  core: 'Core Backpack',
  survival: 'Survival Gear',
  supplies: 'Supplies',
  special: 'Special Gear'
};

export const equipment = [
  // Core Backpack
  {
    id: 'backpack-ultralight',
    name: 'Ultralight Backpack',
    category: 'core',
    weight: 0.8,
    price: 1200,
    description: 'Lightweight design | Increases max weight capacity',
    effect: { maxWeight: 30 }
  },
  {
    id: 'backpack-standard',
    name: 'Standard Backpack',
    category: 'core',
    weight: 1.5,
    price: 600,
    description: 'Standard capacity | Reliable and durable',
    effect: { maxWeight: 25 }
  },
  
  // Survival Gear
  {
    id: 'trekking-poles',
    name: 'Carbon Fiber Trekking Poles',
    category: 'survival',
    weight: 0.48,
    price: 900,
    description: 'Reduce energy consumption | Improve travel efficiency',
    effect: { energyReduction: 0.15 }
  },
  {
    id: 'knee-pads',
    name: 'Professional Knee Pads',
    category: 'survival',
    weight: 0.25,
    price: 480,
    description: 'Reduce energy consumption | Protect knee joints, reduce downhill pressure',
    effect: { energyReduction: 0.1, downhillProtection: true }
  },
  {
    id: 'tent-4season',
    name: 'Alpine Four-Season Tent',
    category: 'survival',
    weight: 2.8,
    price: 5800,
    description: 'Allows wilderness camping | Shelter from blizzards',
    effect: { canCamp: true, coldResistance: 15 }
  },
  {
    id: 'raincoat',
    name: 'Lightweight Raincoat',
    category: 'survival',
    weight: 0.3,
    price: 800,
    description: 'Rainproof and windproof | Prevent getting wet and hypothermia',
    effect: { rainProtection: true, coldResistance: 5 }
  },
  {
    id: 'goggles',
    name: 'Windproof Goggles',
    category: 'survival',
    weight: 0.12,
    price: 750,
    description: 'Both windproof and protective | Anti-fog coating',
    effect: { windProtection: true, visibilityBonus: 10 }
  },
  {
    id: 'gloves',
    name: 'Windproof Warm Gloves',
    category: 'survival',
    weight: 0.25,
    price: 350,
    description: 'Warm and windproof | Reduce body temperature penalties from cold weather',
    effect: { coldResistance: 8 }
  },
  {
    id: 'sleeping-bag',
    name: 'Down Sleeping Bag',
    category: 'survival',
    weight: 1.2,
    price: 1200,
    description: 'Extreme cold protection | Restore more energy when camping',
    effect: { coldResistance: 20, restBonus: 1.2 }
  },
  
  // Supplies
  {
    id: 'food-ration',
    name: 'Food Ration',
    category: 'supplies',
    weight: 0.5,
    price: 50,
    description: 'Basic nutrition | Restores food supply',
    effect: { food: 5 }
  },
  {
    id: 'water-bottle',
    name: 'Water Bottle',
    category: 'supplies',
    weight: 0.3,
    price: 30,
    description: 'Water container | Restores water supply',
    effect: { water: 5 }
  },
  {
    id: 'first-aid',
    name: 'First Aid Kit',
    category: 'supplies',
    weight: 0.4,
    price: 200,
    description: 'Medical supplies | Restores health',
    effect: { health: 20 }
  },
  
  // Special Gear
  {
    id: 'gps-device',
    name: 'GPS Device',
    category: 'special',
    weight: 0.2,
    price: 1500,
    description: 'Navigation aid | Reduces chance of getting lost',
    effect: { navigationBonus: 0.3 }
  },
  {
    id: 'satellite-phone',
    name: 'Satellite Phone',
    category: 'special',
    weight: 0.5,
    price: 3000,
    description: 'Emergency communication | Can call for help in critical situations',
    effect: { emergencyHelp: true }
  },
  {
    id: 'solar-charger',
    name: 'Solar Charger',
    category: 'special',
    weight: 0.3,
    price: 800,
    description: 'Charge devices | Keep electronics powered',
    effect: { devicePower: true }
  }
];

export const getEquipmentByCategory = (category) => {
  return equipment.filter(item => item.category === category);
};

export const getEquipmentById = (id) => {
  return equipment.find(item => item.id === id);
};

