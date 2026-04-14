import 'reflect-metadata';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database…');

  // Org
  const org = await prisma.organization.upsert({
    where: { slug: 'wilkins-media' },
    update: {},
    create: {
      name: 'Wilkins Media Group',
      slug: 'wilkins-media',
      website: 'https://wilkinsmedia.com',
    },
  });

  // Super-admin user
  const adminHash = await bcrypt.hash('Admin123!', 12);
  await prisma.user.upsert({
    where: { email: 'admin@wilkinsmedia.com' },
    update: {},
    create: {
      email: 'admin@wilkinsmedia.com',
      passwordHash: adminHash,
      name: 'Wilkins Admin',
      role: 'SUPER_ADMIN',
      organizationId: org.id,
    },
  });

  // Atlanta FIFA event
  const event = await prisma.event.upsert({
    where: { slug: 'atlanta-2026' },
    update: {},
    create: {
      organizationId: org.id,
      name: 'Atlanta 2026 World Cup Fan Experience',
      slug: 'atlanta-2026',
      description: 'The official multilingual hospitality guide for international fans in Atlanta.',
      status: 'PUBLISHED',
      primaryLanguage: 'en',
      supportedLanguages: ['en', 'es', 'fr', 'pt', 'ar', 'ja', 'ko', 'zh-CN', 'de', 'it'],
      timezone: 'America/New_York',
      startsAt: new Date('2026-06-01T00:00:00Z'),
      endsAt: new Date('2026-07-13T23:59:59Z'),
    },
  });

  // Venue
  const venue = await prisma.venue.upsert({
    where: { id: 'mercedes-benz-stadium' },
    update: {},
    create: {
      id: 'mercedes-benz-stadium',
      eventId: event.id,
      name: 'Mercedes-Benz Stadium',
      address: '1 AMB Drive NW',
      city: 'Atlanta',
      country: 'US',
      latitude: 33.7554,
      longitude: -84.4005,
    },
  });

  // Emergency phrases
  const phrases = [
    { phraseKey: 'call_ambulance', urgency: 'critical', icon: '🚑', en: 'I need an ambulance', es: 'Necesito una ambulancia', ar: 'أحتاج إلى سيارة إسعاف' },
    { phraseKey: 'call_police', urgency: 'critical', icon: '🚔', en: 'I need the police', es: 'Necesito la policía', ar: 'أحتاج إلى الشرطة' },
    { phraseKey: 'fire', urgency: 'critical', icon: '🔥', en: 'There is a fire', es: 'Hay un incendio', ar: 'هناك حريق' },
    { phraseKey: 'lost_child', urgency: 'high', icon: '👶', en: 'I lost my child', es: 'Perdí a mi hijo', ar: 'فقدت طفلي' },
    { phraseKey: 'medical_help', urgency: 'high', icon: '🏥', en: 'I need medical help', es: 'Necesito ayuda médica', ar: 'أحتاج مساعدة طبية' },
    { phraseKey: 'allergic_reaction', urgency: 'high', icon: '⚠️', en: 'I am having an allergic reaction', es: 'Tengo una reacción alérgica', ar: 'أعاني من رد فعل تحسسي' },
    { phraseKey: 'i_am_lost', urgency: 'medium', icon: '🗺️', en: 'I am lost', es: 'Estoy perdido', ar: 'أنا ضائع' },
    { phraseKey: 'theft', urgency: 'medium', icon: '🔓', en: 'I have been robbed', es: 'Me han robado', ar: 'تعرضت للسرقة' },
  ];

  for (const [index, phrase] of phrases.entries()) {
    await prisma.emergencyPhrase.upsert({
      where: { phraseKey: phrase.phraseKey },
      update: {},
      create: {
        phraseKey: phrase.phraseKey,
        urgency: phrase.urgency,
        icon: phrase.icon,
        sortOrder: index,
        translations: {
          en: phrase.en,
          es: phrase.es,
          ar: phrase.ar,
          fr: phrase.en,
          pt: phrase.en,
          ja: phrase.en,
          ko: phrase.en,
          'zh-CN': phrase.en,
          de: phrase.en,
          it: phrase.en,
        },
      },
    });
  }

  // POIs
  const poiData = [
    { name: 'Main Entrance Gate A', category: 'GATE', lat: 33.7560, lng: -84.4000 },
    { name: 'First Aid Station - Level 1', category: 'FIRST_AID', lat: 33.7552, lng: -84.4003 },
    { name: 'Information Desk', category: 'INFORMATION', lat: 33.7555, lng: -84.4008 },
    { name: 'Restrooms - Section 101', category: 'RESTROOM', lat: 33.7558, lng: -84.4010 },
  ] as const;

  for (const poi of poiData) {
    await prisma.venuePOI.create({
      data: {
        venueId: venue.id,
        name: poi.name,
        category: poi.category,
        latitude: poi.lat,
        longitude: poi.lng,
      },
    }).catch(() => { /* skip if exists */ });
  }

  console.log('✅ Seed complete');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
