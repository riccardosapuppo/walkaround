import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { forkJoin, Subject, switchMap, takeUntil } from 'rxjs';
import { City } from '../../core/models/city.model';
import { Poi } from '../../core/models/poi.model';
import { OfflineService } from '../../core/services/offline.service';
import { PoiService } from '../../core/services/poi.service';
import { PurchaseService } from '../../core/services/purchase.service';

interface AudioItem extends Poi {
  offline: boolean;
}

@Component({
  standalone: false,
  selector: 'app-my-audio',
  templateUrl: './my-audio.component.html',
  styleUrls: ['./my-audio.component.scss']
})
export class MyAudioComponent implements OnInit, OnDestroy {
  audioItems: AudioItem[] = [];
  offlineMinutes = 0;
  loading = true;

  private allPois: Poi[] = [];
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly poiService: PoiService,
    private readonly purchaseService: PurchaseService,
    private readonly offlineService: OfflineService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.purchaseService.refresh();

    this.poiService
      .getCities()
      .pipe(
        switchMap((cities: City[]) => forkJoin(cities.map((city) => this.poiService.getPoisByCity(city.id)))),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: async (allGroups) => {
          this.allPois = allGroups.flat();
          await this.rebuildList();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });

    this.purchaseService.purchases$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      void this.rebuildList();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async downloadAll(): Promise<void> {
    const toCache = this.audioItems.map((item) => ({
      poiId: item.id,
      urls: [item.audioUrl, item.imageUrl]
    }));

    await this.offlineService.cacheBatch(toCache);
    await this.rebuildList();
    this.snackBar.open('Download offline completato', 'OK', { duration: 2400 });
  }

  play(poiId: string): void {
    void this.router.navigate(['/player', poiId], {
      queryParams: { preview: false }
    });
  }

  private async rebuildList(): Promise<void> {
    if (!this.allPois.length) {
      this.audioItems = [];
      return;
    }

    const offlineIds = await this.offlineService.getOfflinePoiIds();

    const unlocked = this.allPois.filter((poi) => this.purchaseService.isPoiUnlocked(poi.id, poi.cityId));

    this.audioItems = unlocked
      .map((poi) => ({
        ...poi,
        offline: offlineIds.includes(poi.id)
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    this.offlineMinutes = Math.round(
      this.audioItems
        .filter((item) => item.offline)
        .reduce((acc, item) => acc + item.durationSec, 0) / 60
    );
  }
}

