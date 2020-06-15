import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UsersComponent} from './users/users.component';
import {ProjectComponent} from './project/project.component';
import {TaskComponent} from './task/task.component';
import {ViewtaskComponent} from './viewtask/viewtask.component';
const routes: Routes = [
  { path: 'users', component: UsersComponent },
  { path: 'project', component: ProjectComponent },
  { path: 'task', component: TaskComponent },
  { path: 'viewtask', component: ViewtaskComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
