import { Routes } from '@angular/router';
import { loginGuard } from '../guards/login.guard';  

export const routes: Routes = [
  { 
    path: 'home', 
    loadComponent: () => import('../components/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'about', 
    loadComponent: () => import('../components/about/about.component').then(m => m.AboutComponent) 
  },
  { 
    path: 'signup', 
    loadComponent: () => import('../components/signup/signup.component').then(m => m.SignUpComponent) 
  },
  { 
    path: 'generalInfo', 
    loadComponent: () => import('../components/general-info/general-info.component').then(m => m.GeneralInfoComponent) 
  },
  { 
    path: 'buying', 
    canActivate: [loginGuard], 
    loadChildren: () => import('./buying.routes').then(m => m.BUYING_ROUTES) 
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];