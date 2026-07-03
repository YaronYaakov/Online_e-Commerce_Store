import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Statistics } from '../../models/Statistics';
import { StatisticsService } from '../../services/statistics.service';
import { MyDialogComponent } from '../modal/modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.css']
})
export class GeneralInfoComponent implements OnInit {
  
  private dialog = inject(MatDialog);
  private statisticsService = inject(StatisticsService);
  private usersService = inject(UsersService);

  public statistics = signal<Statistics>(new Statistics(0, 0));
  public userMessage = signal<string>("");
  public isShown = signal<boolean>(false);

  ngOnInit(): void {
    this.retrieveStatistics();
    this.checkUserCartState();
  }

  public retrieveStatistics(): void {
    this.statisticsService.getStatistics().subscribe({
      next: (res) => {
        this.statistics.set(new Statistics(res.productsCount, res.ordersCount));
      },
      error: (serverErrorResponse) => {
        this.dialog.open(MyDialogComponent, {
          data: { isError: true, content: serverErrorResponse.error.error, isShown: false }
        });
      }
    });
  }

  public checkUserCartState(): void {
    if (this.usersService.isLoggedIn()) {
      const storedData = sessionStorage.getItem("storedUserData");
      if (!storedData) return;

      const userData = JSON.parse(storedData);

      if (userData.user_type === 'CUSTOMER') {
        this.isShown.set(true);

        if (userData.is_checked_out == 0) {
          this.userMessage.set(`You have an open cart from ${userData.cart_date} and the total price is ${userData.total_price}`);
        } else if (userData.is_checked_out == 1) {
          this.userMessage.set(`Your last order was occurred in ${userData.order_date}`);
        } else {
          this.userMessage.set('Welcome to your first shopping');
        }
      } else {
        this.isShown.set(false);
      }
    }
  }
}