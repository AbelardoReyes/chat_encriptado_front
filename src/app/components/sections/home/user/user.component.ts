import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { IUser } from 'src/app/interfaces/user.inteface';
import { Router } from '@angular/router';
import { AlertServiceService } from 'src/app/services/utilities/alert-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SendKeyService } from 'src/app/services/send-key.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  isButtonDisabled: boolean = false;
  form: FormGroup;
  caracteresKey: number = 10;
  secretKeyPadre = "H8!rT7neyp";
  user: any;
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertService: AlertServiceService,
    private fb: FormBuilder,
    private sendKeyService: SendKeyService
  ) {
    this.form = this.createForm();
    this.getUser();
  }

  ngOnInit(): void {
    //this.secretKeyPadre = this.sendKeyService.createSecretKey(this.caracteresKey);
  }

  getUser() {
    this.authService.me().subscribe(
      (res) => {
        this.user = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  createForm() {
    return this.fb.group({
      secretKey: ['', Validators.required],
    });
  }

  updateUser() {
    this.alertService.error('Funcionalidad no disponible', 'Lo sentimos');
  }

  logout() {
    this.alertService.confirmDialog('¿Desea cerrar sesión?', '', 'Cancelar', 'Aceptar').then(
      (result) => {
        if (result.isConfirmed) {
          this.alertService.success('Sesión cerrada', 'Hasta pronto');
          this.authService.logout().subscribe(
            (res) => {
              localStorage.removeItem('token');
              this.router.navigate(['/']);
            }
          );
        }
      });
  }
  sendKey() {
    if (this.form.value.secretKey === this.secretKeyPadre) {
      this.sendKeyService.updateSecretKey(this.form.value.secretKey);
    } else {
      this.alertService.error('Clave incorrecta', 'Lo sentimos');
    }
    this.isButtonDisabled = true;
  }
}
