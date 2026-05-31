import React, { useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface Props {
  close(): void;
}

export function PublishScreen({ close }: Props) {
  const [status, setStatus] = useState<Status>('idle');

  async function handlePublish() {
    setStatus('loading');
    try {
      const res = await fetch('/api/publish', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  }

  return (
    <div style={{ padding: '3rem 2.5rem', maxWidth: 520, fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#111' }}>
        Publish to Live
      </h2>
      <p style={{ marginBottom: '2rem', color: '#6b7280', lineHeight: 1.6, fontSize: '0.95rem' }}>
        Triggers a production deployment on Vercel. Your latest saved changes will be
        live within a couple of minutes.
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <button
          onClick={handlePublish}
          disabled={status === 'loading' || status === 'success'}
          style={{
            padding: '0.65rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: status === 'loading' || status === 'success' ? 'not-allowed' : 'pointer',
            fontSize: '0.95rem',
            fontWeight: 600,
            color: '#fff',
            opacity: status === 'loading' || status === 'success' ? 0.75 : 1,
            backgroundColor:
              status === 'error'   ? '#dc2626' :
              status === 'success' ? '#059669' :
              '#16a34a',
            transition: 'background-color 150ms',
          }}
        >
          {status === 'loading' ? 'Publishing…' :
           status === 'success' ? 'Deployment triggered ✓' :
           status === 'error'   ? 'Error — try again' :
           'Publish to Live'}
        </button>

        <button
          onClick={close}
          style={{
            padding: '0.65rem 1rem',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb',
            background: '#fff',
            cursor: 'pointer',
            fontSize: '0.9rem',
            color: '#374151',
          }}
        >
          Cancel
        </button>
      </div>

      {status === 'success' && (
        <p style={{ marginTop: '1.5rem', color: '#059669', fontSize: '0.875rem' }}>
          Vercel has queued a new build. Changes should be live in 1–2 minutes.
        </p>
      )}
      {status === 'error' && (
        <p style={{ marginTop: '1.5rem', color: '#dc2626', fontSize: '0.875rem' }}>
          Failed to trigger the deployment. Check your Vercel project settings or contact the site admin.
        </p>
      )}
    </div>
  );
}
