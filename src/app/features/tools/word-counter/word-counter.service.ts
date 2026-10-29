import { Injectable } from '@angular/core';

export interface TextMetrics {
  words: number;
  charactersWithSpaces: number;
  charactersWithoutSpaces: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
}

@Injectable({
  providedIn: 'root',
})
export class WordCounterService {
  analyze(text: string): TextMetrics {
    if (!text || text.trim().length === 0) {
      return {
        words: 0,
        charactersWithSpaces: 0,
        charactersWithoutSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        lines: 0,
        readingTimeMinutes: 0,
        speakingTimeMinutes: 0,
      };
    }

    const charactersWithSpaces = text.length;
    const charactersWithoutSpaces = text.replace(/\s/g, '').length;

    // Words: split by one or more whitespace characters
    const wordsArray = text
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0);
    const words = wordsArray.length;

    // Paragraphs: split by double line breaks or non-empty trimmed lines
    const paragraphs = text
      .split(/\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0).length;

    // Lines
    const lines = text.split('\n').length;

    // Sentences: match ending punctuation (. ! ?) followed by whitespace or end of string
    const sentenceMatches = text
      .trim()
      .split(/[.!?]+(\s+|$)/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !/^\s*$/.test(s));
    const sentences = Math.max(1, sentenceMatches.length);

    // Reading time: standard adult reading speed ~200-225 words per min
    const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

    // Speaking time: standard speaking speed ~130 words per min
    const speakingTimeMinutes = Math.max(1, Math.ceil(words / 130));

    return {
      words,
      charactersWithSpaces,
      charactersWithoutSpaces,
      sentences: words === 0 ? 0 : sentences,
      paragraphs,
      lines,
      readingTimeMinutes: words === 0 ? 0 : readingTimeMinutes,
      speakingTimeMinutes: words === 0 ? 0 : speakingTimeMinutes,
    };
  }

  getSampleText(): string {
    return `Bandit Tools is designed for builders, creators, and engineers who value fast, privacy-focused online utilities.

All processing occurs directly in your local browser runtime. This means your data is never uploaded to distant servers, logged in databases, or analyzed for advertising.

With instant feedback and a clean dark interface, Bandit Tools delivers everything you need and nothing you don't. Enjoy the speed and simplicity of modern web utilities!`;
  }
}
