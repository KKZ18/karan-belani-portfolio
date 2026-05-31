'use client';

export default function AdminPage() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <iframe
        src="/admin/index.html"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Tina CMS"
      />
    </div>
  );
}
