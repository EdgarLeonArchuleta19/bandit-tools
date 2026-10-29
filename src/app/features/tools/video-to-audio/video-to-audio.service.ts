import { Injectable } from '@angular/core';

export interface ExtractedAudioResult {
  blob: Blob;
  url: string;
  duration: number;
  sampleRate: number;
  channels: number;
  fileName: string;
  sizeBytes: number;
}

export interface ExtractionProgress {
  stage: 'reading' | 'decoding' | 'encoding' | 'ready' | 'error';
  percent: number;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class VideoToAudioService {
  private activeUrls = new Set<string>();

  /**
   * Decodes audio from any video container (MP4, WebM, MOV, MKV, AVI)
   * entirely inside the browser using Web Audio API and encodes to 16-bit PCM WAV.
   */
  async extractAudioFromVideo(
    file: File,
    onProgress?: (progress: ExtractionProgress) => void
  ): Promise<ExtractedAudioResult> {
    onProgress?.({
      stage: 'reading',
      percent: 15,
      message: 'Leyendo archivo de video...',
    });

    const arrayBuffer = await file.arrayBuffer();

    onProgress?.({
      stage: 'decoding',
      percent: 40,
      message: 'Decodificando pista de audio...',
    });

    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) {
      throw new Error('Tu navegador no soporta Web Audio API para procesar audio local.');
    }

    const audioCtx = new AudioContextClass();
    let audioBuffer: AudioBuffer;

    try {
      // Decode the raw video audio track into native PCM AudioBuffer
      audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    } catch {
      await audioCtx.close();
      throw new Error(
        'No se pudo extraer la pista de audio. Asegúrate de que el video contenga un flujo de sonido válido.'
      );
    } finally {
      await audioCtx.close();
    }

    onProgress?.({
      stage: 'encoding',
      percent: 75,
      message: 'Generando archivo de audio de alta fidelidad...',
    });

    const wavBlob = this.audioBufferToWavBlob(audioBuffer);
    const url = URL.createObjectURL(wavBlob);
    this.activeUrls.add(url);

    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const outputFileName = `${baseName}.wav`;

    onProgress?.({
      stage: 'ready',
      percent: 100,
      message: 'Audio extraído con éxito.',
    });

    return {
      blob: wavBlob,
      url,
      duration: audioBuffer.duration,
      sampleRate: audioBuffer.sampleRate,
      channels: audioBuffer.numberOfChannels,
      fileName: outputFileName,
      sizeBytes: wavBlob.size,
    };
  }

  /**
   * Encodes an AudioBuffer into uncompressed, standard 16-bit Linear PCM WAV.
   */
  audioBufferToWavBlob(buffer: AudioBuffer): Blob {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;

    const numSamples = buffer.length;
    const dataByteLength = numSamples * blockAlign;
    const headerByteLength = 44;
    const totalByteLength = headerByteLength + dataByteLength;

    const arrayBuffer = new ArrayBuffer(totalByteLength);
    const view = new DataView(arrayBuffer);

    // 1. RIFF Chunk Descriptor
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataByteLength, true); // ChunkSize
    this.writeString(view, 8, 'WAVE');

    // 2. "fmt " Subchunk
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
    view.setUint16(20, format, true); // AudioFormat (1 for PCM)
    view.setUint16(22, numChannels, true); // NumChannels
    view.setUint32(24, sampleRate, true); // SampleRate
    view.setUint32(28, sampleRate * blockAlign, true); // ByteRate
    view.setUint16(32, blockAlign, true); // BlockAlign
    view.setUint16(34, bitDepth, true); // BitsPerSample

    // 3. "data" Subchunk
    this.writeString(view, 36, 'data');
    view.setUint32(40, dataByteLength, true); // Subchunk2Size

    // Write interleaved samples
    const channelsData: Float32Array[] = [];
    for (let c = 0; c < numChannels; c++) {
      channelsData.push(buffer.getChannelData(c));
    }

    let offset = 44;
    for (let i = 0; i < numSamples; i++) {
      for (let c = 0; c < numChannels; c++) {
        // Clamp sample to [-1, 1]
        let sample = channelsData[c][i];
        sample = Math.max(-1, Math.min(1, sample));
        // Scale to 16-bit signed integer range [-32768, 32767]
        const intSample = sample < 0 ? sample * 32768 : sample * 32767;
        view.setInt16(offset, Math.floor(intSample), true);
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }

  revokeUrl(url: string): void {
    if (this.activeUrls.has(url)) {
      if (typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
        try {
          URL.revokeObjectURL(url);
        } catch {}
      }
      this.activeUrls.delete(url);
    }
  }

  revokeAll(): void {
    this.activeUrls.forEach((url) => {
      if (typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
        try {
          URL.revokeObjectURL(url);
        } catch {}
      }
    });
    this.activeUrls.clear();
  }

  private writeString(view: DataView, offset: number, string: string): void {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
}
