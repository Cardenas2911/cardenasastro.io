import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONTENT_ROOT = path.join(__dirname, '..', 'src', 'content');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

async function createBlog() {
    console.log("\n📝 Creating BLOG Post");
    const title = await question("Title: ");
    const slug = slugify(title);
    const description = await question("Description (140-160 chars): ");
    const category = await question("Category: ");
    const tagsInput = await question("Tags (comma separated): ");

    console.log("Layout Options: [1] Standard (Text), [2] Full Width (Interactive)");
    const layout = await question("Choice (default 1): ");
    const isFullWidth = layout === '2';

    const frontmatter = `---
title: "${title}"
description: "${description}"
pubDate: ${new Date().toISOString().split('T')[0]}
tags: [${tagsInput.split(',').map(t => `"${t.trim()}"`).join(', ')}]
category: "${category}"
heroImage: "/blog-placeholder-1.jpg"
fullWidth: ${isFullWidth}
hideTitle: ${isFullWidth}
---

${isFullWidth
            ? "<div className=\"max-w-7xl mx-auto px-6\">\n  <!-- Full width content -->\n</div>"
            : "<!-- Your content here -->"}
`;
    return { slug, frontmatter, dir: 'blog', ext: 'mdx' };
}

async function createCertificate() {
    console.log("\n🎓 Creating CERTIFICATE");
    const title = await question("Certificate Name: ");
    const slug = slugify(title);
    const issuedBy = await question("Issued By (Platform/University): ");
    const issueDate = await question("Issue Date (YYYY-MM-DD): ");
    const certUrl = await question("Certificate URL (External): ");

    const frontmatter = `---
title: "${title}"
description: "Certificado obtenido en ${issuedBy}"
pubDate: ${new Date().toISOString().split('T')[0]}
heroImage: "/certificates/placeholder.jpg"
certificateUrl: "${certUrl}"
customH1: "${title}"
shortDescription: "Certificación en..."
durationHours: "10h"
issuedBy: "${issuedBy}"
issueDate: "${issueDate}"
practiceSummary: "Lo apliqué en..."
practiceBullets:
  - "Aprendizaje 1"
  - "Aprendizaje 2"
keyTakeaways:
  - "Concepto Clave 1"
  - "Concepto Clave 2"
certificateCategories:
  - "Marketing"
certificateTags:
  - "${issuedBy}"
---

<!-- Optional: Detailed review or notes -->
`;
    return { slug, frontmatter, dir: 'certificados', ext: 'mdx' };
}

async function createPortfolio() {
    console.log("\n💼 Creating PORTFOLIO Item");
    const title = await question("Project Title: ");
    const slug = slugify(title);
    const client = await question("Client Name / Project Type: ");
    const projectUrl = await question("Project URL: ");

    const frontmatter = `---
title: "${title}"
description: "Caso de éxito: ${client}"
pubDate: ${new Date().toISOString().split('T')[0]}
heroImage: "/portfolio/placeholder.jpg"
projectLink: "${projectUrl}"
projectDate: "2024"
projectLogo: "/portfolio/logo-placeholder.png"
customH1: "${title}"
projectDescription: "Descripción detallada del proyecto..."
challengeHeading: "El Desafío"
challengeText: "El cliente necesitaba..."
solutionHeading: "La Solución"
solutionText: "Implementamos..."
resultsHeading: "Resultados"
resultsText: "Logramos un incremento de..."
galleryImages:
  - "/portfolio/gallery-1.jpg"
  - "/portfolio/gallery-2.jpg"
portfolioCategories:
  - "Desarrollo Web"
  - "SEO"
portfolioTags:
  - "Astro"
  - "React"
---

## Detalles Técnicos

Descripción extendida del stack tecnológico y retos superados.
`;
    return { slug, frontmatter, dir: 'portafolio', ext: 'mdx' };
}

async function main() {
    console.log("🚀 CardenasNicolas Content Generator");
    console.log("1. Blog Post");
    console.log("2. Certificate");
    console.log("3. Portfolio Project");

    const type = await question("\nSelect content type [1-3]: ");

    let result;
    try {
        if (type === '1') result = await createBlog();
        else if (type === '2') result = await createCertificate();
        else if (type === '3') result = await createPortfolio();
        else {
            console.log("Invalid selection");
            process.exit(1);
        }

        const dirPath = path.join(CONTENT_ROOT, result.dir);
        if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

        const filePath = path.join(dirPath, `${result.slug}.${result.ext}`);

        if (fs.existsSync(filePath)) {
            console.log(`❌ File already exists: ${filePath}`);
        } else {
            fs.writeFileSync(filePath, result.frontmatter);
            console.log(`\n✅ Generated: src/content/${result.dir}/${result.slug}.${result.ext}`);
        }

    } catch (e) {
        console.error("Error:", e);
    } finally {
        rl.close();
    }
}

main();
