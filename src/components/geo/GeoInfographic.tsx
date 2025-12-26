import React, { useEffect, useState, useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import ChartRenderer from "./ChartRenderer";
import { wrapLabel, palette, globalTooltipOptions } from "./chartUtils";

// --- Data Constants ---
// (Data constants remain unchanged, assuming they are in the file already or I need to keep them if I'm replacing the whole block)
// ... wait, I am editing the top part. I need to keep the data constants.
// Actually, the REPLACE tool is for contiguous blocks. The data constants are between lines 7 and 150.
// I will just add the imports at the top and the specific variant definitions before the component.

// Better strategy: I'll use multi_replace to insert imports and then wrapped the component.
// But wait, the file content view showed lines 1-443.
// I will just Replace the Imports and then Replace the Component body in two steps or one big step if I can.
// Let's do imports first + Helper function if any.

// Actually, I can just replace lines 1-3 with imports including motion.
// And then insert the variants before `export default function`.

// Let's do imports first.

// --- Data Constants ---

const trafficData = {
    labels: ["2023", "2024", "2025", "2026", "2027"],
    datasets: [
        {
            label: "Búsqueda Generativa (GEO)",
            data: [8, 22, 45, 62, 80],
            backgroundColor: palette.gold,
            borderRadius: 6,
        },
        {
            label: "Búsqueda Basada en Enlaces (Google)",
            data: [92, 78, 55, 38, 20],
            backgroundColor: palette.neutral,
            borderRadius: 6,
        },
    ],
};

trafficData.datasets.forEach((ds) => {
    ds.label = wrapLabel(ds.label) as string;
});

const radarLabels = [
    "Volumen de Keywords",
    "Autoridad de Entidad",
    "Estructura JSON-LD",
    "Co-citación Externa",
    "Velocidad de Carga",
    "Contenido Sintético",
];

const doughnutLabels = [
    "Autoridad de Marca",
    "Relevancia Semántica",
    "Datos Estructurados",
    "Citas/Backlinks",
    "Frescura",
];

const doughnutData = {
    labels: doughnutLabels,
    datasets: [
        {
            data: [30, 25, 20, 15, 10],
            backgroundColor: [
                palette.gold,
                palette.goldLight,
                "#404040",
                palette.neutral,
                "#d4d4d4",
            ],
            borderWidth: 0,
            hoverOffset: 10,
        },
    ],
};

const radarData = {
    labels: radarLabels.map((l) => wrapLabel(l)),
    datasets: [
        {
            label: "SEO Clásico",
            data: [95, 45, 30, 40, 75, 20],
            borderColor: palette.neutral,
            backgroundColor: "rgba(115, 115, 115, 0.1)",
            borderWidth: 2,
            pointRadius: 3,
        },
        {
            label: "GEO Strategy",
            data: [35, 95, 100, 90, 98, 90],
            borderColor: palette.gold,
            backgroundColor: "rgba(212, 175, 55, 0.2)",
            borderWidth: 3,
            pointRadius: 4,
        },
    ],
};

const trafficOptions = {
    scales: {
        x: {
            stacked: true,
            grid: { display: false },
            ticks: { color: palette.neutral },
        },
        y: {
            stacked: true,
            display: false,
        },
    },
    plugins: {
        legend: {
            position: "bottom",
            labels: {
                boxWidth: 12,
                font: { size: 10 },
                color: palette.dark,
            },
        },
        tooltip: globalTooltipOptions,
    },
};

const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: "right",
            labels: {
                boxWidth: 15,
                font: { size: 11 },
                color: palette.dark,
            },
        },
        tooltip: globalTooltipOptions,
    },
};

const radarOptions = {
    scales: {
        r: {
            angleLines: { color: "rgba(0,0,0,0.1)" },
            grid: { color: "rgba(0,0,0,0.1)" },
            ticks: { display: false },
            pointLabels: {
                font: { size: 10, weight: "bold" },
                color: palette.dark,
            },
        },
    },
    plugins: {
        legend: {
            position: "top",
            labels: {
                boxWidth: 12,
                font: { weight: "bold" },
                color: palette.dark,
            },
        },
        tooltip: globalTooltipOptions,
    },
};

// --- Animation Variants ---

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

// --- Component ---

export default function GeoInfographic() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const checkDark = () => setIsDark(document.documentElement.classList.contains("dark"));
        checkDark(); // Initial check

        const observer = new MutationObserver(checkDark);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

        return () => observer.disconnect();
    }, []);

    const textColor = isDark ? "#e5e5e5" : palette.dark; // Neutral-200 vs Dark
    const gridColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

    const trafficOptionsMemo = useMemo(() => ({
        ...trafficOptions,
        scales: {
            ...trafficOptions.scales,
            x: {
                ...trafficOptions.scales.x,
                ticks: { color: isDark ? "#a3a3a3" : palette.neutral } // Neutral-400 vs Neutral-500
            }
        },
        plugins: {
            ...trafficOptions.plugins,
            legend: {
                ...trafficOptions.plugins.legend,
                labels: { ...trafficOptions.plugins.legend.labels, color: textColor }
            }
        }
    }), [isDark, textColor]);

    const doughnutOptionsMemo = useMemo(() => ({
        ...doughnutOptions,
        plugins: {
            ...doughnutOptions.plugins,
            legend: {
                ...doughnutOptions.plugins.legend,
                labels: { ...doughnutOptions.plugins.legend.labels, color: textColor }
            }
        }
    }), [isDark, textColor]);

    const radarOptionsMemo = useMemo(() => ({
        ...radarOptions,
        scales: {
            ...radarOptions.scales,
            r: {
                ...radarOptions.scales.r,
                grid: { color: gridColor },
                angleLines: { color: gridColor },
                pointLabels: { ...radarOptions.scales.r.pointLabels, color: textColor }
            }
        },
        plugins: {
            ...radarOptions.plugins,
            legend: {
                ...radarOptions.plugins.legend,
                labels: { ...radarOptions.plugins.legend.labels, color: textColor }
            }
        }
    }), [isDark, textColor, gridColor]);

    return (
        <div className="geo-infographic-wrapper not-prose font-sans antialiased selection:bg-gold/20 text-black dark:text-white">
            {/* HERO SECTION */}
            <header className="relative bg-neutral-50 dark:bg-black pt-16 pb-24 md:pt-24 md:pb-36 rounded-b-[2rem] md:rounded-b-[3rem] overflow-hidden shadow-xl border-b border-neutral-200 dark:border-neutral-800">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/20 via-white to-white dark:via-black dark:to-black z-0"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInUp} className="inline-block px-4 py-1 mb-8 rounded-full border border-gold/30 bg-gold/10 backdrop-blur-md">
                            <span className="text-black dark:text-white font-bold tracking-widest text-xs uppercase">
                                Evolución Digital 2025
                            </span>
                        </motion.div>
                        <motion.div variants={fadeInUp} className="mb-8 md:mb-12 relative w-full rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/20 dark:border-white/10 group">
                            <img
                                src="/images/geo-guia-portada.jpg"
                                alt="GEO: La Guía Definitiva"
                                className="w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        </motion.div>
                        <motion.h1 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-6 md:mb-8 leading-tight tracking-tighter text-black dark:text-white">
                            GEO: La Guía <br />
                            <span
                                className="text-transparent bg-clip-text bg-gradient-to-r from-black via-yellow-600 to-gold dark:from-white dark:via-yellow-400 dark:to-gold"
                                style={{ WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}
                            >
                                Definitiva para Marcas
                            </span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-lg md:text-xl text-neutral-800 dark:text-neutral-300 max-w-3xl mx-auto mb-12 md:mb-16 font-light leading-relaxed px-4 md:px-0">
                            Domina las respuestas de <strong className="text-black dark:text-white">ChatGPT, Perplexity y Gemini</strong>{" "}
                            de la mano de Nicolás Cárdenas.
                        </motion.p>
                        <motion.div variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto">
                            {[
                                { val: "10+", label: "Años Exp." },
                                { val: "SEO", label: "First Focus" },
                                { val: "JSON", label: "Linked Data" },
                                { val: "GEO", label: "Expertise" },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    variants={fadeInUp}
                                    className="p-4 md:p-6 bg-white dark:bg-neutral-900 rounded-2xl md:rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:border-gold/50 transition-colors group"
                                >
                                    <div className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white group-hover:text-gold transition-colors">
                                        {item.val}
                                    </div>
                                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase font-bold mt-1">
                                        {item.label}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </header>

            {/* SECCIÓN 1: El Cambio de Paradigma */}
            <section className="py-16 md:py-24 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="order-2 lg:order-1"
                    >
                        <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-neutral-100 dark:border-neutral-800">
                            <h3 className="text-center font-bold text-neutral-500 dark:text-neutral-400 mb-8 uppercase tracking-widest text-sm">
                                Cambio en el Tráfico de Búsqueda
                            </h3>
                            <ChartRenderer
                                type="bar"
                                data={trafficData}
                                options={trafficOptionsMemo}
                                chartId="trafficEvolutionChart"
                                height="320px"
                            />
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="order-1 lg:order-2"
                    >
                        <h2 className="text-3xl md:text-4xl font-black text-neutral-900 dark:text-white mb-6 md:mb-8 leading-tight">
                            La Evolución <span className="text-gold">de la Búsqueda</span>
                        </h2>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
                            Ya no optimizamos para un buscador de listas, sino para motores de respuesta. GEO es el proceso de estructurar la información para que los LLMs la procesen y citen como fuente de verdad.
                        </p>
                        <div className="flex items-center gap-4 p-5 bg-gold/5 dark:bg-gold/10 border-l-4 border-gold rounded-r-2xl">
                            <span className="text-3xl">💡</span>
                            <p className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                                En Astro, la velocidad de carga es crítica. Un sitio lento es un sitio invisible para los bots de IA.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* SECCIÓN 2: El Algoritmo (Doughnut) */}
            <section className="py-24 bg-neutral-50 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <span className="text-gold font-bold tracking-widest text-sm uppercase">
                            El Cerebro de la IA
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mt-2">
                            ¿Por qué citan las IAs?
                        </h2>
                        <p className="text-neutral-600 max-w-2xl mx-auto mt-4">
                            A diferencia de Google, que prioriza backlinks, los LLMs priorizan autoridad semántica y estructura de datos.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Doughnut Chart */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800"
                        >
                            <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-4 text-center">
                                Factores de Citación en GEO
                            </h3>
                            <ChartRenderer
                                type="doughnut"
                                data={doughnutData}
                                options={doughnutOptionsMemo}
                                chartId="citationFactorsChart"
                                height="300px"
                            />
                            <div className="mt-6 text-center text-xs text-neutral-400">
                                *Estimación basada en análisis de Perplexity y SearchGPT.
                            </div>
                        </motion.div>

                        {/* Explanation Cards */}
                        <div className="space-y-6">
                            {[
                                { id: 1, title: "Autoridad de Entidad", text: "La IA debe reconocer tu marca como una entidad experta. Consistencia en toda la web." },
                                { id: 2, title: "Datos Estructurados", text: "El código que traduce tu contenido. Sin JSON-LD, la IA adivina. Con Schema, sabe." },
                                { id: 3, title: "Claridad Semántica", text: "Textos concisos, listas y tablas. Las IAs prefieren contenido fácil de procesar." },
                            ].map((card, i) => (
                                <motion.div
                                    key={card.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.2, duration: 0.5 }}
                                    viewport={{ once: true }}
                                    className="flex items-start group"
                                >
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold text-xl font-bold border border-gold/20 group-hover:bg-gold group-hover:text-black transition-colors">
                                        {card.id}
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-bold text-neutral-900">{card.title}</h4>
                                        <p className="text-neutral-600 text-sm">{card.text}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* SECCIÓN 3: Factores de Ranking (Radar) */}
            <section className="py-16 md:py-24 bg-white dark:bg-black">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-black text-neutral-900 dark:text-white">
                            Estrategia SEO vs GEO
                        </h2>
                        <p className="text-neutral-500 dark:text-neutral-400 mt-4">
                            ¿En qué se fijan las IAs a diferencia de Google?
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="bg-neutral-50 dark:bg-neutral-900 p-4 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-lg border border-neutral-200 dark:border-neutral-800"
                        >
                            <ChartRenderer
                                type="radar"
                                data={radarData}
                                options={radarOptionsMemo}
                                chartId="factorsRadarChart"
                                height="400px"
                            />
                        </motion.div>
                        <div className="grid grid-cols-1 gap-6">
                            {[
                                { icon: "📍", title: "Autoridad de Entidad", text: "Las IAs no rankean páginas, rankean entidades. Posicionamos tu marca como una autoridad reconocida semánticamente." },
                                { icon: "🧩", title: "Estructura de Datos", text: "Sin Schema markup (JSON-LD), la IA debe 'alucinar' tus datos. La implementación técnica es el puente." },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + (i * 0.2), duration: 0.5 }}
                                    viewport={{ once: true }}
                                    className="p-8 bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:border-gold/30 transition-colors"
                                >
                                    <h4 className="font-bold text-neutral-900 dark:text-white mb-3 text-lg flex items-center">
                                        <span className="mr-3 text-gold">{item.icon}</span> {item.title}
                                    </h4>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                        {item.text}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* SECCIÓN 3: Proceso (Flow) */}
            <section className="py-16 md:py-24 bg-neutral-50 dark:bg-neutral-900/50">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                        <h2 className="text-3xl md:text-4xl font-black text-center text-neutral-900 dark:text-white mb-6">
                            Ruta Crítica hacia la Citación
                        </h2>
                        <p className="text-neutral-500 dark:text-neutral-400 text-center max-w-2xl mx-auto mb-16">
                            ¿Cómo optimizar tu sitio hoy para el mañana?
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { id: "01", title: "Auditoría SEO", text: "Evaluamos si las IAs ya reconocen tu marca. Preguntamos a ChatGPT y Perplexity para analizar vacíos o errores.", hasArrow: true },
                            { id: "02", title: "Estructura", text: "Inyección masiva de Schema. Definimos 'Organización', 'Servicios' y 'FAQ' para alimentar al modelo con hechos.", hasArrow: true },
                            { id: "03", title: "Contenido", text: "Creación de contenido sintético para IA: Tablas, listas claras y respuestas directas (Método BLUF).", hasArrow: true },
                            { id: "04", title: "Citación", text: "Estrategia de co-citación. Conseguimos que otras fuentes de autoridad te mencionen para validar tu estatus de experto.", hasArrow: false, highlight: true },
                        ].map((step, i) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.15, duration: 0.5 }}
                                viewport={{ once: true }}
                                className={`relative p-10 rounded-3xl text-center group transition-all shadow-sm ${step.highlight ? "bg-gradient-to-br from-gold to-yellow-600 text-white shadow-xl shadow-gold/20" : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-gold/30"}`}
                            >
                                <div className={`text-5xl font-black mb-6 transition-colors ${step.highlight ? "text-white/20" : "text-neutral-100 dark:text-neutral-800 group-hover:text-gold/20"}`}>
                                    {step.id}
                                </div>
                                <h4 className={`font-bold mb-3 text-lg underline decoration-4 underline-offset-8 ${step.highlight ? "text-white decoration-white/30" : "text-neutral-900 dark:text-white decoration-gold"}`}>
                                    {step.title}
                                </h4>
                                <p className={`text-xs leading-loose ${step.highlight ? "text-white/90" : "text-neutral-500 dark:text-neutral-400"}`}>
                                    {step.text}
                                </p>
                                {step.hasArrow && (
                                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-neutral-300 font-black text-2xl z-10">
                                        ❯
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="relative py-20 md:py-32 bg-black overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="relative z-10 max-w-5xl mx-auto px-6">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                        className="bg-neutral-900/30 backdrop-blur-xl border border-white/5 p-8 md:p-20 rounded-[2rem] md:rounded-[3rem] text-center shadow-2xl relative overflow-hidden group hover:border-gold/20 transition-all duration-700"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                        <div className="relative z-10">
                            <span className="inline-block px-5 py-2 rounded-full bg-gold text-black font-black text-xs tracking-widest uppercase mb-10 shadow-[0_0_20px_-5px_rgba(212,175,55,0.5)]">
                                ¿Listo para 2026?
                            </span>

                            <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-none">
                                GEO es el <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-200 to-gold">
                                    Nuevo Estándar
                                </span>
                            </h2>

                            <p className="text-lg md:text-2xl text-neutral-400 max-w-3xl mx-auto mb-10 md:mb-14 font-light leading-relaxed">
                                "No construyo páginas web, construyo activos digitales estratégicos para la era de la IA."
                            </p>

                            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                                <a
                                    href="https://wa.me/573002984537?text=Hola%20Nicolas,%20quiero%20optimizar%20mi%20marca%20para%20la%20era%20GEO."
                                    target="_blank"
                                    className="group relative px-10 py-5 bg-white text-black font-black rounded-full text-lg hover:bg-gold transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_50px_-10px_rgba(212,175,55,0.6)] flex items-center gap-3"
                                >
                                    <span>Solicitar Auditoría GEO</span>
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </a>
                                <a
                                    href="/contacto"
                                    className="px-8 py-4 text-neutral-400 font-medium hover:text-white transition-colors flex items-center gap-2"
                                >
                                    <span>Cotizar Proyecto</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path>
                                    </svg>
                                </a>
                            </div>

                            <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-neutral-600 uppercase tracking-widest">
                                <div className="font-bold text-neutral-400 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-gold rounded-full animate-pulse"></div>
                                    Nicolás Cárdenas
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 items-center">
                                    <span>Medellín, CO</span>
                                    <span>@cardenasnicolas</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </footer>
        </div>
    );
}
