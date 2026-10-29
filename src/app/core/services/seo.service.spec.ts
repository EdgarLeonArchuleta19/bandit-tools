import { TestBed } from '@angular/core/testing';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from './seo.service';
import { APP_CONSTANTS } from '../constants/app.constants';

describe('SeoService', () => {
  let service: SeoService;
  let titleService: Title;
  let metaService: Meta;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SeoService, Title, Meta],
    });
    service = TestBed.inject(SeoService);
    titleService = TestBed.inject(Title);
    metaService = TestBed.inject(Meta);
  });

  it('should set title with Bandit Tools suffix', () => {
    service.updateSeo({ title: 'Image Compressor' });
    expect(titleService.getTitle()).toBe(`Image Compressor — ${APP_CONSTANTS.name}`);
  });

  it('should reset to default title and description', () => {
    service.resetToDefault();
    expect(titleService.getTitle()).toBe(`${APP_CONSTANTS.name} — ${APP_CONSTANTS.tagline}`);
  });

  it('should update meta description tag', () => {
    service.updateSeo({ description: 'Custom description for tool' });
    const meta = metaService.getTag('name="description"');
    expect(meta?.content).toBe('Custom description for tool');
  });
});
