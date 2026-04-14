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
  validate?: (value: string) => string | null; // return error message or null
}

const rules: EnvRule[] = [
  {
    key: 'DATABASE_URL',
    required: true,
    description: 'PostgreSQL connection string',
    validate: (v) =>
      v.startsWith('postgresql://') || v.startsWith('postgres://')
        ? null
        : 'Must start with postgresql:// or postgres://',
  },
  { key: 'REDIS_HOST', required: true, description: 'Redis hostname' },
  {
    key: 'REDIS_PORT',
    required: true,
    description: 'Redis port',
    validate: (v) => {
      const n = parseInt(v, 10);
      return !isNaN(n) && n > 0 && n < 65536 ? null : 'Must be a valid port number (1-65535)';
    },
  },
  {
    key: 'JWT_SECRET',
    required: true,
    description: 'JWT signing secret (min 32 chars)',
    validate: (v) => (v.length >= 32 ? null : `Must be at least 32 characters (currently ${v.length})`),
  },
  {
    key: 'NEXT_PUBLIC_MAPBOX_TOKEN',
    required: true,
    description: 'Mapbox public access token',
    validate: (v) => (v.startsWith('pk.') ? null : 'Must start with pk.'),
  },
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
  const nodeEnv = allVars['NODE_ENV'] || 'development';

  console.log(`🔍 Verifying environment variables (NODE_ENV=${nodeEnv})...\n`);

  let hasErrors = false;
  let warnings = 0;

  for (const rule of rules) {
    const value = allVars[rule.key];
    const isSet = value !== undefined && value !== '';

    if (rule.required && !isSet) {
      console.log(`  ❌ ${rule.key} — MISSING (required) — ${rule.description}`);
      hasErrors = true;
    } else if (isSet && rule.validate) {
      const validationError = rule.validate(value!);
      if (validationError) {
        console.log(`  ❌ ${rule.key} — INVALID: ${validationError}`);
        hasErrors = true;
      } else {
        console.log(`  ✅ ${rule.key} — set (validated)`);
      }
    } else if (!rule.required && !isSet) {
      console.log(`  ⚠️  ${rule.key} — not set (optional) — ${rule.description}`);
      warnings++;
    } else {
      console.log(`  ✅ ${rule.key} — set`);
    }
  }

  // Production-only checks
  if (nodeEnv === 'production') {
    const jwtSecret = allVars['JWT_SECRET'] || '';
    if (jwtSecret === 'change-me-in-production' || jwtSecret === 'secret' || jwtSecret.length < 64) {
      console.log(`  ❌ JWT_SECRET — Too weak for production (use a 64+ char random secret)`);
      hasErrors = true;
    }
    const dbUrl = allVars['DATABASE_URL'] || '';
    if (dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1')) {
      console.log(`  ⚠️  DATABASE_URL — Points to localhost in production`);
      warnings++;
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
