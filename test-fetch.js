
const API_URL = 'https://cardenasnicolas.com/wp-json/wp/v2';

async function getCertificates() {
    console.log('Fetching certificates from:', `${API_URL}/certificados?_embed&per_page=100`);
    try {
        const res = await fetch(`${API_URL}/certificados?_embed&per_page=100`);
        if (!res.ok) throw new Error(`Failed to fetch certificates: ${res.statusText}`);
        const certificates = await res.json();
        console.log('Fetched certificates count:', certificates.length);

        const mapped = certificates.map(cert => {
            // Logic from src/lib/wp.ts
            const acfData = (cert.acf && typeof cert.acf === 'object' && !Array.isArray(cert.acf)) ? cert.acf : {};

            return {
                id: cert.id,
                slug: cert.slug,
                title: cert.title?.rendered,
                acfType: Array.isArray(cert.acf) ? 'Array' : typeof cert.acf,
                acfDataSample: JSON.stringify(acfData).substring(0, 50) + '...'
            };
        });

        console.log('Mappings successful:', mapped.length);
        console.log('Sample mapped item:', mapped[0]);

        // Check for potential issues
        const invalidACF = certificates.filter(c => Array.isArray(c.acf));
        if (invalidACF.length > 0) {
            console.warn('WARNING: Found certificates with Array ACF (empty?):', invalidACF.length);
            console.log('IDs:', invalidACF.map(c => c.id));
        }

    } catch (error) {
        console.error('Error in getCertificates:', error);
    }
}

getCertificates();
