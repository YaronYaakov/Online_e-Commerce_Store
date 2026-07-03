import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserLoginDetails } from '../models/UserLoginDetails';
import { Observable } from 'rxjs';
import { SuccessfulLoginServerResponse } from '../models/SuccessfulLoginServerResponse';
import { UserRegisterDetails } from '../models/UserRegisterDetails';

@Injectable({
  providedIn: 'root'
})
// A Singleton class (Design Pattern)
export class UsersService {
//Declaration of class variables
private isLoginned: boolean
  private domain: string;
  public userName: string
  public buttonValue: string;
  public userLoginDetails: UserLoginDetails;

  //Initialization of class variables and injection of services
  constructor(private http: HttpClient) {
    this.isLoginned = false;
    this.domain = 'http://localhost:3000';
    this.userName = "";
    this.buttonValue = ""
    this.userLoginDetails = null;
  }

  //user's login
  public login(userLoginDetails: UserLoginDetails): Observable<SuccessfulLoginServerResponse> {

    console.log(userLoginDetails)
    return this.http.post<SuccessfulLoginServerResponse>(`${this.domain}/users/login`, userLoginDetails);
  }

  //customer's registeration
  public register(userRegisterDetails: UserRegisterDetails): Observable<void> {

    console.log(userRegisterDetails)
    return this.http.post<void>(`${this.domain}/users/register`, userRegisterDetails);
  }

  //user's log out
  public disconnect(userToken: string): Observable<void> {

    return this.http.post<void>(`${this.domain}/users/disconnect`, { "token": userToken });
  }

  //get isLoginned variable
  public getIsLoginned(): boolean {
    return this.isLoginned;
  }

  //set isLoginned variable
  public setIsLoginned(isLoginned: boolean): void {
    this.isLoginned = isLoginned;
  }

  //get userName variable
  public setUserName(userName: string): void {
    this.userName = userName
  }
}
