import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from 'src/app/@core/services/auth.service';
import { DestroySubscribers } from 'src/app/@shared/decorators/destroySubscriber';

@Component({
  selector: 'app-social-auth',
  templateUrl: './social-auth.component.html',
  styleUrls: ['./social-auth.component.scss']
})
@DestroySubscribers()
export class SocialAuthComponent implements OnInit {
  public subscribers:any ={};
  loading = false;

  constructor(private authService: AuthService, private router: Router, private socialAuthService: SocialAuthService) { }

  ngOnInit(): void {
  }

  signInWithGoogle() {
    this.loading = true;
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.subscribers.googleSocialAuth = this.socialAuthService.authState.pipe(distinctUntilChanged()).subscribe((user) => {
      if (user) {
        this.subscribers.googleApi = this.authService.signInWithGoogle(user.idToken).subscribe(next => {
          this.loading = false;
          if (next) {
            this.router.navigate(['/dashboard']);
          }
        })
      }
    },
    (err) => {
      this.loading = false;
    }
    )
  }

  signInWithFacebook() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.subscribers.fbSocialAuth = this.socialAuthService.authState.pipe(distinctUntilChanged()).subscribe((user) => {
      if (user){
        this.subscribers.fbApi = this.authService.signInWithFacebook(user.authToken).subscribe(next => {
          if (next) {
            this.router.navigate(['/dashboard']);
          }
        })
      }
    })
  }

}
