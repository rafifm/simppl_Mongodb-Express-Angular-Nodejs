import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup;
  isLoggedIn = false;
  isLoggedInFailed = false;
  roles: string[] = [];
  private idPengguna;
  private idLogin;
  errorMessage= '';

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.formLogin = new FormGroup({
      email_pengguna: new FormControl(null, { validators: [Validators.required, Validators.email]}),
      password_pengguna: new FormControl(null, {validators: [Validators.required]})
    });
    if(this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getPengguna().peran;
    }
  }

  onSubmit(): void{
    this.authService.login({
      email: this.formLogin.value.email_pengguna,
      password: this.formLogin.value.password_pengguna
    }).subscribe(data => {
      this.tokenStorage.saveToken(data.accessToken);
      this.tokenStorage.savePengguna(data);
      this.isLoggedIn = true;
      this.isLoggedInFailed = false;
      this.roles = this.tokenStorage.getPengguna().peran;
      this.idLogin = this.tokenStorage.getPengguna().id;
      this.idPengguna = this.tokenStorage.getPengguna().idPengguna;
      this.getPeran();
    }, err => {
      console.log(err);
      this.isLoggedInFailed = true;
    });
  }

  reloadPage(): void{
    window.location.reload();
  }

  getPeran() {
    if(this.roles.includes('PERAN_DOSEN')) {
      if(this.idPengguna == 'kosong'){
        this.router.navigate(['/dashboard/staff/dosen/tambahdosen', this.idLogin]);
      } else {
        this.router.navigate(['/dashboard/dosen/tampilnilai']);
      }
    } else if(this.roles.includes('PERAN_GURU')){
      this.router.navigate(['/dashboard/staff/tambahguru']);
    } else if(this.roles.includes('PERAN_MAHASISWA')){
      if(this.idPengguna == 'kosong'){
        this.router.navigate(['/dashboard/mhs/tambahmhs',this.idLogin]);
      } else {
        this.router.navigate(["/dashboard/mhs/berhasildaftar"]);
      }
    } else if(this.roles.includes('PERAN_STAFF')){
      if(this.idPengguna == 'kosong'){
        this.router.navigate(['/dashboard/staff/tambahstaff']);
      }else {
        this.router.navigate(['/dashboard/staff/dashboardstaff']);
      }
    } else if(this.roles.includes('PERAN_ADMIN')){
      this.router.navigate(['/admin/kelolaperan'], {queryParams: {nama:'admin',email: this.tokenStorage.getPengguna().email_pengguna}});
    } else if(this.roles.includes('PERAN_KAPRODI')){
      if(this.idPengguna == 'kosong'){
        this.router.navigate(['/dashboard/kaprodi/profil']);
      } else {
        this.router.navigate(['/dashboard/kaprodi']);
      }
    }


























  }

}
