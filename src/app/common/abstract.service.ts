import 'rxjs/Rx'
import {AbstractModel, EmbeddedResource} from './abstract.model';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AbstractService<T extends AbstractModel> {
  protected baseUrl = 'http://localhost:8080';
  protected entityName = '';
  protected httpOptions = {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  constructor(protected http: HttpClient) { }

  getResources(params: HttpParams = null): Observable<T[]> {
    const options = params? Object.assign(this.httpOptions, {params: params}) : this.httpOptions;
    return this.http.get<EmbeddedResource>(this.baseUrl + '/' + this.entityName, options)
      .map(res => res._embedded[this.entityName] as T[]);
  }

  getResource(id: number, params: HttpParams = null): Observable<T> {
    const options = params? Object.assign(this.httpOptions, {params: params}) : this.httpOptions;
    return this.http.get<T>(this.baseUrl + '/' + this.entityName + '/' + id, options);
  }

  createResource(model: any): Observable<T>  {
    return this.http.post<T>(`${this.baseUrl}/${this.entityName}`, model, this.httpOptions);
  }

  updateResource(model: any): Observable<T>  {
    return this.http.patch<T>(`${this.baseUrl}/${this.entityName}/${model.id}`, model, this.httpOptions);
  }

  deleteResource(id: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${this.entityName}/${id}`, this.httpOptions);
  }
}
