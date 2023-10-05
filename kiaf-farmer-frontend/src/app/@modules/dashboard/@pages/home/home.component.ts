import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { AuthService } from 'src/app/@core/services/auth.service';
import { PwaService } from 'src/app/@core/services/pwaservice.service';
import { User, USER_TYPE } from 'src/app/@data/user.interface';
import { HomeService } from './home.service';

export interface AdminStats {
	total_farmers: number;
	total_agent_active_farmers: number;
	total_agent_inactive_farmers: number;
	total_agents: number;
	total_active_agents: number;
	total_inactive_agents: number;
}
export interface AgentStats {
	total_agent_farmers: number;
	total_registered_farmers: number;
	total_discarded_farmers: number;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers:[HomeService]
})
export class HomeComponent implements OnInit {

  constructor(public Pwa: PwaService, private authService: AuthService,private home:HomeService) { }
  installPwa(): void {
    this.Pwa.promptEvent.prompt();
  }
  user!: User | null;
  userType=USER_TYPE;
  response:any={};

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser2();
    this.home.getStats().subscribe(next => {
      this.response = next;
    })
  }
  menu: NbMenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'home-outline',
      link: '/pages/dashboard',
      home: true,
    },
    {
      title: 'FEATURES',
      group: true,
    },
    {
      title: 'Auth',
      icon: 'lock-outline',
      children: [
        {
          title: 'Login',
          link: '/auth/login',
        },
        {
          title: 'Register',
          link: '/auth/register',
        },
        {
          title: 'Request Password',
          link: '/auth/request-password',
        },
        {
          title: 'Reset Password',
          link: '/auth/reset-password',
        },
      ],
    },
  ];
}
