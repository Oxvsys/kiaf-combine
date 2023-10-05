import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { AuthService } from 'src/app/@core/services/auth.service';
import { ForgotPasswordEmailResponse } from 'src/app/@data/login-response.interface';

@Component({
  selector: 'app-request-password',
  templateUrl: './request-password.component.html',
  styleUrls: ['./request-password.component.scss']
})
export class RequestPasswordComponent implements OnInit {

  user = {
    email: ''
  }
  loading = false;
  constructor(private auth: AuthService, private router: Router,private nbToastrService:NbToastrService) { }

  ngOnInit(): void {
  }

  sendEmail() {
    this.loading = true;
    this.auth.sendEmail(this.user).subscribe(next => {
      this.loading = false;
      const response = next as ForgotPasswordEmailResponse;
      this.nbToastrService.success(response.message,"Please check your email",{duration:5000});
      this.router.navigate(['/auth/login']);
    },err => {
      this.loading = false;
    })
  }

}
