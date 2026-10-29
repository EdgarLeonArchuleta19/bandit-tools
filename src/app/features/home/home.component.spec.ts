import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create home component', () => {
    expect(component).toBeTruthy();
  });

  it('should render minimalist hero title and flat lightning logo', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.hero-title')?.textContent).toContain('Herramientas útiles');
    expect(compiled.querySelector('.hero-lightning-img')).toBeTruthy();
  });

  it('should not render distracting subtitles, metrics or non-functional badges on homepage', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.hero-sub')).toBeNull();
    expect(compiled.querySelector('.metrics-strip')).toBeNull();
    expect(compiled.querySelector('.foss-badge')).toBeNull();
  });

  it('should filter tools with smart search query', () => {
    component.onSearchChange('JSON');
    fixture.detectChanges();
    const cards = fixture.nativeElement.querySelectorAll('bt-tool-card');
    expect(cards.length).toBe(1);

    component.clearSearch();
    fixture.detectChanges();
    const allCards = fixture.nativeElement.querySelectorAll('bt-tool-card');
    expect(allCards.length).toBe(9);
  });

  it('should display tools grid directly', () => {
    const cards = fixture.nativeElement.querySelectorAll('bt-tool-card');
    expect(cards.length).toBe(9);
  });

  it('should filter tools when category tab is selected', () => {
    component.setCategory('images');
    fixture.detectChanges();
    const cards = fixture.nativeElement.querySelectorAll('bt-tool-card');
    expect(cards.length).toBe(2);

    component.setCategory('media');
    fixture.detectChanges();
    const mediaCards = fixture.nativeElement.querySelectorAll('bt-tool-card');
    expect(mediaCards.length).toBe(3);
  });

  it('should not render surprise button on minimalist homepage', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.btn-surprise')).toBeNull();
  });
});
