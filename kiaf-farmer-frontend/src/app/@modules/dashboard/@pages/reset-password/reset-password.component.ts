import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/@core/services/auth.service';
import { ChangePasswordResponse } from 'src/app/@data/login-response.interface';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  user = {
    old_password: '',
    new_password: '',
  }
  loading = false;
  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  changePassword() {
    this.loading = true;
    this.auth.changePassword(this.user).subscribe(next => {
      this.loading = false;
      const response = next as ChangePasswordResponse;
      this.auth.logout();      
    },err => {
      this.loading = false;
    })
  }

}
