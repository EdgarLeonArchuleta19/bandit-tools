import { ByteSizePipe } from './byte-size.pipe';

describe('ByteSizePipe', () => {
  let pipe: ByteSizePipe;

  beforeEach(() => {
    pipe = new ByteSizePipe();
  });

  it('should format 0 bytes', () => {
    expect(pipe.transform(0)).toBe('0 B');
  });

  it('should format bytes under 1024', () => {
    expect(pipe.transform(512)).toBe('512 B');
  });

  it('should format KB properly', () => {
    expect(pipe.transform(1024)).toBe('1 KB');
    expect(pipe.transform(2048)).toBe('2 KB');
    expect(pipe.transform(1536)).toBe('1.5 KB');
  });

  it('should format MB properly', () => {
    expect(pipe.transform(1048576)).toBe('1 MB');
    expect(pipe.transform(2621440)).toBe('2.5 MB');
  });

  it('should handle null, undefined and NaN', () => {
    expect(pipe.transform(null)).toBe('0 B');
    expect(pipe.transform(undefined)).toBe('0 B');
    expect(pipe.transform(NaN)).toBe('0 B');
  });
});
