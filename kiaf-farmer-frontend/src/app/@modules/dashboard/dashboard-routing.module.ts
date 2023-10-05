import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TodoComponent } from './@components/todo/todo.component';
import { ProfileUpdateComponent } from './@pages/profile-update/profile-update.component';
import { HomeComponent } from './@pages/home/home.component';
import { ResetPasswordComponent } from './@pages/reset-password/reset-password.component';
import { ViewFarmersComponent } from './@pages/view-farmers/view-farmers.component';
import { CreateFarmerComponent } from './@pages/create-farmer/create-farmer.component';
import { AgentsComponent } from './@pages/agents/agents.component';
import { RequestOtpComponent } from './@components/request-otp/request-otp.component';
import { VerifyOtpComponent } from './@components/verify-otp/verify-otp.component';
import { ImageComponent } from './@pages/image/image/image.component';

const routes: Routes = [
  {
    path: '',
    component: ImageComponent
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'todo',
    component: TodoComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'profile-update',
    component: ProfileUpdateComponent
  },
  {
    path: 'farmer',
    children: [
      { path: '', component: ViewFarmersComponent },
      { path: 'create', component: CreateFarmerComponent },
    ]
  },
  {
    path: 'agents',
    component: AgentsComponent
  },
  {
    path: 'request-otp',
    component: RequestOtpComponent
  },
  {
    path: 'verify-otp',
    component: VerifyOtpComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
