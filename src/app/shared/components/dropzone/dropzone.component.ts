import { Component, ElementRef, computed, input, output, signal, viewChild } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'bt-dropzone',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div
      class="dropzone"
      [class.is-dragover]="isDragOver()"
      [class.is-disabled]="disabled()"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave($event)"
      (drop)="onDrop($event)"
      (click)="fileInputRef.click()"
      (keydown.enter)="fileInputRef.click()"
      (keydown.space)="fileInputRef.click()"
      role="button"
      tabindex="0"
      [attr.aria-label]="label()"
    >
      <input
        #fileInput
        type="file"
        class="file-input"
        [accept]="accept()"
        (change)="onFileInputChange($event)"
        [disabled]="disabled()"
        tabindex="-1"
      />

      <div class="dropzone-content">
        <div class="dropzone-icon">
          <bt-icon [name]="iconName()" [size]="32" />
        </div>
        <div class="dropzone-text">
          <p class="main-prompt">
            <span class="action-highlight">{{ promptAction() }}</span> {{ promptOr() }}
          </p>
          <p class="hint-text">{{ hint() }}</p>
          @if (maxSizeMb()) {
            <p class="size-limit">{{ limitText() }} {{ maxSizeMb() }} MB</p>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @use 'styles/variables' as *;
      @use 'styles/mixins' as *;

      .dropzone {
        border: 2px dashed $border-color;
        border-radius: $radius-lg;
        background-color: $bg-secondary;
        padding: $spacing-8 $spacing-4;
        text-align: center;
        cursor: pointer;
        transition: all $transition-fast;
        outline: none;

        @include focus-ring;

        &:hover:not(.is-disabled) {
          border-color: $accent-yellow;
          background-color: rgba(255, 212, 59, 0.03);

          .dropzone-icon {
            color: $accent-yellow;
            transform: translateY(-2px);
          }
        }

        &.is-dragover {
          border-color: $accent-yellow;
          background-color: $accent-yellow-subtle;

          .dropzone-icon {
            color: $accent-yellow;
            transform: scale(1.1);
          }
        }

        &.is-disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      .file-input {
        display: none;
      }

      .dropzone-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: $spacing-3;
      }

      .dropzone-icon {
        width: 56px;
        height: 56px;
        border-radius: $radius-full;
        background-color: $bg-surface;
        border: 1px solid $border-color;
        color: $text-secondary;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform $transition-fast, color $transition-fast;
      }

      .dropzone-text {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .main-prompt {
        font-size: $font-base;
        font-weight: 500;
        color: $text-primary;
      }

      .action-highlight {
        color: $accent-yellow;
        text-decoration: underline;
        text-underline-offset: 3px;
      }

      .hint-text {
        font-size: $font-sm;
        color: $text-secondary;
      }

      .size-limit {
        font-size: $font-xs;
        color: $text-muted;
      }
    `,
  ],
})
export class DropzoneComponent {
  readonly accept = input<string>('image/*');
  readonly label = input<string>('Zona de subida');
  readonly hint = input<string>('Archivos PNG, JPG o WebP');
  readonly promptAction = input<string>('Haz clic para subir');
  readonly promptOr = input<string>('o arrastra y suelta');
  readonly limitText = input<string>('Hasta');
  readonly maxSizeMb = input<number>(25);
  readonly disabled = input<boolean>(false);
  readonly iconName = input<string>('upload-cloud');

  readonly fileSelected = output<File>();
  readonly fileRejected = output<string>();

  readonly fileInputEl = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  protected readonly isDragOver = signal(false);

  protected get fileInputRef(): HTMLInputElement {
    return this.fileInputEl()!.nativeElement;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.disabled()) {
      this.isDragOver.set(true);
    }
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    if (this.disabled()) return;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
      input.value = '';
    }
  }

  private processFile(file: File): void {
    // Validate size
    const maxSizeBytes = this.maxSizeMb() * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      this.fileRejected.emit(
        `File size exceeds the ${this.maxSizeMb()}MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`
      );
      return;
    }

    // Validate type if accept is set
    const acceptRule = this.accept();
    if (acceptRule && acceptRule !== '*/*') {
      const allowedTypes = acceptRule.split(',').map((t) => t.trim().toLowerCase());
      const fileType = file.type.toLowerCase();
      const fileName = file.name.toLowerCase();

      const isAllowed = allowedTypes.some((type) => {
        if (type.startsWith('.')) {
          return fileName.endsWith(type);
        }
        if (type.endsWith('/*')) {
          const prefix = type.split('/')[0];
          return fileType.startsWith(prefix + '/');
        }
        return fileType === type;
      });

      if (!isAllowed) {
        this.fileRejected.emit(`Invalid file format: ${file.name}. Expected ${acceptRule}`);
        return;
      }
    }

    this.fileSelected.emit(file);
  }
}
