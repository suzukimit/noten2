import {createAction, props} from '@ngrx/store';
import {Phrase} from '../models/phrase';

export const findPhrases = createAction(
  '[Find Phrase] Find Phrases',
  props<{ query: string }>()
);

export const findSuccess = createAction(
  '[Books/API] Find Success',
  props<{ phrases: Phrase[] }>()
);

export const findFailure = createAction(
  '[Books/API] Find Failure',
  props<{ errorMsg: string }>()
);
