import { TestBed } from '@angular/core/testing';
import { ToolRegistryService } from './tool-registry.service';

describe('ToolRegistryService', () => {
  let service: ToolRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToolRegistryService],
    });
    service = TestBed.inject(ToolRegistryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all registered tools', () => {
    const tools = service.getAllTools();
    expect(tools.length).toBe(9);
    expect(tools.map((t) => t.id)).toContain('image-compressor');
    expect(tools.map((t) => t.id)).toContain('json-formatter');
    expect(tools.map((t) => t.id)).toContain('password-generator');
    expect(tools.map((t) => t.id)).toContain('youtube-downloader');
    expect(tools.map((t) => t.id)).toContain('video-to-audio');
    expect(tools.map((t) => t.id)).toContain('video-editor');
  });

  it('should filter featured tools', () => {
    const featured = service.getFeaturedTools();
    expect(featured.length).toBeGreaterThan(0);
    featured.forEach((tool) => {
      expect(tool.isFeatured).toBe(true);
    });
  });

  it('should find tool by ID', () => {
    const tool = service.getToolById('json-formatter');
    expect(tool).toBeDefined();
    expect(tool?.name).toBe('Formateador y Validador JSON');
  });

  it('should return undefined for non-existent tool ID', () => {
    const tool = service.getToolById('non-existent');
    expect(tool).toBeUndefined();
  });

  it('should filter tools by category', () => {
    const imagesTools = service.getToolsByCategory('images');
    expect(imagesTools.length).toBe(2);
    expect(imagesTools.every((t) => t.category === 'images')).toBe(true);
  });

  it('should search tools by keyword and name', () => {
    const results = service.searchTools('crypto');
    expect(results.length).toBe(1);
    expect(results[0].id).toBe('password-generator');

    const jsonResults = service.searchTools('JSON');
    expect(jsonResults.length).toBe(1);
    expect(jsonResults[0].id).toBe('json-formatter');
  });

  it('should search tools within a specific category', () => {
    const results = service.searchTools('image', 'images');
    expect(results.length).toBe(2);

    const emptyResults = service.searchTools('image', 'developer-tools');
    expect(emptyResults.length).toBe(0);
  });

  it('should return related tools correctly', () => {
    const related = service.getRelatedTools('json-formatter');
    expect(related.length).toBe(2);
    expect(related.map((t) => t.id)).toContain('word-counter');
  });
});
