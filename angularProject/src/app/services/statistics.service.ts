import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { City } from '../models/City';
import { Statistics } from '../models/Statistics';

@Injectable({
  providedIn: 'root'
})

// A Singleton class (Design Pattern)
export class StatisticsService {
  //Declaration of class variables
  private domain: string;

  //Initialization of class variables and injection of services
  constructor(private http: HttpClient) {
    this.domain = 'http://localhost:3000';
  }

  //get Statistics
  public getStatistics(): Observable<Statistics> {
    return this.http.get<Statistics>(`${this.domain}/statistics`);
  }
}
