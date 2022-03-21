import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Userservice } from '../services/user.service';
import { UserInterface } from '../interfaces/user.interface';
import { HttpResponse } from '../interfaces/HttpResponse';
import {  FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr'
import { AuthService } from '../services/auth.service';
registerLocaleData (localeFr,'fr')

@Component({
  selector: 'app-user-interface',
  templateUrl: './user-interface.component.html',
  styleUrls: ['./user-interface.component.scss']
})
export class UserInterfaceComponent implements OnInit{
  public userProfile:UserInterface
   public updateForm=new FormGroup({
    prenom:new FormControl,
    nom:new FormControl
  })
  public uploadForm:FormGroup;

  public changePassForm=new FormGroup({
    oldPass:new FormControl,
    newPass:new FormControl,
    newPassConf:new FormControl
  })
  constructor(
    private router:Router,
    private userService:Userservice,
    private formBuilder:FormBuilder,
    private authService:AuthService
    ) { 
    }

ngOnInit(): void {
  if(this.authService.isAuth==true)
  {this.getUser();
  this.uploadForm=this.formBuilder.group({
    file:['']
  })}
  else{
    this.router.navigate(['/login'])
  }
}
public show=0;
public prenom=''
public  nom=''
public  image=''
public date:string=''
public file:File=null;

public getUser(): void{
  this.userService.getUser()
  .subscribe((response:HttpResponse) =>{
    if (response.status===201){
      this.userProfile=response.body
      this.prenom=this.userProfile[0].prenom
      this.nom=this.userProfile[0].nom
      this.image=this.userProfile[0].user_picture_url
      this.date=formatDate(this.userProfile[0].create_time,"dd MMMM yyyy",'fr-FR')
    }
    else {
      this.router.navigate(['/login'])
    }
  })
}

public updateUser(){
  const prenom:string=this.updateForm.get('prenom').value;
  const nom:string=this.updateForm.get('nom').value;
  this.userService.updateUser(prenom,nom)
  .subscribe((res:HttpResponse)=>{
    if (res.status===201){
      this.getUser()
      this.show=1
    }
    else {
      console.error
    }
        })
    
}

onFileSelect(event) {
  if (event.target.files.length > 0) {
    this.file = event.target.files[0];
  }
}

public updatePic(){
  const formData=new FormData()
  formData.append('id',localStorage.getItem("userId"))
  formData.append('file',this.file)
   this.userService.updatePic(formData)
  .subscribe((res:HttpResponse)=>{
    if (res.status===201){
      formData.set('file',null)
      this.getUser()
          }
    else {
    console.error
    }
      })
 
  }

public changePass(){
  const oldPass:string=this.changePassForm.get('oldPass').value;
  const newPass:string=this.changePassForm.get('newPass').value;
  const newPassConf:string=this.changePassForm.get('newPassConf').value;
this.userService.passwordChange(oldPass,newPass,newPassConf)
.subscribe((res:HttpResponse)=>{
  if (res.status===201){
      this.show=4
  }
  else if(res.status===403){
    this.show=2
    console.error
  }
    else if(res.status===405){
      this.show=3
      console.error
    }
    else {
      console.error
    }
})
}

public deleteProfile(){
  if (window.confirm("Etes vous sur de vouloir supprimer votre compte (irréversible)?")){
  this.userService.delete()
  .subscribe((res:HttpResponse)=>{
    if (res.status===200){
      this.authService.isAuth=false
      alert(res.body.message)
      this.router.navigate(['login'])
  }
  else if(res.status===403){
    alert(res.error.message)
  }
else {
  console.error
}
})
  }
}
}
