// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content';

// 2. Define your collection(s)
const postCollection = defineCollection({
  type: 'content',
  schema: z.object({
    draft: z.boolean().default(true),
    archived: z.boolean().default(false),
    title: z.string(),
    description: z.string().optional(),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }),
    publishedAt: z.coerce.date(),
    author: z.string().default('Sumanth'),
    category: z.string(),
    tags: z.array(z.string()),
  }),
});

const teamCollection = defineCollection({
  type: 'content',
  schema: z.object({
    draft: z.boolean(),
    name: z.string(),
    title: z.string(),
    avatar: z.object({
      src: z.string(),
      alt: z.string(),
    }),
    publishedAt: z.coerce.date(),
  }),
});

// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  posts: postCollection,
  team: teamCollection,
};
