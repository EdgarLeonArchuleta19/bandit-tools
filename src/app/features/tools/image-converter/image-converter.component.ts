import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolRegistryService } from '../../../core/services/tool-registry.service';
import { SeoService } from '../../../core/services/seo.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TranslationService } from '../../../core/services/translation.service';
import {
  ImageToolsService,
  ProcessedImageResult,
  SupportedImageFormat,
} from '../image-tools.service';
import { ToolDefinition } from '../../../core/models/tool.model';
import { ToolHeaderComponent } from '../../../shared/components/tool-header/tool-header.component';
import { RelatedToolsComponent } from '../../../shared/components/related-tools/related-tools.component';
import { DropzoneComponent } from '../../../shared/components/dropzone/dropzone.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ByteSizePipe } from '../../../shared/pipes/byte-size.pipe';

@Component({
  selector: 'bt-image-converter',
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
          @if (!selectedFile()) {
            <bt-dropzone
              accept="image/*"
              [hint]="i18n.currentLang() === 'es' ? 'Sube cualquier imagen PNG, JPEG, WebP o SVG hasta 25MB' : 'Upload any PNG, JPEG, WebP, or SVG file up to 25MB'"
              [maxSizeMb]="25"
              (fileSelected)="onFileSelected($event)"
              (fileRejected)="onFileRejected($event)"
            />
          } @else {
            <div class="converter-workspace">
              <!-- Controls Bar -->
              <div class="controls-panel">
                <div class="control-item">
                  <label for="targetFormat" class="control-label">
                    {{ i18n.currentLang() === 'es' ? 'Convertir a formato' : 'Convert To' }}
                  </label>
                  <select
                    id="targetFormat"
                    [(ngModel)]="targetFormat"
                    (ngModelChange)="onSettingsChange()"
                    class="format-select"
                  >
                    <option value="image/png">
                      PNG (.png) — {{ i18n.currentLang() === 'es' ? 'Sin pérdida, soporte de transparencia' : 'Lossless, transparency support' }}
                    </option>
                    <option value="image/jpeg">
                      JPEG (.jpg) — {{ i18n.currentLang() === 'es' ? 'Compatibilidad universal' : 'Universal compatibility' }}
                    </option>
                    <option value="image/webp">
                      WebP (.webp) — {{ i18n.currentLang() === 'es' ? 'Moderna, alta eficiencia' : 'Next-gen high efficiency' }}
                    </option>
                  </select>
                </div>

                @if (targetFormat !== 'image/png') {
                  <div class="control-item">
                    <div class="control-header">
                      <label for="qualitySlider" class="control-label">
                        {{ i18n.currentLang() === 'es' ? 'Calidad de imagen' : 'Quality' }}
                      </label>
                      <span class="control-badge mono">{{ qualityPercent }}%</span>
                    </div>
                    <input
                      id="qualitySlider"
                      type="range"
                      min="20"
                      max="100"
                      step="5"
                      [(ngModel)]="qualityPercent"
                      (ngModelChange)="onSettingsChange()"
                      class="quality-slider"
                    />
                  </div>
                }

                <div class="actions-group">
                  <button
                    type="button"
                    class="btn btn-primary btn-lg"
                    (click)="onDownload()"
                    [disabled]="isProcessing() || !convertedResult()"
                  >
                    <bt-icon name="download" [size]="18" />
                    <span>{{ i18n.currentLang() === 'es' ? 'Descargar ' + (targetExtension() | uppercase) : 'Download ' + (targetExtension() | uppercase) }}</span>
                  </button>
                  <button
                    type="button"
                    class="btn btn-ghost"
                    (click)="onReset()"
                  >
                    <bt-icon name="refresh-cw" [size]="16" />
                    <span>{{ i18n.currentLang() === 'es' ? 'Convertir otra imagen' : 'Convert Another' }}</span>
                  </button>
                </div>
              </div>

              <!-- Transparency Warning for JPEG -->
              @if (isJpegTarget() && isSourcePng()) {
                <div class="notice-box">
                  <bt-icon name="info" [size]="18" />
                  <span>
                    {{ i18n.currentLang() === 'es'
                      ? 'Conversión a JPEG: JPEG no admite transparencia. Los píxeles transparentes se rellenarán con fondo blanco sólido.'
                      : 'Converting to JPEG: JPEG does not support transparency. Any transparent background pixels will be converted to solid white.' }}
                  </span>
                </div>
              }

              <!-- Previews Grid -->
              <div class="comparison-grid">
                <!-- Source Preview -->
                <div class="preview-card">
                  <div class="card-meta">
                    <span class="meta-title">{{ i18n.currentLang() === 'es' ? 'Imagen de Origen' : 'Source Image' }}</span>
                    <span class="meta-tag">{{ selectedFile()?.size | byteSize }}</span>
                  </div>
                  <div class="image-wrapper">
                    @if (sourcePreviewUrl()) {
                      <img [src]="sourcePreviewUrl()" [alt]="selectedFile()?.name || 'Source image'" />
                    }
                  </div>
                  <div class="card-footer-info">
                    <span class="file-name">{{ selectedFile()?.name }}</span>
                  </div>
                </div>

                <!-- Converted Result Preview -->
                <div class="preview-card result-preview">
                  <div class="card-meta">
                    <div class="result-meta-title">
                      <span class="meta-title">
                        {{ i18n.currentLang() === 'es' ? 'Imagen Convertida' : 'Converted Image' }} ({{ targetExtension() | uppercase }})
                      </span>
                    </div>
                    @if (convertedResult(); as res) {
                      <span class="meta-tag highlight">{{ res.fileSizeBytes | byteSize }}</span>
                    }
                  </div>

                  <div class="image-wrapper">
                    @if (isProcessing()) {
                      <div class="processing-overlay">
                        <bt-icon name="refresh-cw" [size]="32" class="spin-icon" />
                        <span>{{ i18n.currentLang() === 'es' ? 'Convirtiendo formato...' : 'Converting format...' }}</span>
                      </div>
                    } @else if (convertedResult(); as res) {
                      <img [src]="res.objectUrl" [alt]="res.fileName" />
                    }
                  </div>

                  <div class="card-footer-info">
                    @if (convertedResult(); as res) {
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

      .converter-workspace {
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
          grid-template-columns: 1.5fr 1fr;
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

      .format-select {
        width: 100%;
        height: 40px;
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
          color: $accent-yellow;
          border-color: rgba(255, 212, 59, 0.3);
          background-color: $accent-yellow-subtle;
        }
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
export class ImageConverterComponent implements OnInit, OnDestroy {
  private readonly toolRegistry = inject(ToolRegistryService);
  private readonly imageService = inject(ImageToolsService);
  private readonly seoService = inject(SeoService);
  private readonly notificationService = inject(NotificationService);
  protected readonly i18n = inject(TranslationService);

  protected readonly tool = signal<ToolDefinition | undefined>(undefined);
  protected readonly relatedTools = signal<ToolDefinition[]>([]);

  protected readonly selectedFile = signal<File | null>(null);
  protected readonly sourcePreviewUrl = signal<string | null>(null);
  protected readonly convertedResult = signal<ProcessedImageResult | null>(null);
  protected readonly isProcessing = signal<boolean>(false);

  protected targetFormat: SupportedImageFormat = 'image/webp';
  protected qualityPercent = 85;

  ngOnInit(): void {
    const t = this.toolRegistry.getToolById('image-converter');
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

    // If source file is JPEG, default target to WebP or PNG
    if (file.type === 'image/jpeg') {
      this.targetFormat = 'image/webp';
    } else if (file.type === 'image/png') {
      this.targetFormat = 'image/webp';
    }

    const previewUrl = URL.createObjectURL(file);
    this.sourcePreviewUrl.set(previewUrl);

    this.processConversion();
  }

  onFileRejected(reason: string): void {
    this.notificationService.error(reason);
  }

  onSettingsChange(): void {
    if (this.selectedFile()) {
      this.processConversion();
    }
  }

  targetExtension(): string {
    return this.imageService.mimeToExtension(this.targetFormat);
  }

  isJpegTarget(): boolean {
    return this.targetFormat === 'image/jpeg';
  }

  isSourcePng(): boolean {
    const f = this.selectedFile();
    return !!f && f.type === 'image/png';
  }

  private async processConversion(): Promise<void> {
    const file = this.selectedFile();
    if (!file) return;

    this.isProcessing.set(true);

    try {
      const result = await this.imageService.convertImage(file, {
        targetFormat: this.targetFormat,
        quality: this.qualityPercent / 100,
      });

      this.convertedResult.set(result);
    } catch (err: any) {
      const isEs = this.i18n.currentLang() === 'es';
      this.notificationService.error(
        isEs ? `Error de conversión: ${err.message}` : `Conversion error: ${err.message}`
      );
    } finally {
      this.isProcessing.set(false);
    }
  }

  onDownload(): void {
    const res = this.convertedResult();
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
    this.sourcePreviewUrl.set(null);
    this.convertedResult.set(null);
  }

  private cleanupUrls(): void {
    const prev = this.sourcePreviewUrl();
    if (prev) {
      URL.revokeObjectURL(prev);
    }
    this.imageService.revokeAllUrls();
  }
}
