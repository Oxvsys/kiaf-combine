import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerTileComponent } from './farmer-tile.component';

describe('FarmerTileComponent', () => {
  let component: FarmerTileComponent;
  let fixture: ComponentFixture<FarmerTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FarmerTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmerTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
