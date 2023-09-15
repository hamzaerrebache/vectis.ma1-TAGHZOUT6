import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperCommentComponent } from './stepper-comment.component';

describe('StepperCommentComponent', () => {
  let component: StepperCommentComponent;
  let fixture: ComponentFixture<StepperCommentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepperCommentComponent]
    });
    fixture = TestBed.createComponent(StepperCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
