// Random events that can occur during the hike
// Each event has a background image for immersive display
export const events = [
  {
    id: 'lost',
    name: 'Lost Trail',
    type: 'danger',
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=2070&q=80',
    description: 'You\'ve lost the trail markers. The path ahead is unclear. Fog clings to the ridgeline and every direction looks the same.',
    options: [
      { text: 'Use GPS to navigate', effect: { time: 2, energy: -5 }, success: 0.9, lntChange: 0, requireEquipment: 'gps-device' },
      { text: 'Follow instinct', effect: { time: 4, energy: -15 }, success: 0.6, lntChange: 0 },
      { text: 'Wait for better visibility', effect: { time: 6, energy: -10, food: -1 }, success: 0.8, lntChange: 0 }
    ]
  },
  {
    id: 'bear',
    name: 'Bear Encounter',
    type: 'danger',
    image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=2070&q=80',
    description: 'A black bear is blocking the trail ahead, sniffing at the ground. It hasn\'t noticed you yet. Your heart pounds as you assess the situation.',
    options: [
      { text: 'Make noise to scare it away', effect: { energy: -5 }, success: 0.7, lntChange: 5 },
      { text: 'Wait quietly for it to leave', effect: { time: 3, energy: -10 }, success: 0.9, lntChange: 10 },
      { text: 'Take a detour through brush', effect: { time: 5, energy: -20 }, success: 1.0, lntChange: -10 }
    ]
  },
  {
    id: 'water',
    name: 'Water Source Found',
    type: 'positive',
    image: 'https://images.unsplash.com/photo-1432405972618-c6b0cfba8624?auto=format&fit=crop&w=2070&q=80',
    description: 'You\'ve discovered a natural spring bubbling from between mossy rocks. The water looks crystal clear, catching sunlight as it flows.',
    options: [
      { text: 'Drink immediately', effect: { water: 3, energy: 5 }, success: 0.8, lntChange: 0 },
      { text: 'Filter and purify first', effect: { water: 2, energy: 3, time: 1 }, success: 1.0, lntChange: 5 },
      { text: 'Fill all containers', effect: { water: 4, time: 2 }, success: 1.0, lntChange: 0 }
    ]
  },
  {
    id: 'storm',
    name: 'Sudden Storm',
    type: 'danger',
    image: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?auto=format&fit=crop&w=2070&q=80',
    description: 'Dark clouds roll in without warning. Lightning flashes across the sky and the temperature drops rapidly. Rain begins to hammer the trail.',
    options: [
      { text: 'Deploy tent for shelter', effect: { time: 2, energy: -5 }, success: 0.9, lntChange: 0, requireEquipment: 'tent-4season' },
      { text: 'Push through quickly', effect: { energy: -20, health: -10 }, success: 0.5, lntChange: 0 },
      { text: 'Find natural shelter', effect: { time: 3, energy: -8 }, success: 0.7, lntChange: 5 }
    ]
  },
  {
    id: 'injury',
    name: 'Ankle Injury',
    type: 'danger',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=2070&q=80',
    description: 'A loose rock shifts under your foot. Pain shoots through your ankle as it twists awkwardly. Swelling begins almost immediately.',
    options: [
      { text: 'Rest and wrap it', effect: { time: 4, energy: 10, food: -1 }, success: 0.8, lntChange: 0 },
      { text: 'Continue with pain', effect: { energy: -15, health: -5 }, success: 0.6, lntChange: 0 },
      { text: 'Use trekking poles as support', effect: { energy: -10, time: 1 }, success: 0.7, lntChange: 0, requireEquipment: 'trekking-poles' }
    ]
  },
  {
    id: 'snow',
    name: 'Deep Snow',
    type: 'danger',
    image: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&w=2070&q=80',
    description: 'The trail disappears under a blanket of deep snow. Each step sinks knee-deep. The white expanse is disorienting and progress is agonizingly slow.',
    options: [
      { text: 'Posthole through it', effect: { energy: -25, time: 3 }, success: 0.7, lntChange: -10 },
      { text: 'Wait for conditions to improve', effect: { time: 8, food: -2, energy: -5 }, success: 0.9, lntChange: 10 },
      { text: 'Navigate with GPS around it', effect: { energy: -15, time: 2 }, success: 0.8, lntChange: 0, requireEquipment: 'gps-device' }
    ]
  },
  {
    id: 'heat',
    name: 'Extreme Heat',
    type: 'danger',
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=2070&q=80',
    description: 'The sun is a furnace overhead. Heat shimmers rise from the trail. Your mouth is parched and every breath feels like inhaling fire. The next shade is nowhere in sight.',
    options: [
      { text: 'Rest in shade', effect: { time: 4, energy: 5, water: -1 }, success: 0.9, lntChange: 5 },
      { text: 'Continue at night', effect: { energy: -10, time: 2 }, success: 0.7, lntChange: 0 },
      { text: 'Push through', effect: { energy: -30, health: -15, water: -2 }, success: 0.4, lntChange: -10 }
    ]
  },
  {
    id: 'equipment',
    name: 'Equipment Failure',
    type: 'neutral',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=2070&q=80',
    description: 'Your tent pole has snapped with a sharp crack. Night is approaching and you need shelter. The wind picks up as if to remind you of the urgency.',
    options: [
      { text: 'Improvise a repair', effect: { time: 2, energy: -5 }, success: 0.6, lntChange: 5 },
      { text: 'Sleep under tarp', effect: { energy: -10, health: -5 }, success: 0.8, lntChange: 0 },
      { text: 'Use solar charger light to work', effect: { energy: -8, time: 1 }, success: 0.8, lntChange: 0, requireEquipment: 'solar-charger' }
    ]
  },
  {
    id: 'wildlife',
    name: 'Mountain Lion Sighting',
    type: 'danger',
    image: 'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?auto=format&fit=crop&w=2070&q=80',
    description: 'Movement catches your eye. A mountain lion crouches on a rock above the trail, its amber eyes locked on you. Time seems to freeze.',
    options: [
      { text: 'Make yourself look bigger', effect: { energy: -5 }, success: 0.8, lntChange: 5 },
      { text: 'Back away slowly', effect: { time: 2, energy: -10 }, success: 0.9, lntChange: 10 },
      { text: 'Run', effect: { energy: -25, health: -10 }, success: 0.3, lntChange: -20 }
    ]
  },
  {
    id: 'resupply',
    name: 'Trail Magic',
    type: 'positive',
    image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=2070&q=80',
    description: 'Around a bend, you find a cooler with a handwritten sign: "For PCT hikers — Trail Magic!" Inside: cold drinks, fruit, and sandwiches. A note reads "Pay it forward."',
    options: [
      { text: 'Take what you need', effect: { food: 3, water: 2, energy: 10 }, success: 1.0, lntChange: 0 },
      { text: 'Leave it for others', effect: { energy: 5, mental: 10 }, success: 1.0, lntChange: 10 },
      { text: 'Take everything', effect: { food: 5, water: 3, energy: 15 }, success: 0.9, lntChange: -20 }
    ]
  },
  {
    id: 'trash',
    name: 'Trail Trash',
    type: 'neutral',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=2070&q=80',
    description: 'Granola bar wrappers, an empty water bottle, and a discarded sock litter the trail. Someone was careless here. The mess is an eyesore in this pristine landscape.',
    options: [
      { text: 'Pick it up and pack it out', effect: { energy: -3, weight: 0.1 }, success: 1.0, lntChange: 15 },
      { text: 'Leave it', effect: {}, success: 1.0, lntChange: -10 },
      { text: 'Bury it', effect: { energy: -2, time: 0.5 }, success: 0.8, lntChange: -30 }
    ]
  },
  {
    id: 'wildlife-feed',
    name: 'Wildlife Encounter',
    type: 'neutral',
    image: 'https://images.unsplash.com/photo-1507666405895-422f800f8b15?auto=format&fit=crop&w=2070&q=80',
    description: 'A bold squirrel hops right up to your boots, sitting up on its hind legs. It clearly expects food from hikers. Its dark eyes stare up at you expectantly.',
    options: [
      { text: 'Ignore it and continue', effect: {}, success: 1.0, lntChange: 10 },
      { text: 'Feed it some trail mix', effect: { food: -0.5, energy: 5 }, success: 0.7, lntChange: -50 },
      { text: 'Shout to scare it away', effect: { energy: -2 }, success: 0.9, lntChange: 5 }
    ]
  },
  {
    id: 'campfire',
    name: 'Campfire Opportunity',
    type: 'neutral',
    image: 'https://images.unsplash.com/photo-1475483768296-6163e08872a1?auto=format&fit=crop&w=2070&q=80',
    description: 'Other hikers have left a charred fire ring. The evening air bites at your skin. The temptation to build a warming fire is strong.',
    options: [
      { text: 'Use existing fire ring safely', effect: { energy: 10, health: 5 }, success: 0.8, lntChange: -20 },
      { text: 'Build new fire', effect: { energy: 15, health: 10, time: 2 }, success: 0.5, lntChange: -100 },
      { text: 'Stay warm with layers', effect: { energy: -5 }, success: 1.0, lntChange: 10 }
    ]
  },
  {
    id: 'trail-family',
    name: 'Trail Family',
    type: 'positive',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=2070&q=80',
    description: 'Laughter drifts down the trail. You round a corner to find a group of hikers sharing stories over dinner. "Pull up a rock!" one of them calls out with a grin.',
    options: [
      { text: 'Join them for the evening', effect: { energy: 20, mental: 15, food: -1 }, success: 0.9, lntChange: 5 },
      { text: 'Hike together for a day', effect: { energy: 10, mental: 10 }, success: 1.0, lntChange: 0 },
      { text: 'Continue solo', effect: { mental: -5 }, success: 1.0, lntChange: 0 }
    ]
  },
  {
    id: 'water-source',
    name: 'Unreliable Water Source',
    type: 'neutral',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2070&q=80',
    description: 'You find a water source marked on your map, but it\'s a murky trickle through algae-covered rocks. Your filter is getting old and the next reliable source is miles away.',
    options: [
      { text: 'Filter and drink', effect: { water: 3, energy: 5 }, success: 0.8, lntChange: 0 },
      { text: 'Boil it first', effect: { water: 3, energy: 5, time: 1, food: -0.5 }, success: 1.0, lntChange: 5 },
      { text: 'Skip it and push on', effect: { energy: -10 }, success: 0.7, lntChange: 0 }
    ]
  },
  {
    id: 'ranger',
    name: 'Ranger Check',
    type: 'neutral',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2070&q=80',
    description: 'A park ranger steps out from a side trail, clipboard in hand. "Morning, hiker. Mind if I check your permit and have a quick look at your setup?"',
    options: [
      { text: 'Show permit and LNT practices', effect: { energy: 0 }, success: 1.0, lntChange: 20 },
      { text: 'Act defensively', effect: { mental: -10, energy: -5 }, success: 0.6, lntChange: -30 },
      { text: 'Be friendly and ask for advice', effect: { energy: 5, mental: 5 }, success: 1.0, lntChange: 15 }
    ]
  },
  {
    id: 'steep-descent',
    name: 'Steep Descent',
    type: 'danger',
    image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=2070&q=80',
    description: 'The trail drops away sharply. Loose scree and a 45-degree slope stretch below. Each step sends pebbles cascading downward. The pressure on your knees is immense.',
    options: [
      { text: 'Use trekking poles for stability', effect: { energy: -8, time: 1 }, success: 0.9, lntChange: 0, requireEquipment: 'trekking-poles' },
      { text: 'Proceed carefully', effect: { energy: -12, time: 2 }, success: 0.8, lntChange: 0 },
      { text: 'Rush down quickly', effect: { energy: -15, health: -10 }, success: 0.5, lntChange: -5 },
      { text: 'Find alternate route', effect: { energy: -20, time: 3 }, success: 0.7, lntChange: -10 }
    ]
  },
  {
    id: 'river-crossing',
    name: 'River Crossing',
    type: 'danger',
    image: 'https://images.unsplash.com/photo-1433838552652-f9a46b332c40?auto=format&fit=crop&w=2070&q=80',
    description: 'A swollen river blocks your path. Snowmelt has turned it into a torrent of icy water. It\'s waist-deep and flowing fast enough to knock you off your feet.',
    options: [
      { text: 'Wade across with poles', effect: { energy: -12, water: 2 }, success: 0.8, lntChange: 0, requireEquipment: 'trekking-poles' },
      { text: 'Wade across carefully', effect: { energy: -15, water: 2 }, success: 0.7, lntChange: 0 },
      { text: 'Find a safer crossing', effect: { energy: -10, time: 2 }, success: 0.9, lntChange: 5 },
      { text: 'Wait for water to recede', effect: { time: 6, food: -1 }, success: 0.95, lntChange: 10 }
    ]
  },
  {
    id: 'beautiful-vista',
    name: 'Stunning Vista',
    type: 'positive',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2070&q=80',
    description: 'You crest a ridge and the world opens up before you. Snow-capped peaks stretch to the horizon, painted gold by the setting sun. The beauty is overwhelming.',
    options: [
      { text: 'Take time to enjoy the view', effect: { mental: 15, energy: 5, time: 1 }, success: 1.0, lntChange: 5 },
      { text: 'Take photos and continue', effect: { mental: 5 }, success: 1.0, lntChange: 0 },
      { text: 'Rest and have a snack', effect: { energy: 10, food: -0.5, mental: 10 }, success: 1.0, lntChange: 0 }
    ]
  },
  {
    id: 'hiker-shelter',
    name: 'Trail Shelter',
    type: 'positive',
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=2070&q=80',
    description: 'Tucked among the trees, you find a small shelter with a register book. Other hikers\' notes line the walls — messages of hope, humor, and hard-won wisdom.',
    options: [
      { text: 'Rest inside briefly', effect: { energy: 15, health: 5 }, success: 1.0, lntChange: 0 },
      { text: 'Read register and continue', effect: { mental: 5 }, success: 1.0, lntChange: 0 },
      { text: 'Clean up trash left behind', effect: { energy: -5, time: 0.5 }, success: 1.0, lntChange: 25 }
    ]
  },
  {
    id: 'altitude-sickness',
    name: 'Altitude Sickness',
    type: 'danger',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2070&q=80',
    description: 'The thin air claws at your lungs. A splitting headache sets in and nausea churns your stomach. The world tilts slightly as you struggle to focus.',
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
    type: 'danger',
    image: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=2070&q=80',
    description: 'Your lips crack. Your head throbs. The last drops of water are gone, and the next source is still miles ahead. The sun shows no mercy.',
    options: [
      { text: 'Ration remaining water', effect: { energy: -5, water: -0.5 }, success: 0.9, lntChange: 5 },
      { text: 'Search for a spring', effect: { time: 2, energy: -10, water: 3 }, success: 0.5, lntChange: 0 },
      { text: 'Continue and hope for the best', effect: { water: -1, health: -5 }, success: 0.6, lntChange: 0 }
    ]
  },
  {
    id: 'night-hiking',
    name: 'Nightfall Approaches',
    type: 'neutral',
    image: 'https://images.unsplash.com/photo-1532978379173-523e16f371f2?auto=format&fit=crop&w=2070&q=80',
    description: 'The last light bleeds from the sky. Shadows swallow the trail ahead. You need to decide: make camp or push on into the darkness?',
    options: [
      { text: 'Set up camp here', effect: { time: 8, energy: 30, food: -1, water: -0.5 }, success: 1.0, lntChange: 10, requireEquipment: 'tent-4season' },
      { text: 'Continue with headlamp', effect: { energy: -20, time: 3, mental: -10 }, success: 0.7, lntChange: 0 },
      { text: 'Push to next shelter', effect: { energy: -25, time: 2 }, success: 0.6, lntChange: -5 }
    ]
  },
  {
    id: 'fellow-hiker',
    name: 'Fellow Hiker',
    type: 'positive',
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=2070&q=80',
    description: 'Another thru-hiker appears on the trail ahead, heading your direction. They wave and fall into step beside you. "How far you going?"',
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
    type: 'neutral',
    image: 'https://images.unsplash.com/photo-1520190282873-afe1285c9a2c?auto=format&fit=crop&w=2070&q=80',
    description: 'Something feels off with your pack. You stop to check your equipment. Some items are showing wear — fraying straps, a bent pole, loose stitching.',
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
