import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/Users.service';
import { SuccessfulLoginServerResponse } from 'src/app/models/SuccessfulLoginServerResponse';
import { CitiesService } from 'src/app/services/cities.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { MatDialog } from '@angular/material/dialog';
import { MyDialogComponent } from '../my-dialog/my-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  //Injecting Services(Dependency Injection - DESGIN PATTERN)
  constructor(private dialog: MatDialog, public usersService: UsersService, private citiesService: CitiesService, private categoriesService: CategoriesService) { }

    //a callback in LIFE CYCLE HOOKS of the component where we initilze
  ngOnInit(): void {

    this.setUserLoginStatus()
    this.retrieveAllCities()
    this.setHeaderUserName()
  }


  //sets user's name
  public setHeaderUserName(): void {
    if (this.usersService.getIsLoginned()) {

      let userData = JSON.parse(sessionStorage.getItem("storedUserData"))
      this.usersService.setUserName(`Hello ${userData.firstName} ${userData.lastName}`)
    }
  }

//get all cities
  public retrieveAllCities(): void {
    const observable = this.citiesService.getAllCities()
    observable.subscribe((cities) => {
      this.citiesService.cities = cities;
      console.log(this.citiesService.cities)
    }
      , serverErrorResponse => { // Reaching here means that the server had failed
        // serverErrorResponse is the object returned from the ExceptionsHandler
        this.dialog.open(MyDialogComponent, {
          data: { isError: true, content: serverErrorResponse.error.error, isShown: false, check: null, title: 'Error has occurred!' }
        })
      });
  }

//sets user login status
  public setUserLoginStatus(): void {
    let userData = JSON.parse(sessionStorage.getItem("storedUserData"))
    if (userData) {
      this.usersService.setIsLoginned(true)
    }
  }
}
