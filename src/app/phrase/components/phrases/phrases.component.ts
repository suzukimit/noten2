import {Component} from '@angular/core';
import {Phrase} from '../../models/phrase';
import {AbstractComponent} from '../../../common/abstract.component';
import {select, Store} from '@ngrx/store';
import {getPhrases, PhraseState} from '../../reducers/phrase.reducer';
import {Observable} from 'rxjs/Observable';
import {CreatePhraseSuccess, LoadPhrases, PhraseActionTypes} from '../../actions/phrase.action';
import {Actions, ofType} from '@ngrx/effects';
import {ActivatedRoute, Router} from '@angular/router';
import {PhraseEffects} from '../../effects/phrase.effect';
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
    private actions$: Actions,
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    this.store.dispatch(new LoadPhrases());
    this.phrases$ = this.store.pipe(select(getPhrases));

    this.subscriptions.push(
      this.actions$.pipe(ofType(PhraseActionTypes.CreatePhraseSuccess)).subscribe(
        res => this.router.navigate(['/home', (res as CreatePhraseSuccess).payload.phrase.id])
      ),
      this.actions$.pipe(ofType(PhraseActionTypes.DeletePhraseSuccess)).subscribe(
        res => this.router.navigate(['/home'])
      ),
    );


  }
}
