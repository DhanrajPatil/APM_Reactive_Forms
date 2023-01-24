import { Customer } from './../customers/customer';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';


const errMessagesApi: { [key: string]: { [key: string]: string } } = {
    firstName: {
        required: 'Please enter the first name',
        minlength: 'Please enter the min 3 characters'
    },
    lastName: {
        required: 'Please enter the last name',
        maxlength: 'You should enter the maximum 15 characters'
    },
    email: {
        required: 'Please enter the email',
        email: 'Please enter valid email id'
    },
    phone: {
        required: 'Please enter the mobile number',
        pattern: 'Please enter valid mobile number'
    },
    birthDate: {
        minAge: 'Age should be atleast 18 years',
        required: 'please enter the birth date'
    }
};

function minimumAge(control: AbstractControl): { [key: string]: boolean } | null {
    const minAge = 18;
    if(control.value) {
        const value = new Date(control.value);
        const today = new Date();
        let dateShouldBe = new Date();
        dateShouldBe.setFullYear(today.getFullYear() - minAge);
        if(value <= dateShouldBe) {
            return null;
        }
        return {minAge: true};
    }
    return {required: true};
}

@Component({
    selector: 'app-reactive-cust',
    templateUrl: './reactive-cust.component.html',
    styleUrls: ['./reactive-cust.component.css']
})
export class ReactiveCustComponent implements OnInit, OnDestroy {
    customerForm!: FormGroup;
    formValue!: Customer;
    rawValue!: Customer;
    errorMsgs: { [key: string]: string | null} = {};
    subscriptions: {[key: string]: Subscription | undefined} = {};

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
        this.customerForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(3)]],
            lastName: [{ value: 'Pattalikudam', disabled: true }, [Validators.required, Validators.maxLength(15)]],
            email: ['', [Validators.required, Validators.email]],
            notifyVia: 'email',
            birthDate: ['', [minimumAge]],
            phone: '',
            sendCatalogue: [true]
        });

        Object.keys(this.customerForm.controls).forEach((key: string) => {
            if(this.customerForm.get(key)?.validator) {
                this.addSubscriptionForControl(this.customerForm.get(key), key);
            }
        });

        let notifyControl = this.customerForm.get('notifyVia');
        notifyControl?.valueChanges.subscribe(
            (val) => this.setNotification(val)
        );
    }

    ngOnDestroy(): void {
        Object.keys(this.customerForm.controls).forEach((key: string) => {
            this.removeSubscriptionForControl(key);
        });
    }

    addSubscriptionForControl(control: AbstractControl | null, controlName: string) {
        this.subscriptions[controlName] = control?.valueChanges.subscribe(
            () => this.validateControl(control, controlName)
        );
    }

    removeSubscriptionForControl(controlName: string) {
        this.subscriptions[controlName]?.unsubscribe();
    }

    onSubmit() {
        console.log('Inside Submit');
        console.log(this.customerForm);
        console.log(this.customerForm.value);
        console.log(this.customerForm.getRawValue());
        console.log(this.customerForm.controls);
        console.log('End Submit');
    }

    setTestData() {
        this.customerForm.setValue({
            firstName: 'Dh',
            lastName: 'Patil',
            email: 'dhiraj@patel.com',
            sendCatalogue: false,
            notifyVia: 'email',
            phone: '',
            birthDate: '2015-07-05'
        });
        console.log(this.customerForm.status);
        console.log(this.customerForm);
    }

    patchData() {
        this.customerForm.patchValue({
            sendCatalogue: true,
            lastName: 'Patel',
        });
    }

    clearData() {
        this.customerForm.reset();
    }

    getRawValue() {
        this.rawValue = this.customerForm.getRawValue();
    }

    getValue() {
        this.formValue = this.customerForm.value;
    }

    setNotification(way: string) {
        let phoneControl = this.customerForm.get('phone');
        if (way === 'email') {
            phoneControl?.clearValidators();
            this.removeSubscriptionForControl('phone');
        } else if (way === 'text') {
            phoneControl?.setValidators([Validators.required, Validators.pattern("[0-9]{2}-[0-9]{9,12}")]);
            this.addSubscriptionForControl(phoneControl, 'phone');
        }
        phoneControl?.updateValueAndValidity();
    }

    validateControl(con: AbstractControl | null, controlName: string) {
        if (con && (con.touched || con.dirty) && !con.valid) {
            if(con.errors) {
                Object.keys(con.errors).forEach(key => {
                    this.errorMsgs[controlName] = errMessagesApi[controlName][key];
                });
            }
        }  else {
            this.errorMsgs[controlName] = null;
        }
    }
}
