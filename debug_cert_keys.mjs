
import fs from 'fs';

async function checkApi() {
    const res = await fetch('https://cardenasnicolas.com/wp-json/wp/v2/certificados/27346420');
    const data = await res.json();
    console.log('ACF Keys:', Object.keys(data.acf));
    fs.writeFileSync('cert_debug.json', JSON.stringify(data.acf, null, 2));
}

checkApi();
