import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CustomerFormCheckGuard } from './customer-form-check/customer-form-check.guard';
import { CustomerFormCheck2Guard } from './customer-form-check/customer-form-check2.guard';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CustomerComponent } from './customers/customer.component';
import { CustomerCheckComponent } from './customer-check/customer-check.component';
import { RouterModule } from '@angular/router';
import { ReactiveCustComponent } from './reactive-cust/reactive-cust.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    CustomerComponent,
    CustomerCheckComponent,
    ReactiveCustComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    RouterModule.forRoot([
      {path: 'template1', component: CustomerComponent},
      {path: 'template2', component: CustomerCheckComponent},
      {path: 'Reactive', component: ReactiveCustComponent, canDeactivate: [CustomerFormCheck2Guard]},
      {path: '', redirectTo: 'Reactive', pathMatch: 'full'}
    ]),
    BrowserAnimationsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
