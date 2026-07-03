import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserLoginDetails } from 'src/app/models/UserLoginDetails';
import { UsersService } from 'src/app/services/Users.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SuccessfulLoginServerResponse } from 'src/app/models/SuccessfulLoginServerResponse';
import { element } from 'protractor';
import { MyDialogComponent } from '../my-dialog/my-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CartItemsService } from 'src/app/services/cartItems.service';
import { OrdersService } from 'src/app/services/orders.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public userEmail: FormControl;
  public userPassword: FormControl;

  //Injecting Services(Dependency Injection - DESGIN PATTERN)
  constructor(private dialog: MatDialog, public usersService: UsersService, private router: Router, private cartsService: CartItemsService, private ordersService: OrdersService, private shoppingCartService: ShoppingCartService) { }

  //a callback in LIFE CYCLE HOOKS of the component where we initilze
  ngOnInit(): void {

    this.setCartButtonValue();
    this.initFormControls()
    this.initFormGroup();
    this.checkUserLoginDetails();

  }






  //initializes form controls
  public initFormControls(): void {
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,8}$/;

    this.userEmail = new FormControl("", [Validators.required, Validators.pattern(emailRegex)]);
    this.userPassword = new FormControl("", [Validators.required, Validators.pattern(passwordRegex)]);

  }


  //initialzes form group
  public initFormGroup(): void {

    // Initializing the from group
    this.loginForm = new FormGroup({
      userEmail: this.userEmail,
      userPassword: this.userPassword
    });

  }



  // a callback function where users login
  public onLoginClickd(): void {

    let userLoginDetails = new UserLoginDetails(this.userEmail.value, this.userPassword.value);
    console.log(userLoginDetails)
    this.login(userLoginDetails)
  }


  //sends a post request(login)
  public login(userLoginDetails: UserLoginDetails): void {

    const observable = this.usersService.login(userLoginDetails)

    observable.subscribe((successfulLoginResponse) => {

      console.log(successfulLoginResponse)
      this.usersService.setIsLoginned(true)
      sessionStorage.setItem("storedUserData", JSON.stringify(successfulLoginResponse));

      this.usersService.setUserName(`Hello ${successfulLoginResponse.firstName} ${successfulLoginResponse.lastName}`)
      this.setCartButtonValue()

    }
      , serverErrorResponse => { // Reaching here means that the server had failed
        // serverErrorResponse is the object returned from the ExceptionsHandler
        this.dialog.open(MyDialogComponent, {
          data: { isError: true, content: serverErrorResponse.error.error, isShown: false, check: null, title: 'Error has occurred!' }
        })
      });
  }


  //sets cart button value
  public setCartButtonValue(): void {

    this.shoppingCartService.isShown = true;
    this.ordersService.isCheckSearchShown = false;
    if (this.usersService.getIsLoginned()) {

      let userData = JSON.parse(sessionStorage.getItem('storedUserData'))
      this.checkUserType(userData)
    }
    else {
      this.usersService.buttonValue = "start shopping"
    }
  }


  //checks user's type
  public checkUserType(userData: SuccessfulLoginServerResponse): void {
    if (userData.userType == 'CUSTOMER') {
      this.shoppingCartService.isShown = true;

      if (userData.isCheckedOut == 0) {
        this.usersService.buttonValue = "resume shopping"
      }
      else if (userData.isCheckedOut == 1 || userData.isCheckedOut == null) {
        this.usersService.buttonValue = "start shopping"
      }
    }
    else {
      this.usersService.buttonValue = "manage products"
      this.shoppingCartService.isShown = true;
      this.shoppingCartService.isShown = false;

    }

  }



//passes to Buying component
  public onPassBuyingClicked(): void {
    this.router.navigate(["/buying/products"]);
  }



//a callback function where we register
  public onRegisterClicked(): void {
    this.router.navigate(["/register"]);
  }



// a callback function where we disconnect
  public onDisconnectedClicked(): void {
    this.disconnect();
  }



//sends a http post request to disconnect
  public disconnect(): void {

    let userData = JSON.parse(sessionStorage.getItem("storedUserData"))
    const observable = this.usersService.disconnect(userData.token)

    observable.subscribe(() => {
      sessionStorage.clear()
      this.usersService.setIsLoginned(false)
      this.usersService.setUserName("")
      this.usersService.buttonValue = "start shopping"
      this.cartsService.cartItems = [];
      this.ordersService.caughtOrders = [];

    }
      , serverErrorResponse => { // Reaching here means that the server had failed
        // serverErrorResponse is the object returned from the ExceptionsHandler
        this.dialog.open(MyDialogComponent, {
          data: { isError: true, content: serverErrorResponse.error.error, isShown: false, check: null, title: 'Error has occurred!' }
        })
      });
  }



//checks user login details variable after  registeration
  public checkUserLoginDetails(): void {

    if (this.usersService.userLoginDetails) {
      this.login(this.usersService.userLoginDetails)
      this.usersService.userLoginDetails = null;
    }
  }
}
