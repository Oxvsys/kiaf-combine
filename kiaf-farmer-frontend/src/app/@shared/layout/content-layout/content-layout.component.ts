import { Component, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuItem, NbMenuService, NbSidebarService, NbThemeService, NbToastRef, NbToastrService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/@core/services/auth.service';
import { IsOnlineService } from 'src/app/@core/services/is-online.service';
import { USER_TYPE } from 'src/app/@data/user.interface';
import { DestroySubscribers } from '../../decorators/destroySubscriber';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss']
})
@DestroySubscribers()
export class ContentLayoutComponent implements OnInit {

  public subscribers: any = {};
  hideMenuOnClick: boolean = false;


  constructor(
    private sideBarService: NbSidebarService,
    private menuService: NbMenuService,
    private breakpointService: NbMediaBreakpointsService,
    private themeService: NbThemeService,
    private isOnline: IsOnlineService,
    private toast: NbToastrService,
    private authService: AuthService
  ) {
    const { xl } = this.breakpointService.getBreakpointsMap();
    const { is } = this.breakpointService.getBreakpointsMap();
    this.subscribers.mediaQuery = this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint))
      .subscribe(currentBreakpoint => {
        this.hideMenuOnClick = currentBreakpoint.width <= is;
      });
    // ...
    this.subscribers.menuService = this.menuService.onItemClick().subscribe(() => {
      if (this.hideMenuOnClick) {
        this.sideBarService.collapse('menu-sidebar');
      }
    });
  }
  toastRef: NbToastRef | undefined;
  ngOnInit(): void {
    this.subscribers.isOnline = this.isOnline.isOnlineSubject.subscribe(next => {
      if (!next) {
        this.toastRef = this.toast.danger('Oops! No Internet', 'You are offline', { duration: 0, destroyByClick: false });
      } else {
        if (this.toastRef) {
          this.toastRef.close();
        }
      }
    })

    this.authService.getCurrentUser().subscribe(next => {
      if (next?.user_type == USER_TYPE.agentAdmin) {
        this.menu.push(
          {
            title: 'Agents',
            icon: 'people-outline',
            link: '/dashboard/agents',
            home: true,
          }
        );
      }
    })
  }

  menu: NbMenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'home-outline',
      link: '/dashboard',
      home: true,
    },
    {
      title: 'Farmers',
      icon: 'award-outline',
      link: '/dashboard/farmer',
      home: true,
    },
  ];
}
