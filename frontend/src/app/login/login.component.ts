import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserInterface } from '../interfaces/user.interface';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;

  constructor(private router :Router,
    private authService:AuthService,
    private formBuilder:FormBuilder) { }
public user:UserInterface
  ngOnInit(): void {
    this.initForm()
  }
  private initForm(){
    this.loginForm=this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }
public logIn(){
  const email:string=this.loginForm.get('email').value;
  const password:string=this.loginForm.get('password').value;
  this.authService.logInUser(email,password)

}
}
