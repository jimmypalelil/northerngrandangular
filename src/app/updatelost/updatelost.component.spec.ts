import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatelostComponent } from './updatelost.component';

describe('UpdatelostComponent', () => {
  let component: UpdatelostComponent;
  let fixture: ComponentFixture<UpdatelostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatelostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatelostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
