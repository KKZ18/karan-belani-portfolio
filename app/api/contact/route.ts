import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

const TO = 'karanbelani18@gmail.com';
const FROM = process.env.RESEND_FROM ?? 'Contact Form <onboarding@resend.dev>';

export async function POST(req: Request) {
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
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof email !== 'string' || !emailRegex.test(email.trim())) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 422 });
  }
  if (typeof message !== 'string' || !message.trim()) {
    return NextResponse.json({ error: 'Message is required' }, { status: 422 });
  }

  const { error } = await resend.emails.send({
    from: FROM,
    to: TO,
    replyTo: [email.trim()],
    subject: `Portfolio contact from ${name.trim()}`,
    html: `
      <p><strong>Name:</strong> ${escHtml(name.trim())}</p>
      <p><strong>Email:</strong> ${escHtml(email.trim())}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap">${escHtml(message.trim())}</p>
    `,
  });

  if (error) {
    console.error('Resend error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

function escHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
