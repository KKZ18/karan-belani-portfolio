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
        label: 'Homepage',
        name: 'global',
        path: 'content/global',
        format: 'json',
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: 'object',
            name: 'hero',
            label: 'Hero Section',
            fields: [
              { type: 'string', name: 'eyebrow',   label: 'Eyebrow Label' },
              { type: 'string', name: 'tagline1',  label: 'Tagline — Line 1' },
              { type: 'string', name: 'tagline2',  label: 'Tagline — Line 2 (accent colour)' },
              { type: 'string', name: 'cta1Label', label: 'Primary Button Label' },
              { type: 'string', name: 'cta1Href',  label: 'Primary Button URL' },
              { type: 'string', name: 'cta2Label', label: 'Secondary Button Label' },
              { type: 'string', name: 'cta2Href',  label: 'Secondary Button URL' },
            ],
          },
          {
            type: 'object',
            name: 'about',
            label: 'About Section',
            fields: [
              { type: 'string', name: 'headingLine1', label: 'Heading — Line 1' },
              { type: 'string', name: 'headingLine2', label: 'Heading — Line 2' },
              { type: 'string', name: 'bio', label: 'Bio Paragraph', ui: { component: 'textarea' } },
              {
                type: 'object',
                name: 'stats',
                label: 'Stats',
                list: true,
                ui: { itemProps: (item: any) => ({ label: `${item?.value} — ${item?.label}` }) },
                fields: [
                  { type: 'string', name: 'value', label: 'Value (e.g. 2+)' },
                  { type: 'string', name: 'label', label: 'Label (e.g. Years experience)' },
                ],
              },
              {
                type: 'object',
                name: 'socials',
                label: 'Social Links',
                list: true,
                ui: { itemProps: (item: any) => ({ label: item?.name }) },
                fields: [
                  { type: 'string', name: 'name',   label: 'Platform' },
                  { type: 'string', name: 'handle', label: 'Handle / Username' },
                  { type: 'string', name: 'url',    label: 'URL' },
                ],
              },
              { type: 'string', name: 'resumeUrl', label: 'Resume URL' },
            ],
          },
          {
            type: 'object',
            name: 'certifications',
            label: 'Certifications Section',
            fields: [
              {
                type: 'object',
                name: 'items',
                label: 'Certificates',
                list: true,
                ui: { itemProps: (item: any) => ({ label: `${item?.name ?? 'Certificate'} — ${item?.issuer ?? ''}` }) },
                fields: [
                  { type: 'string', name: 'name',      label: 'Short Name (e.g. CCNA)' },
                  { type: 'string', name: 'fullName',  label: 'Full Name' },
                  { type: 'string', name: 'issuer',    label: 'Issuer (e.g. Cisco)' },
                  { type: 'string', name: 'year',      label: 'Year Obtained' },
                  { type: 'image',  name: 'image',     label: 'Logo Image' },
                  { type: 'string', name: 'credlyUrl', label: 'Credly Badge URL' },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'contact',
            label: 'Contact Section',
            fields: [
              { type: 'string', name: 'heading',      label: 'Heading' },
              { type: 'string', name: 'intro',        label: 'Intro Text', ui: { component: 'textarea' } },
              { type: 'string', name: 'responseTime', label: 'Response Time Note' },
            ],
          },
        ],
      },
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
