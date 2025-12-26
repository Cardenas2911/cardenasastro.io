interface ACFLink {
  title: string;
  url: string;
  target: string;
}

interface WPPost {
  id: number;
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    'wp:term'?: Array<Array<{
      taxonomy: string;
      id: number;
      name: string;
      slug: string;
    }>>;
  };
  acf?: {
    enlace_al_certificado_online?: string | ACFLink | null;
    h1_del_certificado?: string;
    descripcion_corta_del_certificado?: string;
    cantidad_de_horas?: string;
    emitido_por?: string;
    fecha_de_emision?: string;
    como_puse_en_practica_lo_aprendido?: string;
    'bullets_practica_#1'?: string;
    'bullets_practica_#2'?: string;
    'bullets_practica_#3'?: string;
    'bullets_#1'?: string;
    'bullets_#2'?: string;
    'bullets_#3'?: string;
  };
}

const API_URL = 'https://cardenasnicolas.com/wp-json/wp/v2';

// getPosts and getPost removed - Blog is now 100% local MDX

export async function getCertificates() {
  console.log('Fetching certificates from:', `${API_URL}/certificados?_embed&per_page=100`);
  try {
    const res = await fetch(`${API_URL}/certificados?_embed&per_page=100`);
    if (!res.ok) throw new Error(`Failed to fetch certificates: ${res.statusText}`);
    const certificates: WPPost[] = await res.json();
    console.log('Fetched certificates count:', certificates.length);

    return certificates.map(cert => {
      const heroImage = cert._embedded?.['wp:featuredmedia']?.[0]?.source_url;

      // Normalize ACF: WP returns [] if empty, object if populated.
      // This is crucial to prevent crashes when accessing properties on an array.
      const acfData = (cert.acf && typeof cert.acf === 'object' && !Array.isArray(cert.acf)) ? cert.acf : {};

      // Helper to safely get string values
      const getString = (val: any) => typeof val === 'string' || typeof val === 'number' ? String(val) : '';

      // Extract Taxonomies
      let categories: string[] = [];
      let tags: string[] = [];

      if (cert._embedded && cert._embedded['wp:term']) {
        cert._embedded['wp:term'].forEach(termGroup => {
          termGroup.forEach(term => {
            if (term.taxonomy === 'categorias-de-los-certificados') {
              categories.push(term.name);
            } else if (term.taxonomy === 'etiqueta-de-certificado') {
              tags.push(term.name);
            }
          });
        });
      }

      // Handle ACF Link field which can be object or string or null
      let certificateUrl = '';
      if (acfData.enlace_al_certificado_online) {
        if (typeof acfData.enlace_al_certificado_online === 'string') {
          certificateUrl = acfData.enlace_al_certificado_online;
        } else if (typeof acfData.enlace_al_certificado_online === 'object' && acfData.enlace_al_certificado_online.url) {
          certificateUrl = acfData.enlace_al_certificado_online.url;
        }
      }

      // Safe Date Parsing
      const pubDate = new Date(cert.date);
      const isValidDate = !isNaN(pubDate.getTime());

      return {
        id: cert.id.toString(),
        slug: cert.slug,
        title: cert.title?.rendered || 'Sin título',
        description: cert.excerpt?.rendered ? cert.excerpt.rendered.replace(/<[^>]*>?/gm, '') : '',
        pubDate: isValidDate ? pubDate : new Date(), // Fallback to current date if invalid
        heroImage: heroImage || undefined, // Ensure undefined if missing
        content: cert.content?.rendered || '',
        // Taxonomies
        certificateCategories: categories,
        certificateTags: tags,
        // ACF Fields (using safe acfData)
        certificateUrl: certificateUrl,
        customH1: getString(acfData.h1_del_certificado) || cert.title?.rendered || '',
        shortDescription: getString(acfData.descripcion_corta_del_certificado) || '',
        durationHours: getString(acfData.cantidad_de_horas) || '',
        issuedBy: getString(acfData.emitido_por) || '',
        issueDate: getString(acfData.fecha_de_emision) || '',
        practiceSummary: getString(acfData.como_puse_en_practica_lo_aprendido) || '',
        practiceBullets: [
          getString(acfData['bullets_practica_#1']),
          getString(acfData['bullets_practica_#2']),
          getString(acfData['bullets_practica_#3'])
        ].filter(Boolean),
        keyTakeaways: [
          getString(acfData['bullets_#1']),
          getString(acfData['bullets_#2']),
          getString(acfData['bullets_#3'])
        ].filter(Boolean),
      };
    });
  } catch (error) {
    console.error('Error in getCertificates:', error);
    return [];
  }
}


interface WPImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

interface WPPortfolio {
  id: number;
  date: string;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
    'wp:term'?: Array<Array<{ taxonomy: string; name: string }>>;
  };
  acf?: {
    link_del_proyecto?: string;
    fecha_del_trabajo?: string;
    logo_del_proyecto?: WPImage | string | boolean; // can be false if not set
    titulo_h1?: string;
    descripcion_del_proyecto?: string;
    contenido_principal?: string;
    h3_de_desafio?: string;
    el_desafio?: string;
    h3_de_la_solucion?: string;
    la_solucion?: string;
    h3_de_los_resultados?: string;
    los_resultados?: string;
    'imagen_#1'?: WPImage | string | boolean;
    'imagen_#2'?: WPImage | string | boolean;
    'imagen_#3'?: WPImage | string | boolean;
    'imagen_#4'?: WPImage | string | boolean;
    'imagen_#5'?: WPImage | string | boolean;
  };
}

export async function getPortfolios() {
  console.log('Fetching portfolios from:', `${API_URL}/portafolio?_embed&per_page=100`);
  try {
    const res = await fetch(`${API_URL}/portafolio?_embed&per_page=100`);
    if (!res.ok) throw new Error(`Failed to fetch portfolios: ${res.statusText}`);
    const portfolios: WPPortfolio[] = await res.json();
    console.log('Fetched portfolios count:', portfolios.length);

    console.log(`[WP] Mapping ${portfolios.length} portfolios...`);

    return portfolios.map(item => {
      try {
        const heroImage = item._embedded?.['wp:featuredmedia']?.[0]?.source_url;

        // Normalize ACF: WP returns [] if empty, object if populated.
        const acfData = (item.acf && typeof item.acf === 'object' && !Array.isArray(item.acf)) ? item.acf : {};

        // Helper to safely get string values
        const getString = (val: any) => typeof val === 'string' || typeof val === 'number' ? String(val) : '';

        // Helper to extract image URL safely from ACF
        const getAcfImageUrl = (field: any): string => {
          if (!field) return '';
          if (typeof field === 'string') return field;
          if (typeof field === 'object' && field.url) return field.url;
          return '';
        };

        // Extract Taxonomies
        let categories: string[] = [];
        let tags: string[] = [];

        if (item._embedded && item._embedded['wp:term']) {
          item._embedded['wp:term'].forEach(termGroup => {
            termGroup.forEach(term => {
              if (term.taxonomy === 'cateogorias-de-portafolio') {
                categories.push(term.name);
              } else if (term.taxonomy === 'etiqueta-de-proyecto') {
                tags.push(term.name);
              }
            });
          });
        }

        // Safe Date Parsing
        const pubDate = new Date(item.date);
        const isValidDate = !isNaN(pubDate.getTime());

        return {
          id: item.id.toString(),
          slug: item.slug,
          title: item.title?.rendered || 'Sin Título',
          description: item.excerpt?.rendered ? item.excerpt.rendered.replace(/<[^>]*>?/gm, '') : '',
          pubDate: isValidDate ? pubDate : new Date(),
          heroImage: heroImage || undefined,
          content: item.content?.rendered || getString(acfData.contenido_principal) || '',
          // Taxonomies
          portfolioCategories: categories,
          portfolioTags: tags,
          // ACF Fields
          projectLink: getString(acfData.link_del_proyecto),
          projectDate: getString(acfData.fecha_del_trabajo),
          projectLogo: getAcfImageUrl(acfData.logo_del_proyecto),
          customH1: getString(acfData.titulo_h1) || item.title?.rendered,
          projectDescription: getString(acfData.descripcion_del_proyecto),
          challengeHeading: getString(acfData.h3_de_desafio) || 'El Desafío',
          challengeText: getString(acfData.el_desafio),
          solutionHeading: getString(acfData.h3_de_la_solucion) || 'La Solución',
          solutionText: getString(acfData.la_solucion),
          resultsHeading: getString(acfData.h3_de_los_resultados) || 'Los Resultados',
          resultsText: getString(acfData.los_resultados),
          galleryImages: [
            getAcfImageUrl(acfData['imagen_#1']),
            getAcfImageUrl(acfData['imagen_#2']),
            getAcfImageUrl(acfData['imagen_#3']),
            getAcfImageUrl(acfData['imagen_#4']),
            getAcfImageUrl(acfData['imagen_#5']),
          ].filter(Boolean),
        };
      } catch (err: any) {
        console.error(`[WP] Error mapping portfolio item ${item.id}:`, err);
        return null;
      }
    }).filter((item) => item !== null);
  } catch (error) {
    console.error('Error in getPortfolios:', error);
    return [];
  }
}
