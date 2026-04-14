/**
 * import-venue-pois.ts — Import venue POIs from a JSON file
 *
 * Usage: npx ts-node scripts/import-venue-pois.ts --venue <venueId> --file <path-to-json>
 *
 * Expected JSON format:
 * [
 *   {
 *     "name": "Gate 1",
 *     "nameI18n": { "es": "Puerta 1" },
 *     "category": "GATE",
 *     "latitude": 33.756,
 *     "longitude": -84.401,
 *     "floor": "Ground"
 *   }
 * ]
 */
import { PrismaClient, POICategory } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface POIInput {
  name: string;
  nameI18n?: Record<string, string>;
  category: string;
  description?: string;
  latitude: number;
  longitude: number;
  floor?: string;
}

function parseArgs(): { venueId: string; filePath: string } {
  const args = process.argv.slice(2);
  let venueId = '';
  let filePath = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--venue' && args[i + 1]) venueId = args[++i];
    if (args[i] === '--file' && args[i + 1]) filePath = args[++i];
  }

  if (!venueId || !filePath) {
    console.error('Usage: npx ts-node scripts/import-venue-pois.ts --venue <venueId> --file <path>');
    process.exit(1);
  }

  return { venueId, filePath: path.resolve(filePath) };
}

const validCategories = new Set<string>(Object.values(POICategory));

async function main() {
  const { venueId, filePath } = parseArgs();

  const venue = await prisma.venue.findUnique({ where: { id: venueId } });
  if (!venue) {
    console.error(`❌ Venue not found: ${venueId}`);
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const pois: POIInput[] = JSON.parse(raw);

  console.log(`📍 Importing ${pois.length} POIs into venue "${venue.name}"...`);

  let imported = 0;
  let skipped = 0;

  for (const poi of pois) {
    if (!validCategories.has(poi.category)) {
      console.warn(`  ⚠️  Skipping "${poi.name}" — invalid category: ${poi.category}`);
      skipped++;
      continue;
    }

    await prisma.venuePOI.create({
      data: {
        venueId,
        name: poi.name,
        nameI18n: poi.nameI18n ?? undefined,
        category: poi.category as POICategory,
        description: poi.description,
        latitude: poi.latitude,
        longitude: poi.longitude,
        floor: poi.floor,
        isActive: true,
      },
    });
    imported++;
  }

  console.log(`\n✅ Import complete: ${imported} imported, ${skipped} skipped`);
}

main()
  .catch((e) => {
    console.error('❌ Import failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
