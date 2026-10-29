import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ToolsDirectoryComponent } from './tools-directory.component';

describe('ToolsDirectoryComponent', () => {
  let fixture: ComponentFixture<ToolsDirectoryComponent>;
  let component: ToolsDirectoryComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolsDirectoryComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolsDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create tools directory', () => {
    expect(component).toBeTruthy();
  });

  it('should display all registered tools initially', () => {
    expect(component['filteredTools']().length).toBe(9);
  });

  it('should filter tools by category', () => {
    component.setCategory('images');
    fixture.detectChanges();
    const results = component['filteredTools']();
    expect(results.length).toBe(2);
    expect(results.every((t) => t.category === 'images')).toBe(true);
  });

  it('should filter tools for developer category', () => {
    component.setCategory('developer-tools');
    fixture.detectChanges();
    const results = component['filteredTools']();
    expect(results.length).toBe(1);
    expect(results[0].id).toBe('json-formatter');
  });
});
