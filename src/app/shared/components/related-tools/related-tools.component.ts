import { Component, inject, input } from '@angular/core';
import { ToolDefinition } from '../../../core/models/tool.model';
import { TranslationService } from '../../../core/services/translation.service';
import { ToolCardComponent } from '../tool-card/tool-card.component';

@Component({
  selector: 'bt-related-tools',
  standalone: true,
  imports: [ToolCardComponent],
  template: `
    @if (tools().length > 0) {
      <section class="related-section">
        <h2 class="section-title">
          <span>{{ i18n.currentLang() === 'es' ? 'Otras utilidades recomendadas' : 'Recommended tools' }}</span>
        </h2>
        <div class="tools-grid">
          @for (tool of tools(); track tool.id) {
            <bt-tool-card [tool]="tool" />
          }
        </div>
      </section>
    }
  `,
  styles: [
    `
      @use 'styles/variables' as *;
      @use 'styles/mixins' as *;

      .related-section {
        margin-top: $spacing-8;
        margin-bottom: $spacing-6;
      }

      .section-title {
        font-size: $font-sm;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: $text-primary;
        margin-bottom: $spacing-4;
        display: flex;
        align-items: center;
        gap: $spacing-2;
      }

      .tools-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: $spacing-3;

        @include tablet-up {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `,
  ],
})
export class RelatedToolsComponent {
  protected readonly i18n = inject(TranslationService);
  readonly tools = input<ToolDefinition[]>([]);
}
