import 'rxjs/Rx'
import {AbstractModel, EmbeddedResource} from './abstract.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
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

  getResources(): Observable<T[]> {
    return this.http.get<EmbeddedResource>(this.baseUrl + '/' + this.entityName, this.httpOptions)
      .map(res => res._embedded[this.entityName] as T[]);
  }

  getResource(id: number): Observable<T> {
    return this.http.get<T>(this.baseUrl + '/' + this.entityName + '/' + id, this.httpOptions);
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
