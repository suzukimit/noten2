import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import {Phrase} from '../models/phrase';


export enum PhraseActionTypes {
  LoadPhrase          = '[Phrase] Load',
  LoadPhraseSuccess   = '[Phrase] Load Success',
  LoadPhraseFail      = '[Phrase] Load Fail',
  LoadPhrases         = '[Phrases] Load',
  LoadPhrasesSuccess  = '[Phrases] Load Success',
  LoadPhrasesFail     = '[Phrases] Load Fail',
  CreatePhrase        = '[Phrase] Create',
  CreatePhraseSuccess = '[Phrase] Create Success',
  CreatePhraseFail    = '[Phrase] Create Fail',
  UpdatePhrase        = '[Phrase] Update',
  UpdatePhraseSuccess = '[Phrase] Update Success',
  UpdatePhraseFail    = '[Phrase] Update Fail',
  DeletePhrase        = '[Phrase] Delete',
  DeletePhraseSuccess = '[Phrase] Delete Success',
  DeletePhraseFail    = '[Phrase] Delete Fail',
}

export class LoadPhrase implements Action {
  readonly type = PhraseActionTypes.LoadPhrase;
  constructor(public payload: number) {}
}

export class LoadPhraseSuccess implements Action {
  readonly type = PhraseActionTypes.LoadPhraseSuccess;
  constructor(public payload: { phrase: Phrase }) {}
}

export class LoadPhraseFail implements Action {
  readonly type = PhraseActionTypes.LoadPhraseFail;
  constructor(public payload?: { error: any }) {}
}

export class LoadPhrases implements Action {
  readonly type = PhraseActionTypes.LoadPhrases;
  constructor(public payload?: { offset: number, limit: number }) {
    this.payload = payload || { offset: 0, limit: 100 };
  }
}

export class LoadPhrasesSuccess implements Action {
  readonly type = PhraseActionTypes.LoadPhrasesSuccess;
  constructor(public payload: { phrases: Phrase[] }) {}
}

export class LoadPhrasesFail implements Action {
  readonly type = PhraseActionTypes.LoadPhrasesFail;
  constructor(public payload?: { error: any }) {}
}

export class CreatePhrase implements Action {
  readonly type = PhraseActionTypes.CreatePhrase;
  constructor(public payload: { phrase: Phrase } ) {}
}

export class CreatePhraseSuccess implements Action {
  readonly type = PhraseActionTypes.CreatePhraseSuccess;
  constructor(public payload: { phrase: Phrase }) {}
}

export class CreatePhraseFail implements Action {
  readonly type = PhraseActionTypes.CreatePhraseFail;
  constructor(public payload?: { error: any }) {}
}

export class UpdatePhrase implements Action {
  readonly type = PhraseActionTypes.UpdatePhrase;
  constructor(public payload: { phrase: Phrase }) {}
}

export class UpdatePhraseSuccess implements Action {
  readonly type = PhraseActionTypes.UpdatePhraseSuccess;
  constructor(public payload: { phrase: Update<Phrase> }) {}
}

export class UpdatePhraseFail implements Action {
  readonly type = PhraseActionTypes.UpdatePhraseFail;
  constructor(public payload?: { error: any }) {}
}

export class DeletePhrase implements Action {
  readonly type = PhraseActionTypes.DeletePhrase;
  constructor(public payload: { id: string }) {}
}

export class DeletePhraseSuccess implements Action {
  readonly type = PhraseActionTypes.DeletePhraseSuccess;
  constructor(public payload?: { id: string }) {}
}

export class DeletePhraseFail implements Action {
  readonly type = PhraseActionTypes.DeletePhraseFail;
  constructor(public payload?: { error: any }) {}
}

export type PhraseActionUnion =
  LoadPhrase
  | LoadPhraseSuccess
  | LoadPhraseFail
  | LoadPhrases
  | LoadPhrasesSuccess
  | LoadPhrasesFail
  | CreatePhrase
  | CreatePhraseSuccess
  | CreatePhraseFail
  | UpdatePhrase
  | UpdatePhraseSuccess
  | UpdatePhraseFail
  | DeletePhrase
  | DeletePhraseSuccess
  | DeletePhraseFail;
