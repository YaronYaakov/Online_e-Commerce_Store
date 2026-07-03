import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CartItem } from '../models/CartItem';

@Injectable({
  providedIn: 'root'
})
export class CartItemsService {
  private readonly http = inject(HttpClient);
  private readonly domain = 'http://localhost:3000';

  public readonly cartItems = signal<CartItem[]>([]);

  public readonly sum = computed(() => {
    return this.cartItems().reduce((acc, item) => acc + Number(item.total_price || 0), 0);
  });

  constructor() {
    effect(() => {
      this.updateUserDataTotalPrice(this.sum());
    });
  }

  // get user's products 
  public getMyCartItems(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.domain}/cartItems/me`).pipe(
      tap(items => this.cartItems.set(items))
    );
  }

  // Add an item to cart
  public addCartItem(cartItem: CartItem): Observable<void> {
    return this.http.post<void>(`${this.domain}/cartItems`, cartItem);
  }

  // delete all items in cart
  public deleteAllCartItems(): Observable<void> {
    return this.http.delete<void>(`${this.domain}/cartItems/allItems`).pipe(
      tap(() => this.cartItems.set([])) 
    );
  }

  // delete an item in cart
  public deleteCartItem(product_id: number): Observable<void> {
    return this.http.delete<void>(`${this.domain}/cartItems?product_id=${product_id}`).pipe(
      tap(() => {
        this.cartItems.update(items => items.filter(item => item.product_id !== product_id));
      })
    );
  }

  private updateUserDataTotalPrice(currentSum: number): void {
    const userDataString = sessionStorage.getItem("storedUserData");
    if (!userDataString) return;

    try {
      const userData = JSON.parse(userDataString);
      userData.total_price = currentSum.toFixed(2);
      sessionStorage.setItem("storedUserData", JSON.stringify(userData));
    } catch (e) {
      console.error("Error updating user data in storage", e);
    }
  }
}