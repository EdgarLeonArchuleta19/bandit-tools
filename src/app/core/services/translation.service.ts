import { Injectable, signal, effect, computed } from '@angular/core';

export type AppLanguage = 'es' | 'en';

export interface Translations {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private readonly STORAGE_KEY = 'bandit_tools_lang';
  readonly currentLang = signal<AppLanguage>('es'); // Default is Spanish!

  private readonly translations: Record<AppLanguage, Translations> = {
    es: {
      // Header & Navigation
      'nav.tools': 'Herramientas',
      'nav.categories': 'Categorías',
      'nav.about': 'Acerca de',
      'nav.privacy': 'Privacidad',
      'nav.info': 'Info',
      'nav.requestTool': '¿No encontraste lo que buscabas?',
      'nav.searchPlaceholder': 'Buscar herramientas...',
      'nav.githubTitle': 'Repositorio en GitHub',
      'nav.allTools': 'Todas las herramientas',
      'nav.themeToggle': 'Cambiar tema (Oscuro / Claro)',
      'nav.langToggle': 'Cambiar idioma (ES / EN)',

      // Hero
      'hero.badge': '100% en el navegador • Cero almacenamiento en servidor',
      'hero.titleLine1': 'Todo lo que necesitas.',
      'hero.titleLine2': 'Nada que te sobre.',
      'hero.description':
        'Herramientas gratuitas y rápidas para tus tareas diarias. Comprime archivos, transforma imágenes, formatea datos y genera contraseñas sin crear una cuenta.',
      'hero.searchPlaceholder': 'Buscar herramientas (ej. comprimir imagen, JSON, contraseña, QR)...',
      'hero.findBtn': 'Buscar',
      'hero.browseAll': 'Explorar catálogo',
      'hero.popular': 'Populares:',

      // Home Sections
      'home.featuredTitle': 'Herramientas Destacadas',
      'home.featuredDesc': 'Nuestras utilidades más populares, listas para usar de inmediato.',
      'home.viewAll': 'Ver las {count} herramientas',
      'home.categoriesTitle': 'Explorar por Categoría',
      'home.categoriesDesc': 'Encuentra utilidades diseñadas específicamente para tu disciplina.',
      'home.allCategories': 'Todas las categorías',
      'home.toolsCount': '{count} herramientas',
      'home.useTool': 'Usar herramienta',

      // Workflow
      'home.howItWorksTitle': 'Cómo Funciona',
      'home.howItWorksDesc': 'Cero cuentas, cero cookies, sin procesos lentos. Tres simples pasos:',
      'home.step1Title': '1. Elige una herramienta',
      'home.step1Desc': 'Selecciona de nuestro catálogo de utilidades para imágenes, código, texto o generadores.',
      'home.step2Title': '2. Sube o ingresa tus datos',
      'home.step2Desc': 'Arrastra tu archivo o pega tu texto. Todo se procesa de forma segura en tu navegador.',
      'home.step3Title': '3. Resultados instantáneos',
      'home.step3Desc': 'Descarga tu archivo optimizado, copia los datos al portapapeles o exporta formatos al instante.',

      // Home Privacy Callout
      'home.privacyTitle': 'Privacidad absoluta en tu navegador',
      'home.privacyP1':
        'Los sitios web tradicionales de conversión suben tus imágenes, códigos y archivos privados a sus servidores en la nube.',
      'home.privacyP1Bold': 'Bandit Tools no hace eso.',
      'home.privacyP2':
        'Cada compresión, cálculo y transformación se ejecuta localmente mediante APIs web nativas (HTML5 Canvas, Web Cryptography y motores JavaScript). Tus archivos sensibles nunca salen de tu ordenador.',
      'home.privacyReadMore': 'Leer Política de Privacidad',
      'home.privacyLearnAbout': 'Conocer más sobre Bandit Tools',

      // Tools Directory
      'directory.title': 'Directorio de Herramientas',
      'directory.subtitle':
        'Todas las herramientas de Bandit Tools son gratuitas, ultrarrápidas y se ejecutan 100% de manera local en tu navegador.',
      'directory.searchPlaceholder': 'Buscar por nombre, palabras clave, formato...',
      'directory.allCategory': 'Todas las herramientas',
      'directory.showingCount': 'Mostrando {filtered} de {total} herramientas',
      'directory.clearFilters': 'Restablecer filtros',
      'directory.emptyTitle': 'No se encontraron herramientas',
      'directory.emptyDesc': 'No pudimos encontrar herramientas que coincidan con "{query}". Intenta ajustar tu búsqueda.',
      'directory.resetBtn': 'Restablecer Búsqueda',

      // Common Actions & Badges
      'action.copy': 'Copiar',
      'action.copied': '¡Copiado!',
      'action.clear': 'Limpiar',
      'action.download': 'Descargar',
      'action.reset': 'Procesar otro',
      'action.sample': 'Cargar ejemplo',
      'action.regenerate': 'Regenerar',
      'action.format': 'Formatear',
      'action.minify': 'Minificar',
      'badge.popular': 'Popular',
      'badge.fast': 'Rápido',
      'badge.highRes': 'Alta Res',
      'badge.essential': 'Esencial',
      'badge.realtime': 'Tiempo real',
      'badge.crypto': 'Cripto-seguro',

      // Privacy banner
      'privacy.bannerTitle': 'Garantía de Privacidad en el Navegador',
      'privacy.bannerDefault':
        'Todo el procesamiento se ejecuta localmente en tu navegador. Tus archivos o datos nunca se transmiten a ningún servidor.',

      // Footer
      'footer.tagline': 'Herramientas útiles. Cero complicaciones.',
      'footer.about':
        'Herramientas online gratuitas diseñadas para máxima velocidad y privacidad absoluta. Sin cuentas, sin almacenamiento y sin publicidad invasiva.',
      'footer.featuredTools': 'Herramientas',
      'footer.categories': 'Categorías',
      'footer.aboutLinks': 'Acerca de',
      'footer.privacyPolicy': 'Política de Privacidad',
      'footer.github': 'Repositorio GitHub',
      'footer.copyright': 'Bandit Tools. Creado para desarrolladores, diseñadores y creadores.',
      'footer.clientSideBadge': '100% Procesamiento en Navegador',
    },
    en: {
      // Header & Navigation
      'nav.tools': 'Tools',
      'nav.categories': 'Categories',
      'nav.about': 'About',
      'nav.privacy': 'Privacy',
      'nav.info': 'Info',
      'nav.requestTool': 'Missing a tool?',
      'nav.searchPlaceholder': 'Search tools...',
      'nav.githubTitle': 'GitHub Repository',
      'nav.allTools': 'All tools',
      'nav.themeToggle': 'Switch theme (Dark / Light)',
      'nav.langToggle': 'Switch language (ES / EN)',

      // Hero
      'hero.badge': '100% In-Browser • Zero Server Storage',
      'hero.titleLine1': 'Everything you need.',
      'hero.titleLine2': "Nothing you don't.",
      'hero.description':
        'Free, simple tools for your everyday tasks. Compress files, transform images, format data, and get things done without creating an account.',
      'hero.searchPlaceholder': 'Search tools (e.g. compress image, JSON, password, QR)...',
      'hero.findBtn': 'Find Tool',
      'hero.browseAll': 'Browse All Tools',
      'hero.popular': 'Popular:',

      // Home Sections
      'home.featuredTitle': 'Featured Tools',
      'home.featuredDesc': 'Our most popular utilities, ready to use immediately.',
      'home.viewAll': 'View all {count} tools',
      'home.categoriesTitle': 'Explore by Category',
      'home.categoriesDesc': 'Find purpose-built tools organized by discipline.',
      'home.allCategories': 'All categories',
      'home.toolsCount': '{count} tools',
      'home.useTool': 'Use tool',

      // Workflow
      'home.howItWorksTitle': 'How It Works',
      'home.howItWorksDesc': 'Zero accounts, zero cookies, zero bloated pipelines. Three effortless steps:',
      'home.step1Title': '1. Choose a Tool',
      'home.step1Desc': 'Select from our curated directory of image, developer, text, and generator utilities.',
      'home.step2Title': '2. Upload or Input',
      'home.step2Desc': 'Drop your file or paste your raw text. Everything stays securely in your local browser sandbox.',
      'home.step3Title': '3. Instant Results',
      'home.step3Desc': 'Download your optimized file, copy clean data to your clipboard, or export formats instantly.',

      // Home Privacy Callout
      'home.privacyTitle': 'Built on Browser Privacy',
      'home.privacyP1':
        'Traditional online converter websites quietly upload your private images, code, and documents to their cloud servers.',
      'home.privacyP1Bold': 'Bandit Tools refuses to do that.',
      'home.privacyP2':
        'Every calculation, compression algorithm, and transcode runs locally using modern Web APIs. Your sensitive files and passwords never leave your machine.',
      'home.privacyReadMore': 'Read our Privacy Policy',
      'home.privacyLearnAbout': 'Learn About Bandit Tools',

      // Tools Directory
      'directory.title': 'Tools Directory',
      'directory.subtitle':
        'Every utility in Bandit Tools is fast, completely free, and processed 100% locally in your browser.',
      'directory.searchPlaceholder': 'Search by tool name, keywords, format...',
      'directory.allCategory': 'All Tools',
      'directory.showingCount': 'Showing {filtered} of {total} tools',
      'directory.clearFilters': 'Clear all filters',
      'directory.emptyTitle': 'No matching tools found',
      'directory.emptyDesc': 'We couldn\'t find any tools matching "{query}". Try adjusting your query.',
      'directory.resetBtn': 'Reset Filters',

      // Common Actions & Badges
      'action.copy': 'Copy',
      'action.copied': 'Copied!',
      'action.clear': 'Clear',
      'action.download': 'Download',
      'action.reset': 'Process another',
      'action.sample': 'Load sample',
      'action.regenerate': 'Regenerate',
      'action.format': 'Format',
      'action.minify': 'Minify',
      'badge.popular': 'Popular',
      'badge.fast': 'Fast',
      'badge.highRes': 'High-Res',
      'badge.essential': 'Essential',
      'badge.realtime': 'Realtime',
      'badge.crypto': 'Crypto-grade',

      // Privacy banner
      'privacy.bannerTitle': 'Client-Side Privacy Guarantee',
      'privacy.bannerDefault':
        'All calculations and file processing happen locally in your browser. No files, passwords, or data are ever transmitted to any backend.',

      // Footer
      'footer.tagline': 'Useful tools. Zero hassle.',
      'footer.about':
        'Free, browser-based online tools designed for speed and uncompromising privacy. No accounts, no data logging, no corporate bloat.',
      'footer.featuredTools': 'Featured Tools',
      'footer.categories': 'Categories',
      'footer.aboutLinks': 'About & Source',
      'footer.privacyPolicy': 'Privacy Policy',
      'footer.github': 'GitHub Repository',
      'footer.copyright': 'Bandit Tools. Built for developers, designers, and creators everywhere.',
      'footer.clientSideBadge': '100% Client-Side Processing',
    },
  };

  constructor() {
    this.initLanguage();

    effect(() => {
      const lang = this.currentLang();
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('lang', lang);
        localStorage.setItem(this.STORAGE_KEY, lang);
      }
    });
  }

  private initLanguage(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const savedLang = localStorage.getItem(this.STORAGE_KEY) as AppLanguage | null;
      if (savedLang === 'es' || savedLang === 'en') {
        this.currentLang.set(savedLang);
      } else {
        // Default is Spanish as requested
        this.currentLang.set('es');
      }
    }
  }

  setLanguage(lang: AppLanguage): void {
    this.currentLang.set(lang);
  }

  toggleLanguage(): void {
    this.currentLang.update((lang) => (lang === 'es' ? 'en' : 'es'));
  }

  t(key: string, params?: Record<string, string | number>): string {
    const lang = this.currentLang();
    let text = this.translations[lang]?.[key] || this.translations['es']?.[key] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, val]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
      });
    }

    return text;
  }
}
