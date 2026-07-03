import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BuyingComponent } from '../components/buying/buying.component';
import { ProductsComponent } from '../components/products/products.component';
import { OrderComponent } from '../components/order/order.component';
import { ShoppingCartComponent } from '../components/shopping-cart/shopping-cart.component';
import { LoginGuard } from '../components/guards/login.guard ';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { ProductsPipeByCategory } from '../pipes/ProductsPipeByCategory';
import { ProductsPipeByName } from '../pipes/ProductsPipeByName';
import { ProductsCheckPipeByName } from '../pipes/ProductsCheckPipeByName';

const routes: Routes = [
    {
        //Child Routing
        path: "buying", canActivate: [LoginGuard], component: BuyingComponent, children: [
            { path: "products", canActivate: [LoginGuard], component: ProductsComponent },
            { path: "order", canActivate: [LoginGuard], component: OrderComponent },
            { path: "", redirectTo: "products", pathMatch: "full" }

        ]
    }
];

@NgModule({
    declarations: [
        BuyingComponent,
        ProductsComponent,
        OrderComponent,
        ShoppingCartComponent,
        ProductsPipeByCategory,
        ProductsPipeByName,
        ProductsCheckPipeByName,
    ],


    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterModule.forChild(routes) // Importing the above routes
    ],

})
export class BuyingModule {

}
