import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { ResendEmailVerificationLink } from 'src/app/@data/login-response.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-request-email-verification-link',
  templateUrl: './request-email-verification-link.component.html',
  styleUrls: ['./request-email-verification-link.component.scss']
})
export class RequestEmailVerificationLinkComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private httpClient: HttpClient,private nbToastrService:NbToastrService) { }
  user = {
    email: ''
  }
  loading = false;
  ngOnInit(): void {
    if (this.activatedRoute.snapshot.paramMap.get('email')) {
      this.user.email = this.activatedRoute.snapshot.paramMap.get('email') as string;
    }
  }

  submit() {
    this.loading = true;
    this.httpClient.post<ResendEmailVerificationLink>(environment.apiUrl + '/user/resend_email_verification_link/', { email: this.user.email }).subscribe((next: ResendEmailVerificationLink) => {
      this.loading = false;
      if (next.email_sent) {
        this.nbToastrService.success(next.message,"Done");
        this.router.navigate(['/auth/login']);
      }
    },err => {
      this.loading = false;
    });
  }
}