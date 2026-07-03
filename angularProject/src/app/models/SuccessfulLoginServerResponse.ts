export class SuccessfulLoginServerResponse {
  constructor(public token?: string, public firstName?: string, public lastName?: string, public cityName?: string,
    public street?: string, public cartDate?: string, public userType?: string, public isCheckedOut?: number, public orderDate?: string) { }


}