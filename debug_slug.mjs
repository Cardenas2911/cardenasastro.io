
import fs from 'fs';

async function checkSlug() {
    const slug = 'curso-de-fundamentos-de-ingenieria-de-software';
    console.log(`Checking slug: ${slug}`);
    const res = await fetch(`https://cardenasnicolas.com/wp-json/wp/v2/certificados?slug=${slug}&_embed`);
    const data = await res.json();

    if (data.length === 0) {
        console.log('Certificate not found by slug.');
    } else {
        const cert = data[0];
        console.log('Certificate found:', cert.title.rendered);
        fs.writeFileSync('slug_debug.json', JSON.stringify(cert.acf, null, 2));
        console.log('Saved to slug_debug.json');
    }
}

checkSlug();
