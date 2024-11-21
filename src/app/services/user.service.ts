import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiUrl = 'http://localhost:3000/data';

  constructor(
    private readonly http: HttpClient
  ) { }

  getUsersList(){
    return this.http.get<any[]>(this.apiUrl)
  }

  saveUser(obj:any){
    return this.http.post<any>(this.apiUrl, obj)
  }

  deleteuser(id:any){
    return this.http.delete<any>(this.apiUrl+'/'+id)
  }

  getUserById(id:any){
    return this.http.get<any>(this.apiUrl+'/'+id)
  }

  updateUser(id:any, obj:any){
    return this.http.put<any>(this.apiUrl+'/'+id,obj);
  }



}
