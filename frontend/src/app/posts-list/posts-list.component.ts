import { HttpResponse } from '../interfaces/HttpResponse';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Postservice } from '../services/posts.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent implements OnInit { 
  public addPost:FormGroup;

  
  constructor (private formBuilder:FormBuilder,
    private postservice:Postservice,
    private authservice:AuthService,
    private router:Router){}
  
public postList=[];
public file:File=null;
userId=localStorage.getItem("userId");

  public ngOnInit(): void {
    
if (this.authservice.isAuth==true){
    this.initForm();
    this.getPosts();}
    else{
      this.router.navigate(['/login'])
    }
  }

  private initForm(){
    this.addPost=this.formBuilder.group({
      titre:['',Validators.required],
      content:[''],
      file:['']
    })
  }

  autogrow(){
    let  textArea = document.getElementById("content")       
    textArea.style.overflow = 'hidden';
    textArea.style.height = '0px';
    textArea.style.height = textArea.scrollHeight + 'px';
  }


private getPosts():void{
  this.postservice.getPost()
  .subscribe((response:HttpResponse)=>{
    if(response.status===200){
      this.postList=response.body != null ? response.body : [];      
    }
    else{
      console.log("pas de posts")
    }
  })
}
onFileSelect(event) {
  if (event.target.files.length > 0) {
    this.file = event.target.files[0];
  }
}
public newPost(){
  const formData=new FormData()
  formData.append('file',this.file)
  formData.append('contenu',this.addPost.get('content').value)
  formData.append('titre',this.addPost.get('titre').value)
  this.postservice.addPost(formData)
  .subscribe((res:HttpResponse)=>{
    if (res.status===201){
      this.initForm()
      this.file=null
      this.getPosts()
      }
   else{
     console.error
   }
  })
}

public deletePost(id:number):void{
  this.postservice.deletePost(id)
  .subscribe((res:HttpResponse) =>{
    if (res.status===200){
    this.getPosts()}
    else{
      console.error
    }
  })
}
public Like(id:number):void{
  this.postservice.likePost(id)
  .subscribe((res:HttpResponse) =>{
    if (res.status===200){
      this.getPosts()
    }
    else{
      console.error
    }
  })
}




 
    

    
 









}
