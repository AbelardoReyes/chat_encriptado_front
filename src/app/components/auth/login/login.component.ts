import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AlertServiceService } from 'src/app/services/utilities/alert-service.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService, private alertService: AlertServiceService, private router: Router,public dialog: MatDialog) {
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
  register() {
    const dialogRef = this.dialog.open(RegisterComponent, {
      width: '50% 50%',
    });
  }
}
