import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth.routuing';
import { SharedModule } from 'src/app/@shared/shared.module';
import { LoginComponent } from './@pages/login/login.component';
import { RegisterComponent } from './@pages/register/register.component';
import { SocialAuthComponent } from './@components/social-auth/social-auth.component';
import { EmailVerifyComponent } from './@pages/email-verify/email-verify.component';
import { RequestEmailVerificationLinkComponent } from './@pages/request-email-verification-link/request-email-verification-link.component';
import { RequestPasswordComponent } from './@pages/request-password/request-password.component';
import { UpdatePasswordComponent } from './@pages/update-password/update-password.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    SocialAuthComponent,
    EmailVerifyComponent,
    RequestEmailVerificationLinkComponent,
    RequestPasswordComponent,
    UpdatePasswordComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    
  ],
  providers: [
   
  ],
})
export class AuthModule { }
