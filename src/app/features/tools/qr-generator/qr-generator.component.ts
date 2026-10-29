import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolRegistryService } from '../../../core/services/tool-registry.service';
import { SeoService } from '../../../core/services/seo.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TranslationService } from '../../../core/services/translation.service';
import {
  QrGeneratorService,
  QrOptions,
  QrErrorCorrectionLevel,
} from './qr-generator.service';
import { ToolDefinition } from '../../../core/models/tool.model';
import { ToolHeaderComponent } from '../../../shared/components/tool-header/tool-header.component';
import { RelatedToolsComponent } from '../../../shared/components/related-tools/related-tools.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'bt-qr-generator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToolHeaderComponent,
    RelatedToolsComponent,
    IconComponent,
  ],
  template: `
    <div class="tool-page-container">
      @if (tool(); as currentTool) {
        <bt-tool-header [tool]="currentTool" />

        <div class="workspace">
          <div class="qr-layout">
            <!-- Left: Form Controls -->
            <div class="controls-column">
              <!-- Content Type Tabs -->
              <div class="type-tabs" role="tablist" aria-label="QR Content Type">
                <button
                  type="button"
                  class="tab-btn"
                  [class.active]="activeTab === 'url'"
                  (click)="setTab('url')"
                  role="tab"
                  [attr.aria-selected]="activeTab === 'url'"
                >
                  <bt-icon name="external-link" [size]="16" />
                  <span>{{ i18n.currentLang() === 'es' ? 'Enlace / Texto' : 'URL / Text' }}</span>
                </button>
                <button
                  type="button"
                  class="tab-btn"
                  [class.active]="activeTab === 'wifi'"
                  (click)="setTab('wifi')"
                  role="tab"
                  [attr.aria-selected]="activeTab === 'wifi'"
                >
                  <bt-icon name="sparkles" [size]="16" />
                  <span>{{ i18n.currentLang() === 'es' ? 'Red Wi-Fi' : 'Wi-Fi Network' }}</span>
                </button>
              </div>

              <!-- Input Area -->
              <div class="input-card">
                @if (activeTab === 'url') {
                  <div class="input-group">
                    <label for="qrInputText" class="input-label">
                      {{ i18n.currentLang() === 'es' ? 'Contenido o enlace URL' : 'Content or URL' }}
                    </label>
                    <textarea
                      id="qrInputText"
                      class="qr-textarea"
                      [(ngModel)]="qrData"
                      (ngModelChange)="onDataChange()"
                      [placeholder]="i18n.currentLang() === 'es' ? 'Ingresa una URL (https://...) o cualquier texto...' : 'Enter a website URL (https://...) or any text data...'"
                      rows="3"
                    ></textarea>
                  </div>
                } @else {
                  <div class="wifi-form">
                    <div class="input-group">
                      <label for="wifiSsid" class="input-label">
                        {{ i18n.currentLang() === 'es' ? 'Nombre de red (SSID)' : 'Network Name (SSID)' }}
                      </label>
                      <input
                        id="wifiSsid"
                        type="text"
                        [(ngModel)]="wifiSsid"
                        (ngModelChange)="onWifiChange()"
                        placeholder="MiWifiEnCasa"
                      />
                    </div>
                    <div class="input-group">
                      <label for="wifiPass" class="input-label">
                        {{ i18n.currentLang() === 'es' ? 'Contraseña Wi-Fi' : 'Password' }}
                      </label>
                      <input
                        id="wifiPass"
                        type="text"
                        [(ngModel)]="wifiPassword"
                        (ngModelChange)="onWifiChange()"
                        placeholder="Contraseña de la red"
                      />
                    </div>
                  </div>
                }

                <div class="input-actions">
                  <button
                    type="button"
                    class="btn btn-ghost btn-sm"
                    (click)="onCopyData()"
                    [disabled]="!getRawData().trim()"
                  >
                    <bt-icon [name]="dataCopied() ? 'check' : 'copy'" [size]="14" />
                    <span>{{ dataCopied() ? (i18n.currentLang() === 'es' ? '¡Copiado!' : 'Copied!') : (i18n.currentLang() === 'es' ? 'Copiar datos' : 'Copy Data') }}</span>
                  </button>
                  <button
                    type="button"
                    class="btn btn-ghost btn-sm text-error"
                    (click)="onClear()"
                    [disabled]="!getRawData().trim()"
                  >
                    <bt-icon name="trash" [size]="14" />
                    <span>{{ i18n.currentLang() === 'es' ? 'Limpiar' : 'Clear' }}</span>
                  </button>
                </div>
              </div>

              <!-- Appearance Customization Card -->
              <div class="custom-card">
                <h3 class="custom-title">{{ i18n.currentLang() === 'es' ? 'Colores y Estilo' : 'Colors & Style' }}</h3>

                <div class="color-pickers-row">
                  <div class="color-picker-item">
                    <label for="fgColor" class="color-label">
                      {{ i18n.currentLang() === 'es' ? 'Puntos QR (Frontal)' : 'Foreground (Dots)' }}
                    </label>
                    <div class="color-input-wrap">
                      <input
                        id="fgColor"
                        type="color"
                        [(ngModel)]="options.darkColor"
                        (ngModelChange)="renderQr()"
                        class="color-swatch"
                      />
                      <input
                        type="text"
                        [(ngModel)]="options.darkColor"
                        (ngModelChange)="renderQr()"
                        class="color-hex mono"
                      />
                    </div>
                  </div>

                  <div class="color-picker-item">
                    <label for="bgColor" class="color-label">
                      {{ i18n.currentLang() === 'es' ? 'Color de fondo' : 'Background' }}
                    </label>
                    <div class="color-input-wrap">
                      <input
                        id="bgColor"
                        type="color"
                        [(ngModel)]="options.lightColor"
                        (ngModelChange)="renderQr()"
                        class="color-swatch"
                      />
                      <input
                        type="text"
                        [(ngModel)]="options.lightColor"
                        (ngModelChange)="renderQr()"
                        class="color-hex mono"
                      />
                    </div>
                  </div>
                </div>

                <!-- Color Palette Presets -->
                <div class="palette-presets">
                  <span class="preset-label">{{ i18n.currentLang() === 'es' ? 'Estilos rápidos:' : 'Presets:' }}</span>
                  <button
                    type="button"
                    class="preset-chip"
                    (click)="applyPreset('#0D0E0E', '#FFFFFF')"
                  >
                    {{ i18n.currentLang() === 'es' ? 'Monocromo' : 'Monochrome' }}
                  </button>
                  <button
                    type="button"
                    class="preset-chip"
                    (click)="applyPreset('#0D0E0E', '#FFD43B')"
                  >
                    Electric Yellow
                  </button>
                  <button
                    type="button"
                    class="preset-chip"
                    (click)="applyPreset('#FFD43B', '#0D0E0E')"
                  >
                    {{ i18n.currentLang() === 'es' ? 'Invertido' : 'Inverted' }}
                  </button>
                </div>

                <!-- Size Slider -->
                <div class="slider-group">
                  <div class="slider-header">
                    <label for="qrSizeSlider" class="slider-label">
                      {{ i18n.currentLang() === 'es' ? 'Resolución / Tamaño' : 'Resolution / Size' }}
                    </label>
                    <span class="slider-val mono">{{ options.width }} &times; {{ options.width }}px</span>
                  </div>
                  <input
                    id="qrSizeSlider"
                    type="range"
                    min="180"
                    max="600"
                    step="20"
                    [(ngModel)]="options.width"
                    (ngModelChange)="renderQr()"
                  />
                </div>

                <!-- Error Correction Level -->
                <div class="correction-group">
                  <span class="correction-label">
                    {{ i18n.currentLang() === 'es' ? 'Nivel de corrección de error' : 'Error Correction Level' }}
                  </span>
                  <div class="correction-options">
                    @for (lvl of ['L', 'M', 'Q', 'H']; track lvl) {
                      <button
                        type="button"
                        class="level-btn"
                        [class.active]="options.errorCorrectionLevel === lvl"
                        (click)="setLevel(lvl)"
                      >
                        {{ lvl }} ({{ getLevelDescription(lvl) }})
                      </button>
                    }
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Live Preview & Download Actions -->
            <div class="preview-column">
              <div class="qr-preview-card">
                <div class="preview-header">
                  <span class="preview-title">{{ i18n.currentLang() === 'es' ? 'Vista previa en vivo' : 'Live Preview' }}</span>
                  @if (qrDataUrl()) {
                    <span class="status-badge">{{ i18n.currentLang() === 'es' ? 'Listo' : 'Ready' }}</span>
                  }
                </div>

                <div class="qr-frame" [style.background-color]="options.lightColor">
                  @if (qrDataUrl()) {
                    <img [src]="qrDataUrl()" alt="Generated QR code preview" class="qr-image" />
                  } @else {
                    <div class="qr-placeholder">
                      <bt-icon name="qr-code" [size]="48" />
                      <span>{{ i18n.currentLang() === 'es' ? 'Ingresa texto para generar tu código QR' : 'Enter data to render QR code' }}</span>
                    </div>
                  }
                </div>

                <div class="export-actions">
                  <button
                    type="button"
                    class="btn btn-primary btn-lg full-width"
                    (click)="onDownloadPng()"
                    [disabled]="!qrDataUrl()"
                  >
                    <bt-icon name="download" [size]="18" />
                    <span>{{ i18n.currentLang() === 'es' ? 'Descargar PNG' : 'Download PNG' }}</span>
                  </button>

                  <button
                    type="button"
                    class="btn btn-secondary full-width"
                    (click)="onDownloadSvg()"
                    [disabled]="!qrDataUrl()"
                  >
                    <bt-icon name="code" [size]="16" />
                    <span>{{ i18n.currentLang() === 'es' ? 'Exportar Vector SVG' : 'Export Vector SVG' }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
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

      .qr-layout {
        display: grid;
        grid-template-columns: 1fr;
        gap: $spacing-6;

        @include desktop {
          grid-template-columns: 1.2fr 0.8fr;
        }
      }

      .controls-column {
        display: flex;
        flex-direction: column;
        gap: $spacing-4;
      }

      .type-tabs {
        display: flex;
        gap: $spacing-2;
      }

      .tab-btn {
        display: inline-flex;
        align-items: center;
        gap: $spacing-2;
        padding: $spacing-2 $spacing-4;
        border-radius: $radius-full;
        background-color: $bg-surface;
        border: 1px solid $border-color;
        color: $text-secondary;
        font-size: $font-sm;
        font-weight: 500;
        cursor: pointer;
        transition: all $transition-fast;
        min-height: 40px;

        &:hover {
          color: $text-primary;
          border-color: $border-light;
        }

        &.active {
          background-color: $accent-yellow;
          border-color: $accent-yellow;
          color: #0D0E0E;
          font-weight: 700;
        }

        @include focus-ring;
      }

      .input-card {
        @include card-surface;
        padding: $spacing-5;
        display: flex;
        flex-direction: column;
        gap: $spacing-4;
      }

      .input-group {
        display: flex;
        flex-direction: column;
        gap: $spacing-2;

        input {
          width: 100%;
        }
      }

      .input-label {
        font-size: $font-sm;
        font-weight: 500;
        color: $text-primary;
      }

      .qr-textarea {
        width: 100%;
        resize: vertical;
        font-family: $font-sans;
      }

      .wifi-form {
        display: grid;
        grid-template-columns: 1fr;
        gap: $spacing-3;

        @include tablet-up {
          grid-template-columns: 1fr 1fr;
        }
      }

      .input-actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: $spacing-2;
        padding-top: $spacing-2;
        border-top: 1px solid $border-color;
      }

      .custom-card {
        @include card-surface;
        padding: $spacing-5;
        display: flex;
        flex-direction: column;
        gap: $spacing-5;
      }

      .custom-title {
        font-size: $font-base;
        font-weight: 600;
        color: $text-primary;
      }

      .color-pickers-row {
        display: grid;
        grid-template-columns: 1fr;
        gap: $spacing-4;

        @include tablet-up {
          grid-template-columns: 1fr 1fr;
        }
      }

      .color-picker-item {
        display: flex;
        flex-direction: column;
        gap: $spacing-2;
      }

      .color-label {
        font-size: $font-xs;
        color: $text-secondary;
      }

      .color-input-wrap {
        display: flex;
        align-items: center;
        gap: $spacing-2;
      }

      .color-swatch {
        width: 40px;
        height: 38px;
        padding: 0;
        border: 1px solid $border-color;
        border-radius: $radius-md;
        cursor: pointer;
        background: none;
      }

      .color-hex {
        flex: 1;
        font-size: $font-xs;
      }

      .palette-presets {
        display: flex;
        align-items: center;
        gap: $spacing-2;
        flex-wrap: wrap;
      }

      .preset-label {
        font-size: $font-xs;
        color: $text-muted;
      }

      .preset-chip {
        font-size: $font-xs;
        padding: 2px $spacing-2;
        border-radius: $radius-full;
        background-color: $bg-secondary;
        border: 1px solid $border-color;
        color: $text-secondary;
        cursor: pointer;

        &:hover {
          color: $text-primary;
          border-color: $border-light;
        }

        @include focus-ring;
      }

      .slider-group {
        display: flex;
        flex-direction: column;
        gap: $spacing-2;
      }

      .slider-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .slider-label {
        font-size: $font-xs;
        color: $text-secondary;
      }

      .slider-val {
        font-size: $font-xs;
        color: $accent-yellow;
      }

      .correction-group {
        display: flex;
        flex-direction: column;
        gap: $spacing-2;
      }

      .correction-label {
        font-size: $font-xs;
        color: $text-secondary;
      }

      .correction-options {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: $spacing-2;

        @include tablet-up {
          grid-template-columns: repeat(4, 1fr);
        }
      }

      .level-btn {
        padding: $spacing-2;
        border-radius: $radius-md;
        background-color: $bg-secondary;
        border: 1px solid $border-color;
        color: $text-secondary;
        font-size: $font-xs;
        cursor: pointer;
        transition: all $transition-fast;

        &:hover {
          color: $text-primary;
          border-color: $border-light;
        }

        &.active {
          background-color: $accent-yellow-subtle;
          border-color: $accent-yellow;
          color: $accent-yellow;
          font-weight: 600;
        }

        @include focus-ring;
      }

      .preview-column {
        display: flex;
        flex-direction: column;
      }

      .qr-preview-card {
        @include card-surface;
        padding: $spacing-6;
        display: flex;
        flex-direction: column;
        gap: $spacing-5;
        border-color: rgba(255, 212, 59, 0.3);
      }

      .preview-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .preview-title {
        font-size: $font-base;
        font-weight: 600;
        color: $text-primary;
      }

      .status-badge {
        font-size: $font-xs;
        color: $color-success;
        background-color: $color-success-bg;
        padding: 2px $spacing-2;
        border-radius: $radius-full;
        font-weight: 600;
      }

      .qr-frame {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: $spacing-6;
        border-radius: $radius-lg;
        min-height: 280px;
        transition: background-color $transition-fast;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
      }

      .qr-image {
        max-width: 100%;
        height: auto;
        border-radius: $radius-xs;
      }

      .qr-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: $spacing-3;
        color: #666666;
        font-size: $font-sm;
      }

      .export-actions {
        display: flex;
        flex-direction: column;
        gap: $spacing-3;
      }

      .full-width {
        width: 100%;
      }

      .text-error {
        color: $color-error;
        &:hover:not(:disabled) {
          color: $color-error;
          background-color: $color-error-bg;
        }
      }
    `,
  ],
})
export class QrGeneratorComponent implements OnInit {
  private readonly toolRegistry = inject(ToolRegistryService);
  private readonly qrService = inject(QrGeneratorService);
  private readonly seoService = inject(SeoService);
  private readonly notificationService = inject(NotificationService);
  protected readonly i18n = inject(TranslationService);

  protected readonly tool = signal<ToolDefinition | undefined>(undefined);
  protected readonly relatedTools = signal<ToolDefinition[]>([]);

  protected activeTab: 'url' | 'wifi' = 'url';
  protected qrData = 'https://bandit.tools';
  protected wifiSsid = 'OfficeNetwork';
  protected wifiPassword = 'SuperSecretPassword';

  protected readonly qrDataUrl = signal<string | null>(null);
  protected readonly dataCopied = signal(false);

  protected options: QrOptions = {
    width: 320,
    margin: 2,
    darkColor: '#0B0B0C',
    lightColor: '#FFFFFF',
    errorCorrectionLevel: 'M',
  };

  ngOnInit(): void {
    const t = this.toolRegistry.getToolById('qr-generator');
    this.tool.set(t);

    if (t) {
      this.seoService.updateSeo({
        title: t.name,
        description: t.description,
        keywords: t.keywords,
      });
      this.relatedTools.set(this.toolRegistry.getRelatedTools(t.id));
    }

    this.renderQr();
  }

  setTab(tab: 'url' | 'wifi'): void {
    this.activeTab = tab;
    this.renderQr();
  }

  onDataChange(): void {
    this.renderQr();
  }

  onWifiChange(): void {
    this.renderQr();
  }

  setLevel(lvl: string): void {
    this.options.errorCorrectionLevel = lvl as QrErrorCorrectionLevel;
    this.renderQr();
  }

  getLevelDescription(lvl: string): string {
    switch (lvl) {
      case 'L':
        return '7%';
      case 'M':
        return '15%';
      case 'Q':
        return '25%';
      case 'H':
        return '30%';
      default:
        return '';
    }
  }

  applyPreset(dark: string, light: string): void {
    this.options.darkColor = dark;
    this.options.lightColor = light;
    this.renderQr();
  }

  getRawData(): string {
    if (this.activeTab === 'wifi') {
      return this.qrService.formatWifiString(this.wifiSsid, this.wifiPassword);
    }
    return this.qrData;
  }

  async renderQr(): Promise<void> {
    const text = this.getRawData().trim();
    if (!text) {
      this.qrDataUrl.set(null);
      return;
    }

    try {
      const dataUrl = await this.qrService.generateDataUrl(text, this.options);
      this.qrDataUrl.set(dataUrl);
    } catch (err: any) {
      this.qrDataUrl.set(null);
    }
  }

  onDownloadPng(): void {
    const url = this.qrDataUrl();
    if (!url) return;

    const link = document.createElement('a');
    link.href = url;
    link.download = 'qrcode.png';
    link.click();
    const isEs = this.i18n.currentLang() === 'es';
    this.notificationService.success(isEs ? 'Código QR descargado (PNG)' : 'Downloaded qrcode.png');
  }

  async onDownloadSvg(): Promise<void> {
    const text = this.getRawData().trim();
    if (!text) return;

    try {
      const svg = await this.qrService.generateSvg(text, this.options);
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'qrcode.svg';
      link.click();
      URL.revokeObjectURL(url);
      const isEs = this.i18n.currentLang() === 'es';
      this.notificationService.success(isEs ? 'Vector SVG descargado' : 'Downloaded qrcode.svg');
    } catch (err: any) {
      const isEs = this.i18n.currentLang() === 'es';
      this.notificationService.error(
        isEs ? `Error exportando SVG: ${err.message}` : `SVG export failed: ${err.message}`
      );
    }
  }

  async onCopyData(): Promise<void> {
    const text = this.getRawData().trim();
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      this.dataCopied.set(true);
      const isEs = this.i18n.currentLang() === 'es';
      this.notificationService.success(
        isEs ? '¡Datos copiados al portapapeles!' : 'Data copied to clipboard!'
      );
      setTimeout(() => this.dataCopied.set(false), 2000);
    } catch {
      const isEs = this.i18n.currentLang() === 'es';
      this.notificationService.error(
        isEs ? 'No se pudo copiar al portapapeles' : 'Failed to copy to clipboard'
      );
    }
  }

  onClear(): void {
    if (this.activeTab === 'wifi') {
      this.wifiSsid = '';
      this.wifiPassword = '';
    } else {
      this.qrData = '';
    }
    this.qrDataUrl.set(null);
  }
}
