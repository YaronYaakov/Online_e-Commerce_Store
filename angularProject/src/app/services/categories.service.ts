import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/Category';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

// A Singleton class (Design Pattern)
export class CategoriesService {
  //Declaration of class variables
  private domain: string;
  public categories: Category[];

  //Initialization of class variables and injection of services
  constructor(private http: HttpClient) {
    this.domain = 'http://localhost:3000';
    this.categories = [];
  }

  //get all categories
  public getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.domain}/categories`);
  }
}