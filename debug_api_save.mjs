
import fs from 'fs';

async function checkApi() {
    const res = await fetch('https://cardenasnicolas.com/wp-json/wp/v2/certificados?_embed&per_page=1');
    const data = await res.json();
    fs.writeFileSync('api_response.json', JSON.stringify(data, null, 2));
    console.log('Saved to api_response.json');
}

checkApi();
