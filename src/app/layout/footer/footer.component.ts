import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APP_CONSTANTS } from '../../core/constants/app.constants';
import { TranslationService } from '../../core/services/translation.service';
import { ToolRequestService } from '../../core/services/tool-request.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'bt-footer',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-grid">
          <!-- Col 1: Brand & Promise -->
          <div class="footer-col brand-col">
            <div class="brand">
              <div class="brand-logo-wrap">
                <img src="/logo.svg" alt="Bandit Tools Logo" class="brand-img" />
              </div>
              <span class="brand-name">Bandit<span class="brand-dot">.</span>Tools</span>
            </div>
            <p class="tagline">{{ i18n.t('footer.tagline') }}</p>
            <p class="privacy-note">
              {{ i18n.t('footer.about') }}
            </p>
          </div>

          <!-- Col 2: Featured Utilities -->
          <div class="footer-col">
            <h4 class="col-title">{{ i18n.currentLang() === 'es' ? 'Herramientas' : 'Utilities' }}</h4>
            <ul class="col-links">
              <li><a routerLink="/tools/image-compressor">{{ i18n.currentLang() === 'es' ? 'Compresor de Imágenes' : 'Image Compressor' }}</a></li>
              <li><a routerLink="/tools/image-converter">{{ i18n.currentLang() === 'es' ? 'Convertidor de Imágenes' : 'Image Converter' }}</a></li>
              <li><a routerLink="/tools/qr-generator">{{ i18n.currentLang() === 'es' ? 'Generador de Códigos QR' : 'QR Code Generator' }}</a></li>
              <li><a routerLink="/tools/json-formatter">{{ i18n.currentLang() === 'es' ? 'Formateador JSON' : 'JSON Formatter' }}</a></li>
              <li><a routerLink="/tools/word-counter">{{ i18n.currentLang() === 'es' ? 'Contador de Palabras' : 'Word Counter' }}</a></li>
              <li><a routerLink="/tools/password-generator">{{ i18n.currentLang() === 'es' ? 'Generador de Contraseñas' : 'Password Generator' }}</a></li>
              <li><a routerLink="/tools/youtube-downloader">{{ i18n.currentLang() === 'es' ? 'Descargador de YouTube' : 'YouTube Downloader' }}</a></li>
              <li><a routerLink="/tools/video-to-audio">{{ i18n.currentLang() === 'es' ? 'Extractor de Video a Audio' : 'Video to Audio Converter' }}</a></li>
              <li><a routerLink="/tools/video-editor">{{ i18n.currentLang() === 'es' ? 'Amapa — Editor de Video' : 'Amapa — Video Editor' }}</a></li>
            </ul>
          </div>

          <!-- Col 3: Enlaces y Solicitudes -->
          <div class="footer-col">
            <h4 class="col-title">{{ i18n.currentLang() === 'es' ? 'Navegación' : 'Navigation' }}</h4>
            <ul class="col-links">
              <li><a routerLink="/">{{ i18n.currentLang() === 'es' ? 'Inicio' : 'Home' }}</a></li>
              <li><a routerLink="/info">{{ i18n.currentLang() === 'es' ? 'Info y Privacidad' : 'About & Privacy' }}</a></li>
              <li>
                <button type="button" class="footer-action-link" (click)="toolRequestService.openModal()">
                  <bt-icon name="sparkles" [size]="14" />
                  <span>{{ i18n.currentLang() === 'es' ? '¿No encontraste lo que buscabas?' : "Missing a tool?" }}</span>
                </button>
              </li>
              <li>
                <a [href]="githubUrl" target="_blank" rel="noopener noreferrer" class="external-link">
                  <span>{{ i18n.t('footer.github') }}</span>
                  <bt-icon name="external-link" [size]="14" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p class="copyright">
            &copy; {{ currentYear }} Bandit Tools • {{ i18n.currentLang() === 'es' ? 'Todos los derechos reservados. Desarrollado por Edgar León Archuleta' : 'All Rights Reserved. Built by Edgar León Archuleta' }}
          </p>
          <div class="status-indicator">
            <span class="status-dot"></span>
            <span>{{ i18n.t('footer.clientSideBadge') }}</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      @use 'styles/variables' as *;
      @use 'styles/mixins' as *;

      .site-footer {
        background-color: $bg-secondary;
        border-top: 1px solid $border-color;
        margin-top: auto;
        padding-top: $spacing-12;
        padding-bottom: $spacing-8;
        transition: background-color $transition-normal, border-color $transition-normal;
      }

      .footer-inner {
        @include container;
      }

      .footer-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: $spacing-8;
        margin-bottom: $spacing-12;

        @include tablet {
          grid-template-columns: repeat(2, 1fr);
        }

        @include desktop {
          grid-template-columns: 2fr 1.2fr 1fr;
        }
      }

      .brand {
        display: flex;
        align-items: center;
        gap: $spacing-3;
        margin-bottom: $spacing-3;
      }

      .brand-logo-wrap {
        width: 36px;
        height: 36px;
        border-radius: $radius-md;
        overflow: hidden;
        background-color: $bg-surface;
        border: 1px solid $border-color;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .brand-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .brand-name {
        font-size: $font-lg;
        font-weight: 700;
        color: $text-primary;
      }

      .brand-dot {
        color: $accent-yellow;
      }

      .tagline {
        color: $text-primary;
        font-size: $font-sm;
        font-weight: 600;
        margin-bottom: $spacing-2;
      }

      .privacy-note {
        color: $text-muted;
        font-size: $font-xs;
        line-height: 1.6;
        max-width: 320px;
      }

      .col-title {
        color: $text-primary;
        font-size: $font-sm;
        font-weight: 600;
        margin-bottom: $spacing-4;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .col-links {
        display: flex;
        flex-direction: column;
        gap: $spacing-2;

        a {
          color: $text-secondary;
          font-size: $font-sm;
          transition: color $transition-fast;

          &:hover {
            color: $accent-yellow;
          }

          @include focus-ring;
        }
      }

      .footer-action-link {
        display: inline-flex;
        align-items: center;
        gap: $spacing-2;
        background: none;
        border: none;
        padding: 0;
        color: $accent-yellow;
        font-size: $font-sm;
        font-weight: 500;
        cursor: pointer;
        text-align: left;
        transition: all $transition-fast;

        &:hover {
          color: $accent-yellow-hover;
          transform: translateX(2px);
        }

        @include focus-ring;
      }

      .external-link {
        display: inline-flex;
        align-items: center;
        gap: $spacing-1;
      }

      .footer-bottom {
        display: flex;
        flex-direction: column;
        gap: $spacing-4;
        align-items: center;
        justify-content: space-between;
        padding-top: $spacing-6;
        border-top: 1px solid $border-color;
        font-size: $font-xs;
        color: $text-muted;

        @include tablet-up {
          flex-direction: row;
        }
      }

      .status-indicator {
        display: flex;
        align-items: center;
        gap: $spacing-2;
        color: $text-secondary;
      }

      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: $radius-full;
        background-color: $color-success;
        box-shadow: 0 0 6px rgba(74, 222, 128, 0.6);
      }
    `,
  ],
})
export class FooterComponent {
  protected readonly i18n = inject(TranslationService);
  protected readonly toolRequestService = inject(ToolRequestService);
  protected readonly currentYear = new Date().getFullYear();
  protected readonly githubUrl = APP_CONSTANTS.githubUrl;
}
