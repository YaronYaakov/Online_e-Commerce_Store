import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserLoginDetails } from '../models/UserLoginDetails';
import { UserSignUpDetails } from '../models/UserSignUpDetails';
import { SuccessfulLoginServerResponse } from '../models/SuccessfulLoginServerResponse';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly domain = 'http://localhost:3000';

  public readonly isLoggedIn = signal<boolean>(false);
  public readonly userName = signal<string>("");
  public readonly signUpButtonValue = signal<string>("Don't have an account?");
  public readonly loginButtonValue = signal<string>("LOG IN");
  public readonly userLoginDetails = signal<UserLoginDetails | null>(null);

  public login(userLoginDetails: UserLoginDetails): Observable<SuccessfulLoginServerResponse> {
    return this.http.post<SuccessfulLoginServerResponse>(`${this.domain}/users/login`, userLoginDetails);
  }

  public signUp(userSignUpDetails: UserSignUpDetails): Observable<void> {
    return this.http.post<void>(`${this.domain}/users`, userSignUpDetails);
  }

  public logout(userToken: string): Observable<void> {
    return this.http.post<void>(`${this.domain}/users/logout`, { token: userToken });
  }

  public clearUserState(): void {
    this.isLoggedIn.set(false);
    this.userName.set("");
    this.loginButtonValue.set("LOG IN");
    this.signUpButtonValue.set("Don't have an account?");
    this.userLoginDetails.set(null);
  }
}