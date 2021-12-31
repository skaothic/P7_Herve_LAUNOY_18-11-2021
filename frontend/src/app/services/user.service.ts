import { HttpClient,HttpHeaders} from "@angular/common/http";
import { Injectable } from "@angular/core";
import {  Router } from "@angular/router";
import { catchError, Observable, of } from "rxjs";
import { HttpResponse } from "../interfaces/HttpResponse"
import { UserInterface } from "../interfaces/user.interface";


@Injectable()
export class Userservice{
constructor(private http: HttpClient,private router:Router){}
public user:UserInterface
urlApi='http://localhost:3000/api/user'

httpOptions={
       headers:new HttpHeaders({
           'Content-Type':'application/json'
       })
   };
   public addUser(firstName: string,lastName:string, email: string, password: string): Observable<HttpResponse> {
       const values ={firstName,lastName, email, password};
    return this.http.post<any>(`${this.urlApi}/new-user`, values,{ withCredentials: true, observe: 'response' })
      .pipe(catchError(err => {
        return of(err);
      }));
  }

  public getUser():Observable<HttpResponse>{
return this.http.get(`${this.urlApi}/current`,{ withCredentials: true, observe: 'response' })
.pipe(catchError(err =>{
    return of (err);
}))

  }

  public getOneUser(id:number):Observable<HttpResponse>{
    return this.http.get(`${this.urlApi}/${id}`,{ withCredentials: true, observe: 'response' })
    .pipe(catchError(err =>{
      return of (err);
  }))  
}

  public updateUser(prenom:string,nom:string):Observable<HttpResponse>{
    const values={prenom,nom};
    return this.http.put<any>(`${this.urlApi}/current`,values,{ withCredentials: true, observe: 'response' })
    .pipe(catchError(err=>{
      return of(err)}))

  }

 public updatePic (formData:FormData):Observable<HttpResponse>{
 return this.http.put<any>(`${this.urlApi}/current/change-picture`,formData,{ withCredentials: true, observe: 'response' })
  .pipe(catchError(err=>{
    return of(err)}))

}

public passwordChange(oldPass:string,newPass:string,newPassConf:string):Observable<HttpResponse>{
  const values={oldPass,newPass,newPassConf}
  return this.http.put<any>(`${this.urlApi}/current/change-password`,values,{ withCredentials: true, observe: 'response' })
  .pipe(catchError(err=>{
    return of(err)}))
      }

public delete():Observable<HttpResponse>{
  return this.http.delete<any>(`${this.urlApi}/current`,{ withCredentials: true, observe: 'response' })
.pipe(catchError(err=>{
  return of (err)}))
}
}

