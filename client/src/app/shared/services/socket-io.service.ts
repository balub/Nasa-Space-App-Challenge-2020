import { io } from 'socket.io-client';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SocketIoService {
  socket: any;
  message: string = '';

  constructor() {}

  setupConnection() {
    this.socket = io('https://guarded-atoll-48490.herokuapp.com');
  }

  getDataStream() {
    const observable = new Observable((subscriber) => {
      this.socket.on('data-stream', (message: any) => {
        subscriber.next(message);
      });
    });
    return observable;
  }

  getKarenStream() {
    const observable = new Observable((subscriber) => {
      this.socket.on('trigger-stream', (message: any) => {
        console.log(message);
        subscriber.next(message);
      });
    });
    return observable;
  }

  setMessage(msg: string) {
    this.message = msg;
  }

  getMessage() {
    return this.message;
  }
}
