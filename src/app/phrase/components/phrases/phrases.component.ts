import {Component} from '@angular/core';
import {Phrase} from '../../models/phrase';
import {AbstractComponent} from '../../../common/abstract.component';
import {select, Store} from '@ngrx/store';
import {getPhrases} from '../../reducers/phrase.reducer';
import {Observable} from 'rxjs/Observable';
import {LoadPhrases} from '../../actions/phrase.action';
import {ActivatedRoute, Router} from '@angular/router';
import {AppState} from '../../../common/index';


@Component({
  selector: 'phrases',
  templateUrl: './phrases.component.html',
  styleUrls: ['./phrases.component.scss']
})
export class PhrasesComponent extends AbstractComponent {
  phrases$: Observable<Phrase[]>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.store.dispatch(new LoadPhrases());
    this.phrases$ = this.store.pipe(select(getPhrases));
  }
}
