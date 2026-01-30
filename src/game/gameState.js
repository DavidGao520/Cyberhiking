import { routeData, getRoutePoint } from '../data/route.js';
import { getWeather, getCurrentTemperature } from '../data/weather.js';
import { events } from '../data/events.js';

export class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    this.currentLocation = 0;
    this.health = 100;
    this.energy = 100;
    this.mental = 100; // Mental state
    this.food = 50; // Food in calories (thousands) - starting with ~50,000 calories
    this.water = 10; // Water in liters
    this.time = 0; // hours
    this.distance = 0;
    this.isDead = false;
    this.isComplete = false;
    this.currentEvent = null;
    this.resultMessage = null; // Message to show after action
    this.log = [];
    this.equipment = []; // Array of equipment items
    this.maxWeight = 25; // Default max weight (kg)
    this.currentWeight = 0;
    this.money = 20000; // Starting money ($)
    this.lntScore = 100; // Leave No Trace score (0-200, 100 is neutral)
    this.dailyCalorieNeed = 4000; // Base daily calorie requirement (increases with distance)
    this.bmr = 1800; // Base Metabolic Rate (calories per day)
    this.updateWeather();
  }

  updateWeather() {
    const location = getRoutePoint(this.currentLocation);
    this.weather = getWeather(location.elevation);
    this.temperature = getCurrentTemperature(location.elevation, this.weather);
  }

  addLog(message) {
    this.log.unshift({
      time: this.time,
      message,
      timestamp: new Date().toLocaleTimeString()
    });
    if (this.log.length > 50) {
      this.log.pop();
    }
  }

  // Move forward to next location
  moveForward() {
    if (this.isDead || this.isComplete) return false;
    if (this.currentLocation >= routeData.length - 1) {
      this.complete();
      return true;
    }

    const currentPoint = getRoutePoint(this.currentLocation);
    const nextPoint = getRoutePoint(this.currentLocation + 1);
    const distance = nextPoint.distance - currentPoint.distance;
    
    // Simplified energy calculation for better gameplay
    // Base: ~15-25% energy per segment, more for longer/steeper sections
    const elevationGain = Math.max(0, nextPoint.elevation - currentPoint.elevation);
    const elevationFactor = 1 + (elevationGain / 5000) * 0.3; // Gentler elevation impact
    
    // Base energy cost: roughly 1% per mile
    const baseEnergyCost = distance * 1.0;
    
    // Apply elevation factor
    let energyCost = baseEnergyCost * elevationFactor;
    
    // Apply equipment effects
    const energyReduction = this.equipment.reduce((sum, eq) => {
      return sum + (eq.effect?.energyReduction || 0);
    }, 0);
    energyCost *= (1 - energyReduction);
    
    // Weather modifier (mild impact)
    const weatherModifier = 1 + (Math.abs(this.weather?.energyModifier || 0) / 200);
    energyCost *= weatherModifier;
    
    // Cap energy cost at reasonable level (15-35% per segment)
    energyCost = Math.min(35, Math.max(10, energyCost));

    // Check if player has enough energy
    if (this.energy < energyCost) {
      this.resultMessage = {
        title: 'Too Exhausted',
        text: `You're too tired to continue.\nCurrent energy: ${Math.round(this.energy)}%\nRequired: ${Math.round(energyCost)}%\n\nRest to recover your energy.`,
        isSuccess: false
      };
      this.addLog("You're too exhausted to continue. Rest first.");
      return false;
    }

    // Calculate time and resource costs
    const hoursToTravel = distance / 2.5; // Average hiking speed: 2.5 mph
    const foodCost = distance * 0.15; // ~0.15 food units per mile (reasonable consumption)
    const waterCost = distance / 15; // ~15 miles per liter

    this.energy = Math.max(0, this.energy - energyCost);
    this.food = Math.max(0, this.food - foodCost);
    this.water = Math.max(0, this.water - waterCost);
    this.time += hoursToTravel;
    this.distance = nextPoint.distance;
    this.currentLocation++;

    // Update daily calorie need (increases with distance - "Hiker Hunger")
    this.dailyCalorieNeed = 4000 + (this.distance / 100) * 100; // +100 cal per 100 miles

    this.updateWeather();
    this.addLog(`Reached ${nextPoint.name} (${nextPoint.elevation}ft). Distance: ${this.distance.toFixed(1)} miles.`);

    // Always trigger a random event first
    this.triggerEvent();
    
    // Mark if this location has resupply available (for the Resupply button)
    this.canResupply = (nextPoint.type === 'resupply' || nextPoint.type === 'camp');

    // Periodic status check (every 10 miles)
    if (Math.floor(this.distance) % 10 === 0) {
      this.checkStatus();
    }
    
    return true;
  }

  // Check if current location has resupply
  hasResupply() {
    const location = getRoutePoint(this.currentLocation);
    return location?.type === 'resupply' || location?.type === 'camp';
  }

  // Open resupply shop
  openResupply() {
    if (!this.hasResupply()) return false;
    
    const location = getRoutePoint(this.currentLocation);
    const resupplyEvent = {
      id: 'resupply-station',
      name: `${location.name} Store`,
      description: `Welcome to ${location.name}!\n${location.description}\n\n💰 Your money: $${this.money.toFixed(0)}\n🍽️ Food: ${this.food.toFixed(1)}k cal\n💧 Water: ${this.water.toFixed(1)}L`,
      options: [
        { 
          text: `🍽️ Buy food pack ($50) → +10k cal`, 
          effect: { food: 10, money: -50 }, 
          success: 1.0, 
          lntChange: 0,
          requireMoney: 50
        },
        { 
          text: `🍔 Buy meal ($30) → +5k cal, +20⚡`, 
          effect: { food: 5, energy: 20, money: -30 }, 
          success: 1.0, 
          lntChange: 0,
          requireMoney: 30
        },
        { 
          text: `💧 Refill water ($5) → +3L`, 
          effect: { water: 3, money: -5 }, 
          success: 1.0, 
          lntChange: 0,
          requireMoney: 5
        },
        { 
          text: `Leave store`, 
          effect: {}, 
          success: 1.0, 
          lntChange: 0 
        }
      ]
    };
    this.currentEvent = resupplyEvent;
    return true;
  }

  // Rest at current location
  rest() {
    if (this.isDead || this.isComplete) return false;

    const restTime = 8; // hours
    const foodCost = 1; // 1 food unit per rest
    const waterCost = 0.5;

    if (this.food < foodCost || this.water < waterCost) {
      const issues = [];
      if (this.food < foodCost) {
        issues.push(`🍽️ Food: ${this.food.toFixed(1)}k cal (need ${foodCost}k)`);
      }
      if (this.water < waterCost) {
        issues.push(`💧 Water: ${this.water.toFixed(1)}L (need ${waterCost}L)`);
      }
      this.resultMessage = {
        title: 'Cannot Rest',
        text: `Not enough supplies to rest properly!\n\n${issues.join('\n')}\n\nTip: Look for resupply events or find water sources while hiking. Some events offer food and water.`,
        isSuccess: false
      };
      this.addLog("Not enough supplies to rest properly.");
      return false;
    }

    // Check if player has tent for camping (only needed in wilderness)
    const hasTent = this.equipment.some(eq => eq.effect?.canCamp);
    const currentPoint = getRoutePoint(this.currentLocation);
    const isResupplyPoint = currentPoint?.type === 'resupply' || currentPoint?.type === 'camp';
    
    if (!hasTent && !isResupplyPoint && this.currentLocation > 0) {
      this.resultMessage = {
        title: 'Cannot Camp Here',
        text: 'You need a tent to camp in the wilderness.\nHead to a resupply point or get a tent.',
        isSuccess: false
      };
      this.addLog("You need a tent to camp in the wilderness.");
      return false;
    }

    // Track before values
    const beforeEnergy = this.energy;
    const beforeHealth = this.health;
    const beforeMental = this.mental;

    // Base energy recovery: 50%
    let energyGain = 50;
    
    // Bonus from sleeping bag
    const sleepingBag = this.equipment.find(eq => eq.effect?.restBonus);
    if (sleepingBag) {
      energyGain *= sleepingBag.effect.restBonus;
    }

    this.time += restTime;
    this.energy = Math.min(100, this.energy + energyGain);
    this.food -= foodCost;
    this.water -= waterCost;
    this.health = Math.min(100, this.health + 10);
    this.mental = Math.min(100, this.mental + 10);

    // Generate rest result message
    const messages = [
      `You rested for ${restTime} hours.`,
      '',
      `⚡ Energy: ${Math.round(beforeEnergy)} → ${Math.round(this.energy)} (+${Math.round(this.energy - beforeEnergy)})`,
      `❤️ Health: ${Math.round(beforeHealth)} → ${Math.round(this.health)} (+${Math.round(this.health - beforeHealth)})`,
      `🧠 Mental: ${Math.round(beforeMental)} → ${Math.round(this.mental)} (+${Math.round(this.mental - beforeMental)})`,
      '',
      `Used: 1 food, 0.5L water`
    ];

    this.resultMessage = {
      title: 'Well Rested',
      text: messages.join('\n'),
      isSuccess: true
    };

    this.addLog(`Rested for ${restTime} hours. Energy restored to ${Math.round(this.energy)}%.`);
    this.checkStatus();
    return true;
  }

  // Trigger random event (weighted by LNT score and location)
  triggerEvent() {
    let availableEvents = [...events];
    
    // High LNT score increases chance of positive events
    if (this.lntScore > 120) {
      // More likely to get trail magic, trail family
      const positiveEvents = events.filter(e => e.id === 'resupply' || e.id === 'trail-family');
      availableEvents = [...availableEvents, ...positiveEvents];
    }
    
    // Low LNT score increases chance of negative events
    if (this.lntScore < 80) {
      // More likely to get ranger check, wildlife issues
      const negativeEvents = events.filter(e => e.id === 'ranger' || e.id === 'wildlife-feed');
      availableEvents = [...availableEvents, ...negativeEvents];
    }
    
    // Location-based events
    const location = getRoutePoint(this.currentLocation);
    if (location.elevation > 10000) {
      // High altitude events
      const snowEvent = events.find(e => e.id === 'snow');
      if (snowEvent) availableEvents.push(snowEvent);
    }
    if (location.elevation < 3000 && this.temperature > 85) {
      // Desert heat events
      const heatEvent = events.find(e => e.id === 'heat');
      if (heatEvent) availableEvents.push(heatEvent);
    }
    
    // Filter out undefined events
    availableEvents = availableEvents.filter(e => e !== undefined);
    
    if (availableEvents.length === 0) {
      availableEvents = events; // Fallback to all events
    }
    
    this.currentEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];
    this.addLog(`Event: ${this.currentEvent.name}`);
  }

  // Handle event choice
  handleEvent(optionIndex) {
    if (!this.currentEvent) return false;

    const option = this.currentEvent.options[optionIndex];
    const eventName = this.currentEvent.name;
    
    // Check if option requires money
    if (option.requireMoney && this.money < option.requireMoney) {
      this.resultMessage = {
        title: 'Not Enough Money',
        text: `You need $${option.requireMoney} but only have $${this.money.toFixed(0)}.\n\nTry a different option.`,
        isSuccess: false
      };
      // Don't clear the event - let player choose again
      return false;
    }
    
    const success = Math.random() < option.success;
    
    // Track changes for result message
    const beforeEnergy = this.energy;
    const beforeHealth = this.health;
    const beforeMental = this.mental;
    const beforeFood = this.food;
    const beforeWater = this.water;
    const beforeMoney = this.money;

    let resultTitle = '';
    let resultText = '';

    if (success) {
      this.applyEffects(option.effect);
      resultTitle = 'Success!';
      resultText = this.generateSuccessMessage(option, eventName, beforeEnergy, beforeHealth, beforeMental, beforeFood, beforeWater, beforeMoney);
      this.addLog(`Success: ${option.text}`);
    } else {
      // Failure has worse effects
      const failureEffect = {
        ...option.effect,
        energy: (option.effect.energy || 0) * 1.5,
        health: (option.effect.health || 0) * 1.5
      };
      this.applyEffects(failureEffect);
      resultTitle = 'Failed...';
      resultText = this.generateFailureMessage(option, eventName, beforeEnergy, beforeHealth, beforeMental);
      this.addLog(`Failed: ${option.text} - Things got worse.`);
    }

    // Update LNT score if option has lntChange
    if (option.lntChange !== undefined) {
      this.updateLNTScore(option.lntChange, option.text);
    }

    // Handle weight changes from events
    if (option.effect.weight) {
      this.currentWeight = Math.max(0, this.currentWeight + option.effect.weight);
    }

    // Set result message to display
    this.resultMessage = {
      title: resultTitle,
      text: resultText,
      isSuccess: success
    };

    this.currentEvent = null;
    this.checkStatus();
    return true;
  }

  // Generate success message based on effects
  generateSuccessMessage(option, eventName, beforeEnergy, beforeHealth, beforeMental, beforeFood, beforeWater, beforeMoney) {
    const messages = [];
    const effect = option.effect;
    
    // Money spent (show first for purchases)
    if (effect.money && effect.money < 0) {
      messages.push(`💰 Spent: $${Math.abs(effect.money)}`);
    }
    
    if (effect.food > 0) {
      messages.push(`🍽️ Food: ${beforeFood?.toFixed(1) || '0'}k → ${this.food.toFixed(1)}k cal (+${effect.food}k)`);
    }
    
    if (effect.water > 0) {
      messages.push(`💧 Water: +${effect.water}L`);
    }
    
    if (effect.energy > 0) {
      messages.push(`⚡ Energy: ${Math.round(beforeEnergy)} → ${Math.round(this.energy)} (+${Math.round(this.energy - beforeEnergy)})`);
    } else if (effect.energy < 0) {
      messages.push(`⚡ Energy: ${Math.round(beforeEnergy)} → ${Math.round(this.energy)}`);
    }
    
    if (effect.health > 0) {
      messages.push(`❤️ Health: +${Math.round(this.health - beforeHealth)}`);
    }
    
    if (effect.mental > 0) {
      messages.push(`🧠 Spirits lifted! +${Math.round(this.mental - beforeMental)}`);
    }
    
    if (effect.time > 0) {
      messages.push(`⏱️ Time: ${effect.time} hours`);
    }
    
    if (messages.length === 0) {
      messages.push('You handled the situation well.');
    }
    
    return messages.join('\n');
  }

  // Generate failure message
  generateFailureMessage(option, eventName, beforeEnergy, beforeHealth, beforeMental) {
    const messages = ['Things didn\'t go as planned...'];
    
    if (this.energy < beforeEnergy) {
      messages.push(`Energy drained: ${Math.round(beforeEnergy)} → ${Math.round(this.energy)}`);
    }
    
    if (this.health < beforeHealth) {
      messages.push(`Health damaged: ${Math.round(beforeHealth)} → ${Math.round(this.health)}`);
    }
    
    if (this.mental < beforeMental) {
      messages.push(`Morale dropped: ${Math.round(beforeMental)} → ${Math.round(this.mental)}`);
    }
    
    return messages.join('\n');
  }

  // Apply effects to game state
  applyEffects(effects) {
    if (effects.energy) this.energy = Math.max(0, Math.min(100, this.energy + effects.energy));
    if (effects.health) this.health = Math.max(0, Math.min(100, this.health + effects.health));
    if (effects.mental) this.mental = Math.max(0, Math.min(100, this.mental + effects.mental));
    if (effects.food) this.food = Math.max(0, this.food + effects.food);
    if (effects.water) this.water = Math.max(0, this.water + effects.water);
    if (effects.time) this.time += effects.time;
    if (effects.money) this.money = Math.max(0, this.money + effects.money);
  }

  // Check player status and death conditions
  checkStatus() {
    // Death conditions
    if (this.health <= 0) {
      this.isDead = true;
      this.addLog("You have died. Your body temperature dropped too low.");
      return;
    }

    if (this.energy <= 0) {
      this.isDead = true;
      this.addLog("You collapsed from exhaustion.");
      return;
    }

    if (this.water <= 0) {
      this.health -= 5;
      this.addLog("Severe dehydration. Health declining.");
      if (this.health <= 0) {
        this.isDead = true;
        this.addLog("You died from dehydration.");
        return;
      }
    }

    // Food/Calorie system: if food is too low, body starts consuming muscle (health)
    if (this.food <= 0) {
      // Body enters starvation mode - health declines as body consumes itself
      this.health -= 3;
      this.energy = Math.max(0, this.energy - 5);
      this.addLog("Starvation. Your body is consuming itself for energy.");
      if (this.health <= 0) {
        this.isDead = true;
        this.addLog("You died from starvation.");
        return;
      }
    } else if (this.food < 5) {
      // Low food warning
      this.energy = Math.max(0, this.energy - 1);
      this.addLog("Low food supplies. Energy declining.");
    }
    
    // Check if calorie intake is insufficient for daily needs
    const dailyFoodConsumed = (this.bmr / 24) * (this.time % 24) / 1000;
    if (this.food < dailyFoodConsumed * 0.5) {
      // Not enough calories - body can't maintain energy
      this.energy = Math.max(0, this.energy - 2);
    }

    // Temperature effects (reduced by equipment)
    let coldResistance = 0;
    let heatProtection = 0;
    this.equipment.forEach(eq => {
      if (eq.effect?.coldResistance) coldResistance += eq.effect.coldResistance;
    });

    if (this.temperature < 20) {
      const coldDamage = Math.max(0, 2 - coldResistance * 0.1);
      if (coldDamage > 0) {
        this.health -= coldDamage;
        this.addLog("Hypothermia risk. Health declining.");
      }
    } else if (this.temperature > 90) {
      this.energy -= 3;
      this.water -= 0.5;
      this.addLog("Heat exhaustion. Energy and water declining.");
    }

    // Natural recovery
    if (this.health < 100 && this.energy > 50 && this.food > 0 && this.water > 0) {
      this.health = Math.min(100, this.health + 0.5);
    }
  }

  // Complete the trail
  complete() {
    this.isComplete = true;
    this.addLog("Congratulations! You've completed the Pacific Crest Trail!");
  }

  // Purchase equipment
  purchaseEquipment(items) {
    const totalCost = items.reduce((sum, { item, quantity }) => sum + item.price * quantity, 0);
    const totalWeight = items.reduce((sum, { item, quantity }) => sum + item.weight * quantity, 0);

    if (totalCost > this.money) {
      return { success: false, message: "Not enough money." };
    }

    if (this.currentWeight + totalWeight > this.maxWeight) {
      return { success: false, message: "Exceeds weight limit." };
    }

    this.money -= totalCost;
    this.currentWeight += totalWeight;

    // Add equipment to inventory
    items.forEach(({ item, quantity }) => {
      for (let i = 0; i < quantity; i++) {
        this.equipment.push({ ...item });
      }
    });

    // Update max weight if backpack purchased
    const backpack = this.equipment.find(eq => eq.effect?.maxWeight);
    if (backpack) {
      this.maxWeight = backpack.effect.maxWeight;
    }

    return { success: true, message: "Equipment purchased successfully." };
  }

  // Update LNT score based on actions
  updateLNTScore(change, reason) {
    this.lntScore = Math.max(0, Math.min(200, this.lntScore + change));
    if (change !== 0) {
      this.addLog(`LNT Score: ${change > 0 ? '+' : ''}${change} (${reason}). Current: ${this.lntScore}`);
    }
  }
}

