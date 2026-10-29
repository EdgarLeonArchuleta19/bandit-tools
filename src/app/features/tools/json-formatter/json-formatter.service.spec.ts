import { TestBed } from '@angular/core/testing';
import { JsonFormatterService } from './json-formatter.service';

describe('JsonFormatterService', () => {
  let service: JsonFormatterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JsonFormatterService],
    });
    service = TestBed.inject(JsonFormatterService);
  });

  it('should validate valid JSON correctly', () => {
    const res = service.validate('{"hello": "world", "num": 42}');
    expect(res.isValid).toBe(true);
    expect(res.parsed).toEqual({ hello: 'world', num: 42 });
    expect(res.error).toBeUndefined();
  });

  it('should detect invalid JSON and report error', () => {
    const res = service.validate('{"hello": "world", invalid}');
    expect(res.isValid).toBe(false);
    expect(res.error).toBeDefined();
    expect(res.error?.message).toBeTruthy();
  });

  it('should handle empty or whitespace input', () => {
    const res = service.validate('   ');
    expect(res.isValid).toBe(false);
    expect(res.error?.message).toContain('empty');
  });

  it('should format JSON with specified indentations', () => {
    const input = '{"a":1,"b":[2,3]}';

    const formatted2 = service.format(input, '2');
    expect(formatted2.formatted).toBe('{\n  "a": 1,\n  "b": [\n    2,\n    3\n  ]\n}');
    expect(formatted2.stats.linesCount).toBe(7);

    const formatted4 = service.format(input, '4');
    expect(formatted4.formatted).toContain('    "a": 1');

    const formattedTab = service.format(input, 'tab');
    expect(formattedTab.formatted).toContain('\t"a": 1');
  });

  it('should minify JSON properly', () => {
    const input = '{\n  "name": "bandit",\n  "count": 10\n}';
    const minified = service.minify(input);
    expect(minified.minified).toBe('{"name":"bandit","count":10}');
    expect(minified.stats.linesCount).toBe(1);
  });

  it('should count nested keys accurately', () => {
    const obj = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3,
        },
      },
    };
    expect(service.countKeys(obj)).toBe(5);
  });

  it('should provide sample JSON', () => {
    const sample = service.getSampleJson();
    expect(sample).toBeTruthy();
    const val = service.validate(sample);
    expect(val.isValid).toBe(true);
  });
});
