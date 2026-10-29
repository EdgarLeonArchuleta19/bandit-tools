import { TestBed } from '@angular/core/testing';
import { QrGeneratorService, QrOptions } from './qr-generator.service';

describe('QrGeneratorService', () => {
  let service: QrGeneratorService;

  const defaultOpts: QrOptions = {
    width: 300,
    margin: 2,
    darkColor: '#000000',
    lightColor: '#ffffff',
    errorCorrectionLevel: 'M',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QrGeneratorService],
    });
    service = TestBed.inject(QrGeneratorService);
  });

  it('should generate PNG data URL for valid text', async () => {
    const dataUrl = await service.generateDataUrl('https://bandit.tools', defaultOpts);
    expect(dataUrl).toBeTruthy();
    expect(dataUrl.startsWith('data:image/png;base64,')).toBe(true);
  });

  it('should generate SVG string for valid text', async () => {
    const svg = await service.generateSvg('https://bandit.tools', defaultOpts);
    expect(svg).toBeTruthy();
    expect(svg.includes('<svg')).toBe(true);
    expect(svg.includes('</svg>')).toBe(true);
  });

  it('should reject empty or whitespace text', async () => {
    await expect(service.generateDataUrl('', defaultOpts)).rejects.toThrow('empty');
    await expect(service.generateSvg('   ', defaultOpts)).rejects.toThrow('empty');
  });

  it('should format WiFi QR string correctly', () => {
    const wifi = service.formatWifiString('HomeNetwork', 'SecretPass123', 'WPA');
    expect(wifi).toBe('WIFI:T:WPA;S:HomeNetwork;P:SecretPass123;;');
  });
});
