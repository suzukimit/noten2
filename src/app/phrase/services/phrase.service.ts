import {AbstractService} from '../../common/abstract.service';
import {Phrase} from '../models/phrase';
import {Observable} from 'rxjs';
import {EmbeddedResource} from '../../common/abstract.model';
import {HttpParams} from '@angular/common/http';

export class PhraseService extends AbstractService<Phrase> {
  entityName = 'phrases';

  search(query: string): Observable<Phrase[]> {
    return this.http.get<EmbeddedResource>(`${this.baseUrl}/${this.entityName}/search/findByTitleContaining`,
      {...this.httpOptions, params: new HttpParams().set('title', query)})
      .map(res => res._embedded[this.entityName] as Phrase[]);
  }
}
