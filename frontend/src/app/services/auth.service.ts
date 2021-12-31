import { catchError, Observable,of } from "rxjs";
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpResponse } from "../interfaces/HttpResponse"
import { Router } from "@angular/router";
import { UserInterface } from "../interfaces/user.interface";


@Injectable()
export class AuthService{
    constructor(private http:HttpClient,private router:Router){}
    public user:UserInterface
    urlApi='http://localhost:3000/api/user'
    isAuth=false;
    httpOptions={
        headers:new HttpHeaders({
            'Content-Type':'application/json'
        })
    };

    public logInUser(email:string,password:string):void{
const values={email,password};
this.http.post<any>(`${this.urlApi}/login`, values,{ withCredentials: true, observe: 'response' })
.pipe(catchError(err=>{
    return of (err);}))
.subscribe((res:HttpResponse)=>{
    if (res.status===201){
      this.user=res.body
      localStorage.setItem("userId",res.body.userId)
      this.isAuth=true
      this.router.navigate(['/posts'])
    }
else {
  alert(res.error.message)
  console.error
}
  })
}

   public signOut(){
       return this.http.get<any>(`${this.urlApi}/logout`,{ withCredentials: true, observe: 'response' })
       .pipe(catchError(err=>{
           return of (err);
       }))
       .subscribe((response: HttpResponse): void => {
        if (response.status === 200) {
            this.isAuth =false;
            this.user=null;
          this.router.navigate(['/login']);
          localStorage.removeItem('userId')
        } else {
            console.error
        }
      });
       

   }
}