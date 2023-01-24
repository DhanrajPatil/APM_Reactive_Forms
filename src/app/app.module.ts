import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CustomerComponent } from './customers/customer.component';
import { CustomerCheckComponent } from './customer-check/customer-check.component';
import { RouterModule } from '@angular/router';
import { ReactiveCustComponent } from './reactive-cust/reactive-cust.component';

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
    RouterModule.forRoot([
      {path: 'template1', component: CustomerComponent},
      {path: 'template2', component: CustomerCheckComponent},
      {path: 'Reactive', component: ReactiveCustComponent},
      {path: '', redirectTo: 'Reactive', pathMatch: 'full'}
    ])
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
