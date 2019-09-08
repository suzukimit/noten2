import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, concatMap, switchMap, catchError } from 'rxjs/operators';
import {PhraseService} from '../services/phrase.service';

import {
  PhraseActionTypes,
  LoadPhrases,
  LoadPhrasesSuccess,
  LoadPhrasesFail,
  CreatePhrase,
  CreatePhraseSuccess,
  CreatePhraseFail,
  UpdatePhrase,
  UpdatePhraseSuccess,
  UpdatePhraseFail,
  DeletePhrase,
  DeletePhraseSuccess,
  DeletePhraseFail, LoadPhrase, LoadPhraseSuccess, LoadPhraseFail,
} from '../actions/phrase.action';

/**
 * Effects
 */
@Injectable()
export class PhraseEffects {

  constructor(
    private actions$: Actions,
    private phraseService: PhraseService
  ) {}

  /**
   * Load phrase
   */
  @Effect()
  loadPhrase$: Observable<Action> = this.actions$.pipe(
    ofType<LoadPhrase>(PhraseActionTypes.LoadPhrase),
    switchMap(action =>
      this.phraseService
        .getResource(action.payload)
        .pipe(
          map(data => new LoadPhraseSuccess({ phrase: data })),
          catchError(error => of(new LoadPhraseFail({ error })))
        )
    )
  );

  /**
   * Load phrases
   */
  @Effect()
  loadPhrases$: Observable<Action> = this.actions$.pipe(
    ofType<LoadPhrases>(PhraseActionTypes.LoadPhrases),
    switchMap(action =>
      this.phraseService
        .getResources()
        .pipe(
          map(data => new LoadPhrasesSuccess({ phrases: data })),
          catchError(error => of(new LoadPhrasesFail({ error })))
        )
    )
  );

  /**
   * Create
   */
  @Effect()
  createPhrase$: Observable<Action> = this.actions$.pipe(
    ofType<CreatePhrase>(PhraseActionTypes.CreatePhrase),
    concatMap(action =>
      this.phraseService
        .createResource(action.payload.phrase)
        .pipe(
          map(data => new CreatePhraseSuccess({ phrase: data })),
          catchError(error => of(new CreatePhraseFail({ error })))
        )
    )
  );

  /**
   * Update
   */
  @Effect()
  updatePhrase$: Observable<Action> = this.actions$.pipe(
    ofType<UpdatePhrase>(PhraseActionTypes.UpdatePhrase),
    concatMap(action =>
      this.phraseService
        .updateResource({ ...action.payload.phrase })
        .pipe(
          map(data => new UpdatePhraseSuccess({ phrase: { id: data.id, changes: data } })),
          catchError(error => of(new UpdatePhraseFail({ error })))
        )
    )
  );

  /**
   * Delete
   */
  @Effect()
  deletePhrase$: Observable<Action> = this.actions$.pipe(
    ofType<DeletePhrase>(PhraseActionTypes.DeletePhrase),
    concatMap(action =>
      this.phraseService
        .deleteResource(action.payload.id)
        .pipe(
          map(() => new DeletePhraseSuccess({ id: action.payload.id })),
          catchError(error => of(new DeletePhraseFail({ error })))
        )
    )
  );

}
