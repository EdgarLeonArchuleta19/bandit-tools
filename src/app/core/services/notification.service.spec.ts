import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService],
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.toasts().length).toBe(0);
  });

  it('should add success toast to list', () => {
    service.success('Operation succeeded', 0);
    const toasts = service.toasts();
    expect(toasts.length).toBe(1);
    expect(toasts[0].message).toBe('Operation succeeded');
    expect(toasts[0].type).toBe('success');
  });

  it('should add error toast to list', () => {
    service.error('Something went wrong', 0);
    const toasts = service.toasts();
    expect(toasts.length).toBe(1);
    expect(toasts[0].message).toBe('Something went wrong');
    expect(toasts[0].type).toBe('error');
  });

  it('should dismiss toast by id', () => {
    service.info('Info note', 0);
    const toastId = service.toasts()[0].id;
    service.dismiss(toastId);
    expect(service.toasts().length).toBe(0);
  });
});
