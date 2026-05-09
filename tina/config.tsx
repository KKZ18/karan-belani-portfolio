import { defineConfig } from "tinacms";
import nextConfig from '../next.config'

const config = defineConfig({
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID!,
  branch:
    process.env.NEXT_PUBLIC_TINA_BRANCH! || // custom branch env override
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF! || // Vercel branch env
    process.env.HEAD!, // Netlify branch env
  token: process.env.TINA_TOKEN!,
  media: {
    // If you wanted cloudinary do this
    // loadCustomStore: async () => {
    //   const pack = await import("next-tinacms-cloudinary");
    //   return pack.TinaCloudCloudinaryMediaStore;
    // },
    // this is the config for the tina cloud media store
    tina: {
      publicFolder: "public",
      mediaRoot: "uploads",
    },
  },
  build: {
    publicFolder: "public", // The public asset folder for your framework
    outputFolder: "admin", // within the public folder
    basePath: nextConfig.basePath?.replace(/^\//, '') || '', // The base path of the app (could be /blog)
  },
  schema: {
    collections: [
      {
        label: 'Categories',
        name: 'category',
        path: 'content/categories',
        format: 'json',
        fields: [
          {
            type: 'string',
            name: 'name',
            label: 'Category Name',
            required: true,
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
          },
        ],
      },
      {
        label: 'Posts',
        name: 'post',
        path: 'content/posts',
        format: 'mdx',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'category',
            label: 'Category Slug',
            required: true,
          },
          {
            type: 'datetime',
            name: 'publishedAt',
            label: 'Published At',
          },
          {
            type: 'string',
            name: 'readTime',
            label: 'Read Time',
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
            ui: {
              component: 'textarea',
            },
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Content',
            isBody: true,
          },
        ],
      },
    ],
  },
});

export default config;
