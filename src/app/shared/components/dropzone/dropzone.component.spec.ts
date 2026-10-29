import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DropzoneComponent } from './dropzone.component';

describe('DropzoneComponent', () => {
  let fixture: ComponentFixture<DropzoneComponent>;
  let component: DropzoneComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropzoneComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DropzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create dropzone component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit fileSelected when a valid file is dropped', () => {
    let emittedFile: File | null = null;
    component.fileSelected.subscribe((f) => (emittedFile = f));

    const testFile = new File(['imagecontent'], 'sample.png', { type: 'image/png' });
    const dragEvent = {
      preventDefault: () => {},
      stopPropagation: () => {},
      dataTransfer: {
        files: [testFile],
      },
    } as unknown as DragEvent;

    component.onDrop(dragEvent);
    expect(emittedFile).toBe(testFile);
  });

  it('should reject file that exceeds maxSizeMb', () => {
    let rejectedReason = '';
    component.fileRejected.subscribe((r) => (rejectedReason = r));

    // Create a mock large file: 30MB
    const largeFile = {
      name: 'large.png',
      size: 30 * 1024 * 1024,
      type: 'image/png',
    } as unknown as File;

    const dragEvent = {
      preventDefault: () => {},
      stopPropagation: () => {},
      dataTransfer: {
        files: [largeFile],
      },
    } as unknown as DragEvent;

    component.onDrop(dragEvent);
    expect(rejectedReason).toContain('exceeds');
  });
});
