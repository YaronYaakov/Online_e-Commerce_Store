import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Statistics } from '../models/Statistics';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private readonly http = inject(HttpClient);
  private readonly domain = 'http://localhost:3000';

  public readonly statistics = signal<Statistics | null>(null);

  public getStatistics(): Observable<Statistics> {
    return this.http.get<Statistics>(`${this.domain}/statistics`).pipe(
      tap(statisticsData => this.statistics.set(statisticsData))
    );
  }
}