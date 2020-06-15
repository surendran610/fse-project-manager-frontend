import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { UsersComponent } from './users/users.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule} from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

import { DataTablesModule } from 'angular-datatables';
import {HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule }    from '@angular/forms';
import { ProjectComponent } from './project/project.component';

import {MatSliderModule} from '@angular/material/slider';
import { Ng5SliderModule } from 'ng5-slider';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule } from '@angular/forms';
import { TaskComponent } from './task/task.component';
import { ViewtaskComponent } from './viewtask/viewtask.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    UsersComponent,
    ProjectComponent,
    TaskComponent,
    ViewtaskComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    DataTablesModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatSliderModule,
    Ng5SliderModule,
    Ng2SearchPipeModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
