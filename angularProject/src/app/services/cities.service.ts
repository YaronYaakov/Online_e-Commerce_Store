import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { City } from '../models/City';

@Injectable({
  providedIn: 'root'
})

// A Singleton class (Design Pattern)
export class CitiesService {
  //Declaration of class variables
  private domain: string;
  public cities: City[]

  //Initialization of class variables and injection of services
  constructor(private http: HttpClient) {
    this.domain = 'http://localhost:3000';
    this.cities = []
  }

  //get all cities
  public getAllCities(): Observable<City[]> {
    return this.http.get<City[]>(`${this.domain}/cities`);
  }


}
