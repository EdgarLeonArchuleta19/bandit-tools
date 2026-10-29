import { Injectable } from '@angular/core';

export interface JsonStats {
  sizeBytes: number;
  linesCount: number;
  charCount: number;
  keysCount?: number;
}

export interface JsonValidationResult {
  isValid: boolean;
  error?: {
    message: string;
    line?: number;
    column?: number;
  };
  parsed?: any;
}

@Injectable({
  providedIn: 'root',
})
export class JsonFormatterService {
  validate(rawJson: string): JsonValidationResult {
    const trimmed = rawJson.trim();
    if (!trimmed) {
      return { isValid: false, error: { message: 'Input is empty. Please enter JSON.' } };
    }

    try {
      const parsed = JSON.parse(trimmed);
      return { isValid: true, parsed };
    } catch (err: any) {
      const message = err instanceof Error ? err.message : String(err);
      const position = this.extractLineAndColumn(rawJson, message);
      return {
        isValid: false,
        error: {
          message,
          line: position?.line,
          column: position?.column,
        },
      };
    }
  }

  format(
    rawJson: string,
    indentType: '2' | '4' | 'tab' = '2'
  ): { formatted: string; stats: JsonStats } {
    const validation = this.validate(rawJson);
    if (!validation.isValid || validation.parsed === undefined) {
      throw new Error(validation.error?.message || 'Invalid JSON syntax');
    }

    const space = indentType === 'tab' ? '\t' : indentType === '4' ? 4 : 2;
    const formatted = JSON.stringify(validation.parsed, null, space);
    const keysCount = this.countKeys(validation.parsed);

    return {
      formatted,
      stats: {
        sizeBytes: new Blob([formatted]).size,
        linesCount: formatted.split('\n').length,
        charCount: formatted.length,
        keysCount,
      },
    };
  }

  minify(rawJson: string): { minified: string; stats: JsonStats } {
    const validation = this.validate(rawJson);
    if (!validation.isValid || validation.parsed === undefined) {
      throw new Error(validation.error?.message || 'Invalid JSON syntax');
    }

    const minified = JSON.stringify(validation.parsed);
    const keysCount = this.countKeys(validation.parsed);

    return {
      minified,
      stats: {
        sizeBytes: new Blob([minified]).size,
        linesCount: 1,
        charCount: minified.length,
        keysCount,
      },
    };
  }

  countKeys(obj: any): number {
    if (!obj || typeof obj !== 'object') return 0;
    let count = 0;
    if (Array.isArray(obj)) {
      for (const item of obj) {
        count += this.countKeys(item);
      }
    } else {
      const keys = Object.keys(obj);
      count += keys.length;
      for (const key of keys) {
        count += this.countKeys(obj[key]);
      }
    }
    return count;
  }

  private extractLineAndColumn(
    text: string,
    errorMessage: string
  ): { line: number; column: number } | null {
    // Look for "at line X column Y" or "position X"
    const lineColMatch = errorMessage.match(/line (\d+) column (\d+)/i);
    if (lineColMatch) {
      return {
        line: parseInt(lineColMatch[1], 10),
        column: parseInt(lineColMatch[2], 10),
      };
    }

    const posMatch = errorMessage.match(/position (\d+)/i);
    if (posMatch) {
      const pos = parseInt(posMatch[1], 10);
      const textUpToPos = text.slice(0, pos);
      const lines = textUpToPos.split('\n');
      return {
        line: lines.length,
        column: lines[lines.length - 1].length + 1,
      };
    }

    return null;
  }

  getSampleJson(): string {
    return JSON.stringify(
      {
        product: 'Bandit Tools',
        tagline: 'Useful tools. Zero hassle.',
        features: [
          'Client-side privacy',
          'Fast execution',
          'Zero account required',
          'Clean dark UI',
        ],
        stats: {
          toolsCount: 6,
          offlineCapable: true,
          securityRating: 'A+',
        },
        author: {
          name: 'Bandit Open Source',
          license: 'MIT',
        },
      },
      null,
      2
    );
  }
}
