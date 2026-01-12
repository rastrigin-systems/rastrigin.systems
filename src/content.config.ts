import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    subtitle: z.string().optional(),
    excerpt: z.string(),
    draft: z.boolean().optional(),
  }),
});

export const collections = { blog };
