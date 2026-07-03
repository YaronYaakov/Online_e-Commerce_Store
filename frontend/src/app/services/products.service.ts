import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Product } from '../models/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly domain = 'http://localhost:3000';

  public readonly products = signal<Product[]>([]);
  public readonly product = signal<Product>(new Product());
  public readonly state = signal<string>("adding");

  public getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.domain}/products`).pipe(
      tap(productsData => this.products.set(productsData))
    );
  }

  public updateProduct(productData: Product): Observable<void> {
    return this.http.put<void>(`${this.domain}/products`, productData);
  }

  public addProduct(productData: Product): Observable<Product[]> {
    return this.http.post<Product[]>(`${this.domain}/products`, productData).pipe(
      tap(updatedProducts => this.products.set(updatedProducts))
    );
  }

  public uploadImage(formData: FormData): Observable<HttpEvent<any>> {
    return this.http.post<any>(
      `${this.domain}/products/uploadImageFile`,
      formData,
      {
        reportProgress: true,
        observe: "events",
      }
    );
  }
}