import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorOverviewComponent } from './operator-overview.component';

describe('OperatorOverviewComponent', () => {
  let component: OperatorOverviewComponent;
  let fixture: ComponentFixture<OperatorOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperatorOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
