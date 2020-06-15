import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../model/project';
import { ProjectDatatable } from '../model/project-datatable';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private projectUrl = 'http://localhost:8099/fse/api/project';

  constructor(private http:HttpClient) { }

  public listProject(){
    return this.http.get<ProjectDatatable>(this.projectUrl);
  }

  public createProject(project:any) {
    return this.http.post<Project>(this.projectUrl, project);
  }

  public updateProject(id: number,Project:any) {
    return this.http.put<Project>(`${this.projectUrl}/${id}`, Project);
  }

}
