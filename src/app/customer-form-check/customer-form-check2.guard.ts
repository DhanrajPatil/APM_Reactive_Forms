import { ReactiveCustComponent } from './../reactive-cust/reactive-cust.component';
import { Injectable } from '@angular/core';
import { CanDeactivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerFormCheck2Guard implements CanDeactivate<ReactiveCustComponent> {
  canDeactivate(
    component: ReactiveCustComponent): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(component.customerForm.dirty) {
        if(confirm('Navigating away from this form will loose al the data in the form?')){
          return true;
        } else {
          return false;
        }
      }
      return true;
  }
  
}
