import { defineCollection, z } from 'astro:content';
import { getPosts, getCertificates } from '../lib/wp';

const blog = defineCollection({
    loader: async () => {
        const posts = await getPosts();
        return posts.map(post => ({
            ...post,
            id: post.slug, // Use slug as ID for cleaner URLs
        }));
    },
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        heroImage: z.string().optional(),
        tags: z.array(z.string()).optional(),
        category: z.string().optional(),
        content: z.string().optional(),
    }),
});

const certificados = defineCollection({
    loader: async () => {
        const certificates = await getCertificates();
        return certificates.map(cert => ({
            ...cert,
            id: cert.slug,
        }));
    },
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        heroImage: z.string().optional(),
        content: z.string().optional(),
        // New fields
        certificateUrl: z.string().optional(),
        customH1: z.string().optional(),
        shortDescription: z.string().optional(),
        durationHours: z.string().optional(),
        issuedBy: z.string().optional(),
        issueDate: z.string().optional(),
        practiceSummary: z.string().optional(),
        practiceBullets: z.array(z.string()).optional(),
        keyTakeaways: z.array(z.string()).optional(),
        // Taxonomies
        certificateCategories: z.array(z.string()).optional(),
        certificateTags: z.array(z.string()).optional(),
    }),
});

export const collections = { blog, certificados };
