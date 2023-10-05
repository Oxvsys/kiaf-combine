import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuItem, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

// import { UserData } from '../../../@core/data/users';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/@core/services/auth.service';
import { Router } from '@angular/router';
import { User, USER_TYPE } from 'src/app/@data/user.interface';

@Component({
  selector: 'app-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: User | null = null;
  userType = USER_TYPE;
  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  userMenu: NbMenuItem[] = [
    // { title: 'Profile', icon: 'person' },
    { title: 'Log out', icon: 'power' }];



  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    // private userService: UserData,
    private breakpointService: NbMediaBreakpointsService,
    private auth: AuthService,
    private router: Router) {
  }



  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    this.auth.getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.user = user
        if (user?.auth_provider == 'email') {
          this.userMenu.unshift({ title: 'Change Password', icon: 'edit' });
        }
      });

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);

    this.menuService.onItemClick().subscribe((event) => {
      if (event.item.title === 'Log out') {
        this.logout();
      } else if (event.item.title === 'Change Password') {
        this.router.navigate(['/dashboard/reset-password']);
      } else if (event.item.title === 'Profile') {
        this.router.navigate(['/dashboard/profile-update']);
      }
    });
  }

  logout() {
    this.auth.logout();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');

    return false;
  }
}
