import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SuccessfulAddedCartDetails } from '../models/SuccessfulAddedCartDetails';
import { CartItemsService } from './cartItems.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private readonly http = inject(HttpClient);
  private readonly cartItemsService = inject(CartItemsService);
  private readonly domain = 'http://localhost:3000';

  public readonly cartId = signal<number>(0);
  public readonly isAllDeleteShown = signal<boolean>(false);
  public readonly isShown = signal<boolean>(true);
  public readonly isCustomer = signal<boolean>(false);
  public readonly productName = signal<string>("");



  public readonly isCartEmpty = computed(() => {
    return this.cartItemsService.sum() === 0;
  });

  public createShoppingCart(): Observable<SuccessfulAddedCartDetails> {
    return this.http.post<SuccessfulAddedCartDetails>(`${this.domain}/shoppingCarts`, null).pipe(
      tap((response: any) => {
        const id = response.cartId || response.insertId;
        this.cartId.set(id);
        console.log('Cart ID updated in signal:', id);
      })
    );
  }
}