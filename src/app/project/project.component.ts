import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Options } from 'ng5-slider';
import { Subject } from 'rxjs';
import { Project } from '../model/project';
import { DataTableDirective } from 'angular-datatables';
import { UserService } from '../services/user.service';
import { ProjectService } from '../services/project.service';
import { ProjectDatatable } from '../model/project-datatable';
import { UserModel } from '../model/user-model';
import { formatDate } from '@angular/common';

declare var $: any;
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  [x: string]: any;

  value: number = 1;
  options: Options = {
    floor: 1,
    ceil: 30
  };

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<ProjectDatatable> = new Subject();
  addProjectForm: FormGroup;
  projectList: ProjectDatatable[];
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtInstance: DataTables.Api;
  submitted = false;
  formvalues: any;
  isDtInitialized: boolean = false;
  userId: number;
  submitted = false;

  project: Project = new Project();
  projectList: ProjectDatatable[];
  userModelList: UserModel[];
  searchUser: string;
  projectId: number;

  get f() { return this.addProjectForm.controls; }

  constructor(private formBuilder: FormBuilder, private userService: UserService, private projectService: ProjectService) { }

  ngOnInit(): void {
    this.addProjectForm = this.formBuilder.group({
      projectName: ['', Validators.required],
      priority: new FormControl(),
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      manager: ['', Validators.required]
    });

    this.projectService.listProject().subscribe(
      response => this.handleSuccessfulResponse(response),
    );
    this.userService.listEmp().subscribe(
      response => this.handleSuccessfulResponseUsers(response),
    );
    this.dtTrigger.next();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };

    $('#addProject').on('hidden.bs.modal', function () {
      $(this).find('form').trigger('reset');
    });
  }

  handleSuccessfulResponse(response) {
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

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.addProjectForm.invalid) {
      return;
    }

    this.formvalues = this.addProjectForm.value;
    this.project.project = this.formvalues.projectName;
    this.project.priority = this.formvalues.priority;
    this.project.startDate = this.formvalues.startDate;
    this.project.endDate = this.formvalues.endDate;
    this.project.userId = this.userId;
    this.projectService.createProject(this.project)
      .subscribe(data => {
        this.projectService.listProject().subscribe(
          response => this.handleSuccessfulResponse(response),
        );
      });
    $('#addProject').modal("hide");
    this.addProjectForm.reset();
  }

  onSearch(emp: any) {
    console.log(emp);
    this.userId = emp.id;
    this.addProjectForm.controls['manager'].setValue(emp.firstName);
    $('#searchUser').modal("hide");
  }

  handleSuccessfulResponseUsers(response) {
    this.userModelList = response;
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

  onEditProject(project) {
    this.addProjectForm.setValue({
      projectName: project.projectName,
      priority: project.priority,
      startDate: project.startDate, //"yyyy-MM-dd"
      endDate: project.endDate, //"yyyy-MM-dd"
      manager: project.firstNameUser
    });
    console.log(this.addProjectForm);
    this.projectId = project.projectId;
    $('#editProject').modal("show");
  }

  onUpdateProject() {
    this.submitted = true;

    if (this.addProjectForm.invalid) {
      return;
    }

    this.formvalues = this.addProjectForm.value;
    this.project.project = this.formvalues.projectName;
    this.project.priority = this.formvalues.priority;
    this.project.startDate = this.formvalues.startDate;
    this.project.endDate = this.formvalues.endDate;
    this.project.userId = this.userId;
    this.projectService.updateProject(this.projectId, this.project)
      .subscribe(data => {
        this.projectService.listProject().subscribe(
          response => this.handleSuccessfulResponse(response),
        );
      });
    $('#editProject').modal("hide");
    this.addProjectForm.reset();
  }
}
