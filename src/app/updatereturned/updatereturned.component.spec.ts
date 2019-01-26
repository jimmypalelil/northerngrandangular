import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatereturnedComponent } from './updatereturned.component';

describe('UpdatereturnedComponent', () => {
  let component: UpdatereturnedComponent;
  let fixture: ComponentFixture<UpdatereturnedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatereturnedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatereturnedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
