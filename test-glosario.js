
const API_URL = 'https://cardenasnicolas.com/wp-json/wp/v2';

async function getGlossary() {
    console.log('Fetching glossary from:', `${API_URL}/glosario?_embed&per_page=1`);
    try {
        const res = await fetch(`${API_URL}/glosario?_embed&per_page=1`);
        if (!res.ok) throw new Error(`Failed to fetch glossary: ${res.status}`);
        const items = await res.json();

        if (items.length > 0) {
            const item = items[0];
            console.log('Title:', item.title.rendered);
            console.log('Content Raw:', JSON.stringify(item.content));
            console.log('Excerpt Raw:', JSON.stringify(item.excerpt));
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

getGlossary();
