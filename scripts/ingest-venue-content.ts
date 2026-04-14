/**
 * ingest-venue-content.ts — Ingest venue RAG content with pgvector embeddings
 *
 * Reads structured content (POIs, cultural info, FAQs) and upserts into
 * the RagChunk table with embeddings from OpenAI or Azure OpenAI.
 *
 * Usage:
 *   npx ts-node -P apps/api/tsconfig.json scripts/ingest-venue-content.ts
 *
 * Requires .env with: DATABASE_URL, and either:
 *   - OPENAI_API_KEY (for EMBEDDING_PROVIDER=openai)
 *   - AZURE_OPENAI_API_KEY + AZURE_OPENAI_ENDPOINT + AZURE_OPENAI_EMBEDDING_DEPLOYMENT
 *     (for EMBEDDING_PROVIDER=azure-openai)
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';

dotenv.config({ path: path.resolve(__dirname, '../apps/api/.env') });

const prisma = new PrismaClient();

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContentChunk {
  source: string;
  sourceId?: string;
  eventId?: string;
  language: string;
  title?: string;
  content: string;
  tags: string[];
}

// ─── Sample Venue Content ────────────────────────────────────────────────────
// Replace or augment this with CSV/JSON file loading as your content library grows

const VENUE_CONTENT: ContentChunk[] = [
  // ── English — Stadium navigation ────────────────────────────────────────
  {
    source: 'venue-poi',
    sourceId: 'mbs-gates',
    language: 'en',
    title: 'Mercedes-Benz Stadium Gates',
    content:
      'Mercedes-Benz Stadium has 8 main gates: Gate 1 (North, MARTA/transit, accessible), ' +
      'Gate 2 (Northeast, rideshare drop-off), Gate 3 (East, pedestrian bridge), ' +
      'Gate 4 (Southeast, VIP/hospitality), Gate 5 (South, family/ADA), ' +
      'Gate 6 (Southwest, premium parking), Gate 7 (West, public transit), ' +
      'Gate 8 (Northwest, press/media). All gates open 90 minutes before kickoff.',
    tags: ['gates', 'entrance', 'navigation', 'stadium'],
  },
  {
    source: 'venue-poi',
    sourceId: 'mbs-restrooms',
    language: 'en',
    title: 'Restroom Locations',
    content:
      'Restrooms are located on every concourse level (100, 200, 300) near sections 101, 113, 126, 138. ' +
      'Family restrooms with changing stations at Gate 1 (section 101) and Gate 5 (section 126). ' +
      'ADA-accessible restrooms available near all main gates. ' +
      'Prayer/ablution room available at Gate 1 level 1 — follow the prayer room signage.',
    tags: ['restroom', 'facilities', 'accessible', 'family', 'ablution'],
  },
  {
    source: 'venue-faq',
    sourceId: 'mbs-medical',
    language: 'en',
    title: 'Medical Assistance',
    content:
      'First aid stations are at Gates 1, 3, 5, and 7 on the main concourse. ' +
      'For emergencies, call 911 or alert any stadium staff member. ' +
      'Nearest hospital: Grady Memorial Hospital (0.8 miles north), Emory Midtown (1.2 miles). ' +
      'AED defibrillators located every 300 feet throughout all concourses. ' +
      'Nursing/lactation room at Gate 1, Level 1.',
    tags: ['medical', 'emergency', 'hospital', 'first-aid', 'health'],
  },
  {
    source: 'venue-faq',
    sourceId: 'mbs-transport',
    language: 'en',
    title: 'Transportation & Getting Around',
    content:
      'MARTA: Vine City station (red/gold line) is 5 minutes walk — Gate 1 exit leads directly to station. ' +
      'Georgia Dome/State Farm Arena stop also nearby. ' +
      'Rideshare: designated pickup/drop-off at Gate 2 and parking deck P3. ' +
      'Taxi: available at Gate 7 on Mitchell Street. ' +
      'Parking: P1-P6 decks around stadium, $40-$60. ' +
      'BikeShare: Relay Bike stations at Gates 1 and 6.',
    tags: ['transport', 'marta', 'transit', 'rideshare', 'parking', 'directions'],
  },
  {
    source: 'venue-food',
    sourceId: 'mbs-halal',
    language: 'en',
    title: 'Halal Food Options',
    content:
      'Halal-certified food is available at: ' +
      'Section 101 Stand — halal gyros and falafel wraps. ' +
      'Section 118 — halal chicken shawarma and rice bowls. ' +
      'Section 132 — halal beef and lamb options. ' +
      'All halal stands are marked with a green crescent moon symbol. ' +
      'Alcohol-free beverage stations near halal food stands. ' +
      'Outside Atlanta: Al-Basha Restaurant (0.4mi), Pita Mediterranean (0.6mi).',
    tags: ['halal', 'food', 'muslim', 'dietary', 'cultural-dietary', 'arabic'],
  },
  {
    source: 'venue-food',
    sourceId: 'mbs-dietary',
    language: 'en',
    title: 'Dietary & Allergy Options',
    content:
      'Vegetarian/Vegan: available at all major food stands — look for the green V symbol. ' +
      'Kosher: pre-packaged kosher meals available at Gate 1 information desk (advance order recommended). ' +
      'Gluten-free: dedicated gluten-free stand at section 114. ' +
      'Allergen info available on all digital menu boards. ' +
      'Allergy alert: contact any food supervisor or first aid for allergy emergencies.',
    tags: ['vegetarian', 'vegan', 'kosher', 'gluten-free', 'dietary', 'allergy'],
  },

  // ── Arabic — Cultural & navigation content ──────────────────────────────
  {
    source: 'venue-cultural',
    sourceId: 'mbs-prayer-ar',
    language: 'ar',
    title: 'غرفة الصلاة',
    content:
      'غرفة الصلاة والوضوء متاحة في البوابة 1، الطابق الأول. ' +
      'اتبع لافتات "Prayer Room" أو اسأل أي موظف في الملعب. ' +
      'تُصلى صلاة الجمعة في المكان المخصص. ' +
      'الغرفة تسع 20 شخصاً وتتوفر بها سجادات صلاة. ' +
      'مرافق الوضوء في الحمامات المجاورة.',
    tags: ['prayer', 'mosque', 'muslim', 'arabic', 'cultural', 'religious'],
  },
  {
    source: 'venue-food',
    sourceId: 'mbs-halal-ar',
    language: 'ar',
    title: 'الطعام الحلال في الملعب',
    content:
      'الطعام الحلال متاح في: ' +
      'القسم 101 — شاورما دجاج وفلافل. ' +
      'القسم 118 — لحم حلال وأرز. ' +
      'القسم 132 — خيارات لحم بقري وضأن. ' +
      'جميع أكشاك الطعام الحلال مُعلَّمة بهلال أخضر. ' +
      'مشروبات بدون كحول بجوار أكشاك الحلال.',
    tags: ['halal', 'food', 'arabic', 'dietary', 'cultural-dietary'],
  },
  {
    source: 'venue-transport',
    sourceId: 'mbs-transport-ar',
    language: 'ar',
    title: 'التنقل من وإلى الملعب',
    content:
      'مترو MARTA: محطة Vine City على بُعد 5 دقائق مشياً من البوابة 1. ' +
      'سيارات الأجرة: متاحة عند البوابة 7 في شارع Mitchell. ' +
      'النقل المشترك (Uber/Lyft): منطقة الإنزال في البوابة 2 ومواقف P3. ' +
      'للذهاب إلى المطار: خط MARTA الذهبي من Vine City إلى مطار هارتسفيلد-جاكسون، مدة الرحلة 30 دقيقة.',
    tags: ['transport', 'arabic', 'marta', 'rideshare', 'airport', 'directions'],
  },

  // ── Spanish ──────────────────────────────────────────────────────────────
  {
    source: 'venue-food',
    sourceId: 'mbs-food-es',
    language: 'es',
    title: 'Comida latinoamericana cerca del estadio',
    content:
      'Dentro del estadio: tacos y burritos en la sección 110. ' +
      'Comida mexicana: La Feria (0.3 millas), El Azteca (0.5 millas). ' +
      'Comida colombiana: Arepa Mia (0.8 millas). ' +
      'Brasileña: Brazilian Steakhouse downtown (1.2 millas). ' +
      'Buses directos al área de restaurantes cada 15 minutos desde la puerta 3.',
    tags: ['food', 'spanish', 'latin', 'mexican', 'cultural-dietary'],
  },
  {
    source: 'venue-faq',
    sourceId: 'mbs-navigate-es',
    language: 'es',
    title: 'Cómo moverse por el estadio',
    content:
      'El estadio tiene 8 puertas principales. La entrada principal es la Puerta 1 (norte). ' +
      'Metro MARTA: estación Vine City a 5 minutos caminando desde Puerta 1. ' +
      'Servicios médicos: estaciones en Puertas 1, 3, 5 y 7. ' +
      'Baños familiares con cambiador: Puerta 1 y Puerta 5. ' +
      'Información en español disponible en todos los puntos de información.',
    tags: ['navigation', 'spanish', 'stadium', 'directions', 'transport'],
  },

  // ── Portuguese ────────────────────────────────────────────────────────────
  {
    source: 'venue-faq',
    sourceId: 'mbs-navigate-pt',
    language: 'pt',
    title: 'Como se locomover no estádio',
    content:
      'O Mercedes-Benz Stadium tem 8 portões principais. A entrada principal é o Portão 1 (norte). ' +
      'Metrô MARTA: estação Vine City a 5 minutos a pé do Portão 1. ' +
      'Comida brasileira próxima: Fogo de Chão (1 milha), LM Restaurant (0.7 milha). ' +
      'Informações em português disponíveis em todos os pontos de informação. ' +
      'Para o aeroporto: linha dourada do MARTA, 30 minutos de viagem.',
    tags: ['navigation', 'portuguese', 'stadium', 'transport', 'directions'],
  },

  // ── Japanese ──────────────────────────────────────────────────────────────
  {
    source: 'venue-cultural',
    sourceId: 'mbs-faq-ja',
    language: 'ja',
    title: 'スタジアムガイド（日本語）',
    content:
      'Mercedes-Benzスタジアムには8つのゲートがあります。メインゲートは1番（北側）です。' +
      'MARTA（地下鉄）：Vine City駅まで徒歩5分（ゲート1から）。' +
      '日本食レストラン近隣：Japanica（0.5マイル）、Minato（0.8マイル）。' +
      '医療支援：ゲート1、3、5、7の救急ステーション。' +
      '案内スタッフは日本語で対応できます。',
    tags: ['navigation', 'japanese', 'stadium', 'directions', 'transport', 'food'],
  },

  // ── Korean ────────────────────────────────────────────────────────────────
  {
    source: 'venue-cultural',
    sourceId: 'mbs-faq-ko',
    language: 'ko',
    title: '경기장 가이드 (한국어)',
    content:
      'Mercedes-Benz 경기장에는 8개의 주요 게이트가 있습니다. 메인 게이트는 1번(북쪽)입니다. ' +
      'MARTA 지하철: 게이트 1에서 도보 5분 거리에 Vine City 역이 있습니다. ' +
      '한식당 인근: K-Town Korean (0.4마일), Seoul Garden (0.7마일). ' +
      '한국어 안내 직원이 게이트 1과 3에 있습니다. ' +
      '의료 지원: 게이트 1, 3, 5, 7에 응급 처치소 있음.',
    tags: ['navigation', 'korean', 'stadium', 'directions', 'food', 'transport'],
  },

  // ── French ────────────────────────────────────────────────────────────────
  {
    source: 'venue-cultural',
    sourceId: 'mbs-faq-fr',
    language: 'fr',
    title: 'Guide du stade (français)',
    content:
      'Le stade Mercedes-Benz compte 8 entrées principales. L\'entrée principale est la Porte 1 (nord). ' +
      'Métro MARTA : station Vine City à 5 minutes à pied de la Porte 1. ' +
      'Restaurants français à proximité : Brasserie Atlanta (0.6 mile), Café Paris (0.9 mile). ' +
      'Assistance médicale aux portes 1, 3, 5 et 7. ' +
      'Services en français disponibles aux points d\'information.',
    tags: ['navigation', 'french', 'stadium', 'directions', 'food', 'transport'],
  },

  // ── Chinese ───────────────────────────────────────────────────────────────
  {
    source: 'venue-cultural',
    sourceId: 'mbs-faq-zh',
    language: 'zh-CN',
    title: '体育场指南（中文）',
    content:
      'Mercedes-Benz体育场共有8个主要入口。1号门（北侧）为主入口。' +
      'MARTA地铁：从1号门步行5分钟至Vine City站。' +
      '附近中餐厅：Atlanta Chinatown（1英里），Tasty China（0.8英里）。' +
      '医疗急救站位于1、3、5、7号门。' +
      '各信息台提供中文服务。',
    tags: ['navigation', 'chinese', 'stadium', 'directions', 'food', 'transport'],
  },

  // ── German ────────────────────────────────────────────────────────────────
  {
    source: 'venue-cultural',
    sourceId: 'mbs-faq-de',
    language: 'de',
    title: 'Stadionführer (Deutsch)',
    content:
      'Das Mercedes-Benz Stadium hat 8 Haupteingänge. Haupteingang ist Tor 1 (Norden). ' +
      'MARTA U-Bahn: Vine City Station, 5 Minuten Fußweg von Tor 1. ' +
      'Deutsche Restaurants in der Nähe: Haus Heidelberg (1.2 Meilen). ' +
      'Sanitätsstationen an den Toren 1, 3, 5 und 7. ' +
      'Deutschsprachige Mitarbeiter an den Informationsständen.',
    tags: ['navigation', 'german', 'stadium', 'directions', 'food', 'transport'],
  },

  // ── Italian ───────────────────────────────────────────────────────────────
  {
    source: 'venue-cultural',
    sourceId: 'mbs-faq-it',
    language: 'it',
    title: 'Guida allo stadio (italiano)',
    content:
      'Il Mercedes-Benz Stadium ha 8 ingressi principali. L\'ingresso principale è il Cancello 1 (nord). ' +
      'Metro MARTA: stazione Vine City a 5 minuti a piedi dal Cancello 1. ' +
      'Ristoranti italiani nelle vicinanze: Pricci (0.7 miglia), Pasta da Pulcinella (1 miglio). ' +
      'Pronto soccorso ai cancelli 1, 3, 5 e 7. ' +
      'Assistenza in italiano disponibile ai punti informativi.',
    tags: ['navigation', 'italian', 'stadium', 'directions', 'food', 'transport'],
  },
];

// ─── Embedding ────────────────────────────────────────────────────────────────

type EmbeddingBackend = 'openai' | 'azure-openai' | 'none';

function detectBackend(): EmbeddingBackend {
  const provider = process.env.EMBEDDING_PROVIDER ?? 'openai';
  if (provider === 'azure-openai' && process.env.AZURE_OPENAI_API_KEY) return 'azure-openai';
  if (process.env.OPENAI_API_KEY) return 'openai';
  return 'none';
}

async function generateEmbedding(text: string): Promise<number[] | null> {
  const backend = detectBackend();

  if (backend === 'none') {
    console.warn('  ⚠ No embedding provider configured — storing chunk without vector');
    return null;
  }

  try {
    if (backend === 'openai') {
      const model = process.env.OPENAI_EMBEDDING_MODEL ?? 'text-embedding-3-small';
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({ model, input: text }),
      });
      if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`);
      const data = (await response.json()) as { data: Array<{ embedding: number[] }> };
      return data.data[0]?.embedding ?? null;
    }

    if (backend === 'azure-openai') {
      const endpoint = process.env.AZURE_OPENAI_ENDPOINT!;
      const deployment = process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT ?? 'text-embedding-3-small';
      const apiVersion = process.env.AZURE_OPENAI_API_VERSION ?? '2024-02-01';
      const url = `${endpoint}/openai/deployments/${deployment}/embeddings?api-version=${apiVersion}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.AZURE_OPENAI_API_KEY!,
        },
        body: JSON.stringify({ input: text }),
      });
      if (!response.ok) throw new Error(`Azure OpenAI error: ${response.status}`);
      const data = (await response.json()) as { data: Array<{ embedding: number[] }> };
      return data.data[0]?.embedding ?? null;
    }
  } catch (err) {
    console.error('  ✖ Embedding failed:', (err as Error).message);
    return null;
  }

  return null;
}

async function generateEmbeddingText(chunk: ContentChunk): Promise<string> {
  // Combine title + content for richer embedding context
  const parts: string[] = [];
  if (chunk.title) parts.push(chunk.title);
  parts.push(chunk.content);
  if (chunk.tags.length) parts.push(`Tags: ${chunk.tags.join(', ')}`);
  return parts.join('\n');
}

// ─── Upsert ───────────────────────────────────────────────────────────────────

async function upsertChunk(chunk: ContentChunk): Promise<void> {
  const embeddingText = await generateEmbeddingText(chunk);
  const embedding = await generateEmbedding(embeddingText);
  const model = process.env.OPENAI_EMBEDDING_MODEL ?? 'text-embedding-3-small';

  // Upsert by (source + sourceId + language) unique key
  const existing = chunk.sourceId
    ? await prisma.ragChunk.findFirst({
        where: { source: chunk.source, sourceId: chunk.sourceId, language: chunk.language },
        select: { id: true },
      })
    : null;

  if (embedding) {
    // Write embedding with $executeRaw since Prisma doesn't support pgvector natively
    const vecLiteral = `[${embedding.join(',')}]`;
    if (existing) {
      await prisma.$executeRaw`
        UPDATE "RagChunk"
        SET
          title = ${chunk.title ?? null},
          content = ${chunk.content},
          tags = ${chunk.tags},
          embedding = ${vecLiteral}::vector,
          "embeddingModel" = ${model},
          "tokenCount" = ${Math.ceil(chunk.content.length / 4)},
          "updatedAt" = now()
        WHERE id = ${existing.id}
      `;
    } else {
      await prisma.$executeRaw`
        INSERT INTO "RagChunk" (
          id, source, "sourceId", "eventId", language, title, content,
          tags, embedding, "embeddingModel", "tokenCount", "isActive", "createdAt", "updatedAt"
        ) VALUES (
          gen_random_uuid()::text,
          ${chunk.source},
          ${chunk.sourceId ?? null},
          ${chunk.eventId ?? null},
          ${chunk.language},
          ${chunk.title ?? null},
          ${chunk.content},
          ${chunk.tags},
          ${vecLiteral}::vector,
          ${model},
          ${Math.ceil(chunk.content.length / 4)},
          true,
          now(),
          now()
        )
      `;
    }
  } else {
    // Fallback: upsert without vector
    await prisma.ragChunk.upsert({
      where: { id: existing?.id ?? '' },
      update: {
        title: chunk.title,
        content: chunk.content,
        tags: chunk.tags,
        embeddingModel: null,
      },
      create: {
        source: chunk.source,
        sourceId: chunk.sourceId,
        eventId: chunk.eventId,
        language: chunk.language,
        title: chunk.title,
        content: chunk.content,
        tags: chunk.tags,
        tokenCount: Math.ceil(chunk.content.length / 4),
        isActive: true,
      },
    });
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const backend = detectBackend();
  console.log(`\n🚀 Wilkins RAG Ingestion`);
  console.log(`   Embedding backend: ${backend}`);
  console.log(`   Chunks to ingest:  ${VENUE_CONTENT.length}\n`);

  let succeeded = 0;
  let failed = 0;

  for (const chunk of VENUE_CONTENT) {
    const label = `[${chunk.language}] ${chunk.source}/${chunk.sourceId ?? 'anon'}`;
    try {
      process.stdout.write(`  ↳ ${label} ... `);
      await upsertChunk(chunk);
      process.stdout.write('✓\n');
      succeeded++;
    } catch (err) {
      process.stdout.write(`✖ ERROR\n`);
      console.error(`    ${(err as Error).message}`);
      failed++;
    }

    // Rate-limit: 10 RPS for OpenAI embedding API
    await new Promise((r) => setTimeout(r, 110));
  }

  console.log(`\n✅ Done — ${succeeded} succeeded, ${failed} failed\n`);
}

main()
  .catch((err) => {
    console.error('Fatal:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
