import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from '../models/CartItem';

@Injectable({
  providedIn: 'root'
})

// A Singleton class (Design Pattern)
export class CartItemsService {
  //Declaration of class variables
  private domain: string;
  public cartItems: CartItem[];
  public sum: number;

  //Initialization of class variables and injection of services
  constructor(private http: HttpClient) {
    this.domain = 'http://localhost:3000';
    this.cartItems = [];
    this.sum = 0;
  }

  //get user's products 
  public getMyProducts(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.domain}/cartItems/me`);
  }

  //Add an item to cart
  public addCartItem(cartItem: CartItem): Observable<void> {
    return this.http.post<void>(`${this.domain}/cartItems`, cartItem);
  }

  //delete all items in cart
  public deleteAllCartItems(): Observable<void> {
    return this.http.delete<void>(`${this.domain}/cartItems/allItems`);
  }


  //delete an item in cart
  public deleteCartItem(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.domain}/cartItems?productId=${productId}`);
  }

  //sum all the prices of cart items
  public sumCartItems(): void {
    this.sum = 0;
    for (let cartItem of this.cartItems) {
      this.sum += +cartItem.total_price
    }
  }

  //update user's total price in session storage
  public updateUserDataTotalPrice(): void {
    let userData = JSON.parse(sessionStorage.getItem("storedUserData"));
    userData.totalPrice = this.sum.toFixed(2);
    sessionStorage.setItem("storedUserData", JSON.stringify(userData));
  }
}