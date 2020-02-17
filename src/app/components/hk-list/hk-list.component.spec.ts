import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HkListComponent } from './hk-list.component';

describe('HkListComponent', () => {
  let component: HkListComponent;
  let fixture: ComponentFixture<HkListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HkListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
