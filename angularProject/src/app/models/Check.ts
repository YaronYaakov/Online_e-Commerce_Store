import { CartItem } from './CartItem';

export class Check {
    constructor(public totalPrice?: number, public cartItems?: CartItem[]) { }

}