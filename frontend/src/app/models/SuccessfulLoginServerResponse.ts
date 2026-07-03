export class SuccessfulLoginServerResponse {
  constructor(public token?: string, public first_name?: string, public last_name?: string, public city_name?: string,
    public street?: string, public cart_date?: string, public user_type?: string, public is_checked_out?: number, public order_date?: string) { }


}