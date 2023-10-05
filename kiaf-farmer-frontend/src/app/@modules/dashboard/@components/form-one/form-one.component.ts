import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CreateFarmer } from '../../@pages/create-farmer/create-farmer.interface';
import { RxwebValidators, RxFormBuilder, } from '@rxweb/reactive-form-validators';
import { getErrorForParticularField } from '../../dashboard.utils';
@Component({
  selector: 'app-form-one',
  templateUrl: './form-one.component.html',
  styleUrls: ['./form-one.component.scss']
})
export class FormOneComponent implements OnInit, OnDestroy {


  @Input()
  farmerData!: CreateFarmer;

  @Output()
  formReady = new EventEmitter<FormGroup>();

  @Output()
  valueChange = new EventEmitter<Partial<CreateFarmer>>();

  private subscription!: Subscription;


  submittedForm = false;
  personalFormGroup!: FormGroup;
  getErrorForParticularField = getErrorForParticularField;

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  get personalFormControl() { return this.personalFormGroup.controls; }


  onFormSubmit() {
    this.submittedForm = true;
  }
  constructor(
    private rxfb: RxFormBuilder,
  ) { }

  ngOnInit(): void {

    this.personalFormGroup = this.rxfb.group({
      firstName: ['', [
        RxwebValidators.required({ message: "Name required" }),
        RxwebValidators.maxLength({ value: 50, message: 'Max. 50 characters' })
      ]],
      fatherName: ['', [
        RxwebValidators.required({ message: "Name required" }),
        RxwebValidators.maxLength({ value: 50, message: 'Max. 50 characters' })
      ]],
      familyName: ['', [
        RxwebValidators.required({ message: "Name required" }),
        RxwebValidators.maxLength({ value: 50, message: 'Max. 50 characters' })
      ]],
      pinCode: ['', [
        RxwebValidators.required({ message: "Pin code required" }),
        RxwebValidators.digit({ message: "Pin code must be a digit" }),
        RxwebValidators.minNumber({ value: 100000, message: "Invalid Pin code (accepted value : XXXXXX)" }),
        RxwebValidators.maxNumber({ value: 999999, message: "Invalid Pin code (accepted value : XXXXXX)" }),
      ]],
      address: ['', [
        RxwebValidators.maxLength({ value: 50, message: "Max. 50 characters" })
      ]],
      village: ['', [
        RxwebValidators.required({ message: "Village name required" }),
        RxwebValidators.maxLength({ value: 50, message: 'Max. 50 characters' })
      ]],
      mobileNo: ['', [
        RxwebValidators.required({ message: "Required field" }),
        // Todo handle async mobile valid here
        RxwebValidators.digit({ message: "Only digits" }),
        RxwebValidators.minNumber({ value: 1000000000, message: "Invalid Mobile number (accepted value : XXXXXXXXXX)" }),
        RxwebValidators.maxNumber({ value: 9999999999, message: "Invalid Mobile number (accepted value : XXXXXXXXXX)" }),
      ]],
      landlineNo: ['', [
        RxwebValidators.maxLength({ value: 12, message: 'Max. 12 characters' }),
      ]],
      age: ['',
        [
          RxwebValidators.required({ message: "Required field" }),
          RxwebValidators.digit({ message: 'Age must be integer' }),
          RxwebValidators.minNumber({ value: 18, message: "Between 18 - 99 years" }),
          RxwebValidators.maxNumber({ value: 99, message: "Between 18 - 99 years" }),
        ]
      ],
      email: ['', [
        RxwebValidators.email({ message: "Email id format invalid" }),
        RxwebValidators.maxLength({ value: 50, message: "Max. 50 characters" })
      ]],
    });

    this.subscription = this.personalFormGroup.valueChanges.subscribe((value) => {
      this.valueChange.emit({
        first_name: value.firstName,
        fathers_name: value.fatherName,
        family_name: value.familyName,
        pin_code: value.pinCode,
        address: value.address,
        village: value.village,
        mobile_nos: value.mobileNo,
        landline: value.landlineNo,
        age: value.age,
        email_id: value.email,
      });
    });
    this.formReady.emit(this.personalFormGroup);
  }





}
