export interface PageMetadata {
    title: string;
    description: string;
    image?: string;
    robots?: string;
}

export const siteMetadata: Record<string, PageMetadata> = {
    "/": {
        title: "Nicolas Cardenas | Desarrollo Web, SEO y Marketing Digital",
        description: "Transformo ideas en negocios digitales rentables. Experto en Desarrollo Web con Astro, SEO Técnico y Estrategias de Marketing para crecimiento real.",
    },
    "/servicios": {
        title: "Servicios | Desarrollo Web y SEO - Nicolas Cardenas",
        description: "Soluciones digitales a medida: Diseño Web Corporativo, E-commerce, Auditorías SEO y Consultoría de Marketing. Potencia tu presencia online.",
    },
    "/portafolio": {
        title: "Portafolio | Casos de Éxito - Nicolas Cardenas",
        description: "Explora mis proyectos más recientes. Desarrollo web de alto rendimiento, estrategias SEO exitosas y diseños que convierten.",
    },
    "/certificados": {
        title: "Certificaciones y Formación | Nicolas Cardenas",
        description: "Acreditaciones oficiales en Google Ads, Analytics, SEO y Desarrollo Web. Formación continua para ofrecerte la mejor calidad.",
    },
    "/quien-soy": {
        title: "Sobre Mí | Nicolas Cardenas - Tu Socio Digital",
        description: "Conoce mi trayectoria. De la curiosidad técnica a experto en soluciones digitales que impulsan negocios reales.",
    },
    "/cotizacion": {
        title: "Cotización Online | Presupuesto Instantáneo - Nicolas Cardenas",
        description: "Obtén un estimado inmediato para tu próximo proyecto web. Calculadora de precios transparente para desarrollo y SEO.",
    },
    "/contacto": {
        title: "Contacto | Hablemos de tu Proyecto - Nicolas Cardenas",
        description: "Estoy listo para escalar tu negocio. Escríbeme y diseñemos juntos la estrategia digital que necesitas.",
    },
    "/politica-de-privacidad": {
        title: "Política de Privacidad | Nicolas Cardenas",
        description: "Información transparente sobre cómo protejo y gestiono tus datos personales según la normativa vigente.",
        robots: "noindex, follow"
    },
    "/politica-de-cookies": {
        title: "Política de Cookies | Nicolas Cardenas",
        description: "Entiende cómo utilizamos las cookies para mejorar tu experiencia de navegación en este sitio.",
        robots: "noindex, follow"
    },
    "/terminos-y-condiciones": {
        title: "Términos y Condiciones | Nicolas Cardenas",
        description: "Condiciones de uso y contratación de servicios en la plataforma de Nicolas Cardenas.",
        robots: "noindex, follow"
    },
    "/404": {
        title: "Página no encontrada | Error 404",
        description: "Lo sentimos, la página que buscas no existe o ha sido movida.",
        robots: "noindex, nofollow"
    }
};

export const defaultMetadata: PageMetadata = {
    title: "Nicolas Cardenas - Tu Proyecto Web",
    description: "Desarrollo Web y Estrategias SEO.",
    image: "/favicon.webp",
    robots: "index, follow"
};
