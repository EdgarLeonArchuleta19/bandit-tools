import { Injectable } from '@angular/core';

export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeAmbiguous: boolean;
}

export interface PasswordStrength {
  score: number; // 0 to 4
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
  color: string;
  entropyBits: number;
}

@Injectable({
  providedIn: 'root',
})
export class PasswordGeneratorService {
  private readonly UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private readonly LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
  private readonly NUMBERS = '0123456789';
  private readonly SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  // Ambiguous characters: 1, l, I, 0, O, o, `, '
  private readonly AMBIGUOUS = '1lI0Oo`\'"|';

  generate(options: PasswordOptions): string {
    let charPool = '';

    if (options.includeUppercase) charPool += this.UPPERCASE;
    if (options.includeLowercase) charPool += this.LOWERCASE;
    if (options.includeNumbers) charPool += this.NUMBERS;
    if (options.includeSymbols) charPool += this.SYMBOLS;

    if (options.excludeAmbiguous) {
      charPool = charPool
        .split('')
        .filter((c) => !this.AMBIGUOUS.includes(c))
        .join('');
    }

    if (!charPool || options.length <= 0) {
      return '';
    }

    const length = Math.max(4, Math.min(128, options.length));
    const randomBuffer = new Uint32Array(length);
    crypto.getRandomValues(randomBuffer);

    let password = '';
    const poolLength = charPool.length;

    for (let i = 0; i < length; i++) {
      password += charPool[randomBuffer[i] % poolLength];
    }

    return password;
  }

  calculateStrength(password: string): PasswordStrength {
    if (!password) {
      return { score: 0, label: 'Very Weak', color: '#F87171', entropyBits: 0 };
    }

    let poolSize = 0;
    if (/[a-z]/.test(password)) poolSize += 26;
    if (/[A-Z]/.test(password)) poolSize += 26;
    if (/[0-9]/.test(password)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;

    if (poolSize === 0) poolSize = 1;

    // Shannon entropy: length * log2(poolSize)
    const entropyBits = Math.round(password.length * Math.log2(poolSize));

    let score = 0;
    let label: PasswordStrength['label'] = 'Very Weak';
    let color = '#F87171';

    if (entropyBits < 32) {
      score = 0;
      label = 'Very Weak';
      color = '#F87171';
    } else if (entropyBits < 48) {
      score = 1;
      label = 'Weak';
      color = '#FB923C';
    } else if (entropyBits < 64) {
      score = 2;
      label = 'Fair';
      color = '#FBBF24';
    } else if (entropyBits < 80) {
      score = 3;
      label = 'Strong';
      color = '#A3E635';
    } else {
      score = 4;
      label = 'Very Strong';
      color = '#4ADE80';
    }

    return {
      score,
      label,
      color,
      entropyBits,
    };
  }
}
