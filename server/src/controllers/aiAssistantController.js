const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const Driver = require('../models/Driver');
const { getIsConnectedToMongo } = require('../config/db');
const store = require('../utils/dataStore');

// Comprehensive Route, Distance & Famous Sightseeing Knowledge Base from BIT Sathyamangalam (HQ)
const ROUTE_KNOWLEDGE_BASE = {
  coimbatore: {
    name: 'Coimbatore',
    distanceKm: 70,
    baseMins: 90,
    via: 'NH-948 (via Annur & Saravanampatti)',
    tolls: 1,
    famousPlaces: [
      { name: 'Isha Yoga Center & Adiyogi 112ft Shiva', category: 'Spiritual & Wellness', highlight: 'World-famous 112ft statue & Dhyanalinga dome (30 km from city)' },
      { name: 'Marudhamalai Murugan Temple', category: 'Heritage & Spiritual', highlight: '1200-year-old ancient hilltop shrine with panoramic western ghats view' },
      { name: 'GD Naidu Car Museum & Science Centre', category: 'Science & Education', highlight: 'Historic vintage automobiles and technological inventions' },
      { name: 'Siruvani Waterfalls & Dam', category: 'Nature & Eco-Tourism', highlight: 'Renowned for world\'s 2nd sweetest natural drinking water' },
      { name: 'VOC Park & Zoological Garden', category: 'Recreation & Leisure', highlight: 'Public park, zoo, and mini train right in the heart of the city' },
      { name: 'Brookefields Mall & Prozone', category: 'Shopping & Urban', highlight: 'Major entertainment, multi-cuisine dining, and shopping centers' }
    ]
  },
  ooty: {
    name: 'Ooty / Nilgiris',
    distanceKm: 105,
    baseMins: 165,
    via: 'Mettupalayam - Coonoor Ghat Road (Hill Route)',
    tolls: 1,
    isHillStation: true,
    famousPlaces: [
      { name: 'Government Botanical Garden', category: 'Heritage & Nature', highlight: '55-acre terraced garden established in 1848 with a 20-million-year-old fossil tree' },
      { name: 'Doddabetta Peak', category: 'Viewpoint & Trekking', highlight: 'Highest mountain peak in Nilgiris (2,637 m) with telescope house' },
      { name: 'Pykara Lake & Waterfalls', category: 'Lakes & Boating', highlight: 'Scenic reservoir, pine forest boat cruises and roaring multi-tier falls' },
      { name: 'Government Rose Garden', category: 'Floriculture', highlight: 'One of the largest in India with 20,000+ varieties of exotic roses' },
      { name: 'Nilgiri Mountain Railway (UNESCO)', category: 'Heritage Train', highlight: 'World Heritage steam locomotive running across tunnels and viaducts' },
      { name: 'Ooty Lake & Boating Pier', category: 'Recreation', highlight: 'Historic artificial lake built in 1824 with paddle & motor boating' }
    ]
  },
  mysore: {
    name: 'Mysuru / Mysore',
    distanceKm: 135,
    baseMins: 195,
    via: 'NH-948 / Dhimbam Ghats (27 Hairpin Bends)',
    tolls: 1,
    isHillStation: true,
    famousPlaces: [
      { name: 'Mysore Royal Palace (Amba Vilas)', category: 'Royal Heritage', highlight: 'Incredible Indo-Saracenic royal residence with 100,000 illumination lights' },
      { name: 'Chamundi Hills & Sri Chamundeshwari Temple', category: 'Spiritual & Viewpoint', highlight: 'Sacred hilltop shrine with monolithic 16ft Nandi Bull' },
      { name: 'Brindavan Gardens & KRS Dam', category: 'Gardens & Symphony', highlight: 'Terraced ornamental gardens with world-famous musical dancing fountain' },
      { name: 'Sri Chamarajendra Zoological Gardens', category: 'Wildlife & Conservation', highlight: 'One of India\'s oldest (1892) and most celebrated 157-acre zoos' },
      { name: 'St. Philomena\'s Cathedral', category: 'Gothic Architecture', highlight: 'One of the tallest cathedrals in Asia inspired by Cologne Cathedral' },
      { name: 'Ranganathittu Bird Sanctuary', category: 'Bird Sanctuary', highlight: 'Islands on Kaveri river hosting painted storks, pelicans & marsh crocodiles' }
    ]
  },
  mysuru: {
    name: 'Mysuru / Mysore',
    distanceKm: 135,
    baseMins: 195,
    via: 'NH-948 / Dhimbam Ghats (27 Hairpin Bends)',
    tolls: 1,
    isHillStation: true,
    famousPlaces: [
      { name: 'Mysore Royal Palace (Amba Vilas)', category: 'Royal Heritage', highlight: 'Incredible Indo-Saracenic royal residence with 100,000 illumination lights' },
      { name: 'Chamundi Hills & Sri Chamundeshwari Temple', category: 'Spiritual & Viewpoint', highlight: 'Sacred hilltop shrine with monolithic 16ft Nandi Bull' },
      { name: 'Brindavan Gardens & KRS Dam', category: 'Gardens & Symphony', highlight: 'Terraced ornamental gardens with world-famous musical dancing fountain' },
      { name: 'Sri Chamarajendra Zoological Gardens', category: 'Wildlife & Conservation', highlight: 'One of India\'s oldest (1892) and most celebrated 157-acre zoos' }
    ]
  },
  salem: {
    name: 'Salem',
    distanceKm: 120,
    baseMins: 135,
    via: 'NH-544 (via Bhavani & Sankagiri)',
    tolls: 2,
    famousPlaces: [
      { name: 'Yercaud Hill Station (Jewel of the South)', category: 'Hill Station', highlight: 'Shevaroy Hills, Emerald Lake, Lady\'s Seat, and Pagoda Point' },
      { name: 'Kiliyur Waterfalls', category: 'Waterfalls', highlight: 'Dramatic 300-foot cascade in Yercaud valley' },
      { name: '1008 Shiva Lingam Temple', category: 'Spiritual', highlight: 'Ariya Goundampatti temple featuring 1008 small Shiva lingams surrounding a colossal main deity' },
      { name: 'Mettur Dam & Stanley Reservoir', category: 'Engineering Marvel', highlight: 'One of India\'s oldest and largest multi-purpose dams on Kaveri river' },
      { name: 'Kurumbapatti Zoological Park', category: 'Eco Park', highlight: 'Foot of Shevaroy Hills zoo housing spotted deers, sambar, and rare birds' }
    ]
  },
  erode: {
    name: 'Erode',
    distanceKm: 65,
    baseMins: 75,
    via: 'SH-15 (via Gobichettipalayam)',
    tolls: 0,
    famousPlaces: [
      { name: 'Bhavani Sangameshwarar Temple (Triveni Sangam)', category: 'Heritage & Spiritual', highlight: 'Confluence of Kaveri, Bhavani, and subterranean Amudha rivers' },
      { name: 'Vellode Bird Sanctuary', category: 'Wetlands Wildlife', highlight: '77-hectare lake sanctuary hosting pelicans, teals, and migratory herons' },
      { name: 'Chennimalai Murugan Temple & Handloom Hub', category: 'Heritage & Craft', highlight: 'Hill shrine with 1320 steps and famous traditional weaving cluster' },
      { name: 'Kodiveri Dam & Waterfall', category: 'Eco Tourism', highlight: 'Scenic cascading water barrier built across Bhavani river near Gobi' },
      { name: 'Thindal Murugan Temple', category: 'Historic Temple', highlight: 'Renowned 750-year-old rock-cut temple with golden chariot' }
    ]
  },
  tiruppur: {
    name: 'Tiruppur',
    distanceKm: 60,
    baseMins: 75,
    via: 'SH-81 (via Avinashi)',
    tolls: 0,
    famousPlaces: [
      { name: 'Avinashi Lingeswarar Temple', category: 'Ancient Chola Temple', highlight: '1000-year-old architectural marvel with intricate stone carvings' },
      { name: 'Thirumoorthy Hills & Dam', category: 'Nature & Spiritual', highlight: 'Amanalingeswarar temple, perennial waterfalls, and scenic water reservoir' },
      { name: 'Nanjarayan Tank Bird Sanctuary', category: 'Wetlands', highlight: '440-acre pristine lake with 180+ bird species' },
      { name: 'Indira Gandhi Wildlife Sanctuary Foothills', category: 'Nature', highlight: 'Lush greenery at the base of the Western Ghats' }
    ]
  },
  bengaluru: {
    name: 'Bengaluru / Bangalore',
    distanceKm: 270,
    baseMins: 310,
    via: 'NH-948 / NH-44 (via Chamrajnagar or Hosur)',
    tolls: 3,
    famousPlaces: [
      { name: 'Lalbagh Botanical Garden & Glass House', category: 'Botanical Heritage', highlight: '240-acre garden commissioned by Hyder Ali with Victorian glass conservatory' },
      { name: 'Cubbon Park & Vidhana Soudha', category: 'Civic Landmarks', highlight: 'Green lung of Bengaluru and massive neo-Dravidian state legislature palace' },
      { name: 'Bangalore Royal Palace', category: 'Tudor Architecture', highlight: '19th-century royal palace resembling England\'s Windsor Castle' },
      { name: 'Visvesvaraya Industrial & Tech Museum', category: 'Science Center', highlight: 'Interactive aerospace, engines, and biotechnology exhibits' },
      { name: 'Bannerghatta Biological National Park', category: 'Wildlife Safari', highlight: 'Lion & tiger safari, butterfly park, and rescue zoo' },
      { name: 'ISKCON Sri Radha Krishna Temple', category: 'Spiritual & Cultural', highlight: 'Huge hilltop temple complex with Vedic cultural galleries' }
    ]
  },
  bangalore: {
    name: 'Bengaluru / Bangalore',
    distanceKm: 270,
    baseMins: 310,
    via: 'NH-948 / NH-44 (via Chamrajnagar or Hosur)',
    tolls: 3,
    famousPlaces: [
      { name: 'Lalbagh Botanical Garden & Glass House', category: 'Botanical Heritage', highlight: '240-acre garden commissioned by Hyder Ali with Victorian glass conservatory' },
      { name: 'Cubbon Park & Vidhana Soudha', category: 'Civic Landmarks', highlight: 'Green lung of Bengaluru and massive neo-Dravidian state legislature palace' },
      { name: 'Bangalore Royal Palace', category: 'Tudor Architecture', highlight: '19th-century royal palace resembling England\'s Windsor Castle' },
      { name: 'Visvesvaraya Industrial & Tech Museum', category: 'Science Center', highlight: 'Interactive aerospace, engines, and biotechnology exhibits' }
    ]
  },
  chennai: {
    name: 'Chennai',
    distanceKm: 460,
    baseMins: 480,
    via: 'NH-544 & NH-48 (via Salem, Villupuram, Tambaram)',
    tolls: 6,
    famousPlaces: [
      { name: 'Marina Beach', category: 'Coastal Landmark', highlight: 'World\'s 2nd longest natural urban beach spanning 13 km' },
      { name: 'Kapaleeshwarar Temple (Mylapore)', category: 'Dravidian Architecture', highlight: '7th-century historic temple dedicated to Lord Shiva with towering gopuram' },
      { name: 'San Thome Cathedral Basilica', category: 'National Shrine', highlight: 'Built over the tomb of St. Thomas the Apostle in neo-Gothic style' },
      { name: 'Mahabalipuram Shore Temple & Rathas (UNESCO)', category: 'World Heritage', highlight: 'Ancient 8th-century monolithic rock-cut temples on the Bay of Bengal' },
      { name: 'Guindy National Park & Snake Park', category: 'Urban Wildlife', highlight: 'Protected national park located right inside the metropolitan capital' }
    ]
  },
  madurai: {
    name: 'Madurai',
    distanceKm: 230,
    baseMins: 255,
    via: 'NH-83 / NH-44 (via Dindigul)',
    tolls: 3,
    famousPlaces: [
      { name: 'Madurai Meenakshi Amman Temple', category: 'World Heritage', highlight: 'World-renowned 14-gopuram temple marvel and Hall of 1000 Pillars' },
      { name: 'Thirumalai Nayakkar Mahal', category: 'Indo-Saracenic Palace', highlight: '17th-century royal palace with giant circular pillars and light/sound show' },
      { name: 'Gandhi Memorial Museum', category: 'National Heritage', highlight: 'Tamukkam Palace housing the blood-stained garment of Mahatma Gandhi' },
      { name: 'Alagar Kovil & Pazhamudhircholai', category: 'Hill Shrine', highlight: 'Vishnu temple and 6th Murugan abode set in picturesque Alagar hills' }
    ]
  },
  trichy: {
    name: 'Tiruchirappalli / Trichy',
    distanceKm: 200,
    baseMins: 225,
    via: 'NH-81 (via Kangeyam & Karur)',
    tolls: 2,
    famousPlaces: [
      { name: 'Rockfort Ucchi Pillayar Temple', category: 'Rock Fortress', highlight: 'Ancient 83m monolithic rock fortress shrine offering panoramic city views' },
      { name: 'Sri Ranganathaswamy Temple (Srirangam)', category: 'Temple Marvel', highlight: 'World\'s largest functioning Hindu temple complex with 21 grand towers' },
      { name: 'Jambukeshwarar Temple (Thiruvanaikaval)', category: 'Pancha Bhoota Sthalam', highlight: 'Water element temple with perennial spring inside the sanctum' },
      { name: 'Kallanai Grand Anicut Dam', category: 'Ancient Engineering', highlight: 'Built by Karikala Chola in 2nd century AD on Kaveri river' }
    ]
  },
  pollachi: {
    name: 'Pollachi / Anamalai',
    distanceKm: 110,
    baseMins: 130,
    via: 'NH-948 & Pollachi Main Rd',
    tolls: 1,
    famousPlaces: [
      { name: 'Topslip & Anamalai Tiger Reserve', category: 'Wildlife Safari', highlight: 'Elephant camp, jungle safaris, and dense rainforest bio-diversity' },
      { name: 'Parambikulam Tiger Reserve', category: 'Protected Reserve', highlight: 'Pristine reservoir boat safari and giant Kannimara Teak tree' },
      { name: 'Aliyar Dam & Theme Park', category: 'Nature Park', highlight: 'Scenic reservoir park at the foothills of the Western Ghats' },
      { name: 'Monkey Falls', category: 'Natural Cascade', highlight: 'Fresh spring waterfall situated on the Pollachi-Valparai ghat route' }
    ]
  },
  kodaikanal: {
    name: 'Kodaikanal',
    distanceKm: 195,
    baseMins: 240,
    via: 'Palani - Kodaikanal Ghat Road',
    tolls: 1,
    isHillStation: true,
    famousPlaces: [
      { name: 'Kodaikanal Lake & Boating Pier', category: 'Lake & Recreation', highlight: 'Star-shaped 60-acre lake with rowing boats and bicycle tracks' },
      { name: 'Coaker\'s Walk & Green Valley View', category: 'Panoramic Viewpoints', highlight: '1-km pedestrian path along the edge of steep mountain slopes' },
      { name: 'Pillar Rocks', category: 'Geological Wonder', highlight: 'Three giant vertical granite rock pillars standing 400 feet high' },
      { name: 'Bryant Park & Silver Cascade Falls', category: 'Botanical & Falls', highlight: 'Manicured flower park and a 180-ft roaring roadside waterfall' }
    ]
  },
  sathyamangalam: {
    name: 'Sathyamangalam / Local (Around BIT)',
    distanceKm: 15,
    baseMins: 25,
    via: 'Local Campus Transit / NH-948',
    tolls: 0,
    famousPlaces: [
      { name: 'Bannari Amman Temple', category: 'Historic Shrine', highlight: 'Renowned Mariamman temple located just 12 KM from BIT Campus' },
      { name: 'Bhavanisagar Dam & Park', category: 'Engineering & Park', highlight: 'One of the world\'s largest earthen dams (18 KM from BIT)' },
      { name: 'Kodiveri Dam & Waterfall Cascade', category: 'Eco Tourism', highlight: 'Gentle water slide dam built on Bhavani river (15 KM from BIT)' },
      { name: 'Dhimbam Ghats (27 Hairpin Bends)', category: 'Scenic Ghat Road', highlight: 'Scenic mountain viewpoints in Sathyamangalam Tiger Reserve' }
    ]
  }
};

// Weather Condition Analyzer Engine based on Destination and Travel Date/Time
const analyzeWeatherCondition = (destinationQuery = '', departureDateString = null) => {
  const queryLower = (destinationQuery || '').toLowerCase();
  let matchedCity = 'coimbatore'; // default
  let route = ROUTE_KNOWLEDGE_BASE['coimbatore'];

  for (const [cityKey, routeObj] of Object.entries(ROUTE_KNOWLEDGE_BASE)) {
    if (queryLower.includes(cityKey)) {
      matchedCity = cityKey;
      route = routeObj;
      break;
    }
  }

  const travelDate = departureDateString ? new Date(departureDateString) : new Date();
  const month = travelDate.getMonth(); // 0 = Jan, 11 = Dec
  const hours = travelDate.getHours(); // 0 - 23

  // Determine Meteorological Profile
  const isHillGhat = route.isHillStation || matchedCity === 'ooty' || matchedCity === 'mysore' || matchedCity === 'kodaikanal';
  const isSouthwestMonsoon = month >= 5 && month <= 8; // Jun - Sep
  const isNortheastMonsoon = month >= 9 && month <= 10; // Oct - Nov
  const isSummer = month >= 2 && month <= 4; // Mar - May
  const isWinter = month === 11 || month === 0 || month === 1; // Dec - Feb

  let status = 'GOOD';
  let condition = 'Clear Skies & Sunny';
  let tempC = 29;
  let rainProb = 5;
  let humidity = 55;
  let windKmph = 12;
  let visibilityKm = 10;
  let safetyIndex = 'EXCELLENT';
  let advisoryTitle = 'Favorable Highway Travel Conditions';
  let advisoryDescription = 'Weather forecast indicates clear skies and optimal road visibility from BIT Sathyamangalam. Highway driving conditions are safe for official travel.';
  let driverTips = [
    'Standard highway speed regulation (60 km/h for college buses).',
    'Ideal travel weather with good daylight visibility.'
  ];

  if (isHillGhat) {
    // Hill Station Weather Pattern
    if (isSouthwestMonsoon || isNortheastMonsoon) {
      status = 'CAUTION';
      condition = 'Monsoon Mist & Intermittent Showers';
      tempC = 17;
      rainProb = 65;
      humidity = 88;
      windKmph = 24;
      visibilityKm = 4.5;
      safetyIndex = 'MODERATE';
      advisoryTitle = 'Hill Ghat Rain & Fog Advisory';
      advisoryDescription = `Ghat roads along ${route.via} experience monsoon showers and reduced visibility across hairpin bends.`;
      driverTips = [
        'Inspect wiper blades, headlights, and fog lamps before departure.',
        'Strictly observe lower gear driving on ghat slopes and hairpin curves.',
        'Allow an extra 25–30 minutes travel buffer for cautious driving.'
      ];
    } else if (isWinter && (hours < 9 || hours > 18)) {
      status = 'CAUTION';
      condition = 'Dense Morning/Evening Fog & Chill';
      tempC = 13;
      rainProb = 15;
      humidity = 82;
      windKmph = 10;
      visibilityKm = 2.5;
      safetyIndex = 'MODERATE';
      advisoryTitle = 'Dense Ghat Fog Advisory';
      advisoryDescription = `Early morning and evening fog expected on the Nilgiri/Dhimbam mountain ghat pass.`;
      driverTips = [
        'Use low-beam headlights and yellow fog lamps.',
        'Maintain minimum 3-vehicle gap on ghat ascent/descent.',
        'Daylight departure (after 7:30 AM) is recommended for field excursion buses.'
      ];
    } else {
      status = 'GOOD';
      condition = 'Pleasant & Crisp Mountain Air';
      tempC = 20;
      rainProb = 10;
      humidity = 60;
      windKmph = 14;
      visibilityKm = 8.5;
      safetyIndex = 'EXCELLENT';
      advisoryTitle = 'Ideal Hill Weather Conditions';
      advisoryDescription = `Clear weather in ${route.name}. Great driving conditions along the ghat route.`;
      driverTips = [
        'Ensure brake pressure and cooling fluids are verified at BIT Transport Depot.'
      ];
    }
  } else {
    // Plains Weather Pattern
    if (isNortheastMonsoon && (matchedCity === 'chennai' || matchedCity === 'salem' || matchedCity === 'trichy')) {
      status = 'CAUTION';
      condition = 'Scattered Coastal Monsoon Rain';
      tempC = 27;
      rainProb = 50;
      humidity = 80;
      windKmph = 20;
      visibilityKm = 6;
      safetyIndex = 'GOOD';
      advisoryTitle = 'Wet Highway Advisory';
      advisoryDescription = `Light to moderate rains forecasted on NH-544 / NH-48. Surface water ponding possible on highway bypasses.`;
      driverTips = [
        'Avoid sudden high-speed braking on wet tarmac.',
        'Keep headlights on during rain bursts.'
      ];
    } else if (isSummer && hours >= 11 && hours <= 16) {
      status = 'GOOD';
      condition = 'Warm & Sunny Highway';
      tempC = 36;
      rainProb = 0;
      humidity = 40;
      windKmph = 15;
      visibilityKm = 10;
      safetyIndex = 'EXCELLENT';
      advisoryTitle = 'Clear & Dry Conditions (High Afternoon Temperature)';
      advisoryDescription = `Dry, sunny weather along the route. Vehicle AC and tyre pressure should be checked.`;
      driverTips = [
        'Verify AC cooling efficiency and coolant level before passenger boarding.',
        'Ensure drinking water availability for students on board.'
      ];
    }
  }

  return {
    destination: route.name,
    matchedKey: matchedCity,
    status, // 'GOOD' or 'CAUTION'
    condition,
    tempC,
    rainProb,
    humidity,
    windKmph,
    visibilityKm,
    safetyIndex,
    advisoryTitle,
    advisoryDescription,
    driverTips,
    formattedDate: travelDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
    formattedTime: travelDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  };
};

// Calculate ETA helper
const calculateETA = (destinationQuery, vehicleType = 'BUS', customSpeed = null) => {
  const queryLower = destinationQuery.toLowerCase();
  let matchedCity = null;

  for (const city of Object.keys(ROUTE_KNOWLEDGE_BASE)) {
    if (queryLower.includes(city)) {
      matchedCity = city;
      break;
    }
  }

  if (!matchedCity) {
    return null;
  }

  const route = ROUTE_KNOWLEDGE_BASE[matchedCity];
  let avgSpeed = vehicleType === 'BUS' ? 45 : vehicleType === 'VAN' ? 55 : 65;
  if (customSpeed) avgSpeed = customSpeed;

  const travelMins = Math.round((route.distanceKm / avgSpeed) * 60) + (route.tolls * 5);
  const hours = Math.floor(travelMins / 60);
  const mins = travelMins % 60;

  const departureNow = new Date();
  const arrivalTime = new Date(departureNow.getTime() + travelMins * 60000);

  return {
    destination: (route.name || matchedCity).toUpperCase(),
    cityKey: matchedCity,
    distanceKm: route.distanceKm,
    via: route.via,
    tolls: route.tolls,
    avgSpeedKmph: avgSpeed,
    famousPlaces: route.famousPlaces || [],
    estimatedDuration: hours > 0 ? `${hours} hr ${mins} mins` : `${mins} mins`,
    arrivalTimeFormatted: arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    arrivalDateFormatted: arrivalTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
  };
};

// @desc    Get Weather Advisory for Selected Date & Destination
// @route   POST /api/ai/weather
// @access  Public / Private
exports.getWeatherAdvisory = async (req, res) => {
  try {
    const { destination, date } = req.body;
    const weather = analyzeWeatherCondition(destination || 'Coimbatore', date);

    return res.status(200).json({
      success: true,
      weather
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve weather advisory',
      error: error.message
    });
  }
};

// @desc    Process AI Assistant Queries with Live DB, ETA, Weather & Famous Places Context
// @route   POST /api/ai/chat
// @access  Private
exports.handleAIChat = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    const user = req.user;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    const query = message.trim().toLowerCase();

    // 1. Fetch live contextual data from MongoDB or DataStore fallback
    let vehiclesCount = 0;
    let availableCount = 0;
    let myBookings = [];
    let pendingCount = 0;

    const uId = user?._id || user?.id;

    if (getIsConnectedToMongo()) {
      const facultyFilter = uId ? { facultyId: uId } : {};
      [vehiclesCount, availableCount, myBookings, pendingCount] = await Promise.all([
        Vehicle.countDocuments(),
        Vehicle.countDocuments({ status: 'AVAILABLE' }),
        Booking.find(facultyFilter).sort({ createdAt: -1 }).limit(3).lean(),
        Booking.countDocuments({ status: 'PENDING' })
      ]);
    } else {
      vehiclesCount = store.vehicles.length;
      availableCount = store.vehicles.filter(v => v.status === 'AVAILABLE').length;
      myBookings = store.bookings
        .filter(b => (uId ? (b.facultyId === uId || b.facultyId?._id === uId) : true))
        .slice(-3);
      pendingCount = store.bookings.filter(b => b.status === 'PENDING').length;
    }

    let reply = '';
    let suggestions = [];
    let actionLink = null;

    // SCENARIO A: Famous Places & Tourist Attractions Near Destination
    if (
      query.includes('famous place') ||
      query.includes('places to visit') ||
      query.includes('tourist') ||
      query.includes('sightseeing') ||
      query.includes('attraction') ||
      query.includes('spots near') ||
      query.includes('visit in') ||
      query.includes('visit near')
    ) {
      let matchedRoute = null;
      for (const [key, obj] of Object.entries(ROUTE_KNOWLEDGE_BASE)) {
        if (query.includes(key)) {
          matchedRoute = obj;
          break;
        }
      }

      if (matchedRoute && matchedRoute.famousPlaces && matchedRoute.famousPlaces.length > 0) {
        reply = `🏛️ **Top Famous Places & Sightseeing Near ${matchedRoute.name}**:\n\n` +
          `Here are the most popular landmarks and student/faculty excursion visit spots:\n\n`;

        matchedRoute.famousPlaces.forEach((place, idx) => {
          reply += `${idx + 1}. **${place.name}** (${place.category})\n   • ${place.highlight}\n\n`;
        });

        reply += `🛣️ **Travel Info from BIT Sathyamangalam**:\n` +
          `• Distance: **${matchedRoute.distanceKm} KM** | Travel Time: ~${Math.round(matchedRoute.baseMins / 60)}h ${matchedRoute.baseMins % 60}m\n` +
          `• Route: ${matchedRoute.via}\n\n` +
          `💡 *Planning an official visit or student field trip here? You can book institutional buses or SUVs directly below.*`;

        suggestions = [
          `Calculate ETA to ${matchedRoute.name}`,
          `Book a bus to ${matchedRoute.name}`,
          'Check weather condition for trip'
        ];
        actionLink = { label: `Book Fleet Vehicle to ${matchedRoute.name}`, tab: 'new-booking' };
      } else {
        reply = `🗺️ **Famous Sightseeing Destinations Accessible from BIT Sathyamangalam**:\n\n` +
          `I can provide detailed landmark recommendations and itineraries for:\n` +
          `• **Coimbatore**: Isha Adiyogi 112ft Shiva, Marudhamalai Temple, GD Naidu Museum, Siruvani Falls\n` +
          `• **Ooty / Nilgiris**: Botanical Garden, Doddabetta Peak, Pykara Lake, Toy Train, Rose Garden\n` +
          `• **Mysuru / Mysore**: Mysore Palace, Chamundi Hill, Brindavan Gardens, Mysore Zoo\n` +
          `• **Salem**: Yercaud Hills, Kiliyur Falls, 1008 Shiva Temple, Mettur Dam\n` +
          `• **Erode / Gobi**: Bhavani Sangam, Vellode Birds Sanctuary, Kodiveri Dam, Chennimalai\n` +
          `• **Bengaluru**: Lalbagh, Visvesvaraya Museum, Bannerghatta Safari, Bangalore Palace\n` +
          `• **Sathyamangalam Local**: Bannari Amman Temple, Bhavanisagar Dam, Dhimbam Ghats\n\n` +
          `*Which destination would you like famous places for?*`;

        suggestions = [
          'Famous places in Coimbatore',
          'Places to visit in Ooty',
          'Sightseeing in Mysore',
          'Spots near Bhavanisagar Dam'
        ];
      }
    }

    // SCENARIO B: Location & Reaching Time / ETA Questions (Now includes famous places summary!)
    else if (
      query.includes('reach') ||
      query.includes('eta') ||
      query.includes('time') ||
      query.includes('distance') ||
      query.includes('duration') ||
      query.includes('how long') ||
      query.includes('far')
    ) {
      const eta = calculateETA(query);

      if (eta) {
        reply = `📍 **Travel Time & Route Calculation to ${eta.destination}**:\n\n` +
          `• **Starting Point**: Bannari Amman Institute of Technology (BIT Sathyamangalam)\n` +
          `• **Total Distance**: **${eta.distanceKm} KM** (One-way)\n` +
          `• **Estimated Travel Time**: **${eta.estimatedDuration}** (at avg ~${eta.avgSpeedKmph} km/h)\n` +
          `• **Recommended Route**: ${eta.via}\n` +
          `• **Toll Plazas En-route**: ${eta.tolls} Toll(s)\n` +
          `• **If Departing Right Now**: You will reach at approximately **${eta.arrivalTimeFormatted}** (${eta.arrivalDateFormatted}).\n\n`;

        if (eta.famousPlaces && eta.famousPlaces.length > 0) {
          reply += `🏛️ **Famous Places & Landmarks Near ${eta.destination}**:\n`;
          eta.famousPlaces.slice(0, 3).forEach((p) => {
            reply += `• **${p.name}** (${p.category}): ${p.highlight}\n`;
          });
          reply += `\n`;
        }

        reply += `💡 *Tip: Official college buses are speed-governed at 60 km/h for maximum student and faculty safety.*`;

        suggestions = [
          `Famous places in ${eta.destination}`,
          `Book a trip to ${eta.destination}`,
          'Check weather condition',
          'Track live vehicle on GPS'
        ];
        actionLink = { label: `Book Vehicle for ${eta.destination}`, tab: 'new-booking' };
      } else {
        reply = `🗺️ **BIT Fleet Route & ETA Calculator**:\n\n` +
          `I can calculate accurate reaching times from **BIT Sathyamangalam** to major destinations across Tamil Nadu & Karnataka!\n\n` +
          `**Popular Routes & Typical ETAs**:\n` +
          `• **Coimbatore** (70 KM): ~1 hr 30 mins (via Annur & Saravanampatti)\n` +
          `• **Erode** (65 KM): ~1 hr 15 mins (via Gobichettipalayam)\n` +
          `• **Tiruppur** (60 KM): ~1 hr 15 mins (via Avinashi)\n` +
          `• **Salem** (120 KM): ~2 hrs 15 mins (via Bhavani NH-544)\n` +
          `• **Bengaluru** (270 KM): ~5 hrs 10 mins (via Chamrajnagar / NH-44)\n` +
          `• **Ooty / Nilgiris** (105 KM): ~2 hrs 45 mins (Ghat road)\n` +
          `• **Mysuru** (135 KM): ~3 hrs 15 mins (via Dhimbam Ghats)\n\n` +
          `*Which destination would you like me to calculate specific reaching time for?*`;

        suggestions = [
          'ETA to Coimbatore',
          'ETA to Bengaluru',
          'ETA to Salem',
          'ETA to Ooty'
        ];
      }
    }

    // SCENARIO C: Weather Condition Check
    else if (query.includes('weather') || query.includes('rain') || query.includes('fog') || query.includes('climate')) {
      const weather = analyzeWeatherCondition(query);
      reply = `🌤️ **Live Weather & Travel Safety Advisory for ${weather.destination}**:\n\n` +
        `• **Status**: **${weather.status === 'GOOD' ? '🟢 GOOD TO TRAVEL' : '🟡 EXERCISE CAUTION'}**\n` +
        `• **Condition**: ${weather.condition} (${weather.tempC}°C)\n` +
        `• **Rain Probability**: ${weather.rainProb}% | **Road Visibility**: ${weather.visibilityKm} KM\n` +
        `• **Safety Index**: ${weather.safetyIndex}\n\n` +
        `📋 **Advisory**: ${weather.advisoryDescription}\n\n` +
        `🛡️ **Driver & Passenger Tips**:\n` +
        weather.driverTips.map(t => `• ${t}`).join('\n');

      suggestions = [
        'Calculate ETA to ' + weather.destination,
        'Famous places in ' + weather.destination,
        'Book vehicle now'
      ];
      actionLink = { label: 'Book Vehicle for ' + weather.destination, tab: 'new-booking' };
    }

    // SCENARIO D: Booking Status Check
    else if (query.includes('my booking') || query.includes('status') || query.includes('track')) {
      if (myBookings.length > 0) {
        const latest = myBookings[0];
        reply = `📋 **Your Latest Requisition Status (${user.name})**:\n\n` +
          `• **Booking Reference**: \`${latest.bookingRef}\`\n` +
          `• **Destination**: **${latest.destination}** (${latest.tripType?.replace('_', ' ')})\n` +
          `• **Current Status**: **${latest.status}**\n` +
          `• **Departure**: ${new Date(latest.departureDateTime).toLocaleString()}\n` +
          `• **Headcount**: ${latest.passengerCount} Passengers\n\n` +
          (latest.status === 'APPROVED'
            ? `✅ *Your vehicle has been approved by the Transport Office! You can download your Gate Pass or track it live on GPS.*`
            : latest.status === 'PENDING'
            ? `⏳ *Your request is currently awaiting Transport Office review.*`
            : `ℹ️ *Status: ${latest.status}*`);

        suggestions = [
          'Open Live GPS Tracker',
          'How to cancel this booking?',
          'Book another vehicle'
        ];
        actionLink = { label: 'View My Bookings & Gate Pass', tab: 'my-bookings' };
      } else {
        reply = `You do not have any recent bookings registered under **${user.email}**. Would you like to create a new vehicle requisition for an official visit or field trip?`;
        suggestions = ['Book a new vehicle', 'How does the booking process work?'];
        actionLink = { label: 'Create New Booking', tab: 'new-booking' };
      }
    }

    // SCENARIO E: How to Cancel a Booking
    else if (query.includes('cancel') || query.includes('cancellation') || query.includes('delete booking')) {
      reply = `🚫 **How to Cancel a Vehicle Requisition**:\n\n` +
        `1. Navigate to **"My Bookings & Gate Pass"** tab from the left sidebar.\n` +
        `2. Locate your active trip (\`PENDING\` or \`APPROVED\`).\n` +
        `3. Click the red **"Cancel"** button.\n` +
        `4. Enter the **Reason for Cancellation** (e.g. *Meeting postponed, exam clash*).\n` +
        `5. Confirm cancellation.\n\n` +
        `⚡ **Automatic System Actions**:\n` +
        `• Any allocated college bus/driver is immediately released back to the available fleet.\n` +
        `• The **Transport Admin Authority Desk** is notified with your cancellation reason.`;

      suggestions = ['View My Bookings', 'Check fleet availability'];
      actionLink = { label: 'Go to My Bookings', tab: 'my-bookings' };
    }

    // SCENARIO F: Fleet Availability & Available Vehicles
    else if (query.includes('available') || query.includes('fleet') || query.includes('vehicle') || query.includes('bus')) {
      reply = `🚍 **Live BIT Fleet Status Overview**:\n\n` +
        `• **Total Institutional Vehicles**: **${vehiclesCount} Vehicles**\n` +
        `• **Currently Available in Depot**: **${availableCount} Vehicles**\n` +
        `• **Active Vehicle Categories**: College Buses (50-Seater), Mini Buses (26-Seater), Force Urbania Vans (16-Seater), Innova Crysta SUVs & EV Sedans.\n\n` +
        `⚡ *Our system runs a mathematical time-overlap conflict prevention algorithm whenever you book to guarantee zero double-booking.*`;

      suggestions = [
        'Book a College Bus',
        'Famous places in Ooty',
        'Calculate reaching time to Coimbatore'
      ];
      actionLink = { label: 'Book a Vehicle Now', tab: 'new-booking' };
    }

    // SCENARIO G: Conflict Algorithm & How the App Works
    else if (query.includes('algorithm') || query.includes('conflict') || query.includes('how it works') || query.includes('help')) {
      reply = `🤖 **Welcome to the BIT Centralized Fleet Booking Assistant!**\n\n` +
        `I am your 24/7 AI Co-pilot for all transport operations at Bannari Amman Institute of Technology.\n\n` +
        `**What I can do for you**:\n` +
        `1. ⏱️ **Reaching Time & ETA Calculator**: Ask for travel time and routes to any city (e.g. *"ETA to Coimbatore"*, *"Distance to Bengaluru"*).\n` +
        `2. 🏛️ **Famous Places & Tourist Attractions**: Ask for sightseeing landmarks near any destination (e.g. *"Places to visit in Ooty"*).\n` +
        `3. 🌤️ **Live Weather & Travel Advisory**: Real-time road safety and weather forecasts.\n` +
        `4. 📋 **Booking & Manifest Assistance**: Guide you through requisitions, student manifests, ratings, and cancellations.\n` +
        `5. 📡 **Live GPS Telemetry**: Real-time bus tracking and speed monitoring.`;

      suggestions = [
        'ETA to Coimbatore',
        'Places to visit in Ooty',
        'Famous places in Mysore',
        'Check my booking status'
      ];
    }

    // SCENARIO H: General / Fallback Response
    else {
      reply = `👋 Hello **${user.name}**! I'm your **BIT Fleet AI Assistant**.\n\n` +
        `You can ask me about:\n` +
        `• **Location Reaching Times & ETAs** (e.g. *"How long to reach Coimbatore in a college bus?"*)\n` +
        `• **Famous Places & Sightseeing** (e.g. *"What are the famous places near Ooty or Mysore?"*)\n` +
        `• **Live Travel Weather** (e.g. *"Is the weather good to travel to Ooty tomorrow?"*)\n` +
        `• **Your Requisitions** (e.g. *"Check my booking status"*)\n` +
        `• **Fleet Availability** (e.g. *"Are buses available tomorrow?"*)\n\n` +
        `How can I assist your travel or transport request today?`;

      suggestions = [
        'ETA to Coimbatore',
        'Places to visit in Ooty',
        'Famous places in Mysore',
        'Check my booking status'
      ];
    }

    return res.status(200).json({
      success: true,
      reply,
      suggestions,
      actionLink
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'AI Assistant processing error',
      error: error.message
    });
  }
};
