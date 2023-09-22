import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { io } from 'socket.io-client';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from "@angular/common";
import { BrowserModule } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { get } from 'http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { AlertServiceService } from 'src/app/services/utilities/alert-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService, private alertService: AlertServiceService, private router: Router) {
    this.form = this.createForm();
  }

  ngOnInit(): void {
  }

  createForm(): FormGroup {
    return this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  save() {
    console.log(this.form.value);
    this.authService.login(this.form.value).subscribe(
      (res) => {
        this.alertService.success('Success', 'Logueado correctamente')
        localStorage.setItem('token', res.token.token);
        console.log(res);
        this.router.navigate(['/home']);
      },
      (err) => {
        this.alertService.error('Error', 'Datos incorrectos');
        console.log(err);
      }
    );

  }
}
