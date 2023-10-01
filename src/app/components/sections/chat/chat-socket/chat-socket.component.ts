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
  secretKey = 'clave'; // Reemplaza con tu clave compartida
  @ViewChild('scrollToBottom') scrollToBottom: ElementRef | undefined;
  nickname: any;
  title = 'chat_front';
  private socket: any;
  form: FormGroup;
  messages: any[] = [];
  socketIdPropio: any;
  socketIdDestino: any;
  user: any;
  tokenExiste: any;

  constructor(private fb: FormBuilder, private messagesService: MessagesService, private cd: ChangeDetectorRef, private authService: AuthService,) {
    this.form = this.createForm();
  }
  ngOnInit() {
    this.tokenExiste = localStorage.getItem('token');
    this.getUser();
    this.socket = io(environment.SOCKET_URL);
    this.socket.on('connect', () => {
      //console.log('Conectado al servidor');
      this.socketIdPropio = this.socket.id;
      //console.log("Id propio", this.socketIdPropio);
    });

    this.socket.emit('getAllMessages', true);
    this.socket.on('allMessages', (data: any) => {
      if (this.tokenExiste) {
        const mensajesDesencriptados = this.decryptAllMessage(data);
        this.messages = [...mensajesDesencriptados];
      } else {
        this.messages = [...data];
      }
      //console.log('Mensajes recibidos del servidor: ', data);
    });

    this.socket.on('message', (data: any) => {
      //console.log('Mensaje recibido del servidor: 2', data);
      // Desencriptar el mensaje antes de mostrarlo
      if (this.tokenExiste) {
        const mensajeDesencriptado = this.decryptMessage(data);
        this.messages.push(mensajeDesencriptado);
      } else {
        this.messages.push(data);
      }
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
    this.form.value.socket_id = this.user.username;
    this.form.value.user_id = this.user.id;
    //console.log("Los datos que se enviaran son: ", this.form.value);
    this.form.value.message = this.encryptMessage(this.form.value.message);
    this.socket.emit('sendMessage', this.form.value);
    this.form.reset();
  }

  getUser() {
    this.authService.me().subscribe(
      (res) => {
        this.user = res;
        //console.log("Usuario", this.user);
      }
    );
  }
  // Función para cifrar un mensaje
  encryptMessage(message: string): string {
    const ciphertext = CryptoJS.AES.encrypt(message, this.secretKey).toString();
    return ciphertext;
  }

  // Función para descifrar un mensaje
  decryptMessage(ciphertext: any): string {
    const crypto = ciphertext.message;
    console.log('Mensaje cifrado: ', crypto);
    const bytes = CryptoJS.AES.decrypt(crypto, this.secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    ciphertext.message = originalText;
    return ciphertext;
  }
  // Función para descifrar todos los mensajes
  decryptAllMessage(ciphertext: any): string {
    console.log('Mensaje sin cifrar: ', ciphertext);
    for (let i = 0; i < ciphertext.length; i++) {
      const crypto = ciphertext[i].message;
      const bytes = CryptoJS.AES.decrypt(crypto, this.secretKey);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      ciphertext[i].message = originalText;
    }
    return ciphertext;
  }


  ngAfterViewChecked() {
    if (this.scrollToBottom && this.scrollToBottom.nativeElement) {
      this.scrollToBottom.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
  }


}

