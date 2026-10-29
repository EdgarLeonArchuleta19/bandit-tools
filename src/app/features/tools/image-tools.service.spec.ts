import { TestBed } from '@angular/core/testing';
import { ImageToolsService } from './image-tools.service';

describe('ImageToolsService', () => {
  let service: ImageToolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageToolsService],
    });
    service = TestBed.inject(ImageToolsService);
  });

  it('should calculate savings percentage and bytes accurately', () => {
    const savings = service.calculateSavings(1000000, 400000);
    expect(savings.bytesSaved).toBe(600000);
    expect(savings.percentSaved).toBe(60);
    expect(savings.isLarger).toBe(false);
  });

  it('should detect when output is larger than input', () => {
    const savings = service.calculateSavings(100000, 150000);
    expect(savings.bytesSaved).toBe(-50000);
    expect(savings.percentSaved).toBe(50);
    expect(savings.isLarger).toBe(true);
  });

  it('should calculate dimension scaling maintaining aspect ratio', () => {
    // 2000 x 1000 scaled down to max 1000 width
    const dims = service.calculateDimensions(2000, 1000, 1000, undefined);
    expect(dims.width).toBe(1000);
    expect(dims.height).toBe(500);

    // 1000 x 2000 scaled down to max 1000 height
    const dims2 = service.calculateDimensions(1000, 2000, undefined, 1000);
    expect(dims2.width).toBe(500);
    expect(dims2.height).toBe(1000);
  });

  it('should map mime types to correct file extensions', () => {
    expect(service.mimeToExtension('image/jpeg')).toBe('jpg');
    expect(service.mimeToExtension('image/png')).toBe('png');
    expect(service.mimeToExtension('image/webp')).toBe('webp');
    expect(service.mimeToExtension('image/unknown')).toBe('img');
  });

  it('should manage and revoke object URLs safely', () => {
    const blob = new Blob(['test'], { type: 'text/plain' });
    const url = service.createObjectUrl(blob);
    expect(url).toBeTruthy();
    expect(() => service.revokeObjectUrl(url)).not.toThrow();
    expect(() => service.revokeAllUrls()).not.toThrow();
  });
});
