import { Component, OnInit, inject } from '@angular/core';
import { APP_CONSTANTS } from '../../core/constants/app.constants';
import { SeoService } from '../../core/services/seo.service';
import { TranslationService } from '../../core/services/translation.service';
import { ToolRequestService } from '../../core/services/tool-request.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'bt-info',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="info-page">
      <div class="info-inner">
        <!-- Header -->
        <header class="info-header">
          <div class="brand-logo-wrap">
            <img src="/logo.svg" alt="Bandit Tools Logo" class="brand-img" />
          </div>
          <h1 class="info-title">
            {{ i18n.currentLang() === 'es' ? 'Información, Código Abierto y Privacidad' : 'About, Open Source & Privacy' }}
          </h1>
          <p class="info-tagline">
            {{ i18n.currentLang() === 'es'
              ? 'Conoce la filosofía de software libre detrás de Bandit Tools y nuestras garantías de privacidad total en el navegador.'
              : 'Learn about the open source philosophy behind Bandit Tools and our uncompromising in-browser privacy guarantees.' }}
          </p>
        </header>

        <!-- Main Content -->
        <div class="info-sections">
          @if (i18n.currentLang() === 'es') {
            <!-- SECCIÓN 1: ACERCA DE BANDIT TOOLS -->
            <section class="info-card">
              <div class="card-badge">
                <bt-icon name="sparkles" [size]="14" />
                <span>NUESTRA FILOSOFÍA</span>
              </div>
              <h2 class="section-title">Herramientas útiles. Cero complicaciones.</h2>
              <p class="section-text">
                La mayoría de los sitios de utilidades y convertidores online actuales están sobrecargados de anuncios invasivos,
                interfaces lentas y pasarelas de pago ocultas. Peor aún, muchos suben silenciosamente tus imágenes privadas,
                códigos o documentos a servidores remotos.
              </p>
              <p class="section-text">
                <strong>Bandit Tools</strong> nace como una alternativa moderna: un conjunto de utilidades digitales rápidas y
                enfocadas que se ejecutan <em>estrictamente en tu navegador</em>. Eliminamos registros forzados,
                cookies publicitarias y procesos engorrosos para que puedas resolver tus tareas al instante.
              </p>

              <div class="principles-grid">
                <div class="principle-item">
                  <div class="principle-icon">
                    <bt-icon name="shield" [size]="20" />
                  </div>
                  <h3>Privacidad Inquebrantable</h3>
                  <p>Tus imágenes, textos y contraseñas nunca abandonan tu máquina. Todo se procesa en la memoria RAM local con APIs del navegador.</p>
                </div>

                <div class="principle-item">
                  <div class="principle-icon">
                    <bt-icon name="zap" [size]="20" />
                  </div>
                  <h3>Cero Fricción</h3>
                  <p>Sin cuentas obligatorias, sin correos de verificación y sin límites artificiales. Entras, procesas y descargas.</p>
                </div>

                <div class="principle-item">
                  <div class="principle-icon">
                    <bt-icon name="code" [size]="20" />
                  </div>
                  <h3>Rendimiento Extremo</h3>
                  <p>Construido con Angular y señales reactivas para una carga ultrarrápida, diseño minimalista y funcionamiento fluido.</p>
                </div>
              </div>
            </section>

            <!-- SECCIÓN 2: PRIVACIDAD Y SEGURIDAD -->
            <section class="info-card">
              <div class="card-badge">
                <bt-icon name="shield" [size]="14" />
                <span>GARANTÍAS DE PRIVACIDAD</span>
              </div>
              <h2 class="section-title">100% Procesamiento Local en tu Navegador</h2>

              <ul class="guarantee-list">
                <li>
                  <bt-icon name="check-circle" [size]="18" class="icon-success" />
                  <div>
                    <strong>Sin Subida de Archivos:</strong> Las imágenes cargadas en el compresor o convertidor se procesan en tu propio navegador mediante HTML5 Canvas y jamás se envían a un servidor.
                  </div>
                </li>
                <li>
                  <bt-icon name="check-circle" [size]="18" class="icon-success" />
                  <div>
                    <strong>Sin Registro de Datos:</strong> Las contraseñas, documentos JSON y textos residen exclusivamente en la memoria RAM volátil de tu equipo y se destruyen al cerrar la pestaña.
                  </div>
                </li>
                <li>
                  <bt-icon name="check-circle" [size]="18" class="icon-success" />
                  <div>
                    <strong>Criptografía Nativa Segura:</strong> Las contraseñas se generan usando <code>crypto.getRandomValues</code>, el estándar de seguridad de grado criptográfico admitido por los navegadores modernos.
                  </div>
                </li>
                <li>
                  <bt-icon name="check-circle" [size]="18" class="icon-success" />
                  <div>
                    <strong>Sin Cookies de Rastreo:</strong> No empleamos scripts de telemetría publicitaria ni rastreadores entre sitios.
                  </div>
                </li>
              </ul>
            </section>

            <!-- SECCIÓN 3: CÓDIGO ABIERTO (OPEN SOURCE) Y 100% GRATIS -->
            <section class="info-card">
              <div class="card-badge">
                <bt-icon name="code" [size]="14" />
                <span>CÓDIGO ABIERTO & 100% GRATIS</span>
              </div>
              <h2 class="section-title">Software Libre, Transparente y Sin Letra Pequeña</h2>
              <p class="section-text">
                Creemos que las herramientas de uso diario deben ser un bien público. Por eso, <strong>Bandit Tools es 100% código abierto (Open Source)</strong> y totalmente gratuito para siempre.
              </p>
              <div class="principles-grid">
                <div class="principle-item">
                  <div class="principle-icon">
                    <bt-icon name="github" [size]="20" />
                  </div>
                  <h3>Código 100% Abierto</h3>
                  <p>Todo el código fuente está disponible públicamente en GitHub para ser auditado, inspeccionado o mejorado por la comunidad.</p>
                </div>
                <div class="principle-item">
                  <div class="principle-icon">
                    <bt-icon name="check-circle" [size]="20" />
                  </div>
                  <h3>Totalmente Gratis</h3>
                  <p>Sin cuentas, sin suscripciones mensuales, sin marcas de agua y sin pantallas de pago sorpresivas.</p>
                </div>
                <div class="principle-item">
                  <div class="principle-icon">
                    <bt-icon name="sparkles" [size]="20" />
                  </div>
                  <h3>Libertad de Uso</h3>
                  <p>Puedes clonar el repositorio, ejecutar la suite de utilidades de manera offline en tu máquina y usarla sin restricciones.</p>
                </div>
              </div>
              <div class="open-source-actions">
                <a [href]="githubUrl" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                  <bt-icon name="github" [size]="16" />
                  <span>Explorar el Repositorio en GitHub</span>
                </a>
              </div>
            </section>
          } @else {
            <!-- ENGLISH VERSION -->
            <section class="info-card">
              <div class="card-badge">
                <bt-icon name="sparkles" [size]="14" />
                <span>OUR PHILOSOPHY</span>
              </div>
              <h2 class="section-title">Useful tools. Zero hassle.</h2>
              <p class="section-text">
                Traditional online utility websites are cluttered with intrusive ads, paywalls, and slow pipelines. Even worse, many quietly upload your private images, code, and confidential documents to cloud servers.
              </p>
              <p class="section-text">
                <strong>Bandit Tools</strong> is built as a minimalist, privacy-first alternative: essential utilities executed <em>strictly inside your browser sandbox</em>. No accounts, no telemetry, no nonsense.
              </p>

              <div class="principles-grid">
                <div class="principle-item">
                  <div class="principle-icon">
                    <bt-icon name="shield" [size]="20" />
                  </div>
                  <h3>Uncompromising Privacy</h3>
                  <p>Your images, text, and passwords never leave your machine. Processing happens entirely in local memory.</p>
                </div>

                <div class="principle-item">
                  <div class="principle-icon">
                    <bt-icon name="zap" [size]="20" />
                  </div>
                  <h3>Zero Friction</h3>
                  <p>No logins, no cookies, no artificial limits. Open the tool, process your data, and download instantly.</p>
                </div>

                <div class="principle-item">
                  <div class="principle-icon">
                    <bt-icon name="code" [size]="20" />
                  </div>
                  <h3>Pure Performance</h3>
                  <p>Engineered with modern Angular standalone architecture and native Web APIs for instant load times.</p>
                </div>
              </div>
            </section>

            <section class="info-card">
              <div class="card-badge">
                <bt-icon name="shield" [size]="14" />
                <span>PRIVACY GUARANTEES</span>
              </div>
              <h2 class="section-title">100% Client-Side In-Browser Execution</h2>

              <ul class="guarantee-list">
                <li>
                  <bt-icon name="check-circle" [size]="18" class="icon-success" />
                  <div>
                    <strong>No File Uploads:</strong> Images are processed locally using the HTML5 Canvas API and never touch an external server.
                  </div>
                </li>
                <li>
                  <bt-icon name="check-circle" [size]="18" class="icon-success" />
                  <div>
                    <strong>No Data Persistence:</strong> JSON files, passwords, and text reside exclusively in volatile memory and vanish upon closing the tab.
                  </div>
                </li>
                <li>
                  <bt-icon name="check-circle" [size]="18" class="icon-success" />
                  <div>
                    <strong>Cryptographic Security:</strong> Passwords are generated via <code>crypto.getRandomValues</code> for true hardware-level entropy.
                  </div>
                </li>
                <li>
                  <bt-icon name="check-circle" [size]="18" class="icon-success" />
                  <div>
                    <strong>No Tracking Cookies:</strong> We do not track you across the web or collect advertising telemetry.
                  </div>
                </li>
              </ul>
            </section>

            <!-- SECTION 3: OPEN SOURCE & 100% FREE -->
            <section class="info-card">
              <div class="card-badge">
                <bt-icon name="code" [size]="14" />
                <span>OPEN SOURCE & 100% FREE</span>
              </div>
              <h2 class="section-title">Free Software, Transparent & Zero Paywalls</h2>
              <p class="section-text">
                We believe everyday utilities should be public goods. That is why <strong>Bandit Tools is 100% open source</strong> and completely free forever.
              </p>
              <div class="principles-grid">
                <div class="principle-item">
                  <div class="principle-icon">
                    <bt-icon name="github" [size]="20" />
                  </div>
                  <h3>100% Open Source</h3>
                  <p>The entire codebase is openly accessible on GitHub for auditing, inspecting data privacy guarantees, and community contributions.</p>
                </div>
                <div class="principle-item">
                  <div class="principle-icon">
                    <bt-icon name="check-circle" [size]="20" />
                  </div>
                  <h3>Completely Free</h3>
                  <p>No paywalls, no monthly subscription tiers, no watermarked exports, and zero hidden fees.</p>
                </div>
                <div class="principle-item">
                  <div class="principle-icon">
                    <bt-icon name="sparkles" [size]="20" />
                  </div>
                  <h3>Full Ownership</h3>
                  <p>Clone the repository, run it completely offline on your localhost, and use it freely under an open source license.</p>
                </div>
              </div>
              <div class="open-source-actions">
                <a [href]="githubUrl" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                  <bt-icon name="github" [size]="16" />
                  <span>View Repository on GitHub</span>
                </a>
              </div>
            </section>
          }

          <!-- Solicitud de nueva herramienta banner -->
          <div class="request-banner-card">
            <div class="banner-text">
              <h3 class="banner-title">
                {{ i18n.currentLang() === 'es' ? '¿No encontraste lo que buscabas?' : "Didn't find what you were looking for?" }}
              </h3>
              <p class="banner-desc">
                {{ i18n.currentLang() === 'es'
                  ? 'Envíanos tu sugerencia de herramienta directamente y la consideraremos para la próxima versión.'
                  : 'Send us your tool idea directly and we will build it for the upcoming release.' }}
              </p>
            </div>
            <button type="button" class="btn btn-primary btn-lg" (click)="openRequestModal()">
              <bt-icon name="sparkles" [size]="18" />
              <span>{{ i18n.currentLang() === 'es' ? 'Solicitar Nueva Herramienta' : 'Request New Tool' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @use 'styles/variables' as *;
      @use 'styles/mixins' as *;

      .info-page {
        padding-top: $spacing-10;
        padding-bottom: $spacing-20;
      }

      .info-inner {
        @include container;
        max-width: 860px;
      }

      .info-header {
        text-align: center;
        margin-bottom: $spacing-12;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: $spacing-3;
      }

      .brand-logo-wrap {
        width: 64px;
        height: 64px;
        border-radius: $radius-lg;
        overflow: hidden;
        border: 1px solid $border-color;
        background-color: $bg-surface;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .brand-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .info-title {
        font-size: $font-4xl;
        font-weight: 800;
        letter-spacing: -0.02em;
        color: $text-primary;
      }

      .info-tagline {
        font-size: $font-base;
        color: $text-secondary;
        max-width: 600px;
        line-height: 1.6;
      }

      .info-sections {
        display: flex;
        flex-direction: column;
        gap: $spacing-8;
      }

      .info-card {
        @include card-surface;
        padding: $spacing-8;
        border-radius: $radius-2xl;
        display: flex;
        flex-direction: column;
        gap: $spacing-4;

        @include mobile {
          padding: $spacing-6;
        }
      }

      .card-badge {
        display: inline-flex;
        align-items: center;
        gap: $spacing-2;
        padding: 4px $spacing-3;
        border-radius: $radius-full;
        background-color: var(--accent-yellow-subtle);
        color: $accent-yellow;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.08em;
        width: fit-content;
      }

      .section-title {
        font-size: $font-2xl;
        font-weight: 700;
        color: $text-primary;
        letter-spacing: -0.01em;
      }

      .section-text {
        font-size: $font-base;
        color: $text-secondary;
        line-height: 1.7;

        strong {
          color: $text-primary;
        }

        em {
          color: $accent-yellow;
          font-style: normal;
        }

        code {
          font-family: $font-mono;
          font-size: $font-xs;
          background-color: $bg-secondary;
          padding: 2px $spacing-1;
          border-radius: $radius-xs;
        }
      }

      .principles-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: $spacing-4;
        margin-top: $spacing-4;

        @include tablet-up {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      .principle-item {
        background-color: $bg-secondary;
        border: 1px solid $border-color;
        border-radius: $radius-lg;
        padding: $spacing-5;
        display: flex;
        flex-direction: column;
        gap: $spacing-2;

        h3 {
          font-size: $font-base;
          font-weight: 700;
          color: $text-primary;
        }

        p {
          font-size: $font-xs;
          color: $text-secondary;
          line-height: 1.6;
        }
      }

      .principle-icon {
        width: 36px;
        height: 36px;
        border-radius: $radius-md;
        background-color: var(--accent-yellow-subtle);
        color: $accent-yellow;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: $spacing-1;
      }

      .guarantee-list {
        display: flex;
        flex-direction: column;
        gap: $spacing-4;
        margin-top: $spacing-2;

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

          code {
            font-family: $font-mono;
            font-size: $font-xs;
            background-color: $bg-secondary;
            padding: 2px $spacing-1;
            border-radius: $radius-xs;
          }
        }
      }

      .icon-success {
        color: $color-success;
        flex-shrink: 0;
        margin-top: 2px;
      }

      .request-banner-card {
        background-color: $bg-surface;
        border: 1px dashed rgba(252, 227, 0, 0.4);
        border-radius: $radius-2xl;
        padding: $spacing-8;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: $spacing-6;

        @include mobile {
          flex-direction: column;
          text-align: center;
        }
      }

      .banner-text {
        display: flex;
        flex-direction: column;
        gap: $spacing-1;
      }

      .banner-title {
        font-size: $font-xl;
        font-weight: 700;
        color: $text-primary;
      }

      .banner-desc {
        font-size: $font-sm;
        color: $text-secondary;
      }

      .open-source-actions {
        margin-top: $spacing-2;
        display: flex;
        align-items: center;
      }
    `,
  ],
})
export class InfoComponent implements OnInit {
  protected readonly i18n = inject(TranslationService);
  protected readonly githubUrl = APP_CONSTANTS.githubUrl;
  private readonly seoService = inject(SeoService);
  private readonly toolRequestService = inject(ToolRequestService);

  ngOnInit(): void {
    const isEs = this.i18n.currentLang() === 'es';
    this.seoService.updateSeo({
      title: isEs ? 'Información y Privacidad' : 'About & Privacy',
      description: isEs
        ? 'Bandit Tools — Filosofía y garantías de privacidad absoluta en el navegador.'
        : 'Bandit Tools — Philosophy and client-side privacy guarantees.',
    });
  }

  openRequestModal(): void {
    this.toolRequestService.openModal();
  }
}
