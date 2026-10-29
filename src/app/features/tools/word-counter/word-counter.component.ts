import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolRegistryService } from '../../../core/services/tool-registry.service';
import { SeoService } from '../../../core/services/seo.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TranslationService } from '../../../core/services/translation.service';
import { WordCounterService, TextMetrics } from './word-counter.service';
import { ToolDefinition } from '../../../core/models/tool.model';
import { ToolHeaderComponent } from '../../../shared/components/tool-header/tool-header.component';
import { RelatedToolsComponent } from '../../../shared/components/related-tools/related-tools.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'bt-word-counter',
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
          <!-- Live Metrics Grid -->
          <div class="metrics-grid">
            <div class="metric-card highlight">
              <span class="metric-value">{{ metrics().words }}</span>
              <span class="metric-label">{{ i18n.currentLang() === 'es' ? 'Palabras' : 'Words' }}</span>
            </div>

            <div class="metric-card">
              <span class="metric-value">{{ metrics().charactersWithSpaces }}</span>
              <span class="metric-label">{{ i18n.currentLang() === 'es' ? 'Caracteres' : 'Characters' }}</span>
            </div>

            <div class="metric-card">
              <span class="metric-value">{{ metrics().charactersWithoutSpaces }}</span>
              <span class="metric-label">{{ i18n.currentLang() === 'es' ? 'Sin espacios' : 'Chars (No Spaces)' }}</span>
            </div>

            <div class="metric-card">
              <span class="metric-value">{{ metrics().sentences }}</span>
              <span class="metric-label">{{ i18n.currentLang() === 'es' ? 'Oraciones' : 'Sentences' }}</span>
            </div>

            <div class="metric-card">
              <span class="metric-value">{{ metrics().paragraphs }}</span>
              <span class="metric-label">{{ i18n.currentLang() === 'es' ? 'Párrafos' : 'Paragraphs' }}</span>
            </div>

            <div class="metric-card">
              <span class="metric-value">{{ metrics().readingTimeMinutes }} min</span>
              <span class="metric-label">{{ i18n.currentLang() === 'es' ? 'Tiempo de lectura' : 'Reading Time' }}</span>
            </div>
          </div>

          <!-- Editor Box -->
          <div class="editor-container">
            <div class="editor-header">
              <div class="header-left">
                <span class="editor-title">{{ i18n.currentLang() === 'es' ? 'Contenido de Texto' : 'Text Content' }}</span>
                <span class="editor-reading-badge">
                  <bt-icon name="zap" [size]="14" />
                  <span>{{ i18n.currentLang() === 'es' ? 'Tiempo de voz ~' : 'Speaking ~' }}{{ metrics().speakingTimeMinutes }} min</span>
                </span>
              </div>

              <div class="header-actions">
                <button type="button" class="btn btn-ghost btn-sm" (click)="onLoadSample()">
                  <bt-icon name="sparkles" [size]="14" />
                  <span>{{ i18n.currentLang() === 'es' ? 'Cargar ejemplo' : 'Load Sample' }}</span>
                </button>
                <button
                  type="button"
                  class="btn btn-secondary btn-sm"
                  (click)="onCopy()"
                  [disabled]="!textInput().trim()"
                  aria-label="Copy text to clipboard"
                >
                  <bt-icon [name]="copied() ? 'check' : 'copy'" [size]="14" />
                  <span>{{ copied() ? (i18n.currentLang() === 'es' ? '¡Copiado!' : 'Copied!') : (i18n.currentLang() === 'es' ? 'Copiar' : 'Copy') }}</span>
                </button>
                <button
                  type="button"
                  class="btn btn-ghost btn-sm text-error"
                  (click)="onClear()"
                  [disabled]="!textInput()"
                  aria-label="Clear all text"
                >
                  <bt-icon name="trash" [size]="14" />
                  <span>{{ i18n.currentLang() === 'es' ? 'Limpiar' : 'Clear' }}</span>
                </button>
              </div>
            </div>

            <textarea
              class="text-input"
              [(ngModel)]="textInput"
              (ngModelChange)="onTextChange($event)"
              [placeholder]="i18n.currentLang() === 'es' ? 'Escribe o pega tu texto aquí para analizar palabras, caracteres, oraciones y tiempo estimado de lectura en tiempo real...' : 'Start typing or paste your text here to inspect word count, characters, sentences, and reading estimates in real time...'"
              aria-label="Text for word count analysis"
              rows="14"
            ></textarea>
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

      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: $spacing-3;

        @include tablet {
          grid-template-columns: repeat(3, 1fr);
        }

        @include desktop {
          grid-template-columns: repeat(6, 1fr);
        }
      }

      .metric-card {
        @include card-surface;
        padding: $spacing-4;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: $spacing-1;

        &.highlight {
          border-color: rgba(255, 212, 59, 0.4);
          background-color: $accent-yellow-subtle;

          .metric-value {
            color: $accent-yellow;
          }
        }
      }

      .metric-value {
        font-size: $font-2xl;
        font-weight: 700;
        color: $text-primary;
        font-family: $font-mono;
        line-height: 1.1;
      }

      .metric-label {
        font-size: $font-xs;
        color: $text-secondary;
        font-weight: 500;
      }

      .editor-container {
        @include card-surface;
        overflow: hidden;
      }

      .editor-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: $spacing-3 $spacing-4;
        background-color: $bg-secondary;
        border-bottom: 1px solid $border-color;
        flex-wrap: wrap;
        gap: $spacing-2;
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: $spacing-3;
      }

      .editor-title {
        font-size: $font-sm;
        font-weight: 600;
        color: $text-primary;
      }

      .editor-reading-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: $font-xs;
        color: $text-secondary;
        background-color: $bg-surface;
        padding: 2px $spacing-2;
        border-radius: $radius-full;
        border: 1px solid $border-color;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: $spacing-2;
      }

      .text-input {
        width: 100%;
        min-height: 380px;
        padding: $spacing-5;
        background-color: $bg-main;
        border: none;
        border-radius: 0;
        color: $text-primary;
        font-size: $font-base;
        line-height: 1.7;
        resize: vertical;

        &:focus {
          outline: none;
        }

        &::placeholder {
          color: $text-muted;
        }

        @include custom-scrollbar;
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
export class WordCounterComponent implements OnInit {
  private readonly toolRegistry = inject(ToolRegistryService);
  private readonly wordCounterService = inject(WordCounterService);
  private readonly seoService = inject(SeoService);
  private readonly notificationService = inject(NotificationService);
  protected readonly i18n = inject(TranslationService);

  protected readonly tool = signal<ToolDefinition | undefined>(undefined);
  protected readonly relatedTools = signal<ToolDefinition[]>([]);

  protected readonly textInput = signal<string>('');
  protected readonly metrics = signal<TextMetrics>(this.wordCounterService.analyze(''));
  protected readonly copied = signal(false);

  ngOnInit(): void {
    const t = this.toolRegistry.getToolById('word-counter');
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

  onTextChange(val: string): void {
    this.metrics.set(this.wordCounterService.analyze(val));
  }

  onLoadSample(): void {
    const sample = this.wordCounterService.getSampleText();
    this.textInput.set(sample);
    this.metrics.set(this.wordCounterService.analyze(sample));
    const isEs = this.i18n.currentLang() === 'es';
    this.notificationService.info(isEs ? 'Texto de ejemplo cargado' : 'Sample text loaded');
  }

  onClear(): void {
    this.textInput.set('');
    this.metrics.set(this.wordCounterService.analyze(''));
  }

  async onCopy(): Promise<void> {
    const text = this.textInput();
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      this.copied.set(true);
      const isEs = this.i18n.currentLang() === 'es';
      this.notificationService.success(isEs ? '¡Texto copiado al portapapeles!' : 'Copied text to clipboard!');
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      const isEs = this.i18n.currentLang() === 'es';
      this.notificationService.error(isEs ? 'No se pudo copiar al portapapeles' : 'Failed to copy to clipboard');
    }
  }
}
