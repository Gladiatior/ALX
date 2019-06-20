import {Component, OnInit} from '@angular/core';
import {LocalStorageService} from "./services/local-storage.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {

  constructor(private localdb: LocalStorageService,private router: Router) {

  }

  ngOnInit() {
    this.localdb.goLogin();
  }
}
