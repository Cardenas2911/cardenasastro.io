
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '../src/assets/images/brand');

const images = [
    {
        file: 'logo-nicolas-cardenas.png',
        output: 'logo-nicolas-cardenas.webp',
        meta: {
            title: 'Logo Nicolás Cárdenas',
            description: 'Logo oficial de Nicolás Cárdenas - Consultor SEO y Desarrollador Web',
            author: 'Nicolás Cárdenas',
            copyright: '© 2025 Nicolás Cárdenas',
        }
    },
    {
        file: 'nicolas-cardenas-profile.png',
        output: 'nicolas-cardenas-profile.webp',
        meta: {
            title: 'Foto de Perfil Nicolás Cárdenas',
            description: 'Retrato de Nicolás Cárdenas, Especialista en SEO y Estrategia Digital',
            author: 'Nicolás Cárdenas',
            copyright: '© 2025 Nicolás Cárdenas',
        }
    }
];

async function processImages() {
    console.log('Starting image optimization...');

    for (const img of images) {
        const inputPath = path.join(srcDir, img.file);
        const outputPath = path.join(srcDir, img.output);

        if (!fs.existsSync(inputPath)) {
            console.error(`Error: File not found ${inputPath}`);
            continue;
        }

        try {
            await sharp(inputPath)
                .webp({ quality: 90, metadata: 'all' }) // 'all' preserves existing, but we want to ADD
                .withMetadata({
                    exif: {
                        IFD0: {
                            Copyright: img.meta.copyright,
                            ImageDescription: img.meta.description,
                            Artist: img.meta.author,
                            XPTitle: img.meta.title, // Windows-specific title
                            XPAuthor: img.meta.author,
                        }
                    }
                })
                .toFile(outputPath);

            console.log(`✅ Converted: ${img.file} -> ${img.output}`);

            // Optional: delete original PNG if successful? No, keep for now.
        } catch (error) {
            console.error(`❌ Error processing ${img.file}:`, error);
        }
    }

    console.log('Done.');
}

processImages();
