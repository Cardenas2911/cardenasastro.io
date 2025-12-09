
import fs from 'fs';

async function checkTerms() {
    const res = await fetch('https://cardenasnicolas.com/wp-json/wp/v2/certificados?_embed&per_page=1');
    const data = await res.json();
    if (data.length > 0) {
        const cert = data[0];
        console.log('Top level keys:', Object.keys(cert));

        // Check specific taxonomy keys
        console.log('Category IDs:', cert['categorias-de-los-certificados']);
        console.log('Tag IDs:', cert['etiqueta-de-certificado']);

        // Check embedded terms
        if (cert._embedded && cert._embedded['wp:term']) {
            console.log('Embedded Terms found.');
            cert._embedded['wp:term'].forEach((termGroup, index) => {
                console.log(`Group ${index}:`, termGroup.map(t => `${t.taxonomy}: ${t.name}`));
            });
        } else {
            console.log('No embedded terms found.');
        }
    }
}

checkTerms();
