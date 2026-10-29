import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { YoutubeDownloaderComponent } from './youtube-downloader.component';

describe('YoutubeDownloaderComponent', () => {
  let fixture: ComponentFixture<YoutubeDownloaderComponent>;
  let component: YoutubeDownloaderComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YoutubeDownloaderComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(YoutubeDownloaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create youtube-downloader component', () => {
    expect(component).toBeTruthy();
  });

  it('should format seconds into mm:ss accurately', () => {
    expect(component.formatDuration(213)).toBe('3:33');
    expect(component.formatDuration(60)).toBe('1:00');
    expect(component.formatDuration(5)).toBe('0:05');
  });

  it('should reject invalid YouTube URL and not fetch', async () => {
    component['urlInput'] = 'https://invalid-domain.com/video';
    await component.fetchVideo();
    expect(component['videoInfo']()).toBeNull();
    expect(component['isLoading']()).toBe(false);
  });
});
