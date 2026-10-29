import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { VideoEditorComponent } from './video-editor.component';

describe('VideoEditorComponent', () => {
  let fixture: ComponentFixture<VideoEditorComponent>;
  let component: VideoEditorComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoEditorComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create video-editor component', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct Amapa URL', () => {
    expect(component.amapaUrl).toBe('https://edgarleonarchuleta19.github.io/amapa-editor/');
  });

  it('should toggle fullscreen state', () => {
    expect(component.isFullscreen()).toBe(false);
    component.toggleFullscreen();
    expect(component.isFullscreen()).toBe(true);
    component.toggleFullscreen();
    expect(component.isFullscreen()).toBe(false);
  });

  it('should update loading state when iframe loads', () => {
    expect(component.isLoading()).toBe(true);
    component.onIframeLoad();
    expect(component.isLoading()).toBe(false);
  });

  it('should render external link with correct href', () => {
    const link = fixture.nativeElement.querySelector('a.btn-launch-external') as HTMLAnchorElement;
    expect(link).toBeTruthy();
    expect(link.href).toBe('https://edgarleonarchuleta19.github.io/amapa-editor/');
  });
});
