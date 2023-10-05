import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFarmerComponent } from './create-farmer.component';

describe('CreateFarmerComponent', () => {
  let component: CreateFarmerComponent;
  let fixture: ComponentFixture<CreateFarmerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateFarmerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFarmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
