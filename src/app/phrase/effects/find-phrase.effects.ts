import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {EMPTY, of} from 'rxjs';
import {PhraseService} from '../services/phrase.service';
import {findFailure, findPhrases, findSuccess} from '../actions/find-phrase.actions';
import {catchError, map, skip, switchMap} from 'rxjs/operators';
import {Phrase} from '../models/phrase';

@Injectable()
export class FindPhraseEffects {
  constructor(
    private actions$: Actions,
    private phraseService: PhraseService,
  ) {}

  search$ = createEffect(
    () => this.actions$.pipe(
        ofType(findPhrases),
        switchMap(({ query }) => {
          const nextSearch$ = this.actions$.pipe(
            ofType(findPhrases),
            skip(1)
          );

          return this.phraseService.search(query).pipe(
            map((phrases: Phrase[]) => findSuccess({ phrases })),
            catchError(err => of(findFailure({ errorMsg: err.message })))
          );
        }),
      )
  )
}
