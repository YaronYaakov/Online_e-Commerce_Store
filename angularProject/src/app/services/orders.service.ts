import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CaughtOrder } from '../models/CaughtOrder';
import { Order } from '../models/Order';
import { Check } from '../models/Check';
import { SuccessfulAddedOrderResponse } from '../models/SuccessfulAddedOrderResponse';

@Injectable({
  providedIn: 'root'
})

// A Singleton class (Design Pattern)
export class OrdersService {
  //Declaration of class variables
  private domain: string;
  public isCheckSearchShown: boolean;
  public caughtOrders: CaughtOrder[];
  public isCartChecked: boolean;

  //Initialization of class variables and injection of services
  constructor(private http: HttpClient) {
    this.domain = 'http://localhost:3000';
    this.isCheckSearchShown = false;
    this.caughtOrders = [];
    this.isCartChecked = false;
  }

  //get all caught ship dates
  public getCaughtShipDates(): Observable<CaughtOrder[]> {

    return this.http.get<CaughtOrder[]>(`${this.domain}/orders/caughtShipDates`);
  }


  //create a new order
  public createOrder(order: Order): Observable<SuccessfulAddedOrderResponse> {

    return this.http.post<SuccessfulAddedOrderResponse>(`${this.domain}/orders`, order);
  }
}
