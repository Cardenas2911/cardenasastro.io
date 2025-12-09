
import fs from 'fs';

async function checkApi() {
    try {
        const res = await fetch('https://cardenasnicolas.com/wp-json/wp/v2/certificados?_embed&per_page=1');
        const data = await res.json();
        if (data.length > 0) {
            const item = data[0];
            console.log('Top level keys:', Object.keys(item));
            if ('acf' in item) {
                console.log('ACF found. Type:', typeof item.acf);
                console.log('ACF content:', JSON.stringify(item.acf, null, 2));
            } else {
                console.log('ACF key NOT found in item.');
            }
        } else {
            console.log('No certificates found.');
        }
    } catch (err) {
        console.error('Error fetching API:', err);
    }
}

checkApi();
