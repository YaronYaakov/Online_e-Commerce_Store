import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

// Models & Services
import { UserLoginDetails } from '../../models/UserLoginDetails';
import { SuccessfulLoginServerResponse } from '../../models/SuccessfulLoginServerResponse';
import { UsersService } from '../../services/users.service';
import { CartItemsService } from '../../services/cartItems.service';
import { OrdersService } from '../../services/orders.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { MyDialogComponent } from '../modal/modal.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  public readonly usersService = inject(UsersService);
  private readonly cartsService = inject(CartItemsService);
  private readonly ordersService = inject(OrdersService);
  private readonly shoppingCartService = inject(ShoppingCartService);

  private readonly emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private readonly passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,8}$/;

  public readonly isLoginInProgress = signal<boolean>(false);

  public readonly loginForm = this.fb.nonNullable.group({
    userEmail: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
    userPassword: ['', [Validators.required, Validators.pattern(this.passwordRegex)]]
  });

  ngOnInit(): void {
    this.isUserLoggedIn();
  }

  public onLoginClick(): void {
    if (this.loginForm.valid) {
      if (!this.usersService.isLoggedIn()) {
        const { userEmail, userPassword } = this.loginForm.getRawValue();
        const details = new UserLoginDetails(userEmail, userPassword);
        this.login(details);
      } else {
        this.logout();
      }
    }
  }

  public login(details: UserLoginDetails): void {
    if (!this.usersService.isLoggedIn()) {
      this.isLoginInProgress.set(true);

      this.usersService.login(details).subscribe({
        next: (res: SuccessfulLoginServerResponse) => {
          sessionStorage.setItem("storedUserData", JSON.stringify(res));
          
          this.usersService.isLoggedIn.set(true);
          this.usersService.userName.set(`Bonjour ${res.first_name} ${res.last_name} !`);
          this.usersService.loginButtonValue.set("LOG OUT");
          
          this.checkUserType(res);
          this.isLoginInProgress.set(false);
        },
        error: (err) => {
          this.dialog.open(MyDialogComponent, {
            data: { 
              isError: true, 
              content: err.error?.error || 'Login failed', 
              title: 'Error has occurred!' 
            }
          });
          this.isLoginInProgress.set(false);
        }
      });
    }
  }

  public checkUserType(userData: SuccessfulLoginServerResponse): void {
    if (userData.user_type === 'CUSTOMER') {
      this.usersService.signUpButtonValue.set(userData.is_checked_out === 0 ? "RESUME SHOPPING" : "START SHOPPING");
    } else {
      this.usersService.signUpButtonValue.set("MANAGE PRODUCTS");
      this.shoppingCartService.isShown.set(false);
    }
  }

  public logout(): void {
    const userData = JSON.parse(sessionStorage.getItem("storedUserData") || '{}');
    if (!userData.token) return;

    this.usersService.logout(userData.token).subscribe({
      next: () => {
        sessionStorage.clear();
        
        this.usersService.clearUserState();
        
        this.cartsService.cartItems.set([]);
        this.ordersService.caughtOrders.set([]);
      },
      error: (err) => {
        this.dialog.open(MyDialogComponent, {
          data: { isError: true, content: err.error?.error || 'Logout failed!', title: 'Error' }
        });
      }
    });
  }

  public onPassBuyingClick(): void { 
    this.router.navigate(["/buying/products"]); 
  }

  public onSignUpClick(): void {
    if (this.usersService.isLoggedIn()) {
      this.router.navigate(["/buying/products"]);
    } else {
      this.router.navigate(["/signup"]);
    }
  }

  private isUserLoggedIn(): void {
    if (this.usersService.isLoggedIn()) {
      const userString = sessionStorage.getItem("storedUserData");
      const data = JSON.parse(userString || '{}');

      this.usersService.loginButtonValue.set("LOG OUT");
      this.checkUserType(data);
    }
  }
}