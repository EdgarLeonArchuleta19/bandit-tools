import { TestBed } from '@angular/core/testing';
import { TranslationService } from './translation.service';

describe('TranslationService', () => {
  let service: TranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TranslationService],
    });
    service = TestBed.inject(TranslationService);
  });

  it('should be created and default to Spanish (es)', () => {
    expect(service).toBeTruthy();
    expect(service.currentLang()).toBe('es');
  });

  it('should translate keys in Spanish by default', () => {
    expect(service.t('nav.tools')).toBe('Herramientas');
    expect(service.t('footer.tagline')).toBe('Herramientas útiles. Cero complicaciones.');
  });

  it('should switch language to English and translate accordingly', () => {
    service.setLanguage('en');
    expect(service.currentLang()).toBe('en');
    expect(service.t('nav.tools')).toBe('Tools');
    expect(service.t('footer.tagline')).toBe('Useful tools. Zero hassle.');
  });

  it('should toggle language back and forth', () => {
    service.setLanguage('es');
    service.toggleLanguage();
    expect(service.currentLang()).toBe('en');
    service.toggleLanguage();
    expect(service.currentLang()).toBe('es');
  });

  it('should interpolate parameters in translation strings', () => {
    const text = service.t('home.viewAll', { count: 6 });
    expect(text).toContain('6');
  });
});
