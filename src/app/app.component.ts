import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { environment } from '../environments/environment';
import { io } from 'socket.io-client';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from "@angular/common";
import { BrowserModule } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessagesService } from './services/messages.service';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { get } from 'http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  nickname:any;
  title = 'chat_front';
  private socket: any;
  form: FormGroup;
  messages: any[] = [];
  socketIdPropio: any;
  socketIdDestino: any;

  constructor(private fb: FormBuilder, private messagesService: MessagesService, private cd: ChangeDetectorRef) {
    this.form = this.createForm();
  }
  ngOnInit() {
    this.getMessages();
    this.socket = io(environment.SOCKET_URL);
    this.socket.on('connect', () => {
      console.log('Conectado al servidor');
      this.socketIdPropio = this.socket.id;
      console.log("Id propio", this.socketIdPropio);
    });

    this.socket.on('getAllMessages', (data: any) => {
      console.log('Mensaje recibido del servidor: 2', data);
      this.messages = data;
    });
    //this.enviarMensaje();
  }


  createForm(): FormGroup {
    return this.fb.group({
      message: ['', Validators.required],
    });
  }

  sendMessage() {
    console.log(this.form.value);
    this.form.value.socket_id = this.socketIdPropio;
    this.messagesService.storeMessage(this.form.value).subscribe(
      (res) => {
        console.log("msg",res);
        this.getMessages();
      }
    );
    this.form.reset();
  }

  getMessages() {
    //No tocar
    if (this.messages.length > 0) {
      this.messages = [];
    }
    this.messagesService.getMessages().subscribe(
      (res) => {
        this.messages = res;
;

        console.log("Mensajes", this.messages);
      }
    );
  }
  username(){
    this.nickname = this.form.value.username;
    console.log("nickname",this.nickname);
  }
}
