import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-email-verify',
  templateUrl: './email-verify.component.html',
  styleUrls: ['./email-verify.component.scss']
})
export class EmailVerifyComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private httpClient: HttpClient) { }

  token = '';
  response: any;

  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.paramMap.get('token') as string;
    let params = new HttpParams().append('token', this.token);
    this.httpClient.get(environment.apiUrl + '/user/verify_email/', { params: params }).subscribe(next => {
      this.response = next;
      this.router.navigate(['/auth/login']);
    })
  }

}