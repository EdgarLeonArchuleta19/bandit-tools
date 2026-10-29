import { TestBed } from '@angular/core/testing';
import { PasswordGeneratorService, PasswordOptions } from './password-generator.service';

describe('PasswordGeneratorService', () => {
  let service: PasswordGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PasswordGeneratorService],
    });
    service = TestBed.inject(PasswordGeneratorService);
  });

  it('should generate password of specified length', () => {
    const opts: PasswordOptions = {
      length: 24,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeAmbiguous: false,
    };
    const pass = service.generate(opts);
    expect(pass.length).toBe(24);
  });

  it('should generate numbers-only password when only numbers enabled', () => {
    const opts: PasswordOptions = {
      length: 12,
      includeUppercase: false,
      includeLowercase: false,
      includeNumbers: true,
      includeSymbols: false,
      excludeAmbiguous: false,
    };
    const pass = service.generate(opts);
    expect(pass.length).toBe(12);
    expect(/^\d+$/.test(pass)).toBe(true);
  });

  it('should exclude ambiguous characters when requested', () => {
    const opts: PasswordOptions = {
      length: 50,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeAmbiguous: true,
    };
    const pass = service.generate(opts);
    const ambiguousChars = ['1', 'l', 'I', '0', 'O', 'o'];
    for (const char of ambiguousChars) {
      expect(pass.includes(char)).toBe(false);
    }
  });

  it('should calculate strength score and entropy', () => {
    const weak = service.calculateStrength('abc');
    expect(weak.score).toBe(0);
    expect(weak.label).toBe('Very Weak');

    const strong = service.calculateStrength('K7#v9!qZ$2Lp@8Xm*');
    expect(strong.score).toBeGreaterThanOrEqual(3);
    expect(strong.entropyBits).toBeGreaterThan(60);
  });

  it('should return empty string if no character set selected', () => {
    const opts: PasswordOptions = {
      length: 16,
      includeUppercase: false,
      includeLowercase: false,
      includeNumbers: false,
      includeSymbols: false,
      excludeAmbiguous: false,
    };
    const pass = service.generate(opts);
    expect(pass).toBe('');
  });
});
