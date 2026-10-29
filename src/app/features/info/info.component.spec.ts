import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { InfoComponent } from './info.component';

describe('InfoComponent', () => {
  let fixture: ComponentFixture<InfoComponent>;
  let component: InfoComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create info component', () => {
    expect(component).toBeTruthy();
  });

  it('should render both philosophy and privacy guarantee sections', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.info-title')?.textContent).toContain('Información');
    expect(compiled.textContent).toContain('Herramientas útiles. Cero complicaciones.');
    expect(compiled.textContent).toContain('100% Procesamiento Local');
  });

  it('should display brand emblem', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand-img')).toBeTruthy();
  });
});
