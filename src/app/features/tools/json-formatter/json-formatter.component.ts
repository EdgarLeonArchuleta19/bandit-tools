import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolRegistryService } from '../../../core/services/tool-registry.service';
import { SeoService } from '../../../core/services/seo.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TranslationService } from '../../../core/services/translation.service';
import { JsonFormatterService, JsonStats } from './json-formatter.service';
import { ToolDefinition } from '../../../core/models/tool.model';
import { ToolHeaderComponent } from '../../../shared/components/tool-header/tool-header.component';
import { RelatedToolsComponent } from '../../../shared/components/related-tools/related-tools.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ByteSizePipe } from '../../../shared/pipes/byte-size.pipe';

@Component({
  selector: 'bt-json-formatter',
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
      @if (tool(); as currentTool) {
        <bt-tool-header [tool]="currentTool" />

        <div class="workspace">
          <!-- Action Toolbar -->
          <div class="toolbar">
            <div class="toolbar-group">
              <button
                type="button"
                class="btn btn-primary"
                (click)="onFormat()"
                [disabled]="!inputJson().trim()"
              >
                <bt-icon name="code" [size]="16" />
                <span>{{ i18n.currentLang() === 'es' ? 'Formatear JSON' : 'Format JSON' }}</span>
              </button>

              <button
                type="button"
                class="btn btn-secondary"
                (click)="onMinify()"
                [disabled]="!inputJson().trim()"
              >
                <bt-icon name="compress" [size]="16" />
                <span>{{ i18n.currentLang() === 'es' ? 'Minificar' : 'Minify' }}</span>
              </button>

              <div class="indent-select-wrap">
                <label for="indentType" class="visually-hidden">{{ i18n.currentLang() === 'es' ? 'Sangría' : 'Indentation' }}</label>
                <select id="indentType" [(ngModel)]="selectedIndent" (change)="onIndentChange()">
                  <option value="2">{{ i18n.currentLang() === 'es' ? '2 Espacios' : '2 Spaces' }}</option>
                  <option value="4">{{ i18n.currentLang() === 'es' ? '4 Espacios' : '4 Spaces' }}</option>
                  <option value="tab">{{ i18n.currentLang() === 'es' ? 'Tabulaciones' : 'Tabs' }}</option>
                </select>
              </div>
            </div>

            <div class="toolbar-group">
              <button type="button" class="btn btn-ghost btn-sm" (click)="onLoadSample()">
                <bt-icon name="sparkles" [size]="16" />
                <span>{{ i18n.currentLang() === 'es' ? 'Ejemplo' : 'Sample' }}</span>
              </button>
              <button
                type="button"
                class="btn btn-ghost btn-sm text-error"
                (click)="onClear()"
                [disabled]="!inputJson() && !outputJson()"
              >
                <bt-icon name="trash" [size]="16" />
                <span>{{ i18n.currentLang() === 'es' ? 'Limpiar' : 'Clear' }}</span>
              </button>
            </div>
          </div>

          <!-- Error Alert if invalid -->
          @if (errorMessage()) {
            <div class="alert alert-error" role="alert">
              <bt-icon name="alert-circle" [size]="18" />
              <div class="alert-content">
                <strong>{{ i18n.currentLang() === 'es' ? 'Error de sintaxis:' : 'Syntax Error:' }}</strong>
                <span>{{ errorMessage() }}</span>
                @if (errorLine()) {
                  <span class="error-pos">{{ i18n.currentLang() === 'es' ? 'Línea:' : 'Line:' }} {{ errorLine() }}, {{ i18n.currentLang() === 'es' ? 'Columna:' : 'Column:' }} {{ errorColumn() }}</span>
                }
              </div>
            </div>
          }

          <!-- Editor Columns Grid -->
          <div class="editor-grid">
            <!-- Left: Input Area -->
            <div class="editor-pane">
              <div class="pane-header">
                <span class="pane-title">{{ i18n.currentLang() === 'es' ? 'JSON de Entrada' : 'Input JSON' }}</span>
                <span class="pane-meta">{{ inputBytes() | byteSize }}</span>
              </div>
              <textarea
                class="code-editor"
                [(ngModel)]="inputJson"
                [placeholder]="i18n.currentLang() === 'es' ? 'Pega tu JSON sin formato o comprimido aquí...' : 'Paste your raw, messy, or unformatted JSON here...'"
                aria-label="Input JSON data"
                spellcheck="false"
              ></textarea>
            </div>

            <!-- Right: Output Area -->
            <div class="editor-pane">
              <div class="pane-header">
                <div class="output-title-group">
                  <span class="pane-title">{{ i18n.currentLang() === 'es' ? 'Resultado Formateado' : 'Formatted Result' }}</span>
                  @if (stats(); as s) {
                    <span class="pane-meta">
                      {{ s.sizeBytes | byteSize }} &bull; {{ s.linesCount }} {{ i18n.currentLang() === 'es' ? 'líneas' : 'lines' }} &bull; {{ s.keysCount }} {{ i18n.currentLang() === 'es' ? 'claves' : 'keys' }}
                    </span>
                  }
                </div>
                <div class="output-actions">
                  <button
                    type="button"
                    class="btn btn-secondary btn-sm"
                    (click)="onCopy()"
                    [disabled]="!outputJson()"
                    aria-label="Copy formatted JSON to clipboard"
                  >
                    <bt-icon [name]="copied() ? 'check' : 'copy'" [size]="14" />
                    <span>{{ copied() ? (i18n.currentLang() === 'es' ? '¡Copiado!' : 'Copied!') : (i18n.currentLang() === 'es' ? 'Copiar' : 'Copy') }}</span>
                  </button>
                  <button
                    type="button"
                    class="btn btn-secondary btn-sm"
                    (click)="onDownload()"
                    [disabled]="!outputJson()"
                    aria-label="Download JSON file"
                  >
                    <bt-icon name="download" [size]="14" />
                    <span>{{ i18n.currentLang() === 'es' ? 'Descargar' : 'Download' }}</span>
                  </button>
                </div>
              </div>
              <textarea
                class="code-editor output-editor"
                [value]="outputJson()"
                readonly
                [placeholder]="i18n.currentLang() === 'es' ? 'El JSON formateado aparecerá aquí...' : 'Formatted output will appear here...'"
                aria-label="Formatted JSON output"
                spellcheck="false"
              ></textarea>
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
        gap: $spacing-4;
      }

      .toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: $spacing-3;
        padding: $spacing-3 $spacing-4;
        background-color: $bg-surface;
        border: 1px solid $border-color;
        border-radius: $radius-lg;
      }

      .toolbar-group {
        display: flex;
        align-items: center;
        gap: $spacing-2;
        flex-wrap: wrap;
      }

      .indent-select-wrap select {
        padding: $spacing-2 $spacing-3;
        font-size: $font-xs;
        border-radius: $radius-md;
      }

      .alert {
        display: flex;
        align-items: flex-start;
        gap: $spacing-3;
        padding: $spacing-3 $spacing-4;
        border-radius: $radius-md;
        font-size: $font-sm;

        &-error {
          background-color: $color-error-bg;
          border: 1px solid rgba(248, 113, 113, 0.4);
          color: $color-error;
        }

        .alert-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .error-pos {
          font-family: $font-mono;
          font-size: $font-xs;
          opacity: 0.85;
        }
      }

      .editor-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: $spacing-4;

        @include desktop {
          grid-template-columns: 1fr 1fr;
        }
      }

      .editor-pane {
        display: flex;
        flex-direction: column;
        background-color: $bg-surface;
        border: 1px solid $border-color;
        border-radius: $radius-lg;
        overflow: hidden;
      }

      .pane-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: $spacing-3 $spacing-4;
        background-color: $bg-secondary;
        border-bottom: 1px solid $border-color;
        min-height: 48px;
        gap: $spacing-2;
      }

      .pane-title {
        font-size: $font-sm;
        font-weight: 600;
        color: $text-primary;
      }

      .pane-meta {
        font-size: $font-xs;
        color: $text-muted;
        font-family: $font-mono;
      }

      .output-title-group {
        display: flex;
        align-items: center;
        gap: $spacing-3;
        flex-wrap: wrap;
      }

      .output-actions {
        display: flex;
        align-items: center;
        gap: $spacing-2;
      }

      .code-editor {
        width: 100%;
        min-height: 380px;
        padding: $spacing-4;
        background-color: $bg-main;
        border: none;
        border-radius: 0;
        color: $text-primary;
        font-family: $font-mono;
        font-size: $font-xs;
        line-height: 1.6;
        resize: vertical;
        white-space: pre;
        tab-size: 2;

        &:focus {
          outline: none;
        }

        &::placeholder {
          color: $text-muted;
        }

        @include custom-scrollbar;
      }

      .output-editor {
        background-color: #0E0E10;
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
export class JsonFormatterComponent implements OnInit {
  private readonly toolRegistry = inject(ToolRegistryService);
  private readonly jsonService = inject(JsonFormatterService);
  private readonly seoService = inject(SeoService);
  private readonly notificationService = inject(NotificationService);
  protected readonly i18n = inject(TranslationService);

  protected readonly tool = signal<ToolDefinition | undefined>(undefined);
  protected readonly relatedTools = signal<ToolDefinition[]>([]);

  protected readonly inputJson = signal<string>('');
  protected readonly outputJson = signal<string>('');
  protected readonly selectedIndent = '2';
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly errorLine = signal<number | null>(null);
  protected readonly errorColumn = signal<number | null>(null);
  protected readonly stats = signal<JsonStats | null>(null);
  protected readonly copied = signal(false);

  protected get inputBytes(): () => number {
    return () => new Blob([this.inputJson()]).size;
  }

  ngOnInit(): void {
    const t = this.toolRegistry.getToolById('json-formatter');
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

  onFormat(): void {
    const raw = this.inputJson().trim();
    if (!raw) return;

    try {
      const result = this.jsonService.format(
        raw,
        this.selectedIndent as '2' | '4' | 'tab'
      );
      this.outputJson.set(result.formatted);
      this.stats.set(result.stats);
      this.errorMessage.set(null);
      this.errorLine.set(null);
      this.errorColumn.set(null);
      const isEs = this.i18n.currentLang() === 'es';
      this.notificationService.success(isEs ? '¡JSON formateado con éxito!' : 'JSON formatted successfully!');
    } catch (err: any) {
      const val = this.jsonService.validate(raw);
      this.errorMessage.set(val.error?.message || err.message);
      this.errorLine.set(val.error?.line || null);
      this.errorColumn.set(val.error?.column || null);
      const isEs = this.i18n.currentLang() === 'es';
      this.notificationService.error(isEs ? 'Sintaxis JSON no válida' : 'Invalid JSON syntax');
    }
  }

  onMinify(): void {
    const raw = this.inputJson().trim();
    if (!raw) return;

    try {
      const result = this.jsonService.minify(raw);
      this.outputJson.set(result.minified);
      this.stats.set(result.stats);
      this.errorMessage.set(null);
      this.errorLine.set(null);
      this.errorColumn.set(null);
      const isEs = this.i18n.currentLang() === 'es';
      this.notificationService.success(isEs ? '¡JSON minificado!' : 'JSON minified!');
    } catch (err: any) {
      const val = this.jsonService.validate(raw);
      this.errorMessage.set(val.error?.message || err.message);
      this.errorLine.set(val.error?.line || null);
      this.errorColumn.set(val.error?.column || null);
      const isEs = this.i18n.currentLang() === 'es';
      this.notificationService.error(isEs ? 'Sintaxis JSON no válida' : 'Invalid JSON syntax');
    }
  }

  onIndentChange(): void {
    if (this.outputJson() && !this.errorMessage()) {
      this.onFormat();
    }
  }

  onLoadSample(): void {
    const sample = this.jsonService.getSampleJson();
    this.inputJson.set(sample);
    this.onFormat();
  }

  onClear(): void {
    this.inputJson.set('');
    this.outputJson.set('');
    this.errorMessage.set(null);
    this.errorLine.set(null);
    this.errorColumn.set(null);
    this.stats.set(null);
  }

  async onCopy(): Promise<void> {
    const content = this.outputJson();
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      this.copied.set(true);
      const isEs = this.i18n.currentLang() === 'es';
      this.notificationService.success(isEs ? '¡Copiado al portapapeles!' : 'Copied to clipboard!');
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      const isEs = this.i18n.currentLang() === 'es';
      this.notificationService.error(
        isEs ? 'No se pudo copiar al portapapeles' : 'Failed to copy to clipboard'
      );
    }
  }

  onDownload(): void {
    const content = this.outputJson();
    if (!content) return;

    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'formatted.json';
    link.click();
    URL.revokeObjectURL(url);
    const isEs = this.i18n.currentLang() === 'es';
    this.notificationService.success(isEs ? 'Archivo formatted.json descargado' : 'Downloaded formatted.json');
  }
}
