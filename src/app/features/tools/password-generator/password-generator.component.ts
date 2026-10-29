import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolRegistryService } from '../../../core/services/tool-registry.service';
import { SeoService } from '../../../core/services/seo.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TranslationService } from '../../../core/services/translation.service';
import {
  PasswordGeneratorService,
  PasswordOptions,
  PasswordStrength,
} from './password-generator.service';
import { ToolDefinition } from '../../../core/models/tool.model';
import { ToolHeaderComponent } from '../../../shared/components/tool-header/tool-header.component';
import { RelatedToolsComponent } from '../../../shared/components/related-tools/related-tools.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'bt-password-generator',
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
          <!-- Main Output Display Card -->
          <div class="result-card">
            <div class="password-display">
              <span class="password-text mono">{{ generatedPassword() || (i18n.currentLang() === 'es' ? 'Selecciona al menos un tipo de carácter' : 'Select at least one character type') }}</span>
              <div class="display-actions">
                <button
                  type="button"
                  class="btn btn-secondary btn-icon"
                  (click)="generatePassword()"
                  [title]="i18n.currentLang() === 'es' ? 'Generar nueva contraseña' : 'Generate new password'"
                  [attr.aria-label]="i18n.currentLang() === 'es' ? 'Generar nueva contraseña' : 'Generate new password'"
                >
                  <bt-icon name="refresh-cw" [size]="18" />
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  (click)="copyPassword(generatedPassword())"
                  [disabled]="!generatedPassword()"
                  [attr.aria-label]="i18n.currentLang() === 'es' ? 'Copiar contraseña al portapapeles' : 'Copy password to clipboard'"
                >
                  <bt-icon [name]="copied() ? 'check' : 'copy'" [size]="16" />
                  <span>{{ copied() ? (i18n.currentLang() === 'es' ? '¡Copiada!' : 'Copied!') : (i18n.currentLang() === 'es' ? 'Copiar' : 'Copy') }}</span>
                </button>
              </div>
            </div>

            <!-- Strength Meter -->
            <div class="strength-meter">
              <div class="strength-header">
                <span class="strength-label">
                  {{ i18n.currentLang() === 'es' ? 'Nivel de seguridad:' : 'Strength:' }}
                  <strong [style.color]="strength().color">{{ getStrengthLabel() }}</strong>
                </span>
                <span class="entropy-label">{{ strength().entropyBits }} {{ i18n.currentLang() === 'es' ? 'bits de entropía' : 'bits entropy' }}</span>
              </div>
              <div class="meter-track">
                @for (step of [0, 1, 2, 3, 4]; track step) {
                  <div
                    class="meter-segment"
                    [class.active]="step <= strength().score"
                    [style.background-color]="step <= strength().score ? strength().color : ''"
                  ></div>
                }
              </div>
            </div>
          </div>

          <!-- Options & Configuration Controls -->
          <div class="config-card">
            <h2 class="config-title">{{ i18n.currentLang() === 'es' ? 'Configuración de Contraseña' : 'Password Configuration' }}</h2>

            <!-- Length Slider -->
            <div class="control-row">
              <div class="label-group">
                <label for="lengthSlider" class="control-label">{{ i18n.currentLang() === 'es' ? 'Longitud de caracteres' : 'Password Length' }}</label>
                <span class="length-badge mono">{{ options.length }}</span>
              </div>
              <input
                id="lengthSlider"
                type="range"
                min="6"
                max="64"
                [(ngModel)]="options.length"
                (ngModelChange)="onOptionChange()"
                class="length-slider"
              />
              <div class="length-presets">
                @for (preset of [12, 16, 24, 32, 48]; track preset) {
                  <button
                    type="button"
                    class="preset-btn"
                    [class.active]="options.length === preset"
                    (click)="setLength(preset)"
                  >
                    {{ preset }}
                  </button>
                }
              </div>
            </div>

            <!-- Character Set Toggles -->
            <div class="toggles-grid">
              <label class="toggle-card">
                <input
                  type="checkbox"
                  [(ngModel)]="options.includeUppercase"
                  (ngModelChange)="onOptionChange()"
                />
                <div class="toggle-info">
                  <span class="toggle-name">{{ i18n.currentLang() === 'es' ? 'Letras Mayúsculas' : 'Uppercase Letters' }}</span>
                  <span class="toggle-example mono">A B C D E</span>
                </div>
              </label>

              <label class="toggle-card">
                <input
                  type="checkbox"
                  [(ngModel)]="options.includeLowercase"
                  (ngModelChange)="onOptionChange()"
                />
                <div class="toggle-info">
                  <span class="toggle-name">{{ i18n.currentLang() === 'es' ? 'Letras Minúsculas' : 'Lowercase Letters' }}</span>
                  <span class="toggle-example mono">a b c d e</span>
                </div>
              </label>

              <label class="toggle-card">
                <input
                  type="checkbox"
                  [(ngModel)]="options.includeNumbers"
                  (ngModelChange)="onOptionChange()"
                />
                <div class="toggle-info">
                  <span class="toggle-name">{{ i18n.currentLang() === 'es' ? 'Números' : 'Numbers' }}</span>
                  <span class="toggle-example mono">0 1 2 3 4</span>
                </div>
              </label>

              <label class="toggle-card">
                <input
                  type="checkbox"
                  [(ngModel)]="options.includeSymbols"
                  (ngModelChange)="onOptionChange()"
                />
                <div class="toggle-info">
                  <span class="toggle-name">{{ i18n.currentLang() === 'es' ? 'Símbolos Especiales' : 'Special Symbols' }}</span>
                  <span class="toggle-example mono">! &#64; # $ %</span>
                </div>
              </label>
            </div>

            <!-- Exclude Ambiguous Option -->
            <div class="sub-option">
              <label class="toggle-checkbox">
                <input
                  type="checkbox"
                  [(ngModel)]="options.excludeAmbiguous"
                  (ngModelChange)="onOptionChange()"
                />
                <span class="checkbox-label">
                  {{ i18n.currentLang() === 'es'
                    ? 'Excluir caracteres ambiguos o similares (1, l, I, 0, O) para evitar errores de lectura'
                    : 'Exclude ambiguous characters (1, l, I, 0, O) to avoid misreading' }}
                </span>
              </label>
            </div>
          </div>

          <!-- Bulk Generation Section -->
          <div class="bulk-card">
            <div class="bulk-header">
              <h3 class="bulk-title">{{ i18n.currentLang() === 'es' ? '¿Necesitas varias contraseñas?' : 'Need multiple passwords?' }}</h3>
              <button type="button" class="btn btn-secondary btn-sm" (click)="generateBulk()">
                <bt-icon name="sparkles" [size]="14" />
                <span>{{ i18n.currentLang() === 'es' ? 'Generar 5 adicionales' : 'Generate 5 More' }}</span>
              </button>
            </div>

            @if (bulkList().length > 0) {
              <div class="bulk-list">
                @for (pw of bulkList(); track $index) {
                  <div class="bulk-item">
                    <span class="bulk-password mono">{{ pw }}</span>
                    <button
                      type="button"
                      class="btn btn-ghost btn-sm"
                      (click)="copyPassword(pw)"
                      [attr.aria-label]="i18n.currentLang() === 'es' ? 'Copiar esta contraseña' : 'Copy this password'"
                    >
                      <bt-icon name="copy" [size]="14" />
                      <span>{{ i18n.currentLang() === 'es' ? 'Copiar' : 'Copy' }}</span>
                    </button>
                  </div>
                }
              </div>
            }
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
        max-width: 800px;
        margin: 0 auto;
      }

      .result-card {
        @include card-surface;
        padding: $spacing-6;
        border-color: rgba(255, 212, 59, 0.3);
        background-color: $bg-surface;
      }

      .password-display {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: $spacing-4;
        background-color: $bg-secondary;
        border: 1px solid $border-color;
        border-radius: $radius-lg;
        padding: $spacing-4 $spacing-5;
        margin-bottom: $spacing-5;

        @include mobile {
          flex-direction: column;
          align-items: stretch;
        }
      }

      .password-text {
        font-size: $font-xl;
        font-weight: 600;
        letter-spacing: 0.05em;
        color: $accent-yellow;
        word-break: break-all;
        user-select: all;

        @include mobile {
          font-size: $font-base;
          text-align: center;
        }
      }

      .display-actions {
        display: flex;
        align-items: center;
        gap: $spacing-2;
        flex-shrink: 0;
      }

      .strength-meter {
        display: flex;
        flex-direction: column;
        gap: $spacing-2;
      }

      .strength-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: $font-xs;
      }

      .strength-label {
        color: $text-secondary;
        strong {
          margin-left: 4px;
        }
      }

      .entropy-label {
        color: $text-muted;
        font-family: $font-mono;
      }

      .meter-track {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: $spacing-1;
        height: 6px;
      }

      .meter-segment {
        background-color: $bg-secondary;
        border-radius: $radius-full;
        transition: background-color $transition-normal;
      }

      .config-card {
        @include card-surface;
        padding: $spacing-6;
      }

      .config-title {
        font-size: $font-lg;
        font-weight: 600;
        color: $text-primary;
        margin-bottom: $spacing-5;
      }

      .control-row {
        display: flex;
        flex-direction: column;
        gap: $spacing-3;
        margin-bottom: $spacing-6;
      }

      .label-group {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .control-label {
        font-size: $font-sm;
        font-weight: 500;
        color: $text-primary;
      }

      .length-badge {
        font-size: $font-base;
        font-weight: 700;
        color: $accent-yellow;
        background-color: $bg-secondary;
        padding: 2px $spacing-3;
        border-radius: $radius-md;
        border: 1px solid $border-color;
      }

      .length-slider {
        width: 100%;
      }

      .length-presets {
        display: flex;
        gap: $spacing-2;
        flex-wrap: wrap;
      }

      .preset-btn {
        padding: 3px $spacing-3;
        border-radius: $radius-full;
        background-color: $bg-secondary;
        border: 1px solid $border-color;
        color: $text-secondary;
        font-size: $font-xs;
        font-family: $font-mono;
        cursor: pointer;
        transition: all $transition-fast;

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

      .toggles-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: $spacing-3;
        margin-bottom: $spacing-5;

        @include tablet-up {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      .toggle-card {
        display: flex;
        align-items: center;
        gap: $spacing-3;
        padding: $spacing-3 $spacing-4;
        background-color: $bg-secondary;
        border: 1px solid $border-color;
        border-radius: $radius-md;
        cursor: pointer;
        transition: border-color $transition-fast;

        &:hover {
          border-color: $border-light;
        }

        input[type="checkbox"] {
          accent-color: $accent-yellow;
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
      }

      .toggle-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .toggle-name {
        font-size: $font-sm;
        font-weight: 500;
        color: $text-primary;
      }

      .toggle-example {
        font-size: $font-xs;
        color: $text-muted;
      }

      .sub-option {
        padding-top: $spacing-3;
        border-top: 1px solid $border-color;
      }

      .toggle-checkbox {
        display: flex;
        align-items: center;
        gap: $spacing-3;
        cursor: pointer;

        input[type="checkbox"] {
          accent-color: $accent-yellow;
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
      }

      .checkbox-label {
        font-size: $font-sm;
        color: $text-secondary;
      }

      .bulk-card {
        @include card-surface;
        padding: $spacing-5 $spacing-6;
      }

      .bulk-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: $spacing-4;
      }

      .bulk-title {
        font-size: $font-base;
        font-weight: 600;
        color: $text-primary;
      }

      .bulk-list {
        display: flex;
        flex-direction: column;
        gap: $spacing-2;
      }

      .bulk-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: $spacing-2 $spacing-3;
        background-color: $bg-secondary;
        border: 1px solid $border-color;
        border-radius: $radius-md;
      }

      .bulk-password {
        font-size: $font-sm;
        color: $text-primary;
        word-break: break-all;
      }
    `,
  ],
})
export class PasswordGeneratorComponent implements OnInit {
  private readonly toolRegistry = inject(ToolRegistryService);
  private readonly passwordService = inject(PasswordGeneratorService);
  private readonly seoService = inject(SeoService);
  private readonly notificationService = inject(NotificationService);
  protected readonly i18n = inject(TranslationService);

  protected readonly tool = signal<ToolDefinition | undefined>(undefined);
  protected readonly relatedTools = signal<ToolDefinition[]>([]);

  protected options: PasswordOptions = {
    length: 18,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeAmbiguous: false,
  };

  protected readonly generatedPassword = signal('');
  protected readonly strength = signal<PasswordStrength>({
    score: 0,
    label: 'Weak',
    color: '#F87171',
    entropyBits: 0,
  });
  protected readonly copied = signal(false);
  protected readonly bulkList = signal<string[]>([]);

  getStrengthLabel(): string {
    const isEs = this.i18n.currentLang() === 'es';
    switch (this.strength().score) {
      case 0:
      case 1:
        return isEs ? 'Muy Débil' : 'Very Weak';
      case 2:
        return isEs ? 'Débil' : 'Weak';
      case 3:
        return isEs ? 'Aceptable' : 'Moderate';
      case 4:
        return isEs ? 'Fuerte' : 'Strong';
      case 5:
        return isEs ? 'Extrema' : 'Very Strong';
      default:
        return this.strength().label;
    }
  }

  ngOnInit(): void {
    const t = this.toolRegistry.getToolById('password-generator');
    this.tool.set(t);

    if (t) {
      this.seoService.updateSeo({
        title: t.name,
        description: t.description,
        keywords: t.keywords,
      });
      this.relatedTools.set(this.toolRegistry.getRelatedTools(t.id));
    }

    this.generatePassword();
  }

  generatePassword(): void {
    const pw = this.passwordService.generate(this.options);
    this.generatedPassword.set(pw);
    this.strength.set(this.passwordService.calculateStrength(pw));
  }

  onOptionChange(): void {
    // Prevent deselecting everything
    if (
      !this.options.includeUppercase &&
      !this.options.includeLowercase &&
      !this.options.includeNumbers &&
      !this.options.includeSymbols
    ) {
      this.options.includeLowercase = true;
    }

    this.generatePassword();
  }

  setLength(len: number): void {
    this.options.length = len;
    this.generatePassword();
  }

  generateBulk(): void {
    const list: string[] = [];
    for (let i = 0; i < 5; i++) {
      list.push(this.passwordService.generate(this.options));
    }
    this.bulkList.set(list);
    const isEs = this.i18n.currentLang() === 'es';
    this.notificationService.info(isEs ? 'Se generaron 5 contraseñas adicionales' : 'Generated 5 alternate passwords');
  }

  async copyPassword(password: string): Promise<void> {
    if (!password) return;

    try {
      await navigator.clipboard.writeText(password);
      this.copied.set(true);
      const isEs = this.i18n.currentLang() === 'es';
      this.notificationService.success(isEs ? '¡Contraseña copiada al portapapeles!' : 'Copied password to clipboard!');
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      const isEs = this.i18n.currentLang() === 'es';
      this.notificationService.error(isEs ? 'No se pudo copiar al portapapeles' : 'Failed to copy to clipboard');
    }
  }
}
