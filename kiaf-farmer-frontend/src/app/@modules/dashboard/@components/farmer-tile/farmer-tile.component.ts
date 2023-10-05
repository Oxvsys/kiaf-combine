import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-farmer-tile',
  templateUrl: './farmer-tile.component.html',
  styleUrls: ['./farmer-tile.component.scss']
})
export class FarmerTileComponent implements OnInit {
  @Input() fullName= '';
  @Input() contactNo = '';
  @Input() profilePicture = '';
  @Input() strike = false;
  @Input() mobileVerified = false;
  
  constructor() { }

  ngOnInit(): void {
  }

}
