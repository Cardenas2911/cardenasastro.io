
const API_URL = 'https://cardenasnicolas.com/wp-json/wp/v2';

async function checkMultiple() {
    try {
        const res = await fetch(`${API_URL}/glosario?per_page=5&_embed`);
        const items = await res.json();
        console.log(`Checked ${items.length} items`);
        items.forEach(item => {
            console.log(`Slug: ${item.slug}`);
            console.log(`Has Content: ${!!item.content}`);
            console.log(`Content Keys: ${item.content ? Object.keys(item.content) : 'N/A'}`);
            console.log(`ACF: ${JSON.stringify(item.acf)}`);
            console.log('---');
        });
    } catch (e) {
        console.error(e);
    }
}
checkMultiple();
