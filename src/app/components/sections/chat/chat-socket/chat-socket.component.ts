import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessagesService } from 'src/app/services/messages.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-chat-socket',
  templateUrl: './chat-socket.component.html',
  styleUrls: ['./chat-socket.component.css']
})
export class ChatSocketComponent implements OnInit {
  @ViewChild('scrollToBottom') scrollToBottom: ElementRef | undefined;
  nickname:any;
  title = 'chat_front';
  private socket: any;
  form: FormGroup;
  messages: any[] = [];
  socketIdPropio: any;
  socketIdDestino: any;
  user: any;

  constructor(private fb: FormBuilder, private messagesService: MessagesService, private cd: ChangeDetectorRef, private authService: AuthService) {
    this.form = this.createForm();
  }
  ngOnInit() {
    this.getUser();
    this.getMessages();
    this.socket = io(environment.SOCKET_URL);
    this.socket.on('connect', () => {
      //console.log('Conectado al servidor');
      this.socketIdPropio = this.socket.id;
      //console.log("Id propio", this.socketIdPropio);
    });

    this.socket.on('getAllMessages', (data: any) => {
      //console.log('Mensaje recibido del servidor: 2', data);
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
    console.log("User", this.user);
    //console.log(this.form.value);
    this.form.value.socket_id = this.user.username;
    this.form.value.user_id = this.user.id;
    console.log("Los datos que se enviaran son: ",this.form.value);
    this.messagesService.storeMessage(this.form.value).subscribe(
      (res) => {
        //console.log("msg",res);
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
        console.log("Mensajes", this.messages);
      }
    );
    if (this.scrollToBottom) {
      // Desplazamiento hacia el elemento de referencia al final del formulario
      this.scrollToBottom.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
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
}

