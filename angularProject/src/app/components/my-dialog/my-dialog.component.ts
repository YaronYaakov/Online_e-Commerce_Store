import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CartItemsService } from 'src/app/services/cartItems.service';
import { Check } from 'src/app/models/Check';

@Component({
  selector: 'app-my-dialog',
  templateUrl: './my-dialog.component.html',
  styleUrls: ['./my-dialog.component.css']
})
export class MyDialogComponent implements OnInit {
  public title: string;
  public content: string;
  public isError: boolean;
  public isShown: boolean;
  private check: Check;
  public fileUrl: SafeResourceUrl;

  //Injecting Services(Dependency Injection - DESGIN PATTERN)
  constructor(private sanitizer: DomSanitizer, private router: Router,
    @Inject(MAT_DIALOG_DATA) data) {
    this.content = data.content,
      this.title = data.title,
      this.isError = data.isError,
      this.isShown = data.isShown,
      this.check = data.check
  }

  //a callback in LIFE CYCLE HOOKS of the component where we initilze
  ngOnInit(): void {

    this.createTextFile();
  }




//callback where we go back to pervious component
  public onBackClicked(): void {
    this.router.navigate(["/home"]);
  }

  //creates a text file
  public createTextFile(): void {
    if (this.check) {

      let check = this.createTextCheck(this.check)
      const blob = new Blob([check], { type: 'text/plain' });
      this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
    }
  }

//creates a text check
  public createTextCheck(check: Check): string {
    let checkTitle = "";
    let TextCheck = "";
    let space = "                  ";
    let halfSpace = "         ";
    let doubleSpace = space + space;

    checkTitle += `\n${doubleSpace}${doubleSpace}${space}${halfSpace}  Your Check\n\n\n `
    TextCheck += checkTitle;

    let index = 1;
    for (let cartItem of check.cartItems) {
      TextCheck += `${doubleSpace}${space} ${index++}) Product name: ${cartItem.name}, unit price: ${cartItem.price} ₪,  amount: ${cartItem.quantity}, total price: ${(cartItem.price * cartItem.quantity).toFixed(2)} ₪.\n\n\n`
    }
    TextCheck += `${doubleSpace}${doubleSpace}${halfSpace}----------Your total Price : ${check.totalPrice} ₪ ----------\n\n`
    return TextCheck;
  }
}
