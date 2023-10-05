import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbActionsModule,
  NbAlertModule,
  NbBadgeModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbContextMenuModule,
  NbDialogModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbListModule,
  NbMenuModule,
  NbSearchModule,
  NbSelectModule,
  NbSidebarModule,
  NbSpinnerModule,
  NbStepperModule,
  NbTagModule,
  NbToggleModule,
  NbUserModule
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { NbSecurityModule } from '@nebular/security';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha'; 
import { NotFoundComponent } from './components/not-found/not-found.component';
import { IsUniqueHttpValidator } from './directive/is-unique-http-validator.directive';
import { PasswordHideShowComponent } from './components/password-hide-show/password-hide-show.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';

const COMPONENTS: any[] = [
  HeaderComponent,
  AuthLayoutComponent,
  FooterComponent,
  ContentLayoutComponent, 
  IsUniqueHttpValidator,
  PaginationComponent,
  NotFoundComponent,
  PasswordHideShowComponent
]

const MODULES = [
  CommonModule,
  FormsModule,
  RouterModule,
  NbLayoutModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbContextMenuModule,
  NbSecurityModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbEvaIconsModule,
  NbCardModule,
  NbInputModule,
  NbAlertModule,
  NbCheckboxModule,
  RecaptchaModule,
  RecaptchaFormsModule,
  NbSpinnerModule,
  NbListModule,
  NbBadgeModule,
  NbToggleModule,
  NbFormFieldModule,
  NbStepperModule,
  NbDialogModule.forRoot(),
  NbTagModule,
  ReactiveFormsModule,
  RxReactiveFormsModule
]

@NgModule({
  declarations: [
    ...COMPONENTS,
    PaginationComponent,
  ],
  imports: [
    ...MODULES
  ],
  exports: [
    ...COMPONENTS,
    ...MODULES,
  ],

})
export class SharedModule {


  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
      ],
    };
  }
}
