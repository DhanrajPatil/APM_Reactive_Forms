import { WorkExperience } from './../customers/WorkExperience';
import { distinctUntilChanged } from 'rxjs/operators';
import { Customer } from './../customers/customer';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    },
    startYear: {
        required: 'please enter the start year'
    },
    endYear: {
        required: 'please enter the end year'
    },
    educationSpan: {
        dateRange: 'Start year should be earlier than the end year'
    },
    workExperiences: {
        moreThan1CurrentCompanies: 'User better have single current company',
        dateRange: 'End date should be greater than the start date'
    },
    company: {
        required: 'please enter the company name'
    },
    startDate: {
        required: 'please enter the start date'
    },
    endDate: {
        required: 'please enter the end date'
    }
};

function birthDateMinimumAgeValidationCreator(minAge: number) {
    return (control: AbstractControl): { [key: string]: boolean } | null  => {
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
}

function dateComparisionValidatorCreator(startControlKey: string, endControlKey: string) {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const startYear = control.get(startControlKey)?.value;
        const endYear = control.get(endControlKey)?.value;
        if(startYear && endYear) {
            if(startYear < endYear) {
                return null;
            }
            return {dateRange: true};
        }
        return null;
    }
}

function singleWorkExperienceValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const isThisCurrentCompany = control.get('isThisCurrentCompany')?.value;
    const endDate = control.get('endDate')?.value;
    const startDate = control.get('startDate')?.value;
    if(!startDate) {
        return {startDateMissing: true};
    } else if(!isThisCurrentCompany && !endDate) {
        return {endDateMissing: true};
    } else if(startDate && endDate) {
        if(startDate < endDate) {
            return null;
        }
        return {dateRange: true};
    }
    return null;
}

function allWorkExperienceValidator(workExperiences: AbstractControl): { [key: string]: boolean } | null {
    let newWorkExperiences: FormArray = workExperiences as FormArray;
    if(newWorkExperiences.controls.length > 0) {
        let currentCompanies = 0;
        newWorkExperiences.controls.forEach( currentExperience => {
            let isCurrent = currentExperience.get('isThisCurrentCompany')?.value;
            currentCompanies = isCurrent ? currentCompanies + 1 : currentCompanies;
        });
        if(currentCompanies > 1) {
            return {moreThan1CurrentCompanies: true}
        } else {
            return null;
        }
    }
    return null;
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
    subscriptions: {[key: string]:  Subscription | undefined} = {};
    experiencesAccordians: boolean[] = [];

    constructor(private fb: FormBuilder) { }

    get workExperiences(): FormArray {
        return <FormArray>this.customerForm.get('workExperiences');
    }

    ngOnInit(): void {
        this.customerForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(3)]],
            lastName: [{ value: 'Pattalikudam', disabled: true }, [Validators.required, Validators.maxLength(15)]],
            email: ['', [Validators.required, Validators.email]],
            notifyVia: 'email',
            birthDate: ['', [ birthDateMinimumAgeValidationCreator(18)]],
            educationSpan: this.fb.group({
                startYear: ['', Validators.required],
                endYear: ['', Validators.required]
            }, {validators: [dateComparisionValidatorCreator('startYear', 'endYear')]}),
            phone: '',
            sendCatalogue: [true],
            workExperiences: this.fb.array([this.buildWorkExperienceObject(0)], [allWorkExperienceValidator]),
        });

        this.subscribeValueChangesForControls(this.customerForm.controls, this.customerForm);

        let notifyControl = this.customerForm.get('notifyVia');
        notifyControl?.valueChanges.pipe(
            distinctUntilChanged()
        ).subscribe(
            (val) => this.setNotification(val)
        );
    }

    getControlId(conrolName: string, index: number) {
        return conrolName + index;
    }

    buildWorkExperienceObject (index: number) {
        this.experiencesAccordians[index] = true;
        return this.fb.group({
            company: ['', Validators.required ],
            startDate: ['', Validators.required ],
            endDate: ['', Validators.required ],
            isThisCurrentCompany: false
        }, {validators: [singleWorkExperienceValidator]});
    }

    toggleExperiencesAccordians(index: number) {
        this.experiencesAccordians[index] = !this.experiencesAccordians[index];
    }

    addWorkExperience() {
        const currentLength = this.workExperiences.length;
        const newExperience: FormGroup = this.buildWorkExperienceObject(currentLength);
        this.workExperiences?.push(newExperience);
        this.addSubscriptionForControl(newExperience, 'workExperiences', currentLength);
        this.subscribeValueChangesForControls(newExperience.controls, newExperience, currentLength);
    }

    deleteExperience(index: number, event: Event) {
        this.workExperiences?.removeAt(index);
        event.stopPropagation();
    }

    subscribeValueChangesForControls(controls: {[key: string]: AbstractControl | null}, currentFormGroup: FormGroup, index?: number) {
        Object.keys(controls).forEach((key: string) => {
            let control = currentFormGroup.get(key);
            if(control?.validator) {
                if(index !== undefined) {
                    this.addSubscriptionForControl(currentFormGroup.get(key), key, index);
                } else {
                    this.addSubscriptionForControl(currentFormGroup.get(key), key);
                }
            }
            if(control && control instanceof FormGroup) {
                this.subscribeValueChangesForControls(control.controls, control);
            }
            if(control && control instanceof FormArray){
                control.controls.forEach( (con, index) => {
                    if(con && con instanceof FormGroup) {
                        if(con?.validator) {
                            this.addSubscriptionForControl(con, key, index);
                        }
                        this.subscribeValueChangesForControls(con.controls, con, index);
                    } else {
                        this.addSubscriptionForControl(con, key, index);
                    }
                });
            }
        });
    }

    ngOnDestroy(): void {
        Object.keys(this.subscriptions).forEach((key: string) => {
            this.removeSubscriptionForControl(key);
        });
    }

    addSubscriptionForControl(control: AbstractControl | null, controlName: string, index?: number) {
        const completeName = index !== undefined ? controlName + index : controlName;
        this.subscriptions[completeName] = control?.valueChanges.subscribe(
            () => {
                this.validateControl(control, controlName, index);
            }
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
            birthDate: '2015-07-05',
            educationSpan: {
                startYear: '2015-07',
                endYear: '2015-06'
            },
            workExperiences: [ {
                company: 'Barclays',
                startDate: '2017-08-27',
                endDate: '2023-01-24'
            }]
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
            this.subscriptions['phone'] ? this.removeSubscriptionForControl('phone') : null;
        } else if (way === 'text') {
            phoneControl?.setValidators([Validators.required, Validators.pattern("[0-9]{2}-[0-9]{9,12}")]);
            this.addSubscriptionForControl(phoneControl, 'phone');
        }
        phoneControl?.updateValueAndValidity();
    }

    validateControl(con: AbstractControl | null, controlName: string, index?: number) {
        const completeName = index !== undefined ? controlName + index : controlName;
        if (con && (con.touched || con.dirty) && !con.valid) {
            if(con.errors) {
                Object.keys(con.errors).forEach(key => {
                    this.errorMsgs[completeName] = errMessagesApi[controlName]?.[key];
                });
                console.log(this.errorMsgs);
            } else {
                this.errorMsgs[completeName] = null;
            }
        }  else {
            this.errorMsgs[completeName] = null;
        }
    }

    isExperienceDisabled() {
        return this.workExperiences.controls.length === 1;
    }
}
