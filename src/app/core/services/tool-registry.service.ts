import { Injectable, inject, computed } from '@angular/core';
import { ToolCategory, ToolCategoryId, ToolDefinition } from '../models/tool.model';
import { TranslationService } from './translation.service';

@Injectable({
  providedIn: 'root',
})
export class ToolRegistryService {
  private readonly i18n = inject(TranslationService);

  readonly categories = computed<ToolCategory[]>(() => {
    const isEs = this.i18n.currentLang() === 'es';
    return [
      {
        id: 'images',
        name: isEs ? 'Imágenes' : 'Images',
        description: isEs
          ? 'Comprime, convierte y optimiza imágenes directamente en tu navegador.'
          : 'Compress, convert, and optimize images directly in the browser.',
        icon: 'image',
      },
      {
        id: 'media',
        name: isEs ? 'Video y Audio' : 'Video & Audio',
        description: isEs
          ? 'Descarga videos de YouTube, edita clips y extrae pistas de audio en tu navegador.'
          : 'Download YouTube media, edit clips, and extract audio tracks directly in your browser.',
        icon: 'video',
      },
      {
        id: 'developer-tools',
        name: isEs ? 'Herramientas de Desarrollo' : 'Developer Tools',
        description: isEs
          ? 'Inspecciona, formatea, analiza y valida código y datos estructurados.'
          : 'Inspect, format, parse, and validate code and structured data.',
        icon: 'code',
      },
      {
        id: 'generators',
        name: isEs ? 'Generadores' : 'Generators',
        description: isEs
          ? 'Crea contraseñas criptográficas, códigos QR y utilidades al instante.'
          : 'Create cryptographically secure passwords, QR codes, and more.',
        icon: 'sparkles',
      },
      {
        id: 'text',
        name: isEs ? 'Texto' : 'Text',
        description: isEs
          ? 'Cuenta palabras, caracteres, oraciones y mide tiempos de lectura.'
          : 'Count words, characters, sentences, and measure reading times.',
        icon: 'file-text',
      },
    ];
  });

  readonly tools = computed<ToolDefinition[]>(() => {
    const isEs = this.i18n.currentLang() === 'es';
    return [
      {
        id: 'image-compressor',
        name: isEs ? 'Compresor de Imágenes' : 'Image Compressor',
        tagline: isEs
          ? 'Reduce el tamaño de tus imágenes sin perder calidad visual.'
          : 'Reduce image file size with zero quality compromise.',
        description: isEs
          ? 'Comprime imágenes JPEG, PNG y WebP directamente en tu navegador. Ajusta calidad y formatos sin enviar archivos a ningún servidor.'
          : 'Compress JPEG, PNG, and WebP images directly in your browser. Fine-tune quality and output formats without sending files anywhere.',
        category: 'images',
        icon: 'compress',
        route: '/tools/image-compressor',
        keywords: [
          'compress',
          'comprimir',
          'optimize',
          'optimizar',
          'image',
          'imagen',
          'jpeg',
          'png',
          'webp',
          'foto',
          'tamaño',
        ],
        isFeatured: true,
        badge: isEs ? 'Popular' : 'Popular',
        privacyNote: isEs
          ? 'Tus imágenes se procesan 100% en tu navegador con la API HTML Canvas. Ninguna imagen se sube a servidores.'
          : 'Your images are processed entirely inside your browser via the HTML Canvas API. No images are ever uploaded to any server.',
        instructions: {
          title: isEs ? 'Cómo comprimir imágenes' : 'How to compress images',
          steps: isEs
            ? [
                'Arrastra o selecciona una imagen desde tu dispositivo',
                'Ajusta el control de calidad para equilibrar tamaño y nitidez',
                'Selecciona el formato de salida (mantener original, WebP o JPEG)',
                'Haz clic en Descargar Comprimida para guardar tu archivo optimizado',
              ]
            : [
                'Drop or select an image from your device',
                'Adjust the quality slider to find your balance of size and visual clarity',
                'Select the output format (preserve original format, WebP, or JPEG)',
                'Click Download Compressed to save your optimized file',
              ],
        },
        relatedToolIds: ['image-converter', 'qr-generator'],
      },
      {
        id: 'image-converter',
        name: isEs ? 'Convertidor de Imágenes' : 'Image Converter',
        tagline: isEs
          ? 'Convierte entre formatos PNG, JPEG y WebP con un clic.'
          : 'Convert between PNG, JPEG, and WebP formats.',
        description: isEs
          ? 'Transforma archivos de imagen con total privacidad local. Previsualiza el resultado y compara tamaños antes de descargar.'
          : 'Transform image files quickly with full client-side privacy. Preview the conversion result and compare file sizes before downloading.',
        category: 'images',
        icon: 'refresh-cw',
        route: '/tools/image-converter',
        keywords: [
          'convert',
          'convertir',
          'format',
          'formato',
          'image',
          'imagen',
          'png to jpg',
          'jpg to png',
          'webp',
        ],
        isFeatured: true,
        badge: isEs ? 'Rápido' : 'Fast',
        privacyNote: isEs
          ? 'Conversión 100% local. Tus archivos nunca salen de tu ordenador.'
          : '100% local conversion. Files never leave your device.',
        instructions: {
          title: isEs ? 'Cómo convertir imágenes' : 'How to convert images',
          steps: isEs
            ? [
                'Sube tu archivo de imagen (PNG, JPG o WebP)',
                'Selecciona tu formato de destino deseado',
                'Ajusta la calidad si conviertes a formatos con compresión',
                'Descarga tu imagen convertida al instante',
              ]
            : [
                'Upload your image file (PNG, JPG, or WebP)',
                'Select your desired target format',
                'Tune the quality if converting to lossy formats',
                'Download your converted image immediately',
              ],
        },
        relatedToolIds: ['image-compressor', 'qr-generator'],
      },
      {
        id: 'qr-generator',
        name: isEs ? 'Generador de Códigos QR' : 'QR Code Generator',
        tagline: isEs
          ? 'Crea códigos QR personalizados en alta resolución al instante.'
          : 'Create custom, high-resolution QR codes instantly.',
        description: isEs
          ? 'Genera códigos QR limpios para enlaces, texto o credenciales Wi-Fi con colores personalizables y descarga en PNG o SVG vectorial.'
          : 'Generate clean QR codes for URLs, text, Wi-Fi credentials, or contact info with customizable colors and PNG/SVG export.',
        category: 'generators',
        icon: 'qr-code',
        route: '/tools/qr-generator',
        keywords: ['qr', 'code', 'codigo qr', 'generator', 'generador', 'wifi', 'svg', 'png'],
        isFeatured: true,
        badge: isEs ? 'Alta Res' : 'High-Res',
        privacyNote: isEs
          ? 'Los códigos QR se generan en tu navegador. Los datos que codificas nunca se transmiten.'
          : 'QR codes are rendered client-side. The data you encode is never transmitted.',
        instructions: {
          title: isEs ? 'Cómo generar códigos QR' : 'How to generate QR codes',
          steps: isEs
            ? [
                'Escribe o pega cualquier enlace, texto o datos de Wi-Fi',
                'Personaliza los colores de frente y fondo para tu marca',
                'Ajusta la resolución y nivel de corrección de errores',
                'Descarga en PNG de alta resolución o formato SVG vectorial',
              ]
            : [
                'Type or paste any URL, text, or data into the input box',
                'Customize the foreground and background colors to match your brand',
                'Adjust the resolution and error correction level as needed',
                'Download as a high-resolution PNG or vector SVG',
              ],
        },
        relatedToolIds: ['password-generator', 'image-compressor'],
      },
      {
        id: 'json-formatter',
        name: isEs ? 'Formateador y Validador JSON' : 'JSON Formatter & Validator',
        tagline: isEs
          ? 'Embellece, valida y minifica documentos JSON sin esfuerzo.'
          : 'Beautify, validate, and minify JSON data effortlessly.',
        description: isEs
          ? 'Formatea estructuras JSON anidadas con sangrías configurables, valida sintaxis con reporte de línea/columna y minifica con un clic.'
          : 'Format nested JSON documents with customizable indentations, syntax validation with precise error reporting, and one-click minification.',
        category: 'developer-tools',
        icon: 'code',
        route: '/tools/json-formatter',
        keywords: [
          'json',
          'format',
          'formatear',
          'validar',
          'validate',
          'minify',
          'minificar',
          'pretty print',
          'desarrollador',
        ],
        isFeatured: true,
        badge: isEs ? 'Esencial' : 'Essential',
        privacyNote: isEs
          ? 'El análisis se realiza en tu motor JavaScript local. Tus datos confidenciales permanecen protegidos.'
          : 'Data parsing happens in your local JavaScript runtime. Your confidential JSON payloads stay confidential.',
        instructions: {
          title: isEs ? 'Cómo formatear JSON' : 'How to format JSON',
          steps: isEs
            ? [
                'Pega tu JSON o haz clic en "Cargar ejemplo" para probar',
                'Haz clic en "Formatear" o "Minificar" según tu preferencia',
                'Revisa cualquier error de sintaxis que indique la línea o posición exacta',
                'Copia el resultado a tu portapapeles con un clic',
              ]
            : [
                'Paste your JSON string or click "Load Sample" to test',
                'Click "Beautify" to format with clean indentations or "Minify" to compact',
                'Inspect any syntax error messages highlighting the exact line or token problem',
                'Copy the result to your clipboard with one click',
              ],
        },
        relatedToolIds: ['word-counter', 'password-generator'],
      },
      {
        id: 'word-counter',
        name: isEs ? 'Contador de Palabras y Caracteres' : 'Word & Character Counter',
        tagline: isEs
          ? 'Métricas de texto en tiempo real y tiempo estimado de lectura.'
          : 'Real-time text metrics, readability, and reading time.',
        description: isEs
          ? 'Calcula con precisión palabras, caracteres (con y sin espacios), oraciones, párrafos y tiempo estimado de lectura en vivo mientras escribes.'
          : 'Calculate exact word counts, characters with and without spaces, sentences, paragraphs, and estimated reading and speaking times as you type.',
        category: 'text',
        icon: 'file-text',
        route: '/tools/word-counter',
        keywords: [
          'word',
          'palabra',
          'count',
          'contador',
          'caracteres',
          'character',
          'text',
          'texto',
          'lectura',
        ],
        isFeatured: false,
        badge: isEs ? 'Tiempo real' : 'Realtime',
        privacyNote: isEs
          ? 'El análisis de texto se calcula en la memoria de tu navegador. Nada se almacena ni se transmite.'
          : 'Text analysis is computed live in your browser memory. Nothing is stored or transmitted.',
        instructions: {
          title: isEs ? 'Cómo usar el contador de palabras' : 'How to use word counter',
          steps: isEs
            ? [
                'Escribe o pega tu texto en el editor',
                'Observa cómo se actualizan las métricas en vivo al instante',
                'Usa los botones de copiar o limpiar según lo necesites',
              ]
            : [
                'Type or paste your text into the editor',
                'Watch the live counters update instantly with words, characters, and reading time',
                'Use the copy or clear buttons to manage your text snippet',
              ],
        },
        relatedToolIds: ['json-formatter', 'password-generator'],
      },
      {
        id: 'password-generator',
        name: isEs ? 'Generador Seguro de Contraseñas' : 'Secure Password Generator',
        tagline: isEs
          ? 'Genera contraseñas criptográficamente fuertes en local.'
          : 'Generate cryptographically strong passwords locally.',
        description: isEs
          ? 'Genera claves de alta entropía usando la API Web Crypto del navegador. Personaliza longitud, caracteres y excluye caracteres ambiguos.'
          : 'Generate high-entropy, randomized passwords using the browser Crypto API. Customize length, character sets, and avoid ambiguous characters.',
        category: 'generators',
        icon: 'shield',
        route: '/tools/password-generator',
        keywords: [
          'password',
          'contraseña',
          'generator',
          'generador',
          'seguridad',
          'crypto',
          'clave',
          'segura',
        ],
        isFeatured: true,
        badge: isEs ? 'Cripto-seguro' : 'Crypto-grade',
        privacyNote: isEs
          ? 'Generadas con Web Cryptography API (crypto.getRandomValues). Las contraseñas nunca se guardan ni se envían.'
          : 'Generated entirely with Web Cryptography API (crypto.getRandomValues). Passwords are never sent or stored anywhere.',
        instructions: {
          title: isEs ? 'Cómo generar contraseñas seguras' : 'How to generate secure passwords',
          steps: isEs
            ? [
                'Selecciona la longitud deseada con el control deslizante',
                'Activa o desactiva mayúsculas, minúsculas, números y símbolos',
                'Opcionalmente excluye caracteres ambiguos (1, l, 0, O) para evitar confusión',
                'Haz clic en "Regenerar" para obtener otra y en "Copiar" para guardarla',
              ]
            : [
                'Select your desired password length',
                'Toggle character sets: uppercase, lowercase, numbers, and symbols',
                'Optionally exclude ambiguous characters (like 1, l, 0, O) for easier reading',
                'Click "Regenerate" for a fresh pass and "Copy" to save it securely',
              ],
        },
        relatedToolIds: ['qr-generator', 'json-formatter'],
      },
      {
        id: 'youtube-downloader',
        name: isEs ? 'Descargador de YouTube' : 'YouTube Downloader',
        tagline: isEs
          ? 'Descarga videos y audios de YouTube en MP3 y MP4.'
          : 'Download YouTube videos and audio to MP3 and MP4.',
        description: isEs
          ? 'Convierte y descarga videos o Shorts de YouTube a flujos de audio MP3/M4A y video MP4 de forma directa, limpia y sin anuncios.'
          : 'Convert and download YouTube videos or Shorts to clean MP3/M4A audio and MP4 video streams with zero spam ads.',
        category: 'media',
        icon: 'youtube',
        route: '/tools/youtube-downloader',
        keywords: [
          'youtube',
          'mp3',
          'mp4',
          'descargar',
          'convertidor',
          'download',
          'converter',
          'shorts',
          'audio',
          'video',
        ],
        isFeatured: true,
        privacyNote: isEs
          ? 'Procesado mediante APIs abiertas de alto rendimiento sin telemetría ni publicidad invasiva.'
          : 'Streamed through open-source high performance APIs with zero invasive ads.',
        instructions: {
          title: isEs ? 'Cómo descargar videos de YouTube' : 'How to download YouTube videos',
          steps: isEs
            ? [
                'Pega el enlace del video o Short en la barra de búsqueda',
                'Haz clic en "Obtener Enlaces"',
                'Elige entre Audio (MP3/M4A) o Video (MP4)',
                'Haz clic en "Descargar" para guardar el archivo',
              ]
            : [
                'Paste the video or Short URL into the search field',
                'Click "Get Download Links"',
                'Choose between Audio (MP3/M4A) or Video (MP4)',
                'Click "Download" to save your media',
              ],
        },
        relatedToolIds: ['video-to-audio', 'video-editor'],
      },
      {
        id: 'video-to-audio',
        name: isEs ? 'Extractor de Video a Audio' : 'Video to Audio Converter',
        tagline: isEs
          ? 'Extrae el audio de cualquier video local sin subirlo a internet.'
          : 'Extract high-fidelity audio from any local video without uploading.',
        description: isEs
          ? 'Decodifica la pista de sonido de videos MP4, WebM, MOV, MKV o AVI y expórtala en audio WAV de alta fidelidad 100% en tu navegador con Web Audio API.'
          : 'Decode audio tracks from MP4, WebM, MOV, MKV, or AVI videos directly in local memory and export pristine 16-bit PCM WAV using Web Audio API.',
        category: 'media',
        icon: 'music',
        route: '/tools/video-to-audio',
        keywords: [
          'video',
          'audio',
          'wav',
          'mp3',
          'extraer',
          'convertir',
          'mp4 a mp3',
          'extract',
          'converter',
          'sound',
          'local',
        ],
        isFeatured: true,
        privacyNote: isEs
          ? '100% procesado en la memoria local de tu navegador. El video nunca sale de tu equipo.'
          : '100% client-side memory processing. Your video never leaves your machine.',
        instructions: {
          title: isEs ? 'Cómo extraer audio de un video' : 'How to extract audio from video',
          steps: isEs
            ? [
                'Arrastra un archivo de video (MP4, WebM, MOV, etc.)',
                'La herramienta decodificará automáticamente el flujo de sonido localmente',
                'Reproduce una vista previa del audio extraído',
                'Haz clic en "Descargar Audio (.WAV)" para guardarlo',
              ]
            : [
                'Drop any video file (MP4, WebM, MOV, etc.)',
                'The browser automatically decodes the sound track in memory',
                'Listen to the audio preview',
                'Click "Download Audio (.WAV)" to save your sound file',
              ],
        },
        relatedToolIds: ['youtube-downloader', 'video-editor'],
      },
      {
        id: 'video-editor',
        name: isEs ? 'Amapa — Editor de Video' : 'Amapa — Video Editor',
        tagline: isEs
          ? 'Editor de video web rápido, intuitivo y sin marcas de agua.'
          : 'Fast, intuitive, client-side web video editor.',
        description: isEs
          ? 'Crea, recorta y monta clips de video directamente en tu navegador con la suite libre Amapa Editor.'
          : 'Create, trim, and assemble video clips directly in your browser with the free Amapa Editor suite.',
        category: 'media',
        icon: 'video',
        route: '/tools/video-editor',
        keywords: [
          'video',
          'editor',
          'amapa',
          'recortar',
          'cortar',
          'clip',
          'montaje',
          'edicion',
          'timeline',
          'trim',
        ],
        isFeatured: true,
        badge: isEs ? 'Suite Web' : 'Web Suite',
        privacyNote: isEs
          ? 'Herramienta web client-side desarrollada por Edgar León Archuleta.'
          : 'Client-side web tool developed by Edgar León Archuleta.',
        instructions: {
          title: isEs ? 'Cómo usar Amapa Editor de Video' : 'How to use Amapa Video Editor',
          steps: isEs
            ? [
                'Usa el editor integrado o ábrelo en pantalla completa',
                'Importa tus clips de video locales',
                'Ajusta la línea de tiempo, cortes y transiciones',
                'Exporta tu video renderizado en local',
              ]
            : [
                'Use the embedded editor or open it full screen',
                'Import your local video clips',
                'Adjust the timeline, cuts, and transitions',
                'Export your rendered video locally',
              ],
        },
        relatedToolIds: ['video-to-audio', 'youtube-downloader'],
      },
    ];
  });

  readonly featuredTools = computed(() => this.tools().filter((t) => t.isFeatured));

  getAllTools(): ToolDefinition[] {
    return this.tools();
  }

  getFeaturedTools(): ToolDefinition[] {
    return this.featuredTools();
  }

  getToolById(id: string): ToolDefinition | undefined {
    return this.tools().find((t) => t.id === id);
  }

  getToolsByCategory(categoryId: ToolCategoryId): ToolDefinition[] {
    return this.tools().filter((t) => t.category === categoryId);
  }

  getCategories(): ToolCategory[] {
    return this.categories();
  }

  getCategoryById(id: string): ToolCategory | undefined {
    return this.categories().find((c) => c.id === id);
  }

  getRelatedTools(toolId: string): ToolDefinition[] {
    const tool = this.getToolById(toolId);
    if (!tool) return [];
    return tool.relatedToolIds
      .map((id) => this.getToolById(id))
      .filter((t): t is ToolDefinition => !!t);
  }

  searchTools(query: string, categoryId?: ToolCategoryId | 'all'): ToolDefinition[] {
    const q = query.trim().toLowerCase();
    let list = this.tools();

    if (categoryId && categoryId !== 'all') {
      list = list.filter((tool) => tool.category === categoryId);
    }

    if (!q) {
      return list;
    }

    return list.filter((tool) => {
      const matchName = tool.name.toLowerCase().includes(q);
      const matchDesc = tool.description.toLowerCase().includes(q);
      const matchTagline = tool.tagline.toLowerCase().includes(q);
      const matchKeywords = tool.keywords.some((k) => k.toLowerCase().includes(q));
      return matchName || matchDesc || matchTagline || matchKeywords;
    });
  }
}
