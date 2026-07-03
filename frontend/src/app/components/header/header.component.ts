import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink, RouterLinkActive } from '@angular/router';

// Services & Components
import { UsersService } from '../../services/users.service';
import { CitiesService } from '../../services/cities.service';
import { MyDialogComponent } from '../modal/modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  
  public readonly usersService = inject(UsersService);
  private readonly citiesService = inject(CitiesService);

  ngOnInit(): void {
    this.setUserLoginStatus();
    this.getAllCities();
    this.setUserName();
  }

  public setUserName(): void {
    if (this.usersService.isLoggedIn()) {
      const rawData = sessionStorage.getItem("storedUserData");
      if (rawData) {
        const userData = JSON.parse(rawData);
        this.usersService.userName.set(`Bonjour ${userData.first_name} ${userData.last_name} !`);
      }
    }
  }

  public getAllCities(): void {
    this.citiesService.getAllCities().subscribe({
      error: (serverErrorResponse) => {
        this.dialog.open(MyDialogComponent, {
          data: { 
            isError: true, 
            content: serverErrorResponse.error.error, 
            isShown: false, 
            check: null, 
            title: 'Error has occurred!' 
          }
        });
      }
    });
  }

  public setUserLoginStatus(): void {
    const rawData = sessionStorage.getItem("storedUserData");
    if (rawData) {
      this.usersService.isLoggedIn.set(true);
    }
  }
}