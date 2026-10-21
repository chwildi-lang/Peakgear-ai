import { GearItem, GpxTour, UserProfile } from '../types/app';

export const INITIAL_GEAR: GearItem[] = [
  // Baselayer
  {
    id: 'gear-1',
    name: 'Merinowolle Longsleeve 200g/m²',
    brand: 'Icebreaker Oasis',
    category: 'baselayer',
    weightGrams: 210,
    tempMin: -15,
    tempMax: 12,
    isWaterproof: false,
    isWindproof: false,
    sports: ['hiking', 'mountaineering', 'skitour', 'snowshoe'],
    condition: 'Sehr gut',
    isFavorite: true,
    notes: 'Geruchshemmend, wärmt auch in feuchtem Zustand.'
  },
  {
    id: 'gear-2',
    name: 'Technisches Kurzarm-Shirt Coolmax',
    brand: 'Patagonia Capilene',
    category: 'baselayer',
    weightGrams: 115,
    tempMin: 12,
    tempMax: 32,
    isWaterproof: false,
    isWindproof: false,
    sports: ['hiking', 'trailrunning', 'via_ferrata', 'gravel_bike'],
    condition: 'Neuwertig',
    notes: 'Extrem schnelltrocknend für schweißtreibende Aufstiege.'
  },

  // Midlayer
  {
    id: 'gear-3',
    name: 'Waffelfleece Midlayer mit Kapuze',
    brand: 'Ortovox Fleece Light',
    category: 'midlayer',
    weightGrams: 330,
    tempMin: -5,
    tempMax: 15,
    isWaterproof: false,
    isWindproof: false,
    sports: ['hiking', 'mountaineering', 'skitour', 'snowshoe', 'via_ferrata'],
    condition: 'Sehr gut',
    notes: 'Atmungsaktive Waffelstruktur innen, ergonomische Helm-Kapuze.'
  },
  {
    id: 'gear-4',
    name: 'Ultraleichte Daunenjacke 800 cuin',
    brand: 'Mountain Equipment Frostline',
    category: 'midlayer',
    weightGrams: 360,
    tempMin: -25,
    tempMax: 5,
    isWaterproof: false,
    isWindproof: true,
    sports: ['hiking', 'mountaineering', 'skitour', 'snowshoe'],
    condition: 'Neuwertig',
    notes: 'Gipfel- und Rast-Isolation, komprimierbar auf Faustgröße.'
  },

  // Hardshell & Wetterschutz
  {
    id: 'gear-5',
    name: 'Gore-Tex Pro 3-Lagen Alpinjacke',
    brand: 'Mammut Nordwand Pro',
    category: 'hardshell',
    weightGrams: 490,
    tempMin: -30,
    tempMax: 10,
    isWaterproof: true,
    isWindproof: true,
    sports: ['mountaineering', 'skitour', 'snowshoe', 'hiking'],
    condition: 'Sehr gut',
    isFavorite: true,
    notes: '28.000 mm Wassersäule, helmtauglich, sturmfest am Grat.'
  },
  {
    id: 'gear-6',
    name: 'Paclite Not-Regenhose 2.5 Lagen',
    brand: 'Black Diamond StormLine',
    category: 'hardshell',
    weightGrams: 275,
    tempMin: -10,
    tempMax: 15,
    isWaterproof: true,
    isWindproof: true,
    sports: ['hiking', 'mountaineering', 'via_ferrata', 'gravel_bike'],
    condition: 'Sehr gut',
    notes: 'Durchgehende Seitenreißverschlüsse für schnelles Überziehen mit Schuhen.'
  },

  // Hosen
  {
    id: 'gear-7',
    name: 'Robuste 4-Wege-Stretch Softshellhose',
    brand: 'Salewa Terminal DST',
    category: 'pants',
    weightGrams: 390,
    tempMin: -5,
    tempMax: 18,
    isWaterproof: false,
    isWindproof: true,
    sports: ['hiking', 'mountaineering', 'via_ferrata', 'snowshoe'],
    condition: 'Sehr gut',
    notes: 'Wasserabweisend DWR, Kantenschutz an den Beinenden.'
  },

  // Schuhe
  {
    id: 'gear-8',
    name: 'Bergschuhe Kat. B/C steigeisenfest (Kipphebel hinten)',
    brand: 'La Sportiva Nepal Trek',
    category: 'footwear',
    weightGrams: 1580,
    tempMin: -20,
    tempMax: 15,
    isWaterproof: true,
    isWindproof: true,
    sports: ['mountaineering', 'snowshoe', 'hiking'],
    condition: 'Sehr gut',
    notes: 'Steife Brandsohle für Steigeisen & Schotterkare.'
  },
  {
    id: 'gear-9',
    name: 'Gore-Tex Trailrunningschuhe mit Spikegrip',
    brand: 'Salomon Speedcross 6 GTX',
    category: 'footwear',
    weightGrams: 640,
    tempMin: 0,
    tempMax: 22,
    isWaterproof: true,
    isWindproof: true,
    sports: ['trailrunning', 'hiking'],
    condition: 'Gebraucht',
    notes: 'Tiefes Chevron-Stollenprofil für Schlamm, Nässe und weichen Boden.'
  },

  // Hardware & Technische Ausrüstung
  {
    id: 'gear-10',
    name: 'Leichtsteigeisen 10-Zacker mit Antistollplatten',
    brand: 'Petzl Vasak Leverlock',
    category: 'hardware',
    weightGrams: 810,
    tempMin: -30,
    tempMax: 5,
    isWaterproof: true,
    isWindproof: true,
    sports: ['mountaineering', 'skitour'],
    condition: 'Neuwertig',
    notes: 'Unverzichtbar bei Altschneefeldern, Gletscherquerungen und vereisten Rinnen.'
  },
  {
    id: 'gear-11',
    name: 'MSR Lightning Ascent Schneeschuhe 25"',
    brand: 'MSR Lightning',
    category: 'hardware',
    weightGrams: 1910,
    tempMin: -30,
    tempMax: 5,
    isWaterproof: true,
    isWindproof: true,
    sports: ['snowshoe'],
    condition: 'Sehr gut',
    notes: 'Aggressive 360°-Traktionsrahmen und Ergo-Steighilfe für steiles Wintergelände.'
  },
  {
    id: 'gear-12',
    name: 'Grödel / Schuhketten Pro Spikes',
    brand: 'Snowline Chainsen Pro',
    category: 'hardware',
    weightGrams: 360,
    tempMin: -20,
    tempMax: 5,
    isWaterproof: true,
    isWindproof: true,
    sports: ['hiking', 'snowshoe', 'trailrunning'],
    condition: 'Sehr gut',
    notes: '1cm lange Stahlkrallen für vereiste Wanderwege und feste Schneedecken.'
  },
  {
    id: 'gear-13',
    name: 'Klettersteigset mit Bandfalldämpfer',
    brand: 'Edelrid Cable Comfort 5.0',
    category: 'hardware',
    weightGrams: 570,
    tempMin: -10,
    tempMax: 35,
    isWaterproof: true,
    isWindproof: true,
    sports: ['via_ferrata', 'mountaineering'],
    condition: 'Neuwertig',
    notes: 'One-Touch Karabiner mit Wirbel gegen Verdrehen der Arme.'
  },
  {
    id: 'gear-14',
    name: 'Bergsteiger- & Klettersteighelm EPS',
    brand: 'Petzl Meteor',
    category: 'hardware',
    weightGrams: 240,
    tempMin: -20,
    tempMax: 35,
    isWaterproof: true,
    isWindproof: true,
    sports: ['via_ferrata', 'mountaineering', 'skitour'],
    condition: 'Neuwertig',
    notes: 'Zertifiziert für Steinschlag und Skitourennorm CE PCSR-001.'
  },

  // ZWINGENDE SICHERHEITSAUSRÜSTUNG (LVS etc.)
  {
    id: 'gear-15',
    name: 'LVS-Gerät 3-Antennen Digital (Suchbreite 70m)',
    brand: 'Mammut Barryvox S',
    category: 'safety',
    weightGrams: 210,
    tempMin: -25,
    tempMax: 10,
    isWaterproof: true,
    isWindproof: true,
    sports: ['skitour', 'snowshoe', 'mountaineering'],
    condition: 'Neuwertig',
    isMandatorySafety: true,
    isFavorite: true,
    notes: 'Akustische und optische Zielführung, Gruppentest-Funktion, W-Link.'
  },
  {
    id: 'gear-16',
    name: 'Lawinensonde Aluminium 280cm mit Schnellspannsystem',
    brand: 'Ortovox Alu 280+ PFA',
    category: 'safety',
    weightGrams: 310,
    tempMin: -30,
    tempMax: 10,
    isWaterproof: true,
    isWindproof: true,
    sports: ['skitour', 'snowshoe', 'mountaineering'],
    condition: 'Neuwertig',
    isMandatorySafety: true,
    notes: 'Tiefenskalierung mit Farbcodierung, blitzschnell gespannt.'
  },
  {
    id: 'gear-17',
    name: 'Lawinenschaufel Gehärtetes Aluminium mit D-Griff',
    brand: 'Ortovox Pro Alu III',
    category: 'safety',
    weightGrams: 770,
    tempMin: -30,
    tempMax: 10,
    isWaterproof: true,
    isWindproof: true,
    sports: ['skitour', 'snowshoe', 'mountaineering'],
    condition: 'Neuwertig',
    isMandatorySafety: true,
    notes: 'Scharfe Schneide, 90°-Räumfunktion (Hackfunktion) für Hartschnee.'
  },
  {
    id: 'gear-18',
    name: 'Alpine Notfalltasche (Erste-Hilfe + Rettungsdecke)',
    brand: 'Deuter First Aid Kit Pro',
    category: 'safety',
    weightGrams: 340,
    tempMin: -30,
    tempMax: 40,
    isWaterproof: true,
    isWindproof: true,
    sports: ['hiking', 'trailrunning', 'mountaineering', 'skitour', 'snowshoe', 'via_ferrata', 'gravel_bike'],
    condition: 'Sehr gut',
    isMandatorySafety: true,
    notes: 'Verbandsmaterial, Sam-Splint Schiene, Zeckenzange, Dreiecktuch.'
  },
  {
    id: 'gear-19',
    name: 'Biwaksack Thermo 2 Personen reflektierend',
    brand: 'Ortovox Bivy Double',
    category: 'safety',
    weightGrams: 390,
    tempMin: -30,
    tempMax: 20,
    isWaterproof: true,
    isWindproof: true,
    sports: ['hiking', 'mountaineering', 'skitour', 'snowshoe', 'via_ferrata'],
    condition: 'Neuwertig',
    isMandatorySafety: true,
    notes: 'Silberbeschichtung innen zur Wärmereflexion bei ungeplantem Notbiwak.'
  },
  {
    id: 'gear-20',
    name: 'Stirnlampe 450 Lumen mit Rotlicht & Akku',
    brand: 'Petzl Actik Core',
    category: 'safety',
    weightGrams: 75,
    tempMin: -20,
    tempMax: 35,
    isWaterproof: true,
    isWindproof: true,
    sports: ['hiking', 'trailrunning', 'mountaineering', 'skitour', 'snowshoe', 'via_ferrata'],
    condition: 'Sehr gut',
    isMandatorySafety: true,
    notes: 'USB-C wiederaufladbar, IPX4 spritzwassergeschützt.'
  },

  // Zubehör & Essen
  {
    id: 'gear-21',
    name: 'Gletscher- & Höhen-Sonnenbrille Kat. 4 mit Seitenschutz',
    brand: 'Julbo Explorer 2.0',
    category: 'accessories',
    weightGrams: 44,
    tempMin: -30,
    tempMax: 35,
    isWaterproof: true,
    isWindproof: true,
    sports: ['mountaineering', 'skitour', 'snowshoe', 'hiking'],
    condition: 'Sehr gut',
    notes: '95% UV/Lichtfilterung gegen Schneeblindheit im Hochgebirge.'
  },
  {
    id: 'gear-22',
    name: 'Winddichte Softshell-Fingerhandschuhe',
    brand: 'Black Diamond Wind Hood Grid Tech',
    category: 'accessories',
    weightGrams: 90,
    tempMin: -2,
    tempMax: 12,
    isWaterproof: false,
    isWindproof: true,
    sports: ['hiking', 'mountaineering', 'skitour', 'snowshoe', 'trailrunning'],
    condition: 'Sehr gut',
    notes: 'Mit verstaubarer winddichter Fäustling-Kappe.'
  },
  {
    id: 'gear-23',
    name: 'Expeditions-Fausthandschuhe Primaloft Gold',
    brand: 'Hestra Army Leather Extreme',
    category: 'accessories',
    weightGrams: 280,
    tempMin: -30,
    tempMax: -5,
    isWaterproof: true,
    isWindproof: true,
    sports: ['skitour', 'snowshoe', 'mountaineering'],
    condition: 'Sehr gut',
    notes: 'Für bittere Kälte, stürmische Grate und Wintergipfel.'
  },
  {
    id: 'gear-24',
    name: 'Isolierte Edelstahl-Thermosflasche 1.0L',
    brand: 'Thermos Mountain FFB',
    category: 'food_hydration',
    weightGrams: 480,
    tempMin: -30,
    tempMax: 35,
    isWaterproof: true,
    isWindproof: true,
    sports: ['hiking', 'mountaineering', 'skitour', 'snowshoe'],
    condition: 'Sehr gut',
    notes: 'Hält heißen Ingwer-Tee bis zu 24 Stunden dampfend warm.'
  }
];

export const INITIAL_TOURS: GpxTour[] = [
  {
    id: 'tour-1',
    name: 'Zugspitz-Gatterl & Knorrhütte',
    sport: 'hiking',
    region: 'Wettersteingebirge / Tirol & Bayern',
    isFavorite: true,
    distanceKm: 14.8,
    elevationGainM: 1480,
    elevationLossM: 420,
    maxAltitudeM: 2215,
    minAltitudeM: 1100,
    estimatedHours: 5.5,
    technicalDifficulty: 'T3',
    terrain: ['Almboden', 'Schotter & Felsstufen', 'Drahtseilsicherung am Gatterl'],
    description: 'Klassische Überschreitung von Ehrwald über das Gatterl auf das Zugspitzplatt. Abwechslungsreich mit Panoramablick auf die Mieminger Kette.',
    profilePoints: [
      { distKm: 0, altitudeM: 1100 },
      { distKm: 2.5, altitudeM: 1450 },
      { distKm: 5.2, altitudeM: 1720 },
      { distKm: 7.8, altitudeM: 1980 },
      { distKm: 9.4, altitudeM: 2215 },
      { distKm: 11.5, altitudeM: 2051 },
      { distKm: 14.8, altitudeM: 1950 }
    ]
  },
  {
    id: 'tour-2',
    name: 'Watzmann-Überschreitung (Hocheck – Mittelspitze – Südspitze)',
    sport: 'mountaineering',
    region: 'Berchtesgadener Alpen',
    distanceKm: 22.4,
    elevationGainM: 2390,
    elevationLossM: 2390,
    maxAltitudeM: 2713,
    minAltitudeM: 630,
    estimatedHours: 11.5,
    technicalDifficulty: 'T5',
    terrain: ['Ausgesetzter Felsgrat', 'Drahtseile I-II', 'Brüchiges Gestein', 'Steiler Abstieg Wimbachgries'],
    description: 'Eine der spektakulärsten Gratüberschreitungen der Ostalpen. Extrem ausgesetzt, konditionell sehr fordernd. Steinschlaghelm und Trittsicherheit Pflicht!',
    profilePoints: [
      { distKm: 0, altitudeM: 630 },
      { distKm: 4.0, altitudeM: 1390 },
      { distKm: 7.0, altitudeM: 1930 },
      { distKm: 9.5, altitudeM: 2651 }, // Hocheck
      { distKm: 11.0, altitudeM: 2713 }, // Mittelspitze
      { distKm: 12.8, altitudeM: 2712 }, // Südspitze
      { distKm: 16.5, altitudeM: 1320 }, // Wimbachgries
      { distKm: 22.4, altitudeM: 630 }
    ]
  },
  {
    id: 'tour-3',
    name: 'Silvretta Skitour Piz Buin (3.312m)',
    sport: 'skitour',
    region: 'Silvretta / Vorarlberg-Graubünden',
    isFavorite: true,
    distanceKm: 17.2,
    elevationGainM: 1340,
    elevationLossM: 1340,
    maxAltitudeM: 3312,
    minAltitudeM: 2037,
    estimatedHours: 6.5,
    technicalDifficulty: 'T4',
    terrain: ['Gletscher (Ochsentaler)', 'Spaltenzonen', 'Steile Gipfelflanke 38°', 'Kombiniertes Gelände'],
    description: 'Traumhafte Hochgebirgs-Skitour auf das Wahrzeichen der Silvretta. Pflicht: Komplette LVS-Ausrüstung, Harscheisen, Steigeisen & Pickel für die Gipfelscharte.',
    profilePoints: [
      { distKm: 0, altitudeM: 2037 },
      { distKm: 3.5, altitudeM: 2440 },
      { distKm: 7.2, altitudeM: 2850 },
      { distKm: 9.0, altitudeM: 3054 }, // Buinlücke
      { distKm: 10.2, altitudeM: 3312 }, // Gipfel
      { distKm: 12.0, altitudeM: 2850 },
      { distKm: 17.2, altitudeM: 2037 }
    ]
  },
  {
    id: 'tour-4',
    name: 'Fellhorn Winter-Grat-Schneeschuhtour',
    sport: 'snowshoe',
    region: 'Allgäuer Alpen / Oberstdorf',
    distanceKm: 11.5,
    elevationGainM: 890,
    elevationLossM: 890,
    maxAltitudeM: 2038,
    minAltitudeM: 1180,
    estimatedHours: 4.5,
    technicalDifficulty: 'T3',
    terrain: ['Tiefschnee', 'Verwehte Grate', 'Mäßig steile Nordwesthänge'],
    description: 'Wunderschöne Schneeschuhtour mit Weitblick in die schneebedeckten Allgäuer Hochalpen. Lawinenlagebericht zwingend beachten!',
    profilePoints: [
      { distKm: 0, altitudeM: 1180 },
      { distKm: 2.8, altitudeM: 1450 },
      { distKm: 5.5, altitudeM: 1780 },
      { distKm: 7.2, altitudeM: 2038 }, // Gipfel
      { distKm: 9.0, altitudeM: 1650 },
      { distKm: 11.5, altitudeM: 1180 }
    ]
  },
  {
    id: 'tour-5',
    name: 'Karwendel Alpine Trailrun: Scharnitz nach Halleranger',
    sport: 'trailrunning',
    region: 'Karwendel Gebirge',
    distanceKm: 19.1,
    elevationGainM: 1150,
    elevationLossM: 410,
    maxAltitudeM: 1768,
    minAltitudeM: 964,
    estimatedHours: 3.2,
    technicalDifficulty: 'T2',
    terrain: ['Forstwege', 'Schotter-Singletrails', 'Stufen & Wurzelpassagen'],
    description: 'Flotter Trailrun durch das wildromantische Hinterautal bis zum Fuß des Lafatscher Jochs. Leichtes Gepäck & Windweste empfohlen.',
    profilePoints: [
      { distKm: 0, altitudeM: 964 },
      { distKm: 6.0, altitudeM: 1120 },
      { distKm: 11.0, altitudeM: 1280 },
      { distKm: 15.5, altitudeM: 1520 },
      { distKm: 19.1, altitudeM: 1768 }
    ]
  }
];

export const INITIAL_USER_PROFILES: UserProfile[] = [
  {
    id: 'user-1',
    name: 'Christian (Ich)',
    coldSensitivity: 'frierend', // Kälteempfindlich -> System schlägt wärmeren Midlayer vor
    safetyPriority: 'sicherheit_zuerst',
    experienceLevel: 'Fortgeschritten',
    feedbackHistory: [
      {
        id: 'fb-1',
        tourId: 'tour-1',
        tourName: 'Zugspitz-Gatterl',
        date: '2026-09-14',
        tempFeeling: 'zu_kalt',
        weightRating: 'optimal',
        gearMissed: ['Winddichte Handschuhe', 'Schlauchtuch'],
        gearUnused: ['Kurze Hose'],
        notes: 'Am Gatterl pfiff ein eisiger Nordwind bei 4°C. Hände waren ohne Handschuhe schnell klamm.'
      }
    ]
  },
  {
    id: 'user-2',
    name: 'Tourenpartner (Schnell schwitzend)',
    coldSensitivity: 'schwitzend',
    safetyPriority: 'ausgewogen',
    experienceLevel: 'Alpinist',
    feedbackHistory: []
  },
  {
    id: 'user-3',
    name: 'Gast / Neuer Account',
    coldSensitivity: 'normal',
    safetyPriority: 'ausgewogen',
    experienceLevel: 'Einsteiger',
    feedbackHistory: []
  }
];
