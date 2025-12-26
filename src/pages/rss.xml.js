import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
    const posts = await getCollection('blog');
    return rss({
        title: 'Nicolas Cardenas - SEO y Marketing Digital',
        description: 'Estrategias de SEO, Desarrollo Web y Marketing Digital en Medellín.',
        site: context.site,
        items: posts.map((post) => ({
            title: post.data.title,
            pubDate: post.data.pubDate,
            description: post.data.description,
            link: `/blog/${post.slug.replace(/\.[^/.]+$/, "")}/`,
        })),
        customData: `<language>es-ES</language>`,
    });
}
