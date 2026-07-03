import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';

import { MyDialogComponent } from '../modal/modal.component';
import { CitiesService } from '../../services/cities.service';
import { OrdersService } from '../../services/orders.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { Order } from '../../models/Order';
import { Check } from '../../models/Check';
import { CaughtOrder } from '../../models/CaughtOrder';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatDatepickerModule, MatInputModule, MatFormFieldModule, MatNativeDateModule
  ],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly shoppingCartService = inject(ShoppingCartService);
  public readonly citiesService = inject(CitiesService);
  private readonly ordersService = inject(OrdersService);

  public orderFormGroup!: FormGroup;
  public userCredit = new FormControl('', [Validators.required, Validators.pattern(/^\d{16}(?:,\d{16})*$/)]);
  public userStreet = new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z\s0-9]+$/)]);
  public userCity = new FormControl('', [Validators.required]);
  public shipDate = new FormControl('', [Validators.required]);

  public minDate = new Date();
  private dates: string[] = [];

  ngOnInit(): void {
    const userData = JSON.parse(sessionStorage.getItem('storedUserData') || '{}');
    this.userStreet.setValue(userData.street || '');
    this.userCity.setValue(userData.cityId || '');

    this.orderFormGroup = new FormGroup({
      userStreet: this.userStreet,
      userCity: this.userCity,
      shipDate: this.shipDate,
      userCredit: this.userCredit
    });

    this.shoppingCartService.isShown.set(false);
    this.ordersService.isCheckSearchShown.set(true);
    this.getAllCaughtDates();
  }

  public dateFilter = (d: Date | null): boolean => {
    return !d || !this.dates.includes(this.formatDate(d));
  };

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  public getAllCaughtDates(): void {
    if (!this.ordersService.caughtOrders?.length) {
      this.ordersService.getCaughtShipDates().subscribe({
        next: (caughtDates: CaughtOrder[]) => {
          this.ordersService.caughtOrders.set(caughtDates);

          this.dates = caughtDates
            .map(c => c.ship_date)
            .filter((date): date is string => typeof date === 'string');
        },
        error: (err) => this.showDialog(true, err?.error?.error || 'Unknown error', 'Error', false, null)
      });
    }
  }

  public onOrderClicked(): void {
    const order = new Order(Number(this.userCity.value ?? 0), this.userStreet.value ?? '', this.formatDate(this.shipDate.value as any), Number(this.userCredit.value ?? 0));
     this.ordersService.createOrder(order).subscribe({
      next: (res) => {
        this.setUserData(res);
        const check = new Check(res.total_price, res.cart_items);
        this.showDialog(false, "Download your check:", "Success", true, check);
        this.ordersService.isCartChecked.set(true);
      },
      error: (err) => this.showDialog(true, err.error.error, 'Error', false, null)
    });
  }

  public onBackClicked(): void {
    if (this.ordersService.isCartChecked()) {
      this.router.navigate(["home"]);
    } else {
      this.shoppingCartService.isShown.set(true);
      this.ordersService.isCheckSearchShown.set(false);
      this.router.navigate(["buying/products"]);
    }
  }

  private showDialog(isError: boolean, content: string, title: string, isShown: boolean, check: Check | null): void {
    this.dialog.open(MyDialogComponent, { data: { isError, content, isShown, check, title } });
  }

  private setUserData(res: any): void {
    const userData = JSON.parse(sessionStorage.getItem('storedUserData') || '{}');
    userData.is_checked_out = res.is_checked_out;
    userData.order_date = res.order_date;
    sessionStorage.setItem("storedUserData", JSON.stringify(userData));
  }
}