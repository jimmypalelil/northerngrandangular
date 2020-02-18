import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HkListPrintComponent } from './hk-list-print.component';

describe('HkListPrintComponent', () => {
  let component: HkListPrintComponent;
  let fixture: ComponentFixture<HkListPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HkListPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HkListPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
