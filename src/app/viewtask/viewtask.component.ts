import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Viewtask } from '../model/viewtask';
import { ProjectDatatable } from '../model/project-datatable';
import { ProjectService } from '../services/project.service';
import { TaskService } from '../services/task.service';
import { Options } from 'ng5-slider';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Task } from '../model/task';
import { UserService } from '../services/user.service';
import { UserModel } from '../model/user-model';
import { Parenttask } from '../model/parenttask';
declare var $: any;

@Component({
  selector: 'app-viewtask',
  templateUrl: './viewtask.component.html',
  styleUrls: ['./viewtask.component.css']
})
export class ViewtaskComponent implements OnInit {

  value: number = 1;
  options: Options = {
    floor: 1,
    ceil: 30
  };
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<Viewtask> = new Subject();
  taskList: Viewtask[];
  projectId: number;
  pname:string;
  projectList: ProjectDatatable[];
  searchProject: string;
  isSearchBtnEnable: boolean = true;
  updateTaskForm: FormGroup;
  isChecked: boolean;
  task: Task = new Task();
  formvalues: any;
  submitted = false;
  userId: number;
  parentTaskId: number;
  isParentTaskSelected: string = 'false';
  userModelList: UserModel[];
  parentTaskList: Parenttask[];
  searchUser: string;
  searchParentTask: string;
  taskId:number;

  constructor( private formBuilder: FormBuilder,private projectService: ProjectService,private taskService:TaskService,private userService:UserService) { }

  ngOnInit(): void {
    this.updateTaskForm = this.formBuilder.group({
      projectName:  new FormControl(),
      task: ['', Validators.required],
      priority: new FormControl(),
      parentTaskName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      userName: ['', Validators.required],
      status: new FormControl()
    });

    this.userService.listEmp().subscribe(
      response => this.handleSuccessfulResponseUsers(response),
    );

    this.projectService.listProject().subscribe(
      response => this.handleSuccessfulResponseProject(response),
    );

    this.taskService.listParent().subscribe(
      response => this.handleSuccessfulResponseParentTask(response),
    );

    
  }

  handleSuccessfulResponseProject(response: any): void {
    this.projectList = response;
  }

  onSearchProject(project: any) {
    this.projectId = project.projectId;
    //this.addTaskForm.controls['projectName'].setValue(project.projectName);
    this.pname=project.projectName;
    this.taskService.listprojectTaskMapping(this.projectId).subscribe(
      response => this.handleSuccessfulResponsePTMapping(response),
    );
    $('#searchProject').modal("hide");
  }
  handleSuccessfulResponsePTMapping(response): void {
    this.taskList = response;
  }

  onEditTask(taskObj:any){
    this.taskId=taskObj.id;
    this.projectId =taskObj.projectId;
    this.parentTaskId=taskObj.parentTaskId;
    this.userId=taskObj.userId;
    
    this.updateTaskForm.controls['task'].setValue(taskObj.task);
    this.updateTaskForm.controls['priority'].setValue(taskObj.priority);
    this.updateTaskForm.controls['parentTaskName'].setValue(taskObj.parentTask);
    this.updateTaskForm.controls['startDate'].setValue(taskObj.startDate);
    this.updateTaskForm.controls['endDate'].setValue(taskObj.endDate);
    this.updateTaskForm.controls['userName'].setValue(taskObj.userFirstName);
    $('#updateTask').modal("show");
  }
  endTask(id:any,taskObj:any){

  }
  onSubmit(){
    console.log(this.updateTaskForm.value);
    this.submitted = true;

    if (this.updateTaskForm.invalid) {
      return;
    }
    this.formvalues = this.updateTaskForm.value;
    this.task.id=this.taskId;
    this.task.task = this.formvalues.task;
    this.task.priority = this.formvalues.priority;
    this.task.startDate = this.formvalues.startDate;
    this.task.endDate = this.formvalues.endDate;
    this.task.userId = this.userId;
    this.task.parentId = this.parentTaskId;
    this.task.projectId = this.projectId;
    this.task.isParentTask=this.isParentTaskSelected;
    this.task.status=this.formvalues.status;
    this.taskService.updateTask(this.taskId,this.task)
      .subscribe(data => {
        this.userService.listEmp().subscribe(
          response => this.handleSuccessfulResponseUsers(response),
        );
    
        this.projectService.listProject().subscribe(
          response => this.handleSuccessfulResponseProject(response),
        );
    
        this.taskService.listParent().subscribe(
          response => this.handleSuccessfulResponseParentTask(response),
        );
        alert("Task added") 
        this.updateTaskForm.reset();
      });
      
    $('#updateTask').modal("hide");
    this.updateTaskForm.reset();
  }

  handleSuccessfulResponseUsers(response: any) {
    this.userModelList = response;

  }
  handleSuccessfulResponseParentTask(response: any) {
    this.parentTaskList = response;

  }

  onSearchUser(emp: any) {
    this.userId = emp.id;
    this.updateTaskForm.controls['userName'].setValue(emp.firstName);
    $('#searchUser').modal("hide");
  }
  onSearchParentTask(parentTask: any) {
    this.parentTaskId = parentTask.id;
    this.updateTaskForm.controls['parentTaskName'].setValue(parentTask.parentTaskName);
    $('#searchParentTask').modal("hide");
  }
  isParentTask(event: any) {
    console.log(event);
    if (event == 'true') {
      this.updateTaskForm.controls['priority'].disable();
      this.updateTaskForm.controls['parentTaskName'].disable();
      this.updateTaskForm.controls['startDate'].disable();
      this.updateTaskForm.controls['endDate'].disable();
      this.updateTaskForm.controls['priority'].reset();
      this.updateTaskForm.controls['parentTaskName'].reset();
      this.updateTaskForm.controls['startDate'].reset();
      this.updateTaskForm.controls['endDate'].reset();
      this.isSearchBtnEnable = false;
      this.isParentTaskSelected = 'true';
    } else {
      this.updateTaskForm.controls['priority'].enable();
      this.updateTaskForm.controls['parentTaskName'].enable();
      this.updateTaskForm.controls['startDate'].enable();
      this.updateTaskForm.controls['endDate'].enable();
      this.isSearchBtnEnable = true;
      this.isParentTaskSelected = 'false';
    }
  }
}
