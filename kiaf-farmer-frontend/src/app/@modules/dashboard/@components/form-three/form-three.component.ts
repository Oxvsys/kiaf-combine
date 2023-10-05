import { EventEmitter, Output } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbStepperComponent } from '@nebular/theme/public_api';
import { RxFormBuilder, RxFormGroup, RxwebValidators } from '@rxweb/reactive-form-validators';
import { forkJoin, Subscription } from 'rxjs';
import { CreateFarmer } from '../../@pages/create-farmer/create-farmer.interface';
import { Crop, FarmerService, LiveStock } from '../../@pages/create-farmer/farmer.service';
import { getErrorForParticularField } from '../../dashboard.utils';

@Component({
  selector: 'app-form-three',
  templateUrl: './form-three.component.html',
  styleUrls: ['./form-three.component.scss']
})
export class FormThreeComponent implements OnInit {

  @Input()
  farmerData!: CreateFarmer;

  @Output()
  formReadyCrop = new EventEmitter<FormGroup>();

  @Output()
  formReadyLiveStock = new EventEmitter<FormGroup>();

  @Output()
  valueChange = new EventEmitter<Partial<CreateFarmer>>();

  // private subscription!: Subscription;
  // private subscription!: Subscription;

  @Input()
  stepperRef!: NbStepperComponent;

  submittedForm = false;
  cropGroup!: RxFormGroup;
  liveStockGroup!: RxFormGroup;

  // cropNLiveStockFormGroup=this.fb.group({
  //   cropGroup:this.fb.group({}),
  //   liveStockGroup:this.fb.group({}),
  // });
  getErrorForParticularField = getErrorForParticularField;

  ngOnDestroy() {
    // if (this.subscription) {
    //   this.subscription.unsubscribe();
    // }
  }
  allowedArea = 0;
  cropArea = 0;
  areaError = false;
  onFormSubmit(e: Event) {
    if (this.cropGroup && this.liveStockGroup) {
      // LIVE STOCKS
      let live_stocks: any = [];
      Object.entries(this.liveStockGroup.value).forEach(obj => {
        if (obj[1]) {
          live_stocks.push(
            {
              live_stock_id: parseInt(obj[0]),
              count: parseInt(obj[1] as string)
            }
          )
        }
      })
      // CROPS
      let crops: any = [];
      this.cropArea =0;
      Object.entries(this.cropGroup.value).forEach(obj => {
        if (obj[1]) {
          let cArea = obj[1] ? parseFloat(obj[1] as any) : 0;
          this.cropArea += cArea;
          crops.push(
            {
              crop_id: parseInt(obj[0]),
              area: parseInt(obj[1] as string)
            }
          )
        }
      })
      let ifa = this.farmerData.irrigated_farm_area ? parseFloat(this.farmerData.irrigated_farm_area) : 0;
      let nifa = this.farmerData.non_irrigated_farm_area ? parseFloat(this.farmerData.non_irrigated_farm_area) : 0;
      // let nfa = this.farmerData.non_farm_land ? parseFloat(this.farmerData.non_farm_land) : 0
      this.allowedArea = ifa + nifa;
      // console.log(this.allowedArea);
      
      this.submittedForm = true;
      if (this.cropArea > this.allowedArea) {
        // console.log("Adds error");
        this.areaError = true;
        return;
      } else {
        this.areaError = false;
      }
      this.valueChange.emit({ live_stocks: live_stocks, crops: crops });
    }
    this.stepperRef.next();
    ;
  }

  crops: Crop[] = [];
  liveStock: LiveStock[] = [];
  // other = 0;
  constructor(
    private fb: RxFormBuilder,
    private farmerService: FarmerService
  ) { }

  ngOnInit(): void {
    forkJoin({
      crops: this.farmerService.getAllCrops(),
      liveStock: this.farmerService.getAllLiveStock(),
    }).subscribe(next => {
      this.cropGroup = <RxFormGroup>this.fb.group(
        Object.assign({}, ...next.crops.map((x) => (
          {
            [x.id]: [, [
              // RxwebValidators.required({ message: `${x.crop_name} ( ${x.crop_name_mr} ) is required` }),
              RxwebValidators.numeric({ message: `${x.crop_name} ( ${x.crop_name_mr} ) must be digit`, allowDecimal: true, isFormat:true }),
              RxwebValidators.minNumber({ value: 0, message: `${x.crop_name} ( ${x.crop_name_mr} ) accepted range 1-200` }),
              RxwebValidators.maxNumber({ value: 200, message: `${x.crop_name} ( ${x.crop_name_mr} ) accepted range 1-200` })
            ]]
          }
        )))
      );
      this.crops = next.crops;

      this.liveStockGroup = <RxFormGroup>this.fb.group(
        Object.assign({}, ...next.liveStock.map((x) => (
          {
            [x.id]: [, [
              // RxwebValidators.required({ message: `${x.live_stock_name} ( ${x.live_stock_name_mr} ) is required` }),
              RxwebValidators.numeric({ message: `Nos of ${x.live_stock_name} ( ${x.live_stock_name_mr} ) must be a number`, allowDecimal: false }),
              RxwebValidators.minNumber({ value: 0, message: `${x.live_stock_name} ( ${x.live_stock_name_mr} ) accepted range 1-200` }),
              RxwebValidators.maxNumber({ value: 200, message: `${x.live_stock_name} ( ${x.live_stock_name_mr} ) accepted range 1-200` })
            ]]
          }
        )))
      );
      this.crops = next.crops;
      this.liveStock = next.liveStock;
      this.cropGroup.valueChanges.subscribe(value => {
        let crops: any = [];
        this.cropArea = 0;
        Object.entries(value).forEach(obj => {
          let cArea = obj[1] ? parseFloat(obj[1] as any) : 0;
          this.cropArea += cArea;
          crops.push(
            { crop_id: parseInt(obj[0]), area: parseFloat(obj[1] as any) }
          )
        })
        let ifa = this.farmerData.irrigated_farm_area ? parseFloat(this.farmerData.irrigated_farm_area) : 0;
        let nifa = this.farmerData.non_irrigated_farm_area ? parseFloat(this.farmerData.non_irrigated_farm_area) : 0;
        // let nfa = this.farmerData.non_farm_land ? parseFloat(this.farmerData.non_farm_land) : 0
        this.allowedArea = ifa + nifa;
        if (this.cropArea > this.allowedArea) {
          // console.log("Adds error");
          this.areaError = true;
        } else {
          this.areaError = false;
        }  
      })
      this.formReadyCrop.emit(this.cropGroup);
      this.formReadyLiveStock.emit(this.liveStockGroup);
    });

  }

  get others(){
    let ifa = this.farmerData.irrigated_farm_area ? parseFloat(this.farmerData.irrigated_farm_area) : 0;
      let nifa = this.farmerData.non_irrigated_farm_area ? parseFloat(this.farmerData.non_irrigated_farm_area) : 0;
      // let nfa = this.farmerData.non_farm_land ? parseFloat(this.farmerData.non_farm_land) : 0
      this.allowedArea = ifa + nifa;
    return  this.allowedArea-this.cropArea;
  }
}