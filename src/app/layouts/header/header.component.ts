import {Component,  OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LocalStorageService} from "../../services/local-storage.service";
import {RestClientDocumentsService} from "../../services/rest-client-documents.service";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class HeaderComponent implements OnInit {
  usersPhoto = 'assets/images/users/1.jpg';
  login = '/login';
  constructor(private localDB: LocalStorageService, private router: Router, private apiService: RestClientDocumentsService ) { }

  ngOnInit() {
    if (this.apiService.users) {
      if (this.apiService.users.imageSrc) {
        this.usersPhoto = this.apiService.users.imageSrc;
      }
    }
  }

  goLogin(event: Event) {
    event.preventDefault();
    this.localDB.goLogin();
    this.router.navigate(['/login'], );
    window.location.reload();
  }
}
