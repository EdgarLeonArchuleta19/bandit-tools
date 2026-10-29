import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'bt-toast',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="toast-container" role="status" aria-live="polite">
      @for (toast of notificationService.toasts(); track toast.id) {
        <div class="toast toast-{{ toast.type }}">
          <div class="toast-icon">
            @switch (toast.type) {
              @case ('success') {
                <bt-icon name="check-circle" [size]="18" />
              }
              @case ('error') {
                <bt-icon name="alert-circle" [size]="18" />
              }
              @default {
                <bt-icon name="info" [size]="18" />
              }
            }
          </div>
          <span class="toast-message">{{ toast.message }}</span>
          <button
            type="button"
            class="toast-close"
            (click)="notificationService.dismiss(toast.id)"
            aria-label="Dismiss notification"
          >
            <bt-icon name="close" [size]="14" />
          </button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      @use 'styles/variables' as *;
      @use 'styles/mixins' as *;

      .toast-container {
        position: fixed;
        bottom: $spacing-6;
        right: $spacing-6;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: $spacing-2;
        max-width: 420px;
        pointer-events: none;

        @include mobile {
          left: $spacing-4;
          right: $spacing-4;
          bottom: $spacing-4;
          max-width: 100%;
        }
      }

      .toast {
        pointer-events: auto;
        display: flex;
        align-items: center;
        gap: $spacing-3;
        padding: $spacing-3 $spacing-4;
        border-radius: $radius-lg;
        background-color: $bg-surface;
        border: 1px solid $border-color;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
        color: $text-primary;
        font-size: $font-sm;
        animation: slideIn $transition-normal;

        &-success {
          border-left: 4px solid $color-success;
          .toast-icon {
            color: $color-success;
          }
        }

        &-error {
          border-left: 4px solid $color-error;
          .toast-icon {
            color: $color-error;
          }
        }

        &-info {
          border-left: 4px solid $accent-yellow;
          .toast-icon {
            color: $accent-yellow;
          }
        }
      }

      .toast-icon {
        display: flex;
        align-items: center;
        flex-shrink: 0;
      }

      .toast-message {
        flex: 1;
        line-height: 1.4;
      }

      .toast-close {
        color: $text-muted;
        padding: $spacing-1;
        border-radius: $radius-xs;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color $transition-fast;

        &:hover {
          color: $text-primary;
        }

        @include focus-ring;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(12px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class ToastComponent {
  protected readonly notificationService = inject(NotificationService);
}
