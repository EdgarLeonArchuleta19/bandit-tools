import { TestBed } from '@angular/core/testing';
import { WordCounterService } from './word-counter.service';

describe('WordCounterService', () => {
  let service: WordCounterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WordCounterService],
    });
    service = TestBed.inject(WordCounterService);
  });

  it('should return zeroes for empty input', () => {
    const metrics = service.analyze('');
    expect(metrics.words).toBe(0);
    expect(metrics.charactersWithSpaces).toBe(0);
    expect(metrics.charactersWithoutSpaces).toBe(0);
    expect(metrics.sentences).toBe(0);
    expect(metrics.paragraphs).toBe(0);
    expect(metrics.readingTimeMinutes).toBe(0);
  });

  it('should return zeroes for whitespace-only input', () => {
    const metrics = service.analyze('   \n\t   ');
    expect(metrics.words).toBe(0);
    expect(metrics.charactersWithSpaces).toBe(0);
    expect(metrics.charactersWithoutSpaces).toBe(0);
  });

  it('should count words with irregular spacing properly', () => {
    const text = '  The   quick   brown  fox jumps   over the   lazy   dog.  ';
    const metrics = service.analyze(text);
    expect(metrics.words).toBe(9);
  });

  it('should calculate characters with and without spaces', () => {
    const text = 'Hello World!'; // 12 chars with space, 11 without
    const metrics = service.analyze(text);
    expect(metrics.charactersWithSpaces).toBe(12);
    expect(metrics.charactersWithoutSpaces).toBe(11);
  });

  it('should count multiple sentences accurately', () => {
    const text = 'First sentence. Second sentence! Is this the third sentence? Yes it is.';
    const metrics = service.analyze(text);
    expect(metrics.sentences).toBe(4);
  });

  it('should count paragraphs correctly across multiple linebreaks', () => {
    const text = 'Paragraph one.\n\n\nParagraph two.\n\nParagraph three.';
    const metrics = service.analyze(text);
    expect(metrics.paragraphs).toBe(3);
  });

  it('should estimate reading and speaking time', () => {
    // 300 words
    const threeHundredWords = Array(300).fill('word').join(' ');
    const metrics = service.analyze(threeHundredWords);
    expect(metrics.words).toBe(300);
    expect(metrics.readingTimeMinutes).toBe(2); // 300 / 200 = 1.5 -> ceil = 2
    expect(metrics.speakingTimeMinutes).toBe(3); // 300 / 130 = 2.3 -> ceil = 3
  });
});
