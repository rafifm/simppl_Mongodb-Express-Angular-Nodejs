import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KuotaSekolahComponent } from './kuota-sekolah/kuota-sekolah.component';
import { PenempatanDosenComponent } from './penempatan-dosen/penempatan-dosen.component';
import { PenempatanMahasiswaComponent } from './penempatan-mahasiswa/penempatan-mahasiswa.component';
import { LaporanRoutingModule } from './laporan-routing.module';
import { AngularMaterialModule } from 'src/app/angular-material.module';



@NgModule({
  declarations: [
    KuotaSekolahComponent, 
    PenempatanDosenComponent, 
    PenempatanMahasiswaComponent],
  imports: [
    CommonModule,
    LaporanRoutingModule,
    AngularMaterialModule
  ]
})
export class LaporanModule { }
