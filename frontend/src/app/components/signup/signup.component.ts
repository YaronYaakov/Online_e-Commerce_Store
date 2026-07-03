import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from '../../services/users.service';
import { CitiesService } from '../../services/cities.service';
import { UserSignUpDetails } from '../../models/UserSignUpDetails';
import { MyDialogComponent } from '../modal/modal.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly usersService = inject(UsersService);
  private readonly router = inject(Router);
  public readonly citiesService = inject(CitiesService);

  public registerFormStep1!: FormGroup;
  public registerFormStep2!: FormGroup;

  public isSecondFormShown = signal<boolean>(false);
  public isNotEqual = signal<boolean>(false);

  private userRegisterDetails = new UserSignUpDetails();

  ngOnInit(): void {
    if (this.usersService.isLoggedIn()) {
      this.router.navigate(["/home"]);
      return;
    }
    this.initForms();
  }

  private initForms(): void {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,8}$/;

    this.registerFormStep1 = new FormGroup({
      userId: new FormControl('', [Validators.required, Validators.pattern("[1-9]{9}")]),
      userEmail: new FormControl('', [Validators.required, Validators.pattern(emailRegex)]),
      userPassword: new FormControl('', [Validators.required, Validators.pattern(passwordRegex)]),
      userConfirmPassword: new FormControl('', [Validators.required, Validators.pattern(passwordRegex)])
    });

    this.registerFormStep2 = new FormGroup({
      userFirstName: new FormControl('', [Validators.required, Validators.pattern(/^[a-z]+$/i)]),
      userLastName: new FormControl('', [Validators.required, Validators.pattern(/^[a-z]+$/i)]),
      userStreet: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z\s0-9]+$/)]),
      userCity: new FormControl('', [Validators.required])
    });
  }

  public onNextStepClick(): void {
    const { userPassword, userConfirmPassword } = this.registerFormStep1.value;

    if (userPassword === userConfirmPassword) {
      this.userRegisterDetails.user_id = this.registerFormStep1.get('userId')?.value;
      this.userRegisterDetails.email = this.registerFormStep1.get('userEmail')?.value;
      this.userRegisterDetails.password = this.registerFormStep1.get('userPassword')?.value;
      this.isSecondFormShown.set(true);
    } else {
      this.isNotEqual.set(true);
      setTimeout(() => this.isNotEqual.set(false), 2000);
    }
  }

  public onSubmit(): void {
    if (this.registerFormStep2.invalid) return;

    this.userRegisterDetails.first_name = this.registerFormStep2.get('userFirstName')?.value;
    this.userRegisterDetails.last_name = this.registerFormStep2.get('userLastName')?.value;
    this.userRegisterDetails.street = this.registerFormStep2.get('userStreet')?.value;
    this.userRegisterDetails.city_id = this.registerFormStep2.get('userCity')?.value;
    console.log(this.userRegisterDetails);
    this.signUp(this.userRegisterDetails);
  }

  public signUp(details: UserSignUpDetails): void {

    this.usersService.signUp(details).subscribe({
      next: () => {
        this.router.navigate(['/home']);
        this.dialog.open(MyDialogComponent, {
          data: { isError: false, content: "You've Signed Up!", title: 'SUCCESS' }
        });
      },
      error: (err) => {
        this.dialog.open(MyDialogComponent, {
          data: { isError: true, content: err.error?.error || 'Registration failed!', title: 'Error' }
        });
      }
    });
  }

  public onBackClick(): void {
    this.isSecondFormShown.set(false);
  }
}