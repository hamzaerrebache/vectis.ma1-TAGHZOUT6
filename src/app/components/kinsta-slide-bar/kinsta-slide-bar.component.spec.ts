import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KinstaSlideBarComponent } from './kinsta-slide-bar.component';

describe('KinstaSlideBarComponent', () => {
  let component: KinstaSlideBarComponent;
  let fixture: ComponentFixture<KinstaSlideBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KinstaSlideBarComponent]
    });
    fixture = TestBed.createComponent(KinstaSlideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
