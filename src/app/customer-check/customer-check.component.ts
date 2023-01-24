import { NgForm } from '@angular/forms';
import { Customer } from './../customers/customer';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-check',
  templateUrl: './customer-check.component.html',
  styleUrls: ['./customer-check.component.css']
})
export class CustomerCheckComponent implements OnInit {
  customer: Customer = new Customer();

  constructor() { }

  ngOnInit(): void {
  }

  submitForm(customerForm: NgForm) {
    console.log(customerForm.form);
        console.log('Saved: ' + JSON.stringify(customerForm.value));
  }

  submitNgForm(customerForm: NgForm){
    console.log(customerForm.form);
        console.log('Saved: ' + JSON.stringify(customerForm.value));
  }
}
