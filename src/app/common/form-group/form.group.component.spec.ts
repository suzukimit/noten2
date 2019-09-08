import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Form.GroupComponent } from './form.group.component';

describe('Form.GroupComponent', () => {
  let component: Form.GroupComponent;
  let fixture: ComponentFixture<Form.GroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Form.GroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Form.GroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
