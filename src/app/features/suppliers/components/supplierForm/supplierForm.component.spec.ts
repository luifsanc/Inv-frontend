/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SupllierFormComponent } from './supplierForm.component';

describe('SupllierFormComponent', () => {
  let component: SupllierFormComponent;
  let fixture: ComponentFixture<SupllierFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupllierFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupllierFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
