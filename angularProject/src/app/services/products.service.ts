import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/Product';

@Injectable({
  providedIn: 'root'
})

// A Singleton class (Design Pattern)
export class ProductsService {
  //Declaration of class variables
  private domain: string;
  public products: Product[]
  public product: Product;
  public state: string;

  //Initialization of class variables and injection of services
  constructor(private http: HttpClient) {
    this.domain = 'http://localhost:3000';
    this.products = []
    this.product = new Product()
    this.state = "adding";
  }


  // get all products 
  public getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.domain}/products/all`);
  }

  //update a product
  public updateProduct(product: Product): Observable<void> {
    return this.http.put<void>(`${this.domain}/products`, product);
  }

  //add new product
  public addProduct(product: Product): Observable<Product[]> {
    return this.http.post<Product[]>(`${this.domain}/products`, product);
  }


  // upload an image of product
  public uploadImage(formData: any) {
    console.log(formData);
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
