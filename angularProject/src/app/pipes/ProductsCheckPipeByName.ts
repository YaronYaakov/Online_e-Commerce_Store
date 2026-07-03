import { Pipe, PipeTransform } from '@angular/core';
import { CartItem } from '../models/CartItem';

@Pipe({
    name: 'byCheckProductsNamePipe'
})

//Filter user's check by product name.
//Implementaion of PipeTransfom Interface
export class ProductsCheckPipeByName implements PipeTransform {

    // a method that has to be implemented (interface eqauls to a contract)
    transform(cartItems: CartItem[], productName: string): any {

        if (productName == "") {
            return cartItems;
        }

        else {
            return cartItems.filter(cartItem => cartItem.name.includes(productName));
        }
    }
}


