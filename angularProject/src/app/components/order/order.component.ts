import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CitiesService } from 'src/app/services/cities.service';
import { OrdersService } from 'src/app/services/orders.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { MatDialog } from '@angular/material/dialog';
import { MyDialogComponent } from '../my-dialog/my-dialog.component';
import { CaughtOrder } from 'src/app/models/CaughtOrder';
import { Check } from 'src/app/models/Check';
import { Order } from 'src/app/models/Order';
import { Session } from 'protractor';
import { SuccessfulAddedOrderResponse } from 'src/app/models/SuccessfulAddedOrderResponse';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  public orderFormGroup: FormGroup;

  public userCredit: FormControl;
  public userStreet: FormControl;
  public userCity: FormControl;
  public shipDate: FormControl;
  public minDate: Date;
  private dates: string[];

  //Injecting Services(Dependency Injection - DESGIN PATTERN)
  constructor(private dialog: MatDialog, private router: Router, private shoppingCartService: ShoppingCartService, public citiesService: CitiesService, private ordersService: OrdersService) { }

  //a callback in LIFE CYCLE HOOKS of the component where we initilze
  ngOnInit(): void {

    this.initVariables()
    this.getAllCaughtDates()
    this.initFormControl()
    this.initFormGroup()
  }



  //initializes form controls
  public initFormControl(): void {

    let userData = JSON.parse(sessionStorage.getItem("storedUserData"))
    let creditRegex = /^\d{16}(?:,\d{16})*$/;
    let streetRegex = /^[a-zA-Z\s0-9]+$/;

    // Initializing form controls with validators
    this.userStreet = new FormControl(userData.street, [Validators.required, Validators.pattern(streetRegex)]);
    this.userCity = new FormControl(userData.cityId, [Validators.required]);
    this.shipDate = new FormControl("", [Validators.required]);
    this.userCredit = new FormControl("", [Validators.required, Validators.pattern(creditRegex)]);

  }


  //initialzes form group
  public initFormGroup(): void {
    // Initializing the from groups
    this.orderFormGroup = new FormGroup({
      uesrStreet: this.userStreet,
      userCity: this.userCity,
      shipDate: this.shipDate,
      userCredit: this.userCredit
    });
  }


//filters all shipping dates that's are eqauls or over than 3
  public dateFilter = (d: Date) => {
    let formattedDate = this.formatDate(d)
    return this.dates.indexOf(formattedDate) == -1
  };



//formats a date object
  public formatDate(date: Date): string {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }

    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }

// callback that creates an order
  public onOrderClicked(): void {
    this.createOrder()

  }

//initializes class variables
  public initVariables(): void {
    this.shoppingCartService.isShown = false;
    this.ordersService.isCheckSearchShown = true
    this.dates = [];
    this.minDate = new Date();
  }

//callback sends the user to pervious component
  public onBackClicked(): void {
    if (this.ordersService.isCartChecked) {
      this.router.navigate(["home"]);

    }
    else {
      this.shoppingCartService.isShown = true;
      this.ordersService.isCheckSearchShown = false;
      this.router.navigate(["buying/products"]);
    }
  }

//gets all caught order dates
  public getAllCaughtDates(): void {
    if (this.ordersService.caughtOrders.length == 0 || this.ordersService.caughtOrders == null) {

      const observable = this.ordersService.getCaughtShipDates()
      observable.subscribe((caughtDates) => {
        this.ordersService.caughtOrders = caughtDates;
        this.createDateStringArray(caughtDates)
      }
        , serverErrorResponse => { // Reaching here means that the server had failed
          // serverErrorResponse is the object returned from the ExceptionsHandler
          this.showDialog(true, serverErrorResponse.error.error, 'Error has occurred!', false, null)
        });
    }
  }

// creates an array of stringified dates
  public createDateStringArray(caughtDates: CaughtOrder[]): void {
    for (let index = 0; index < caughtDates.length; index++) {
      this.dates[index] = caughtDates[index].ship_date;
    }
    console.log(this.dates)
  }


//shows a modal
  public showDialog(isError: boolean, content: string, title: string, isShown: boolean, check: Check): void {
    this.dialog.open(MyDialogComponent, {
      data: { isError: isError, content: content, isShown: isShown, check: check, title: title }
    })
  }


//creates an order
  public createOrder(): void {
    let order = new Order(this.userCity.value, this.userStreet.value, this.formatDate(this.shipDate.value), this.userCredit.value)
    console.log(order)
    this.addOrder(order);
  }


//adds new order to resourse
  public addOrder(order: Order): void {
    const observable = this.ordersService.createOrder(order)

    observable.subscribe((serverResponse) => {
      console.log(serverResponse)

      this.setUserData(serverResponse)
      let check = new Check(serverResponse.totalPrice, serverResponse.cartItems)

      console.log(check)
      this.showDialog(false, " You may download your check:", "Your order was successfully made!", true, check)
      this.ordersService.isCartChecked = true;
    }
      , serverErrorResponse => { // Reaching here means that the server had failed
        // serverErrorResponse is the object returned from the ExceptionsHandler
        this.showDialog(true, serverErrorResponse.error.error, 'Error has occurred!', false, null)
      });
  }


//sets session storage(cache)
  public setUserData(serverResponse: SuccessfulAddedOrderResponse): void {
    let userData = JSON.parse(sessionStorage.getItem('storedUserData'))
    userData.isCheckedOut = serverResponse.isCheckedOut;
    userData.orderDate = serverResponse.orderDate;

    sessionStorage.setItem("storedUserData", JSON.stringify(userData))
  }

}

