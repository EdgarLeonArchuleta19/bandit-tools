import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  ElementRef,
  ViewChild,
  HostListener,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToolRegistryService } from '../../core/services/tool-registry.service';
import { SeoService } from '../../core/services/seo.service';
import { TranslationService } from '../../core/services/translation.service';
import { ToolRequestService } from '../../core/services/tool-request.service';
import { ToolCategoryId } from '../../core/models/tool.model';
import { ToolCardComponent } from '../../shared/components/tool-card/tool-card.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'bt-home',
  standalone: true,
  imports: [FormsModule, ToolCardComponent, IconComponent],
  template: `
    <div class="minimal-home">
      <div class="home-container">
        <!-- Minimal Hero -->
        <header class="minimal-hero">
          <div class="hero-lightning-wrap">
            <img src="/logo.svg" alt="Bandit Tools Logo" class="hero-lightning-img" />
          </div>

          <h1 class="hero-title">
            {{ i18n.currentLang() === 'es' ? 'Herramientas útiles.' : 'Useful tools.' }}
            <span class="hero-accent">{{ i18n.currentLang() === 'es' ? 'Cero complicaciones.' : 'Zero hassle.' }}</span>
          </h1>
        </header>

        <!-- Smart Search Bar with Keyboard Shortcut -->
        <div class="smart-search-section">
          <div class="search-input-box">
            <bt-icon name="search" [size]="18" class="search-icon" />
            <input
              #searchInput
              type="text"
              class="smart-search-input"
              [ngModel]="searchQuery()"
              (ngModelChange)="onSearchChange($event)"
              [placeholder]="i18n.currentLang() === 'es' ? 'Buscar herramientas (ej. comprimir, imagen, qr, json, contraseña, palabras)...' : 'Search tools (e.g. compress, image, qr, json, password, words)...'"
              aria-label="Buscar herramientas"
            />
            @if (!searchQuery()) {
              <kbd class="kbd-hint" title="Presiona '/' en tu teclado para buscar">/</kbd>
            } @else {
              <button
                type="button"
                class="btn-clear-search"
                (click)="clearSearch()"
                aria-label="Limpiar búsqueda"
              >
                <bt-icon name="close" [size]="14" />
              </button>
            }
          </div>

          @if (searchQuery()) {
            <div class="search-feedback">
              <span class="search-count">
                {{ displayedTools().length }} {{ i18n.currentLang() === 'es' ? (displayedTools().length === 1 ? 'herramienta encontrada' : 'herramientas encontradas') : (displayedTools().length === 1 ? 'tool found' : 'tools found') }}
              </span>
            </div>
          }
        </div>

        <!-- Category Filter Tabs -->
        <div class="category-nav" role="tablist" aria-label="Filtro de categorías">
          <button
            type="button"
            class="filter-pill"
            [class.active]="selectedCategory() === 'all'"
            (click)="setCategory('all')"
          >
            {{ i18n.currentLang() === 'es' ? 'Todas' : 'All' }} ({{ totalCount() }})
          </button>

          @for (cat of categories(); track cat.id) {
            <button
              type="button"
              class="filter-pill"
              [class.active]="selectedCategory() === cat.id"
              (click)="setCategory(cat.id)"
            >
              {{ cat.name }} ({{ getCategoryCount(cat.id) }})
            </button>
          }
        </div>

        <!-- Direct Tools Grid -->
        <section class="tools-section">
          @if (displayedTools().length > 0) {
            <div class="tools-grid">
              @for (tool of displayedTools(); track tool.id) {
                <bt-tool-card [tool]="tool" />
              }
            </div>
          } @else {
            <div class="empty-state-card">
              <div class="empty-icon-wrap">
                <bt-icon name="alert-circle" [size]="32" />
              </div>
              <h3 class="empty-title">
                {{ i18n.currentLang() === 'es' ? 'No encontramos herramientas con ese nombre' : 'No matching tools found' }}
              </h3>
              <p class="empty-desc">
                {{ i18n.currentLang() === 'es'
                  ? 'No hay resultados para tu búsqueda. ¿Buscabas algo específico que aún no tenemos?'
                  : 'No results matched your query. Were you looking for something specific we do not have yet?' }}
              </p>
              <button type="button" class="btn btn-primary btn-lg" (click)="openRequestModal()">
                <bt-icon name="sparkles" [size]="16" />
                <span>{{ i18n.currentLang() === 'es' ? '¿No encontraste lo que buscabas? Solicítala aquí' : 'Missing a tool? Request it here' }}</span>
              </button>
            </div>
          }
        </section>
      </div>
    </div>
  `,
  styles: [
    `
      @use 'styles/variables' as *;
      @use 'styles/mixins' as *;

      .minimal-home {
        padding-top: $spacing-10;
        padding-bottom: $spacing-20;
      }

      .home-container {
        @include container;
        display: flex;
        flex-direction: column;
        gap: $spacing-6;
      }

      .minimal-hero {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        max-width: 680px;
        margin: 0 auto;
        gap: $spacing-3;
      }

      // Classic, flat, clean lightning mark
      .hero-lightning-wrap {
        width: 52px;
        height: 52px;
        border-radius: $radius-md;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid $border-color;
        background-color: $bg-surface;
      }

      .hero-lightning-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .hero-title {
        font-size: $font-3xl;
        font-weight: 800;
        letter-spacing: -0.02em;
        line-height: 1.2;
        color: $text-primary;

        @include tablet-up {
          font-size: $font-4xl;
        }
      }

      .hero-accent {
        color: $accent-yellow;
      }

      // Smart Search Bar
      .smart-search-section {
        max-width: 680px;
        width: 100%;
        margin: $spacing-2 auto 0;
        display: flex;
        flex-direction: column;
        gap: $spacing-2;
      }

      .search-input-box {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
      }

      .search-icon {
        position: absolute;
        left: $spacing-4;
        color: $text-muted;
        pointer-events: none;
      }

      .smart-search-input {
        width: 100%;
        height: 48px;
        padding-left: 44px;
        padding-right: 44px;
        font-size: $font-sm;
        border-radius: $radius-full;
        background-color: $bg-surface;
        border: 1px solid $border-color;
        color: $text-primary;
        box-shadow: none;
        transition: border-color $transition-fast;

        &:hover {
          border-color: $border-light;
        }

        &:focus {
          border-color: $accent-yellow;
          outline: none;
        }

        &::placeholder {
          color: $text-muted;
        }
      }

      .kbd-hint {
        position: absolute;
        right: $spacing-4;
        width: 22px;
        height: 22px;
        border-radius: $radius-xs;
        background-color: $bg-secondary;
        border: 1px solid $border-color;
        color: $text-muted;
        font-family: $font-mono;
        font-size: 11px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
      }

      .btn-clear-search {
        position: absolute;
        right: $spacing-3;
        width: 28px;
        height: 28px;
        border-radius: $radius-full;
        background-color: $bg-secondary;
        border: 1px solid $border-color;
        color: $text-secondary;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all $transition-fast;

        &:hover {
          color: $text-primary;
          border-color: $border-light;
        }
      }

      .search-feedback {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 $spacing-3;
      }

      .search-count {
        font-size: $font-xs;
        color: $accent-yellow;
        font-weight: 600;
      }

      // Minimal Category Nav
      .category-nav {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: $spacing-2;
        flex-wrap: wrap;
        padding-bottom: $spacing-2;

        @include mobile {
          justify-content: flex-start;
          flex-wrap: nowrap;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding-left: $spacing-2;
          padding-right: $spacing-2;
          padding-bottom: $spacing-4;
          scrollbar-width: none;
          &::-webkit-scrollbar {
            display: none;
          }
        }
      }

      .filter-pill {
        padding: $spacing-2 $spacing-4;
        border-radius: $radius-full;
        background-color: $bg-surface;
        border: 1px solid $border-color;
        color: $text-secondary;
        font-size: $font-xs;
        font-weight: 600;
        cursor: pointer;
        transition: all $transition-fast;
        min-height: 38px;
        display: inline-flex;
        align-items: center;
        white-space: nowrap;

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

      // Tools Grid
      .tools-section {
        width: 100%;
        margin-top: $spacing-2;
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

      // Empty State Card
      .empty-state-card {
        @include card-surface;
        padding: $spacing-12 $spacing-6;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: $spacing-3;
        border-radius: $radius-xl;
        max-width: 580px;
        margin: $spacing-6 auto;
      }

      .empty-icon-wrap {
        width: 48px;
        height: 48px;
        border-radius: $radius-full;
        background-color: var(--accent-yellow-subtle);
        color: $accent-yellow;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: $spacing-2;
      }

      .empty-title {
        font-size: $font-lg;
        font-weight: 700;
        color: $text-primary;
      }

      .empty-desc {
        font-size: $font-sm;
        color: $text-secondary;
        max-width: 420px;
        line-height: 1.5;
        margin-bottom: $spacing-3;
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  private readonly toolRegistry = inject(ToolRegistryService);
  private readonly seoService = inject(SeoService);
  private readonly toolRequestService = inject(ToolRequestService);
  protected readonly i18n = inject(TranslationService);

  protected readonly categories = this.toolRegistry.categories;
  protected readonly selectedCategory = signal<ToolCategoryId | 'all'>('all');
  protected readonly searchQuery = signal<string>('');

  @ViewChild('searchInput') private readonly searchInputRef?: ElementRef<HTMLInputElement>;

  protected readonly totalCount = computed(() => this.toolRegistry.tools().length);

  protected readonly displayedTools = computed(() => {
    const cat = this.selectedCategory();
    const query = this.searchQuery().toLowerCase().trim();

    let list =
      cat === 'all'
        ? this.toolRegistry.tools()
        : this.toolRegistry.getToolsByCategory(cat);

    if (!query) {
      return list;
    }

    return list.filter((t) => {
      const matchName = t.name.toLowerCase().includes(query);
      const matchTag = t.tagline.toLowerCase().includes(query);
      const matchDesc = t.description.toLowerCase().includes(query);
      const matchKeywords = t.keywords.some((k) => k.toLowerCase().includes(query));
      const matchCat = t.category.toLowerCase().includes(query);
      return matchName || matchTag || matchDesc || matchKeywords || matchCat;
    });
  });

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (
      event.key === '/' &&
      !['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement)?.tagName)
    ) {
      event.preventDefault();
      this.searchInputRef?.nativeElement.focus();
    }
  }

  ngOnInit(): void {
    this.seoService.resetToDefault();
  }

  setCategory(category: ToolCategoryId | 'all'): void {
    this.selectedCategory.set(category);
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  getCategoryCount(categoryId: ToolCategoryId): number {
    return this.toolRegistry.getToolsByCategory(categoryId).length;
  }

  openRequestModal(): void {
    this.toolRequestService.openModal(this.searchQuery());
  }
}
