import { Pipe, PipeTransform } from '@angular/core';
import { CartItem } from '../models/CartItem';

@Pipe({
  name: 'byCheckProductsNamePipe',
  standalone: true
})
export class ProductsCheckPipeByName implements PipeTransform {

  transform(cartItems: CartItem[], productName: string): CartItem[] {
    if (!productName) return cartItems;
    return cartItems.filter(item => item.name?.toLowerCase().includes(productName.toLowerCase()));
  }
}