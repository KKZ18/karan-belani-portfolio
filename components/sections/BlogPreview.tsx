import Link from 'next/link';

export type PostNode = {
  id: string;
  title: string;
  category: string;
  publishedAt?: string | null;
  readTime?: string | null;
  description?: string | null;
  _sys: { filename: string };
};

type Props = { posts: PostNode[] };

function Arrow({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 7h10M8 3l4 4-4 4" />
    </svg>
  );
}

function categoryLabel(slug: string): string {
  const map: Record<string, string> = {
    'routing-switching': 'Routing & Switching',
    'network-security': 'Network Security',
    labs: 'Labs',
  };
  return map[slug] ?? slug;
}

function tagClass(slug: string): string {
  const map: Record<string, string> = {
    'routing-switching': 'tag-routing',
    'network-security': 'tag-security',
    labs: 'tag-labs',
  };
  return map[slug] ?? 'tag-routing';
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function Tag({ category }: { category: string }) {
  return (
    <span className={`blog-tag ${tagClass(category)}`}>
      {categoryLabel(category)}
    </span>
  );
}

export default function BlogPreview({ posts }: Props) {
  return (
    <section id="blog">
      <div className="section">
        <div className="blog-header">
          <div>
            <div className="section-label">Writing</div>
            <h2 className="section-heading">
              Notes from<br />the Network.
            </h2>
          </div>
          <Link href="/blogs" className="view-all">
            View all articles <Arrow size={12} />
          </Link>
        </div>

        {posts.length === 0 ? (
          <div style={{
            padding: '48px', textAlign: 'center',
            color: 'var(--ink-3)', fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem', border: '1px solid var(--border)',
            borderRadius: 'var(--r)', marginTop: 40,
          }}>
            No posts yet
          </div>
        ) : (
          <div className="blog-featured">
            {posts.map(p => (
              <Link key={p.id} href={`/blogs/${p._sys.filename}`} className="blog-card">
                <Tag category={p.category} />
                <div className="blog-title">{p.title}</div>
                {p.description && <div className="blog-desc">{p.description}</div>}
                <div className="blog-meta">
                  {p.publishedAt && <span>{formatDate(p.publishedAt)}</span>}
                  {p.publishedAt && p.readTime && <span>·</span>}
                  {p.readTime && <span>{p.readTime}</span>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
