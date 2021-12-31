import { ComponentFixture, TestBed } from '@angular/core/testing';

import { newUserComponent } from './newUser.component';

describe('AuthComponent', () => {
  let component: newUserComponent;
  let fixture: ComponentFixture<newUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ newUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(newUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
