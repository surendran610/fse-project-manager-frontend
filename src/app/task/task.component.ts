import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Options } from 'ng5-slider';
import { UserModel } from '../model/user-model';
import { UserService } from '../services/user.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Task } from '../model/task';
import { ProjectService } from '../services/project.service';
import { ProjectDatatable } from '../model/project-datatable';
import { TaskService } from '../services/task.service';
import { Parenttask } from '../model/parenttask';

declare var $: any;

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  value: number = 1;
  options: Options = {
    floor: 1,
    ceil: 30
  };

  formvalues: any;
  userId: number;
  projectId: number;
  parentTaskId: number;
  isChecked: boolean;
  isSearchBtnEnable: boolean = true;
  isParentTaskSelected: string = 'false';

  constructor(private formBuilder: FormBuilder, private userService: UserService, private projectService: ProjectService, private taskService: TaskService) { }

  addTaskForm: FormGroup;
  userModelList: UserModel[];
  projectList: ProjectDatatable[];
  parentTaskList: Parenttask[];
  searchUser: string;
  searchProject: string;
  searchParentTask: string;
  isDtInitialized: boolean = false;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtTrigger: Subject<Task> = new Subject();
  submitted = false;
  task: Task = new Task();

  ngOnInit(): void {
    this.addTaskForm = this.formBuilder.group({
      projectName: ['', Validators.required],
      task: ['', Validators.required],
      priority: new FormControl(),
      parentTaskName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      userName: ['', Validators.required],
      status:['',Validators.required]
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
    if (this.isDtInitialized) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    } else {
      this.isDtInitialized = true;
      this.dtTrigger.next();
    }
  }

  handleSuccessfulResponseUsers(response: any) {
    this.userModelList = response;

  }
  handleSuccessfulResponseParentTask(response: any) {
    this.parentTaskList = response;

  }

  onSubmit() {
    this.submitted = true;

    if (this.addTaskForm.invalid) {
      return;
    }
    this.formvalues = this.addTaskForm.value;
    this.task.task = this.formvalues.task;
    this.task.priority = this.formvalues.priority;
    this.task.startDate = this.formvalues.startDate;
    this.task.endDate = this.formvalues.endDate;
    this.task.userId = this.userId;
    this.task.parentId = this.parentTaskId;
    this.task.projectId = this.projectId;
    this.task.isParentTask=this.isParentTaskSelected;
    this.task.status=this.formvalues.status;
    this.taskService.createTask(this.task)
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
        this.addTaskForm.reset();
      });
      
    $('#addTaskForm').modal("hide");
    this.addTaskForm.reset();
  }

  onSearchUser(emp: any) {
    this.userId = emp.id;
    this.addTaskForm.controls['userName'].setValue(emp.firstName);
    $('#searchUser').modal("hide");
  }
  onSearchProject(project: any) {
    this.projectId = project.projectId;
    this.addTaskForm.controls['projectName'].setValue(project.projectName);
    $('#searchProject').modal("hide");
  }

  onSearchParentTask(parentTask: any) {
    this.parentTaskId = parentTask.id;
    this.addTaskForm.controls['parentTaskName'].setValue(parentTask.parentTaskName);
    $('#searchParentTask').modal("hide");
  }
  isParentTask(event: any) {
    console.log(event);
    if (event == 'true') {
      this.addTaskForm.controls['priority'].disable();
      this.addTaskForm.controls['parentTaskName'].disable();
      this.addTaskForm.controls['startDate'].disable();
      this.addTaskForm.controls['endDate'].disable();
      this.addTaskForm.controls['priority'].reset();
      this.addTaskForm.controls['parentTaskName'].reset();
      this.addTaskForm.controls['startDate'].reset();
      this.addTaskForm.controls['endDate'].reset();
      this.isSearchBtnEnable = false;
      this.isParentTaskSelected = 'true';
    } else {
      this.addTaskForm.controls['priority'].enable();
      this.addTaskForm.controls['parentTaskName'].enable();
      this.addTaskForm.controls['startDate'].enable();
      this.addTaskForm.controls['endDate'].enable();
      this.isSearchBtnEnable = true;
      this.isParentTaskSelected = 'false';
    }
  }
}
