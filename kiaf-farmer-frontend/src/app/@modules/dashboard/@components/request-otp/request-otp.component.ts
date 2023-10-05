import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FarmerCreatedResponse } from '../../@pages/create-farmer/farmer-created-response.interface';
import { Location } from '@angular/common';
import { OtpServiceService } from '../../services/otp-service.service';


@Component({
  selector: 'app-request-otp',
  templateUrl: './request-otp.component.html',
  styleUrls: ['./request-otp.component.scss']
})
export class RequestOtpComponent implements OnInit {

  state!: FarmerCreatedResponse;
  constructor(private router: Router, private location: Location, private otpService: OtpServiceService) {
  }

  mobNo = '';

  ngOnInit(): void {
    this.state = this.location.getState() as any;
    if (this.state.mobile_nos) {
      this.mobNo = this.state.mobile_nos;
    }
  }

  getNext() {
    this.otpService.requestOtp(this.state.id).subscribe(next => {
      this.router.navigateByUrl('/dashboard/verify-otp', { state: this.state });
    });
  }

}