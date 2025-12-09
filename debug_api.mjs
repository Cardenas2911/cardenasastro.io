
import fs from 'fs';

async function checkApi() {
    const res = await fetch('https://cardenasnicolas.com/wp-json/wp/v2/certificados?_embed&per_page=1');
    const data = await res.json();
    if (data.length > 0) {
        const item = data[0];
        console.log('Keys:', Object.keys(item));
        if (item.acf) {
            console.log('ACF Keys:', Object.keys(item.acf));
            console.log('ACF Content:', JSON.stringify(item.acf, null, 2));
        } else {
            console.log('No ACF field found');
        }
    } else {
        console.log('No certificates found');
    }
}

checkApi();
