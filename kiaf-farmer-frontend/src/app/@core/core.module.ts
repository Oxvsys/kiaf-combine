import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './guard/auth.guard';
import { NoAuthGuard } from './guard/no-auth.guard';
import { throwIfAlreadyLoaded } from './guard/module-import.guard';
import { NbAuthJWTToken, NbAuthModule, NbAuthService, NbPasswordAuthStrategy } from '@nebular/auth';
import { NbSecurityModule } from '@nebular/security';
import {
  NbActionsModule,
  NbCardModule,
  NbContextMenuModule,
  NbIconModule,
  NbLayoutModule,
  NbMenuModule,
  NbSearchModule,
  NbSelectModule,
  NbSidebarModule,
  NbThemeModule,
  NbToastrModule,
  NbUserModule
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AuthService } from './services/auth.service';
import { LocalStorageService } from './services/local-storage.service';
import { environment } from 'src/environments/environment';
import { TokenInterceptor } from './interceptor/token.interceptor';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { CustomHttpErrorInterceptor } from './interceptor/custom-http-error.interceptor';
import { PwaService } from './services/pwaservice.service';
import { IsOnlineService } from './services/is-online.service';


const socialLinks = [
  {
    url: 'https://github.com/akveo/nebular',
    target: '_blank',
    icon: 'github',
  },
  {
    url: 'https://www.facebook.com/akveo/',
    target: '_blank',
    icon: 'facebook',
  },
  {
    url: 'https://twitter.com/akveo_inc',
    target: '_blank',
    icon: 'twitter',
  },
];

export const NB_CORE_PROVIDERS = [];

const DECLARATIONS: any[] = [
]

@NgModule({
  imports: [
    HttpClientModule,
    NbIconModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbToastrModule.forRoot(),
    NbLayoutModule,
    NbMenuModule,
    NbSidebarModule,
    NbEvaIconsModule,
    NbActionsModule,
    NbSelectModule,
    NbSearchModule,
    NbUserModule,
    NbContextMenuModule,
    NbCardModule,
    SocialLoginModule,
    NbAuthModule.forRoot()
  ],
  declarations: [
    ...DECLARATIONS,
  ],
  providers: [
    AuthGuard,
    NoAuthGuard,
    AuthService,
    // NbAuthService,
    LocalStorageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }, {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomHttpErrorInterceptor,
      multi: true
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '667211677357-89cvrbt048k04vc0g7pm0c1bpcl6srep.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('820327078896132')
          }
        ]
      } as SocialAuthServiceConfig,
    },
    PwaService,
    IsOnlineService


  ],
  exports: [
    // NbAuthModule,
    ...DECLARATIONS
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }


  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: NB_CORE_PROVIDERS,
    };
  }

}
