/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RolFormComponent } from './rolForm.component';

describe('RolFormComponent', () => {
  let component: RolFormComponent;
  let fixture: ComponentFixture<RolFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
