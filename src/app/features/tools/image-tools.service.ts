import { Injectable } from '@angular/core';

export type SupportedImageFormat = 'image/jpeg' | 'image/png' | 'image/webp';

export interface CompressOptions {
  quality: number; // 0.1 to 1.0
  format?: 'original' | 'image/jpeg' | 'image/png' | 'image/webp';
  maxWidth?: number;
  maxHeight?: number;
}

export interface ConvertOptions {
  targetFormat: SupportedImageFormat;
  quality: number; // 0.1 to 1.0
}

export interface ProcessedImageResult {
  blob: Blob;
  objectUrl: string;
  width: number;
  height: number;
  fileSizeBytes: number;
  fileName: string;
  format: string;
  originalSizeBytes: number;
  bytesSaved: number;
  percentSaved: number;
  isLarger: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ImageToolsService {
  private activeObjectUrls = new Set<string>();

  createObjectUrl(blob: Blob): string {
    let url = 'blob:mock-url';
    if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
      try {
        url = URL.createObjectURL(blob);
      } catch {
        url = 'blob:fallback-url';
      }
    }
    this.activeObjectUrls.add(url);
    return url;
  }

  revokeObjectUrl(url: string): void {
    if (this.activeObjectUrls.has(url)) {
      if (typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
        try {
          URL.revokeObjectURL(url);
        } catch {}
      }
      this.activeObjectUrls.delete(url);
    }
  }

  revokeAllUrls(): void {
    this.activeObjectUrls.forEach((url) => {
      if (typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
        try {
          URL.revokeObjectURL(url);
        } catch {}
      }
    });
    this.activeObjectUrls.clear();
  }

  loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(img);
      };

      img.onerror = (err) => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error(`Failed to load image "${file.name}": ${err}`));
      };

      img.src = objectUrl;
    });
  }

  async compressImage(
    file: File,
    options: CompressOptions
  ): Promise<ProcessedImageResult> {
    const img = await this.loadImage(file);

    let targetMime: string = file.type;
    if (options.format && options.format !== 'original') {
      targetMime = options.format;
    }

    // Fallback if MIME type is empty or uncompressed
    if (!targetMime || targetMime === 'image/svg+xml') {
      targetMime = 'image/jpeg';
    }

    const { width, height } = this.calculateDimensions(
      img.naturalWidth || img.width,
      img.naturalHeight || img.height,
      options.maxWidth,
      options.maxHeight
    );

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not access HTML canvas context for image processing');
    }

    // If output is JPEG, fill background with white (since JPEG doesn't support alpha channel)
    if (targetMime === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
    }

    ctx.drawImage(img, 0, 0, width, height);

    const quality = Math.max(0.05, Math.min(1.0, options.quality));

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) {
            resolve(b);
          } else {
            reject(new Error('Failed to generate image blob from canvas'));
          }
        },
        targetMime,
        quality
      );
    });

    const objectUrl = this.createObjectUrl(blob);
    const savings = this.calculateSavings(file.size, blob.size);

    const ext = this.mimeToExtension(targetMime);
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const newFileName = `${baseName}-compressed.${ext}`;

    return {
      blob,
      objectUrl,
      width,
      height,
      fileSizeBytes: blob.size,
      fileName: newFileName,
      format: targetMime,
      originalSizeBytes: file.size,
      bytesSaved: savings.bytesSaved,
      percentSaved: savings.percentSaved,
      isLarger: savings.isLarger,
    };
  }

  async convertImage(
    file: File,
    options: ConvertOptions
  ): Promise<ProcessedImageResult> {
    const img = await this.loadImage(file);
    const width = img.naturalWidth || img.width;
    const height = img.naturalHeight || img.height;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Canvas 2D context is not available');
    }

    // Fill white background for JPEG target to preserve clarity without dark black alpha fills
    if (options.targetFormat === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
    }

    ctx.drawImage(img, 0, 0, width, height);

    const quality =
      options.targetFormat === 'image/png'
        ? 1.0
        : Math.max(0.1, Math.min(1.0, options.quality));

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) {
            resolve(b);
          } else {
            reject(new Error('Canvas toBlob conversion failed'));
          }
        },
        options.targetFormat,
        quality
      );
    });

    const objectUrl = this.createObjectUrl(blob);
    const savings = this.calculateSavings(file.size, blob.size);
    const ext = this.mimeToExtension(options.targetFormat);
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const newFileName = `${baseName}.${ext}`;

    return {
      blob,
      objectUrl,
      width,
      height,
      fileSizeBytes: blob.size,
      fileName: newFileName,
      format: options.targetFormat,
      originalSizeBytes: file.size,
      bytesSaved: savings.bytesSaved,
      percentSaved: savings.percentSaved,
      isLarger: savings.isLarger,
    };
  }

  calculateSavings(
    originalSize: number,
    newSize: number
  ): { bytesSaved: number; percentSaved: number; isLarger: boolean } {
    const diff = originalSize - newSize;
    if (diff > 0) {
      const pct = (diff / originalSize) * 100;
      return {
        bytesSaved: diff,
        percentSaved: Math.round(pct * 10) / 10,
        isLarger: false,
      };
    } else {
      const increase = newSize - originalSize;
      const pct = originalSize > 0 ? (increase / originalSize) * 100 : 0;
      return {
        bytesSaved: -increase,
        percentSaved: Math.round(pct * 10) / 10,
        isLarger: true,
      };
    }
  }

  calculateDimensions(
    srcWidth: number,
    srcHeight: number,
    maxWidth?: number,
    maxHeight?: number
  ): { width: number; height: number } {
    let width = srcWidth;
    let height = srcHeight;

    if (maxWidth && width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }

    if (maxHeight && height > maxHeight) {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }

    return { width, height };
  }

  mimeToExtension(mime: string): string {
    switch (mime) {
      case 'image/jpeg':
        return 'jpg';
      case 'image/png':
        return 'png';
      case 'image/webp':
        return 'webp';
      case 'image/gif':
        return 'gif';
      default:
        return 'img';
    }
  }
}
