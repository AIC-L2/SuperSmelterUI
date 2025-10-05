import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicEquipmentComponent } from './dynamic-equipment.component';

describe('DynamicEquipmentComponent', () => {
  let component: DynamicEquipmentComponent;
  let fixture: ComponentFixture<DynamicEquipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DynamicEquipmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
