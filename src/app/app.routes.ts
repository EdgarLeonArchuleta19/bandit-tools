import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'tools',
    loadComponent: () =>
      import('./features/tools/tools-directory/tools-directory.component').then(
        (m) => m.ToolsDirectoryComponent
      ),
  },
  {
    path: 'tools/image-compressor',
    loadComponent: () =>
      import(
        './features/tools/image-compressor/image-compressor.component'
      ).then((m) => m.ImageCompressorComponent),
  },
  {
    path: 'tools/image-converter',
    loadComponent: () =>
      import('./features/tools/image-converter/image-converter.component').then(
        (m) => m.ImageConverterComponent
      ),
  },
  {
    path: 'tools/qr-generator',
    loadComponent: () =>
      import('./features/tools/qr-generator/qr-generator.component').then(
        (m) => m.QrGeneratorComponent
      ),
  },
  {
    path: 'tools/json-formatter',
    loadComponent: () =>
      import('./features/tools/json-formatter/json-formatter.component').then(
        (m) => m.JsonFormatterComponent
      ),
  },
  {
    path: 'tools/word-counter',
    loadComponent: () =>
      import('./features/tools/word-counter/word-counter.component').then(
        (m) => m.WordCounterComponent
      ),
  },
  {
    path: 'tools/password-generator',
    loadComponent: () =>
      import(
        './features/tools/password-generator/password-generator.component'
      ).then((m) => m.PasswordGeneratorComponent),
  },
  {
    path: 'tools/youtube-downloader',
    loadComponent: () =>
      import(
        './features/tools/youtube-downloader/youtube-downloader.component'
      ).then((m) => m.YoutubeDownloaderComponent),
  },
  {
    path: 'tools/video-to-audio',
    loadComponent: () =>
      import(
        './features/tools/video-to-audio/video-to-audio.component'
      ).then((m) => m.VideoToAudioComponent),
  },
  {
    path: 'tools/video-editor',
    loadComponent: () =>
      import('./features/tools/video-editor/video-editor.component').then(
        (m) => m.VideoEditorComponent
      ),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./features/categories/categories.component').then(
        (m) => m.CategoriesComponent
      ),
  },
  {
    path: 'categories/:id',
    loadComponent: () =>
      import('./features/categories/category-detail.component').then(
        (m) => m.CategoryDetailComponent
      ),
  },
  {
    path: 'info',
    loadComponent: () =>
      import('./features/info/info.component').then((m) => m.InfoComponent),
  },
  {
    path: 'about',
    redirectTo: 'info',
    pathMatch: 'full',
  },
  {
    path: 'privacy',
    redirectTo: 'info',
    pathMatch: 'full',
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
