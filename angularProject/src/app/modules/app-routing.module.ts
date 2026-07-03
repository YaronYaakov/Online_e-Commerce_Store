import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from '../components/about/about.component';
import { GeneralInfoComponent } from '../components/general-info/general-info.component';
import { LoginComponent } from '../components/login/login.component';

import { CommonModule } from '@angular/common';
import { BuyingComponent } from '../components/buying/buying.component';
import { RegisterComponent } from '../components/register/register.component';
import { LoginGuard } from '../components/guards/login.guard ';
import { FormsModule } from '@angular/forms';

// Routing Mechanism
const routes: Routes = [
  { path: "home", component: LoginComponent },
  { path: "about", component: AboutComponent },
  { path: "register", component: RegisterComponent },
  { path: "generalInfo", component: GeneralInfoComponent },
  { path: "buying", canActivate: [LoginGuard], loadChildren: "./buying.module#BuyingModule" },
  { path: "", redirectTo: "home", pathMatch: "full" },

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes) // Importing the above routes
  ]
})
export class AppRoutingModule { }
