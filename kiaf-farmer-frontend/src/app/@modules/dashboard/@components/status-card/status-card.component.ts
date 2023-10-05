import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-status-card',
  templateUrl: './status-card.component.html',
  styleUrls: ['./status-card.component.scss']
})
export class StatusCardComponent implements OnInit {

  @Input()
  title!: string;
  @Input()
  description!: string;

  @Input()
  type!: string;

  @Input()
  routerLink!: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigate() {
    if(this.routerLink){
      this.router.navigate([this.routerLink]);
    }
  }

}
