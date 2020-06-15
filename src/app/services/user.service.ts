import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../model/user-model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private empUrl = 'http://localhost:8099/fse/api/users';


  constructor(private http:HttpClient) { }

  public listEmp(){
    return this.http.get<UserModel>(this.empUrl);
  }

  public createUser(userModel) {
    return this.http.post<UserModel>(this.empUrl, userModel);
  }

  public updateUser(id: number,userModel:any) {
    return this.http.put<UserModel>(`${this.empUrl}/${id}`, userModel);
  }

  public deleteUser(id: number) {
    return this.http.delete<UserModel>(`${this.empUrl}/${id}`);
  }

}
