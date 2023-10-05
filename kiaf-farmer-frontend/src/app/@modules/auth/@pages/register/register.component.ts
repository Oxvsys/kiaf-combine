import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { AuthService } from 'src/app/@core/services/auth.service';
import { PASS_MIN, PASS_MAX } from '../../auth.config';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(
    private nbToastService:NbToastrService,
    private router: Router,
    private authService: AuthService
  ) { }
  PASS_MIN = PASS_MIN;
  PASS_MAX = PASS_MAX;
  showPassword = false;
  showPassword2 = true;

  // min = 5;
  // max = 15;
  // passwordData = '';

  // getInputType() {
  //   if (this.showPassword) {
  //     return 'text';
  //   }
  //   return 'password';
  // }

  getInputType2() {
    if (this.showPassword2) {
      return 'text';
    }
    return 'password';
  }

  // toggleShowPassword() {
  //   this.showPassword = !this.showPassword;
  // }

  toggleShowPassword2() {
    this.showPassword2 = !this.showPassword2;
  }

  ngOnInit(): void {
  }
  loading = false;
  submitted = false;
  rememberMe = false;
  showMessages = false;
  messages = [];
  errors = [];
  socialLinks = [];
  user = {
    email: '',
    name: '',
    password: '',
    password2: '',
    recaptcha: '',
    confirmPassword: ''
  }

  register() {
    this.loading = true;
    this.authService.register(this.user).subscribe(next => {
      this.loading = false;
      this.user.recaptcha = "";
      let config = { status: 'success', duration: 5000 };
      this.nbToastService.show('User created successfully! Please verify your email', 'Successfully Created Account', config);
      this.router.navigate(['/auth/login']);
    }, err => {
      this.user.recaptcha = "";
      this.loading = false;
    })
  }
}
