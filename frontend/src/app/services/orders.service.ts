import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CaughtOrder } from '../models/CaughtOrder';
import { Order } from '../models/Order';
import { SuccessfulAddedOrderResponse } from '../models/SuccessfulAddedOrderResponse';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly domain = 'http://localhost:3000';

   public readonly isCheckSearchShown = signal<boolean>(false);
  public readonly caughtOrders = signal<CaughtOrder[]>([]);
  public readonly isCartChecked = signal<boolean>(false);

  public getCaughtShipDates(): Observable<CaughtOrder[]> {
    return this.http.get<CaughtOrder[]>(`${this.domain}/orders/caughtShipDates`).pipe(
      tap(orders => this.caughtOrders.set(orders))
    );
  }


  public createOrder(order: Order): Observable<SuccessfulAddedOrderResponse> {
    return this.http.post<SuccessfulAddedOrderResponse>(`${this.domain}/orders`, order);
  }
}