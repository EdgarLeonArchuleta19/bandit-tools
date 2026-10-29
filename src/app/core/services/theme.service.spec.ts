import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThemeService],
    });
    service = TestBed.inject(ThemeService);
  });

  it('should be created and default to dark theme', () => {
    expect(service).toBeTruthy();
    expect(service.currentTheme()).toBe('dark');
    expect(service.isDark()).toBe(true);
  });

  it('should toggle theme from dark to light and back', () => {
    service.toggleTheme();
    expect(service.currentTheme()).toBe('light');
    expect(service.isDark()).toBe(false);

    service.toggleTheme();
    expect(service.currentTheme()).toBe('dark');
    expect(service.isDark()).toBe(true);
  });

  it('should set theme explicitly', () => {
    service.setTheme('light');
    expect(service.currentTheme()).toBe('light');
  });
});
