import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFarmersComponent } from './view-farmers.component';

describe('ViewFarmersComponent', () => {
  let component: ViewFarmersComponent;
  let fixture: ComponentFixture<ViewFarmersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFarmersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFarmersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
