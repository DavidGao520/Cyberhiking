// Weather system based on elevation and season
export const weatherTypes = {
  clear: { name: 'Clear', tempModifier: 0, energyModifier: 0, visibility: 100 },
  sunny: { name: 'Sunny', tempModifier: 5, energyModifier: -2, visibility: 100 },
  cloudy: { name: 'Cloudy', tempModifier: -2, energyModifier: 0, visibility: 80 },
  rain: { name: 'Rain', tempModifier: -5, energyModifier: -5, visibility: 60 },
  heavyRain: { name: 'Heavy Rain', tempModifier: -8, energyModifier: -10, visibility: 40 },
  snow: { name: 'Snow', tempModifier: -15, energyModifier: -15, visibility: 50 },
  blizzard: { name: 'Blizzard', tempModifier: -25, energyModifier: -25, visibility: 20 },
  fog: { name: 'Fog', tempModifier: -3, energyModifier: -5, visibility: 30 },
  thunderstorm: { name: 'Thunderstorm', tempModifier: -5, energyModifier: -12, visibility: 50 },
  extremeHeat: { name: 'Extreme Heat', tempModifier: 15, energyModifier: -20, visibility: 100 }
};

// Base temperature calculation based on elevation
export const getBaseTemperature = (elevation) => {
  // Temperature decreases ~3.5°F per 1000ft elevation
  const seaLevelTemp = 70; // Base temperature at sea level
  return seaLevelTemp - (elevation / 1000) * 3.5;
};

// Get weather based on elevation and random chance
export const getWeather = (elevation) => {
  const baseTemp = getBaseTemperature(elevation);
  const weatherChance = Math.random();
  
  // High elevation: more likely snow/blizzard
  if (elevation > 10000) {
    if (weatherChance < 0.3) return weatherTypes.blizzard;
    if (weatherChance < 0.5) return weatherTypes.snow;
    if (weatherChance < 0.7) return weatherTypes.fog;
    return weatherTypes.cloudy;
  }
  
  // Medium elevation: mixed weather
  if (elevation > 5000) {
    if (weatherChance < 0.1) return weatherTypes.snow;
    if (weatherChance < 0.2) return weatherTypes.rain;
    if (weatherChance < 0.3) return weatherTypes.fog;
    if (weatherChance < 0.5) return weatherTypes.cloudy;
    return weatherTypes.clear;
  }
  
  // Low elevation/desert: heat and clear
  if (elevation < 3000) {
    if (weatherChance < 0.2) return weatherTypes.extremeHeat;
    if (weatherChance < 0.3) return weatherTypes.sunny;
    if (weatherChance < 0.4) return weatherTypes.thunderstorm;
    return weatherTypes.clear;
  }
  
  // Default
  if (weatherChance < 0.2) return weatherTypes.rain;
  if (weatherChance < 0.4) return weatherTypes.cloudy;
  return weatherTypes.clear;
};

export const getCurrentTemperature = (elevation, weather) => {
  const baseTemp = getBaseTemperature(elevation);
  return Math.round(baseTemp + weather.tempModifier);
};

