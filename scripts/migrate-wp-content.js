
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const API_URL = 'https://cardenasnicolas.com/wp-json/wp/v2';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');

// Ensure directories exist
const IMG_DIR = path.join(PROJECT_ROOT, 'public', 'images', 'migrated');
const CERT_DIR = path.join(PROJECT_ROOT, 'src', 'content', 'certificados');
const PORT_DIR = path.join(PROJECT_ROOT, 'src', 'content', 'portafolio');

[IMG_DIR, CERT_DIR, PORT_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Helper to download image
async function downloadImage(url) {
    if (!url) return undefined;

    try {
        const filename = path.basename(new URL(url).pathname);
        const filepath = path.join(IMG_DIR, filename);
        const relativePath = `/images/migrated/${filename}`;

        if (fs.existsSync(filepath)) return relativePath; // Skip if exists

        return new Promise((resolve, reject) => {
            const file = fs.createWriteStream(filepath);
            https.get(url, response => {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    console.log(`Downloaded: ${filename}`);
                    resolve(relativePath);
                });
            }).on('error', err => {
                fs.unlink(filepath, () => { }); // Delete partial
                console.error(`Error downloading ${url}:`, err.message);
                resolve(null); // Return null but don't fail entire process
            });
        });
    } catch (e) {
        console.error(`Invalid URL ${url}:`, e.message);
        return undefined;
    }
}

// Helper: Escape string for YAML frontmatter
function escapeYaml(str) {
    if (!str) return '';
    // If it contains newlines or special chars, wrap in quotes
    if (str.includes('\n') || str.includes(':') || str.includes('#')) {
        return `"${str.replace(/"/g, '\\"')}"`;
    }
    return str;
}

function normalizeDate(dateStr) {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

// --- FETCHER ---
async function fetchAll(endpoint) {
    const res = await fetch(`${API_URL}/${endpoint}?_embed&per_page=100`);
    if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
    return await res.json();
}

// --- PROCESS CERTIFICATES ---
async function processCertificates() {
    console.log('Processing Certificates...');
    const certs = await fetchAll('certificados');

    for (const cert of certs) {
        const acf = (cert.acf && !Array.isArray(cert.acf)) ? cert.acf : {};
        const heroUrl = cert._embedded?.['wp:featuredmedia']?.[0]?.source_url;
        const heroLocal = await downloadImage(heroUrl);

        // Taxonomies
        const categories = cert._embedded?.['wp:term']?.flat()
            .filter(t => t.taxonomy === 'categorias-de-los-certificados')
            .map(t => t.name) || [];
        const tags = cert._embedded?.['wp:term']?.flat()
            .filter(t => t.taxonomy === 'etiqueta-de-certificado')
            .map(t => t.name) || [];

        // Safe helpers
        const getString = (val) => typeof val === 'string' || typeof val === 'number' ? String(val) : '';
        const getUrl = (val) => (typeof val === 'object' && val?.url) ? val.url : (typeof val === 'string' ? val : '');

        const bulletsKey = [
            getString(acf['bullets_#1']), getString(acf['bullets_#2']), getString(acf['bullets_#3'])
        ].filter(Boolean);

        const bulletsPrac = [
            getString(acf['bullets_practica_#1']), getString(acf['bullets_practica_#2']), getString(acf['bullets_practica_#3'])
        ].filter(Boolean);

        const frontmatter = [
            `---`,
            `title: ${escapeYaml(cert.title?.rendered)}`,
            `description: ${escapeYaml(cert.excerpt?.rendered?.replace(/<[^>]+>/g, '') || '')}`,
            `pubDate: ${normalizeDate(cert.date)}`,
            heroLocal ? `heroImage: "${heroLocal}"` : '',
            `certificateUrl: "${getUrl(acf.enlace_al_certificado_online)}"`,
            `customH1: ${escapeYaml(getString(acf.h1_del_certificado))}`,
            `shortDescription: ${escapeYaml(getString(acf.descripcion_corta_del_certificado))}`,
            `durationHours: "${getString(acf.cantidad_de_horas)}"`,
            `issuedBy: "${getString(acf.emitido_por)}"`,
            `issueDate: "${getString(acf.fecha_de_emision)}"`,
            `practiceSummary: ${escapeYaml(getString(acf.como_puse_en_practica_lo_aprendido))}`,
            bulletsPrac.length ? `practiceBullets:\n${bulletsPrac.map(b => `  - ${escapeYaml(b)}`).join('\n')}` : '',
            bulletsKey.length ? `keyTakeaways:\n${bulletsKey.map(b => `  - ${escapeYaml(b)}`).join('\n')}` : '',
            categories.length ? `certificateCategories:\n${categories.map(c => `  - "${c}"`).join('\n')}` : '',
            tags.length ? `certificateTags:\n${tags.map(t => `  - "${t}"`).join('\n')}` : '',
            `---`
        ].filter(l => l !== '').join('\n');

        const content = cert.content?.rendered || '';
        const filePath = path.join(CERT_DIR, `${cert.slug}.mdx`);
        fs.writeFileSync(filePath, `${frontmatter}\n\n${content}`);
        console.log(`Saved Cert: ${cert.slug}`);
    }
}

// --- PROCESS PORTFOLIO ---
async function processPortfolios() {
    console.log('Processing Portfolios...');
    const items = await fetchAll('portafolio');

    for (const item of items) {
        const acf = (item.acf && !Array.isArray(item.acf)) ? item.acf : {};
        const heroUrl = item._embedded?.['wp:featuredmedia']?.[0]?.source_url;
        const heroLocal = await downloadImage(heroUrl);

        // Taxonomies
        const categories = item._embedded?.['wp:term']?.flat()
            .filter(t => t.taxonomy === 'cateogorias-de-portafolio')
            .map(t => t.name) || [];
        const tags = item._embedded?.['wp:term']?.flat()
            .filter(t => t.taxonomy === 'etiqueta-de-proyecto')
            .map(t => t.name) || [];

        const getString = (val) => typeof val === 'string' || typeof val === 'number' ? String(val) : '';
        const getAcfImg = async (field) => {
            const url = (typeof field === 'object' && field?.url) ? field.url : (typeof field === 'string' ? field : '');
            return await downloadImage(url);
        };

        const projectLogo = await getAcfImg(acf.logo_del_proyecto);

        const gallery = [];
        for (let i = 1; i <= 5; i++) {
            const img = await getAcfImg(acf[`imagen_#${i}`]);
            if (img) gallery.push(img);
        }

        const frontmatter = [
            `---`,
            `title: ${escapeYaml(item.title?.rendered)}`,
            `description: ${escapeYaml(item.excerpt?.rendered?.replace(/<[^>]+>/g, '') || '')}`,
            `pubDate: ${normalizeDate(item.date)}`,
            heroLocal ? `heroImage: "${heroLocal}"` : '',
            `projectLink: "${getString(acf.link_del_proyecto)}"`,
            `projectDate: "${getString(acf.fecha_del_trabajo)}"`,
            projectLogo ? `projectLogo: "${projectLogo}"` : '',
            `customH1: ${escapeYaml(getString(acf.titulo_h1))}`,
            `projectDescription: ${escapeYaml(getString(acf.descripcion_del_proyecto))}`,
            `challengeHeading: ${escapeYaml(getString(acf.h3_de_desafio))}`,
            `challengeText: ${escapeYaml(getString(acf.el_desafio))}`,
            `solutionHeading: ${escapeYaml(getString(acf.h3_de_la_solucion))}`,
            `solutionText: ${escapeYaml(getString(acf.la_solucion))}`,
            `resultsHeading: ${escapeYaml(getString(acf.h3_de_los_resultados))}`,
            `resultsText: ${escapeYaml(getString(acf.los_resultados))}`,
            gallery.length ? `galleryImages:\n${gallery.map(g => `  - "${g}"`).join('\n')}` : '',
            categories.length ? `portfolioCategories:\n${categories.map(c => `  - "${c}"`).join('\n')}` : '',
            tags.length ? `portfolioTags:\n${tags.map(t => `  - "${t}"`).join('\n')}` : '',
            `---`
        ].filter(l => l !== '').join('\n');

        const content = item.content?.rendered || getString(acf.contenido_principal) || '';
        const filePath = path.join(PORT_DIR, `${item.slug}.mdx`);
        fs.writeFileSync(filePath, `${frontmatter}\n\n${content}`);
        console.log(`Saved Portfolio: ${item.slug}`);
    }
}

// MAIN
(async () => {
    try {
        await processCertificates();
        await processPortfolios();
        console.log('--- MIGRATION COMPLETE ---');
    } catch (e) {
        console.error('Migration failed:', e);
    }
})();
