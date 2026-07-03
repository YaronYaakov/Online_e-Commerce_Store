import { CartItem } from './CartItem';

export class Check {
    constructor(public total_price?: number, public cart_items?: CartItem[]) { }

}