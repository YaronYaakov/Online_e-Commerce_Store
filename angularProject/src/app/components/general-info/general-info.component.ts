import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/services/orders.service';
import { Product } from 'src/app/models/Product';
import { ProductsService } from 'src/app/services/products.service';
import { observable } from 'rxjs';
import { UsersService } from 'src/app/services/Users.service';
import { Statistics } from 'src/app/models/Statistics';
import { StatisticsService } from 'src/app/services/statistics.service';
import { MyDialogComponent } from '../my-dialog/my-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { element } from 'protractor';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.css']
})
export class GeneralInfoComponent implements OnInit {

  public statistics: Statistics;
  public userMessage: string;
  public isShown: boolean;

  //Injecting Services(Dependency Injection - DESGIN PATTERN)
  constructor(private dialog: MatDialog, private statisticsService: StatisticsService, private usersService: UsersService, private ordersService: OrdersService) { }

    //a callback in LIFE CYCLE HOOKS of the component where we initilze
  ngOnInit(): void {
    this.initVariables();
    this.retrieveStatistics();
    this.checkUserCartState();
  }




// Initializes class variables
  public initVariables(): void {
    this.isShown = false;
    this.statistics = new Statistics(0, 0)

  }


  //retrieves statistics of products amount and orders amount
  public retrieveStatistics(): void {
    const observable = this.statisticsService.getStatistics()

    observable.subscribe((statistics) => {
      this.statistics = new Statistics(statistics.productsAmount, statistics.ordersAmount)

      console.log(this.statistics)
    }
      , serverErrorResponse => { // Reaching here means that the server had failed
        // serverErrorResponse is the object returned from the ExceptionsHandler
        this.dialog.open(MyDialogComponent, {
          data: { isError: true, content: serverErrorResponse.error.error, isShown: false }
        })
      });
  }


//checks user cart's state 
  public checkUserCartState(): void {
    if (this.usersService.getIsLoginned()) {
      let userData = JSON.parse(sessionStorage.getItem("storedUserData"))

      if (userData.userType == 'CUSTOMER') {
        this.isShown = true;

        if (userData.isCheckedOut == 0) {
          this.userMessage = `You have an open cart from ${userData.cartDate} and the total price is ${userData.totalPrice}`
        }

        else if (userData.isCheckedOut == 1) {
          this.userMessage = `Your last order was occured in  ${userData.orderDate}`
        }

        else {
          this.userMessage = `Welcome to your first shopping`
        }
      }
      else if (userData.userType != 'CUSTOMER') {
        this.isShown = false;
      }
    }
  }
}
