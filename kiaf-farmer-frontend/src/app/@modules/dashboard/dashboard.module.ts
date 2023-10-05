import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/@shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomeComponent } from './@pages/home/home.component';
import { ResetPasswordComponent } from './@pages/reset-password/reset-password.component';
import { TodoComponent } from './@components/todo/todo.component';
import { TodoService } from './@components/todo/todo.service';
import { ProfileUpdateComponent } from './@pages/profile-update/profile-update.component';
import { StatusCardComponent } from './@components/status-card/status-card.component';
import { ViewFarmersComponent } from './@pages/view-farmers/view-farmers.component';
import { CreateFarmerComponent } from './@pages/create-farmer/create-farmer.component';
import { AgentsComponent, Agents } from './@pages/agents/agents.component';
import { UserItemComponent } from './@components/user-item/user-item.component';
import { FarmerService } from './@pages/create-farmer/farmer.service';
import { AgentService } from './@pages/agents/agent.service';
import { FormOneComponent } from './@components/form-one/form-one.component';
import { FormTwoComponent } from './@components/form-two/form-two.component';
import { FormThreeComponent } from './@components/form-three/form-three.component';
import { RequestOtpComponent } from './@components/request-otp/request-otp.component';
import { VerifyOtpComponent } from './@components/verify-otp/verify-otp.component';
import { FarmerTileComponent } from './@components/farmer-tile/farmer-tile.component';
import { ImageComponent } from './@pages/image/image/image.component'; 



@NgModule({
  declarations: [
    HomeComponent,
    ResetPasswordComponent,
    TodoComponent,
    ProfileUpdateComponent,
    StatusCardComponent,
    ViewFarmersComponent,
    CreateFarmerComponent,
    AgentsComponent,
    UserItemComponent,
    FormOneComponent,
    FormTwoComponent,
    FormThreeComponent,
    RequestOtpComponent,
    VerifyOtpComponent,
    FarmerTileComponent,
    ImageComponent, 
  ],
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule
  ],
  providers: [TodoService, FarmerService, AgentService]
})
export class DashboardModule { }
