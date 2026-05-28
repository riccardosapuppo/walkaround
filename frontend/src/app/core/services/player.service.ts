import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PlayerProgress } from '../models/player-progress.model';

interface PlayerState {
  poiId: string | null;
  sourceUrl: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  previewMode: boolean;
  previewEnded: boolean;
}

const STORAGE_KEY = 'walkaround.player.progress';
const PREVIEW_LIMIT_EPSILON_SECONDS = 0.05;

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private readonly audio = new Audio();

  private readonly stateSubject = new BehaviorSubject<PlayerState>({
    poiId: null,
    sourceUrl: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    previewMode: false,
    previewEnded: false
  });

  readonly state$ = this.stateSubject.asObservable();

  constructor() {
    this.audio.preload = 'metadata';
    this.bindAudioEvents();
  }

  loadTrack(poiId: string, sourceUrl: string, previewMode = false): void {
    const state = this.stateSubject.value;
    const isNewTrack = state.poiId !== poiId || state.sourceUrl !== sourceUrl || state.previewMode !== previewMode;

    if (isNewTrack) {
      this.audio.pause();
      this.audio.src = sourceUrl;
      this.audio.load();
    }

    const saved = this.getProgress(poiId);
    const initialTime = previewMode ? 0 : saved?.currentTime || 0;

    this.stateSubject.next({
      poiId,
      sourceUrl,
      isPlaying: false,
      currentTime: initialTime,
      duration: previewMode ? 0 : saved?.duration || 0,
      previewMode,
      previewEnded: false
    });

    this.audio.currentTime = initialTime;
  }

  play(): Promise<void> {
    const state = this.stateSubject.value;
    if (state.previewMode && state.previewEnded) {
      this.audio.currentTime = 0;
      this.syncStateFromAudio({ resetPreviewEnded: true });
    }

    return this.audio.play();
  }

  pause(): void {
    this.audio.pause();
  }

  togglePlayPause(): void {
    if (this.audio.paused) {
      void this.play();
      return;
    }

    this.pause();
  }

  seek(seconds: number): void {
    const duration = Number.isFinite(this.audio.duration) ? this.audio.duration : 0;
    if (!duration) {
      return;
    }

    const state = this.stateSubject.value;
    const maxSeek = state.previewMode ? Math.min(duration, environment.previewSeconds) : duration;
    const targetTime = Math.min(Math.max(0, seconds), maxSeek);

    if (state.previewMode && this.isAtPreviewLimit(targetTime, duration)) {
      this.finishPreviewAt(duration);
      return;
    }

    this.audio.currentTime = targetTime;
    this.syncStateFromAudio({ resetPreviewEnded: state.previewMode });
  }

  skipBy(deltaSeconds: number): void {
    this.seek(this.audio.currentTime + deltaSeconds);
  }

  getProgress(poiId: string): PlayerProgress | null {
    const items = this.readProgressList();
    return items.find((item) => item.poiId === poiId) || null;
  }

  getLatestProgress(): PlayerProgress | null {
    const items = this.readProgressList();
    if (!items.length) {
      return null;
    }

    return [...items].sort((a, b) => b.updatedAt - a.updatedAt)[0];
  }

  private bindAudioEvents(): void {
    this.audio.addEventListener('timeupdate', () => {
      const state = this.stateSubject.value;
      if (state.previewMode && this.isAtPreviewLimit(this.audio.currentTime)) {
        this.finishPreviewAt();
        return;
      }

      this.syncStateFromAudio();
    });

    this.audio.addEventListener('play', () => {
      this.stateSubject.next({
        ...this.stateSubject.value,
        isPlaying: true
      });
    });

    this.audio.addEventListener('pause', () => {
      this.stateSubject.next({
        ...this.stateSubject.value,
        isPlaying: false
      });
    });

    this.audio.addEventListener('ended', () => {
      this.syncStateFromAudio({ forcePreviewEnded: this.stateSubject.value.previewMode });
    });

    this.audio.addEventListener('loadedmetadata', () => this.syncStateFromAudio());
    this.audio.addEventListener('durationchange', () => this.syncStateFromAudio());
    this.audio.addEventListener('seeked', () => {
      const state = this.stateSubject.value;
      if (state.previewMode && this.isAtPreviewLimit(this.audio.currentTime)) {
        this.finishPreviewAt();
        return;
      }

      this.syncStateFromAudio({ resetPreviewEnded: state.previewMode });
    });
  }

  private syncStateFromAudio(options: { forcePreviewEnded?: boolean; resetPreviewEnded?: boolean } = {}): void {
    const state = this.stateSubject.value;
    const duration = this.audioDuration();
    const currentTime = this.audio.currentTime;
    const previewEnded = state.previewMode
      ? Boolean(options.forcePreviewEnded || this.isAtPreviewLimit(currentTime, duration)) && !options.resetPreviewEnded
      : false;

    this.stateSubject.next({
      ...state,
      isPlaying: !this.audio.paused,
      currentTime,
      duration,
      previewEnded
    });

    if (state.poiId && !state.previewMode) {
      this.saveProgress({
        poiId: state.poiId,
        currentTime,
        duration,
        updatedAt: Date.now()
      });
    }
  }

  private finishPreviewAt(duration = this.audioDuration()): void {
    const previewLimit = this.previewLimit(duration);
    const targetTime = previewLimit;

    if (!this.audio.paused) {
      this.audio.pause();
    }

    if (this.audio.currentTime !== targetTime) {
      this.audio.currentTime = targetTime;
    }

    this.syncStateFromAudio({ forcePreviewEnded: true });
  }

  private isAtPreviewLimit(currentTime: number, duration = this.audioDuration()): boolean {
    return currentTime >= this.previewLimit(duration) - PREVIEW_LIMIT_EPSILON_SECONDS;
  }

  private previewLimit(duration = this.audioDuration()): number {
    return Number.isFinite(duration) && duration > 0 ? Math.min(duration, environment.previewSeconds) : environment.previewSeconds;
  }

  private audioDuration(): number {
    return Number.isFinite(this.audio.duration) ? this.audio.duration : 0;
  }

  private saveProgress(entry: PlayerProgress): void {
    const existing = this.readProgressList().filter((item) => item.poiId !== entry.poiId);
    existing.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  }

  private readProgressList(): PlayerProgress[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as PlayerProgress[]) : [];
    } catch {
      return [];
    }
  }
}

