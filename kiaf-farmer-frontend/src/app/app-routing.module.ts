import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './@core/guard/auth.guard';
import { ImageComponent } from './@modules/dashboard/@pages/image/image/image.component';
import { NotFoundComponent } from './@shared/components/not-found/not-found.component';
import { AuthLayoutComponent } from './@shared/layout/auth-layout/auth-layout.component';
import { ContentLayoutComponent } from './@shared/layout/content-layout/content-layout.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: '',
    component: ContentLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./@modules/dashboard/dashboard.module').then(m => m.DashboardModule)
      }
    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./@modules/auth/auth.module').then(m => m.AuthModule)
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
