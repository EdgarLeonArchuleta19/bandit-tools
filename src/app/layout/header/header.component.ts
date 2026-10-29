import { Component, inject, signal } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { APP_CONSTANTS } from '../../core/constants/app.constants';
import { ThemeService } from '../../core/services/theme.service';
import { TranslationService } from '../../core/services/translation.service';
import { ToolRequestService } from '../../core/services/tool-request.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'bt-header',
  standalone: true,
  imports: [CommonModule, UpperCasePipe, RouterLink, RouterLinkActive, IconComponent],
  template: `
    <header class="site-header">
      <div class="header-inner">
        <!-- Logo with Minimalist Lightning Bolt Silhouette -->
        <a routerLink="/" class="brand" aria-label="Bandit Tools Inicio">
          <div class="brand-logo-wrap">
            <img src="/logo.svg" alt="Bandit Tools Logo" class="brand-img" />
          </div>
          <div class="brand-text-wrap">
            <span class="brand-name">BANDIT<span class="brand-dot">.</span>TOOLS</span>
          </div>
        </a>

        <!-- Desktop Navigation (Only Inicio, Info, y ¿No encontraste lo que buscabas?) -->
        <nav class="desktop-nav" aria-label="Navegación principal">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="nav-link">
            {{ i18n.currentLang() === 'es' ? 'Inicio' : 'Home' }}
          </a>
          <a routerLink="/info" routerLinkActive="active" class="nav-link">
            {{ i18n.currentLang() === 'es' ? 'Info' : 'Info' }}
          </a>
          <button
            type="button"
            class="request-nav-btn"
            (click)="toolRequestService.openModal()"
          >
            <bt-icon name="sparkles" [size]="14" />
            <span>{{ i18n.currentLang() === 'es' ? '¿No encontraste lo que buscabas?' : "Missing a tool?" }}</span>
          </button>
        </nav>

        <!-- Right Action Group (Clean & Minimal) -->
        <div class="header-actions">
          <!-- Language Switcher (ES / EN) -->
          <button
            type="button"
            class="action-btn lang-btn"
            (click)="i18n.toggleLanguage()"
            [attr.aria-label]="i18n.t('nav.langToggle')"
            title="Cambiar idioma / Switch language"
          >
            <span class="lang-text mono">{{ i18n.currentLang() | uppercase }}</span>
          </button>

          <!-- Theme Toggle (Dark / Light) -->
          <button
            type="button"
            class="action-btn theme-btn"
            (click)="themeService.toggleTheme()"
            [attr.aria-label]="i18n.t('nav.themeToggle')"
            [title]="themeService.isDark() ? 'Activar tema claro' : 'Activar tema oscuro'"
          >
            <bt-icon [name]="themeService.isDark() ? 'sun' : 'moon'" [size]="16" />
          </button>

          <!-- GitHub Link -->
          <a
            [href]="githubUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="action-btn"
            [attr.aria-label]="i18n.t('nav.githubTitle')"
            title="GitHub"
          >
            <bt-icon name="github" [size]="18" />
          </a>

          <!-- Mobile Menu Trigger -->
          <button
            type="button"
            class="mobile-menu-btn"
            (click)="toggleMobileMenu()"
            [attr.aria-expanded]="mobileMenuOpen()"
            aria-label="Abrir menú"
          >
            <bt-icon [name]="mobileMenuOpen() ? 'close' : 'menu'" [size]="20" />
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Drawer -->
      @if (mobileMenuOpen()) {
        <div class="mobile-drawer" role="dialog" aria-modal="true" aria-label="Menú móvil">
          <nav class="mobile-nav" aria-label="Enlaces móviles">
            <a routerLink="/" (click)="closeMobileMenu()" class="mobile-link">
              <span>{{ i18n.currentLang() === 'es' ? 'Inicio' : 'Home' }}</span>
              <bt-icon name="chevron-right" [size]="16" />
            </a>
            <a routerLink="/info" (click)="closeMobileMenu()" class="mobile-link">
              <span>{{ i18n.currentLang() === 'es' ? 'Info (Acerca y Privacidad)' : 'Info & Privacy' }}</span>
              <bt-icon name="chevron-right" [size]="16" />
            </a>
            <button
              type="button"
              (click)="openRequestFromMobile()"
              class="mobile-link mobile-request-link"
            >
              <span>{{ i18n.currentLang() === 'es' ? '¿No encontraste lo que buscabas?' : "Missing a tool?" }}</span>
              <bt-icon name="sparkles" [size]="16" />
            </button>

            <!-- Mobile Toggles Row -->
            <div class="mobile-toggles-row">
              <button
                type="button"
                class="btn btn-secondary mobile-toggle-btn"
                (click)="i18n.toggleLanguage()"
              >
                <span>Idioma: {{ i18n.currentLang() === 'es' ? 'Español' : 'English' }}</span>
              </button>

              <button
                type="button"
                class="btn btn-secondary mobile-toggle-btn"
                (click)="themeService.toggleTheme()"
              >
                <bt-icon [name]="themeService.isDark() ? 'sun' : 'moon'" [size]="14" />
                <span>{{ themeService.isDark() ? 'Claro' : 'Oscuro' }}</span>
              </button>
            </div>
          </nav>
        </div>
      }
    </header>
  `,
  styles: [
    `
      @use 'styles/variables' as *;
      @use 'styles/mixins' as *;

      .site-header {
        position: sticky;
        top: 0;
        z-index: 100;
        background-color: rgba(13, 14, 14, 0.95);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-bottom: 1px solid $border-color;
        transition: background-color $transition-normal, border-color $transition-normal;
      }

      :host-context([data-theme="light"]) .site-header {
        background-color: rgba(247, 248, 247, 0.95);
      }

      .header-inner {
        @include container;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 58px;
        gap: $spacing-4;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: $spacing-2;
        text-decoration: none;
        flex-shrink: 0;

        @include focus-ring;
      }

      .brand-logo-wrap {
        width: 32px;
        height: 32px;
        border-radius: $radius-sm;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .brand-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .brand-text-wrap {
        display: flex;
        align-items: baseline;
        gap: 6px;
      }

      .brand-name {
        font-size: $font-base;
        font-weight: 800;
        letter-spacing: 0.05em;
        color: $text-primary;
      }

      .brand-dot {
        color: $accent-yellow;
      }

      .desktop-nav {
        display: none;
        align-items: center;
        gap: $spacing-6;

        @include desktop {
          display: flex;
        }
      }

      .nav-link {
        color: $text-secondary;
        font-size: $font-sm;
        font-weight: 500;
        transition: color $transition-fast;
        position: relative;
        padding: $spacing-1 0;

        &:hover {
          color: $text-primary;
        }

        &.active {
          color: $text-primary;
          font-weight: 600;

          &::after {
            content: '';
            position: absolute;
            bottom: -6px;
            left: 0;
            right: 0;
            height: 2px;
            background-color: $accent-yellow;
            border-radius: $radius-full;
          }
        }

        @include focus-ring;
      }

      .request-nav-btn {
        display: inline-flex;
        align-items: center;
        gap: $spacing-2;
        padding: 6px $spacing-3;
        border-radius: $radius-full;
        background-color: transparent;
        border: 1px solid $border-color;
        color: $accent-yellow;
        font-size: $font-xs;
        font-weight: 600;
        cursor: pointer;
        transition: all $transition-fast;

        &:hover {
          background-color: var(--accent-yellow-subtle);
          border-color: $accent-yellow;
          transform: translateY(-1px);
        }

        @include focus-ring;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: $spacing-2;
      }

      .action-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 36px;
        min-width: 36px;
        padding: 0 $spacing-3;
        border-radius: $radius-full;
        background-color: $bg-surface;
        border: 1px solid $border-color;
        color: $text-secondary;
        font-size: $font-xs;
        cursor: pointer;
        transition: all $transition-fast;

        &:hover {
          border-color: $accent-yellow;
          color: $text-primary;
        }

        @include focus-ring;
      }

      .lang-btn {
        font-weight: 700;
        letter-spacing: 0.05em;
        padding: 0 $spacing-3;
      }

      .mobile-menu-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        border-radius: $radius-md;
        color: $text-primary;
        border: 1px solid $border-color;
        background-color: $bg-surface;

        @include desktop {
          display: none;
        }

        @include focus-ring;
      }

      .mobile-drawer {
        padding: $spacing-4;
        background-color: $bg-secondary;
        border-bottom: 1px solid $border-color;
        display: flex;
        flex-direction: column;
        gap: $spacing-3;

        @include desktop {
          display: none;
        }
      }

      .mobile-nav {
        display: flex;
        flex-direction: column;
        gap: $spacing-2;
      }

      .mobile-link {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: $spacing-3;
        border-radius: $radius-sm;
        color: $text-primary;
        font-weight: 500;
        font-size: $font-sm;
        background-color: $bg-surface;
        border: 1px solid $border-color;

        &:hover {
          border-color: $border-light;
          background-color: $bg-surface-hover;
        }

        @include focus-ring;
      }

      .mobile-request-link {
        color: $accent-yellow;
        border-color: rgba(252, 227, 0, 0.3);
        cursor: pointer;
        width: 100%;
        text-align: left;
      }

      .mobile-toggles-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: $spacing-2;
        margin-top: $spacing-2;
      }

      .mobile-toggle-btn {
        font-size: $font-xs;
      }
    `,
  ],
})
export class HeaderComponent {
  protected readonly themeService = inject(ThemeService);
  protected readonly i18n = inject(TranslationService);
  protected readonly toolRequestService = inject(ToolRequestService);

  protected readonly githubUrl = APP_CONSTANTS.githubUrl;
  protected readonly mobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  openRequestFromMobile(): void {
    this.closeMobileMenu();
    this.toolRequestService.openModal();
  }
}
