import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'byteSize',
  standalone: true,
})
export class ByteSizePipe implements PipeTransform {
  transform(bytes: number | null | undefined, precision = 2): string {
    if (bytes === null || bytes === undefined || isNaN(bytes)) {
      return '0 B';
    }

    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
    const index = Math.min(i, sizes.length - 1);

    const value = bytes / Math.pow(k, index);
    return `${parseFloat(value.toFixed(precision))} ${sizes[index]}`;
  }
}
