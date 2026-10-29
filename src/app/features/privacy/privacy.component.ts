import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { TranslationService } from '../../core/services/translation.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'bt-privacy',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <div class="privacy-page">
      <div class="privacy-inner">
        <header class="privacy-header">
          <div class="header-icon-box">
            <bt-icon name="shield" [size]="32" />
          </div>
          <h1 class="page-title">
            {{ i18n.currentLang() === 'es' ? 'Política de Privacidad y Seguridad' : 'Privacy Policy & Guarantees' }}
          </h1>
          <p class="page-subtitle">
            {{ i18n.currentLang() === 'es'
              ? 'Bandit Tools fue diseñado desde el inicio sin servidores de procesamiento de archivos, sin cuentas ni cookies de rastreo.'
              : 'Bandit Tools was intentionally built without server file processing, user accounts, or tracking cookies.' }}
          </p>
        </header>

        <div class="policy-body">
          @if (i18n.currentLang() === 'es') {
            <!-- Versión en Español -->
            <div class="policy-summary-card">
              <h2 class="summary-title">Resumen: Lo que debes saber</h2>
              <ul class="summary-list">
                <li>
                  <bt-icon name="check-circle" [size]="18" class="icon-success" />
                  <span><strong>Sin Subida de Archivos:</strong> Las imágenes cargadas en el compresor o convertidor se procesan en tu propio navegador y jamás se envían a un servidor.</span>
                </li>
                <li>
                  <bt-icon name="check-circle" [size]="18" class="icon-success" />
                  <span><strong>Sin Registro de Datos:</strong> Las contraseñas, documentos JSON y textos residen exclusivamente en la memoria RAM volátil de tu equipo y se destruyen al cerrar la pestaña.</span>
                </li>
                <li>
                  <bt-icon name="check-circle" [size]="18" class="icon-success" />
                  <span><strong>Sin Cuentas Obligatorias:</strong> Nunca te pediremos correo electrónico, nombre o datos de pago.</span>
                </li>
                <li>
                  <bt-icon name="check-circle" [size]="18" class="icon-success" />
                  <span><strong>Sin Cookies de Rastreo:</strong> No empleamos scripts de telemetría publicitaria ni rastreadores entre sitios.</span>
                </li>
              </ul>
            </div>

            <section class="policy-section">
              <h3>1. Ejecución 100% en el Navegador (Client-Side)</h3>
              <p>
                Cuando utilizas las utilidades de Bandit Tools (como el Compresor de Imágenes, Convertidor, Formateador JSON, Contador de Palabras, Generador de Contraseñas y Generador QR), todas las operaciones ocurren dentro del sandbox de tu navegador a través de APIs web estándar:
              </p>
              <ul>
                <li><strong>HTML5 Canvas API:</strong> para dibujar, redimensionar y generar blobs de imagen en formatos WebP, JPEG y PNG.</li>
                <li><strong>Web Cryptography API (<code>window.crypto.getRandomValues</code>):</strong> para generar números aleatorios con seguridad criptográfica.</li>
                <li><strong>Motor JavaScript del Navegador:</strong> para el parseo y validación inmediata de JSON.</li>
              </ul>
            </section>

            <section class="policy-section">
              <h3>2. Memoria Temporal y URLs de Objeto</h3>
              <p>
                Al cargar una imagen o generar un QR, se crea una referencia temporal en memoria (Object URL) para la previsualización. Tan pronto como reinicias la herramienta o seleccionas otro archivo, estas referencias se revocan mediante <code>URL.revokeObjectURL()</code> para evitar fugas de memoria y asegurar que no quede rastro en el sistema.
              </p>
            </section>

            <section class="policy-section">
              <h3>3. Verificación de Código Abierto</h3>
              <p>
                Al ser un proyecto de código abierto, cualquier usuario o auditor de seguridad puede inspeccionar las llamadas de red y confirmar que ninguna petición oculta transmite tus archivos.
              </p>
            </section>

            <div class="policy-footer">
              <p>Última actualización: {{ currentYear }}. Bandit Tools.</p>
              <a routerLink="/tools" class="btn btn-primary">Comenzar a Usar las Herramientas</a>
            </div>
          } @else {
            <!-- English Version -->
            <div class="policy-summary-card">
              <h2 class="summary-title">Summary: What You Need to Know</h2>
              <ul class="summary-list">
                <li>
                  <bt-icon name="check-circle" [size]="18" class="icon-success" />
                  <span><strong>No File Uploads:</strong> Files in the compressor or converter are processed inside your browser and never sent to a server.</span>
                </li>
                <li>
                  <bt-icon name="check-circle" [size]="18" class="icon-success" />
                  <span><strong>No Data Storage:</strong> Passwords, JSON payloads, and texts reside exclusively in volatile browser RAM and are purged on close.</span>
                </li>
                <li>
                  <bt-icon name="check-circle" [size]="18" class="icon-success" />
                  <span><strong>No Account Requirements:</strong> You never need to supply an email address or payment details.</span>
                </li>
                <li>
                  <bt-icon name="check-circle" [size]="18" class="icon-success" />
                  <span><strong>No Tracking Cookies:</strong> We do not deploy ad trackers or cross-site user tracking.</span>
                </li>
              </ul>
            </div>

            <section class="policy-section">
              <h3>1. Local Client-Side Execution</h3>
              <p>
                All operations take place within your local browser sandbox via modern Web APIs:
              </p>
              <ul>
                <li><strong>HTML Canvas API</strong> for drawing, resizing, and converting images to blobs.</li>
                <li><strong>Web Cryptography API</strong> for generating secure random integers.</li>
                <li><strong>Native JavaScript Engine</strong> for parsing and formatting JSON strings.</li>
              </ul>
            </section>

            <div class="policy-footer">
              <p>Last updated: {{ currentYear }}. Bandit Tools.</p>
              <a routerLink="/tools" class="btn btn-primary">Start Using Bandit Tools</a>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @use 'styles/variables' as *;
      @use 'styles/mixins' as *;

      .privacy-page {
        padding-top: $spacing-12;
        padding-bottom: $spacing-20;
      }

      .privacy-inner {
        @include container;
        max-width: $container-narrow-width;
      }

      .privacy-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        margin-bottom: $spacing-10;
      }

      .header-icon-box {
        width: 56px;
        height: 56px;
        border-radius: $radius-lg;
        background-color: var(--accent-yellow-subtle);
        color: $accent-yellow;
        border: 1px solid var(--accent-yellow-subtle);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: $spacing-4;
      }

      .page-title {
        font-size: $font-3xl;
        font-weight: 800;
        letter-spacing: -0.02em;
        color: $text-primary;
        margin-bottom: $spacing-2;

        @include tablet-up {
          font-size: $font-4xl;
        }
      }

      .page-subtitle {
        font-size: $font-base;
        color: $text-secondary;
        max-width: 620px;
        line-height: 1.6;
      }

      .policy-body {
        display: flex;
        flex-direction: column;
        gap: $spacing-8;
      }

      .policy-summary-card {
        @include card-surface;
        padding: $spacing-6;
        border-color: var(--accent-yellow-subtle);
        background-color: $bg-surface;
      }

      .summary-title {
        font-size: $font-lg;
        font-weight: 600;
        color: $accent-yellow;
        margin-bottom: $spacing-4;
      }

      .summary-list {
        display: flex;
        flex-direction: column;
        gap: $spacing-3;

        li {
          display: flex;
          align-items: flex-start;
          gap: $spacing-3;
          font-size: $font-sm;
          color: $text-secondary;
          line-height: 1.6;

          strong {
            color: $text-primary;
          }
        }
      }

      .icon-success {
        color: $color-success;
        flex-shrink: 0;
        margin-top: 3px;
      }

      .policy-section {
        h3 {
          font-size: $font-xl;
          font-weight: 600;
          color: $text-primary;
          margin-bottom: $spacing-3;
        }

        p {
          font-size: $font-base;
          color: $text-secondary;
          line-height: 1.7;
          margin-bottom: $spacing-3;
        }

        ul {
          display: flex;
          flex-direction: column;
          gap: $spacing-2;
          margin-left: $spacing-4;

          li {
            font-size: $font-sm;
            color: $text-secondary;
            line-height: 1.6;
            list-style-type: disc;

            strong {
              color: $text-primary;
            }

            code {
              color: $accent-yellow;
              background-color: $bg-secondary;
              padding: 2px 4px;
              border-radius: $radius-xs;
            }
          }
        }
      }

      .policy-footer {
        @include card-surface;
        padding: $spacing-6;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: $spacing-4;
        margin-top: $spacing-4;

        p {
          font-size: $font-xs;
          color: $text-muted;
        }
      }
    `,
  ],
})
export class PrivacyComponent implements OnInit {
  private readonly seoService = inject(SeoService);
  protected readonly i18n = inject(TranslationService);
  protected readonly currentYear = new Date().getFullYear();

  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'Política de Privacidad',
      description:
        'Conoce cómo la arquitectura 100% en el navegador de Bandit Tools protege tus archivos y datos.',
    });
  }
}
