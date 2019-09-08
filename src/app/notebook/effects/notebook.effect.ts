import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, concatMap, switchMap, catchError } from 'rxjs/operators';
import {NotebookService} from '../services/notebook.service';

import {
  NotebookActionTypes,
  LoadNotebooks,
  LoadNotebooksSuccess,
  LoadNotebooksFail,
  CreateNotebook,
  CreateNotebookSuccess,
  CreateNotebookFail,
  UpdateNotebook,
  UpdateNotebookSuccess,
  UpdateNotebookFail,
  DeleteNotebook,
  DeleteNotebookSuccess,
  DeleteNotebookFail, LoadNotebook, LoadNotebookSuccess, LoadNotebookFail,
} from '../actions/notebook.action';

/**
 * Effects
 */
@Injectable()
export class NotebookEffects {

  constructor(
    private actions$: Actions,
    private notebookService: NotebookService
  ) {}

  /**
   * Load notebook
   */
  @Effect()
  loadNotebook$: Observable<Action> = this.actions$.pipe(
    ofType<LoadNotebook>(NotebookActionTypes.LoadNotebook),
    switchMap(action =>
      this.notebookService
        .getResource(action.payload)
        .pipe(
          map(data => new LoadNotebookSuccess({ notebook: data })),
          catchError(error => of(new LoadNotebookFail({ error })))
        )
    )
  );

  /**
   * Load notebooks
   */
  @Effect()
  loadNotebooks$: Observable<Action> = this.actions$.pipe(
    ofType<LoadNotebooks>(NotebookActionTypes.LoadNotebooks),
    switchMap(action =>
      this.notebookService
        .getResources()
        .pipe(
          map(data => new LoadNotebooksSuccess({ notebooks: data })),
          catchError(error => of(new LoadNotebooksFail({ error })))
        )
    )
  );

  /**
   * Create
   */
  @Effect()
  createNotebook$: Observable<Action> = this.actions$.pipe(
    ofType<CreateNotebook>(NotebookActionTypes.CreateNotebook),
    concatMap(action =>
      this.notebookService
        .createResource(action.payload.notebook)
        .pipe(
          map(data => new CreateNotebookSuccess({ notebook: data })),
          catchError(error => of(new CreateNotebookFail({ error })))
        )
    )
  );

  /**
   * Update
   */
  @Effect()
  updateNotebook$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateNotebook>(NotebookActionTypes.UpdateNotebook),
    concatMap(action =>
      this.notebookService
        .updateResource({ ...action.payload.notebook })
        .pipe(
          map(data => new UpdateNotebookSuccess({ notebook: { id: data.id, changes: data } })),
          catchError(error => of(new UpdateNotebookFail({ error })))
        )
    )
  );

  /**
   * Delete
   */
  @Effect()
  deleteNotebook$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteNotebook>(NotebookActionTypes.DeleteNotebook),
    concatMap(action =>
      this.notebookService
        .deleteResource(action.payload.id)
        .pipe(
          map(() => new DeleteNotebookSuccess({ id: action.payload.id })),
          catchError(error => of(new DeleteNotebookFail({ error })))
        )
    )
  );

}
