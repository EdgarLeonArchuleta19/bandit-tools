import { Injectable } from '@angular/core';

export interface VideoStreamOption {
  quality: string;
  format: string;
  url: string;
  sizeBytes?: number;
  isAudioOnly?: boolean;
}

export interface YouTubeVideoInfo {
  videoId: string;
  title: string;
  author: string;
  durationSeconds: number;
  thumbnailUrl: string;
  audioStreams: VideoStreamOption[];
  videoStreams: VideoStreamOption[];
}

@Injectable({
  providedIn: 'root',
})
export class YoutubeDownloaderService {
  // Public CORS-enabled Invidious instances used for redundant stream extraction
  private readonly instances = [
    'https://yt.chocolatemoo53.com',
    'https://invidious.nerdvpn.de',
    'https://inv.nadeko.net',
  ];

  /**
   * Validates and parses a YouTube URL, returning the 11-character video ID.
   */
  extractVideoId(url: string): string | null {
    if (!url || typeof url !== 'string') return null;
    const cleanUrl = url.trim();

    // Standard watch URL: youtube.com/watch?v=ID
    const standardMatch = cleanUrl.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/i);
    if (standardMatch) return standardMatch[1];

    // Shortened URL: youtu.be/ID
    const shortMatch = cleanUrl.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
    if (shortMatch) return shortMatch[1];

    // Shorts URL: youtube.com/shorts/ID
    const shortsMatch = cleanUrl.match(/(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/i);
    if (shortsMatch) return shortsMatch[1];

    // Embed URL: youtube.com/embed/ID
    const embedMatch = cleanUrl.match(/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/i);
    if (embedMatch) return embedMatch[1];

    // Plain ID: exactly 11 chars
    if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
      return cleanUrl;
    }

    return null;
  }

  /**
   * Fetches video info and available stream URLs using open API instances with automatic fallback.
   */
  async getVideoInfo(videoId: string): Promise<YouTubeVideoInfo> {
    let lastError: Error | null = null;

    for (const instance of this.instances) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000);

        const response = await fetch(`${instance}/api/v1/videos/${videoId}`, {
          signal: controller.signal,
          headers: {
            Accept: 'application/json',
          },
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Instance responded with HTTP ${response.status}`);
        }

        const data = await response.json();
        return this.mapInvidiousData(videoId, data);
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        // Continue to fallback instance
      }
    }

    throw new Error(
      lastError?.message ||
        'No se pudo conectar a los servidores de extracción. Verifica el enlace o inténtalo en unos segundos.'
    );
  }

  private mapInvidiousData(
    videoId: string,
    data: {
      title?: string;
      author?: string;
      lengthSeconds?: number;
      formatStreams?: Array<{ qualityLabel?: string; container?: string; url?: string; size?: string }>;
      adaptiveFormats?: Array<{
        type?: string;
        audioQuality?: string;
        container?: string;
        encoding?: string;
        url?: string;
        clen?: string;
      }>;
    }
  ): YouTubeVideoInfo {
    const audioStreams: VideoStreamOption[] = [];
    const videoStreams: VideoStreamOption[] = [];

    // Map combined video streams (MP4 720p, 360p, etc.)
    if (Array.isArray(data.formatStreams)) {
      for (const s of data.formatStreams) {
        if (s.url) {
          videoStreams.push({
            quality: s.qualityLabel || 'Standard',
            format: s.container?.toUpperCase() || 'MP4',
            url: s.url,
            isAudioOnly: false,
          });
        }
      }
    }

    // Map adaptive audio streams (m4a / opus)
    if (Array.isArray(data.adaptiveFormats)) {
      for (const a of data.adaptiveFormats) {
        if (a.url && a.type?.startsWith('audio')) {
          const isM4a = a.container === 'm4a' || a.encoding === 'aac';
          audioStreams.push({
            quality: a.audioQuality ? a.audioQuality.replace('AUDIO_QUALITY_', '') : 'High',
            format: isM4a ? 'M4A / MP3' : (a.container?.toUpperCase() || 'AUDIO'),
            url: a.url,
            sizeBytes: a.clen ? parseInt(a.clen, 10) : undefined,
            isAudioOnly: true,
          });
        }
      }
    }

    // High quality YouTube thumbnail fallback
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    return {
      videoId,
      title: data.title || 'Video de YouTube',
      author: data.author || 'Canal de YouTube',
      durationSeconds: data.lengthSeconds || 0,
      thumbnailUrl,
      audioStreams,
      videoStreams,
    };
  }
}
