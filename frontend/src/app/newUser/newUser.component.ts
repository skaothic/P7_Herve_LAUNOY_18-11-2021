import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Userservice } from '../services/user.service';

@Component({
  selector: 'app-newUser',
  templateUrl: './newUser.component.html',
  styleUrls: ['./newUser.component.scss']
})
export class newUserComponent implements OnInit{
  public userForm: FormGroup;

  constructor(
    private router :Router,
    private authService: AuthService,
    private userService: Userservice,
    private formBuilder: FormBuilder,
  ) { }

  public ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.userForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern(/[A-Za-zÀ-ÖØ-öø-ÿ ]{3,50}/)]],
      lastName: ['', [Validators.required, Validators.pattern(/[A-Za-zÀ-ÖØ-öø-ÿ ]{3,50}/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,20}/)]],
      passwordConfirm:['',[Validators.required,Validators.pattern(/[0-9a-zA-Z]{6,20}/)]]
  })

}
isAuth=this.authService.isAuth
  public onSubmit(): void {
    const firstName: string = this.userForm.get('firstName').value;
    const lastName: string = this.userForm.get('lastName').value;
    const email: string = this.userForm.get('email').value;
    const password: string = this.userForm.get('password').value;
    const passwordConfirm:string = this.userForm.get('passwordConfirm').value;
if (password === passwordConfirm){
  this.userService.addUser(firstName,lastName,email,password)
  .subscribe((res)=>{
    if (res.status ===201){
      this.isAuth=true
      alert('Bienvenue!! Connectez vous pour commencer à utiliser le forum')
      this.router.navigate(['/login'])
    }
    else if(res.status==400){
      alert( "Attention!! Veuillez renseigner tous les champs")
    }
  else{
    console.error
  }
  })
}
else{  
  alert ('Les mots de passe sont différents!!')
}
}
}
