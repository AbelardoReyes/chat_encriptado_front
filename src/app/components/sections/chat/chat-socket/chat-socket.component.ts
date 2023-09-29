import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessagesService } from 'src/app/services/messages.service';
import { AuthService } from 'src/app/services/auth.service';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-chat-socket',
  templateUrl: './chat-socket.component.html',
  styleUrls: ['./chat-socket.component.css']
})
export class ChatSocketComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollToBottom') scrollToBottom: ElementRef | undefined;
  nickname: any;
  title = 'chat_front';
  private socket: any;
  form: FormGroup;
  messages: any[] = [];
  socketIdPropio: any;
  socketIdDestino: any;
  user: any;

  constructor(private fb: FormBuilder, private messagesService: MessagesService, private cd: ChangeDetectorRef, private authService: AuthService,) {
    this.form = this.createForm();
  }
  ngOnInit() {
    this.getUser();
    this.socket = io(environment.SOCKET_URL);
    this.socket.on('connect', () => {
      //console.log('Conectado al servidor');
      this.socketIdPropio = this.socket.id;
      //console.log("Id propio", this.socketIdPropio);
    });
    this.socket.emit('getAllMessages', true);
    this.socket.on('allMessages', (data: any) => {
      console.log('Mensajes recibidos del servidor: ', data);
      this.messages = [...data];
    });

    this.socket.on('message', (data: any) => {
      console.log('Mensaje recibido del servidor: 2', data);
      this.messages.push(data);
      console.log('Arreglo messages actualizado:', this.messages);
      setTimeout(() => {
        this.cd.detectChanges();
      }, 0);
    });
    //this.enviarMensaje();
  }


  createForm(): FormGroup {
    return this.fb.group({
      message: ['', Validators.required],
    });
  }

  sendMessage() {
    //console.log("User", this.user);
    //console.log(this.form.value);
    this.form.value.socket_id = this.user.username;
    this.form.value.user_id = this.user.id;
    //console.log("Los datos que se enviaran son: ", this.form.value);
    this.socket.emit('sendMessage', this.form.value);
  }

  getUser() {
    this.authService.me().subscribe(
      (res) => {
        this.user = res;
        //console.log("Usuario", this.user);
      }
    );
  }
  handleInput(event: any) {
    const inputValue = event.target.value;
    if (inputValue.length === 30) {
      event.target.value += '\n';
      this.form.get('message')?.setValue(event.target.value);
    }
  }
  ngAfterViewChecked() {
    console.log('ngAfterViewChecked called');
    if (this.scrollToBottom && this.scrollToBottom.nativeElement) {
      this.scrollToBottom.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
  }
}

