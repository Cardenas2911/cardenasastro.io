import rss from '@astrojs/rss';
import { getPosts } from '../lib/wp';

export async function GET(context) {
    const posts = await getPosts();
    return rss({
        title: 'Nicolas Cardenas - SEO y Marketing Digital',
        description: 'Estrategias de SEO, Desarrollo Web y Marketing Digital en Medellín.',
        site: context.site,
        items: posts.map((post) => ({
            title: post.title,
            pubDate: post.pubDate,
            description: post.description,
            link: `/blog/${post.slug}/`,
        })),
        customData: `<language>es-ES</language>`,
    });
}
