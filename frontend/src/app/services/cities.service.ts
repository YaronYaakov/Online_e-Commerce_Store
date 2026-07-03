import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { City } from '../models/City';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {
  private readonly http = inject(HttpClient);
  private readonly domain = 'http://localhost:3000';

  public readonly cities = signal<City[]>([]);

  public getAllCities(): Observable<City[]> {
    return this.http.get<City[]>(`${this.domain}/cities`).pipe(
      tap(citiesData => this.cities.set(citiesData))
    );
  }
}