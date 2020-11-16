import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default.component';
import { DashboardComponent } from 'src/app/modules/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material.module';
import { StaffModule } from '../../modules/staff/staff.module';
import { DosenModule } from '../../modules/penilaian/dosen/dosen.module';
import { GuruModule } from '../../modules/penilaian/guru/guru.module';
import { KaprodiModule } from 'src/app/modules/kaprodi/kaprodi.module';
import { AdminModule } from 'src/app/modules/admin/admin.module';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  declarations: [
    DefaultComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule
  ]
})
export class DefaultModule { }
