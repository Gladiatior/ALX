import {Injectable} from '@angular/core';
import * as jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() {
  }

  setToken(token: string): boolean {
    localStorage.setItem('karantin-token', token);
    return true;
  }

  getToken() {
    return localStorage.getItem('karantin-token');
  }

  removeToken() {
    localStorage.removeItem('karantin-token');
    localStorage.clear();
  }

  getUserDecode(){
    let token = this.getToken();
    if (token) {
      let decode = jwt_decode(token);
      return decode;
    } else {
      return null;
    }

  }

  goLogin() {
    this.removeToken();
  }
}
