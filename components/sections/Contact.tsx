'use client';

import { useState } from 'react';

function Arrow({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 7h10M8 3l4 4-4 4" />
    </svg>
  );
}

const SOCIALS = [
  { name: 'LinkedIn', handle: 'Karan Belani' },
  { name: 'GitHub', handle: '@karanbelani' },
  { name: 'Twitter / X', handle: '@kbelani' },
] as const;

type FormFields = { name: string; email: string; message: string };

export default function Contact() {
  const [form, setForm] = useState<FormFields>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof FormFields, boolean>>>({});
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Partial<Record<keyof FormFields, boolean>> = {};
    if (!form.name.trim()) errs.name = true;
    if (!form.email.includes('@')) errs.email = true;
    if (!form.message.trim()) errs.message = true;
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSent(true);
  }

  return (
    <div style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)' }}>
      <section id="contact">
        <div className="section">
          <div className="section-label">Contact</div>
          <h2 className="section-heading">Say hello.</h2>
          <div className="contact-grid">
            <div>
              <p className="contact-intro">
                Have a question, want to collaborate, or just want to talk networking?
                I&apos;m always happy to connect with other engineers, hiring managers, or
                anyone curious about the field.
              </p>
              <p className="contact-sub">Typical response time: 2–3 business days.</p>
              <div style={{ marginTop: 40 }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: 'var(--ink-3)', marginBottom: 14,
                }}>
                  Also at
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {SOCIALS.map(s => (
                    <a key={s.name} href="#" className="about-link">
                      <div className="about-link-left">
                        <div className="about-link-dot" />
                        <div>
                          <div className="about-link-name">{s.name}</div>
                          <div className="about-link-handle">{s.handle}</div>
                        </div>
                      </div>
                      <svg width={12} height={12} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M2 7h10M8 3l4 4-4 4" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div>
              {sent ? (
                <div style={{
                  padding: 20, border: '1px solid var(--accent-d)',
                  background: 'var(--accent-l)', borderRadius: 'var(--r)',
                  fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
                  letterSpacing: '0.04em', color: 'var(--accent)', textAlign: 'center',
                }}>
                  Message received. I&apos;ll be in touch shortly — thank you.
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  {(
                    [
                      ['name', 'Name', 'Your name', 'text'],
                      ['email', 'Email', 'you@example.com', 'email'],
                    ] as [keyof FormFields, string, string, string][]
                  ).map(([id, label, ph, type]) => (
                    <div key={id} className="form-group">
                      <label className="form-label" htmlFor={id}>{label}</label>
                      <input
                        id={id}
                        type={type}
                        placeholder={ph}
                        className={`form-input${errors[id] ? ' form-error' : ''}`}
                        value={form[id]}
                        onChange={e => {
                          setForm(f => ({ ...f, [id]: e.target.value }));
                          setErrors(er => ({ ...er, [id]: false }));
                        }}
                      />
                    </div>
                  ))}
                  <div className="form-group">
                    <label className="form-label" htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      placeholder="What's on your mind?"
                      className={`form-textarea${errors.message ? ' form-error' : ''}`}
                      value={form.message}
                      onChange={e => {
                        setForm(f => ({ ...f, message: e.target.value }));
                        setErrors(er => ({ ...er, message: false }));
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Send Message <Arrow size={13} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
