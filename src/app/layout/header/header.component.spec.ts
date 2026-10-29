import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component: HeaderComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create header component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle mobile menu', () => {
    expect(fixture.nativeElement.querySelector('.mobile-drawer')).toBeNull();
    component.toggleMobileMenu();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.mobile-drawer')).toBeTruthy();

    component.closeMobileMenu();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.mobile-drawer')).toBeNull();
  });

  it('should render brand logo and name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand-img')).toBeTruthy();
    expect(compiled.querySelector('.brand-name')?.textContent).toContain('BANDIT');
  });
});
