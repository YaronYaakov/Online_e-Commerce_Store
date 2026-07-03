import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SuccessfulAddedCartDetails } from '../models/SuccessfulAddedCartDetails';
import { CartItemsService } from './cartItems.service';

@Injectable({
  providedIn: 'root'
})

// A Singleton class (Design Pattern)
export class ShoppingCartService {
  //Declaration of class variables
  private domain: string;
  public isAllDeleteShown: boolean;
  public isShown: boolean
  public isCustomer: boolean;
  public productName: string;
  public isCartEmpty: boolean;

  //Initialization of class variables and injection of services
  constructor(private http: HttpClient, private cartItemsService: CartItemsService) {
    this.domain = 'http://localhost:3000';
    this.isShown = true;
    this.isCustomer = false;
    this.productName = "";
    this.isCartEmpty = true;

  }

  //create a new cart
  public createShoppingCart(): Observable<SuccessfulAddedCartDetails> {

    return this.http.post<SuccessfulAddedCartDetails>(`${this.domain}/shoppingCarts`, null);
  }


  //change status of isCartEmpty 
  public setIsCartEmpty(): void {

    if (this.cartItemsService.sum == 0) {
      this.isCartEmpty = true;
    }
    else {
      this.isCartEmpty = false;
    }
  }
}