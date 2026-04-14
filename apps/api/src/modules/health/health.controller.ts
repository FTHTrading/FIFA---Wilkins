import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';
import { PrismaService } from '@/common/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@ApiTags('health')
@Controller('health')
export class HealthController {
  private redis: Redis | null = null;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    const host = this.config.get<string>('app.redis.host', 'localhost');
    const port = this.config.get<number>('app.redis.port', 6379);
    const password = this.config.get<string>('app.redis.password');
    this.redis = new Redis({ host, port, password, lazyConnect: true, maxRetriesPerRequest: 1 });
  }

  /** Shallow liveness probe — always fast */
  @ApiExcludeEndpoint()
  @Get('live')
  live() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  /** Deep readiness probe — checks all dependencies */
  @ApiExcludeEndpoint()
  @Get()
  async check() {
    const checks: Record<string, string> = {};

    // Database
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      checks.db = 'ok';
    } catch {
      checks.db = 'error';
    }

    // Redis
    try {
      if (this.redis) {
        await this.redis.ping();
        checks.redis = 'ok';
      } else {
        checks.redis = 'not_configured';
      }
    } catch {
      checks.redis = 'error';
    }

    const allOk = Object.values(checks).every((v) => v === 'ok' || v === 'not_configured');

    return {
      status: allOk ? 'ok' : 'degraded',
      checks,
      uptime: Math.floor(process.uptime()),
      version: process.env.npm_package_version ?? '0.1.0',
      env: process.env.NODE_ENV ?? 'development',
      timestamp: new Date().toISOString(),
    };
  }

  /** Prometheus-compatible metrics endpoint */
  @ApiExcludeEndpoint()
  @Get('metrics')
  @Header('Content-Type', 'text/plain; charset=utf-8')
  metrics() {
    const mem = process.memoryUsage();
    const uptime = process.uptime();
    const lines = [
      '# HELP process_uptime_seconds Process uptime in seconds',
      '# TYPE process_uptime_seconds gauge',
      `process_uptime_seconds ${uptime.toFixed(1)}`,
      '# HELP process_heap_bytes Process heap memory in bytes',
      '# TYPE process_heap_bytes gauge',
      `process_heap_bytes{type="used"} ${mem.heapUsed}`,
      `process_heap_bytes{type="total"} ${mem.heapTotal}`,
      '# HELP process_rss_bytes Process resident set size in bytes',
      '# TYPE process_rss_bytes gauge',
      `process_rss_bytes ${mem.rss}`,
      '# HELP process_external_bytes Process external memory in bytes',
      '# TYPE process_external_bytes gauge',
      `process_external_bytes ${mem.external}`,
    ];
    return lines.join('\n') + '\n';
  }
}
