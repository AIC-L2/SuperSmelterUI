import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeNewComponent } from './recipeNew.component';

describe('RecipeComponent', () => {
  let component: RecipeNewComponent;
  let fixture: ComponentFixture<RecipeNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
