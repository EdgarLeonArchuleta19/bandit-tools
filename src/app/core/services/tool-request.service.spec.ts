import { TestBed } from '@angular/core/testing';
import { ToolRequestService } from './tool-request.service';

describe('ToolRequestService', () => {
  let service: ToolRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToolRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open and close modal', () => {
    expect(service.isOpen()).toBe(false);
    service.openModal();
    expect(service.isOpen()).toBe(true);
    service.closeModal();
    expect(service.isOpen()).toBe(false);
  });

  it('should format mailto URL correctly without throwing', () => {
    const spy = vi.spyOn(window, 'open').mockImplementation(() => null);
    service.sendViaMailto({
      toolName: 'PDF Merger',
      description: 'Combine multiple PDF files into one.',
      userEmail: 'test@example.com',
    });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
