/**
 * Exponential backoff retry utility for external HTTP calls.
 *
 * Usage:
 *   const result = await withRetry(() => fetch(...), { attempts: 3, baseDelayMs: 200 });
 */

export interface RetryOptions {
  /** Total number of attempts including the first try (default: 3) */
  attempts?: number;
  /** Base delay in ms — doubles each attempt (default: 200) */
  baseDelayMs?: number;
  /** Maximum delay cap in ms (default: 5000) */
  maxDelayMs?: number;
  /** Predicate to decide whether the thrown error is retryable (default: always retry) */
  isRetryable?: (err: unknown) => boolean;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const { attempts = 3, baseDelayMs = 200, maxDelayMs = 5000, isRetryable = () => true } = options;

  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === attempts || !isRetryable(err)) {
        break;
      }
      const delay = Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs);
      // Add ±10% jitter to spread burst retries
      const jitter = delay * 0.1 * (Math.random() * 2 - 1);
      await sleep(Math.round(delay + jitter));
    }
  }
  throw lastError;
}

/**
 * Wraps fetch with a timeout. Throws if the response does not arrive within
 * the given number of milliseconds.
 */
export async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  timeoutMs = 10_000,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}
