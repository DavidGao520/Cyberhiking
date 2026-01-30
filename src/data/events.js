// Random events that can occur during the hike
export const events = [
  {
    id: 'lost',
    name: 'Lost Trail',
    description: 'You\'ve lost the trail markers. The path ahead is unclear.',
    options: [
      { text: 'Use GPS to navigate', effect: { time: 2, energy: -5 }, success: 0.9, lntChange: 0 },
      { text: 'Follow instinct', effect: { time: 4, energy: -15 }, success: 0.6, lntChange: 0 },
      { text: 'Wait for better visibility', effect: { time: 6, energy: -10, food: -1 }, success: 0.8, lntChange: 0 }
    ]
  },
  {
    id: 'bear',
    name: 'Bear Encounter',
    description: 'A black bear is blocking the trail ahead. It hasn\'t noticed you yet.',
    options: [
      { text: 'Make noise to scare it away', effect: { energy: -5 }, success: 0.7, lntChange: 5 },
      { text: 'Wait quietly for it to leave', effect: { time: 3, energy: -10 }, success: 0.9, lntChange: 10 },
      { text: 'Take a detour', effect: { time: 5, energy: -20 }, success: 1.0, lntChange: -10 }
    ]
  },
  {
    id: 'water',
    name: 'Water Source Found',
    description: 'You\'ve discovered a natural spring. The water looks clear.',
    options: [
      { text: 'Drink immediately', effect: { water: 3, energy: 5 }, success: 0.8, lntChange: 0 },
      { text: 'Filter and purify first', effect: { water: 2, energy: 3, time: 1 }, success: 1.0, lntChange: 5 },
      { text: 'Fill containers and move on', effect: { water: 4, time: 2 }, success: 1.0, lntChange: 0 }
    ]
  },
  {
    id: 'storm',
    name: 'Sudden Storm',
    description: 'Dark clouds roll in. Lightning flashes in the distance.',
    options: [
      { text: 'Set up shelter immediately', effect: { time: 2, energy: -5 }, success: 0.9, lntChange: 0 },
      { text: 'Push through quickly', effect: { energy: -20, health: -10 }, success: 0.5, lntChange: 0 },
      { text: 'Find natural shelter', effect: { time: 3, energy: -8 }, success: 0.7, lntChange: 5 }
    ]
  },
  {
    id: 'injury',
    name: 'Ankle Injury',
    description: 'You\'ve twisted your ankle on uneven terrain. It\'s painful to walk.',
    options: [
      { text: 'Rest and wrap it', effect: { time: 4, energy: 10, food: -1 }, success: 0.8, lntChange: 0 },
      { text: 'Continue with pain', effect: { energy: -15, health: -5 }, success: 0.6, lntChange: 0 },
      { text: 'Use trekking poles as support', effect: { energy: -10, time: 1 }, success: 0.7, lntChange: 0 }
    ]
  },
  {
    id: 'snow',
    name: 'Deep Snow',
    description: 'The trail is buried under deep snow. Progress is slow and exhausting.',
    options: [
      { text: 'Posthole through it', effect: { energy: -25, time: 3 }, success: 0.7, lntChange: -10 },
      { text: 'Wait for better conditions', effect: { time: 8, food: -2, energy: -5 }, success: 0.9, lntChange: 10 },
      { text: 'Use microspikes', effect: { energy: -15, time: 2 }, success: 0.8, lntChange: 0 }
    ]
  },
  {
    id: 'heat',
    name: 'Extreme Heat',
    description: 'The sun is relentless. You\'re overheating and running low on water.',
    options: [
      { text: 'Rest in shade', effect: { time: 4, energy: 5, water: -1 }, success: 0.9, lntChange: 5 },
      { text: 'Continue at night', effect: { energy: -10, time: 2 }, success: 0.7, lntChange: 0 },
      { text: 'Push through', effect: { energy: -30, health: -15, water: -2 }, success: 0.4, lntChange: -10 }
    ]
  },
  {
    id: 'equipment',
    name: 'Equipment Failure',
    description: 'Your tent pole has snapped. You need shelter for the night.',
    options: [
      { text: 'Improvise a repair', effect: { time: 2, energy: -5 }, success: 0.6, lntChange: 5 },
      { text: 'Sleep under tarp', effect: { energy: -10, health: -5 }, success: 0.8, lntChange: 0 },
      { text: 'Continue to next shelter', effect: { energy: -20, time: 3 }, success: 0.7, lntChange: 0 }
    ]
  },
  {
    id: 'wildlife',
    name: 'Mountain Lion Sighting',
    description: 'You spot a mountain lion in the distance. It\'s watching you.',
    options: [
      { text: 'Make yourself look bigger', effect: { energy: -5 }, success: 0.8, lntChange: 5 },
      { text: 'Back away slowly', effect: { time: 2, energy: -10 }, success: 0.9, lntChange: 10 },
      { text: 'Run', effect: { energy: -25, health: -10 }, success: 0.3, lntChange: -20 }
    ]
  },
  {
    id: 'resupply',
    name: 'Trail Magic',
    description: 'You\'ve found a trail angel cache with food and supplies!',
    options: [
      { text: 'Take what you need', effect: { food: 3, water: 2, energy: 10 }, success: 1.0, lntChange: 0 },
      { text: 'Leave it for others', effect: { energy: 5 }, success: 1.0, lntChange: 10 },
      { text: 'Take everything', effect: { food: 5, water: 3, energy: 15 }, success: 0.9, lntChange: -20 }
    ]
  },
  {
    id: 'trash',
    name: 'Trail Trash',
    description: 'You notice trash left by previous hikers along the trail.',
    options: [
      { text: 'Pick it up and pack it out', effect: { energy: -3, weight: 0.1 }, success: 1.0, lntChange: 15 },
      { text: 'Leave it', effect: {}, success: 1.0, lntChange: -10 },
      { text: 'Bury it', effect: { energy: -2, time: 0.5 }, success: 0.8, lntChange: -30 }
    ]
  },
  {
    id: 'wildlife-feed',
    name: 'Wildlife Encounter',
    description: 'A squirrel approaches, clearly expecting food from hikers.',
    options: [
      { text: 'Ignore it and continue', effect: {}, success: 1.0, lntChange: 10 },
      { text: 'Feed it some trail mix', effect: { food: -0.5, energy: 5 }, success: 0.7, lntChange: -50 },
      { text: 'Shout to scare it away', effect: { energy: -2 }, success: 0.9, lntChange: 5 }
    ]
  },
  {
    id: 'campfire',
    name: 'Campfire Opportunity',
    description: 'Other hikers have built a fire ring. It\'s getting cold.',
    options: [
      { text: 'Use existing fire ring safely', effect: { energy: 10, health: 5 }, success: 0.8, lntChange: -20 },
      { text: 'Build new fire', effect: { energy: 15, health: 10, time: 2 }, success: 0.5, lntChange: -100 },
      { text: 'Stay warm with layers', effect: { energy: -5 }, success: 1.0, lntChange: 10 }
    ]
  },
  {
    id: 'trail-family',
    name: 'Trail Family',
    description: 'You meet a group of hikers who invite you to join their "trail family".',
    options: [
      { text: 'Join them', effect: { energy: 20, mental: 15, food: -1 }, success: 0.9, lntChange: 5 },
      { text: 'Hike together for a day', effect: { energy: 10, mental: 10 }, success: 1.0, lntChange: 0 },
      { text: 'Continue solo', effect: { mental: -5 }, success: 1.0, lntChange: 0 }
    ]
  },
  {
    id: 'water-source',
    name: 'Unreliable Water Source',
    description: 'You find a water source, but it looks questionable. Your filter is getting old.',
    options: [
      { text: 'Filter and drink', effect: { water: 3, energy: 5 }, success: 0.8, lntChange: 0 },
      { text: 'Boil it first', effect: { water: 3, energy: 5, time: 1, food: -0.5 }, success: 1.0, lntChange: 5 },
      { text: 'Skip it and push on', effect: { energy: -10 }, success: 0.7, lntChange: 0 }
    ]
  },
  {
    id: 'ranger',
    name: 'Ranger Check',
    description: 'A park ranger stops you to check your permit and gear.',
    options: [
      { text: 'Show permit and LNT practices', effect: { energy: 0 }, success: 1.0, lntChange: 20 },
      { text: 'Act defensively', effect: { mental: -10, energy: -5 }, success: 0.6, lntChange: -30 },
      { text: 'Be friendly and ask for advice', effect: { energy: 5, mental: 5 }, success: 1.0, lntChange: 15 }
    ]
  },
  {
    id: 'steep-descent',
    name: 'Steep Descent',
    description: 'The trail ahead drops sharply. Loose rocks and a 45-degree slope await. Each step puts tremendous pressure on your knees.',
    options: [
      { text: 'Use trekking poles', effect: { energy: -8, time: 1 }, success: 0.9, lntChange: 0 },
      { text: 'Proceed carefully', effect: { energy: -12, time: 2 }, success: 0.8, lntChange: 0 },
      { text: 'Rush down quickly', effect: { energy: -15, health: -10 }, success: 0.5, lntChange: -5 },
      { text: 'Find alternate route', effect: { energy: -20, time: 3 }, success: 0.7, lntChange: -10 }
    ]
  },
  {
    id: 'river-crossing',
    name: 'River Crossing',
    description: 'A swollen river blocks your path. The water is waist-deep and flowing fast.',
    options: [
      { text: 'Wade across carefully', effect: { energy: -15, water: 2 }, success: 0.7, lntChange: 0 },
      { text: 'Find a safer crossing', effect: { energy: -10, time: 2 }, success: 0.9, lntChange: 5 },
      { text: 'Wait for water to recede', effect: { time: 6, food: -1 }, success: 0.95, lntChange: 10 },
      { text: 'Use rope to secure', effect: { energy: -8 }, success: 0.85, lntChange: 0 }
    ]
  },
  {
    id: 'beautiful-vista',
    name: 'Stunning Vista',
    description: 'You reach a breathtaking overlook. Mountain peaks stretch to the horizon.',
    options: [
      { text: 'Take time to enjoy the view', effect: { mental: 15, energy: 5, time: 1 }, success: 1.0, lntChange: 5 },
      { text: 'Take photos and continue', effect: { mental: 5 }, success: 1.0, lntChange: 0 },
      { text: 'Rest and have a snack', effect: { energy: 10, food: -0.5, mental: 10 }, success: 1.0, lntChange: 0 }
    ]
  },
  {
    id: 'hiker-shelter',
    name: 'Trail Shelter',
    description: 'You find a small shelter built by previous hikers.',
    options: [
      { text: 'Rest inside briefly', effect: { energy: 15, health: 5 }, success: 1.0, lntChange: 0 },
      { text: 'Check register and continue', effect: { mental: 5 }, success: 1.0, lntChange: 0 },
      { text: 'Clean up trash left behind', effect: { energy: -5, time: 0.5 }, success: 1.0, lntChange: 25 }
    ]
  },
  {
    id: 'altitude-sickness',
    name: 'Altitude Sickness',
    description: 'The thin air is getting to you. Headache and nausea set in.',
    options: [
      { text: 'Rest and hydrate', effect: { time: 3, water: -1, energy: 10, health: 5 }, success: 0.8, lntChange: 0 },
      { text: 'Take it slow', effect: { energy: -10, time: 2 }, success: 0.85, lntChange: 0 },
      { text: 'Push through', effect: { health: -15, energy: -20 }, success: 0.4, lntChange: 0 },
      { text: 'Descend to lower altitude', effect: { time: 4, energy: -15 }, success: 0.95, lntChange: 0 }
    ]
  },
  {
    id: 'dehydration',
    name: 'Dehydration Warning',
    description: 'Your water supply is running low and the next water source is miles away.',
    options: [
      { text: 'Ration remaining water', effect: { energy: -5, water: -0.5 }, success: 0.9, lntChange: 5 },
      { text: 'Search for a spring', effect: { time: 2, energy: -10, water: 3 }, success: 0.5, lntChange: 0 },
      { text: 'Continue and hope for the best', effect: { water: -1, health: -5 }, success: 0.6, lntChange: 0 }
    ]
  },
  {
    id: 'night-hiking',
    name: 'Nightfall Approaches',
    description: 'The sun is setting. You need to decide whether to make camp or continue.',
    options: [
      { text: 'Set up camp here', effect: { time: 8, energy: 30, food: -1, water: -0.5 }, success: 1.0, lntChange: 10 },
      { text: 'Continue with headlamp', effect: { energy: -20, time: 3, mental: -10 }, success: 0.7, lntChange: 0 },
      { text: 'Push to next shelter', effect: { energy: -25, time: 2 }, success: 0.6, lntChange: -5 }
    ]
  },
  {
    id: 'fellow-hiker',
    name: 'Fellow Hiker',
    description: 'You meet another thru-hiker heading the same direction.',
    options: [
      { text: 'Chat and share tips', effect: { mental: 10, energy: 5 }, success: 1.0, lntChange: 5 },
      { text: 'Hike together for a while', effect: { mental: 15, energy: 5 }, success: 1.0, lntChange: 0 },
      { text: 'Share some food', effect: { mental: 20, food: -1 }, success: 1.0, lntChange: 15 },
      { text: 'Nod and continue alone', effect: {}, success: 1.0, lntChange: 0 }
    ]
  },
  {
    id: 'gear-check',
    name: 'Gear Assessment',
    description: 'You stop to check your equipment. Some items are showing wear.',
    options: [
      { text: 'Do quick repairs', effect: { time: 1, energy: -3 }, success: 0.8, lntChange: 5 },
      { text: 'Continue without repair', effect: {}, success: 0.6, lntChange: 0 },
      { text: 'Reorganize pack weight', effect: { time: 0.5, energy: 5 }, success: 1.0, lntChange: 0 }
    ]
  }
];

export const getRandomEvent = () => {
  return events[Math.floor(Math.random() * events.length)];
};

