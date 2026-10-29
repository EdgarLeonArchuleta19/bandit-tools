import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolRequestService } from '../../../core/services/tool-request.service';
import { TranslationService } from '../../../core/services/translation.service';
import { NotificationService } from '../../../core/services/notification.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'bt-tool-request-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    @if (toolRequestService.isOpen()) {
      <div class="modal-backdrop" (click)="onBackdropClick($event)" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-card">
          <!-- Close Button -->
          <button type="button" class="btn-close" (click)="close()" aria-label="Cerrar modal">
            <bt-icon name="close" [size]="18" />
          </button>

          <!-- Modal Header with Minimalist Lightning Bolt Icon -->
          <div class="modal-header">
            <div class="bolt-badge">
              <img src="/logo.svg" alt="Bandit Tools Logo" class="badge-icon" />
            </div>
            <h2 id="modal-title" class="modal-title">
              {{ i18n.currentLang() === 'es' ? '¿No encontraste lo que buscabas?' : "Didn't find what you were looking for?" }}
            </h2>
            <p class="modal-subtitle">
              {{ i18n.currentLang() === 'es'
                ? 'Sugiere una nueva herramienta. Las solicitudes llegan directo al desarrollador para agregarlas a Bandit Tools.'
                : 'Suggest a new tool. Requests are sent directly to the developer to be added to Bandit Tools.' }}
            </p>
          </div>

          <!-- Form -->
          <form class="request-form" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="reqToolName" class="form-label">
                {{ i18n.currentLang() === 'es' ? 'Nombre o tipo de herramienta *' : 'Tool name or type *' }}
              </label>
              <input
                id="reqToolName"
                type="text"
                [(ngModel)]="toolName"
                name="toolName"
                required
                [placeholder]="i18n.currentLang() === 'es' ? 'Ej. Editor de PDF, Convertidor SVG a PNG, Minificador CSS...' : 'e.g. PDF Editor, SVG to PNG Converter, CSS Minifier...'"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="reqDescription" class="form-label">
                {{ i18n.currentLang() === 'es' ? '¿Para qué sirve o qué función debe tener? *' : 'What should it do? *' }}
              </label>
              <textarea
                id="reqDescription"
                [(ngModel)]="description"
                name="description"
                required
                rows="3"
                [placeholder]="i18n.currentLang() === 'es' ? 'Explica brevemente qué necesitas que haga la herramienta...' : 'Briefly explain what you need this tool to do...'"
                class="form-textarea"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="reqEmail" class="form-label">
                {{ i18n.currentLang() === 'es' ? 'Tu correo de contacto (opcional)' : 'Your email (optional)' }}
              </label>
              <input
                id="reqEmail"
                type="email"
                [(ngModel)]="userEmail"
                name="userEmail"
                [placeholder]="i18n.currentLang() === 'es' ? 'nombre@ejemplo.com (para avisarte cuando esté lista)' : 'name@example.com (so we can notify you)'"
                class="form-input"
              />
            </div>

            <!-- Action Buttons -->
            <div class="form-actions">
              <button
                type="submit"
                class="btn btn-primary btn-submit"
                [disabled]="!toolName.trim() || !description.trim() || toolRequestService.isSubmitting()"
              >
                <bt-icon [name]="toolRequestService.isSubmitting() ? 'refresh-cw' : 'sparkles'" [size]="16" [class.spin-icon]="toolRequestService.isSubmitting()" />
                <span>
                  {{ toolRequestService.isSubmitting()
                    ? (i18n.currentLang() === 'es' ? 'Enviando...' : 'Sending...')
                    : (i18n.currentLang() === 'es' ? 'Enviar Solicitud' : 'Submit Request') }}
                </span>
              </button>

              <button
                type="button"
                class="btn btn-ghost btn-mailto"
                (click)="sendDirectMail()"
                [disabled]="!toolName.trim()"
                [title]="i18n.currentLang() === 'es' ? 'Abrir en tu aplicación de correo predeterminada' : 'Open in your default email client'"
              >
                <bt-icon name="external-link" [size]="14" />
                <span>{{ i18n.currentLang() === 'es' ? 'Enviar vía Email' : 'Send via Email' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  styles: [
    `
      @use 'styles/variables' as *;
      @use 'styles/mixins' as *;

      .modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 1000;
        background-color: rgba(0, 0, 0, 0.75);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: $spacing-4;
        animation: fadeIn $transition-normal;
      }

      .modal-card {
        position: relative;
        width: 100%;
        max-width: 520px;
        background-color: $bg-surface;
        border: 1px solid $border-color;
        border-radius: $radius-2xl;
        padding: $spacing-8;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
        animation: popIn $transition-normal;

        @include mobile {
          padding: $spacing-6;
        }
      }

      .btn-close {
        position: absolute;
        top: $spacing-4;
        right: $spacing-4;
        width: 32px;
        height: 32px;
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

        @include focus-ring;
      }

      .modal-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        margin-bottom: $spacing-6;
        gap: $spacing-2;
      }

      .bolt-badge {
        width: 48px;
        height: 48px;
        border-radius: $radius-lg;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid $border-color;
        background-color: $bg-surface;
        margin-bottom: $spacing-2;
      }

      .badge-icon {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .modal-title {
        font-size: $font-xl;
        font-weight: 800;
        color: $text-primary;
        letter-spacing: -0.01em;
        line-height: 1.3;
      }

      .modal-subtitle {
        font-size: $font-xs;
        color: $text-secondary;
        line-height: 1.5;
        max-width: 420px;
      }

      .request-form {
        display: flex;
        flex-direction: column;
        gap: $spacing-4;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .form-label {
        font-size: $font-xs;
        font-weight: 600;
        color: $text-primary;
      }

      .form-input,
      .form-textarea {
        width: 100%;
        border-radius: $radius-md;
        background-color: $bg-secondary;
        border: 1px solid $border-color;
        color: $text-primary;
        padding: $spacing-3;
        font-size: $font-sm;
        font-family: $font-sans;

        &:focus {
          border-color: $accent-yellow;
        }
      }

      .form-textarea {
        resize: vertical;
      }

      .form-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: $spacing-3;
        margin-top: $spacing-2;
        flex-wrap: wrap;
      }

      .btn-submit {
        flex: 1;
        border-radius: $radius-full;
        min-height: 44px;
      }

      .btn-mailto {
        font-size: $font-xs;
      }

      .spin-icon {
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        100% {
          transform: rotate(360deg);
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes popIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
    `,
  ],
})
export class ToolRequestModalComponent {
  protected readonly toolRequestService = inject(ToolRequestService);
  protected readonly i18n = inject(TranslationService);
  protected readonly notificationService = inject(NotificationService);

  protected toolName = '';
  protected description = '';
  protected userEmail = '';

  close(): void {
    this.toolRequestService.closeModal();
    this.resetForm();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close();
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.toolName.trim() || !this.description.trim()) return;

    const ok = await this.toolRequestService.submitRequest({
      toolName: this.toolName.trim(),
      description: this.description.trim(),
      userEmail: this.userEmail.trim() || undefined,
    });

    if (ok) {
      this.resetForm();
    }
  }

  sendDirectMail(): void {
    this.toolRequestService.sendViaMailto({
      toolName: this.toolName.trim(),
      description: this.description.trim() || 'No especificada',
      userEmail: this.userEmail.trim() || undefined,
    });
  }

  private resetForm(): void {
    this.toolName = '';
    this.description = '';
    this.userEmail = '';
  }
}
