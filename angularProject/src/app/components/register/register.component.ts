import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService } from 'src/app/services/Users.service';
import { UserRegisterDetails } from 'src/app/models/UserRegisterDetails';
import { City } from 'src/app/models/City';
import { CitiesService } from 'src/app/services/cities.service';
import { UserLoginDetails } from 'src/app/models/UserLoginDetails';
import { MatDialog } from '@angular/material/dialog';
import { MyDialogComponent } from '../my-dialog/my-dialog.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public registerFormStep1: FormGroup;
  public registerFormStep2: FormGroup;

  public userId: FormControl;
  public userEmail: FormControl;
  public userPassword: FormControl;
  public userConfirmPassword: FormControl;
  private userRegisterDetails: UserRegisterDetails;
  public userFirstName: FormControl;
  public userLastName: FormControl;
  public userCity: FormControl;
  public userStreet: FormControl;
  public isNotEqual: Boolean

  public allCities: City[];

  public isShown: boolean;
  public formNumber: Number;

  //Injecting Services(Dependency Injection - DESGIN PATTERN)
  constructor(private dialog: MatDialog, private usersService: UsersService, private router: Router, public citiesService: CitiesService) {
  }

  //a callback in LIFE CYCLE HOOKS of the component where we initilze
  ngOnInit(): void {

    if (this.usersService.getIsLoginned()) {
      this.router.navigate(["/home"]);
    }

    this.variablesInit()
    this.formControlsInit()
    this.formGroupInit()
  }



//callback where we pass to the next step
  public onClickedNextStep(): void {
    if (this.userConfirmPassword.value == this.userPassword.value) {
      this.userRegisterDetails.userId = this.userId.value;
      this.userRegisterDetails.email = this.userEmail.value
      this.userRegisterDetails.password = this.userPassword.value
      console.log(this.userCity.value)

      console.log(this.userRegisterDetails)
      this.isShown = true;
      this.formNumber = 2;

    }
    else {
      this.isNotEqual = true;
      setTimeout(() => { this.isNotEqual = false }, 2000);
    }
  }

//callback where we press after all details are filled
  public onSubmit(): void {
    this.userRegisterDetails.firstName = this.userFirstName.value;
    this.userRegisterDetails.lastName = this.userLastName.value;
    this.userRegisterDetails.street = this.userStreet.value;
    this.userRegisterDetails.cityId = this.userCity.value;
    this.register(this.userRegisterDetails);

  }


//sends a http post request to add a new user(registeration)
  public register(userRegisterDetails: UserRegisterDetails): void {

    const registerObservable = this.usersService.register(userRegisterDetails)

    registerObservable.subscribe(() => {

      this.usersService.userLoginDetails = new UserLoginDetails(this.userRegisterDetails.email, this.userRegisterDetails.password)

      console.log(this.usersService.userLoginDetails)
      this.router.navigate(['/home'])
    }
      , serverErrorResponse => { // Reaching here means that the server had failed
        // serverErrorResponse is the object returned from the ExceptionsHandler
        this.dialog.open(MyDialogComponent, {
          data: { isError: true, content: serverErrorResponse.error.error, isShown: false, check: null, title: 'Error has occurred!' }
        })
      });
  }


//callback that passes us to pervious component
  public onBackClicked(): void {
    this.isShown = false;
    this.formNumber = 1;
  }

  //initializes form controls
  public formControlsInit(): void {
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,8}$/;
    let nameRegex = /^[a-z]+$/i;
    let streetRegex = /^[a-zA-Z\s0-9]+$/;;

    // Initializing form controls with validators
    this.userId = new FormControl("", [Validators.required, Validators.pattern("[1-9]{9}")]);
    this.userEmail = new FormControl("", [Validators.required, Validators.pattern(emailRegex)]);
    this.userPassword = new FormControl("", [Validators.required, Validators.pattern(passwordRegex)]);
    this.userConfirmPassword = new FormControl("", [Validators.required, Validators.pattern(passwordRegex)]);
    // Initializing form controls with validators
    this.userFirstName = new FormControl("", [Validators.required, Validators.pattern(nameRegex)]);
    this.userLastName = new FormControl("", [Validators.required, Validators.pattern(nameRegex)]);
    this.userStreet = new FormControl("", [Validators.required, Validators.pattern(streetRegex)]);
    this.userCity = new FormControl("", [Validators.required]);

  }

  //initialzes form group
  public formGroupInit(): void {
    // Initializing the from groups
    this.registerFormStep1 = new FormGroup({
      userId: this.userId,
      userEmail: this.userEmail,
      userPassword: this.userPassword,
      userConfirmPassword: this.userConfirmPassword
    });

    this.registerFormStep2 = new FormGroup({
      userFirstName: this.userFirstName,
      userLastName: this.userLastName,
      userStreet: this.userStreet,
      userCity: this.userCity
    });

  }

//initalizes class variables
  public variablesInit(): void {
    this.isShown = false;
    this.isNotEqual = false;
    this.formNumber = 1;
    this.userRegisterDetails = new UserRegisterDetails()

  }
}
