import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsersService } from '../services/users.service';

export const loginGuard: CanActivateFn = () => {
  const router = inject(Router);
  const usersService = inject(UsersService);

  if (usersService.isLoggedIn()) {
    return true;
  }

  router.navigateByUrl("/home");
  return false;
};