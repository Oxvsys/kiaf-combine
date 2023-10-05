import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestEmailVerificationLinkComponent } from './request-email-verification-link.component';

describe('RequestEmailVerificationLinkComponent', () => {
  let component: RequestEmailVerificationLinkComponent;
  let fixture: ComponentFixture<RequestEmailVerificationLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestEmailVerificationLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestEmailVerificationLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
