import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import {Notebook} from '../models/notebook';


export enum NotebookActionTypes {
  LoadNotebook          = '[Notebook] Load',
  LoadNotebookSuccess   = '[Notebook] Load Success',
  LoadNotebookFail      = '[Notebook] Load Fail',
  LoadNotebooks         = '[Notebooks] Load',
  LoadNotebooksSuccess  = '[Notebooks] Load Success',
  LoadNotebooksFail     = '[Notebooks] Load Fail',
  CreateNotebook        = '[Notebook] Create',
  CreateNotebookSuccess = '[Notebook] Create Success',
  CreateNotebookFail    = '[Notebook] Create Fail',
  UpdateNotebook        = '[Notebook] Update',
  UpdateNotebookSuccess = '[Notebook] Update Success',
  UpdateNotebookFail    = '[Notebook] Update Fail',
  DeleteNotebook        = '[Notebook] Delete',
  DeleteNotebookSuccess = '[Notebook] Delete Success',
  DeleteNotebookFail    = '[Notebook] Delete Fail',
}

export class LoadNotebook implements Action {
  readonly type = NotebookActionTypes.LoadNotebook;
  constructor(public payload: number) {}
}

export class LoadNotebookSuccess implements Action {
  readonly type = NotebookActionTypes.LoadNotebookSuccess;
  constructor(public payload: { notebook: Notebook }) {}
}

export class LoadNotebookFail implements Action {
  readonly type = NotebookActionTypes.LoadNotebookFail;
  constructor(public payload?: { error: any }) {}
}

export class LoadNotebooks implements Action {
  readonly type = NotebookActionTypes.LoadNotebooks;
  constructor(public payload?: { offset: number, limit: number }) {
    this.payload = payload || { offset: 0, limit: 100 };
  }
}

export class LoadNotebooksSuccess implements Action {
  readonly type = NotebookActionTypes.LoadNotebooksSuccess;
  constructor(public payload: { notebooks: Notebook[] }) {}
}

export class LoadNotebooksFail implements Action {
  readonly type = NotebookActionTypes.LoadNotebooksFail;
  constructor(public payload?: { error: any }) {}
}

export class CreateNotebook implements Action {
  readonly type = NotebookActionTypes.CreateNotebook;
  constructor(public payload: { notebook: Notebook } ) {}
}

export class CreateNotebookSuccess implements Action {
  readonly type = NotebookActionTypes.CreateNotebookSuccess;
  constructor(public payload: { notebook: Notebook }) {}
}

export class CreateNotebookFail implements Action {
  readonly type = NotebookActionTypes.CreateNotebookFail;
  constructor(public payload?: { error: any }) {}
}

export class UpdateNotebook implements Action {
  readonly type = NotebookActionTypes.UpdateNotebook;
  constructor(public payload: { notebook: Notebook }) {}
}

export class UpdateNotebookSuccess implements Action {
  readonly type = NotebookActionTypes.UpdateNotebookSuccess;
  constructor(public payload: { notebook: Update<Notebook> }) {}
}

export class UpdateNotebookFail implements Action {
  readonly type = NotebookActionTypes.UpdateNotebookFail;
  constructor(public payload?: { error: any }) {}
}

export class DeleteNotebook implements Action {
  readonly type = NotebookActionTypes.DeleteNotebook;
  constructor(public payload: { id: string }) {}
}

export class DeleteNotebookSuccess implements Action {
  readonly type = NotebookActionTypes.DeleteNotebookSuccess;
  constructor(public payload?: { id: string }) {}
}

export class DeleteNotebookFail implements Action {
  readonly type = NotebookActionTypes.DeleteNotebookFail;
  constructor(public payload?: { error: any }) {}
}

export type NotebookActionUnion =
  LoadNotebook
  | LoadNotebookSuccess
  | LoadNotebookFail
  | LoadNotebooks
  | LoadNotebooksSuccess
  | LoadNotebooksFail
  | CreateNotebook
  | CreateNotebookSuccess
  | CreateNotebookFail
  | UpdateNotebook
  | UpdateNotebookSuccess
  | UpdateNotebookFail
  | DeleteNotebook
  | DeleteNotebookSuccess
  | DeleteNotebookFail;
