# ⚡ Bandit Tools

<div align="center">

<img src="./public/logo.svg" alt="Bandit Tools Logo" width="100" height="100" />

### **Utilidades esenciales. Cero complicaciones.**
*Essential web utilities executed instantly, privately, and client-side.*

[![Angular](https://img.shields.io/badge/Angular-22.2-DD0031?style=flat&logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-6E9F18?style=flat&logo=vitest&logoColor=white)](https://vitest.dev/)
[![GitHub Pages](https://img.shields.io/badge/Deployed%20on-GitHub%20Pages-222222?style=flat&logo=github&logoColor=white)](https://edgarleonarchuleta19.github.io/bandit-tools/)
[![License](https://img.shields.io/badge/License-All%20Rights%20Reserved-FCE300?style=flat&labelColor=111111&color=FCE300)](LICENSE)

[**🌐 Probar en vivo / Live Demo**](https://edgarleonarchuleta19.github.io/bandit-tools/) • [**✨ Reportar / Solicitar Herramienta**](mailto:edgar.langarica.dev@gmail.com)

</div>

---

## 📖 Descripción del Proyecto / Overview

**Bandit Tools** es una plataforma moderna, minimalista y de alto rendimiento que reúne herramientas esenciales para desarrolladores, creadores de contenido y usuarios cotidianos.

El principio central es la **privacidad y la velocidad**: todo el procesamiento de datos, compresión de imágenes, decodificación de audio, validación de código y generación de claves criptográficas ocurre **100% en la memoria local de tu navegador**, sin telemetría, sin cookies invasivas y sin subir archivos a servidores externos.

---

## 🛠️ Herramientas Disponibles / Available Tools (9)

### 📸 Imágenes
1. **Compresor de Imágenes (`/tools/image-compressor`)**
   - Compresión instantánea de archivos JPEG, PNG y WebP usando la API nativa HTML5 Canvas.
   - Control de calidad milimétrico (10% a 95%), selector de formato de salida y métricas de ahorro en bytes en tiempo real.
2. **Convertidor de Imágenes (`/tools/image-converter`)**
   - Conversión cruzada de formatos PNG, JPEG y WebP en memoria.
   - Preservación de transparencia, comparador de tamaño y descarga con un clic.

### 🎬 Video & Audio
3. **Descargador de YouTube (`/tools/youtube-downloader`)**
   - Descarga y conversión directa de enlaces de videos y YouTube Shorts a flujos de audio MP3/M4A y video MP4.
   - Sin publicidad emergente, sin intermediarios engañosos y con descarga directa al dispositivo.
4. **Extractor de Video a Audio (`/tools/video-to-audio`)**
   - Extrae pistas de audio desde cualquier archivo de video local (MP4, WebM, MOV, MKV, AVI).
   - Procesamiento 100% en el navegador utilizando la **Web Audio API** y codificación a WAV PCM estéreo de 16 bits sin pérdida.
5. **Amapa — Editor de Video (`/tools/video-editor`)**
   - Suite de edición de video web desarrollada por **Edgar León Archuleta**.
   - Permite cortar, montar y previsualizar secuencias de video directamente en el navegador sin marcas de agua.
   - Integración nativa embebida con modo pantalla completa y acceso directo a [Amapa Editor](https://edgarleonarchuleta19.github.io/amapa-editor/).

### 💻 Herramientas de Desarrollo & Texto
6. **Formateador y Validador JSON (`/tools/json-formatter`)**
   - Embellece con sangría de 2/4 espacios o tabuladores, y minifica en una sola línea.
   - Reporte de errores sintácticos con indicación de línea y columna exacta.
   - Estadísticas de tamaño, número de líneas y conteo total de claves recursivas.
7. **Contador de Palabras y Caracteres (`/tools/word-counter`)**
   - Análisis de texto en tiempo real: palabras, caracteres con/sin espacios, oraciones y párrafos.
   - Estimación de tiempo de lectura (200 WPM) y tiempo de oratoria (130 WPM).

### ⚡ Generadores
8. **Generador Criptográfico de Contraseñas (`/tools/password-generator`)**
   - Generación de claves con alta entropía usando `window.crypto.getRandomValues`.
   - Modos configurables para mayúsculas, minúsculas, números, símbolos y exclusión de caracteres ambiguos (`1`, `l`, `0`, `O`).
   - Medidor visual de entropía de Shannon y generación en lote.
9. **Generador de Códigos QR (`/tools/qr-generator`)**
   - Creación en vivo de códigos QR para URLs, texto libre o credenciales Wi-Fi protegidas (WPA/WEP).
   - Personalización completa de colores frontal y fondo, niveles de corrección de error (L, M, Q, H) y exportación dual a PNG de alta resolución o vector SVG.

---

## 🎨 Características de Diseño & UX

- **Estética Minimalista Eléctrica:** Paleta oscura profunda (`#0D0E0E`) con acento amarillo eléctrico (`#FCE300`), sin gradientes saturados ni elementos innecesarios.
- **Logo Minimalista:** Emblema limpio de rayo geométrico en formato SVG vectorial.
- **Buscador Inteligente:** Filtrado reactivo en vivo por nombre de herramienta, etiquetas y palabras clave.
- **Buzón Directo de Sugerencias:** Modal para solicitar nuevas herramientas directamente al correo del autor sin requerir backend adicional.
- **Internacionalización Completa:** Soporte fluido para Español (`es`) e Inglés (`en`).
- **Modo Claro / Oscuro:** Cambio instantáneo con persistencia en `localStorage`.

---

## 🏗️ Stack Tecnológico

| Capa | Tecnología |
| :--- | :--- |
| **Framework** | [Angular 22](https://angular.dev/) (Standalone Components, Signals, Deferrable Views) |
| **Lenguaje** | [TypeScript 6](https://www.typescriptlang.org/) |
| **Estilos** | SCSS Modular, Variables CSS, Tokens de Diseño y Mixins Flexibles |
| **Testing** | [Vitest](https://vitest.dev/) con Angular Testing Platform (110+ unit tests) |
| **Procesamiento** | HTML5 Canvas API, Web Audio API, Web Crypto API |
| **Despliegue** | GitHub Pages mediante [GitHub Actions Workflow](.github/workflows/deploy.yml) |

---

## 📁 Estructura del Código

```text
bandit-tools/
├── .github/
│   └── workflows/
│       └── deploy.yml                  # Despliegue automático continuo a GitHub Pages
├── public/
│   ├── logo.svg                        # Logotipo vectorial oficial
│   ├── logo.png                        # Raster favicon y OpenGraph
│   └── favicon.ico                     # Icono de navegador
├── src/
│   ├── app/
│   │   ├── core/                       # Servicios core, modelos y constantes
│   │   │   ├── constants/              # Metadatos globales y enlaces
│   │   │   ├── models/                 # Modelos de herramientas y categorías
│   │   │   └── services/               # Registro de herramientas, SEO, i18n, temas
│   │   ├── shared/                     # Componentes y pipes reutilizables
│   │   │   ├── components/             # Dropzone, Iconos SVG, Tool Header, Cards
│   │   │   └── pipes/                  # ByteSizePipe
│   │   ├── layout/                     # Encabezado responsive y pie de página
│   │   └── features/                   # Páginas y herramientas lazy-loaded
│   │       ├── home/                   # Pantalla principal con buscador y filtros
│   │       ├── info/                   # Acerca de, filosofía y política de privacidad
│   │       ├── not-found/              # Manejo elegante de rutas 404
│   │       └── tools/
│   │           ├── image-compressor/   # Compresor de imágenes Canvas
│   │           ├── image-converter/    # Convertidor multiformato
│   │           ├── youtube-downloader/ # Descargador de YouTube a MP3/MP4
│   │           ├── video-to-audio/     # Extractor Web Audio API a WAV
│   │           ├── video-editor/       # Integración con Amapa Video Editor
│   │           ├── json-formatter/     # Formateador y validador JSON
│   │           ├── word-counter/       # Contador de métricas de texto
│   │           ├── password-generator/ # Generador Web Crypto
│   │           └── qr-generator/       # Generador de códigos QR
│   ├── styles/                         # Sistema de diseño SCSS
│   └── main.ts                         # Punto de entrada de la aplicación
├── LICENSE                             # Licencia de Derechos Reservados
├── package.json                        # Scripts y dependencias
└── README.md                           # Documentación del proyecto
```

---

## 🚀 Instalación y Desarrollo Local

### Prerrequisitos
- **Node.js:** Versión 18 o superior (recomendado v20 o v22 LTS).
- **npm:** Versión 9 o superior.

### Pasos
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/EdgarLeonArchuleta19/bandit-tools.git
   cd bandit-tools
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor local de desarrollo:
   ```bash
   npm start
   ```
   Abre tu navegador en `http://localhost:4200/`.

4. Ejecutar la suite completa de pruebas unitarias:
   ```bash
   npm test
   ```

5. Compilar para producción:
   ```bash
   npm run build
   ```

6. Compilar específicamente para GitHub Pages (con base-href):
   ```bash
   npm run build:pages
   ```

---

## 🌐 Despliegue en GitHub Pages

Este repositorio cuenta con un flujo automatizado de CI/CD configurado en `.github/workflows/deploy.yml`:
1. Cada `push` a la rama `main` ejecuta los tests unitarios.
2. Compila el bundle optimizado con `--base-href /bandit-tools/`.
3. Configura el enrutamiento para Single Page Applications (SPA) duplicando `index.html` en `404.html`.
4. Añade `.nojekyll` y publica el sitio en:
   **https://edgarleonarchuleta19.github.io/bandit-tools/**

---

## ⚖️ Licencia / License

Copyright &copy; 2026 **Edgar León Archuleta**.  
Todos los derechos reservados / All Rights Reserved.

Consulta el archivo [LICENSE](LICENSE) para más detalles.
