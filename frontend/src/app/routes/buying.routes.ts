import { Routes } from '@angular/router';
import { loginGuard } from '../guards/login.guard';

export const BUYING_ROUTES: Routes = [
  {
    path: "",
    canActivate: [loginGuard],
    loadComponent: () => import('../components/buying/buying.component').then(m => m.BuyingComponent),
    children: [
      { 
        path: "products", 
        loadComponent: () => import('../components/products/products.component').then(m => m.ProductsComponent) 
      },
      { 
        path: "order", 
        loadComponent: () => import('../components/order/order.component').then(m => m.OrderComponent) 
      },
      { path: "", redirectTo: "products", pathMatch: "full" }
    ]
  }
];