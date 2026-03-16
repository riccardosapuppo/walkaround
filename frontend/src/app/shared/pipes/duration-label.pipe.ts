import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: false,
  name: 'durationLabel'
})
export class DurationLabelPipe implements PipeTransform {
  transform(totalSeconds: number): string {
    if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
      return '0:00';
    }

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60)
      .toString()
      .padStart(2, '0');

    return `${minutes}:${seconds}`;
  }
}

