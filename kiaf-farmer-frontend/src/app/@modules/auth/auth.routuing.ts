import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NbAuthComponent } from '@nebular/auth';
import { EmailVerifyComponent } from './@pages/email-verify/email-verify.component';
import { LoginComponent } from './@pages/login/login.component';
import { RegisterComponent } from './@pages/register/register.component';
import { RequestEmailVerificationLinkComponent } from './@pages/request-email-verification-link/request-email-verification-link.component';
import { RequestPasswordComponent } from './@pages/request-password/request-password.component';
import { UpdatePasswordComponent } from './@pages/update-password/update-password.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: NbAuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'verify-email/:token',
        component: EmailVerifyComponent
      },
      {
        path: 'request-email-verification-link/:email',
        component: RequestEmailVerificationLinkComponent
      },
      {
        path: 'request-password',
        component: RequestPasswordComponent
      },
      {
        path: 'update-password/:uid/:token',
        component: UpdatePasswordComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
