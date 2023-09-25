import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperEditableExampleComponent } from './stepper-editable-example.component';

describe('StepperEditableExampleComponent', () => {
  let component: StepperEditableExampleComponent;
  let fixture: ComponentFixture<StepperEditableExampleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepperEditableExampleComponent]
    });
    fixture = TestBed.createComponent(StepperEditableExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
