import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Check } from '../../models/Check';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class MyDialogComponent implements OnInit {

  private readonly sanitizer = inject(DomSanitizer);
  private readonly router = inject(Router);
  private readonly data = inject(MAT_DIALOG_DATA);

  public title: string = this.data.title;
  public content: string = this.data.content;
  public isError: boolean = this.data.isError;
  public isShown: boolean = this.data.isShown;
  private readonly check: Check = this.data.check;
  public fileUrl!: SafeResourceUrl;

  ngOnInit(): void {
    this.createTextFile();
  }

  public onBackClick(): void {
    this.router.navigate(['/home']);
  }

  public createTextFile(): void {
    if (this.check) {
      const checkText = this.createTextCheck(this.check);
      const blob = new Blob([checkText], { type: 'text/plain' });
      this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
    }
  }

  public createTextCheck(check: Check): string {
    const space = "                  ";
    const halfSpace = "         ";
    const doubleSpace = space + space;

    let textCheck = `\n${doubleSpace}${doubleSpace}${space}${halfSpace}  Your Check\n\n\n `;

    let index = 1;
    console.log(check.cart_items);
    for (const cartItem of (check.cart_items ?? [])) {
      textCheck += `${doubleSpace}${space} ${index++}) Product name: ${cartItem.name}, unit price: ${cartItem.price} ₪,  amount: ${cartItem.quantity}, total price: ${((cartItem.price ?? 0) * (cartItem.quantity ?? 0)).toFixed(2)} ₪.\n\n\n`;
    }


    textCheck += `${doubleSpace}${doubleSpace}${halfSpace}----------Your total Price : ${check.total_price ?? 0} ₪ ----------\n\n`;
    return textCheck;
  }
}