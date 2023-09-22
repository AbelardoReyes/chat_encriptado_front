import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  API_URL = environment.API_URL;
  SOCKET_URL = environment.SOCKET_URL;
  private route = 'messages';

  constructor(private http:HttpClient) { }

  getMessages(): Observable<any> {
    return this.http.get(`${this.API_URL}/${this.route}/all`);
  }
  storeMessage(message: any): Observable<any> {
    return this.http.post(`${this.API_URL}/${this.route}`, message);
  }
  updateMessage(message: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${this.route}/${message.id}`, message);
  }
  deleteMessage(message: any): Observable<any> {
    return this.http.delete(`${this.API_URL}/${this.route}/${message.id}`);
  }
  showMessage(message: any): Observable<any> {
    return this.http.get(`${this.API_URL}/${this.route}/${message.id}`);
  }
}
