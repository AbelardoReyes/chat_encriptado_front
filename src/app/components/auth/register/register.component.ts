import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AlertServiceService } from 'src/app/services/utilities/alert-service.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IUser } from 'src/app/interfaces/user.inteface';
import { on } from 'events';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  user: IUser[] = [];
  constructor(public dialogRef: MatDialogRef<RegisterComponent>,
    private fb: FormBuilder,
    private authService: AuthService,
    private alertService: AlertServiceService,

  ) {
    this.form = this.createForm();
  }

  ngOnInit(): void {
  }

  createForm(): FormGroup {
    return this.form = this.fb.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  save() {
    console.log(this.form.value);
    this.authService.register(this.form.value).subscribe(
      (res) => {
        this.alertService.success('Success', 'Registrado correctamente')
        this.onNoClick();
      },
      (err) => {
        this.alertService.error('Error', 'Datos incorrectos');
        console.log(err);
      }
    );
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
