import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliciesProtectionsComponent } from './policies-protections.component';

describe('PoliciesProtectionsComponent', () => {
  let component: PoliciesProtectionsComponent;
  let fixture: ComponentFixture<PoliciesProtectionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PoliciesProtectionsComponent]
    });
    fixture = TestBed.createComponent(PoliciesProtectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
