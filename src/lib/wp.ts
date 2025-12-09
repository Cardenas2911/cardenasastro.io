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

export async function getPosts() {
  const res = await fetch(`${API_URL}/posts?_embed&per_page=100`);
  const posts: WPPost[] = await res.json();

  return posts.map(post => {
    const heroImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

    return {
      id: post.id.toString(),
      slug: post.slug,
      title: post.title.rendered,
      description: post.excerpt.rendered.replace(/<[^>]*>?/gm, ''), // Strip HTML tags
      pubDate: new Date(post.date),
      heroImage: heroImage,
      content: post.content.rendered,
      tags: [], // WP tags would need another fetch or mapping if available in _embedded
      category: 'Blog' // Default category or map from _embedded['wp:term']
    };
  });
}

export async function getPost(slug: string) {
  const posts = await getPosts();
  const post = posts.find((p) => p.slug === slug);
  return post;
}

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
