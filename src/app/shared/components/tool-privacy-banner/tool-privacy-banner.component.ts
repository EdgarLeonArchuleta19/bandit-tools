import { Component, inject, input } from '@angular/core';
import { TranslationService } from '../../../core/services/translation.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'bt-tool-privacy-banner',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="privacy-banner" role="region" aria-label="Garantía de privacidad">
      <div class="banner-icon">
        <bt-icon name="shield" [size]="20" />
      </div>
      <div class="banner-text">
        <strong class="banner-title">{{ i18n.t('privacy.bannerTitle') }}</strong>
        <p class="banner-desc">{{ message() || i18n.t('privacy.bannerDefault') }}</p>
      </div>
    </div>
  `,
  styles: [
    `
      @use 'styles/variables' as *;
      @use 'styles/mixins' as *;

      .privacy-banner {
        display: flex;
        align-items: flex-start;
        gap: $spacing-3;
        padding: $spacing-4;
        background-color: $bg-secondary;
        border: 1px solid $border-color;
        border-radius: $radius-lg;
        margin-top: $spacing-8;
        font-size: $font-sm;
      }

      .banner-icon {
        color: $accent-yellow;
        flex-shrink: 0;
        margin-top: 2px;
      }

      .banner-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .banner-title {
        color: $text-primary;
        font-size: $font-sm;
      }

      .banner-desc {
        color: $text-secondary;
        line-height: 1.5;
      }
    `,
  ],
})
export class ToolPrivacyBannerComponent {
  protected readonly i18n = inject(TranslationService);
  readonly message = input<string>('');
}
