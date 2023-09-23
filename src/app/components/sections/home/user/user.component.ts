import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { IUser } from 'src/app/interfaces/user.inteface';
import { Router } from '@angular/router';
import { AlertServiceService } from 'src/app/services/utilities/alert-service.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: any;
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertService: AlertServiceService
  ) {
    this.getUser();
  }

  ngOnInit(): void {

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

  updateUser() {

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
}
