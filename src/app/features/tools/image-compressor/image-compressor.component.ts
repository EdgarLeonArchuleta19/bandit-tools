import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolRegistryService } from '../../../core/services/tool-registry.service';
import { SeoService } from '../../../core/services/seo.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TranslationService } from '../../../core/services/translation.service';
import { ImageToolsService, ProcessedImageResult } from '../image-tools.service';
import { ToolDefinition } from '../../../core/models/tool.model';
import { ToolHeaderComponent } from '../../../shared/components/tool-header/tool-header.component';
import { RelatedToolsComponent } from '../../../shared/components/related-tools/related-tools.component';
import { DropzoneComponent } from '../../../shared/components/dropzone/dropzone.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ByteSizePipe } from '../../../shared/pipes/byte-size.pipe';

@Component({
  selector: 'bt-image-compressor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToolHeaderComponent,
    RelatedToolsComponent,
    DropzoneComponent,
    IconComponent,
    ByteSizePipe,
  ],
  template: `
    <div class="tool-page-container">
      @if (tool(); as currentTool) {
        <bt-tool-header [tool]="currentTool" />

        <div class="workspace">
          <!-- Step 1: Upload Dropzone if no file selected -->
          @if (!selectedFile()) {
            <bt-dropzone
              accept="image/jpeg,image/png,image/webp"
              [hint]="i18n.currentLang() === 'es' ? 'Archivos JPEG, PNG o WebP hasta 25MB' : 'JPEG, PNG, or WebP up to 25MB'"
              [maxSizeMb]="25"
              (fileSelected)="onFileSelected($event)"
              (fileRejected)="onFileRejected($event)"
            />
          } @else {
            <!-- Step 2: Controls & Comparison Workspace -->
            <div class="compression-workspace">
              <!-- Controls Bar -->
              <div class="controls-panel">
                <div class="control-item">
                  <div class="control-header">
                    <label for="qualitySlider" class="control-label">
                      {{ i18n.currentLang() === 'es' ? 'Calidad de compresión' : 'Compression Quality' }}
                    </label>
                    <span class="control-badge mono">{{ qualityPercent }}%</span>
                  </div>
                  <input
                    id="qualitySlider"
                    type="range"
                    min="10"
                    max="95"
                    step="5"
                    [(ngModel)]="qualityPercent"
                    (ngModelChange)="onSettingsChange()"
                    class="quality-slider"
                  />
                  <div class="slider-hints">
                    <span>{{ i18n.currentLang() === 'es' ? 'Menor tamaño' : 'Smaller file' }}</span>
                    <span>{{ i18n.currentLang() === 'es' ? 'Mayor calidad' : 'Higher quality' }}</span>
                  </div>
                </div>

                <div class="control-item">
                  <label for="formatSelect" class="control-label">
                    {{ i18n.currentLang() === 'es' ? 'Formato de salida' : 'Output Format' }}
                  </label>
                  <select
                    id="formatSelect"
                    [(ngModel)]="selectedFormat"
                    (ngModelChange)="onSettingsChange()"
                    class="format-select"
                  >
                    <option value="original">
                      {{ i18n.currentLang() === 'es' ? 'Conservar original (' + originalFormatLabel() + ')' : 'Preserve Original (' + originalFormatLabel() + ')' }}
                    </option>
                    <option value="image/webp">
                      WebP ({{ i18n.currentLang() === 'es' ? 'Moderno, máxima compresión' : 'Modern, high compression' }})
                    </option>
                    <option value="image/jpeg">
                      JPEG ({{ i18n.currentLang() === 'es' ? 'Compatibilidad universal' : 'Universal compatibility' }})
                    </option>
                  </select>
                </div>

                <div class="control-item">
                  <label for="resolutionSelect" class="control-label">
                    {{ i18n.currentLang() === 'es' ? 'Resolución máxima' : 'Max Resolution' }}
                  </label>
                  <select
                    id="resolutionSelect"
                    [(ngModel)]="selectedMaxWidth"
                    (ngModelChange)="onSettingsChange()"
                    class="format-select"
                  >
                    <option [ngValue]="null">
                      {{ i18n.currentLang() === 'es' ? 'Dimensiones originales' : 'Original Dimensions' }}
                    </option>
                    <option [ngValue]="1920">Full HD (1920px max)</option>
                    <option [ngValue]="1280">Standard HD (1280px max)</option>
                    <option [ngValue]="800">
                      {{ i18n.currentLang() === 'es' ? 'Miniatura Web (800px max)' : 'Web Thumbnail (800px max)' }}
                    </option>
                  </select>
                </div>

                <div class="actions-group">
                  <button
                    type="button"
                    class="btn btn-primary btn-lg"
                    (click)="onDownload()"
                    [disabled]="isProcessing() || !processedResult()"
                  >
                    <bt-icon name="download" [size]="18" />
                    <span>{{ i18n.currentLang() === 'es' ? 'Descargar comprimida' : 'Download Compressed' }}</span>
                  </button>
                  <button
                    type="button"
                    class="btn btn-ghost"
                    (click)="onReset()"
                  >
                    <bt-icon name="refresh-cw" [size]="16" />
                    <span>{{ i18n.currentLang() === 'es' ? 'Comprimir otra imagen' : 'Compress Another' }}</span>
                  </button>
                </div>
              </div>

              <!-- Format notice if converting PNG to JPEG -->
              @if (isJpegFromPng()) {
                <div class="notice-box">
                  <bt-icon name="info" [size]="18" />
                  <span>
                    {{ i18n.currentLang() === 'es'
                      ? 'Nota: JPEG no soporta transparencia. Las zonas transparentes se rellenarán con fondo blanco limpio.'
                      : 'Note: JPEG does not support transparency. Transparent areas will be converted to a clean white background.' }}
                  </span>
                </div>
              }

              <!-- Previews & Comparison Grid -->
              <div class="comparison-grid">
                <!-- Original Image Card -->
                <div class="preview-card">
                  <div class="card-meta">
                    <span class="meta-title">{{ i18n.currentLang() === 'es' ? 'Imagen Original' : 'Original Image' }}</span>
                    <span class="meta-tag">{{ selectedFile()?.size | byteSize }}</span>
                  </div>
                  <div class="image-wrapper">
                    @if (originalPreviewUrl()) {
                      <img [src]="originalPreviewUrl()" [alt]="selectedFile()?.name || 'Original Image'" />
                    }
                  </div>
                  <div class="card-footer-info">
                    <span class="file-name">{{ selectedFile()?.name }}</span>
                  </div>
                </div>

                <!-- Compressed Image Card -->
                <div class="preview-card result-preview">
                  <div class="card-meta">
                    <div class="result-meta-title">
                      <span class="meta-title">{{ i18n.currentLang() === 'es' ? 'Resultado Comprimido' : 'Compressed Result' }}</span>
                      @if (processedResult(); as res) {
                        @if (!res.isLarger) {
                          <span class="savings-pill">
                            -{{ res.percentSaved }}% ({{ i18n.currentLang() === 'es' ? 'Ahorro: ' : 'Saved: ' }}{{ res.bytesSaved | byteSize }})
                          </span>
                        } @else {
                          <span class="larger-pill">{{ i18n.currentLang() === 'es' ? 'Ya optimizada' : 'Already well-compressed' }}</span>
                        }
                      }
                    </div>
                    @if (processedResult(); as res) {
                      <span class="meta-tag highlight">{{ res.fileSizeBytes | byteSize }}</span>
                    }
                  </div>

                  <div class="image-wrapper">
                    @if (isProcessing()) {
                      <div class="processing-overlay">
                        <bt-icon name="refresh-cw" [size]="32" class="spin-icon" />
                        <span>{{ i18n.currentLang() === 'es' ? 'Comprimiendo imagen...' : 'Compressing image...' }}</span>
                      </div>
                    } @else if (processedResult(); as res) {
                      <img [src]="res.objectUrl" [alt]="res.fileName" />
                    }
                  </div>

                  <div class="card-footer-info">
                    @if (processedResult(); as res) {
                      <span class="file-name">{{ res.fileName }} &bull; {{ res.width }} &times; {{ res.height }}px</span>
                    }
                  </div>
                </div>
              </div>
            </div>
          }
        </div>

        <bt-related-tools
          [tools]="relatedTools()"
        />
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
        display: flex;
        flex-direction: column;
        gap: $spacing-6;
      }

      .compression-workspace {
        display: flex;
        flex-direction: column;
        gap: $spacing-6;
      }

      .controls-panel {
        @include card-surface;
        padding: $spacing-5;
        display: grid;
        grid-template-columns: 1fr;
        gap: $spacing-5;

        @include tablet-up {
          grid-template-columns: 1.5fr 1fr 1fr;
        }
      }

      .control-item {
        display: flex;
        flex-direction: column;
        gap: $spacing-2;
      }

      .control-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .control-label {
        font-size: $font-sm;
        font-weight: 500;
        color: $text-primary;
      }

      .control-badge {
        font-size: $font-xs;
        color: $accent-yellow;
        background-color: $bg-secondary;
        padding: 2px $spacing-2;
        border-radius: $radius-sm;
        border: 1px solid $border-color;
      }

      .slider-hints {
        display: flex;
        justify-content: space-between;
        font-size: $font-xs;
        color: $text-muted;
      }

      .format-select {
        width: 100%;
        height: 38px;
      }

      .actions-group {
        display: flex;
        align-items: center;
        gap: $spacing-3;
        grid-column: 1 / -1;
        padding-top: $spacing-3;
        border-top: 1px solid $border-color;
        flex-wrap: wrap;
      }

      .notice-box {
        display: flex;
        align-items: center;
        gap: $spacing-3;
        padding: $spacing-3 $spacing-4;
        background-color: $bg-surface;
        border: 1px solid $border-color;
        border-radius: $radius-md;
        font-size: $font-xs;
        color: $accent-yellow;
      }

      .comparison-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: $spacing-6;

        @include desktop {
          grid-template-columns: 1fr 1fr;
        }
      }

      .preview-card {
        @include card-surface;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        &.result-preview {
          border-color: rgba(255, 212, 59, 0.4);
        }
      }

      .card-meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: $spacing-3 $spacing-4;
        background-color: $bg-secondary;
        border-bottom: 1px solid $border-color;
      }

      .result-meta-title {
        display: flex;
        align-items: center;
        gap: $spacing-2;
        flex-wrap: wrap;
      }

      .meta-title {
        font-size: $font-sm;
        font-weight: 600;
        color: $text-primary;
      }

      .meta-tag {
        font-size: $font-xs;
        font-family: $font-mono;
        color: $text-secondary;
        background-color: $bg-surface;
        padding: 2px $spacing-2;
        border-radius: $radius-sm;
        border: 1px solid $border-color;

        &.highlight {
          color: $color-success;
          border-color: rgba(74, 222, 128, 0.3);
          background-color: $color-success-bg;
        }
      }

      .savings-pill {
        font-size: $font-xs;
        font-weight: 600;
        color: $color-success;
        background-color: $color-success-bg;
        padding: 2px $spacing-2;
        border-radius: $radius-full;
        border: 1px solid rgba(74, 222, 128, 0.25);
      }

      .larger-pill {
        font-size: $font-xs;
        color: $text-muted;
      }

      .image-wrapper {
        min-height: 320px;
        max-height: 480px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #080809;
        position: relative;
        overflow: hidden;
        padding: $spacing-4;

        img {
          max-height: 440px;
          object-fit: contain;
          border-radius: $radius-sm;
        }
      }

      .processing-overlay {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: $spacing-3;
        color: $accent-yellow;
        font-size: $font-sm;
      }

      .spin-icon {
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        100% {
          transform: rotate(360deg);
        }
      }

      .card-footer-info {
        padding: $spacing-3 $spacing-4;
        background-color: $bg-secondary;
        border-top: 1px solid $border-color;
        font-size: $font-xs;
        color: $text-muted;
      }

      .file-name {
        @include text-truncate;
        display: block;
      }
    `,
  ],
})
export class ImageCompressorComponent implements OnInit, OnDestroy {
  private readonly toolRegistry = inject(ToolRegistryService);
  private readonly imageService = inject(ImageToolsService);
  private readonly seoService = inject(SeoService);
  private readonly notificationService = inject(NotificationService);
  protected readonly i18n = inject(TranslationService);

  protected readonly tool = signal<ToolDefinition | undefined>(undefined);
  protected readonly relatedTools = signal<ToolDefinition[]>([]);

  protected readonly selectedFile = signal<File | null>(null);
  protected readonly originalPreviewUrl = signal<string | null>(null);
  protected readonly processedResult = signal<ProcessedImageResult | null>(null);
  protected readonly isProcessing = signal<boolean>(false);

  protected qualityPercent = 75;
  protected selectedFormat: 'original' | 'image/jpeg' | 'image/png' | 'image/webp' = 'original';
  protected selectedMaxWidth: number | null = null;

  ngOnInit(): void {
    const t = this.toolRegistry.getToolById('image-compressor');
    this.tool.set(t);

    if (t) {
      this.seoService.updateSeo({
        title: t.name,
        description: t.description,
        keywords: t.keywords,
      });
      this.relatedTools.set(this.toolRegistry.getRelatedTools(t.id));
    }
  }

  ngOnDestroy(): void {
    this.cleanupUrls();
  }

  onFileSelected(file: File): void {
    this.cleanupUrls();
    this.selectedFile.set(file);

    const previewUrl = URL.createObjectURL(file);
    this.originalPreviewUrl.set(previewUrl);

    this.processImage();
  }

  onFileRejected(reason: string): void {
    this.notificationService.error(reason);
  }

  onSettingsChange(): void {
    if (this.selectedFile()) {
      this.processImage();
    }
  }

  originalFormatLabel(): string {
    const file = this.selectedFile();
    if (!file) return 'Default';
    if (file.type.includes('png')) return 'PNG';
    if (file.type.includes('webp')) return 'WebP';
    return 'JPEG';
  }

  isJpegFromPng(): boolean {
    const file = this.selectedFile();
    if (!file) return false;
    const isPng = file.type === 'image/png';
    const isTargetJpeg = this.selectedFormat === 'image/jpeg';
    return isPng && isTargetJpeg;
  }

  private async processImage(): Promise<void> {
    const file = this.selectedFile();
    if (!file) return;

    this.isProcessing.set(true);

    try {
      const result = await this.imageService.compressImage(file, {
        quality: this.qualityPercent / 100,
        format: this.selectedFormat,
        maxWidth: this.selectedMaxWidth || undefined,
      });

      this.processedResult.set(result);
    } catch (err: any) {
      const isEs = this.i18n.currentLang() === 'es';
      this.notificationService.error(
        isEs ? `Error de compresión: ${err.message}` : `Compression error: ${err.message}`
      );
    } finally {
      this.isProcessing.set(false);
    }
  }

  onDownload(): void {
    const res = this.processedResult();
    if (!res) return;

    const link = document.createElement('a');
    link.href = res.objectUrl;
    link.download = res.fileName;
    link.click();
    const isEs = this.i18n.currentLang() === 'es';
    this.notificationService.success(
      isEs ? `Imagen ${res.fileName} descargada con éxito` : `Downloaded ${res.fileName}`
    );
  }

  onReset(): void {
    this.cleanupUrls();
    this.selectedFile.set(null);
    this.originalPreviewUrl.set(null);
    this.processedResult.set(null);
  }

  private cleanupUrls(): void {
    const prev = this.originalPreviewUrl();
    if (prev) {
      URL.revokeObjectURL(prev);
    }
    this.imageService.revokeAllUrls();
  }
}
