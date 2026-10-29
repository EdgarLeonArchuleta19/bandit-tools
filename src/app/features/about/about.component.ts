import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APP_CONSTANTS } from '../../core/constants/app.constants';
import { SeoService } from '../../core/services/seo.service';
import { TranslationService } from '../../core/services/translation.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'bt-about',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <div class="about-page">
      <div class="about-inner">
        <header class="about-header">
          <div class="brand-logo-wrap">
            <img src="/logo.svg" alt="Bandit Tools Logo" class="brand-img" />
          </div>
          <h1 class="about-title">
            {{ i18n.currentLang() === 'es' ? 'Acerca de Bandit Tools' : 'About Bandit Tools' }}
          </h1>
          <p class="about-tagline">{{ i18n.t('footer.tagline') }}</p>
        </header>

        <div class="about-content">
          @if (i18n.currentLang() === 'es') {
            <!-- Contenido en Español -->
            <section class="story-section">
              <h2 class="section-title">Nuestra Filosofía</h2>
              <p>
                La mayoría de los sitios de utilidades y convertidores online actuales están sobrecargados de anuncios invasivos,
                interfaces lentas y pasarelas de pago ocultas. Peor aún, muchos suben silenciosamente tus imágenes privadas,
                códigos o documentos a servidores remotos.
              </p>
              <p>
                <strong>Bandit Tools</strong> nace como una alternativa moderna: un conjunto de herramientas digitales rápidas y
                enfocadas que se ejecutan <em>estrictamente en el navegador del usuario</em>. Eliminamos registros forzados,
                cookies publicitarias y procesos engorrosos para que puedas resolver tus tareas al instante.
              </p>
            </section>

            <section class="principles-grid">
              <div class="principle-card">
                <div class="principle-icon">
                  <bt-icon name="shield" [size]="24" />
                </div>
                <h3 class="principle-title">Privacidad Inquebrantable</h3>
                <p class="principle-desc">
                  Tus imágenes, textos y contraseñas nunca abandonan tu máquina. Todo se procesa en la memoria RAM local con APIs del navegador.
                </p>
              </div>

              <div class="principle-card">
                <div class="principle-icon">
                  <bt-icon name="zap" [size]="24" />
                </div>
                <h3 class="principle-title">Cero Fricción</h3>
                <p class="principle-desc">
                  Sin registros, sin correos de verificación y sin límites artificiales. Abre la herramienta, procesa lo que necesitas y descarga.
                </p>
              </div>

              <div class="principle-card">
                <div class="principle-icon">
                  <bt-icon name="code" [size]="24" />
                </div>
                <h3 class="principle-title">Rendimiento Extremo</h3>
                <p class="principle-desc">
                  Construido con componentes standalone de Angular y señales reactivas para tiempos de carga ultrarrápidos y respuesta inmediata.
                </p>
              </div>
            </section>

            <section class="tech-section">
              <h2 class="section-title">Arquitectura Técnica</h2>
              <p>
                Aprovechamos las capacidades nativas de la plataforma Web en lugar de depender de servidores pesados:
              </p>
              <ul class="tech-list">
                <li>
                  <strong>HTML5 Canvas API:</strong> Ejecuta compresión y conversión de imágenes (JPEG, PNG, WebP) directamente en la GPU del cliente.
                </li>
                <li>
                  <strong>Web Cryptography API (<code>crypto.getRandomValues</code>):</strong> Genera números aleatorios criptográficamente seguros para contraseñas de alta entropía.
                </li>
                <li>
                  <strong>Motor JavaScript Nativo:</strong> Análisis y formateo ultra-rápido de JSON sin funciones inseguras.
                </li>
                <li>
                  <strong>Angular Signals:</strong> Estado reactivo que asegura cero retardo durante la edición interactiva y el cambio de temas.
                </li>
              </ul>
            </section>

            <section class="cta-section">
              <h2 class="section-title">Código Abierto y Transparente</h2>
              <p>
                Bandit Tools es transparente por diseño. Puedes revisar el código fuente, auditar la seguridad o contribuir en GitHub.
              </p>
              <div class="cta-actions">
                <a [href]="githubUrl" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                  <bt-icon name="github" [size]="18" />
                  <span>Ver en GitHub</span>
                </a>
                <a routerLink="/tools" class="btn btn-secondary">Explorar Herramientas</a>
              </div>
            </section>
          } @else {
            <!-- English Content -->
            <section class="story-section">
              <h2 class="section-title">The Philosophy</h2>
              <p>
                Most online conversion websites today are bloated, slow, and covered in invasive advertisements.
                Even worse, many quietly upload your private images, code snippets, and files to remote servers without explicit clarity.
              </p>
              <p>
                <strong>Bandit Tools</strong> was built as an alternative: a clean, minimalist suite of daily digital utilities
                that execute <em>strictly on the client side</em>. We eliminate corporate bureaucracy, unnecessary registrations,
                and tracking cookies so you can get things done faster.
              </p>
            </section>

            <section class="principles-grid">
              <div class="principle-card">
                <div class="principle-icon">
                  <bt-icon name="shield" [size]="24" />
                </div>
                <h3 class="principle-title">Uncompromising Privacy</h3>
                <p class="principle-desc">
                  Your images, code, and passwords never leave your browser sandbox. Everything runs in local memory using native browser APIs.
                </p>
              </div>

              <div class="principle-card">
                <div class="principle-icon">
                  <bt-icon name="zap" [size]="24" />
                </div>
                <h3 class="principle-title">Zero Friction</h3>
                <p class="principle-desc">
                  No sign-up forms, no email verifications, and no paywalls. Open the tool, do what you need, and leave.
                </p>
              </div>

              <div class="principle-card">
                <div class="principle-icon">
                  <bt-icon name="code" [size]="24" />
                </div>
                <h3 class="principle-title">Engineered for Performance</h3>
                <p class="principle-desc">
                  Built with Angular standalone components and signals for ultra-responsive change detection and immediate UI feedback.
                </p>
              </div>
            </section>

            <section class="tech-section">
              <h2 class="section-title">Technical Architecture</h2>
              <p>
                Bandit Tools leverages native Web platform capabilities rather than heavy cloud infrastructure:
              </p>
              <ul class="tech-list">
                <li>
                  <strong>HTML5 Canvas API:</strong> Performs high-speed image compression and format conversion directly within client memory.
                </li>
                <li>
                  <strong>Web Cryptography API:</strong> Generates high-entropy, cryptographically strong random data for passwords.
                </li>
                <li>
                  <strong>Native JavaScript JSON Engine:</strong> Ultra-fast parsing, stringification, and formatting without unsafe evaluation.
                </li>
              </ul>
            </section>

            <section class="cta-section">
              <h2 class="section-title">Open Source Commitment</h2>
              <p>
                Bandit Tools is transparent by design. You can inspect the source code, review our privacy architecture, or contribute on GitHub.
              </p>
              <div class="cta-actions">
                <a [href]="githubUrl" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                  <bt-icon name="github" [size]="18" />
                  <span>View on GitHub</span>
                </a>
                <a routerLink="/tools" class="btn btn-secondary">Explore the Tools</a>
              </div>
            </section>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @use 'styles/variables' as *;
      @use 'styles/mixins' as *;

      .about-page {
        padding-top: $spacing-12;
        padding-bottom: $spacing-20;
      }

      .about-inner {
        @include container;
        max-width: $container-narrow-width;
      }

      .about-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        margin-bottom: $spacing-12;
      }

      .brand-logo-wrap {
        width: 64px;
        height: 64px;
        border-radius: $radius-lg;
        overflow: hidden;
        border: 2px solid $border-color;
        background-color: $bg-surface;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: $spacing-4;
        box-shadow: 0 0 16px var(--accent-yellow-glow);
      }

      .brand-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .about-title {
        font-size: $font-4xl;
        font-weight: 800;
        letter-spacing: -0.02em;
        color: $text-primary;
        margin-bottom: $spacing-2;
      }

      .about-tagline {
        font-size: $font-lg;
        color: $text-secondary;
      }

      .about-content {
        display: flex;
        flex-direction: column;
        gap: $spacing-12;
      }

      .section-title {
        font-size: $font-2xl;
        font-weight: 700;
        color: $text-primary;
        margin-bottom: $spacing-4;
      }

      .story-section p,
      .tech-section p,
      .cta-section p {
        font-size: $font-base;
        color: $text-secondary;
        line-height: 1.8;
        margin-bottom: $spacing-4;

        strong {
          color: $text-primary;
        }

        em {
          color: $accent-yellow;
          font-style: normal;
        }
      }

      .principles-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: $spacing-4;

        @include tablet-up {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      .principle-card {
        @include card-surface;
        padding: $spacing-6;
        display: flex;
        flex-direction: column;
        gap: $spacing-3;
      }

      .principle-icon {
        width: 44px;
        height: 44px;
        border-radius: $radius-md;
        background-color: var(--accent-yellow-subtle);
        color: $accent-yellow;
        border: 1px solid var(--accent-yellow-subtle);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .principle-title {
        font-size: $font-base;
        font-weight: 600;
        color: $text-primary;
      }

      .principle-desc {
        font-size: $font-xs;
        color: $text-secondary;
        line-height: 1.6;
      }

      .tech-list {
        display: flex;
        flex-direction: column;
        gap: $spacing-3;
        margin-top: $spacing-4;

        li {
          padding: $spacing-3 $spacing-4;
          background-color: $bg-surface;
          border: 1px solid $border-color;
          border-radius: $radius-md;
          font-size: $font-sm;
          color: $text-secondary;
          line-height: 1.6;

          strong {
            color: $text-primary;
          }

          code {
            color: $accent-yellow;
            background-color: $bg-secondary;
            padding: 2px 4px;
            border-radius: $radius-xs;
            font-size: $font-xs;
          }
        }
      }

      .cta-section {
        @include card-surface;
        padding: $spacing-8;
        text-align: center;
      }

      .cta-actions {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: $spacing-4;
        margin-top: $spacing-6;
        flex-wrap: wrap;
      }
    `,
  ],
})
export class AboutComponent implements OnInit {
  private readonly seoService = inject(SeoService);
  protected readonly i18n = inject(TranslationService);

  protected readonly githubUrl = APP_CONSTANTS.githubUrl;

  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'Acerca de Bandit Tools',
      description:
        'Conoce la misión y la arquitectura técnica detrás de Bandit Tools — herramientas digitales rápidas y privadas.',
    });
  }
}
