import {AbstractModel, EmbeddedResource} from './abstract.model';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable()
export class AbstractService<T extends AbstractModel> {
  protected baseUrl = environment.baseUrl;
  protected entityName = '';
  protected httpOptions = {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  constructor(protected http: HttpClient) { }

  getResources(params: HttpParams = null): Observable<T[]> {
    const options = params? Object.assign({}, this.httpOptions, {params: params}) : this.httpOptions;
    return this.http.get<EmbeddedResource>(this.baseUrl + '/' + this.entityName, options).pipe(
      map(res => res._embedded[this.entityName] as T[])
    )
  }

  getResource(id: number, params: HttpParams = null): Observable<T> {
    const options = params? Object.assign({}, this.httpOptions, {params: params}) : this.httpOptions;
    return this.http.get<T>(this.baseUrl + '/' + this.entityName + '/' + id, options);
  }

  createResource(model: T): Observable<T>  {
    return this.http.post<T>(`${this.baseUrl}/${this.entityName}`, model.toJson(), this.httpOptions);
  }

  updateResource(model: T): Observable<T>  {
    return this.http.patch<T>(`${this.baseUrl}/${this.entityName}/${model.id}`, model.toJson(), this.httpOptions);
  }

  deleteResource(id: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${this.entityName}/${id}`, this.httpOptions);
  }
}
