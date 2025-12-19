
import fs from 'fs';

async function fetchPortfolio() {
  try {
    const res = await fetch('https://cardenasnicolas.com/wp-json/wp/v2/portafolio?per_page=1&_embed');
    const data = await res.json();
    fs.writeFileSync('portfolio_debug.json', JSON.stringify(data, null, 2));
    console.log('Saved to portfolio_debug.json');
    if (data.length > 0) {
        console.log('Keys:', Object.keys(data[0]));
        if (data[0].acf) {
            console.log('ACF Keys:', Object.keys(data[0].acf));
        }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

fetchPortfolio();
