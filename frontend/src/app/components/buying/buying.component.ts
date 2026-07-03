import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart.component';

@Component({
  selector: 'app-buying',
  standalone: true,  
  imports: [RouterOutlet, MatIconModule, ShoppingCartComponent],   
  templateUrl: './buying.component.html',
  styleUrls: ['./buying.component.css']
})
export class BuyingComponent {
  public shoppingCartsService = inject(ShoppingCartService);

  public isToggleState = signal<boolean>(true);

  public onMyCartButtonClick(): void {
    this.isToggleState.update(state => !state);
  }
}