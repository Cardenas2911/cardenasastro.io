# Guía de Creación de Contenido para el Blog

Este documento define los estándares y mejores prácticas para publicar nuevos artículos en el blog de CardenasNicolas.com.

## 1. Estructura del Archivo (Frontmatter)

Cada artículo debe ser un archivo `.md` o `.mdx` ubicado en `src/content/blog/`. El encabezado YAML (Frontmatter) soporta las siguientes propiedades:

```yaml
---
title: "Título del Artículo"
description: "Breve descripción para SEO y tarjetas de vista previa (140-160 caracteres)."
pubDate: "YYYY-MM-DD" # Fecha de publicación
heroImage: "/blog-placeholder-1.jpg" # Imagen principal (Aspecto 16:9 recomendado)
tags: ["Marketing", "IA", "Desarrollo"] # Máximo 3-4 etiquetas
category: "Estrategia" # Categoría principal
hideTitle: false # (Opcional) Oculta el título H1 automático si vas a usar un componente personalizado.
fullWidth: false # (Opcional) Activa el modo inmersivo sin bordes ni contenedor.
---
```


## 2. Imagen de Portada (Hero Image)

Para asegurar la mejor optimización SEO y rendimiento (Core Web Vitals):

1.  **Formato:** Preferiblemente `.webp`. Si no es posible, `.jpg`. Evita `.png` para fotos grandes.
2.  **Dimensiones:** `1200 x 675 px` (Aspect Ratio 16:9).
3.  **Peso:** Idealmente < 100kb. Máximo 200kb.
4.  **Ubicación:** Guarda las imágenes en `public/images/`.
5.  **Uso en Frontmatter:**
    ```yaml
    heroImage: "/images/nombre-archivo.webp"
    ```
    > **⚠️ Advertencia:** Asegúrate de no tener la clave `heroImage` duplicada en el archivo (ej. una vacía y otra con la ruta), ya que esto romperá el servidor con un error `YAMLException`.

## 3. Modos de Diseño (Layouts)

El blog soporta dos modos de visualización que se controlan con la propiedad `fullWidth`.

### A. Modo Tarjeta (Estándar)
**Uso:** Artículos de texto tradicionales, tutoriales, reflexiones.
- **`fullWidth: false`** (o omitido).
- El contenido vive dentro de un contenedor blanco con sombra y bordes redondeados.
- Ancho máximo limitado para lectura óptima (`max-w-6xl`).
- Mantiene márgenes y padding automáticos.

### B. Modo Inmersivo (Full Width)
**Uso:** Infografías interactivas, narrativas visuales, landing pages dentro del blog.
- **`fullWidth: true`**.
- Elimina el contenedor, sombras y bordes.
- El contenido o componente React ocupa el 100% del ancho disponible.
- **Importante:** Eres responsable de gestionar los márgenes (`max-w-7xl mx-auto px-6`) dentro de tus propios componentes para que no se peguen a los bordes de la pantalla.
- **Imagen de Portada Visual:** En este modo, la imagen definida en el `frontmatter` solo se usa para SEO (Open Graph). Si quieres mostrarla visualmente en el artículo, debes agregarla manualmente dentro de tu componente React:

    ```tsx
    // Ejemplo de Banner Hero en React (Sin recorte)
    <div className="w-full relative overflow-hidden rounded-3xl shadow-2xl group">
        <img 
            src="/images/mi-portada.webp" 
            className="w-full h-auto object-contain" 
            alt="Descripción" 
        />
        {/* Opcional: Gradiente para texto encima */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>
    ```

## 3. Componentes Interactivos (MDX)

Para artículos avanzados que usan React (como la guía GEO):

1.  **Extensión:** El archivo debe ser `.mdx`.
2.  **Importación:** Importa tus componentes después del segundo `---`.
    ```mdx
    import MiComponente from '../../components/MiComponente.tsx';

    <MiComponente client:visible />
    ```
3.  **Directivas de Cliente:**
    - `client:load`: Carga inmediata (para elementos críticos del Hero).
    - `client:visible`: Carga cuando el usuario hace scroll (recomendado para gráficos pesados).
    - `client:only="react"`: Si el componente usa librerías que fallan en el servidor (como Chart.js o Framer Motion avanzado).

## 4. Checklist de Calidad (UX/UI)

Antes de publicar, verifica:

- [ ] **Modo Oscuro:** ¿Todos los textos son legibles sobre fondo negro? Usa clases como `dark:text-white` y `dark:bg-neutral-900`.
- [ ] **Responsividad:** 
    - Móvil (< 768px): Títulos grandes (`text-3xl` o `text-4xl`), padding reducido. Evita que las palabras largas se rompan mal.
    - Tablet (768px - 1024px): Grillas de 2 columnas.
    - Desktop (> 1024px): Grillas de 3+ columnas.
- [ ] **Accesibilidad:** Todas las imágenes deben tener `alt`. Los gráficos deben tener leyendas claras.
