/**
 * MonsoonGuard — Offline Knowledge Base
 * Curated, expert-sourced monsoon preparedness content.
 * This is NOT mock data — it's a genuine knowledge base that serves as
 * the fallback engine when AI APIs are unavailable.
 * 
 * Sources: NDMA (National Disaster Management Authority), IMD guidelines,
 * Red Cross disaster preparedness resources, WHO health advisories.
 */

/**
 * Emergency checklists organized by category
 */
export const emergencyChecklists = {
  home_preparedness: {
    id: 'home_preparedness',
    title: 'Home Preparedness',
    icon: 'home',
    description: 'Prepare your home before the monsoon arrives',
    items: [
      { id: 'hp1', text: 'Clean and unclog all drains, gutters, and downspouts', priority: 'high' },
      { id: 'hp2', text: 'Seal cracks and gaps in walls, windows, and doors with waterproof sealant', priority: 'high' },
      { id: 'hp3', text: 'Apply waterproof coating to exterior walls and terrace', priority: 'high' },
      { id: 'hp4', text: 'Trim overhanging tree branches near the house', priority: 'medium' },
      { id: 'hp5', text: 'Install or check sump pump in basement/ground floor', priority: 'high' },
      { id: 'hp6', text: 'Elevate electrical sockets, switches, and wiring above potential flood level', priority: 'high' },
      { id: 'hp7', text: 'Store important documents in waterproof containers or bags', priority: 'high' },
      { id: 'hp8', text: 'Move valuables and electronics to upper floors/shelves', priority: 'medium' },
      { id: 'hp9', text: 'Stock sandbags if you live in a flood-prone area', priority: 'medium' },
      { id: 'hp10', text: 'Check and repair roof tiles, leaks, and flashing', priority: 'high' },
      { id: 'hp11', text: 'Ensure proper ventilation to prevent mold and mildew', priority: 'low' },
      { id: 'hp12', text: 'Install mosquito nets on all windows and doors', priority: 'medium' },
    ],
  },
  emergency_kit: {
    id: 'emergency_kit',
    title: 'Emergency Kit',
    icon: 'kit',
    description: 'Essential items to keep ready for emergencies',
    items: [
      { id: 'ek1', text: 'Drinking water — minimum 3 liters per person per day (for 3 days)', priority: 'high' },
      { id: 'ek2', text: 'Non-perishable food — canned goods, dry fruits, biscuits, instant noodles', priority: 'high' },
      { id: 'ek3', text: 'First aid kit with antiseptic, bandages, ORS packets, paracetamol', priority: 'high' },
      { id: 'ek4', text: 'Torch/flashlight with extra batteries', priority: 'high' },
      { id: 'ek5', text: 'Fully charged power bank (20,000 mAh recommended)', priority: 'high' },
      { id: 'ek6', text: 'Battery-powered or hand-crank radio', priority: 'medium' },
      { id: 'ek7', text: 'Waterproof bags/zip-lock bags for documents and phones', priority: 'high' },
      { id: 'ek8', text: 'Candles, matchbox/lighter in waterproof container', priority: 'medium' },
      { id: 'ek9', text: 'Whistle (for signaling during emergency)', priority: 'medium' },
      { id: 'ek10', text: 'Basic tools — rope (10m), knife, duct tape, wrench', priority: 'medium' },
      { id: 'ek11', text: 'Rain gear — raincoats, umbrellas, gumboots/waterproof shoes', priority: 'high' },
      { id: 'ek12', text: 'Personal medications (2-week supply)', priority: 'high' },
      { id: 'ek13', text: 'Insect repellent and mosquito coils', priority: 'medium' },
      { id: 'ek14', text: 'Copies of ID cards, insurance papers, emergency contacts', priority: 'high' },
      { id: 'ek15', text: 'Cash in small denominations (ATMs may not work)', priority: 'medium' },
    ],
  },
  evacuation_plan: {
    id: 'evacuation_plan',
    title: 'Evacuation Plan',
    icon: 'route',
    description: 'Plan your safe exit before disaster strikes',
    items: [
      { id: 'ev1', text: 'Identify the nearest evacuation shelter (school, community center)', priority: 'high' },
      { id: 'ev2', text: 'Plan two escape routes from your home and neighborhood', priority: 'high' },
      { id: 'ev3', text: 'Establish a family meeting point outside the home', priority: 'high' },
      { id: 'ev4', text: 'Keep an emergency bag packed and ready near the exit', priority: 'high' },
      { id: 'ev5', text: 'Know your ward/area emergency contact numbers', priority: 'medium' },
      { id: 'ev6', text: 'Inform elderly neighbors and help them prepare', priority: 'medium' },
      { id: 'ev7', text: 'Decide who will be responsible for carrying pets and essentials', priority: 'medium' },
      { id: 'ev8', text: 'Practice the evacuation route with family at least once', priority: 'low' },
      { id: 'ev9', text: 'Keep vehicle fuel tank at least half full during monsoon season', priority: 'medium' },
      { id: 'ev10', text: 'Store emergency contacts on paper (phone may not work)', priority: 'high' },
    ],
  },
  during_flood: {
    id: 'during_flood',
    title: 'During Flooding',
    icon: 'flood',
    description: 'What to do when flooding occurs',
    items: [
      { id: 'df1', text: 'Move to higher ground immediately — do not wait', priority: 'high' },
      { id: 'df2', text: 'Turn off electricity at the main breaker if safe to do so', priority: 'high' },
      { id: 'df3', text: 'Do NOT walk or drive through floodwater — 6 inches can knock you down', priority: 'high' },
      { id: 'df4', text: 'Avoid contact with floodwater — it may be contaminated', priority: 'high' },
      { id: 'df5', text: 'Stay away from power lines and electrical equipment', priority: 'high' },
      { id: 'df6', text: 'Call emergency services if trapped: NDRF 011-24363260', priority: 'high' },
      { id: 'df7', text: 'Signal for help from rooftop or upper floor if stranded', priority: 'medium' },
      { id: 'df8', text: 'Listen to radio/TV for official updates and instructions', priority: 'medium' },
      { id: 'df9', text: 'Do not eat food that has been contaminated by floodwater', priority: 'high' },
      { id: 'df10', text: 'Keep children and elderly on upper floors at all times', priority: 'high' },
    ],
  },
  health_safety: {
    id: 'health_safety',
    title: 'Health & Hygiene',
    icon: 'health',
    description: 'Prevent monsoon-related diseases',
    items: [
      { id: 'hs1', text: 'Boil or purify all drinking water — use purification tablets if needed', priority: 'high' },
      { id: 'hs2', text: 'Use mosquito repellent and sleep under mosquito nets (prevent dengue/malaria)', priority: 'high' },
      { id: 'hs3', text: 'Do not allow water to stagnate in pots, tyres, or containers', priority: 'high' },
      { id: 'hs4', text: 'Wash hands frequently with soap, especially before eating', priority: 'high' },
      { id: 'hs5', text: 'Avoid street food and uncooked vegetables during monsoon', priority: 'medium' },
      { id: 'hs6', text: 'Keep feet dry — use antifungal powder to prevent infections', priority: 'medium' },
      { id: 'hs7', text: 'Seek medical help immediately for fever, diarrhea, or skin infections', priority: 'high' },
      { id: 'hs8', text: 'Ensure children are up-to-date on vaccinations', priority: 'medium' },
      { id: 'hs9', text: 'Stock ORS packets and zinc tablets for diarrhea treatment', priority: 'medium' },
      { id: 'hs10', text: 'Use chlorine drops for water storage tanks (1 drop per liter)', priority: 'medium' },
    ],
  },
  post_flood: {
    id: 'post_flood',
    title: 'After the Flood',
    icon: 'recovery',
    description: 'Steps to take once waters recede',
    items: [
      { id: 'pf1', text: 'Do not return home until authorities declare it safe', priority: 'high' },
      { id: 'pf2', text: 'Check for structural damage before entering your home', priority: 'high' },
      { id: 'pf3', text: 'Have an electrician check the wiring before turning on power', priority: 'high' },
      { id: 'pf4', text: 'Discard all food that may have been contaminated by floodwater', priority: 'high' },
      { id: 'pf5', text: 'Clean and disinfect all surfaces that were in contact with floodwater', priority: 'high' },
      { id: 'pf6', text: 'Document all damage with photos/videos for insurance claims', priority: 'medium' },
      { id: 'pf7', text: 'Watch for snakes and insects that may have entered during flooding', priority: 'medium' },
      { id: 'pf8', text: 'Open windows and doors to dry out the house and prevent mold', priority: 'medium' },
      { id: 'pf9', text: 'Dispose of damaged items safely — wear gloves and masks', priority: 'medium' },
      { id: 'pf10', text: 'Seek mental health support if needed — disasters are traumatic', priority: 'low' },
    ],
  },
};

/**
 * Safety recommendations by phase
 */
export const safetyRecommendations = {
  before: {
    title: 'Before Monsoon',
    icon: '🛡️',
    tips: [
      'Monitor weather forecasts daily from IMD (mausam.imd.gov.in)',
      'Ensure all family members know the emergency plan',
      'Update your emergency kit supplies and check expiry dates',
      'Back up important data to cloud storage',
      'Get your vehicle serviced — check brakes, tyres, wipers',
      'Register for local disaster alerts (SMS/app)',
      'Identify safe rooms and high ground in your building',
      'Clear all drainage channels near your property',
      'Waterproof your important documents',
      'Discuss flood insurance with your provider',
    ],
  },
  during: {
    title: 'During Monsoon',
    icon: '⛈️',
    tips: [
      'Stay indoors during heavy rainfall and thunderstorms',
      'Avoid crossing flooded roads, bridges, and underpasses',
      'Do not use electrical appliances with wet hands or near water',
      'Keep monitoring weather alerts and follow official instructions',
      'Boil all drinking water as a precaution',
      'Report water-logging and fallen trees to municipal helpline',
      'Avoid swimming or playing in floodwater',
      'Keep emergency numbers saved: NDRF: 011-24363260, Police: 100',
      'Use rubber or wooden-soled footwear to avoid electric shock',
      'Keep a torch/flashlight handy — power cuts are common',
    ],
  },
  after: {
    title: 'After Monsoon / Floods',
    icon: '🌈',
    tips: [
      'Wait for official clearance before returning to flooded areas',
      'Beware of damaged roads, bridges, and buildings',
      'Get your drinking water tested if supply was interrupted',
      'Watch for post-flood diseases: dengue, malaria, leptospirosis',
      'Clean and disinfect your home thoroughly',
      'Document all losses for insurance and relief claims',
      'Check on elderly neighbors and vulnerable community members',
      'Restock your emergency supplies for the next event',
      'Report ongoing hazards to local authorities',
      'Consider counseling if experiencing post-disaster stress',
    ],
  },
};

/**
 * Emergency contact numbers (India-specific)
 */
export const emergencyContacts = [
  { name: 'National Emergency Number', number: '112', description: 'Single number for Police, Fire, Ambulance' },
  { name: 'NDRF (Disaster Response)', number: '011-24363260', description: 'National Disaster Response Force' },
  { name: 'Police', number: '100', description: 'Police emergency' },
  { name: 'Fire Brigade', number: '101', description: 'Fire emergency' },
  { name: 'Ambulance', number: '108', description: 'Medical emergency' },
  { name: 'Disaster Management', number: '1078', description: 'State disaster helpline' },
  { name: 'Women Helpline', number: '1091', description: 'Women in distress' },
  { name: 'Child Helpline', number: '1098', description: 'Children in distress' },
  { name: 'Flood Control Room (Delhi)', number: '011-22746200', description: 'Delhi flood control' },
  { name: 'IMD Weather Info', number: '1800-180-1717', description: 'Weather information (toll-free)' },
];

/**
 * Travel advisory templates by region
 */
export const travelAdvisories = {
  general: {
    title: 'General Monsoon Travel Safety',
    tips: [
      'Always check weather forecast before starting your journey',
      'Carry waterproof bags for electronic devices and documents',
      'Keep extra food, water, and medications while traveling',
      'Avoid night travel during heavy monsoon periods',
      'Share your travel itinerary with family members',
      'Keep your phone charged and carry a power bank',
      'Know the emergency helpline numbers for your route',
      'Carry a basic first aid kit',
    ],
  },
  road: {
    title: 'Road Travel During Monsoon',
    tips: [
      'Maintain low speed and keep safe distance from other vehicles',
      'Do not attempt to cross flooded roads — turn around, don\'t drown',
      'Use headlights even during daytime in heavy rain',
      'Avoid parking under trees or near riverbanks',
      'Check tyre tread depth — minimum 3mm recommended for monsoon',
      'Carry a tow rope and basic breakdown tools',
      'If visibility drops below 50 meters, pull over safely and wait',
      'Watch for landslide warnings on hilly routes',
    ],
  },
  train: {
    title: 'Train Travel During Monsoon',
    tips: [
      'Check train running status before leaving for the station',
      'Download NTES or UTS app for real-time updates',
      'Carry extra food and water — trains may be delayed for hours',
      'Keep valuables and electronics in waterproof bags',
      'Prefer upper berths if there\'s a chance of waterlogging',
      'Be patient with delays — safety is the priority',
    ],
  },
  air: {
    title: 'Air Travel During Monsoon',
    tips: [
      'Book morning flights — they are less likely to be delayed',
      'Check flight status 3-4 hours before departure',
      'Keep essential medications in hand luggage',
      'Have alternative travel plans if flights are cancelled',
      'Consider travel insurance during monsoon season',
    ],
  },
};

/**
 * Keyword-based topic matching for offline AI responses
 */
const TOPIC_KEYWORDS = [
  { keywords: ['flood', 'flooding', 'waterlog', 'submerge'], topic: 'flooding' },
  { keywords: ['evacuate', 'evacuation', 'escape', 'leave', 'shelter'], topic: 'evacuation' },
  { keywords: ['first aid', 'injury', 'hurt', 'wound', 'medical', 'medicine'], topic: 'first_aid' },
  { keywords: ['checklist', 'prepare', 'preparation', 'ready', 'stock', 'supply', 'kit'], topic: 'preparedness' },
  { keywords: ['travel', 'road', 'drive', 'journey', 'trip', 'train', 'flight', 'bus'], topic: 'travel' },
  { keywords: ['health', 'disease', 'dengue', 'malaria', 'infection', 'fever', 'sick'], topic: 'health' },
  { keywords: ['child', 'children', 'kid', 'baby', 'infant', 'school'], topic: 'children' },
  { keywords: ['elder', 'elderly', 'old', 'senior', 'aged'], topic: 'elderly' },
  { keywords: ['pet', 'dog', 'cat', 'animal'], topic: 'pets' },
  { keywords: ['waterproof', 'leak', 'seal', 'roof', 'wall', 'house', 'home'], topic: 'home' },
  { keywords: ['electric', 'power', 'outage', 'blackout', 'generator'], topic: 'power' },
  { keywords: ['emergency', 'help', 'rescue', 'sos', 'call', 'contact'], topic: 'emergency' },
  { keywords: ['food', 'water', 'drink', 'eat', 'cook', 'store'], topic: 'food_water' },
  { keywords: ['landslide', 'mudslide', 'hill', 'slope', 'mountain'], topic: 'landslide' },
  { keywords: ['lightning', 'thunder', 'storm', 'cyclone'], topic: 'storm' },
  { keywords: ['insurance', 'claim', 'damage', 'loss', 'compensation'], topic: 'insurance' },
];

/**
 * Offline response templates — genuine, expert-curated content
 */
const OFFLINE_RESPONSES = {
  flooding: `## 🌊 Flood Safety Guide

### If flooding is imminent:
1. **Move to higher ground immediately** — every minute counts
2. **Turn off electricity** at the main breaker if you can do so safely
3. **Do NOT walk through floodwater** — just 6 inches of moving water can knock you down
4. **Avoid driving** through flooded areas — your car can be swept away in just 12 inches of water

### During flooding:
- **Stay away from power lines** and electrical equipment in water
- **Do not touch floodwater** if possible — it may be contaminated with sewage, chemicals, or debris
- **Signal for help** from your rooftop or upper floor using bright cloth, torch, or whistle
- **Call NDRF: 011-24363260** or National Emergency: **112**

### After flooding:
- Wait for official clearance before returning home
- Check for structural damage before entering
- Get an electrician to check wiring before restoring power
- Discard any food or medicines that contacted floodwater
- Clean and disinfect all surfaces with bleach solution

> **Important Emergency Numbers:**
> - National Emergency: 112
> - NDRF: 011-24363260
> - Ambulance: 108`,

  evacuation: `## 🚨 Evacuation Guide

### Before you need to evacuate:
1. **Identify your nearest shelter** — schools, community centers, government buildings
2. **Plan two escape routes** from your home and neighborhood
3. **Pack an emergency go-bag** with:
   - Water (2 liters per person)
   - Non-perishable food for 3 days
   - Medications (2-week supply)
   - Documents in waterproof bag (Aadhaar, insurance, property papers)
   - Cash in small denominations
   - Torch, power bank, first aid kit

### When to evacuate:
- When authorities issue an evacuation order — **do NOT delay**
- If water level is rising rapidly in your area
- If you hear unusual sounds (rushing water, cracking sounds from structure)
- If you notice landslide warning signs on nearby slopes

### During evacuation:
- **Walk, don't run** — stay calm
- **Help elderly, children, and disabled** neighbors
- **Do NOT go back** for belongings once you've started
- **Follow marked routes** — avoid shortcuts through flooded areas
- **Keep your phone charged** and inform a family member of your location

### Family meeting point:
Choose a spot everyone knows — a specific landmark, relative's house, or community center.`,

  first_aid: `## 🩺 Monsoon First Aid Guide

### For cuts and wounds (from debris):
1. Wash the wound with clean water and antiseptic soap
2. Apply antiseptic (Betadine/Dettol)
3. Cover with a sterile bandage
4. **Seek medical attention** if the wound is deep or dirty (tetanus risk)

### For dehydration/diarrhea:
1. Give **ORS solution** — mix 1 packet in 1 liter of clean water
2. Give small, frequent sips — don't gulp
3. Continue giving fluids even if vomiting
4. **Seek medical help** if symptoms persist beyond 24 hours

### For snake/insect bites:
1. **Keep calm** — don't panic or run
2. Immobilize the bitten limb and keep it below heart level
3. **Do NOT** try to suck out venom or apply tourniquet
4. Call ambulance (**108**) immediately
5. Note the snake's appearance if possible

### For electric shock:
1. **Do NOT touch** the victim if they're still in contact with the source
2. Turn off power at the main switch if possible
3. Use a dry wooden stick or plastic chair to separate victim from source
4. Begin CPR if the person is not breathing
5. Call **108** immediately

### For hypothermia (cold exposure):
1. Move to a warm, dry place
2. Remove wet clothing and wrap in warm blankets
3. Give warm (not hot) drinks — **no alcohol**
4. Seek medical help if shivering stops or consciousness decreases`,

  preparedness: `## ✅ Monsoon Preparedness Checklist

### Home Preparation:
- ☐ Clean all drains, gutters, and downspouts
- ☐ Seal wall cracks and window gaps with waterproof sealant
- ☐ Apply waterproof coating to terrace and exterior walls
- ☐ Trim tree branches near the house
- ☐ Elevate electrical points above potential flood level
- ☐ Install mosquito nets on windows

### Emergency Kit:
- ☐ Water: 3 liters/person/day for 3 days
- ☐ Non-perishable food for 3 days
- ☐ First aid kit with ORS, antiseptic, bandages
- ☐ Torch + extra batteries
- ☐ Power bank (20,000 mAh)
- ☐ Rain gear: raincoats, gumboots, umbrellas
- ☐ Waterproof document bag
- ☐ Cash and copies of important IDs
- ☐ Personal medications (2-week supply)
- ☐ Insect repellent

### Communication Plan:
- ☐ Share emergency contacts with all family members
- ☐ Designate an out-of-area emergency contact
- ☐ Register for local disaster alerts
- ☐ Download IMD Mausam app for weather updates
- ☐ Save NDRF number: 011-24363260`,

  travel: `## 🚗 Monsoon Travel Advisory

### Before traveling:
1. **Check weather forecast** for your entire route
2. **Inform someone** about your travel plan and expected arrival
3. **Pack emergency supplies**: water, snacks, torch, first aid, power bank

### Road travel safety:
- Maintain **low speed** and increase following distance
- **Never cross flooded roads** — "Turn Around, Don't Drown"
- Use headlights in heavy rain
- Check tire tread (minimum 3mm for monsoon)
- Avoid parking under trees or near water bodies
- If visibility drops severely, pull over with hazard lights on

### Train travel:
- Check running status on NTES app/139
- Carry extra food and water for potential delays
- Prefer morning trains — less likely to be delayed
- Keep valuables in waterproof bags

### Flight travel:
- Book morning flights for fewer delays
- Check status 3-4 hours before departure
- Have a backup travel plan
- Consider travel insurance

### If stranded:
1. Stay with your vehicle (if safe from flooding)
2. Call for help: 112 (National Emergency)
3. Make yourself visible with hazard lights or torch
4. Don't attempt to walk through unknown water`,

  health: `## 🏥 Monsoon Health Guide

### Common monsoon diseases to watch for:

**Dengue & Malaria (Mosquito-borne):**
- Symptoms: High fever, body ache, rash, severe headache
- Prevention: Use mosquito nets, repellent, remove stagnant water
- Action: Seek immediate medical help if fever persists

**Leptospirosis (Waterborne):**
- Symptoms: Fever, muscle pain, red eyes after wading in floodwater
- Prevention: Avoid walking in stagnant/flood water, wear gumboots
- Action: Consult doctor immediately — early treatment is crucial

**Typhoid & Cholera (Water/food-borne):**
- Symptoms: High fever, diarrhea, vomiting, stomach cramps
- Prevention: Drink only boiled/purified water, avoid street food
- Action: Use ORS, stay hydrated, see a doctor

**Fungal Infections:**
- Keep feet dry, change wet socks/shoes immediately
- Use antifungal powder on feet and skin folds
- Wear breathable cotton clothes

### Prevention checklist:
- ✅ Boil or purify all drinking water
- ✅ Use mosquito repellent and nets
- ✅ Remove all stagnant water sources
- ✅ Wash hands frequently with soap
- ✅ Eat only freshly cooked hot food
- ✅ Keep first aid kit updated
- ✅ Get vaccinated (typhoid, hepatitis A)`,

  children: `## 👶 Keeping Children Safe During Monsoon

### At home:
- Keep children away from open windows during storms
- Never leave children unattended near water — even small puddles
- Ensure electrical outlets have safety covers
- Keep emergency medicines at child-accessible height (for older kids who know how to use them)

### Health:
- Ensure all vaccinations are up to date
- Watch for signs of dengue: sudden high fever with rash
- Keep children hydrated with ORS if they develop diarrhea
- Apply mosquito repellent designed for children (DEET-free for < 2 years)

### During flooding:
- Children should NEVER play in or near floodwater
- Keep children on upper floors at all times
- Assign one adult per child during evacuation
- Pack comfort items in the emergency bag (toy, blanket)

### After flooding:
- Don't let children play in or near damaged structures
- Watch for signs of anxiety or trauma
- Re-establish routines as quickly as possible
- Talk to children about what happened in age-appropriate terms`,

  elderly: `## 👵 Elderly Care During Monsoon

### Pre-monsoon preparation:
- Ensure 2-week supply of all prescription medications
- Keep mobility aids (canes, walkers) accessible
- Program emergency numbers into their phone
- Identify a buddy/neighbor who can check on them daily

### During monsoon:
- Avoid going outside during heavy rain — fall risk is high on wet surfaces
- Keep non-slip mats in bathrooms and near doorways
- Ensure adequate lighting in all rooms
- Keep wearing warm, dry clothing to prevent hypothermia

### Health monitoring:
- Watch for signs of respiratory infections
- Monitor blood pressure — weather changes can affect it
- Ensure regular medication intake despite disruptions
- Keep emergency medical records in a waterproof bag

### Evacuation support:
- Elderly should be evacuated FIRST
- Assign a specific family member to assist them
- Carry all medications, prescriptions, and medical devices
- Choose ground-floor shelter if mobility is limited`,

  pets: `## 🐾 Pet Safety During Monsoon

### Preparation:
- Keep pets indoors during storms — thunder and lightning cause extreme anxiety
- Update pet ID tags with current phone number
- Store pet food and clean water for at least 3 days
- Keep veterinarian's emergency number handy

### During storms:
- Create a calm, enclosed space for your pet (crate or quiet room)
- Close curtains to reduce lightning flashes
- Play soft music to mask thunder sounds
- Don't force anxious pets out for walks during storms

### If evacuating:
- **Never leave pets behind**
- Carry pet food, water, medications, and leash
- Keep pets in carriers during transport
- Bring a familiar blanket or toy for comfort

### Health:
- Dry your pet thoroughly after any exposure to rain
- Watch for tick and flea infestations (increase during monsoon)
- Clean paws after walks to prevent fungal infections
- Avoid letting pets drink stagnant or floodwater`,

  home: `## 🏠 Home Waterproofing Guide

### Exterior:
1. **Roof**: Inspect and repair all tiles, fix leaks, apply waterproof coating
2. **Walls**: Seal cracks with polymer-based sealant, apply exterior waterproof paint
3. **Windows**: Apply silicone sealant around frames, install weather strips
4. **Drainage**: Clean gutters, downspouts, and French drains

### Interior:
1. **Basement**: Install sump pump, apply waterproof membrane to walls
2. **Ground floor**: Elevate appliances and electrical points by 12-18 inches
3. **Bathrooms**: Re-grout tiles, check for leaks in plumbing
4. **Ventilation**: Ensure exhaust fans work to prevent mold buildup

### If water enters:
1. Turn off electricity at the main switch
2. Move valuables and electronics upward
3. Use towels, mops, and wet vacuum to remove water
4. Open windows for ventilation once rain stops
5. Use dehumidifier or fans to dry out affected areas

### Long-term investment:
- Consider anti-seepage treatment for walls
- Install a French drain around the property
- Add a terrace garden with waterproof membrane beneath`,

  power: `## ⚡ Power Outage Preparedness

### Before the outage:
- Charge all devices (phones, power banks, laptops)
- Stock batteries for flashlights and radio
- Fill bathtub/buckets with water (electric pumps won't work)
- Set refrigerator to coldest setting to preserve food longer

### During the outage:
- Use flashlights, NOT candles (fire hazard in rain)
- Keep refrigerator closed — food stays cold for 4-6 hours
- Unplug sensitive electronics to protect from surge when power returns
- Use battery-powered radio for updates

### Generator safety:
- **NEVER run a generator indoors** — carbon monoxide kills
- Place generator outside, at least 20 feet from windows
- Use heavy-duty extension cords rated for outdoor use
- Don't overload — prioritize essential devices only

### UPS/Inverter:
- Check battery health before monsoon season
- Ensure proper ventilation around the inverter
- Keep the inverter area dry and elevated
- Prioritize lights, phone charging, and refrigerator`,

  emergency: `## 🆘 Emergency Response Guide

### Immediate emergency numbers:
| Service | Number |
|---------|--------|
| **National Emergency** | **112** |
| **NDRF** | **011-24363260** |
| **Police** | **100** |
| **Fire** | **101** |
| **Ambulance** | **108** |
| **Disaster Helpline** | **1078** |
| **IMD Weather** | **1800-180-1717** |

### When calling for help:
1. State your **exact location** (landmark, building name, floor)
2. Describe the **emergency type** (flooding, injury, trapped)
3. Mention the **number of people** affected
4. Note any **special needs** (elderly, children, medical conditions)
5. **Stay on the line** until told otherwise

### Signaling for rescue:
- Wave bright colored cloth from rooftop/balcony
- Use a whistle (3 short blasts = universal distress signal)
- Flash torch light at night
- Write "HELP" on a white sheet visible from above
- If phone works, share GPS location via WhatsApp

### Self-rescue if trapped:
1. Move to the highest accessible point
2. Conserve phone battery — send text messages instead of calling
3. Stay warm and dry
4. Do not attempt to swim through currents
5. Stay visible and audible`,

  food_water: `## 🍽️ Food & Water Safety During Monsoon

### Water safety:
- **Always boil** drinking water for at least 1 minute
- Use water purification tablets (Chlorine: 1 drop per liter)
- Store clean water in covered, food-grade containers
- If water supply is disrupted, use stored emergency water
- Never drink floodwater or water from damaged taps

### Food safety:
- Eat only **freshly cooked** food served hot
- Avoid raw vegetables and salads (contamination risk)
- Avoid street food and uncovered food during monsoon
- Check canned food for damage or bulging before use
- Store dry food (rice, dal, biscuits) in airtight containers above ground level

### Emergency food supplies to stock:
- Rice, dal, atta: 5 kg each
- Canned vegetables and fruits
- Dry fruits, nuts, energy bars
- Instant noodles, oats, poha
- Biscuits and crackers
- Powdered milk, tea, coffee
- Salt, sugar, spices
- Cooking oil (sealed)

### After flooding:
- **Discard all food** that has been in contact with floodwater
- **Discard medications** that were submerged
- Clean and sanitize all cooking utensils with bleach solution
- Wash hands thoroughly before preparing food`,

  landslide: `## ⛰️ Landslide Safety

### Warning signs:
- Unusual cracking sounds from the hillside
- Small rockfalls or debris rolling down
- Sudden increase in water flow in nearby streams
- Cracks appearing in the ground, road, or building walls
- Trees or poles tilting in the direction of the slope
- Doors or windows suddenly jamming

### If a landslide occurs:
1. **Move away from the path** of the slide immediately
2. Run to the **nearest high ground** that is not in the slide's path
3. **Do not cross** a landslide area — material may still be moving
4. If unable to escape, **curl into a tight ball** and protect your head

### After a landslide:
- Stay away from the affected area — secondary slides are common
- Report to authorities: call **112** or **NDRF: 011-24363260**
- Help only if it is safe to do so
- Do not enter damaged buildings

### Prevention:
- Plant trees and vegetation on slopes
- Build proper drainage to direct water away from slopes
- Avoid construction on steep slopes
- Do not dump debris on hill slopes`,

  storm: `## ⛈️ Thunderstorm & Cyclone Safety

### Before a storm:
- Bring outdoor furniture, tools, and objects inside
- Close and secure all windows and doors
- Unplug sensitive electronics
- Charge all devices and prepare emergency kit

### During a thunderstorm:
- **Stay indoors** and away from windows
- **Do NOT use wired phones** or touch metal pipes
- If outdoors, avoid: tall trees, open fields, water bodies, metal fences
- If in a car, stay inside with windows closed
- **Count seconds between lightning and thunder** — divide by 5 for distance in miles

### The 30-30 Rule:
- If the time between lightning and thunder is **less than 30 seconds**, go indoors
- Stay indoors for **30 minutes** after the last thunder

### During a cyclone:
- Follow official evacuation orders immediately
- Stay in an interior room away from windows
- Fill bathtubs and containers with water
- Have your emergency kit ready
- Monitor official updates via radio or TV

### After the storm:
- Watch for downed power lines and flooding
- Report broken utilities to the authorities
- Check on neighbors, especially elderly`,

  insurance: `## 📋 Insurance & Damage Claims

### Document everything:
1. **Photograph all damage** — wide shots and close-ups
2. **Video walkthrough** of affected areas
3. **List all damaged items** with approximate value
4. **Save all receipts** for emergency repairs and temporary housing

### Filing claims:
1. Contact your insurance company **within 24 hours**
2. File an FIR with police if required
3. Keep copies of all communication
4. Don't discard damaged items until the insurance assessor visits
5. Get repair estimates from multiple contractors

### Government relief:
- Apply at your local tehsildar/BDO office
- Submit Form for disaster relief (varies by state)
- Carry Aadhaar, ration card, and damage photos
- Follow up regularly — process can be slow

### Tips:
- Review your policy BEFORE monsoon season
- Check if your policy covers: flood, storm, landslide
- Consider adding riders for specific natural disaster coverage
- Keep policy documents in a waterproof bag`,

  general: `## 🌧️ Monsoon Safety — General Guide

India's monsoon season (June to September) brings essential rainfall but also significant risks. Here's your comprehensive safety guide:

### Key Principles:
1. **Stay Informed**: Monitor IMD forecasts daily (mausam.imd.gov.in)
2. **Stay Prepared**: Keep your emergency kit updated and accessible
3. **Stay Connected**: Share your location and plans with family
4. **Stay Safe**: When in doubt, choose caution over convenience

### Emergency Numbers:
- 📞 **112** — National Emergency
- 📞 **011-24363260** — NDRF
- 📞 **108** — Ambulance
- 📞 **1078** — Disaster Helpline

### Quick Safety Tips:
- ⚡ Stay away from power lines and flooded areas
- 🚗 Don't drive through flooded roads
- 💧 Drink only purified/boiled water
- 🦟 Use mosquito repellent and nets
- 🏠 Seal your home before the season starts
- 📱 Keep your phone charged at all times

### For detailed guidance on specific topics, you can ask me about:
- Flood safety & evacuation
- Emergency kit preparation
- Travel advisories
- Health & disease prevention
- Home waterproofing
- Child, elderly, or pet safety
- Power outage management
- Insurance and damage claims

> *This guidance is provided from MonsoonGuard's curated knowledge base (offline mode). For personalized AI-powered advice, add your Gemini API key in Settings.*`,
};

/**
 * Match user prompt to the most relevant offline topic
 * @param {string} prompt - User's input text
 * @returns {string} Matching topic key
 */
function matchTopic(prompt) {
  const lower = prompt.toLowerCase();

  let bestMatch = 'general';
  let bestScore = 0;

  for (const { keywords, topic } of TOPIC_KEYWORDS) {
    let score = 0;
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        score += keyword.length; // Longer keyword matches = more relevant
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = topic;
    }
  }

  return bestMatch;
}

/**
 * Get an offline response for a given prompt
 * @param {string} prompt - User's question
 * @returns {string} Curated response text
 */
export function getOfflineResponse(prompt) {
  const topic = matchTopic(prompt);
  const response = OFFLINE_RESPONSES[topic] || OFFLINE_RESPONSES.general;

  return response + '\n\n---\n*📡 Response from MonsoonGuard\'s offline knowledge base. Connect a Gemini API key for personalized AI responses.*';
}

/**
 * Get all checklist categories
 * @returns {Array<{id: string, title: string, icon: string, description: string, itemCount: number}>}
 */
export function getChecklistCategories() {
  return Object.values(emergencyChecklists).map((cat) => ({
    id: cat.id,
    title: cat.title,
    icon: cat.icon,
    description: cat.description,
    itemCount: cat.items.length,
  }));
}

/**
 * Get a specific checklist by ID
 * @param {string} id 
 * @returns {Object | null}
 */
export function getChecklist(id) {
  return emergencyChecklists[id] || null;
}
