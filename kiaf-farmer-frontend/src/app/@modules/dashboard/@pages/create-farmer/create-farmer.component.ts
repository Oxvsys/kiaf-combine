import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { RxFormBuilder, RxFormGroup, RxwebValidators } from '@rxweb/reactive-form-validators';
import { CreateFarmer } from './create-farmer.interface';
import { FarmerCreatedResponse } from './farmer-created-response.interface';
import { FarmerService, Crop, LiveStock } from './farmer.service';

@Component({
  selector: 'app-create-farmer',
  templateUrl: './create-farmer.component.html',
  styleUrls: ['./create-farmer.component.scss'],
  providers: [FarmerService],
})
export class CreateFarmerComponent implements OnInit {

  fourthForm!: RxFormGroup;
  form: FormGroup = this.fb.group({});

  constructor(
    private fb: FormBuilder,
    private rxfb: RxFormBuilder,
    private farmerService: FarmerService,
    private toast: NbToastrService,
    private router: Router,
    private cd: ChangeDetectorRef,

  ) { }

  submitted4 = false;

  data: CreateFarmer = {
    first_name: '',
    fathers_name: '',
    family_name: '',
    address: '',
    pin_code: '',
    village: '',
    mobile_nos: '',
    landline: '',
    email_id: '',
    age: 0,
    irrigated_farm_area: '',
    non_irrigated_farm_area: '',
    non_farm_land: '',
    co_operative_name: '',
    survey_no: '',
    step_completed: 0,
    created_by: 0,
    crops: [],
    live_stocks: [],
  };

  ngOnInit(): void {
    this.fourthForm = <RxFormGroup>this.rxfb.group({
      coOperativeName: ['', [
        RxwebValidators.maxLength({ value: 100, message: 'Co-op. society name limit is 100 character' })
      ]],
    });

  }
  addChildForm(name: string, group: FormGroup) {
    this.form.addControl(name, group);
    this.cd.detectChanges();
  }

  onValueChange(changes: Partial<CreateFarmer>) {
    this.data = { ...this.data, ...changes };
  }
  get fourthFormControl() { return this.fourthForm.controls; }

  onFourthSubmit() {
    this.submitted4 = true;
    this.data.co_operative_name = this.fourthForm.value.coOperativeName;
    if (this.form.controls['personalFormGroup']?.valid && this.form.controls['landFormGroup']?.valid && this.form.controls['cropAreaGroup']?.valid &&
      this.form.controls['liveStockGroup']?.valid) {
      this.farmerService.createForm(this.data).subscribe((next: FarmerCreatedResponse) => {
        console.log(next);
        this.toast.success("Created Farmer", "Farmer Create successfully");
        this.router.navigateByUrl("/dashboard/request-otp", { state: next });
      }, err => {
      });
    } else {
      this.toast.danger("Please correct error on previous form", "Please Correct", { duration: 5000 });
    }
  }

  disableBtn = true;

  toggle(checkbox: boolean) {
    if (checkbox === true) {
      this.disableBtn = false;
    } else {
      this.disableBtn = true;
    }
  }
}
