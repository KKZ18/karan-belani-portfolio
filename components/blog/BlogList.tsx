'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

export type BlogPost = {
  id: string;
  title: string;
  category: string;
  publishedAt?: string | null;
  readTime?: string | null;
  description?: string | null;
  _sys: { filename: string };
};

export type BlogCategory = {
  id: string;
  name: string;
  _sys: { filename: string };
};

type Props = {
  posts: BlogPost[];
  categories: BlogCategory[];
};

function Arrow({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 7h10M8 3l4 4-4 4" />
    </svg>
  );
}

const SLUG_TO_TAG: Record<string, string> = {
  'routing-switching': 'tag-routing',
  'network-security': 'tag-security',
  labs: 'tag-labs',
};

function tagClass(slug: string): string {
  return SLUG_TO_TAG[slug] ?? 'tag-routing';
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function Tag({ category, label }: { category: string; label: string }) {
  return <span className={`blog-tag ${tagClass(category)}`}>{label}</span>;
}

export default function BlogList({ posts, categories }: Props) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts.filter(p => {
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        (p.description?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [posts, search, activeCategory]);

  const categoryLabel = (slug: string): string => {
    const cat = categories.find(c => c._sys.filename === slug);
    return cat?.name ?? slug;
  };

  const noPostsAtAll = posts.length === 0;
  const noResults = !noPostsAtAll && filtered.length === 0;

  return (
    <div>
      <div className="blogs-controls">
        <div className="blogs-search-wrap">
          <svg className="blogs-search-icon" width={15} height={15} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="6.5" cy="6.5" r="5" />
            <path d="M10.5 10.5l3.5 3.5" />
          </svg>
          <input
            className="blogs-search"
            type="search"
            placeholder="Search articles…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-bar" style={{ marginTop: 0, marginBottom: 0 }}>
          <button
            className={`filter-pill${activeCategory === 'all' ? ' active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`filter-pill${activeCategory === cat._sys.filename ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat._sys.filename)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {noPostsAtAll ? (
        <div className="blogs-empty">No posts yet. Check back soon.</div>
      ) : noResults ? (
        <div className="blogs-empty">No posts match your search.</div>
      ) : (
        <div className="blogs-list">
          {filtered.map(p => (
            <Link key={p.id} href={`/blogs/${p._sys.filename}`} className="blogs-post-card">
              <div className="blogs-post-top">
                <Tag category={p.category} label={categoryLabel(p.category)} />
                <div className="blog-meta">
                  {p.publishedAt && <span>{formatDate(p.publishedAt)}</span>}
                  {p.publishedAt && p.readTime && <span>·</span>}
                  {p.readTime && <span>{p.readTime}</span>}
                </div>
              </div>
              <div className="blog-title blogs-post-title">{p.title}</div>
              {p.description && <div className="blog-desc">{p.description}</div>}
              <div className="blogs-post-read">
                Read <Arrow size={11} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
