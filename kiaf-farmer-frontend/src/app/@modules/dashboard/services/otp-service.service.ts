import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OtpServiceService {

  constructor(private http: HttpClient) { }

  requestOtp(id: number) {
    return this.http.get(environment.apiUrl + '/farmer/otp/', {
      params: {
        id: id.toString()
    }
    });
  }

  verifyOtp(id: number, otp: string) {
    return this.http.post(environment.apiUrl + '/farmer/otp/', { id: id, sms_otp: otp });
  }
}
