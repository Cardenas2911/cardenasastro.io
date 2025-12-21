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
  const res = await fetch(`${API_URL}/certificados?_embed&per_page=100`);
  const certificates: WPPost[] = await res.json();
  console.log('Fetched certificates count:', certificates.length);

  return certificates.map(cert => {
    const heroImage = cert._embedded?.['wp:featuredmedia']?.[0]?.source_url;

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
    if (cert.acf?.enlace_al_certificado_online) {
      if (typeof cert.acf.enlace_al_certificado_online === 'string') {
        certificateUrl = cert.acf.enlace_al_certificado_online;
      } else if (typeof cert.acf.enlace_al_certificado_online === 'object') {
        certificateUrl = cert.acf.enlace_al_certificado_online.url;
      }
    }

    return {
      id: cert.id.toString(),
      slug: cert.slug,
      title: cert.title?.rendered || 'Sin título',
      description: cert.excerpt?.rendered ? cert.excerpt.rendered.replace(/<[^>]*>?/gm, '') : '',
      pubDate: new Date(cert.date),
      heroImage: heroImage,
      content: cert.content?.rendered || '',
      // Taxonomies
      certificateCategories: categories,
      certificateTags: tags,
      // ACF Fields
      certificateUrl: certificateUrl,
      customH1: cert.acf?.h1_del_certificado || cert.title?.rendered || '',
      shortDescription: cert.acf?.descripcion_corta_del_certificado || '',
      durationHours: cert.acf?.cantidad_de_horas || '',
      issuedBy: cert.acf?.emitido_por || '',
      issueDate: cert.acf?.fecha_de_emision || '',
      practiceSummary: cert.acf?.como_puse_en_practica_lo_aprendido || '',
      practiceBullets: [
        cert.acf?.['bullets_practica_#1'],
        cert.acf?.['bullets_practica_#2'],
        cert.acf?.['bullets_practica_#3']
      ].filter(Boolean) as string[],
      keyTakeaways: [
        cert.acf?.['bullets_#1'],
        cert.acf?.['bullets_#2'],
        cert.acf?.['bullets_#3']
      ].filter(Boolean) as string[],
    };
  });
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
  const res = await fetch(`${API_URL}/portafolio?_embed&per_page=100`);
  const portfolios: WPPortfolio[] = await res.json();
  console.log('Fetched portfolios count:', portfolios.length);

  console.log(`[WP] Mapping ${portfolios.length} portfolios...`);

  return portfolios.map(item => {
    try {
      const heroImage = item._embedded?.['wp:featuredmedia']?.[0]?.source_url;

      // Normalize ACF: WP returns [] if empty, object if populated.
      const acfData = (item.acf && typeof item.acf === 'object' && !Array.isArray(item.acf)) ? item.acf : {};

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

      return {
        id: item.id.toString(),
        slug: item.slug,
        title: item.title?.rendered || 'Sin Título',
        description: item.excerpt?.rendered ? item.excerpt.rendered.replace(/<[^>]*>?/gm, '') : '',
        pubDate: new Date(item.date),
        heroImage: heroImage,
        content: item.content?.rendered || acfData.contenido_principal || '',
        // Taxonomies
        portfolioCategories: categories,
        portfolioTags: tags,
        // ACF Fields
        projectLink: acfData.link_del_proyecto || '',
        projectDate: acfData.fecha_del_trabajo || '',
        projectLogo: getAcfImageUrl(acfData.logo_del_proyecto),
        customH1: acfData.titulo_h1 || item.title?.rendered,
        projectDescription: acfData.descripcion_del_proyecto || '',
        challengeHeading: acfData.h3_de_desafio || 'El Desafío',
        challengeText: acfData.el_desafio || '',
        solutionHeading: acfData.h3_de_la_solucion || 'La Solución',
        solutionText: acfData.la_solucion || '',
        resultsHeading: acfData.h3_de_los_resultados || 'Los Resultados',
        resultsText: acfData.los_resultados || '',
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
}
