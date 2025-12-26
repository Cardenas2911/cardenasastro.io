
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const API_URL = 'https://cardenasnicolas.com/wp-json/wp/v2';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');

// Ensure directories exist
const IMG_DIR = path.join(PROJECT_ROOT, 'public', 'images', 'glosario');
const GLOSARIO_DIR = path.join(PROJECT_ROOT, 'src', 'content', 'glosario');

[IMG_DIR, GLOSARIO_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Helper: Escape string for YAML frontmatter
function escapeYaml(str) {
    if (str === null || str === undefined) return '""';
    return JSON.stringify(String(str));
}

function normalizeDate(dateStr) {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

// --- FETCHER ---
async function fetchAll(endpoint) {
    let page = 1;
    let results = [];
    while (true) {
        console.log(`Fetching ${endpoint} page ${page}...`);
        const res = await fetch(`${API_URL}/${endpoint}?_embed&per_page=100&page=${page}`);
        if (!res.ok) {
            if (res.status === 400 && page > 1) break; // End of pagination
            throw new Error(`Failed to fetch ${endpoint}: ${res.statusText}`);
        }
        const data = await res.json();
        if (data.length === 0) break;
        results = results.concat(data);
        if (data.length < 100) break; // Last page
        page++;
    }
    return results;
}

// --- PROCESS GLOSARIO ---
async function processGlosario() {
    console.log('Processing Glosario (Glossary)...');
    try {
        const terms = await fetchAll('glosario');
        console.log(`Found ${terms.length} terms.`);

        for (const term of terms) {
            // Yoast SEO Data
            const yoast = term.yoast_head_json || {};
            const acf = term.acf || {};

            // Handle Arrays/Values safely
            const relacionados = Array.isArray(acf.relacionados) ? acf.relacionados : [];
            const sinonimos = acf.sinonimos || '';
            const acronimo = acf.acronimo || '';
            const definicion = acf.definicion || '';

            const frontmatter = [
                `---`,
                `title: ${escapeYaml(term.title?.rendered)}`,
                `description: ${escapeYaml(yoast.description || term.excerpt?.rendered?.replace(/<[^>]+>/g, '') || '')}`,
                `pubDate: ${normalizeDate(term.date)}`,
                `updatedDate: ${normalizeDate(term.modified)}`,
                `definicion: ${escapeYaml(definicion)}`, // Keep in frontmatter too if needed for meta
                `acronimo: ${escapeYaml(acronimo)}`,
                `sinonimos: ${escapeYaml(sinonimos)}`,
                relacionados.length ? `relacionados: [${relacionados.join(', ')}]` : '',
                `---`
            ].filter(l => l !== '').join('\n');

            // Use 'definicion' as the main content if 'content.rendered' is empty
            // But prefer content.rendered if it exists (fallback to definition)
            let content = term.content?.rendered || '';
            if (!content.trim() && definicion) {
                content = definicion;
            }

            const filePath = path.join(GLOSARIO_DIR, `${term.slug}.mdx`);
            fs.writeFileSync(filePath, `${frontmatter}\n\n${content}`);
            console.log(`Saved Term: ${term.slug}`);
        }
    } catch (error) {
        console.error('Error processing glosario:', error);
    }
}

// MAIN
(async () => {
    try {
        await processGlosario();
        console.log('--- MIGRATION COMPLETE ---');
    } catch (e) {
        console.error('Migration failed:', e);
    }
})();
