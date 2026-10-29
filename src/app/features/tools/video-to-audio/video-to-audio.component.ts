import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolRegistryService } from '../../../core/services/tool-registry.service';
import { SeoService } from '../../../core/services/seo.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TranslationService } from '../../../core/services/translation.service';
import { ToolDefinition } from '../../../core/models/tool.model';
import { DropzoneComponent } from '../../../shared/components/dropzone/dropzone.component';
import { RelatedToolsComponent } from '../../../shared/components/related-tools/related-tools.component';
import { ToolHeaderComponent } from '../../../shared/components/tool-header/tool-header.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ByteSizePipe } from '../../../shared/pipes/byte-size.pipe';
import {
  VideoToAudioService,
  ExtractedAudioResult,
  ExtractionProgress,
} from './video-to-audio.service';

@Component({
  selector: 'bt-video-to-audio',
  standalone: true,
  imports: [
    CommonModule,
    DropzoneComponent,
    RelatedToolsComponent,
    ToolHeaderComponent,
    IconComponent,
    ByteSizePipe,
  ],
  template: `
    <div class="tool-page-container">
      @if (currentTool(); as currentTool) {
        <bt-tool-header [tool]="currentTool" />

        <div class="workspace">
          @if (!selectedFile()) {
            <!-- Upload Box -->
            <div class="upload-section">
              <bt-dropzone
                accept="video/*,.mp4,.webm,.mov,.mkv,.avi,.ogv"
                [maxSizeMb]="500"
                iconName="video"
                [hint]="i18n.currentLang() === 'es' ? 'Soporta MP4, WebM, MOV, MKV, AVI' : 'Supports MP4, WebM, MOV, MKV, AVI'"
                (fileSelected)="onFileSelected($event)"
              />
            </div>
          } @else {
            <div class="processing-layout">
              <!-- Source Video Card -->
              <div class="video-meta-card">
                <div class="card-header-row">
                  <div class="meta-title-group">
                    <bt-icon name="video" [size]="20" class="icon-accent" />
                    <div class="meta-text">
                      <span class="file-name">{{ selectedFile()?.name }}</span>
                      <span class="file-size">{{ selectedFile()?.size | byteSize }} &bull; Video Local</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    class="btn-reset"
                    (click)="resetTool()"
                    [disabled]="isProcessing()"
                    title="Cargar otro video"
                  >
                    <bt-icon name="trash" [size]="16" />
                  </button>
                </div>

                @if (isProcessing()) {
                  <div class="progress-container">
                    <div class="progress-bar">
                      <div class="progress-fill" [style.width.%]="progress()?.percent || 0"></div>
                    </div>
                    <span class="progress-msg">{{ progress()?.message }}</span>
                  </div>
                }
              </div>

              <!-- Extracted Audio Result Card -->
              @if (audioResult(); as res) {
                <div class="result-card">
                  <div class="result-header">
                    <div class="result-badge">
                      <bt-icon name="check-circle" [size]="16" />
                      <span>{{ i18n.currentLang() === 'es' ? 'Audio Extraído con Éxito' : 'Audio Extracted' }}</span>
                    </div>
                    <span class="audio-format-tag">WAV 16-BIT PCM</span>
                  </div>

                  <div class="audio-player-wrapper">
                    <audio [src]="res.url" controls class="native-audio-player"></audio>
                  </div>

                  <div class="audio-specs-grid">
                    <div class="spec-item">
                      <span class="spec-label">{{ i18n.currentLang() === 'es' ? 'Duración' : 'Duration' }}</span>
                      <span class="spec-value mono">{{ formatDuration(res.duration) }}</span>
                    </div>
                    <div class="spec-item">
                      <span class="spec-label">{{ i18n.currentLang() === 'es' ? 'Frecuencia' : 'Sample Rate' }}</span>
                      <span class="spec-value mono">{{ res.sampleRate }} Hz</span>
                    </div>
                    <div class="spec-item">
                      <span class="spec-label">{{ i18n.currentLang() === 'es' ? 'Canales' : 'Channels' }}</span>
                      <span class="spec-value">{{ res.channels === 1 ? 'Mono' : 'Estéreo' }}</span>
                    </div>
                    <div class="spec-item">
                      <span class="spec-label">{{ i18n.currentLang() === 'es' ? 'Tamaño Audio' : 'Audio Size' }}</span>
                      <span class="spec-value mono">{{ res.sizeBytes | byteSize }}</span>
                    </div>
                  </div>

                  <div class="actions-row">
                    <a
                      [href]="res.url"
                      [download]="res.fileName"
                      class="btn btn-primary btn-lg download-btn"
                    >
                      <bt-icon name="download" [size]="18" />
                      <span>{{ i18n.currentLang() === 'es' ? 'Descargar Audio (.WAV)' : 'Download Audio (.WAV)' }}</span>
                    </a>

                    <button
                      type="button"
                      class="btn btn-secondary btn-lg"
                      (click)="resetTool()"
                    >
                      <span>{{ i18n.currentLang() === 'es' ? 'Convertir Otro Video' : 'Convert Another Video' }}</span>
                    </button>
                  </div>
                </div>
              }
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
      }

      .processing-layout {
        display: flex;
        flex-direction: column;
        gap: $spacing-6;
        max-width: 720px;
        margin: 0 auto;
      }

      .video-meta-card {
        @include card-surface;
        padding: $spacing-5;
        border-radius: $radius-xl;
        display: flex;
        flex-direction: column;
        gap: $spacing-4;
      }

      .card-header-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .meta-title-group {
        display: flex;
        align-items: center;
        gap: $spacing-3;
      }

      .icon-accent {
        color: $accent-yellow;
      }

      .meta-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .file-name {
        font-size: $font-sm;
        font-weight: 700;
        color: $text-primary;
        word-break: break-all;
      }

      .file-size {
        font-size: $font-xs;
        color: $text-muted;
      }

      .btn-reset {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: $radius-full;
        background-color: $bg-secondary;
        border: 1px solid $border-color;
        color: $text-muted;
        cursor: pointer;
        transition: all $transition-fast;

        &:hover:not(:disabled) {
          color: $color-error;
          border-color: $color-error;
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      .progress-container {
        display: flex;
        flex-direction: column;
        gap: $spacing-2;
      }

      .progress-bar {
        width: 100%;
        height: 6px;
        background-color: $bg-secondary;
        border-radius: $radius-full;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        background-color: $accent-yellow;
        transition: width 0.3s ease;
      }

      .progress-msg {
        font-size: $font-xs;
        color: $accent-yellow;
        font-weight: 500;
      }

      // Result Card
      .result-card {
        @include card-surface;
        padding: $spacing-6;
        border-radius: $radius-2xl;
        display: flex;
        flex-direction: column;
        gap: $spacing-5;
        border: 1px solid rgba(255, 212, 59, 0.3);
      }

      .result-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .result-badge {
        display: flex;
        align-items: center;
        gap: $spacing-2;
        color: $color-success;
        font-size: $font-sm;
        font-weight: 700;
      }

      .audio-format-tag {
        font-size: 11px;
        font-weight: 800;
        padding: 3px $spacing-2;
        border-radius: $radius-xs;
        background-color: var(--accent-yellow-subtle);
        color: $accent-yellow;
        border: 1px solid rgba(255, 212, 59, 0.3);
      }

      .audio-player-wrapper {
        width: 100%;
      }

      .native-audio-player {
        width: 100%;
        height: 40px;
        border-radius: $radius-md;
        outline: none;
      }

      .audio-specs-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: $spacing-3;
        background-color: $bg-secondary;
        padding: $spacing-4;
        border-radius: $radius-lg;
        border: 1px solid $border-color;

        @include tablet-up {
          grid-template-columns: repeat(4, 1fr);
        }
      }

      .spec-item {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .spec-label {
        font-size: 11px;
        color: $text-muted;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .spec-value {
        font-size: $font-sm;
        font-weight: 700;
        color: $text-primary;
      }

      .actions-row {
        display: flex;
        align-items: center;
        gap: $spacing-3;
        flex-wrap: wrap;
      }

      .download-btn {
        flex: 1;
        min-width: 200px;
      }
    `,
  ],
})
export class VideoToAudioComponent implements OnInit, OnDestroy {
  private readonly toolRegistry = inject(ToolRegistryService);
  private readonly seoService = inject(SeoService);
  private readonly notificationService = inject(NotificationService);
  private readonly videoAudioService = inject(VideoToAudioService);
  protected readonly i18n = inject(TranslationService);

  protected readonly currentTool = computed(() =>
    this.toolRegistry.getToolById('video-to-audio')
  );

  protected readonly relatedTools = computed(() =>
    this.toolRegistry.getRelatedTools('video-to-audio')
  );

  protected readonly selectedFile = signal<File | null>(null);
  protected readonly isProcessing = signal<boolean>(false);
  protected readonly progress = signal<ExtractionProgress | null>(null);
  protected readonly audioResult = signal<ExtractedAudioResult | null>(null);

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

  ngOnDestroy(): void {
    this.videoAudioService.revokeAll();
  }

  async onFileSelected(file: File): Promise<void> {
    this.selectedFile.set(file);
    this.isProcessing.set(true);
    this.audioResult.set(null);

    try {
      const result = await this.videoAudioService.extractAudioFromVideo(
        file,
        (prog) => this.progress.set(prog)
      );
      this.audioResult.set(result);
      this.notificationService.success(
        this.i18n.currentLang() === 'es'
          ? 'Pista de audio extraída con éxito.'
          : 'Audio track extracted successfully.'
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error inesperado al decodificar el video.';
      this.notificationService.error(message);
    } finally {
      this.isProcessing.set(false);
    }
  }

  resetTool(): void {
    this.selectedFile.set(null);
    this.audioResult.set(null);
    this.progress.set(null);
    this.isProcessing.set(false);
    this.videoAudioService.revokeAll();
  }

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
