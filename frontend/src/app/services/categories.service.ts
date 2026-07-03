import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Category } from '../models/Category';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private readonly http = inject(HttpClient);
  private readonly domain = 'http://localhost:3000';

  public readonly categories = signal<Category[]>([]);

  public getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.domain}/categories`).pipe(
      tap(categoriesData => this.categories.set(categoriesData))
    );
  }
}