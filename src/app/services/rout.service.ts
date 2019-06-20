import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {LocalStorageService} from './local-storage.service';


@Injectable({
  providedIn: 'root'
})
export class RoutService {

  constructor(private router: Router, private localdb: LocalStorageService) {
  }

  goHome() {
    this.router.navigate(['/']);
  }

  goLogin() {
    // this.localdb.removeActionRoles();
    // this.localdb.removeUser();
    this.router.navigate(['/login']);
  }
}
