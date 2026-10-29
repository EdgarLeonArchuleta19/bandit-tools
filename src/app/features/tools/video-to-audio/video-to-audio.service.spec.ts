import { TestBed } from '@angular/core/testing';
import { VideoToAudioService } from './video-to-audio.service';

describe('VideoToAudioService', () => {
  let service: VideoToAudioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VideoToAudioService],
    });
    service = TestBed.inject(VideoToAudioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should encode mock AudioBuffer into valid RIFF WAV Blob', async () => {
    // Create a mock AudioBuffer
    const sampleRate = 44100;
    const numChannels = 2;
    const length = 1000;

    const mockBuffer = {
      sampleRate,
      numberOfChannels: numChannels,
      length,
      duration: length / sampleRate,
      getChannelData: (channel: number) => {
        const data = new Float32Array(length);
        for (let i = 0; i < length; i++) {
          data[i] = Math.sin((i / 10) * (channel + 1));
        }
        return data;
      },
    } as unknown as AudioBuffer;

    const wavBlob = service.audioBufferToWavBlob(mockBuffer);
    expect(wavBlob).toBeTruthy();
    expect(wavBlob.type).toBe('audio/wav');

    // Expected size: 44 bytes header + (1000 samples * 2 channels * 2 bytes/sample) = 4044 bytes
    expect(wavBlob.size).toBe(44 + 1000 * 2 * 2);

    const buffer = await wavBlob.arrayBuffer();
    const view = new DataView(buffer);

    // Verify RIFF header
    const riff = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));
    const wave = String.fromCharCode(view.getUint8(8), view.getUint8(9), view.getUint8(10), view.getUint8(11));
    expect(riff).toBe('RIFF');
    expect(wave).toBe('WAVE');

    // Verify channels and sample rate
    expect(view.getUint16(22, true)).toBe(numChannels);
    expect(view.getUint32(24, true)).toBe(sampleRate);
  });

  it('should handle URL revocation gracefully without throwing', () => {
    expect(() => service.revokeUrl('blob:mock')).not.toThrow();
    expect(() => service.revokeAll()).not.toThrow();
  });
});
