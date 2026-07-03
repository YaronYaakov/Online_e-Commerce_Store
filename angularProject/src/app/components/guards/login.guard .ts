import { Injectable, ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsersService } from 'src/app/services/Users.service';

@Injectable({
    providedIn: 'root'
})
//Implementaion of CanActivate Interface
export class LoginGuard implements CanActivate {

    //Injecting Services(Dependency Injection - DESGIN PATTERN)
    public constructor(private router: Router, private usersService: UsersService) { }

   // a method that has to be implemented (interface eqauls to a contract)
    public canActivate(): boolean {
        let isLoginned = this.usersService.getIsLoginned()

        if (isLoginned == true) {
            return true;
        }

        this.router.navigateByUrl("/home");
        return false;
    }
}
