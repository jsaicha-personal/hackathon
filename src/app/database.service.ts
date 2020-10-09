import { Injectable } from '@angular/core';
import { HttpClient ,HttpParams} from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import {procedures} from './procedures';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http:HttpClient) { }
  getdescription(dcode:string):Observable<string>{
    console.log("get reqeuest made for the code description");

   return this.http.get<string>("url"+"?dcode="+dcode);
  }
  getprocedures(dcode:string):Observable<procedures[]>{
    console.log("get reqeuest made for the procedures");

   return this.http.get<procedures[]>("url"+"?dcode="+dcode);
  }
}
