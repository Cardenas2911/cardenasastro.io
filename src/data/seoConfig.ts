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
        title: "Servicios SEO y Desarrollo WordPress Colombia | Nicolás Cárdenas",
        description: "Potencia tu negocio con servicios de Consultoría SEO, Desarrollo WordPress SEO-First, IA aplicada y E-commerce. Estrategias de alto impacto para dominar el mercado colombiano.",
    },
    "/servicios/consultoria-seo-estrategica-colombia": {
        title: "Consultoría SEO Estratégica Colombia | Experto Nicolás Cárdenas",
        description: "Acompañamiento SEO estratégico para empresas en Colombia. Auditorías técnicas profundas, investigación de mercado con IA y estrategias de crecimiento orientadas al ROI y visibilidad real.",
    },
    "/servicios/seo-local-colombia": {
        title: "SEO Local Colombia | Posicionamiento en Google Maps | Nicolás Cárdenas",
        description: "Especialista en SEO Local para negocios en Colombia. Optimizo tu Perfil de Empresa en Google y tu web para capturar búsquedas en Bogotá, Medellín, Cali y Barranquilla. ¡Haz que te encuentren primero!",
    },
    "/servicios/ia-aplicada-al-seo-colombia": {
        title: "IA para SEO Colombia | Optimización AEO y GEO | Nicolás Cárdenas",
        description: "No solo busques clics, busca ser la respuesta. Especialista en IA aplicada al SEO en Colombia. Optimización para ChatGPT, Perplexity y Google AI Overviews (SGE).",
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
        title: "Quién Soy | Experiencia y Trayectoria - Nicolás Cárdenas",
        description: "Conoce mi historia: De los inicios en Facebook Ads a liderar estrategias de IA y SEO Técnico. 10 años de experiencia transformando negocios digitales.",
    },
    "/cotizacion": {
        title: "Cotización Online | Presupuesto Instantáneo - Nicolas Cardenas",
        description: "Obtén un estimado inmediato para tu próximo proyecto web. Calculadora de precios transparente para desarrollo y SEO.",
    },
    "/contacto": {
        title: "Contacto | Nicolás Cárdenas - Especialista SEO y WordPress Colombia",
        description: "Agencia SEO enfocada en ROI. Agenda tu consulta gratuita y hablemos de estrategias de posicionamiento web en Colombia.",
    },
    "/gracias": {
        title: "¡Gracias por contactar! | Nicolás Cárdenas",
        description: "Hemos recibido tu mensaje. Pronto nos pondremos en contacto contigo.",
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
