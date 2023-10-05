import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordHideShowComponent } from './password-hide-show.component';

describe('PasswordHideShowComponent', () => {
  let component: PasswordHideShowComponent;
  let fixture: ComponentFixture<PasswordHideShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordHideShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordHideShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
