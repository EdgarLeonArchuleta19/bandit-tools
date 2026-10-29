import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToolRegistryService } from '../../core/services/tool-registry.service';
import { SeoService } from '../../core/services/seo.service';
import { TranslationService } from '../../core/services/translation.service';
import { ToolCategory } from '../../core/models/tool.model';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'bt-categories',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <div class="categories-page">
      <div class="categories-inner">
        <header class="page-header">
          <h1 class="page-title">
            {{ i18n.currentLang() === 'es' ? 'Categorías de Herramientas' : 'Tool Categories' }}
          </h1>
          <p class="page-subtitle">
            {{ i18n.currentLang() === 'es' 
              ? 'Explora nuestras utilidades web organizadas según tu flujo de trabajo y disciplina.' 
              : 'Browse our browser-native online utilities grouped by workflow and discipline.' }}
          </p>
        </header>

        <div class="categories-grid">
          @for (cat of categories(); track cat.id) {
            <a [routerLink]="['/categories', cat.id]" class="category-card">
              <div class="card-icon-box">
                <bt-icon [name]="cat.icon" [size]="28" />
              </div>
              <div class="card-content">
                <h2 class="cat-name">{{ cat.name }}</h2>
                <p class="cat-desc">{{ cat.description }}</p>

                <div class="cat-tools-preview">
                  @for (tool of getToolsInCategory(cat.id); track tool.id) {
                    <span class="tool-tag">{{ tool.name }}</span>
                  }
                </div>

                <div class="card-footer">
                  <span class="count-pill">
                    {{ getToolsInCategory(cat.id).length }} {{ i18n.currentLang() === 'es' ? 'disponibles' : 'available' }}
                  </span>
                  <bt-icon name="arrow-right" [size]="16" class="arrow-icon" />
                </div>
              </div>
            </a>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @use 'styles/variables' as *;
      @use 'styles/mixins' as *;

      .categories-page {
        padding-top: $spacing-10;
        padding-bottom: $spacing-20;
      }

      .categories-inner {
        @include container;
      }

      .page-header {
        margin-bottom: $spacing-10;
      }

      .page-title {
        font-size: $font-3xl;
        font-weight: 800;
        letter-spacing: -0.02em;
        color: $text-primary;
        margin-bottom: $spacing-2;

        @include tablet-up {
          font-size: $font-4xl;
        }
      }

      .page-subtitle {
        font-size: $font-base;
        color: $text-secondary;
        max-width: 640px;
        line-height: 1.6;
      }

      .categories-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: $spacing-6;

        @include tablet-up {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      .category-card {
        @include card-surface;
        padding: $spacing-6;
        display: flex;
        gap: $spacing-5;
        text-decoration: none;
        color: inherit;

        @include mobile {
          flex-direction: column;
        }

        @include focus-ring;

        &:hover {
          border-color: $border-light;
          transform: translateY(-2px);

          .card-icon-box {
            background-color: var(--accent-yellow-subtle);
            color: $accent-yellow;
            border-color: $accent-yellow;
          }

          .arrow-icon {
            transform: translateX(4px);
            color: $accent-yellow;
          }
        }
      }

      .card-icon-box {
        width: 56px;
        height: 56px;
        border-radius: $radius-lg;
        background-color: $bg-secondary;
        border: 1px solid $border-color;
        color: $text-primary;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: all $transition-fast;
      }

      .card-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: $spacing-3;
      }

      .cat-name {
        font-size: $font-xl;
        font-weight: 700;
        color: $text-primary;
      }

      .cat-desc {
        font-size: $font-sm;
        color: $text-secondary;
        line-height: 1.5;
      }

      .cat-tools-preview {
        display: flex;
        flex-wrap: wrap;
        gap: $spacing-2;
        margin-top: $spacing-1;
      }

      .tool-tag {
        font-size: $font-xs;
        color: $text-muted;
        background-color: $bg-secondary;
        border: 1px solid $border-color;
        padding: 3px $spacing-3;
        border-radius: $radius-full;
      }

      .card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: $spacing-2;
        padding-top: $spacing-3;
        border-top: 1px solid $border-color;
      }

      .count-pill {
        font-size: $font-xs;
        color: $text-secondary;
        font-weight: 500;
      }

      .arrow-icon {
        transition: transform $transition-fast, color $transition-fast;
      }
    `,
  ],
})
export class CategoriesComponent implements OnInit {
  private readonly toolRegistry = inject(ToolRegistryService);
  private readonly seoService = inject(SeoService);
  protected readonly i18n = inject(TranslationService);

  protected readonly categories = this.toolRegistry.categories;

  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'Categorías de Herramientas',
      description: 'Explora utilidades agrupadas en Imágenes, Herramientas Dev, Generadores y Texto.',
    });
  }

  getToolsInCategory(categoryId: any) {
    return this.toolRegistry.getToolsByCategory(categoryId);
  }
}
