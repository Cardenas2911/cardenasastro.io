import { defineCollection, z } from 'astro:content';
import { getCertificates, getPortfolios } from '../lib/wp';

const blog = defineCollection({
    // Type 'content' is the default for local Markdown/MDX in src/content/blog
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        heroImage: z.string().optional(),
        tags: z.array(z.string()).optional(),
        category: z.string().optional(),
        // Content is automatically handled by Astro for local files
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

const portafolio = defineCollection({
    loader: async () => {
        const portfolios = await getPortfolios();
        return portfolios.map(item => ({
            ...item,
            id: item.slug,
        }));
    },
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        heroImage: z.string().optional(),
        content: z.string().optional(),
        // Custom Fields
        projectLink: z.string().optional(),
        projectDate: z.string().optional(),
        projectLogo: z.string().optional(),
        customH1: z.string().optional(),
        projectDescription: z.string().optional(),
        challengeHeading: z.string().optional(),
        challengeText: z.string().optional(),
        solutionHeading: z.string().optional(),
        solutionText: z.string().optional(),
        resultsHeading: z.string().optional(),
        resultsText: z.string().optional(),
        galleryImages: z.array(z.string()).optional(),
        // Taxonomies
        portfolioCategories: z.array(z.string()).optional(),
        portfolioTags: z.array(z.string()).optional(),
    }),
});

export const collections = { blog, certificados, portafolio };
