import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { VideoToAudioComponent } from './video-to-audio.component';

describe('VideoToAudioComponent', () => {
  let fixture: ComponentFixture<VideoToAudioComponent>;
  let component: VideoToAudioComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoToAudioComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoToAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create video-to-audio component', () => {
    expect(component).toBeTruthy();
  });

  it('should display dropzone when no video is selected', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('bt-dropzone')).toBeTruthy();
  });

  it('should reset state when resetTool is invoked', () => {
    component.resetTool();
    expect(component['selectedFile']()).toBeNull();
    expect(component['audioResult']()).toBeNull();
  });

  it('should format seconds into mm:ss accurately', () => {
    expect(component.formatDuration(65)).toBe('1:05');
    expect(component.formatDuration(120)).toBe('2:00');
    expect(component.formatDuration(9)).toBe('0:09');
  });
});
