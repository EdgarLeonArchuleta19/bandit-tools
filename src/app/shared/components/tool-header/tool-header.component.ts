import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToolDefinition } from '../../../core/models/tool.model';
import { TranslationService } from '../../../core/services/translation.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'bt-tool-header',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <header class="tool-header">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a routerLink="/" class="breadcrumb-item">{{ i18n.currentLang() === 'es' ? 'Inicio' : 'Home' }}</a>
        <bt-icon name="chevron-right" [size]="14" class="breadcrumb-sep" />
        <a routerLink="/tools" class="breadcrumb-item">{{ i18n.t('nav.tools') }}</a>
        <bt-icon name="chevron-right" [size]="14" class="breadcrumb-sep" />
        <span class="breadcrumb-current" aria-current="page">{{ tool().name }}</span>
      </nav>

      <div class="header-main">
        <div class="tool-icon-wrapper">
          <bt-icon [name]="tool().icon" [size]="28" />
        </div>
        <div class="header-content">
          <div class="title-row">
            <h1 class="tool-title">{{ tool().name }}</h1>
            @if (tool().badge) {
              <span class="tool-badge">{{ tool().badge }}</span>
            }
          </div>
          <p class="tool-tagline">{{ tool().tagline }}</p>
          <p class="tool-description">{{ tool().description }}</p>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      @use 'styles/variables' as *;
      @use 'styles/mixins' as *;

      .tool-header {
        margin-bottom: $spacing-8;
      }

      .breadcrumb {
        display: flex;
        align-items: center;
        gap: $spacing-2;
        font-size: $font-xs;
        color: $text-muted;
        margin-bottom: $spacing-5;

        &-item {
          color: $text-secondary;
          transition: color $transition-fast;

          &:hover {
            color: $text-primary;
          }

          @include focus-ring;
        }

        &-sep {
          color: $border-light;
        }

        &-current {
          color: $text-muted;
          font-weight: 500;
        }
      }

      .header-main {
        display: flex;
        align-items: flex-start;
        gap: $spacing-4;

        @include mobile {
          flex-direction: column;
          gap: $spacing-3;
        }
      }

      .tool-icon-wrapper {
        width: 56px;
        height: 56px;
        border-radius: $radius-lg;
        background-color: $bg-surface;
        border: 1px solid $border-color;
        color: $accent-yellow;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .header-content {
        flex: 1;
      }

      .title-row {
        display: flex;
        align-items: center;
        gap: $spacing-3;
        margin-bottom: $spacing-2;
        flex-wrap: wrap;
      }

      .tool-title {
        font-size: $font-3xl;
        font-weight: 700;
        letter-spacing: -0.02em;
        color: $text-primary;

        @include mobile {
          font-size: $font-2xl;
        }
      }

      .tool-badge {
        font-size: $font-xs;
        font-weight: 600;
        padding: 2px $spacing-2;
        border-radius: $radius-full;
        background-color: var(--accent-yellow-subtle);
        color: $accent-yellow;
        border: 1px solid var(--accent-yellow-subtle);
      }

      .tool-tagline {
        font-size: $font-lg;
        color: $text-secondary;
        margin-bottom: $spacing-2;
        font-weight: 400;
      }

      .tool-description {
        font-size: $font-sm;
        color: $text-muted;
        max-width: 720px;
        line-height: 1.6;
      }
    `,
  ],
})
export class ToolHeaderComponent {
  protected readonly i18n = inject(TranslationService);
  readonly tool = input.required<ToolDefinition>();
}
