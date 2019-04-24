import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalcomponentComponent } from './modalcomponent.component';

describe('ModalcomponentComponent', () => {
  let component: ModalcomponentComponent;
  let fixture: ComponentFixture<ModalcomponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalcomponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalcomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
