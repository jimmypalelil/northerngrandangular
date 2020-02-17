import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPublicAreaComponent } from './add-public-area.component';

describe('AddPublicAreaComponent', () => {
  let component: AddPublicAreaComponent;
  let fixture: ComponentFixture<AddPublicAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPublicAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPublicAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
