import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { LayoutComponent } from '../components/layout/layout.component';
import { HeaderComponent } from '../components/header/header.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AboutComponent } from '../components/about/about.component';
import { GeneralInfoComponent } from '../components/general-info/general-info.component';
import { FooterComponent } from '../components/footer/footer.component';
import { LoginComponent } from '../components/login/login.component';
import { RouterModule } from '@angular/router';
import { BuyingModule } from './buying.module';
import { RegisterComponent } from '../components/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationInterceptor } from '../interceptors/AuthenticationInterceptor';
import { MaterialModule } from './material.module';
import { MyDialogComponent } from '../components/my-dialog/my-dialog.component';



@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    AboutComponent,
    GeneralInfoComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    MyDialogComponent
  ],
  entryComponents: [MyDialogComponent],

  imports: [
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BuyingModule,
    MaterialModule

  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true }],
  bootstrap: [LayoutComponent]
})
export class AppModule { }
