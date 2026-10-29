import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { APP_CONSTANTS } from '../constants/app.constants';

export interface SeoConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalPath?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);

  updateSeo(config: SeoConfig): void {
    const fullTitle = config.title
      ? `${config.title} — ${APP_CONSTANTS.name}`
      : `${APP_CONSTANTS.name} — ${APP_CONSTANTS.tagline}`;

    const description = config.description || APP_CONSTANTS.description;

    this.titleService.setTitle(fullTitle);

    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:title', content: fullTitle });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'twitter:title', content: fullTitle });
    this.metaService.updateTag({ property: 'twitter:description', content: description });

    if (config.keywords && config.keywords.length > 0) {
      this.metaService.updateTag({ name: 'keywords', content: config.keywords.join(', ') });
    }
  }

  resetToDefault(): void {
    this.updateSeo({
      title: undefined,
      description: APP_CONSTANTS.description,
    });
  }
}
