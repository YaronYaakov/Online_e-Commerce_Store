import { CartItem } from './CartItem';

export class SuccessfulAddedOrderResponse {
    constructor(public is_checked_out?: number, public total_price?: number, public order_date?: string, public cart_items?: CartItem[]) { }

}