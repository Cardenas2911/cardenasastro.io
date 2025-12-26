
import fs from 'fs';

const API_URL = 'https://cardenasnicolas.com/wp-json/wp/v2';

async function debugGlossary() {
    console.log('Fetching 1 glossary term...');
    try {
        const res = await fetch(`${API_URL}/glosario?per_page=1&_embed`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const items = await res.json();

        if (items.length > 0) {
            const item = items[0];
            fs.writeFileSync('debug_output.json', JSON.stringify(item, null, 2));
            console.log('Saved to debug_output.json');
        } else {
            console.log('No items found.');
        }

    } catch (e) {
        console.error(e);
    }
}

debugGlossary();
