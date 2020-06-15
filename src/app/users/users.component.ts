import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { UserModel } from '../model/user-model';
import {UserService} from '../services/user.service';

declare var $: any;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<UserModel> = new Subject(); 
  userModelList: UserModel[];
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtInstance: DataTables.Api;

  registerForm: FormGroup;
  submitted = false;
  userModel: UserModel = new UserModel();
  formvalues: any;

  isDtInitialized:boolean = false;

  updateId:number;


  constructor(private formBuilder: FormBuilder,private userService: UserService) { }

  ngOnInit(): void {
    this.userService.listEmp().subscribe(
      response => this.handleSuccessfulResponse(response),
    );
    this.dtTrigger.next();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      employeeid: ['', [Validators.required]]
    });

    $('#addUser').on('hidden.bs.modal', function () {
      $(this).find('form').trigger('reset');
  });
  }

  get f() { return this.registerForm.controls; }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  handleSuccessfulResponse(response) {
    this.userModelList = response; 
    //var table = $('#userId').DataTable();
    //table.destroy();
    //this.dtTrigger.next();
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
  if (this.registerForm.invalid) {
    return;
  }

  this.formvalues = this.registerForm.value;
  this.userModel.firstName = this.formvalues.firstName;
  this.userModel.lastName=this.formvalues.lastName;
  this.userModel.empId = this.formvalues.employeeid;
  this.userService.createUser(this.userModel)
    .subscribe(data => {
      this.userService.listEmp().subscribe(
        response => this.handleSuccessfulResponse(response),
      );
    });
  $('#addUser').modal("hide");
  this.registerForm.reset();
  
}
 onEdit(emp:any){
  console.log(emp);
  this.registerForm.setValue({
    firstName: emp.firstName,
    lastName: emp.lastName,
    employeeid:emp.empId,
 });
  this.updateId=emp.id;
   $('#editUser').modal("show");
 }

 onUpdateUser(){
  this.submitted = true;

  // stop here if form is invalid
  if (this.registerForm.invalid) {
    return;
  }

  this.formvalues = this.registerForm.value;
  console.log(this.formvalues);
  this.userModel.firstName = this.formvalues.firstName;
  this.userModel.lastName=this.formvalues.lastName;
  this.userModel.empId = this.formvalues.employeeid;
  this.userService.updateUser(this.updateId,this.userModel)
    .subscribe(data => {
      this.userService.listEmp().subscribe(
        response => this.handleSuccessfulResponse(response),
      );
    });
    this.updateId=0;
  $('#editUser').modal("hide");
  this.registerForm.reset();  
 }

 deleteUsers(id:any,index:any) {
  console.log(id);
  this.userService.deleteUser(id)
    .subscribe(data => {
      this.userService.listEmp().subscribe(
        response => this.handleSuccessfulResponse(response),
      );
    });
  //this.userModelList.splice(index, 1);
  this.submitted = true;
  this.registerForm.reset();
}

}