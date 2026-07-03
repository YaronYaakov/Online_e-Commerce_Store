import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buying',
  templateUrl: './buying.component.html',
  styleUrls: ['./buying.component.css']
})
export class BuyingComponent implements OnInit {
  public isToggleState: boolean;

  //Injecting Services(Dependency Injection - DESGIN PATTERN)
  constructor(public shoppingCartsService: ShoppingCartService) { }

  //a callback in LIFE CYCLE HOOKS of the component where we initilze
  ngOnInit(): void {
    this.isToggleState = true;
  }



// a callback where we set the state of the button that opens/closes the Cart component
  public onMyCartButtonClicked() {
    this.isToggleState = !this.isToggleState;
  }
}
