import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsersService } from '../services/Users.service';


@Injectable()
//Implementaion of HttpInterceptor Interface
export class AuthenticationInterceptor implements HttpInterceptor {
    // injecting services, Dependency Injection (Design Patten)
    constructor(private userService: UsersService) { }

    // Parameters : 
    // request : Represents the request object which is on his way to the server
    // getting the request enables us to manipulate it.
    // next : Maybe we have multiple interceptors... so calling next sends the request
    // to the next interceptor (if exists)
    // a method that has to be implemented (interface eqauls to a contract)

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with our token if available
        let token;

        //checking if user is loginned
        if (this.userService.getIsLoginned()) {
            let userData = JSON.parse(sessionStorage.getItem("storedUserData"))
            token = `Bearer ${userData.token}`
        }

        // Logically - token = null ---> false
        // token != null --> true
        // A situation for example : login (no token yet)
        if (token) {

            request = request.clone({
                setHeaders: {
                    Authorization: token
                }
            });
        }

        return next.handle(request);
    }
}
