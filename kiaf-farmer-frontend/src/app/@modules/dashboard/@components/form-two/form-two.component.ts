import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { RxFormBuilder, RxwebValidators } from '@rxweb/reactive-form-validators';
import { Subscription } from 'rxjs';
import { CreateFarmer } from '../../@pages/create-farmer/create-farmer.interface';
import { Crop, FarmerService, LiveStock } from '../../@pages/create-farmer/farmer.service';
import { getErrorForParticularField } from '../../dashboard.utils';

@Component({
  selector: 'app-form-two',
  templateUrl: './form-two.component.html',
  styleUrls: ['./form-two.component.scss']
})
export class FormTwoComponent implements OnInit {

  @Input()
  farmerData!: CreateFarmer;

  @Output()
  formReady = new EventEmitter<FormGroup>();

  @Output()
  valueChange = new EventEmitter<Partial<CreateFarmer>>();

  private subscription!: Subscription;


  submittedForm = false;
  landFormGroup!: FormGroup;
  getErrorForParticularField = getErrorForParticularField;

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  get landFormControl() { return this.landFormGroup.controls; }


  onFormSubmit() {
    this.submittedForm = true;
  }
  constructor(
    private fb: RxFormBuilder,
  ) { }

  total = 0;
  ngOnInit(): void {
    this.landFormGroup = this.fb.group({
      nonIrrigatedFarmArea: [, [
        RxwebValidators.required({message:'Required field'}),
        RxwebValidators.numeric({ message: 'Value may be zero. Max upto 2 decimals', allowDecimal: true, isFormat: true }),
      ]],
      irrigatedFarmArea: [, [
        RxwebValidators.required({message:'Required field'}),
        RxwebValidators.numeric({ message: 'Value may be zero. Max upto 2 decimals', allowDecimal: true, isFormat: true })
      ]],
      nonFarmLand: [, [
        // RxwebValidators.required({message:'Non Farm Land required'}),
        RxwebValidators.numeric({ message: 'Non Farm Land must be a digit', allowDecimal: true, isFormat: true }),
        RxwebValidators.minNumber({ value: 0, message: `Non farm land accepted range 1-100` }),
        RxwebValidators.maxNumber({ value: 100, message: `Non farm land accepted range 1-100` })

      ]],
      totalArea: [0, [
        // RxwebValidators.required({ message: '(Derived value. Must be > 0 )' })
      ]],
      surveyNo: ['', [
        RxwebValidators.required({ message: 'Survey No. required' }),
        RxwebValidators.maxLength({ value: 100, message: 'Survey limit is 100 character' })
      ]],
    });
    this.landFormGroup.controls['totalArea'].disable();

    this.subscription = this.landFormGroup.valueChanges.subscribe((value) => {
      this.total = value.nonIrrigatedFarmArea +
        value.irrigatedFarmArea;
      if (this.total > 200 || this.total < 1) {
        this.landFormGroup.controls['totalArea'].setErrors({ 'areaRange': true });
      } else {
        this.landFormGroup.controls['totalArea'].setErrors(null);
      }
      this.valueChange.emit({
        non_irrigated_farm_area: value.nonIrrigatedFarmArea ? value.nonIrrigatedFarmArea.toString() : null,
        irrigated_farm_area: value.irrigatedFarmArea ? value.irrigatedFarmArea.toString() : null,
        non_farm_land: value.nonFarmLand ? value.nonFarmLand.toString() : null,
        survey_no: value.surveyNo
      });
    });
    this.formReady.emit(this.landFormGroup);
  }

}
