import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeRecipeComponent } from './merge-recipe.component';

describe('MergeRecipeComponent', () => {
  let component: MergeRecipeComponent;
  let fixture: ComponentFixture<MergeRecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MergeRecipeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MergeRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
