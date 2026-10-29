import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { TranslationService } from '../../core/services/translation.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'bt-not-found',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <div class="not-found-page">
      <div class="not-found-inner">
        <div class="lightning-logo-wrap">
          <img src="/logo.svg" alt="Bandit Tools Logo" class="lightning-img" />
        </div>
        <div class="error-code">404</div>
        <h1 class="not-found-title">
          {{ i18n.currentLang() === 'es' ? 'Página no encontrada' : 'Page not found' }}
        </h1>
        <p class="not-found-desc">
          {{ i18n.currentLang() === 'es'
            ? 'La herramienta o página que buscas no existe o ha sido movida.'
            : 'The tool or page you are looking for does not exist or has been moved.' }}
        </p>

        <div class="actions-group">
          <a routerLink="/" class="btn btn-primary btn-lg">
            <bt-icon name="arrow-left" [size]="18" />
            <span>{{ i18n.currentLang() === 'es' ? 'Volver al Inicio' : 'Back to Home' }}</span>
          </a>
          <a routerLink="/tools" class="btn btn-secondary btn-lg">
            <span>{{ i18n.t('nav.allTools') }}</span>
          </a>
        </div>

        <div class="popular-suggestions">
          <span class="suggestions-label">
            {{ i18n.currentLang() === 'es' ? '¿Buscabas alguna de estas utilidades?' : 'Looking for one of these?' }}
          </span>
          <div class="suggestions-links">
            <a routerLink="/tools/image-compressor" class="suggest-link">Compresor de Imágenes</a>
            <a routerLink="/tools/json-formatter" class="suggest-link">Formateador JSON</a>
            <a routerLink="/tools/password-generator" class="suggest-link">Generador de Contraseñas</a>
            <a routerLink="/tools/qr-generator" class="suggest-link">Generador QR</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @use 'styles/variables' as *;
      @use 'styles/mixins' as *;

      .not-found-page {
        padding-top: $spacing-16;
        padding-bottom: $spacing-20;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
      }

      .not-found-inner {
        @include container;
        max-width: 600px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: $spacing-5;
      }

      .lightning-logo-wrap {
        width: 56px;
        height: 56px;
        border-radius: $radius-lg;
        overflow: hidden;
        border: 1px solid $border-color;
        background-color: $bg-surface;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .lightning-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .error-code {
        font-size: 5rem;
        font-weight: 900;
        letter-spacing: -0.05em;
        line-height: 1;
        color: $accent-yellow;
        text-shadow: 0 0 30px var(--accent-yellow-glow);
      }

      .not-found-title {
        font-size: $font-3xl;
        font-weight: 700;
        color: $text-primary;
      }

      .not-found-desc {
        font-size: $font-base;
        color: $text-secondary;
        line-height: 1.6;
      }

      .actions-group {
        display: flex;
        gap: $spacing-3;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: $spacing-4;
      }

      .popular-suggestions {
        margin-top: $spacing-8;
        display: flex;
        flex-direction: column;
        gap: $spacing-3;
        padding-top: $spacing-6;
        border-top: 1px solid $border-color;
        width: 100%;
      }

      .suggestions-label {
        font-size: $font-xs;
        color: $text-muted;
      }

      .suggestions-links {
        display: flex;
        gap: $spacing-2;
        flex-wrap: wrap;
        justify-content: center;
      }

      .suggest-link {
        font-size: $font-xs;
        color: $text-secondary;
        background-color: $bg-surface;
        border: 1px solid $border-color;
        padding: 4px $spacing-3;
        border-radius: $radius-full;
        transition: all $transition-fast;

        &:hover {
          color: $accent-yellow;
          border-color: $accent-yellow;
        }

        @include focus-ring;
      }
    `,
  ],
})
export class NotFoundComponent implements OnInit {
  private readonly seoService = inject(SeoService);
  protected readonly i18n = inject(TranslationService);

  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'Página no encontrada (404)',
      description: 'La página o herramienta solicitada no existe.',
    });
  }
}
