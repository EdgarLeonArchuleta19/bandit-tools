import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToolRegistryService } from '../../../core/services/tool-registry.service';
import { SeoService } from '../../../core/services/seo.service';
import { TranslationService } from '../../../core/services/translation.service';
import { ToolDefinition } from '../../../core/models/tool.model';
import { RelatedToolsComponent } from '../../../shared/components/related-tools/related-tools.component';
import { ToolHeaderComponent } from '../../../shared/components/tool-header/tool-header.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'bt-video-editor',
  standalone: true,
  imports: [
    CommonModule,
    RelatedToolsComponent,
    ToolHeaderComponent,
    IconComponent,
  ],
  template: `
    <div class="tool-page-container">
      @if (currentTool(); as currentTool) {
        <bt-tool-header [tool]="currentTool" />

        <div class="workspace">
          <!-- Control Bar -->
          <div class="editor-controls-bar">
            <div class="controls-left">
              <span class="editor-tagline">
                {{ i18n.currentLang() === 'es' ? 'Suite de edición de video web independiente' : 'Independent web video editing suite' }}
              </span>
            </div>

            <div class="controls-actions">
              <button
                type="button"
                class="btn-toggle-fullscreen"
                (click)="toggleFullscreen()"
                [title]="isFullscreen() ? (i18n.currentLang() === 'es' ? 'Salir de pantalla completa' : 'Exit fullscreen') : (i18n.currentLang() === 'es' ? 'Modo expandido' : 'Expanded mode')"
              >
                <bt-icon [name]="isFullscreen() ? 'minimize' : 'maximize'" [size]="16" />
                <span>{{ isFullscreen() ? (i18n.currentLang() === 'es' ? 'Reducir' : 'Minimize') : (i18n.currentLang() === 'es' ? 'Expandir' : 'Expand') }}</span>
              </button>

              <a
                [href]="amapaUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-launch-external"
                [title]="i18n.currentLang() === 'es' ? 'Abrir Amapa en pestaña independiente' : 'Open Amapa in a dedicated tab'"
              >
                <span>{{ i18n.currentLang() === 'es' ? 'Abrir en pestaña nueva' : 'Open in new tab' }}</span>
                <bt-icon name="external-link" [size]="16" />
              </a>
            </div>
          </div>

          <!-- Iframe Container -->
          <div class="iframe-wrapper" [class.fullscreen-mode]="isFullscreen()">
            @if (isFullscreen()) {
              <div class="fullscreen-topbar">
                <span class="fullscreen-title">AMAPA &bull; Editor de Video</span>
                <button type="button" class="btn-close-fs" (click)="toggleFullscreen()" title="Cerrar pantalla completa">
                  <bt-icon name="close" [size]="18" />
                </button>
              </div>
            }

            @if (isLoading()) {
              <div class="iframe-loading">
                <div class="spinner"></div>
                <p>{{ i18n.currentLang() === 'es' ? 'Cargando Amapa Editor...' : 'Loading Amapa Editor...' }}</p>
              </div>
            }

            <iframe
              [src]="safeUrl()"
              (load)="onIframeLoad()"
              title="Amapa Video Editor"
              class="editor-frame"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              sandbox="allow-same-origin allow-scripts allow-forms allow-downloads allow-modals allow-popups"
            ></iframe>
          </div>
        </div>

        <bt-related-tools [tools]="relatedTools()" />
      }
    </div>
  `,
  styles: [
    `
      @use 'styles/variables' as *;
      @use 'styles/mixins' as *;

      .tool-page-container {
        @include container;
        padding-top: $spacing-8;
        padding-bottom: $spacing-16;
      }

      .workspace {
        margin-top: $spacing-8;
        margin-bottom: $spacing-12;
      }

      .editor-controls-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: $spacing-4;
        background-color: $bg-secondary;
        border: 1px solid $border-color;
        border-bottom: none;
        border-radius: $radius-lg $radius-lg 0 0;
        padding: $spacing-3 $spacing-5;
        flex-wrap: wrap;
      }

      .controls-left {
        display: flex;
        align-items: center;
        gap: $spacing-3;
      }

      .editor-tagline {
        font-size: $font-sm;
        color: $text-secondary;
        font-weight: 500;
      }

      .controls-actions {
        display: flex;
        align-items: center;
        gap: $spacing-3;
      }

      .btn-toggle-fullscreen {
        display: inline-flex;
        align-items: center;
        gap: $spacing-2;
        padding: $spacing-2 $spacing-3;
        font-size: $font-xs;
        font-weight: 600;
        color: $text-primary;
        background-color: $bg-surface;
        border: 1px solid $border-color;
        border-radius: $radius-md;
        cursor: pointer;
        transition: background-color $transition-fast, border-color $transition-fast;

        &:hover {
          background-color: $bg-surface-hover;
          border-color: $border-light;
        }
      }

      .btn-launch-external {
        display: inline-flex;
        align-items: center;
        gap: $spacing-2;
        padding: $spacing-2 $spacing-4;
        font-size: $font-xs;
        font-weight: 600;
        color: #111111;
        background-color: $accent-yellow;
        border: 1px solid $accent-yellow;
        border-radius: $radius-md;
        text-decoration: none;
        cursor: pointer;
        transition: filter $transition-fast, transform $transition-fast;

        &:hover {
          filter: brightness(1.08);
          transform: translateY(-1px);
        }
      }

      .iframe-wrapper {
        position: relative;
        background-color: #0d0f12;
        border: 1px solid $border-color;
        border-radius: 0 0 $radius-lg $radius-lg;
        overflow: hidden;
        min-height: 680px;
        height: 78vh;
        max-height: 900px;
        transition: all $transition-normal;

        &.fullscreen-mode {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          max-height: 100vh;
          z-index: 9999;
          border-radius: 0;
          border: none;
          margin: 0;
        }
      }

      .fullscreen-topbar {
        height: 44px;
        background-color: #14171c;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 $spacing-4;

        .fullscreen-title {
          font-size: $font-xs;
          font-weight: 700;
          color: $accent-yellow;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .btn-close-fs {
          background: transparent;
          border: none;
          color: $text-secondary;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
          border-radius: $radius-sm;

          &:hover {
            color: $text-primary;
            background-color: rgba(255, 255, 255, 0.08);
          }
        }
      }

      .editor-frame {
        width: 100%;
        height: 100%;
        border: none;
        display: block;
      }

      .iframe-loading {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: $spacing-3;
        background-color: #0d0f12;
        color: $text-secondary;
        font-size: $font-sm;
        z-index: 2;

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(252, 227, 0, 0.2);
          border-top-color: $accent-yellow;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      @media (max-width: 640px) {
        .editor-controls-bar {
          flex-direction: column;
          align-items: flex-start;
          gap: $spacing-3;
        }

        .controls-actions {
          width: 100%;
          justify-content: space-between;
        }

        .iframe-wrapper {
          min-height: 540px;
          height: 65vh;
        }
      }
    `,
  ],
})
export class VideoEditorComponent implements OnInit {
  private readonly toolRegistry = inject(ToolRegistryService);
  private readonly seoService = inject(SeoService);
  private readonly sanitizer = inject(DomSanitizer);
  readonly i18n = inject(TranslationService);

  readonly amapaUrl = 'https://edgarleonarchuleta19.github.io/amapa-editor/';

  readonly currentTool = computed<ToolDefinition | undefined>(() =>
    this.toolRegistry.getToolById('video-editor')
  );

  readonly relatedTools = computed<ToolDefinition[]>(() =>
    this.toolRegistry.getRelatedTools('video-editor')
  );

  readonly safeUrl = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(this.amapaUrl)
  );

  readonly isLoading = signal<boolean>(true);
  readonly isFullscreen = signal<boolean>(false);

  ngOnInit(): void {
    const tool = this.currentTool();
    if (tool) {
      this.seoService.updateSeo({
        title: tool.name,
        description: tool.description,
        keywords: tool.keywords,
      });
    }
  }

  onIframeLoad(): void {
    this.isLoading.set(false);
  }

  toggleFullscreen(): void {
    this.isFullscreen.update((prev) => !prev);
  }
}
