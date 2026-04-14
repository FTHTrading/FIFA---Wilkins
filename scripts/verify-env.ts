/**
 * verify-env.ts — Validate required environment variables at startup
 *
 * Usage: npx ts-node scripts/verify-env.ts
 */
import * as fs from 'fs';
import * as path from 'path';

interface EnvRule {
  key: string;
  required: boolean;
  description: string;
}

const rules: EnvRule[] = [
  { key: 'DATABASE_URL', required: true, description: 'PostgreSQL connection string' },
  { key: 'REDIS_HOST', required: true, description: 'Redis hostname' },
  { key: 'REDIS_PORT', required: true, description: 'Redis port' },
  { key: 'JWT_SECRET', required: true, description: 'JWT signing secret (min 32 chars)' },
  { key: 'NEXT_PUBLIC_MAPBOX_TOKEN', required: true, description: 'Mapbox public access token' },
  { key: 'MAPBOX_ACCESS_TOKEN', required: false, description: 'Mapbox server-side token (fallback to public)' },
  { key: 'AZURE_TRANSLATOR_KEY', required: false, description: 'Azure Cognitive Services Translator key' },
  { key: 'AZURE_TRANSLATOR_REGION', required: false, description: 'Azure Translator region' },
  { key: 'AZURE_VISION_KEY', required: false, description: 'Azure Computer Vision key (OCR)' },
  { key: 'AZURE_SPEECH_KEY', required: false, description: 'Azure Speech Services key (TTS/STT)' },
  { key: 'OVERPASS_ENDPOINT', required: false, description: 'OpenStreetMap Overpass API endpoint' },
  { key: 'MCP_AGENTIC_ENABLED', required: false, description: 'Enable agentic concierge features' },
];

function loadEnvFile(envPath: string): Record<string, string> {
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf-8');
  const vars: Record<string, string> = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    vars[key] = value;
  }
  return vars;
}

function main() {
  const envPath = path.resolve(process.cwd(), '.env');
  const fileVars = loadEnvFile(envPath);
  const allVars = { ...fileVars, ...process.env };

  console.log('🔍 Verifying environment variables...\n');

  let hasErrors = false;
  let warnings = 0;

  for (const rule of rules) {
    const value = allVars[rule.key];
    const isSet = value !== undefined && value !== '';

    if (rule.required && !isSet) {
      console.log(`  ❌ ${rule.key} — MISSING (required) — ${rule.description}`);
      hasErrors = true;
    } else if (!rule.required && !isSet) {
      console.log(`  ⚠️  ${rule.key} — not set (optional) — ${rule.description}`);
      warnings++;
    } else {
      console.log(`  ✅ ${rule.key} — set`);
    }
  }

  console.log('');
  if (hasErrors) {
    console.log('❌ Environment verification FAILED — fix required variables above');
    process.exit(1);
  } else {
    console.log(`✅ Environment verification passed (${warnings} optional warnings)`);
  }
}

main();
