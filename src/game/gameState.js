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
    this.debuffs = []; // Active debuffs array
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

  getEquipmentFlags() {
    return {
      hasGPS: this.equipment.some(eq => eq.effect?.navigationBonus),
      hasSatPhone: this.equipment.some(eq => eq.effect?.emergencyHelp),
      hasSolarCharger: this.equipment.some(eq => eq.effect?.devicePower),
      hasPoles: this.equipment.some(eq => eq.id === 'trekking-poles'),
      hasKneePads: this.equipment.some(eq => eq.effect?.downhillProtection),
      hasRaincoat: this.equipment.some(eq => eq.effect?.rainProtection),
      hasGoggles: this.equipment.some(eq => eq.effect?.windProtection),
      navigationBonus: this.equipment.reduce((sum, eq) => sum + (eq.effect?.navigationBonus || 0), 0),
    };
  }

  getEventEquipmentBonus(eventId) {
    const gear = this.getEquipmentFlags();
    let successBoost = 0;
    let damageReduction = 0;
    const helpers = [];

    switch (eventId) {
      case 'lost':
        if (gear.hasGPS) {
          successBoost += gear.navigationBonus;
          helpers.push('📡 GPS');
        }
        if (gear.hasGoggles) {
          successBoost += 0.05;
          helpers.push('🥽 Goggles');
        }
        if (gear.hasSolarCharger && gear.hasGPS) {
          successBoost += 0.05;
          helpers.push('🔋 Solar GPS');
        }
        break;

      case 'steep-descent':
        if (gear.hasPoles) {
          successBoost += 0.1;
          damageReduction += 0.25;
          helpers.push('🥾 Trekking poles');
        }
        if (gear.hasKneePads) {
          successBoost += 0.05;
          damageReduction += 0.2;
          helpers.push('🦵 Knee pads');
        }
        break;

      case 'river-crossing':
        if (gear.hasPoles) {
          successBoost += 0.1;
          damageReduction += 0.2;
          helpers.push('🥾 Trekking poles');
        }
        break;

      case 'storm':
        if (gear.hasRaincoat) {
          successBoost += 0.15;
          damageReduction += 0.4;
          helpers.push('🧥 Raincoat');
        }
        break;

      case 'snow':
        if (gear.hasGoggles) {
          successBoost += 0.1;
          damageReduction += 0.15;
          helpers.push('🥽 Goggles');
        }
        if (gear.hasRaincoat) {
          damageReduction += 0.1;
          helpers.push('🧥 Raincoat');
        }
        break;

      case 'injury':
        if (gear.hasKneePads) {
          successBoost += 0.1;
          damageReduction += 0.2;
          helpers.push('🦵 Knee pads');
        }
        if (gear.hasPoles) {
          successBoost += 0.05;
          helpers.push('🥾 Trekking poles');
        }
        break;

      case 'altitude-sickness':
        if (gear.hasGPS) {
          successBoost += 0.05;
          helpers.push('📡 GPS altitude');
        }
        break;

      case 'night-hiking':
        if (gear.hasSolarCharger) {
          successBoost += 0.1;
          helpers.push('🔋 Solar headlamp');
        }
        break;

      case 'equipment':
        if (gear.hasSolarCharger) {
          successBoost += 0.1;
          helpers.push('🔋 Solar charger');
        }
        break;

      case 'wildlife':
      case 'bear':
        if (gear.hasSatPhone) {
          successBoost += 0.05;
          helpers.push('📱 Sat phone ready');
        }
        break;
    }

    damageReduction = Math.min(0.6, damageReduction);
    return { successBoost, damageReduction, helpers };
  }

  attemptEmergencyRescue(cause) {
    const satPhoneIndex = this.equipment.findIndex(eq => eq.effect?.emergencyHelp);
    if (satPhoneIndex === -1) return false;

    const hasSolarCharger = this.equipment.some(eq => eq.effect?.devicePower);
    const healthRestore = hasSolarCharger ? 40 : 30;
    const energyRestore = hasSolarCharger ? 35 : 25;

    this.equipment.splice(satPhoneIndex, 1);
    this.currentWeight = Math.max(0, this.currentWeight - 0.5);

    this.health = healthRestore;
    this.energy = energyRestore;
    this.water = Math.max(this.water, 2);
    this.isDead = false;

    this.addLog(`EMERGENCY RESCUE! Satellite phone used. Cause: ${cause}.`);
    this.resultMessage = {
      title: '📱 Emergency Rescue!',
      text: `Your satellite phone saved your life!\nCause: ${cause}\n\nA rescue team arrived just in time.\n\n❤️ Health: ${Math.round(this.health)}\n⚡ Energy: ${Math.round(this.energy)}\n💧 Water: ${this.water.toFixed(1)}L\n\n⚠️ Satellite phone consumed.`,
      isSuccess: true
    };

    return true;
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
    
    // Weather modifier (mild impact, reduced by rain/wind gear)
    const gear = this.getEquipmentFlags();
    let weatherPenalty = Math.abs(this.weather?.energyModifier || 0);
    const weatherName = this.weather?.name || '';
    if (gear.hasRaincoat && ['Rain', 'Heavy Rain', 'Thunderstorm'].includes(weatherName)) {
      weatherPenalty *= 0.5;
    }
    if (gear.hasGoggles && ['Blizzard', 'Fog', 'Snow'].includes(weatherName)) {
      weatherPenalty *= 0.6;
    }
    const weatherModifier = 1 + (weatherPenalty / 200);
    energyCost *= weatherModifier;
    
    // Cap energy cost at reasonable level (15-35% per segment)
    energyCost = Math.min(35, Math.max(10, energyCost));

    // Forced march: if energy is insufficient, push through at the cost of health
    if (this.energy < energyCost) {
      const deficit = energyCost - this.energy;
      this.health -= deficit * 0.8;
      this.mental = Math.max(0, this.mental - 15);
      this.addLog("Forced march! Pushing through extreme exhaustion.");
    }

    const hoursToTravel = distance / 2.5;
    const foodCost = distance * 0.15;
    const waterCost = distance / 15;

    this.energy = Math.max(0, this.energy - energyCost);
    this.food = Math.max(0, this.food - foodCost);
    this.water = Math.max(0, this.water - waterCost);
    this.time += hoursToTravel;
    this.distance = nextPoint.distance;
    this.currentLocation++;

    this.dailyCalorieNeed = 4000 + (this.distance / 100) * 100;

    this.updateWeather();

    if (gear.hasSolarCharger) {
      this.mental = Math.min(100, this.mental + 1);
    }

    this.addLog(`Reached ${nextPoint.name} (${nextPoint.elevation}ft). Distance: ${this.distance.toFixed(1)} miles.`);

    // If forced march was fatal, resolve before triggering an event
    if (this.health <= 0) {
      if (!this.attemptEmergencyRescue('Collapsed during forced march')) {
        this.isDead = true;
        this.addLog("Your body gave out during a desperate push forward.");
      }
      return true;
    }

    this.triggerEvent();

    this.canResupply = (nextPoint.type === 'resupply' || nextPoint.type === 'camp');

    this.updateDebuffs();
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
    this.updateDebuffs();
    return true;
  }

  // Trigger random event using weighted selection
  triggerEvent() {
    const location = getRoutePoint(this.currentLocation);
    const weights = events.map(event => {
      let weight = 1.0;

      // LNT score modifies positive/negative event weights
      if (this.lntScore > 120) {
        if (event.type === 'positive') weight += 0.8;
        if (event.id === 'ranger') weight += 0.3;
      }
      if (this.lntScore < 80) {
        if (event.id === 'ranger' || event.id === 'wildlife-feed') weight += 1.0;
        if (event.type === 'positive') weight *= 0.5;
      }

      // Location-based weights
      if (location.elevation > 10000) {
        if (event.id === 'snow' || event.id === 'altitude-sickness') weight += 1.5;
      }
      if (location.elevation < 3000 && this.temperature > 85) {
        if (event.id === 'heat' || event.id === 'dehydration') weight += 1.5;
      }
      if (location.elevation > 6000) {
        if (event.id === 'steep-descent' || event.id === 'beautiful-vista') weight += 0.5;
      }

      // River crossings more likely in Sierra
      if (this.distance > 700 && this.distance < 1100) {
        if (event.id === 'river-crossing') weight += 1.0;
      }

      return weight;
    });

    // Weighted random selection
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let roll = Math.random() * totalWeight;
    let selected = events[0];
    for (let i = 0; i < events.length; i++) {
      roll -= weights[i];
      if (roll <= 0) {
        selected = events[i];
        break;
      }
    }

    this.currentEvent = selected;
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
    
    const equipBonus = this.getEventEquipmentBonus(this.currentEvent.id);
    const adjustedSuccess = Math.min(1.0, option.success + equipBonus.successBoost);
    const success = Math.random() < adjustedSuccess;

    const beforeEnergy = this.energy;
    const beforeHealth = this.health;
    const beforeMental = this.mental;
    const beforeFood = this.food;
    const beforeWater = this.water;
    const beforeMoney = this.money;

    let resultTitle = '';
    let resultText = '';

    if (success) {
      const modifiedEffect = { ...option.effect };
      if (equipBonus.damageReduction > 0) {
        if (modifiedEffect.energy && modifiedEffect.energy < 0) {
          modifiedEffect.energy *= (1 - equipBonus.damageReduction);
        }
        if (modifiedEffect.health && modifiedEffect.health < 0) {
          modifiedEffect.health *= (1 - equipBonus.damageReduction);
        }
      }
      this.applyEffects(modifiedEffect);
      resultTitle = 'Success!';
      resultText = this.generateSuccessMessage(option, eventName, beforeEnergy, beforeHealth, beforeMental, beforeFood, beforeWater, beforeMoney);
      this.addLog(`Success: ${option.text}`);
    } else {
      const damageMultiplier = 1.5 * (1 - equipBonus.damageReduction);
      const failureEffect = {
        ...option.effect,
        energy: (option.effect.energy || 0) * damageMultiplier,
        health: (option.effect.health || 0) * damageMultiplier
      };
      this.applyEffects(failureEffect);
      resultTitle = 'Failed...';
      resultText = this.generateFailureMessage(option, eventName, beforeEnergy, beforeHealth, beforeMental);
      this.addLog(`Failed: ${option.text} - Things got worse.`);
    }

    if (equipBonus.helpers.length > 0) {
      resultText += '\n\n🎒 Gear bonus: ' + equipBonus.helpers.join(' | ');
    }

    if (option.lntChange !== undefined) {
      this.updateLNTScore(option.lntChange, option.text);
    }

    if (option.effect.weight) {
      this.currentWeight = Math.max(0, this.currentWeight + option.effect.weight);
    }

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

  // Evaluate and update active debuffs based on current stats
  updateDebuffs() {
    const DEBUFF_DEFS = [
      { id: 'dehydration', name: 'Dehydration', stat: 'water', color: '#06b6d4', condition: () => this.water <= 2 },
      { id: 'severe-dehydration', name: 'Severe Dehydration', stat: 'water', color: '#ef4444', condition: () => this.water <= 0.5 },
      { id: 'hypothermia', name: 'Hypothermia', stat: 'temperature', color: '#3b82f6', condition: () => this.temperature < 25 },
      { id: 'heat-exhaustion', name: 'Heat Exhaustion', stat: 'temperature', color: '#f97316', condition: () => this.temperature > 95 },
      { id: 'starvation', name: 'Starvation', stat: 'food', color: '#f97316', condition: () => this.food <= 1 },
      { id: 'hunger', name: 'Hunger', stat: 'food', color: '#fbbf24', condition: () => this.food > 1 && this.food <= 5 },
      { id: 'exhaustion', name: 'Exhaustion', stat: 'energy', color: '#f59e0b', condition: () => this.energy <= 15 },
      { id: 'muscle-cramp', name: 'Muscle Cramp', stat: 'energy', color: '#d97706', condition: () => this.energy <= 30 && this.energy > 15 },
      { id: 'low-morale', name: 'Low Morale', stat: 'mental', color: '#a855f7', condition: () => this.mental <= 30 },
      { id: 'injured', name: 'Injured', stat: 'health', color: '#ef4444', condition: () => this.health <= 40 && this.health > 15 },
      { id: 'critical', name: 'Critical Condition', stat: 'health', color: '#dc2626', condition: () => this.health <= 15 },
      { id: 'altitude-sick', name: 'Altitude Sickness', stat: 'health', color: '#8b5cf6', condition: () => {
        const loc = getRoutePoint(this.currentLocation);
        return loc && loc.elevation > 10000 && this.health < 70;
      }},
      { id: 'overloaded', name: 'Overloaded', stat: 'energy', color: '#78716c', condition: () => this.currentWeight > this.maxWeight * 0.9 },
    ];

    this.debuffs = DEBUFF_DEFS.filter(d => d.condition()).map(d => ({
      id: d.id,
      name: d.name,
      stat: d.stat,
      color: d.color,
    }));
  }

  // Check player status and death conditions
  checkStatus() {
    if (this.health <= 0) {
      if (!this.attemptEmergencyRescue('Critical health failure')) {
        this.isDead = true;
        this.addLog("You have died. Your body gave out.");
      }
      return;
    }

    if (this.energy <= 0) {
      this.health -= 10;
      this.mental = Math.max(0, this.mental - 10);
      this.addLog("Extreme exhaustion. Your body is shutting down.");
      if (this.health <= 0) {
        if (!this.attemptEmergencyRescue('Total exhaustion')) {
          this.isDead = true;
          this.addLog("You collapsed and never got up.");
        }
        return;
      }
    }

    if (this.water <= 0) {
      this.health -= 5;
      this.addLog("Severe dehydration. Health declining.");
      if (this.health <= 0) {
        if (!this.attemptEmergencyRescue('Severe dehydration')) {
          this.isDead = true;
          this.addLog("You died from dehydration.");
        }
        return;
      }
    }

    if (this.food <= 0) {
      this.health -= 3;
      this.energy = Math.max(0, this.energy - 5);
      this.addLog("Starvation. Your body is consuming itself for energy.");
      if (this.health <= 0) {
        if (!this.attemptEmergencyRescue('Starvation')) {
          this.isDead = true;
          this.addLog("You died from starvation.");
        }
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

    // Update debuffs based on current state
    this.updateDebuffs();
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

    items.forEach(({ item, quantity }) => {
      for (let i = 0; i < quantity; i++) {
        if (item.category === 'supplies') {
          if (item.effect.food) this.food += item.effect.food;
          if (item.effect.water) this.water += item.effect.water;
          if (item.effect.health) this.health = Math.min(100, this.health + item.effect.health);
        } else {
          this.equipment.push({ ...item });
        }
      }
    });

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

