import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../model/task';
import {Parenttask} from '../model/parenttask';
import { Viewtask } from '../model/viewtask';
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private taskUrl = 'http://localhost:8099/fse/api/task';

  private parentTaskUrl='http://localhost:8099/fse/api/parenttask';

  constructor(private http:HttpClient) { }

  public createTask(task:any) {
    return this.http.post<Task>(this.taskUrl, task);
  }

  public updateTask(id: number,task:any) {
    return this.http.post<Task>(`${this.taskUrl}/${id}`, task);
  }

  public listParent() {
    return this.http.get<Parenttask>(this.parentTaskUrl);
  }

  public listprojectTaskMapping(id:number) {
    return this.http.get<Viewtask>(`${this.taskUrl}/${id}`);
  }

}
