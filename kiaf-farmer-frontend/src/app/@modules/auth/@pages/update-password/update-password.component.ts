import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/@core/services/auth.service';
import { UpdatePasswordConfirmResponse, UpdatePasswordResponse } from 'src/app/@data/login-response.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {

  user = {
    password: '',
    confirmPassword: '',
    uidb64: '',
    token: ''
  }
  loading = false;
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private auth: AuthService, private http: HttpClient) { }

  ngOnInit(): void {
    this.user.uidb64 = this.activatedRoute.snapshot.paramMap.get('uid') as string;
    this.user.token = this.activatedRoute.snapshot.paramMap.get('token') as string;
    this.http.get(environment.apiUrl + '/user/password_reset/' + this.user.uidb64 + '/' + this.user.token + '/').subscribe(next => {
      const response = next as UpdatePasswordResponse;
      console.log(response);
    })
  }

  updatePassword() {
    this.loading = true;
    this.auth.resetPassword(this.user).subscribe(next => {
      this.loading = false;
      const response = next as UpdatePasswordConfirmResponse;
      this.loading = false;
      this.router.navigate(['/auth/login']);
    },err => {
      this.loading = false;
    })
  }

}
