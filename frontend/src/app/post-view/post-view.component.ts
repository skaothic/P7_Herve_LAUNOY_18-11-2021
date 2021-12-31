import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse } from '../interfaces/HttpResponse';
import { AuthService } from '../services/auth.service';
import { Commentservice } from '../services/comments.service';
import { Postservice } from '../services/posts.service';
import {Userservice} from '../services/user.service';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.scss']
})
export class PostViewComponent implements OnInit {
  constructor(private postservice:Postservice,
              private route:ActivatedRoute,
              private router:Router,
              private commentservice:Commentservice,
              private formBuilder:FormBuilder,
              private userservice:Userservice,
              private authservice:AuthService) { }

public addComment:FormGroup;
public post=[]
public commentsList=[]
public postId:number;
public commentId:number;
public userPic:File=null;
public auteur:string;

userId=localStorage.getItem("userId")

  ngOnInit(): void {
    if(this.authservice.isAuth==true)
    {this.postId = +this.route.snapshot.paramMap.get('id');
    this.commentId=+this.route.snapshot.paramMap.get('item')
    this.getOnePost()
    this.getComments(this.postId)
    this.initForm()}
    else {
      this.router.navigate(['/login'])
    }
  }
private initForm(){
  this.addComment=this.formBuilder.group({
    commentContent:['',Validators.required]
  })
}

private getOnePost():void{
  this.postservice.getOnePost(this.postId)
  .subscribe((response:HttpResponse)=>{
    if(response.status===203){
      this.post=response.body[0]
      this.userservice.getOneUser(this.post['user_id'])
      .subscribe((response:HttpResponse) =>{
       if (response.status===201){
         this.userPic=response.body[0].user_picture_url
       }
       else {
         console.error
       }
     })
   
    }
    else{
      this.router.navigate(['/posts'])
      console.log("le post n'existe plus")
    }
  })}


 



autogrow(){
  let  textArea = document.getElementById("commentContent")       
  textArea.style.overflow = 'hidden';
  textArea.style.height = '0px';
  textArea.style.height = textArea.scrollHeight + 'px';
}


  public deletePost(id:number):void{
    this.postservice.deletePost(id)
    .subscribe((res:HttpResponse) =>{
      if (res.status===200){
      this.router.navigate(['/posts'])}
      else{
        console.error
      }
    })
  }
  public Like(id:number):void{
    this.postservice.likePost(id)
    .subscribe((res:HttpResponse) =>{
      if (res.status===200){
        this.getOnePost()
      }
      else{
        console.error
      }
    })
  }
  
  public getComments(id:number):void{
    this.commentservice.getComment(id)
    .subscribe((res:HttpResponse) =>{
      if (res.status===200){
        this.commentsList=res.body
      }
      else{
        console.log()
        console.error
      }
    })
  }
public deleteComment(id:number,item:number):void{
  this.commentservice.deleteComment(id,item)
  .subscribe((res:HttpResponse) =>{
    if (res.status===200){
      this.getComments(this.postId)
    }
    else{
      console.error
    }
  })
}
public LikeComment(id:number,item:number):void{
  this.commentservice.likeComment(id,item)
  .subscribe((res:HttpResponse) =>{
    if (res.status===200){
      this.getComments(this.postId)
    }
    else{
      console.error
    }
  })

}
public newComment(id:number):void{
  const contenu=this.addComment.get('commentContent').value
  this.commentservice.newComment(id,contenu)
  .subscribe((res:HttpResponse)=>{
    if (res.status===200){
      this.addComment.setValue({commentContent:null})
      this.getComments(this.postId)
      }
   else{
     console.error
   }
  })
}

}
