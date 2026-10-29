import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolRegistryService } from '../../../core/services/tool-registry.service';
import { SeoService } from '../../../core/services/seo.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TranslationService } from '../../../core/services/translation.service';
import { ToolHeaderComponent } from '../../../shared/components/tool-header/tool-header.component';
import { RelatedToolsComponent } from '../../../shared/components/related-tools/related-tools.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ByteSizePipe } from '../../../shared/pipes/byte-size.pipe';
import {
  YoutubeDownloaderService,
  YouTubeVideoInfo,
  VideoStreamOption,
} from './youtube-downloader.service';

@Component({
  selector: 'bt-youtube-downloader',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToolHeaderComponent,
    RelatedToolsComponent,
    IconComponent,
    ByteSizePipe,
  ],
  template: `
    <div class="tool-page-container">
      @if (currentTool(); as currentTool) {
        <bt-tool-header [tool]="currentTool" />

        <div class="workspace">
          <!-- URL Input Card -->
          <div class="input-card">
            <label for="ytUrlInput" class="input-label">
              {{ i18n.currentLang() === 'es' ? 'Ingresa el enlace del video o Short de YouTube' : 'Paste YouTube Video or Short URL' }}
            </label>

            <div class="search-box">
              <bt-icon name="youtube" [size]="20" class="input-icon" />
              <input
                id="ytUrlInput"
                type="url"
                [(ngModel)]="urlInput"
                (keyup.enter)="fetchVideo()"
                [placeholder]="i18n.currentLang() === 'es' ? 'https://www.youtube.com/watch?v=... o https://youtu.be/...' : 'https://www.youtube.com/watch?v=... or https://youtu.be/...'"
                class="url-input"
              />
              @if (urlInput.trim()) {
                <button
                  type="button"
                  class="btn-clear"
                  (click)="urlInput = ''"
                  aria-label="Limpiar campo"
                >
                  <bt-icon name="close" [size]="14" />
                </button>
              }
            </div>

            <div class="input-actions">
              <button
                type="button"
                class="btn btn-primary btn-fetch"
                (click)="fetchVideo()"
                [disabled]="!urlInput.trim() || isLoading()"
              >
                @if (isLoading()) {
                  <bt-icon name="refresh-cw" [size]="16" class="spin" />
                  <span>{{ i18n.currentLang() === 'es' ? 'Consultando...' : 'Fetching...' }}</span>
                } @else {
                  <bt-icon name="search" [size]="16" />
                  <span>{{ i18n.currentLang() === 'es' ? 'Obtener Enlaces de Descarga' : 'Get Download Links' }}</span>
                }
              </button>
            </div>
          </div>

          <!-- Video Details & Download Options -->
          @if (videoInfo(); as info) {
            <div class="video-result-layout">
              <!-- Video Preview Card -->
              <div class="preview-card">
                <div class="thumb-wrap">
                  <img [src]="info.thumbnailUrl" [alt]="info.title" class="thumb-img" />
                  <span class="duration-badge mono">{{ formatDuration(info.durationSeconds) }}</span>
                </div>

                <div class="preview-info">
                  <h3 class="video-title">{{ info.title }}</h3>
                  <span class="video-author">{{ info.author }}</span>
                </div>
              </div>

              <!-- Stream Selection Card -->
              <div class="streams-card">
                <div class="mode-tabs">
                  <button
                    type="button"
                    class="mode-tab"
                    [class.active]="selectedTab() === 'audio'"
                    (click)="selectedTab.set('audio')"
                  >
                    <bt-icon name="music" [size]="16" />
                    <span>{{ i18n.currentLang() === 'es' ? 'Audio (MP3 / M4A)' : 'Audio (MP3 / M4A)' }}</span>
                  </button>
                  <button
                    type="button"
                    class="mode-tab"
                    [class.active]="selectedTab() === 'video'"
                    (click)="selectedTab.set('video')"
                  >
                    <bt-icon name="video" [size]="16" />
                    <span>{{ i18n.currentLang() === 'es' ? 'Video (MP4)' : 'Video (MP4)' }}</span>
                  </button>
                </div>

                <!-- Active Streams List -->
                <div class="streams-list">
                  @if (selectedTab() === 'audio') {
                    @if (info.audioStreams.length > 0) {
                      @for (stream of info.audioStreams; track stream.url) {
                        <div class="stream-item">
                          <div class="stream-meta">
                            <span class="stream-badge mono">{{ stream.format }}</span>
                            <span class="stream-quality">{{ stream.quality }}</span>
                            @if (stream.sizeBytes) {
                              <span class="stream-size mono">{{ stream.sizeBytes | byteSize }}</span>
                            }
                          </div>

                          <div class="stream-actions">
                            <a
                              [href]="stream.url"
                              target="_blank"
                              rel="noopener noreferrer"
                              class="btn btn-primary btn-sm"
                            >
                              <bt-icon name="download" [size]="14" />
                              <span>{{ i18n.currentLang() === 'es' ? 'Descargar' : 'Download' }}</span>
                            </a>
                            <button
                              type="button"
                              class="btn btn-secondary btn-sm"
                              (click)="copyLink(stream.url)"
                              title="Copiar enlace"
                            >
                              <bt-icon name="copy" [size]="14" />
                            </button>
                          </div>
                        </div>
                      }
                    } @else {
                      <div class="empty-streams">
                        <p>{{ i18n.currentLang() === 'es' ? 'No se encontraron flujos de audio independientes para este video.' : 'No audio streams found for this video.' }}</p>
                      </div>
                    }
                  } @else {
                    @if (info.videoStreams.length > 0) {
                      @for (stream of info.videoStreams; track stream.url) {
                        <div class="stream-item">
                          <div class="stream-meta">
                            <span class="stream-badge mono">{{ stream.format }}</span>
                            <span class="stream-quality">{{ stream.quality }}</span>
                          </div>

                          <div class="stream-actions">
                            <a
                              [href]="stream.url"
                              target="_blank"
                              rel="noopener noreferrer"
                              class="btn btn-primary btn-sm"
                            >
                              <bt-icon name="download" [size]="14" />
                              <span>{{ i18n.currentLang() === 'es' ? 'Descargar' : 'Download' }}</span>
                            </a>
                            <button
                              type="button"
                              class="btn btn-secondary btn-sm"
                              (click)="copyLink(stream.url)"
                              title="Copiar enlace"
                            >
                              <bt-icon name="copy" [size]="14" />
                            </button>
                          </div>
                        </div>
                      }
                    } @else {
                      <div class="empty-streams">
                        <p>{{ i18n.currentLang() === 'es' ? 'No se encontraron flujos de video directos.' : 'No direct video streams found.' }}</p>
                      </div>
                    }
                  }
                </div>
              </div>
            </div>
          }
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
        margin-top: $spacing-6;
        margin-bottom: $spacing-8;
        display: flex;
        flex-direction: column;
        gap: $spacing-6;
      }

      .input-card {
        @include card-surface;
        padding: $spacing-6;
        border-radius: $radius-xl;
        display: flex;
        flex-direction: column;
        gap: $spacing-4;
        max-width: 720px;
        margin: 0 auto;
        width: 100%;
      }

      .input-label {
        font-size: $font-sm;
        font-weight: 700;
        color: $text-primary;
      }

      .search-box {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
      }

      .input-icon {
        position: absolute;
        left: $spacing-4;
        color: #F87171;
        pointer-events: none;
      }

      .url-input {
        width: 100%;
        height: 48px;
        padding-left: 44px;
        padding-right: 44px;
        font-size: $font-sm;
        border-radius: $radius-full;
        background-color: $bg-secondary;
        border: 1px solid $border-color;
        color: $text-primary;
        outline: none;
        transition: border-color $transition-fast;

        &:focus {
          border-color: $accent-yellow;
        }

        &::placeholder {
          color: $text-muted;
        }
      }

      .btn-clear {
        position: absolute;
        right: $spacing-3;
        width: 26px;
        height: 26px;
        border-radius: $radius-full;
        background-color: $bg-surface;
        border: 1px solid $border-color;
        color: $text-muted;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        &:hover {
          color: $text-primary;
        }
      }

      .input-actions {
        display: flex;
        justify-content: flex-end;
      }

      .btn-fetch {
        min-width: 220px;
      }

      // Video Result Layout
      .video-result-layout {
        display: grid;
        grid-template-columns: 1fr;
        gap: $spacing-6;
        max-width: 720px;
        margin: 0 auto;
        width: 100%;
      }

      .preview-card {
        @include card-surface;
        padding: $spacing-5;
        border-radius: $radius-xl;
        display: flex;
        gap: $spacing-4;
        align-items: center;

        @include mobile {
          flex-direction: column;
          align-items: flex-start;
        }
      }

      .thumb-wrap {
        position: relative;
        width: 160px;
        height: 90px;
        border-radius: $radius-md;
        overflow: hidden;
        flex-shrink: 0;
        background-color: #000;

        @include mobile {
          width: 100%;
          height: 180px;
        }
      }

      .thumb-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .duration-badge {
        position: absolute;
        bottom: 6px;
        right: 6px;
        padding: 2px 6px;
        background-color: rgba(0, 0, 0, 0.8);
        color: #fff;
        font-size: 10px;
        font-weight: 700;
        border-radius: $radius-xs;
      }

      .preview-info {
        display: flex;
        flex-direction: column;
        gap: $spacing-1;
      }

      .video-title {
        font-size: $font-base;
        font-weight: 700;
        color: $text-primary;
        line-height: 1.4;
      }

      .video-author {
        font-size: $font-xs;
        color: $text-muted;
      }

      // Streams Card
      .streams-card {
        @include card-surface;
        padding: $spacing-6;
        border-radius: $radius-xl;
        display: flex;
        flex-direction: column;
        gap: $spacing-4;
      }

      .mode-tabs {
        display: flex;
        gap: $spacing-2;
        border-bottom: 1px solid $border-color;
        padding-bottom: $spacing-3;
      }

      .mode-tab {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: $spacing-2 $spacing-4;
        border-radius: $radius-full;
        background: transparent;
        border: 1px solid transparent;
        color: $text-secondary;
        font-size: $font-xs;
        font-weight: 700;
        cursor: pointer;
        transition: all $transition-fast;

        &:hover {
          color: $text-primary;
        }

        &.active {
          background-color: var(--accent-yellow-subtle);
          border-color: $accent-yellow;
          color: $accent-yellow;
        }
      }

      .streams-list {
        display: flex;
        flex-direction: column;
        gap: $spacing-3;
      }

      .stream-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: $spacing-3 $spacing-4;
        background-color: $bg-secondary;
        border: 1px solid $border-color;
        border-radius: $radius-lg;
        gap: $spacing-3;

        @include mobile {
          flex-direction: column;
          align-items: stretch;
        }
      }

      .stream-meta {
        display: flex;
        align-items: center;
        gap: $spacing-3;
      }

      .stream-badge {
        font-size: 11px;
        font-weight: 800;
        padding: 2px $spacing-2;
        border-radius: $radius-xs;
        background-color: var(--accent-yellow-subtle);
        color: $accent-yellow;
      }

      .stream-quality {
        font-size: $font-sm;
        font-weight: 600;
        color: $text-primary;
      }

      .stream-size {
        font-size: $font-xs;
        color: $text-muted;
      }

      .stream-actions {
        display: flex;
        align-items: center;
        gap: $spacing-2;
      }

      .empty-streams {
        padding: $spacing-6;
        text-align: center;
        color: $text-muted;
        font-size: $font-sm;
      }

      .spin {
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class YoutubeDownloaderComponent implements OnInit {
  private readonly toolRegistry = inject(ToolRegistryService);
  private readonly seoService = inject(SeoService);
  private readonly notificationService = inject(NotificationService);
  private readonly ytService = inject(YoutubeDownloaderService);
  protected readonly i18n = inject(TranslationService);

  protected readonly currentTool = computed(() =>
    this.toolRegistry.getToolById('youtube-downloader')
  );

  protected readonly relatedTools = computed(() =>
    this.toolRegistry.getRelatedTools('youtube-downloader')
  );

  protected urlInput = '';
  protected readonly isLoading = signal<boolean>(false);
  protected readonly videoInfo = signal<YouTubeVideoInfo | null>(null);
  protected readonly selectedTab = signal<'audio' | 'video'>('audio');

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

  async fetchVideo(): Promise<void> {
    const raw = this.urlInput.trim();
    if (!raw) return;

    const videoId = this.ytService.extractVideoId(raw);
    if (!videoId) {
      this.notificationService.error(
        this.i18n.currentLang() === 'es'
          ? 'Enlace de YouTube no válido. Asegúrate de pegar una URL de youtube.com o youtu.be'
          : 'Invalid YouTube link. Please paste a valid youtube.com or youtu.be URL.'
      );
      return;
    }

    this.isLoading.set(true);
    this.videoInfo.set(null);

    try {
      const info = await this.ytService.getVideoInfo(videoId);
      this.videoInfo.set(info);
      this.notificationService.success(
        this.i18n.currentLang() === 'es'
          ? 'Enlaces de descarga generados con éxito.'
          : 'Download streams retrieved successfully.'
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error al consultar el video de YouTube.';
      this.notificationService.error(message);
    } finally {
      this.isLoading.set(false);
    }
  }

  copyLink(url: string): void {
    navigator.clipboard.writeText(url).then(
      () => {
        this.notificationService.success(
          this.i18n.currentLang() === 'es'
            ? 'Enlace de descarga copiado al portapapeles.'
            : 'Download link copied to clipboard.'
        );
      },
      () => {
        this.notificationService.error('Error al copiar enlace.');
      }
    );
  }

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
