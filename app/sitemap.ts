import type { MetadataRoute } from 'next';
import { client } from '@/tina/__generated__/client';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://karanbelani.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL,              lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/blogs`,   lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
  ];

  try {
    const result = await client.queries.postListQuery();
    const postRoutes: MetadataRoute.Sitemap = (result.data?.postConnection?.edges ?? []).flatMap(e =>
      e?.node ? [{
        url: `${SITE_URL}/blogs/${e.node._sys.filename}`,
        lastModified: e.node.publishedAt ? new Date(e.node.publishedAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }] : []
    );
    return [...staticRoutes, ...postRoutes];
  } catch {
    return staticRoutes;
  }
}
