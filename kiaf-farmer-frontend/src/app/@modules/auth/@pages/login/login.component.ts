import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getDeepFromObject, NB_AUTH_OPTIONS } from '@nebular/auth';
import { AuthService } from 'src/app/@core/services/auth.service';
import { DestroySubscribers } from 'src/app/@shared/decorators/destroySubscriber';
import { PASS_MAX, PASS_MIN } from '../../auth.config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
@DestroySubscribers()
export class LoginComponent implements OnInit {

  public subscribers: any = {};
  constructor(private router: Router, private authService: AuthService, @Inject(NB_AUTH_OPTIONS) protected options = {}) { }

  // showPassword = false;

  // getInputType() {
  //   if (this.showPassword) {
  //     return 'text';
  //   }
  //   return 'password';
  // }

  // toggleShowPassword() {
  //   this.showPassword = !this.showPassword;
  // }

  MIN = PASS_MIN;
  MAX = PASS_MAX;

  ngOnInit(): void {
    this.subscribers.userService = this.authService.getCurrentUser().subscribe(next => {
      if (next) {
        this.router.navigate(['/dashboard']);
      }
    })
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
    password: '',
    rememberMe: false
  }

  login() {
    this.loading = true;
    this.authService.login(this.user).subscribe(next => {
      this.loading = false;
      this.router.navigate(['/dashboard']);
    }, err => {
      this.loading = false;
    })
  }
  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }

}
