import { TestBed } from '@angular/core/testing';
import { YoutubeDownloaderService } from './youtube-downloader.service';

describe('YoutubeDownloaderService', () => {
  let service: YoutubeDownloaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [YoutubeDownloaderService],
    });
    service = TestBed.inject(YoutubeDownloaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should extract video ID from standard watch URL', () => {
    expect(
      service.extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    ).toBe('dQw4w9WgXcQ');
  });

  it('should extract video ID from shortened youtu.be URL', () => {
    expect(service.extractVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe(
      'dQw4w9WgXcQ'
    );
  });

  it('should extract video ID from Shorts URL', () => {
    expect(
      service.extractVideoId('https://www.youtube.com/shorts/dQw4w9WgXcQ')
    ).toBe('dQw4w9WgXcQ');
  });

  it('should extract video ID from embed URL', () => {
    expect(
      service.extractVideoId('https://www.youtube.com/embed/dQw4w9WgXcQ')
    ).toBe('dQw4w9WgXcQ');
  });

  it('should accept raw 11-char video ID', () => {
    expect(service.extractVideoId('dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('should return null for invalid or non-YouTube URLs', () => {
    expect(service.extractVideoId('https://vimeo.com/12345')).toBeNull();
    expect(service.extractVideoId('not a url')).toBeNull();
    expect(service.extractVideoId('')).toBeNull();
  });
});
