'use client';

import { TinaMarkdown } from 'tinacms/dist/rich-text';

export default function PostBody({ content }: { content: unknown }) {
  return (
    <div className="post-body prose prose-invert max-w-none">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <TinaMarkdown content={content as any} />
    </div>
  );
}
