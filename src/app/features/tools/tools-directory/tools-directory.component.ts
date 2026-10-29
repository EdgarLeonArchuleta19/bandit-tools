import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolRegistryService } from '../../../core/services/tool-registry.service';
import { SeoService } from '../../../core/services/seo.service';
import { TranslationService } from '../../../core/services/translation.service';
import { ToolCategoryId } from '../../../core/models/tool.model';
import { ToolCardComponent } from '../../../shared/components/tool-card/tool-card.component';

@Component({
  selector: 'bt-tools-directory',
  standalone: true,
  imports: [ToolCardComponent],
  template: `
    <div class="directory-page">
      <div class="directory-inner">
        <!-- Directory Header -->
        <header class="directory-header">
          <h1 class="directory-title">{{ i18n.t('directory.title') }}</h1>
          <p class="directory-subtitle">
            {{ i18n.t('directory.subtitle') }}
          </p>
        </header>

        <!-- Minimal Category Filter Pills (No search bar clutter) -->
        <div class="category-pills" role="tablist" aria-label="Categorías">
          <button
            type="button"
            class="pill-btn"
            [class.active]="selectedCategory() === 'all'"
            (click)="setCategory('all')"
            role="tab"
            [attr.aria-selected]="selectedCategory() === 'all'"
          >
            {{ i18n.t('directory.allCategory') }} ({{ allTools().length }})
          </button>

          @for (cat of categories(); track cat.id) {
            <button
              type="button"
              class="pill-btn"
              [class.active]="selectedCategory() === cat.id"
              (click)="setCategory(cat.id)"
              role="tab"
              [attr.aria-selected]="selectedCategory() === cat.id"
            >
              {{ cat.name }} ({{ getCategoryCount(cat.id) }})
            </button>
          }
        </div>

        <!-- Tools Grid -->
        <div class="tools-grid">
          @for (tool of filteredTools(); track tool.id) {
            <bt-tool-card [tool]="tool" />
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @use 'styles/variables' as *;
      @use 'styles/mixins' as *;

      .directory-page {
        padding-top: $spacing-8;
        padding-bottom: $spacing-16;
      }

      .directory-inner {
        @include container;
      }

      .directory-header {
        margin-bottom: $spacing-6;
      }

      .directory-title {
        font-size: $font-3xl;
        font-weight: 800;
        letter-spacing: -0.02em;
        color: $text-primary;
        margin-bottom: $spacing-2;
      }

      .directory-subtitle {
        font-size: $font-sm;
        color: $text-secondary;
        max-width: 580px;
        line-height: 1.5;
      }

      .category-pills {
        display: flex;
        align-items: center;
        gap: $spacing-2;
        overflow-x: auto;
        padding-bottom: $spacing-6;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        &::-webkit-scrollbar {
          display: none;
        }
      }

      .pill-btn {
        padding: $spacing-2 $spacing-4;
        border-radius: $radius-full;
        background-color: $bg-surface;
        border: 1px solid $border-color;
        color: $text-secondary;
        font-size: $font-xs;
        font-weight: 600;
        white-space: nowrap;
        cursor: pointer;
        transition: all $transition-fast;
        min-height: 38px;
        display: inline-flex;
        align-items: center;

        &:hover {
          color: $text-primary;
          border-color: $border-light;
        }

        &.active {
          background-color: $accent-yellow;
          color: #0D0E0E;
          border-color: $accent-yellow;
          font-weight: 700;
        }

        @include focus-ring;
      }

      .tools-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: $spacing-4;

        @include tablet {
          grid-template-columns: repeat(2, 1fr);
        }

        @include desktop {
          grid-template-columns: repeat(3, 1fr);
        }
      }
    `,
  ],
})
export class ToolsDirectoryComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toolRegistry = inject(ToolRegistryService);
  private readonly seoService = inject(SeoService);
  protected readonly i18n = inject(TranslationService);

  protected readonly allTools = this.toolRegistry.tools;
  protected readonly categories = this.toolRegistry.categories;
  protected readonly selectedCategory = signal<ToolCategoryId | 'all'>('all');

  protected readonly filteredTools = computed(() => {
    const cat = this.selectedCategory();
    if (cat === 'all') {
      return this.toolRegistry.tools();
    }
    return this.toolRegistry.getToolsByCategory(cat);
  });

  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'Directorio de Herramientas',
      description:
        'Explora el catálogo completo de utilidades gratuitas de Bandit Tools.',
    });

    this.route.queryParams.subscribe((params) => {
      if (params['category']) {
        const cat = params['category'] as ToolCategoryId;
        if (['images', 'developer-tools', 'generators', 'text'].includes(cat)) {
          this.selectedCategory.set(cat);
        }
      }
    });
  }

  getCategoryCount(categoryId: ToolCategoryId): number {
    return this.toolRegistry.getToolsByCategory(categoryId).length;
  }

  setCategory(category: ToolCategoryId | 'all'): void {
    this.selectedCategory.set(category);
    this.syncQueryParams();
  }

  private syncQueryParams(): void {
    const queryParams: Record<string, string | undefined> = {
      category: this.selectedCategory() !== 'all' ? this.selectedCategory() : undefined,
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
