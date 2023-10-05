import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss']
})
export class UserItemComponent implements OnInit {

  @Input() fullName= '';
  @Input() contactNo = '';
  @Input() profilePicture = '';
  @Input() strike = false;
  @Input() mobileVerified = false;
  

  constructor() { }

  ngOnInit(): void {
  }

}
