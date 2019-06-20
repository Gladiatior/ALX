import {Component, OnDestroy, OnInit} from '@angular/core';
import {RestClientService} from '../../services/rest-client.service';
import {MatSnackBar} from '@angular/material';
import {FormControl, FormGroup, NgModel, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import * as jwt_decode from "jwt-decode";
import {LocalStorageService} from "../../services/local-storage.service";
interface Login {
  name: string;
  xodimId: string;
  xuquqId?: string;
  tartibRaqam: number;
  password: string;
  viloyatId: string;
  tumanId: string;
  massivId: string;
  imageSrc?: string;
  _id?: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;

  constructor(private snackBar: MatSnackBar,
              private restClientService: RestClientService,
              private router: Router, private localdb: LocalStorageService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
  }

  onSubmit() {
    if (!this.restClientService.admin(this.form.value)) {
      this.restClientService.login(this.form.value)
        .subscribe(
          () => {
            const token = localStorage.getItem('karantin-token');
            if (token) {
              let decode = jwt_decode(token);
              if (decode){
                if (decode.ishdanKetganSana) {
                  this.openSnackBar('Сиз ишдан бўшагансиз дастурни ишлатишга рухсат берилмайди', 'Хатолик', 5);
                  this.form.reset();
                  this.localdb.goLogin();
                  this.router.navigate(['/login']);
                  return;
                }
                if (decode.xuquqName) {
                  if (decode.xuquqName === 'Администратор') {
                    if (this.router.config.length){
                      for (let rout of this.router.config){
                        if (rout.path === '') {
                          rout.children = [{
                            path: '',
                            loadChildren:
                              '../../AllDoctype/allcomponent.module#AllComponentsModule'
                          }]
                        }
                      }
                    }
                  } else if (decode.xuquqName === 'Аграном') {
                    if (this.router.config.length){
                      for (let rout of this.router.config){
                        if (rout.path === '') {
                          rout.children = [{
                            path: '',
                            loadChildren:
                              '../../AllDoctype/agranom.module#AgranomModule'
                          }]
                        }
                      }
                    }
                  }
                } else {
                  this.openSnackBar('Сизни турни ишлатишга хуқуқингиз мавжуд эмас!', 'Хатолик', 5);
                  this.form.reset();
                  this.localdb.goLogin();
                  this.router.navigate(['/login']);
                  return;
                }
              } else {
                this.openSnackBar('Сизнинг химоя калитингиз(JWT) нотўғри , Илтимос қатадан уриниб кўринг!', 'Хатолик', 5);
                this.form.reset();
                this.localdb.goLogin();
                this.router.navigate(['/login']);
              }
            } else {
              this.openSnackBar('Сизнинг химоя калитингиз (JWT) яратлмади, Илтимос қатадан уриниб кўринг!  ', 'Хатолик', 5);
              this.form.reset();
              this.localdb.goLogin();
              this.router.navigate(['/login']);
            }
          },

          error => {
            this.openSnackBar(error.error.message, 'Хатолик', 5);
            this.form.enable();
          }, () => {
            this.router.navigate(['/']);
            this.openSnackBar('Дастурга кириш бошланди', 'Тасдиқлаш', 5);
            this.form.enable();
          }
        );
    } else {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy() {

  }

  openSnackBar(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, {
      duration: duration * 1000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }

}

