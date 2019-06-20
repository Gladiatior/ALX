import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {login, Message} from '../classes/interfaceSpr';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestClientService {
  url = '/api/';

  constructor(private http: HttpClient, private localdb: LocalStorageService) {
  }

  public users = this.localdb.getUserDecode();

  admin(user: login): boolean {
    this.localdb.removeToken();
    if (user.name === 'BotirjonAxmadaliyev' && user.password === 'simsimopen') {
      let token = 'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiQm90aXJqb25BeG1hZGFsaXlldiIsImZveWRhbGFudXZjaGlJZCI6IiIsInZpbG95YXRJZCI6IiIsInh1cXVxSWQiOiIiLCJ4dXF1cU5hbWUiOiLQkNC00LzQuNC90LjRgdGC0YDQsNGC0L7RgCIsImltYWdlU3JjIjoiIiwiaWF0IjoxNTYwOTM5MDE1LCJleHAiOjE1NjA5NDI2MTV9.RJTTR2-ivaR9Z5lR7xRsDAyH17CCP3iGEuYZWUMpxgo';
      this.localdb.setToken(token);
      return true;
    }
    return false;
  }


  login(user: login): Observable<{ token: string }> {
    this.localdb.removeToken();
    return this.http.post<{ token: string }>(`${this.url}${'foydalanuvchi/login'}`, user)
      .pipe(tap(({token}) => {
        this.localdb.setToken(token);
      }));
  }

  updated<T>(classname: string, Object: T, id: string): Observable<T> {
    return this.http.patch<T>(`${this.url}${classname}/${id}`, Object);
  }

  creted<T>(classname: string, Object: T): Observable<T> {
    return this.http.post<T>(`${this.url}${classname}`, Object);
  }

  delete(id: string, classname: string): Observable<Message> {
    return this.http.delete<Message>(`${this.url}${classname}/${id}`);
  }

  getAllByPagePost<T>(params: any = {}, classname: string) {
    return this.http.get<T>(`${this.url}${classname}`, {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  getAll<T>(classname: string) {
    return this.http.get<T[]>(`${this.url}${classname}${'by'}`);
  }

  getFilter<T>(params: any = {}, classname: string) {
    return this.http.get<T>(`${this.url}${classname}${'/all'}`, {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  getObjectId<T>(params: any = {}, classname: string) {
    return this.http.get<T>(this.url + classname + '/filter', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

}
