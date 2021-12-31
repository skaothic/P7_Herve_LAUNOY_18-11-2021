import { HttpClient,HttpHeaders} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, of } from "rxjs";
import { HttpResponse } from "../interfaces/HttpResponse"
import { PostInterface } from "../interfaces/posts.interface";
import { UserInterface } from "../interfaces/user.interface";

@Injectable()
export class Postservice{
    constructor(private http:HttpClient){}
    public userProfile:UserInterface
    public post:PostInterface
    urlApi='http://localhost:3000/api/posts'

    httpOptions={
        headers:new HttpHeaders({
            'Content-Type':'application/json'
        })
    };
public getPost():Observable<HttpResponse>{
    return this.http.get(`${this.urlApi}`,{ withCredentials: true, observe: 'response' })
    .pipe(catchError(err=>{
        return of (err);
    }))
}

public addPost(formData:FormData):Observable<HttpResponse>{
    return this.http.post(`${this.urlApi}`,formData,{ withCredentials: true, observe: 'response' })
    .pipe(catchError(err=>{
        return of (err)
    }))
}

public deletePost(postId:number):Observable<HttpResponse>{
    return this.http.delete(`${this.urlApi}/${postId}`,{ withCredentials: true, observe: 'response' })
.pipe(catchError(err =>{
    return of (err)
}))}

public likePost(postId:number):Observable<HttpResponse>{
    return this.http.put(`${this.urlApi}/${postId}`,{},{ withCredentials: true, observe: 'response' })
    .pipe(catchError(err =>{
        return of(err)
}))}

public getOnePost(postId:number):Observable<HttpResponse>{
    return this.http.get(`${this.urlApi}/${postId}`,{ withCredentials: true, observe: 'response' })
    .pipe(catchError(err =>{
        return of(err)
    }))
}



}