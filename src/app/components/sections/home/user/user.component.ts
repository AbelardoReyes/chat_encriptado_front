import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { IUser } from 'src/app/interfaces/user.inteface';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: any;
  constructor(
    private authService: AuthService
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

}
