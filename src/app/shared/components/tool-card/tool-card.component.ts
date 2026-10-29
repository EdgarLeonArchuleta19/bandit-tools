import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToolDefinition } from '../../../core/models/tool.model';
import { TranslationService } from '../../../core/services/translation.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'bt-tool-card',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <a [routerLink]="tool().route" class="tool-card" [attr.aria-label]="tool().name">
      <div class="card-top">
        <div class="icon-wrap">
          <bt-icon [name]="tool().icon" [size]="20" />
        </div>
      </div>

      <div class="card-content">
        <h3 class="tool-title">{{ tool().name }}</h3>
        <p class="tool-desc">{{ tool().tagline }}</p>
      </div>

      <div class="card-bottom">
        <span class="category-name">{{ formatCategory(tool().category) }}</span>
        <bt-icon name="arrow-right" [size]="14" class="arrow-icon" />
      </div>
    </a>
  `,
  styles: [
    `
      @use 'styles/variables' as *;
      @use 'styles/mixins' as *;

      .tool-card {
        @include card-surface;
        display: flex;
        flex-direction: column;
        padding: $spacing-5;
        height: 100%;
        text-decoration: none;
        color: inherit;
        position: relative;
        border-radius: $radius-lg;
        transition: transform $transition-fast, border-color $transition-fast, background-color $transition-fast;

        @include focus-ring;

        &:hover {
          border-color: $accent-yellow;
          transform: translateY(-2px);

          .icon-wrap {
            color: #0D0E0E;
            background-color: $accent-yellow;
          }

          .arrow-icon {
            transform: translateX(4px);
            color: $accent-yellow;
          }
        }
      }

      .card-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: $spacing-4;
      }

      .icon-wrap {
        width: 40px;
        height: 40px;
        border-radius: $radius-md;
        background-color: $bg-secondary;
        border: 1px solid $border-color;
        color: $accent-yellow;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all $transition-fast;
      }

      .card-content {
        flex: 1;
        margin-bottom: $spacing-4;
      }

      .tool-title {
        font-size: $font-base;
        font-weight: 700;
        color: $text-primary;
        margin-bottom: 6px;
        line-height: 1.3;
      }

      .tool-desc {
        font-size: $font-xs;
        color: $text-secondary;
        line-height: 1.5;
      }

      .card-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: $spacing-3;
        border-top: 1px solid $border-color;
        font-size: $font-xs;
        color: $text-muted;
      }

      .category-name {
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: 600;
        font-size: 11px;
      }

      .arrow-icon {
        color: $text-muted;
        transition: transform $transition-fast, color $transition-fast;
      }
    `,
  ],
})
export class ToolCardComponent {
  protected readonly i18n = inject(TranslationService);
  readonly tool = input.required<ToolDefinition>();

  formatCategory(category: string): string {
    const isEs = this.i18n.currentLang() === 'es';
    switch (category) {
      case 'developer-tools':
        return isEs ? 'Desarrollo' : 'Developer';
      case 'images':
        return isEs ? 'Imágenes' : 'Images';
      case 'media':
        return isEs ? 'Video y Audio' : 'Video & Audio';
      case 'generators':
        return isEs ? 'Generadores' : 'Generators';
      case 'text':
        return isEs ? 'Texto' : 'Text';
      default:
        return category;
    }
  }
}
