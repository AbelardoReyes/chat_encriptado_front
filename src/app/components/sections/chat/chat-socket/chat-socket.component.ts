import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, AfterViewChecked, Input, OnChanges, SimpleChanges } from '@angular/core';
import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessagesService } from 'src/app/services/messages.service';
import { AuthService } from 'src/app/services/auth.service';
import { SendKeyService } from 'src/app/services/send-key.service';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-chat-socket',
  templateUrl: './chat-socket.component.html',
  styleUrls: ['./chat-socket.component.css']
})
export class ChatSocketComponent implements OnInit, AfterViewChecked {
  secretKey = ""
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
  cantidadMensajes: number = 0;

  constructor(private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private sendKeyService: SendKeyService,) {
    this.form = this.createForm();
  }
  ngOnInit() {
    this.sendKeyService.secretKeyPadre$.subscribe(secretKey => {
      this.secretKey = secretKey;
      this.messages = this.decryptAllMessage(this.messages);
    });
    this.tokenExiste = localStorage.getItem('token');
    this.getUser();
    this.socket = io(environment.SOCKET_URL);
    this.socket.on('connect', () => {
      this.socketIdPropio = this.socket.id;
      //console.log("Id propio", this.socketIdPropio);
    });

    this.socket.emit('getAllMessages', true);
    this.socket.on('allMessages', (data: any) => {
      console.log('Todos los mensajes: ', data);
      console.log(data);
      if (this.secretKey != "") {
        this.messages = this.decryptAllMessage(data);
      } else {
        this.messages = [...data];
      }
      this.messages.sort((a, b) => a.id - b.id);
      this.cantidadMensajes = this.messages.length;
    });

    this.socket.on('message', (data: any) => {
      if (this.secretKey != "") {
        const mensajeDesencriptado = this.decryptMessage(data);
        this.messages.push(mensajeDesencriptado);
      } else {
        this.messages.push(data);
      }
      this.cantidadMensajes = this.messages.length;
      console.log('Arreglo messages actualizado:', this.messages);
      setTimeout(() => {
        this.cd.detectChanges();
      }, 0);
    });
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
  decryptAllMessage(ciphertextArray: any[]): any[] {
    console.log('Mensajes sin cifrar: ', ciphertextArray);
    const mensajesDesencriptados = [];

    for (let i = 0; i < ciphertextArray.length; i++) {
      const crypto = ciphertextArray[i].message;
      const bytes = CryptoJS.AES.decrypt(crypto, this.secretKey);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      ciphertextArray[i].message = originalText;
      mensajesDesencriptados.push(ciphertextArray[i]); // Agrega el mensaje desencriptado al array resultante
    }
    return mensajesDesencriptados;
  }


  ngAfterViewChecked() {
    if (this.scrollToBottom && this.scrollToBottom.nativeElement) {
      this.scrollToBottom.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
  }

}

