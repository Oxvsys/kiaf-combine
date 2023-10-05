import { ElementRef } from '@angular/core';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-password-hide-show',
  templateUrl: './password-hide-show.component.html',
  styleUrls: ['./password-hide-show.component.scss']
})
export class PasswordHideShowComponent implements OnInit {
  shown = false;

  @Input()
  inputRef !: HTMLElement;
  constructor() { }

  ngOnInit(): void {
  }
  togglePassword() {
    console.log("toggle");
    this.shown = !this.shown;
    if (this.shown) {
      this.inputRef.setAttribute('type', 'text');
    } else {
      this.inputRef.setAttribute('type', 'password');
    }
  }
}
