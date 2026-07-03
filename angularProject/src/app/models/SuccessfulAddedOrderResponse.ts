import { CartItem } from './CartItem';

export class SuccessfulAddedOrderResponse {
    constructor(public orderDate?: string, public totalPrice?: number, public isCheckedOut?: number, public cartItems?: CartItem[]) { }

}