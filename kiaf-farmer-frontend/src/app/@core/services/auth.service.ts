import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import jwt_decode from "jwt-decode";
import { LoginResponse } from '../../@data/login-response.interface';
import { User } from '../../@data/user.interface';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private localStorageService: LocalStorageService, private router:Router, private socialAuthService: SocialAuthService) { }


  user$ = new BehaviorSubject({});


  login(form: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.baseUrl}/api/token/`, form)
      .pipe(
        tap((response: LoginResponse) => {
          this.user$.next(jwt_decode(response.access) as User);
          this.localStorageService.setItem("access", response.access);
          this.localStorageService.setItem("refresh", response.refresh);
        })
      );
  }

  register(form: { email: string; name: string; password: string, recaptcha: string }) {
    return this.http.post(`${environment.apiUrl}/user/register/`, form)
  }

  // createTodo(todoItem: TodoCreate) {
  //   return this.http.post(environment.apiUrl + '/todo/', todoItem);
  // }

  logout(): void {
    this.localStorageService.removeItem('access');
    this.localStorageService.removeItem('refresh');

    if(this.localStorageService.getItem('social-login')===true){
      this.localStorageService.removeItem('social-login');
      this.socialAuthService.signOut().then().catch();
    }

    this.user$.next({});
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<{ access: string }> {
    const refreshToken = this.localStorageService.getItem('refresh'); return this.http.post<{ accessToken: string; refreshToken: string }>(
      `${environment.baseUrl}/api/token/refresh/`,
      {
        refresh: refreshToken
      }).pipe(
        tap((response: any) => {
          this.localStorageService.setItem("access", response.access);
        })
      );
  }

  getCurrentUser(): Observable<User | null> {
    try {
      let accessToken = this.localStorageService.getItem("access");
      return of(jwt_decode(accessToken) as User)
    } catch (error) {
      return of(null);
    }
  }

  getCurrentUser2(): User | null {
    try {
      let accessToken = this.localStorageService.getItem("access");
      return jwt_decode(accessToken) as User
    } catch (error) {
      return null;
    }
  }

  signInWithGoogle(auth_token: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/social_auth/google/`, { auth_token: auth_token })
      .pipe(
        tap((response: LoginResponse) => {
          this.user$.next(jwt_decode(response.access) as User);
          this.localStorageService.setItem("social-login", true);
          this.localStorageService.setItem("access", response.access);
          this.localStorageService.setItem("refresh", response.refresh);
        })
      );
  }

  signInWithFacebook(auth_token: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/social_auth/facebook/`, { auth_token: auth_token })
      .pipe(
        tap((response: LoginResponse) => {
          this.user$.next(jwt_decode(response.access) as User);
          this.localStorageService.setItem("social-login", true);
          this.localStorageService.setItem("access", response.access);
          this.localStorageService.setItem("refresh", response.refresh);
        })
      );
  }

  changePassword(form: { old_password: string, new_password: string }) {
    return this.http.patch(`${environment.apiUrl}/user/change_password/`, form)
  }

  sendEmail(form: { email: string }) {
    return this.http.post(`${environment.apiUrl}/user/request_reset_email/`, form)
  }

  resetPassword(form: { password: string, uidb64: string, token: string}){
    return this.http.patch(`${environment.apiUrl}/user/password_reset_complete/`, form)
  }


}
