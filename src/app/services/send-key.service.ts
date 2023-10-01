import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SendKeyService {
  private secretKeyPadreSubject = new Subject<string>();
  secretKeyPadre$ = this.secretKeyPadreSubject.asObservable();

  updateSecretKey(secretKey: string) {
    this.secretKeyPadreSubject.next(secretKey);
  }

  createSecretKey(length: number): string {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numericChars = '0123456789';
    const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';

    const allChars = uppercaseChars + lowercaseChars + numericChars + specialChars;

    let password = '';
    for (let i = 0; i < length; i++) {
      password += this.generateRandomChar(allChars);
    }

    return password;
  }
  generateRandomChar(characters: string): string {
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters.charAt(randomIndex);
  }
}
