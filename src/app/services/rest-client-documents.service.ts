import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Message} from '../classes/interfaceSpr';
import {Observable} from 'rxjs';
import {LocalStorageService} from "./local-storage.service";

@Injectable({
  providedIn: 'root'
})
export class RestClientDocumentsService {
  url = '/api/';

  constructor(private http: HttpClient, private localdb: LocalStorageService) {
  }

  public users = this.localdb.getUserDecode();

  updated<T>(classname: string, Object: T, id: string): Observable<T> {
    return this.http.patch<T>(`${this.url}${classname}/${id}`, Object);
  }

  creted<T>(classname: string, Object: T): Observable<T> {
    return this.http.post<T>(`${this.url}${classname}`, Object);
  }

  delete(id: string, classname: string): Observable<Message> {
    return this.http.delete<Message>(`${this.url}${classname}/${id}`);
  }

  deleteChiqim<T>(id: string, classname: string, Object: T): Observable<Message> {
    return this.http.delete<Message>(`${this.url}${classname}/${id}`, Object);
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

  getYerMardoni<T>(params: any = {}, classname: string) {
    return this.http.get<T>(this.url + classname + '/yerMaydoni', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  getKarantinRuxsatnomasi<T>(params: any = {}, classname: string) {
    return this.http.get<T>(this.url + classname + '/ruxsatnomaNomer', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  getQoldiq<T>(params: any = {}, classname: string) {
    return this.http.get<T>(this.url + classname + '/partiya', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  getEkspertiza<T>(params: any = {}, classname: string) {
    return this.http.get<T>(this.url + classname + '/tartibRaqam', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

}
