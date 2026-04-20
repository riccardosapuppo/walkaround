import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as i0 from "@angular/core";
const STORAGE_KEY = 'walkaround.player.progress';
export class PlayerService {
    constructor() {
        this.audio = new Audio();
        this.stateSubject = new BehaviorSubject({
            poiId: null,
            sourceUrl: null,
            isPlaying: false,
            currentTime: 0,
            duration: 0,
            previewMode: false,
            previewEnded: false
        });
        this.state$ = this.stateSubject.asObservable();
        this.bindAudioEvents();
    }
    loadTrack(poiId, sourceUrl, previewMode = false) {
        const state = this.stateSubject.value;
        const isNewTrack = state.poiId !== poiId || state.sourceUrl !== sourceUrl || state.previewMode !== previewMode;
        if (isNewTrack) {
            this.audio.pause();
            this.audio.src = sourceUrl;
            this.audio.load();
        }
        const saved = this.getProgress(poiId);
        this.stateSubject.next({
            poiId,
            sourceUrl,
            isPlaying: false,
            currentTime: saved?.currentTime || 0,
            duration: saved?.duration || 0,
            previewMode,
            previewEnded: false
        });
        this.audio.currentTime = previewMode ? 0 : saved?.currentTime || 0;
    }
    play() {
        return this.audio.play();
    }
    pause() {
        this.audio.pause();
    }
    togglePlayPause() {
        if (this.audio.paused) {
            void this.play();
            return;
        }
        this.pause();
    }
    seek(seconds) {
        const duration = Number.isFinite(this.audio.duration) ? this.audio.duration : 0;
        if (!duration) {
            return;
        }
        const state = this.stateSubject.value;
        const maxSeek = state.previewMode ? Math.min(duration, environment.previewSeconds) : duration;
        this.audio.currentTime = Math.min(Math.max(0, seconds), maxSeek);
    }
    skipBy(deltaSeconds) {
        this.seek(this.audio.currentTime + deltaSeconds);
    }
    getProgress(poiId) {
        const items = this.readProgressList();
        return items.find((item) => item.poiId === poiId) || null;
    }
    getLatestProgress() {
        const items = this.readProgressList();
        if (!items.length) {
            return null;
        }
        return [...items].sort((a, b) => b.updatedAt - a.updatedAt)[0];
    }
    bindAudioEvents() {
        this.audio.addEventListener('timeupdate', () => {
            const state = this.stateSubject.value;
            const duration = Number.isFinite(this.audio.duration) ? this.audio.duration : 0;
            let currentTime = this.audio.currentTime;
            let previewEnded = false;
            if (state.previewMode && currentTime >= environment.previewSeconds) {
                this.audio.pause();
                currentTime = environment.previewSeconds;
                this.audio.currentTime = currentTime;
                previewEnded = true;
            }
            const nextState = {
                ...state,
                isPlaying: !this.audio.paused,
                currentTime,
                duration,
                previewEnded
            };
            this.stateSubject.next(nextState);
            if (state.poiId && !state.previewMode) {
                this.saveProgress({
                    poiId: state.poiId,
                    currentTime,
                    duration,
                    updatedAt: Date.now()
                });
            }
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
            this.stateSubject.next({
                ...this.stateSubject.value,
                isPlaying: false
            });
        });
    }
    saveProgress(entry) {
        const existing = this.readProgressList().filter((item) => item.poiId !== entry.poiId);
        existing.push(entry);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    }
    readProgressList() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return [];
            }
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        }
        catch {
            return [];
        }
    }
    static { this.ɵfac = function PlayerService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PlayerService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: PlayerService, factory: PlayerService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PlayerService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], () => [], null); })();
