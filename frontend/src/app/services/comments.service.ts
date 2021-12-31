import { HttpClient,HttpHeaders} from "@angular/common/http";
import { Injectable } from "@angular/core";
import {  Router } from "@angular/router";
import { catchError, Observable, of } from "rxjs";
import { HttpResponse } from "../interfaces/HttpResponse"
import { PostInterface } from "../interfaces/posts.interface";
import { UserInterface } from "../interfaces/user.interface";

@Injectable()

export class Commentservice{
constructor(private http:HttpClient){}
urlApi='http://localhost:3000/api/posts/comments'
httpOptions={
    headers:new HttpHeaders({
        'Content-Type':'application/json'
    })
};
public getComment(id:number):Observable<HttpResponse>{
    return this.http.get(`${this.urlApi}/${id}`,{withCredentials: true, observe: 'response' })
    .pipe(catchError(err=>{
        return of (err);
    }))
}
public deleteComment(id:number,item:number):Observable<HttpResponse>{
    return this.http.delete(`${this.urlApi}/${id}/${item}`,{ withCredentials: true, observe: 'response' })
    .pipe(catchError(err=>{
        return of (err);
    }))
}

public likeComment(id:number,item:number):Observable<HttpResponse>{
    return this.http.put(`${this.urlApi}/${id}/${item}`,{},{ withCredentials: true, observe: 'response' })
    .pipe(catchError(err=>{
        return of (err);
    }))
}
public newComment(id:number,content:string):Observable<HttpResponse>{
    return this.http.post(`${this.urlApi}/${id}/newcomment`,{content},{ withCredentials: true, observe: 'response' })
    .pipe (catchError(err=>{
        return of (err)
    }))
}
}