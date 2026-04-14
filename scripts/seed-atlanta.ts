/**
 * seed-atlanta.ts — Seed Atlanta 2026 event data
 *
 * Usage: pnpm --filter @wilkins/api db:seed
 * Or:    npx ts-node scripts/seed-atlanta.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Atlanta 2026 event data...');

  // ─── Organization ───────────────────────────────────────────────────────
  const org = await prisma.organization.upsert({
    where: { slug: 'wilkins-media' },
    update: {},
    create: {
      name: 'Wilkins Media Group',
      slug: 'wilkins-media',
      website: 'https://wilkinsmedia.com',
      isActive: true,
    },
  });

  // ─── Event ──────────────────────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { slug: 'atlanta-2026' },
    update: {},
    create: {
      organizationId: org.id,
      name: 'Atlanta 2026 — FIFA World Cup',
      slug: 'atlanta-2026',
      description: 'FIFA World Cup 2026 — Atlanta Host City Experience',
      status: 'PUBLISHED',
      primaryLanguage: 'en',
      supportedLanguages: ['en', 'es', 'fr', 'pt', 'ar', 'ja', 'ko', 'zh-CN', 'de', 'it'],
      timezone: 'America/New_York',
      startsAt: new Date('2026-06-11T00:00:00Z'),
      endsAt: new Date('2026-07-19T23:59:59Z'),
    },
  });

  // ─── Venue ──────────────────────────────────────────────────────────────
  const venue = await prisma.venue.upsert({
    where: { id: 'mercedes-benz-stadium' },
    update: {},
    create: {
      id: 'mercedes-benz-stadium',
      eventId: event.id,
      name: 'Mercedes-Benz Stadium',
      description: 'Home of Atlanta United FC and the Atlanta Falcons',
      address: '1 AMB Drive NW',
      city: 'Atlanta',
      country: 'US',
      latitude: 33.7553,
      longitude: -84.4006,
      isActive: true,
    },
  });

  // ─── Venue POIs ─────────────────────────────────────────────────────────
  const pois = [
    { name: 'Gate 1 — Main Entrance', nameI18n: { es: 'Puerta 1 — Entrada Principal', fr: 'Porte 1 — Entrée Principale', ar: 'البوابة 1 — المدخل الرئيسي', pt: 'Portão 1 — Entrada Principal' }, category: 'GATE' as const, latitude: 33.7560, longitude: -84.4010, floor: 'Ground' },
    { name: 'Gate 2 — South Entrance', nameI18n: { es: 'Puerta 2 — Entrada Sur', fr: 'Porte 2 — Entrée Sud', ar: 'البوابة 2 — المدخل الجنوبي', pt: 'Portão 2 — Entrada Sul' }, category: 'GATE' as const, latitude: 33.7545, longitude: -84.4003, floor: 'Ground' },
    { name: 'Restroom A — Section 100', nameI18n: { es: 'Baño A — Sección 100', fr: 'Toilettes A — Section 100', ar: 'دورة مياه أ — القسم 100', pt: 'Banheiro A — Seção 100' }, category: 'RESTROOM' as const, latitude: 33.7555, longitude: -84.4008, floor: '100 Level' },
    { name: 'Restroom B — Section 200', nameI18n: { es: 'Baño B — Sección 200', fr: 'Toilettes B — Section 200', ar: 'دورة مياه ب — القسم 200', pt: 'Banheiro B — Seção 200' }, category: 'RESTROOM' as const, latitude: 33.7552, longitude: -84.4002, floor: '200 Level' },
    { name: 'First Aid Station', nameI18n: { es: 'Estación de Primeros Auxilios', fr: 'Poste de Secours', ar: 'محطة الإسعافات الأولية', pt: 'Posto de Primeiros Socorros' }, category: 'FIRST_AID' as const, latitude: 33.7556, longitude: -84.4005, floor: 'Ground' },
    { name: 'Molly B\'s — Southern BBQ', nameI18n: { es: 'Molly B\'s — BBQ Sureño', fr: 'Molly B\'s — BBQ du Sud', pt: 'Molly B\'s — Churrasco Sulista' }, category: 'CONCESSION' as const, latitude: 33.7557, longitude: -84.4009, floor: '100 Level' },
    { name: 'Draftroom Bar', category: 'CONCESSION' as const, latitude: 33.7554, longitude: -84.4007, floor: '200 Level' },
    { name: 'Team Store', nameI18n: { es: 'Tienda del Equipo', fr: 'Boutique Officielle', ar: 'متجر الفريق', pt: 'Loja do Time' }, category: 'MERCHANDISE' as const, latitude: 33.7558, longitude: -84.4004, floor: 'Ground' },
    { name: 'Fan Information Center', nameI18n: { es: 'Centro de Información', fr: 'Centre d\'Information', ar: 'مركز المعلومات', pt: 'Central de Informações' }, category: 'INFORMATION' as const, latitude: 33.7553, longitude: -84.4006, floor: 'Ground' },
    { name: 'MARTA Station Shuttle', nameI18n: { es: 'Servicio de Transporte MARTA', fr: 'Navette Station MARTA', ar: 'خدمة نقل محطة مارتا', pt: 'Shuttle Estação MARTA' }, category: 'TRANSPORT' as const, latitude: 33.7565, longitude: -84.3990, floor: 'Ground' },
    { name: 'Parking Lot A', nameI18n: { es: 'Estacionamiento A', fr: 'Parking A', ar: 'موقف السيارات أ', pt: 'Estacionamento A' }, category: 'PARKING' as const, latitude: 33.7570, longitude: -84.4015, floor: 'Ground' },
    { name: 'Coca-Cola Fan Zone', nameI18n: { es: 'Zona de Fans Coca-Cola', fr: 'Zone Fan Coca-Cola', ar: 'منطقة مشجعي كوكا كولا', pt: 'Fan Zone Coca-Cola' }, category: 'SPONSOR_ZONE' as const, latitude: 33.7548, longitude: -84.4012, floor: 'Ground' },
    { name: 'Prayer & Meditation Room', nameI18n: { es: 'Sala de Oración', fr: 'Salle de Prière', ar: 'غرفة الصلاة', pt: 'Sala de Oração', ja: '祈祷室', ko: '기도실' }, category: 'PRAYER_ROOM' as const, latitude: 33.7559, longitude: -84.4011, floor: '100 Level' },
    { name: 'Family Zone — Kids Play Area', nameI18n: { es: 'Zona Familiar', fr: 'Zone Famille', ar: 'المنطقة العائلية', pt: 'Zona Familiar' }, category: 'FAMILY_ZONE' as const, latitude: 33.7551, longitude: -84.4001, floor: 'Ground' },
    { name: 'Accessible Seating Services', nameI18n: { es: 'Asientos Accesibles', fr: 'Places Accessibles', ar: 'مقاعد ذوي الاحتياجات الخاصة', pt: 'Assentos Acessíveis' }, category: 'ACCESSIBILITY' as const, latitude: 33.7554, longitude: -84.4003, floor: 'Ground' },
    { name: 'Mobile Charging Station', nameI18n: { es: 'Estación de Carga', fr: 'Station de Recharge', ar: 'محطة شحن الهاتف', pt: 'Estação de Carregamento' }, category: 'UTILITIES' as const, latitude: 33.7556, longitude: -84.4008, floor: '100 Level' },
    { name: 'Nursing & Lactation Room', nameI18n: { es: 'Sala de Lactancia', fr: 'Salle d\'Allaitement', ar: 'غرفة الرضاعة', pt: 'Sala de Amamentação' }, category: 'FAMILY_ZONE' as const, latitude: 33.7558, longitude: -84.4006, floor: '100 Level' },
    { name: 'Gate 3 — East Pedestrian Bridge', nameI18n: { es: 'Puerta 3 — Puente Peatonal Este', fr: 'Porte 3 — Passerelle Est', ar: 'البوابة 3 — جسر المشاة الشرقي', pt: 'Portão 3 — Ponte Pedestre Leste' }, category: 'GATE' as const, latitude: 33.7553, longitude: -84.3998, floor: 'Ground' },
    { name: 'Concession C — International Flavors', nameI18n: { es: 'Concesión C — Sabores Internacionales', fr: 'Stand C — Saveurs du Monde', ar: 'المطعم ج — نكهات عالمية', pt: 'Lanchonete C — Sabores Internacionais' }, category: 'CONCESSION' as const, latitude: 33.7550, longitude: -84.4005, floor: '200 Level' },
    { name: 'Lost & Found', nameI18n: { es: 'Objetos Perdidos', fr: 'Objets Trouvés', ar: 'المفقودات والموجودات', pt: 'Achados e Perdidos' }, category: 'INFORMATION' as const, latitude: 33.7557, longitude: -84.4002, floor: 'Ground' },
  ];

  for (const poi of pois) {
    await prisma.venuePOI.create({
      data: { venueId: venue.id, ...poi },
    });
  }

  // ─── Emergency Phrases ──────────────────────────────────────────────────
  const emergencyPhrases = [
    {
      phraseKey: 'need_hospital',
      urgency: 'critical',
      icon: '🏥',
      translations: { en: 'I need a hospital', es: 'Necesito un hospital', fr: 'J\'ai besoin d\'un hôpital', ar: 'أحتاج إلى مستشفى', pt: 'Preciso de um hospital' },
      sortOrder: 1,
    },
    {
      phraseKey: 'need_police',
      urgency: 'critical',
      icon: '🚔',
      translations: { en: 'I need police', es: 'Necesito policía', fr: 'J\'ai besoin de la police', ar: 'أحتاج الشرطة', pt: 'Preciso de polícia' },
      sortOrder: 2,
    },
    {
      phraseKey: 'i_am_lost',
      urgency: 'medium',
      icon: '📍',
      translations: { en: 'I am lost', es: 'Estoy perdido/a', fr: 'Je suis perdu(e)', ar: 'أنا تائه', pt: 'Estou perdido/a' },
      sortOrder: 3,
    },
    {
      phraseKey: 'lost_child',
      urgency: 'critical',
      icon: '👶',
      translations: { en: 'I lost my child', es: 'Perdí a mi hijo/a', fr: 'J\'ai perdu mon enfant', ar: 'فقدت طفلي', pt: 'Perdi meu filho/a' },
      sortOrder: 4,
    },
    {
      phraseKey: 'need_translator',
      urgency: 'medium',
      icon: '🗣️',
      translations: { en: 'I need a translator', es: 'Necesito un traductor', fr: 'J\'ai besoin d\'un traducteur', ar: 'أحتاج مترجم', pt: 'Preciso de um tradutor' },
      sortOrder: 5,
    },
    {
      phraseKey: 'need_transportation',
      urgency: 'low',
      icon: '🚗',
      translations: { en: 'I need transportation', es: 'Necesito transporte', fr: 'J\'ai besoin de transport', ar: 'أحتاج وسيلة نقل', pt: 'Preciso de transporte' },
      sortOrder: 6,
    },
    {
      phraseKey: 'lost_passport',
      urgency: 'high',
      icon: '🛂',
      translations: { en: 'I lost my passport', es: 'Perdí mi pasaporte', fr: 'J\'ai perdu mon passeport', ar: 'فقدت جواز سفري', pt: 'Perdi meu passaporte' },
      sortOrder: 7,
    },
    {
      phraseKey: 'need_medical_assistance',
      urgency: 'critical',
      icon: '🚑',
      translations: { en: 'I need medical assistance', es: 'Necesito asistencia médica', fr: 'J\'ai besoin d\'assistance médicale', ar: 'أحتاج مساعدة طبية', pt: 'Preciso de assistência médica' },
      sortOrder: 8,
    },
  ];

  for (const phrase of emergencyPhrases) {
    await prisma.emergencyPhrase.upsert({
      where: { phraseKey: phrase.phraseKey },
      update: {},
      create: { ...phrase, isActive: true },
    });
  }

  // ─── Approved Phrases ───────────────────────────────────────────────────
  const approvedPhrases = [
    {
      category: 'wayfinding',
      phraseKey: 'where_is_restroom',
      translations: { en: 'Where is the restroom?', es: '¿Dónde está el baño?', fr: 'Où sont les toilettes ?', ar: 'أين دورة المياه؟', pt: 'Onde fica o banheiro?' },
      icon: '🚻',
    },
    {
      category: 'wayfinding',
      phraseKey: 'where_is_exit',
      translations: { en: 'Where is the exit?', es: '¿Dónde está la salida?', fr: 'Où est la sortie ?', ar: 'أين المخرج؟', pt: 'Onde fica a saída?' },
      icon: '🚪',
    },
    {
      category: 'hospitality',
      phraseKey: 'where_can_i_eat',
      translations: { en: 'Where can I eat?', es: '¿Dónde puedo comer?', fr: 'Où puis-je manger ?', ar: 'أين يمكنني الأكل؟', pt: 'Onde posso comer?' },
      icon: '🍽️',
    },
    {
      category: 'transport',
      phraseKey: 'how_to_get_to_stadium',
      translations: { en: 'How do I get to the stadium?', es: '¿Cómo llego al estadio?', fr: 'Comment aller au stade ?', ar: 'كيف أصل إلى الملعب؟', pt: 'Como chego ao estádio?' },
      icon: '🏟️',
    },
  ];

  for (const phrase of approvedPhrases) {
    await prisma.approvedPhrase.upsert({
      where: { phraseKey: phrase.phraseKey },
      update: {},
      create: { ...phrase, isActive: true, sortOrder: 0 },
    });
  }

  // ─── City Services ─────────────────────────────────────────────────────
  const cityServices = [
    { name: 'Grady Memorial Hospital', category: 'hospital', address: '80 Jesse Hill Jr Dr SE', city: 'Atlanta', latitude: 33.7527, longitude: -84.3846, phone: '(404) 616-4307', distanceM: 1800 },
    { name: 'Emory University Hospital Midtown', category: 'hospital', address: '550 Peachtree St NE', city: 'Atlanta', latitude: 33.7714, longitude: -84.3830, phone: '(404) 686-4411', distanceM: 2400 },
    { name: 'CVS Pharmacy — Centennial Park', category: 'pharmacy', address: '225 Baker St NW', city: 'Atlanta', latitude: 33.7636, longitude: -84.3953, phone: '(404) 525-2511', distanceM: 1200 },
    { name: 'Omni Atlanta Hotel at CNN Center', category: 'hotel', address: '100 CNN Center NW', city: 'Atlanta', latitude: 33.7590, longitude: -84.3943, phone: '(404) 659-0000', distanceM: 900, rating: 4.2 },
    { name: 'Atlanta Marriott Marquis', category: 'hotel', address: '265 Peachtree Center Ave', city: 'Atlanta', latitude: 33.7606, longitude: -84.3873, phone: '(404) 521-0000', distanceM: 2000, rating: 4.4 },
    { name: 'MARTA — Vine City Station', category: 'transit', address: '502 Rhodes St NW', city: 'Atlanta', latitude: 33.7565, longitude: -84.4048, distanceM: 600 },
    { name: 'MARTA — Dome/GWCC Station', category: 'transit', address: '74 Mangum St NW', city: 'Atlanta', latitude: 33.7582, longitude: -84.3970, distanceM: 500 },
    { name: 'Publix — Downtown Atlanta', category: 'grocery', address: '17 Andrew Young International Blvd', city: 'Atlanta', latitude: 33.7578, longitude: -84.3888, distanceM: 1600 },
  ];

  for (const svc of cityServices) {
    await prisma.cityService.create({
      data: { eventId: event.id, ...svc, isActive: true },
    });
  }

  // ─── Restaurants ────────────────────────────────────────────────────────
  const restaurants = [
    { name: 'Alma Cocina', cuisineType: 'mexican', cuisineTags: ['latin', 'mexican'], dietaryOptions: ['vegetarian'], address: '178 Centennial Olympic Park Dr NW', city: 'Atlanta', latitude: 33.7612, longitude: -84.3935, priceRange: '$$', rating: 4.3, distanceM: 800 },
    { name: 'Bab\'s Halal Kitchen', cuisineType: 'halal', cuisineTags: ['middle_eastern', 'halal'], dietaryOptions: ['halal'], address: '204 Mitchell St SW', city: 'Atlanta', latitude: 33.7520, longitude: -84.3925, priceRange: '$$', rating: 4.5, distanceM: 1100 },
    { name: 'Kura Revolving Sushi Bar', cuisineType: 'japanese', cuisineTags: ['japanese', 'sushi'], dietaryOptions: ['gluten-free'], address: '675 Ponce de Leon Ave NE', city: 'Atlanta', latitude: 33.7722, longitude: -84.3637, priceRange: '$$', rating: 4.4, distanceM: 4200 },
    { name: 'Seoul Garden', cuisineType: 'korean', cuisineTags: ['korean', 'bbq'], dietaryOptions: ['gluten-free'], address: '5938 Buford Hwy NE', city: 'Atlanta', latitude: 33.8600, longitude: -84.2980, priceRange: '$$', rating: 4.2, distanceM: 15000 },
    { name: 'Fox Bros Bar-B-Q', cuisineType: 'american', cuisineTags: ['american', 'bbq', 'southern'], dietaryOptions: [], address: '1238 DeKalb Ave NE', city: 'Atlanta', latitude: 33.7557, longitude: -84.3453, priceRange: '$$', rating: 4.6, distanceM: 5500 },
    { name: 'Fogo de Chão', cuisineType: 'brazilian', cuisineTags: ['brazilian', 'steakhouse', 'south_american'], dietaryOptions: ['gluten-free'], address: '3101 Cobb Pkwy SE', city: 'Atlanta', latitude: 33.8709, longitude: -84.4667, priceRange: '$$$', rating: 4.5, distanceM: 18000 },
    { name: 'El Super Pan', cuisineType: 'cuban', cuisineTags: ['cuban', 'latin', 'sandwiches'], dietaryOptions: [], address: '675 Ponce de Leon Ave NE', city: 'Atlanta', latitude: 33.7720, longitude: -84.3640, priceRange: '$', rating: 4.3, distanceM: 4000 },
  ];

  for (const r of restaurants) {
    await prisma.restaurant.create({
      data: { eventId: event.id, country: 'US', ...r, isActive: true },
    });
  }

  // ─── Additional Restaurants (cultural diversity) ─────────────────────
  const additionalRestaurants = [
    { name: 'Desta Ethiopian Kitchen', cuisineType: 'ethiopian', cuisineTags: ['ethiopian', 'african', 'vegan_friendly'], dietaryOptions: ['vegan', 'vegetarian', 'gluten-free'], address: '3086 Briarcliff Rd NE', city: 'Atlanta', latitude: 33.8171, longitude: -84.3266, priceRange: '$$', rating: 4.6, distanceM: 8000 },
    { name: 'Chai Pani', cuisineType: 'indian', cuisineTags: ['indian', 'street_food', 'vegetarian_friendly'], dietaryOptions: ['vegetarian', 'vegan'], address: '406 W Ponce de Leon Ave', city: 'Atlanta', latitude: 33.7748, longitude: -84.2964, priceRange: '$$', rating: 4.5, distanceM: 9500 },
    { name: 'Nan Thai Fine Dining', cuisineType: 'thai', cuisineTags: ['thai', 'southeast_asian'], dietaryOptions: ['gluten-free'], address: '1350 Spring St NW', city: 'Atlanta', latitude: 33.7903, longitude: -84.3890, priceRange: '$$$', rating: 4.7, distanceM: 4500 },
    { name: 'Pho Dai Loi 2', cuisineType: 'vietnamese', cuisineTags: ['vietnamese', 'southeast_asian', 'noodles'], dietaryOptions: ['gluten-free'], address: '4186 Buford Hwy NE', city: 'Atlanta', latitude: 33.8464, longitude: -84.3110, priceRange: '$', rating: 4.4, distanceM: 12000 },
    { name: 'Ali Baba Mediterranean Grill', cuisineType: 'mediterranean', cuisineTags: ['middle_eastern', 'halal', 'mediterranean'], dietaryOptions: ['halal', 'vegetarian'], address: '1521 Piedmont Ave NE', city: 'Atlanta', latitude: 33.7895, longitude: -84.3675, priceRange: '$$', rating: 4.3, distanceM: 5200 },
    { name: 'Little Alley Steakhouse', cuisineType: 'steakhouse', cuisineTags: ['american', 'steakhouse', 'fine_dining'], dietaryOptions: ['gluten-free'], address: '3450 Peachtree Rd NE', city: 'Atlanta', latitude: 33.8487, longitude: -84.3622, priceRange: '$$$$', rating: 4.6, distanceM: 11000, isSponsored: true, sponsorPriority: 3 },
    { name: 'Cafe Agora', cuisineType: 'turkish', cuisineTags: ['turkish', 'middle_eastern', 'mediterranean'], dietaryOptions: ['halal', 'vegetarian'], address: '2565 Peachtree Rd', city: 'Atlanta', latitude: 33.8186, longitude: -84.3612, priceRange: '$$', rating: 4.4, distanceM: 7800 },
  ];

  for (const r of additionalRestaurants) {
    await prisma.restaurant.create({
      data: { eventId: event.id, country: 'US', ...r, isActive: true },
    });
  }

  // ─── Sponsor Campaigns (12 total — covering all 3 tiers) ──────────────
  const sponsorCampaigns = [
    // --- Smart Placement Tier ---
    {
      name: 'Coca-Cola Fan Zone Promotion',
      sponsorName: 'Coca-Cola',
      ctaText: 'Visit the Coca-Cola Fan Zone for free samples!',
      ctaUrl: 'https://coca-cola.com/fanzone',
      placement: 'concierge_card',
      targetLanguages: ['en', 'es', 'pt', 'fr'],
      impressions: 14832, clicks: 1247,
    },
    {
      name: 'MARTA Transit Pass',
      sponsorName: 'MARTA',
      ctaText: 'Get unlimited MARTA rides with the FIFA Event Pass',
      ctaUrl: 'https://itsmarta.com/fifa',
      placement: 'map_overlay',
      targetLanguages: [],
      impressions: 11205, clicks: 891,
    },
    {
      name: 'CVS Pharmacy — Stadium Essentials',
      sponsorName: 'CVS',
      ctaText: 'Sunscreen, chargers & first aid — 5 min walk from the stadium',
      ctaUrl: 'https://cvs.com/store-locator',
      placement: 'search_result',
      targetLanguages: [],
      impressions: 4210, clicks: 387,
    },
    {
      name: 'Verizon Fan Connectivity',
      sponsorName: 'Verizon',
      ctaText: 'Free WiFi at the Verizon Fan Hub — no plan needed',
      ctaUrl: 'https://verizon.com/fanhub',
      placement: 'home_banner',
      targetLanguages: ['en'],
      impressions: 18900, clicks: 1523,
    },
    // --- Cultural Concierge Tier ---
    {
      name: 'Chick-fil-A Halal Menu Launch',
      sponsorName: 'Chick-fil-A',
      ctaText: 'Try our new halal-certified chicken — available during FIFA week',
      ctaUrl: 'https://chick-fil-a.com/halal',
      placement: 'concierge_card',
      targetLanguages: ['ar', 'fr'],
      impressions: 6314, clicks: 892,
    },
    {
      name: 'Delta Sky Lounge — Premium Transit',
      sponsorName: 'Delta Air Lines',
      ctaText: 'Fly home with Delta — exclusive post-match lounge access',
      ctaUrl: 'https://delta.com/skylounge',
      placement: 'concierge_card',
      targetLanguages: ['en', 'ja', 'ko', 'de'],
      impressions: 9621, clicks: 743,
    },
    {
      name: 'Uber — Post-Match Priority Pickup',
      sponsorName: 'Uber',
      ctaText: 'Skip the line — priority Uber pickup after the match',
      ctaUrl: 'https://uber.com/fifa-atl',
      placement: 'map_overlay',
      targetLanguages: [],
      impressions: 22100, clicks: 3891,
    },
    {
      name: 'Hyatt Regency — Guest Welcome Package',
      sponsorName: 'Hyatt',
      ctaText: 'Welcome package for international guests — 15% off & late checkout',
      ctaUrl: 'https://hyatt.com/fifa-atlanta',
      placement: 'language_select',
      targetLanguages: ['ar', 'es', 'pt', 'fr', 'ja', 'ko', 'zh-CN', 'de'],
      impressions: 8740, clicks: 612,
    },
    // --- Reward Engine Tier ---
    {
      name: 'Adidas — FIFA Kit Scavenger Hunt',
      sponsorName: 'Adidas',
      ctaText: 'Find 5 Adidas checkpoints to unlock an exclusive match-day jersey',
      ctaUrl: 'https://adidas.com/fifa-hunt',
      placement: 'concierge_card',
      targetLanguages: [],
      impressions: 7850, clicks: 1045,
    },
    {
      name: 'World of Coca-Cola — Cultural Passport',
      sponsorName: 'Coca-Cola',
      ctaText: 'Earn stamps visiting cultural food spots — win a VIP tour',
      ctaUrl: 'https://worldofcoca-cola.com/passport',
      placement: 'concierge_card',
      targetLanguages: ['en', 'es', 'pt', 'ar', 'fr'],
      impressions: 5410, clicks: 934,
    },
    {
      name: 'Atlanta Convention Bureau — City Explorer Badge',
      sponsorName: 'Discover Atlanta',
      ctaText: 'Explore 3 Atlanta neighborhoods to earn the City Explorer badge',
      ctaUrl: 'https://discoveratlanta.com/explorer',
      placement: 'home_banner',
      targetLanguages: [],
      impressions: 4320, clicks: 578,
    },
    {
      name: 'Mercedes-Benz — Stadium VIP Upgrade',
      sponsorName: 'Mercedes-Benz',
      ctaText: 'Complete the fan quiz for a chance to upgrade to the AMG Suite',
      ctaUrl: 'https://mercedes-benz.com/fanquiz',
      placement: 'poi_detail',
      targetLanguages: ['en', 'de'],
      impressions: 3180, clicks: 412,
    },
  ];

  for (const campaign of sponsorCampaigns) {
    await prisma.sponsorCampaign.create({
      data: {
        organizationId: org.id,
        eventId: event.id,
        name: campaign.name,
        sponsorName: campaign.sponsorName,
        ctaText: campaign.ctaText,
        ctaUrl: campaign.ctaUrl,
        placement: campaign.placement,
        targetLanguages: campaign.targetLanguages,
        impressions: campaign.impressions,
        clicks: campaign.clicks,
        status: 'ACTIVE',
        startsAt: new Date('2026-06-11T00:00:00Z'),
        endsAt: new Date('2026-07-19T23:59:59Z'),
      },
    });
  }

  // ─── Reward Badges ──────────────────────────────────────────────────────
  const badges = [
    { slug: 'welcome-explorer', name: 'Welcome Explorer', description: 'Begin your Atlanta journey', icon: '🌍', tier: 'BRONZE' as const, pointsValue: 10, requirement: 'Complete your first concierge search' },
    { slug: 'foodie-passport', name: 'Foodie Passport', description: 'Discover culturally relevant dining', icon: '🍽️', tier: 'SILVER' as const, pointsValue: 50, requirement: 'Visit 3 culturally-matched restaurants' },
    { slug: 'cultural-ambassador', name: 'Cultural Ambassador', description: 'Bridge cultures through language', icon: '🤝', tier: 'GOLD' as const, pointsValue: 100, requirement: 'Use translation bridge 5 times to help other guests' },
    { slug: 'stadium-navigator', name: 'Stadium Navigator', description: 'Master the venue layout', icon: '🏟️', tier: 'BRONZE' as const, pointsValue: 25, requirement: 'Find 5 different venue POIs using the concierge' },
    { slug: 'emergency-hero', name: 'Emergency Hero', description: 'Helped someone in need', icon: '🦸', tier: 'GOLD' as const, pointsValue: 75, requirement: 'Assist in an emergency by providing translation or directions' },
    { slug: 'transit-pro', name: 'Transit Pro', description: 'Navigate Atlanta like a local', icon: '🚇', tier: 'SILVER' as const, pointsValue: 30, requirement: 'Use MARTA directions 3 times' },
    { slug: 'coca-cola-superfan', name: 'Coca-Cola Superfan', description: 'Complete the Coca-Cola Fan Zone experience', icon: '🥤', tier: 'SILVER' as const, pointsValue: 40, requirement: 'Visit the Fan Zone and scan the QR code' },
    { slug: 'adidas-quest-champion', name: 'Adidas Quest Champion', description: 'Complete the Adidas scavenger hunt', icon: '👟', tier: 'PLATINUM' as const, pointsValue: 200, maxClaims: 500, requirement: 'Find all 5 Adidas checkpoints around the stadium district' },
    { slug: 'city-explorer', name: 'City Explorer', description: 'Explore Atlanta beyond the stadium', icon: '🗺️', tier: 'GOLD' as const, pointsValue: 100, requirement: 'Visit 3 different Atlanta neighborhoods via concierge' },
    { slug: 'halftime-hustler', name: 'Halftime Hustler', description: 'Made the most of halftime', icon: '⚡', tier: 'BRONZE' as const, pointsValue: 15, requirement: 'Search for food, restroom, and merch during a single halftime window' },
  ];

  for (const badge of badges) {
    await prisma.rewardBadge.create({
      data: { eventId: event.id, ...badge },
    });
  }

  // ─── Sponsor Challenges ─────────────────────────────────────────────────
  const challenges = [
    {
      name: 'Coca-Cola Cultural Passport',
      description: 'Visit 3 culturally-matched food spots to earn stamps toward a VIP tour',
      type: 'multi_step',
      requirements: { steps: 3, action: 'visit_restaurant', filter: 'culturally_matched', timeLimit: '48h' },
      rewardPoints: 100,
      couponCode: 'COCACULTURE26',
      couponValue: 'Free World of Coca-Cola admission',
    },
    {
      name: 'Adidas Stadium Scavenger Hunt',
      description: 'Find 5 Adidas checkpoint QR codes around the stadium district',
      type: 'scavenger_hunt',
      requirements: { checkpoints: 5, method: 'scan_qr', locations: ['Gate 1', 'Fan Zone', 'Team Store', 'Section 200', 'Parking A'] },
      rewardPoints: 200,
      couponCode: 'ADIDAS26',
      couponValue: 'Exclusive match-day jersey (limited edition)',
    },
    {
      name: 'MARTA Explorer',
      description: 'Use MARTA directions 3 times to unlock transit rewards',
      type: 'visit',
      requirements: { visits: 3, target: 'marta_directions' },
      rewardPoints: 30,
      couponCode: 'MARTAFAN',
      couponValue: 'Free day pass',
    },
    {
      name: 'Translation Bridge Challenge',
      description: 'Help 5 fellow guests by using the translation bridge',
      type: 'checkin',
      requirements: { uses: 5, target: 'translation_bridge' },
      rewardPoints: 75,
    },
    {
      name: 'Halftime Speed Run',
      description: 'Find food, restroom, and merch during a single halftime — all via concierge',
      type: 'multi_step',
      requirements: { steps: 3, actions: ['find_food', 'find_restroom', 'find_merchandise'], timeWindow: '20min' },
      rewardPoints: 15,
    },
    {
      name: 'Mercedes-Benz Fan Quiz',
      description: 'Answer 5 trivia questions about the stadium for a VIP upgrade chance',
      type: 'survey',
      requirements: { questions: 5, minCorrect: 4, topic: 'stadium_trivia' },
      rewardPoints: 50,
      couponCode: 'MBFANQUIZ',
      couponValue: 'Chance to upgrade to AMG Suite',
    },
  ];

  for (const challenge of challenges) {
    await prisma.sponsorChallenge.create({
      data: {
        eventId: event.id,
        name: challenge.name,
        description: challenge.description,
        type: challenge.type,
        requirements: challenge.requirements,
        rewardPoints: challenge.rewardPoints,
        couponCode: challenge.couponCode,
        couponValue: challenge.couponValue,
        status: 'ACTIVE',
      },
    });
  }

  // ─── Geo-Fences ─────────────────────────────────────────────────────────
  const geoFences = [
    {
      name: 'Stadium District Entry',
      latitude: 33.7553,
      longitude: -84.4006,
      radiusM: 500,
      triggerType: 'enter',
      alertMessage: 'Welcome to the Stadium District! Open Wilkins for directions, food, and exclusive offers.',
      alertMessageI18n: { es: '¡Bienvenido al Distrito del Estadio! Abre Wilkins para direcciones, comida y ofertas exclusivas.', ar: 'مرحباً بكم في حي الملعب! افتح ويلكنز للحصول على الاتجاهات والطعام والعروض الحصرية.' },
    },
    {
      name: 'Coca-Cola Fan Zone Radius',
      latitude: 33.7548,
      longitude: -84.4012,
      radiusM: 100,
      triggerType: 'enter',
      alertMessage: 'You\'re near the Coca-Cola Fan Zone! Scan the QR code inside for free samples.',
    },
    {
      name: 'Post-Match Exit Zone',
      latitude: 33.7565,
      longitude: -84.3990,
      radiusM: 300,
      triggerType: 'exit',
      alertMessage: 'Leaving the stadium? Uber priority pickup available. MARTA Vine City Station is 2 min walk.',
      alertMessageI18n: { es: '¿Saliendo del estadio? Recogida prioritaria de Uber disponible. Estación MARTA Vine City a 2 min.', pt: 'Saindo do estádio? Uber prioritário disponível. Estação MARTA Vine City a 2 min.' },
    },
    {
      name: 'MARTA Vine City Dwell',
      latitude: 33.7565,
      longitude: -84.4048,
      radiusM: 80,
      triggerType: 'dwell',
      alertMessage: 'Waiting for MARTA? The next train arrives in ~8 minutes. Need a ride share instead?',
    },
  ];

  for (const fence of geoFences) {
    await prisma.geoFence.create({
      data: { eventId: event.id, ...fence, isActive: true },
    });
  }

  // ─── Event Days ──────────────────────────────────────────────────────────
  const eventDays = [
    { date: new Date('2026-06-11'), label: 'Opening Day — Group Stage', matchInfo: 'USA vs Colombia, 5:00 PM ET', gatesOpen: '3:00 PM ET' },
    { date: new Date('2026-06-15'), label: 'Group Stage — Day 5', matchInfo: 'Mexico vs Nigeria, 2:00 PM ET', gatesOpen: '12:00 PM ET' },
    { date: new Date('2026-06-19'), label: 'Group Stage — Day 9', matchInfo: 'Brazil vs Morocco, 8:00 PM ET', gatesOpen: '6:00 PM ET' },
    { date: new Date('2026-06-23'), label: 'Group Stage — Day 13', matchInfo: 'France vs Japan, 5:00 PM ET', gatesOpen: '3:00 PM ET' },
    { date: new Date('2026-06-28'), label: 'Round of 32', matchInfo: 'Winner Group A vs Runner-up Group B, 4:00 PM ET', gatesOpen: '2:00 PM ET' },
    { date: new Date('2026-07-03'), label: 'Round of 16', matchInfo: 'Match 52 — TBD, 8:00 PM ET', gatesOpen: '6:00 PM ET' },
    { date: new Date('2026-07-09'), label: 'Quarter-Final', matchInfo: 'QF-3 — TBD, 3:00 PM ET', gatesOpen: '1:00 PM ET' },
    { date: new Date('2026-07-15'), label: 'Semi-Final', matchInfo: 'SF-1 — TBD, 8:00 PM ET', gatesOpen: '6:00 PM ET' },
  ];

  for (const day of eventDays) {
    await prisma.eventDay.create({
      data: { eventId: event.id, ...day },
    });
  }

  // ─── Venue Alerts ─────────────────────────────────────────────────────────
  const venueAlerts = [
    {
      venueId: venue.id,
      type: 'INFO',
      title: 'Gate 1 Recommended for MARTA Riders',
      titleI18n: { es: 'Puerta 1 Recomendada para Usuarios de MARTA', ar: 'يُنصح باستخدام البوابة 1 لركاب MARTA', pt: 'Portão 1 Recomendado para Passageiros do MARTA' },
      message: 'Shortest walking path from Vine City MARTA station to Gate 1. Follow the lit walkway.',
      messageI18n: { es: 'Camino más corto desde la estación MARTA Vine City a la Puerta 1.', ar: 'أقصر طريق للمشي من محطة Vine City MARTA إلى البوابة 1.' },
      priority: 2,
      isActive: true,
    },
    {
      venueId: venue.id,
      type: 'WARNING',
      title: 'Heat Advisory — Hydration Stations Available',
      titleI18n: { es: 'Alerta de Calor — Estaciones de Hidratación Disponibles', ar: 'تحذير من الحرارة — محطات ترطيب متاحة', pt: 'Aviso de Calor — Estações de Hidratação Disponíveis' },
      message: 'Expected high of 95°F. Free water stations at Gates 1, 3, 5, 7. Cooling zones in the Family Zone.',
      priority: 3,
      isActive: true,
    },
    {
      venueId: venue.id,
      type: 'INFO',
      title: 'Prayer Room Open During All Matches',
      titleI18n: { ar: 'غرفة الصلاة مفتوحة خلال جميع المباريات', fr: 'Salle de Prière Ouverte Pendant Tous les Matchs' },
      message: 'Prayer and meditation room at Gate 1, Level 1 is open continuously during event hours. Wudu facilities adjacent.',
      priority: 1,
      isActive: true,
    },
    {
      venueId: venue.id,
      type: 'INFO',
      title: 'Free WiFi — Connect to "FIFA2026-ATL"',
      titleI18n: { es: 'WiFi Gratis — Conecta a "FIFA2026-ATL"', pt: 'WiFi Grátis — Conecte-se a "FIFA2026-ATL"' },
      message: 'Free high-speed WiFi available throughout the stadium. SSID: FIFA2026-ATL. No password needed.',
      priority: 1,
      isActive: true,
    },
  ];

  for (const alert of venueAlerts) {
    await prisma.venueAlert.create({ data: alert });
  }

  // ─── Demo Scenarios (storytelling-ready data) ─────────────────────────
  const demoSessions = [
    {
      sessionId: 'demo-arabic-family-01',
      languageCode: 'ar',
      eventId: event.id,
      venueId: venue.id,
      profile: {
        languageCode: 'ar',
        region: 'MENA',
        dietaryPreferences: ['halal'],
        cuisineAffinities: ['middle_eastern', 'halal', 'mediterranean'],
        behaviorTags: ['family_group', 'prayer_time_aware'],
        transportPreference: 'rideshare',
        accessibilityNeeds: [],
      },
      searches: [
        { query: 'أحتاج طعام حلال قرب الملعب', intent: 'food-cultural', resultCount: 6, latencyMs: 590 },
        { query: 'أين أقرب مستشفى؟', intent: 'medical', resultCount: 3, latencyMs: 520 },
      ],
      points: 160,
      badges: ['welcome-explorer', 'foodie-passport'],
    },
    {
      sessionId: 'demo-spanish-family-01',
      languageCode: 'es',
      eventId: event.id,
      venueId: venue.id,
      profile: {
        languageCode: 'es',
        region: 'LATAM',
        dietaryPreferences: [],
        cuisineAffinities: ['latin', 'mexican', 'cuban'],
        behaviorTags: ['family_group', 'social_dining'],
        transportPreference: 'transit',
        accessibilityNeeds: ['child_friendly'],
      },
      searches: [
        { query: 'hospital más cercano con direcciones', intent: 'medical', resultCount: 4, latencyMs: 510 },
        { query: 'comida mexicana cerca del estadio', intent: 'food-cultural', resultCount: 7, latencyMs: 480 },
        { query: 'dónde puedo tomar el metro', intent: 'transport', resultCount: 5, latencyMs: 420 },
      ],
      points: 220,
      badges: ['welcome-explorer', 'transit-pro', 'stadium-navigator'],
    },
    {
      sessionId: 'demo-portuguese-nightlife-01',
      languageCode: 'pt',
      eventId: event.id,
      venueId: venue.id,
      profile: {
        languageCode: 'pt',
        region: 'LUSOPHONE',
        dietaryPreferences: [],
        cuisineAffinities: ['brazilian', 'steakhouse'],
        behaviorTags: ['nightlife', 'social_dining'],
        transportPreference: 'rideshare',
        accessibilityNeeds: [],
      },
      searches: [
        { query: 'vida noturna perto do estádio', intent: 'entertainment', resultCount: 5, latencyMs: 460 },
        { query: 'comida brasileira em Atlanta', intent: 'food-cultural', resultCount: 4, latencyMs: 500 },
      ],
      points: 195,
      badges: ['welcome-explorer', 'coca-cola-superfan'],
    },
    {
      sessionId: 'demo-french-transport-01',
      languageCode: 'fr',
      eventId: event.id,
      venueId: venue.id,
      profile: {
        languageCode: 'fr',
        region: 'FRANCOPHONE',
        dietaryPreferences: [],
        cuisineAffinities: ['french', 'mediterranean'],
        behaviorTags: ['formal_greeting', 'late_dining'],
        transportPreference: 'transit',
        accessibilityNeeds: [],
      },
      searches: [
        { query: 'comment rentrer à mon hôtel en transport', intent: 'transport', resultCount: 6, latencyMs: 430 },
        { query: 'restaurant français près du stade', intent: 'food-cultural', resultCount: 3, latencyMs: 510 },
      ],
      points: 175,
      badges: ['welcome-explorer', 'transit-pro'],
    },
    {
      sessionId: 'demo-japanese-business-01',
      languageCode: 'ja',
      eventId: event.id,
      venueId: venue.id,
      profile: {
        languageCode: 'ja',
        region: 'EAST_ASIA',
        dietaryPreferences: [],
        cuisineAffinities: ['japanese', 'sushi'],
        behaviorTags: ['quiet_preference', 'quality_focus'],
        transportPreference: 'hotel_shuttle',
        accessibilityNeeds: [],
      },
      searches: [
        { query: '静かなレストランを探しています', intent: 'food-cultural', resultCount: 4, latencyMs: 560 },
        { query: '最寄りのトイレはどこ', intent: 'restroom', resultCount: 5, latencyMs: 380 },
      ],
      points: 145,
      badges: ['welcome-explorer'],
    },
    {
      sessionId: 'demo-korean-hospitality-01',
      languageCode: 'ko',
      eventId: event.id,
      venueId: venue.id,
      profile: {
        languageCode: 'ko',
        region: 'EAST_ASIA',
        dietaryPreferences: [],
        cuisineAffinities: ['korean', 'bbq'],
        behaviorTags: ['group_dining', 'quality_focus'],
        transportPreference: 'rideshare',
        accessibilityNeeds: [],
      },
      searches: [
        { query: '경기장 근처 한식당', intent: 'food-cultural', resultCount: 6, latencyMs: 470 },
        { query: '호텔로 가는 교통편', intent: 'transport', resultCount: 4, latencyMs: 410 },
      ],
      points: 185,
      badges: ['welcome-explorer', 'stadium-navigator'],
    },
  ];

  const demoSessionIds = demoSessions.map((s) => s.sessionId);

  await prisma.rewardClaim.deleteMany({ where: { eventId: event.id, sessionId: { in: demoSessionIds } } });
  await prisma.guestPointsLedger.deleteMany({ where: { eventId: event.id, sessionId: { in: demoSessionIds } } });
  await prisma.searchQueryLog.deleteMany({ where: { eventId: event.id, sessionId: { in: demoSessionIds } } });
  await prisma.sponsorRecommendation.deleteMany({ where: { eventId: event.id, sessionId: { in: demoSessionIds } } });
  await prisma.couponRedemption.deleteMany({ where: { eventId: event.id, sessionId: { in: demoSessionIds } } });

  for (const scenario of demoSessions) {
    await prisma.guestSession.upsert({
      where: { sessionId: scenario.sessionId },
      update: {
        languageCode: scenario.languageCode,
        eventId: scenario.eventId,
        venueId: scenario.venueId,
      },
      create: {
        sessionId: scenario.sessionId,
        languageCode: scenario.languageCode,
        eventId: scenario.eventId,
        venueId: scenario.venueId,
      },
    });

    await prisma.culturalProfile.upsert({
      where: { sessionId: scenario.sessionId },
      update: {
        languageCode: scenario.profile.languageCode,
        region: scenario.profile.region,
        dietaryPreferences: scenario.profile.dietaryPreferences,
        cuisineAffinities: scenario.profile.cuisineAffinities,
        behaviorTags: scenario.profile.behaviorTags,
        transportPreference: scenario.profile.transportPreference,
        accessibilityNeeds: scenario.profile.accessibilityNeeds,
      },
      create: {
        sessionId: scenario.sessionId,
        languageCode: scenario.profile.languageCode,
        region: scenario.profile.region,
        dietaryPreferences: scenario.profile.dietaryPreferences,
        cuisineAffinities: scenario.profile.cuisineAffinities,
        behaviorTags: scenario.profile.behaviorTags,
        transportPreference: scenario.profile.transportPreference,
        accessibilityNeeds: scenario.profile.accessibilityNeeds,
      },
    });

    for (const search of scenario.searches) {
      await prisma.searchQueryLog.create({
        data: {
          sessionId: scenario.sessionId,
          eventId: scenario.eventId,
          query: search.query,
          intent: search.intent,
          languageCode: scenario.languageCode,
          resultCount: search.resultCount,
          hasResults: search.resultCount > 0,
          latencyMs: search.latencyMs,
          toolsUsed: ['intent-parser', 'venue-poi', 'city-services', 'sponsor-inject'],
        },
      });
    }

    await prisma.guestPointsLedger.createMany({
      data: [
        {
          sessionId: scenario.sessionId,
          eventId: scenario.eventId,
          action: 'onboarding_complete',
          points: 25,
          description: 'Completed onboarding and language setup',
        },
        {
          sessionId: scenario.sessionId,
          eventId: scenario.eventId,
          action: 'concierge_usage',
          points: 40,
          description: 'Used concierge intent chips',
        },
        {
          sessionId: scenario.sessionId,
          eventId: scenario.eventId,
          action: 'sponsor_checkin',
          points: scenario.points - 65,
          description: 'Visited sponsor checkpoints and completed actions',
        },
      ],
    });
  }

  const allBadges = await prisma.rewardBadge.findMany({ where: { eventId: event.id } });
  const badgeBySlug = new Map(allBadges.map((b) => [b.slug, b]));

  for (const scenario of demoSessions) {
    for (const badgeSlug of scenario.badges) {
      const badge = badgeBySlug.get(badgeSlug);
      if (!badge) continue;

      await prisma.rewardClaim.create({
        data: {
          sessionId: scenario.sessionId,
          eventId: event.id,
          badgeId: badge.id,
        },
      });
    }
  }

  const dbCampaigns = await prisma.sponsorCampaign.findMany({ where: { eventId: event.id } });
  const campaignForIntent = {
    'food-cultural': dbCampaigns.find((c) => c.name.includes('Cultural Passport') || c.name.includes('Halal Menu Launch')),
    medical: dbCampaigns.find((c) => c.name.includes('CVS Pharmacy')),
    transport: dbCampaigns.find((c) => c.name.includes('MARTA Transit') || c.name.includes('Uber')),
    entertainment: dbCampaigns.find((c) => c.name.includes('Adidas') || c.name.includes('Verizon')),
    restroom: dbCampaigns.find((c) => c.name.includes('Verizon') || c.name.includes('Coca-Cola Fan Zone')),
  };

  for (const scenario of demoSessions) {
    for (const search of scenario.searches) {
      const campaign = campaignForIntent[search.intent as keyof typeof campaignForIntent];
      if (!campaign) continue;

      await prisma.sponsorRecommendation.create({
        data: {
          campaignId: campaign.id,
          sessionId: scenario.sessionId,
          eventId: event.id,
          queryIntent: search.intent,
          languageCode: scenario.languageCode,
          culturalScore: Number((0.72 + Math.random() * 0.2).toFixed(2)),
          proximityScore: Number((0.65 + Math.random() * 0.25).toFixed(2)),
          finalScore: Number((0.7 + Math.random() * 0.25).toFixed(2)),
          placement: campaign.placement,
          wasClicked: Math.random() > 0.45,
        },
      });
    }
  }

  await prisma.couponRedemption.createMany({
    data: [
      {
        sessionId: 'demo-spanish-family-01',
        eventId: event.id,
        couponCode: 'MARTAFAN',
        couponValue: 'Free day pass',
      },
      {
        sessionId: 'demo-arabic-family-01',
        eventId: event.id,
        couponCode: 'COCACULTURE26',
        couponValue: 'Free World of Coca-Cola admission',
      },
      {
        sessionId: 'demo-korean-hospitality-01',
        eventId: event.id,
        couponCode: 'MBFANQUIZ',
        couponValue: 'AMG Suite upgrade chance',
      },
    ],
  });

  console.log('✅ Atlanta 2026 seed complete');
  console.log(`   Organization: ${org.name} (${org.id})`);
  console.log(`   Event: ${event.name} (${event.id})`);
  console.log(`   Venue: ${venue.name} (${venue.id})`);
  console.log(`   POIs: ${pois.length}`);
  console.log(`   Emergency Phrases: ${emergencyPhrases.length}`);
  console.log(`   Approved Phrases: ${approvedPhrases.length}`);
  console.log(`   City Services: ${cityServices.length}`);
  console.log(`   Restaurants: ${restaurants.length + additionalRestaurants.length}`);
  console.log(`   Sponsor Campaigns: ${sponsorCampaigns.length}`);
  console.log(`   Reward Badges: ${badges.length}`);
  console.log(`   Sponsor Challenges: ${challenges.length}`);
  console.log(`   Geo-Fences: ${geoFences.length}`);
  console.log(`   Event Days: ${eventDays.length}`);
  console.log(`   Venue Alerts: ${venueAlerts.length}`);
  console.log(`   Demo Sessions: ${demoSessions.length}`);
  console.log(`   Demo Search Logs: ${demoSessions.reduce((sum, s) => sum + s.searches.length, 0)}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
