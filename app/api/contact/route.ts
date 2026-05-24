import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

const TO   = 'karanbelani18@gmail.com';
const FROM = process.env.RESEND_FROM ?? 'Contact Form <onboarding@resend.dev>';

// In-memory rate limit: max 3 submissions per IP per hour.
// Per-instance only (fine for a contact form — stops rapid-fire abuse, not distributed attacks).
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT   = 3;
const WINDOW_MS    = 60 * 60 * 1000;

const MAX_NAME    = 100;
const MAX_EMAIL   = 254; // RFC 5321 max
const MAX_MESSAGE = 5000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

function checkRateLimit(ip: string): boolean {
  const now  = Date.now();
  const slot = rateLimitMap.get(ip);

  if (!slot || now > slot.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (slot.count >= RATE_LIMIT) return false;
  slot.count++;
  return true;
}

function escHtml(s: string) {
  return s
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#039;');
}

function stripNewlines(s: string) {
  return s.replace(/[\r\n]+/g, ' ');
}

export async function POST(req: Request) {
  const ip = getIp(req);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a while before trying again.' },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { name, email, message } = body as Record<string, unknown>;

  if (typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 422 });
  }
  if (name.trim().length > MAX_NAME) {
    return NextResponse.json({ error: `Name must be ${MAX_NAME} characters or fewer` }, { status: 422 });
  }

  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 422 });
  }
  if (email.trim().length > MAX_EMAIL) {
    return NextResponse.json({ error: 'Email address is too long' }, { status: 422 });
  }

  if (typeof message !== 'string' || !message.trim()) {
    return NextResponse.json({ error: 'Message is required' }, { status: 422 });
  }
  if (message.trim().length > MAX_MESSAGE) {
    return NextResponse.json({ error: `Message must be ${MAX_MESSAGE} characters or fewer` }, { status: 422 });
  }

  const safeName    = stripNewlines(name.trim());
  const safeEmail   = email.trim();
  const safeMessage = message.trim();

  const { error } = await resend.emails.send({
    from:    FROM,
    to:      TO,
    replyTo: [safeEmail],
    subject: `Portfolio contact from ${safeName}`,
    html: `
      <p><strong>Name:</strong> ${escHtml(safeName)}</p>
      <p><strong>Email:</strong> ${escHtml(safeEmail)}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap">${escHtml(safeMessage)}</p>
    `,
  });

  if (error) {
    console.error('Resend error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
