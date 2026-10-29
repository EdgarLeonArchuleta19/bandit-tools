import { Injectable } from '@angular/core';
import * as QRCode from 'qrcode';

export type QrErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface QrOptions {
  width: number;
  margin: number;
  darkColor: string;
  lightColor: string;
  errorCorrectionLevel: QrErrorCorrectionLevel;
}

@Injectable({
  providedIn: 'root',
})
export class QrGeneratorService {
  async generateDataUrl(text: string, options: QrOptions): Promise<string> {
    const trimmed = text.trim();
    if (!trimmed) {
      throw new Error('Input data cannot be empty');
    }

    return await QRCode.toDataURL(trimmed, {
      width: options.width,
      margin: options.margin,
      color: {
        dark: options.darkColor,
        light: options.lightColor,
      },
      errorCorrectionLevel: options.errorCorrectionLevel,
    });
  }

  async generateSvg(text: string, options: QrOptions): Promise<string> {
    const trimmed = text.trim();
    if (!trimmed) {
      throw new Error('Input data cannot be empty');
    }

    return await QRCode.toString(trimmed, {
      type: 'svg',
      width: options.width,
      margin: options.margin,
      color: {
        dark: options.darkColor,
        light: options.lightColor,
      },
      errorCorrectionLevel: options.errorCorrectionLevel,
    });
  }

  formatWifiString(ssid: string, pass: string, type: 'WPA' | 'WEP' | 'nopass' = 'WPA'): string {
    return `WIFI:T:${type};S:${ssid};P:${pass};;`;
  }
}
