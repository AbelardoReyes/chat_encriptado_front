import { Injectable } from '@angular/core';
import Swal, { SweetAlertCustomClass } from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class AlertServiceService {

  constructor() { }
  public customStyle: SweetAlertCustomClass = {
    container: 'alert-primary',
    title: 'alert-title',
    icon: 'alert-icon',
    confirmButton: 'alert-confirm-btn',
    cancelButton: 'alert-cancel-btn',
    input: 'alert-input',
  };
  success(title: string, text: string) {
    Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      showConfirmButton: false,
      timer: 1500
    })
  }

  error(title: string, text: string) {
    Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      showConfirmButton: false,
      timer: 1500
    })
  }

  confirmDialog(title?: string, text?: string, cancel?: string, confirm?: string) {
    return Swal.fire({
      position: 'center',
      icon: 'warning',
      title: title ? title : 'Confirme la operación',
      text,
      showCancelButton: true,
      cancelButtonText: cancel ? cancel : 'Cancelar',
      showConfirmButton: true,
      confirmButtonText: confirm ? confirm : 'Aceptar',
      showCloseButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: this.customStyle
    });
  }
}
