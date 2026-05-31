import { NextResponse } from 'next/server';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://karanbelani.com';
const isDev = process.env.NODE_ENV === 'development';

// Vercel deploy hook URLs always start with this prefix.
// Validating it prevents SSRF if VERCEL_DEPLOY_HOOK_URL is ever misconfigured.
const VERCEL_HOOK_PREFIX = 'https://api.vercel.com/v1/integrations/deploy/';

// Global rate limit: max 5 deploys per hour per serverless instance.
// Note: Vercel may run multiple instances; this is per-instance, not truly global.
const RATE_LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;
let deployCount = 0;
let windowEnd = Date.now() + WINDOW_MS;

function checkRateLimit(): boolean {
  const now = Date.now();
  if (now > windowEnd) {
    deployCount = 0;
    windowEnd = now + WINDOW_MS;
  }
  if (deployCount >= RATE_LIMIT) return false;
  deployCount++;
  return true;
}

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (origin === SITE_URL) return true;
  if (isDev && /^https?:\/\/localhost(:\d+)?$/.test(origin)) return true;
  return false;
}

export async function POST(req: Request) {
  // Origin check: stops naive cross-site browser requests.
  // Not a hard trust boundary — curl can spoof this header.
  const origin = req.headers.get('origin');
  if (!isAllowedOrigin(origin)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!checkRateLimit()) {
    return NextResponse.json(
      { error: 'Too many deploy requests. Try again later.' },
      { status: 429 },
    );
  }

  const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;

  // Validate before fetching to prevent SSRF.
  if (!hookUrl || !hookUrl.startsWith(VERCEL_HOOK_PREFIX)) {
    return NextResponse.json({ error: 'Deploy hook not configured' }, { status: 500 });
  }

  try {
    const res = await fetch(hookUrl, { method: 'POST' });
    if (!res.ok) {
      // Return a generic message — don't leak the upstream status code.
      return NextResponse.json({ error: 'Deploy hook failed' }, { status: 502 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Network error reaching deploy hook' }, { status: 500 });
  }
}
