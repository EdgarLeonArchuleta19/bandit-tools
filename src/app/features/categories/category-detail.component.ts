import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToolRegistryService } from '../../core/services/tool-registry.service';
import { SeoService } from '../../core/services/seo.service';
import { TranslationService } from '../../core/services/translation.service';
import { ToolCategory, ToolCategoryId, ToolDefinition } from '../../core/models/tool.model';
import { ToolCardComponent } from '../../shared/components/tool-card/tool-card.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'bt-category-detail',
  standalone: true,
  imports: [RouterLink, ToolCardComponent, IconComponent],
  template: `
    <div class="category-detail-page">
      <div class="category-detail-inner">
        @if (category(); as cat) {
          <!-- Breadcrumb Navigation -->
          <nav class="breadcrumb" aria-label="Breadcrumb">
            <a routerLink="/" class="breadcrumb-item">{{ i18n.currentLang() === 'es' ? 'Inicio' : 'Home' }}</a>
            <bt-icon name="chevron-right" [size]="14" class="breadcrumb-sep" />
            <a routerLink="/categories" class="breadcrumb-item">{{ i18n.t('nav.categories') }}</a>
            <bt-icon name="chevron-right" [size]="14" class="breadcrumb-sep" />
            <span class="breadcrumb-current" aria-current="page">{{ cat.name }}</span>
          </nav>

          <!-- Category Banner -->
          <header class="category-banner">
            <div class="banner-icon-box">
              <bt-icon [name]="cat.icon" [size]="32" />
            </div>
            <div class="banner-text">
              <h1 class="banner-title">{{ cat.name }}</h1>
              <p class="banner-desc">{{ cat.description }}</p>
            </div>
          </header>

          <!-- Tools in this Category -->
          <section class="tools-section">
            <div class="section-meta">
              <span class="count-text">
                {{ tools().length }} {{ i18n.currentLang() === 'es' ? 'utilidades disponibles' : 'tools available' }}
              </span>
              <a routerLink="/tools" [queryParams]="{ category: cat.id }" class="view-all-link">
                <span>{{ i18n.currentLang() === 'es' ? 'Filtrar directorio' : 'Filter directory' }}</span>
                <bt-icon name="arrow-right" [size]="14" />
              </a>
            </div>

            <div class="tools-grid">
              @for (tool of tools(); track tool.id) {
                <bt-tool-card [tool]="tool" />
              }
            </div>
          </section>
        } @else {
          <div class="not-found-card">
            <h2>{{ i18n.currentLang() === 'es' ? 'Categoría no encontrada' : 'Category not found' }}</h2>
            <p>{{ i18n.currentLang() === 'es' ? 'La categoría solicitada no existe.' : 'The requested category does not exist.' }}</p>
            <a routerLink="/categories" class="btn btn-primary">
              {{ i18n.currentLang() === 'es' ? 'Explorar Categorías' : 'Browse All Categories' }}
            </a>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      @use 'styles/variables' as *;
      @use 'styles/mixins' as *;

      .category-detail-page {
        padding-top: $spacing-8;
        padding-bottom: $spacing-20;
      }

      .category-detail-inner {
        @include container;
      }

      .breadcrumb {
        display: flex;
        align-items: center;
        gap: $spacing-2;
        font-size: $font-xs;
        color: $text-muted;
        margin-bottom: $spacing-6;

        &-item {
          color: $text-secondary;
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
        }
      }

      .category-banner {
        display: flex;
        align-items: flex-start;
        gap: $spacing-5;
        padding: $spacing-8;
        background-color: $bg-surface;
        border: 1px solid $border-color;
        border-radius: $radius-lg;
        margin-bottom: $spacing-8;

        @include mobile {
          flex-direction: column;
          padding: $spacing-6;
        }
      }

      .banner-icon-box {
        width: 64px;
        height: 64px;
        border-radius: $radius-lg;
        background-color: var(--accent-yellow-subtle);
        color: $accent-yellow;
        border: 1px solid var(--accent-yellow-subtle);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .banner-text {
        display: flex;
        flex-direction: column;
        gap: $spacing-2;
      }

      .banner-title {
        font-size: $font-3xl;
        font-weight: 800;
        letter-spacing: -0.02em;
        color: $text-primary;
      }

      .banner-desc {
        font-size: $font-base;
        color: $text-secondary;
        line-height: 1.6;
        max-width: 680px;
      }

      .section-meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: $spacing-6;
        padding-bottom: $spacing-3;
        border-bottom: 1px solid $border-color;
      }

      .count-text {
        font-size: $font-xs;
        color: $text-muted;
      }

      .view-all-link {
        display: inline-flex;
        align-items: center;
        gap: $spacing-1;
        font-size: $font-xs;
        color: $accent-yellow;
        &:hover {
          color: $accent-yellow-hover;
        }
        @include focus-ring;
      }

      .tools-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: $spacing-6;

        @include tablet {
          grid-template-columns: repeat(2, 1fr);
        }

        @include desktop {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      .not-found-card {
        @include card-surface;
        padding: $spacing-12;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: $spacing-4;
      }
    `,
  ],
})
export class CategoryDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly toolRegistry = inject(ToolRegistryService);
  private readonly seoService = inject(SeoService);
  protected readonly i18n = inject(TranslationService);

  protected readonly category = signal<ToolCategory | undefined>(undefined);
  protected readonly tools = signal<ToolDefinition[]>([]);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        const cat = this.toolRegistry.getCategoryById(id);
        this.category.set(cat);

        if (cat) {
          const list = this.toolRegistry.getToolsByCategory(cat.id as ToolCategoryId);
          this.tools.set(list);

          this.seoService.updateSeo({
            title: `${cat.name}`,
            description: cat.description,
          });
        }
      }
    });
  }
}
