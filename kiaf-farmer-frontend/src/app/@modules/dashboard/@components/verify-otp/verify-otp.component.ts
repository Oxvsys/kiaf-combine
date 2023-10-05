import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FarmerCreatedResponse } from '../../@pages/create-farmer/farmer-created-response.interface';
import { OtpServiceService } from '../../services/otp-service.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss']
})
export class VerifyOtpComponent implements OnInit {

  state!: FarmerCreatedResponse;
  otp = '';
  constructor(private router: Router, private location: Location, private otpService: OtpServiceService) {
  }

  ngOnInit(): void {
    this.state = this.location.getState() as any;
  }

  goToDashboard() {
    this.otpService.verifyOtp(this.state.id, this.otp).subscribe(next => {
      this.router.navigateByUrl('/dashboard');
    });
  }

}
