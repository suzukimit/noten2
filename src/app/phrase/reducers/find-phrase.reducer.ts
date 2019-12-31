import {createFeatureSelector, createReducer, createSelector, on} from '@ngrx/store';
import {findFailure, findPhrases, findSuccess} from '../actions/find-phrase.actions';
import {AppState} from '../../common';
import {getPhraseEntities} from './phrase.reducer';
import {Phrase} from '../models/phrase';

export interface FindPhraseState {
  ids: number[];
  loading: boolean;
  error: string;
  query: string;
}

const initialState: FindPhraseState = {
  ids: [],
  loading: false,
  error: '',
  query: '',
};

export const reducer = createReducer(
  initialState,
  on(findPhrases, (state, { query }) => {
    return query === ''
      ? {
        ids: [],
        loading: false,
        error: '',
        query,
      }
      : {
        ...state,
        loading: true,
        error: '',
        query,
      };
  }),
  on(findSuccess, (state, { phrases }) => ({
    ids: phrases.map(phrase => phrase.id),
    loading: false,
    error: '',
    query: state.query,
  })),
  on(findFailure, (state, { errorMsg }) => ({
    ...state,
    loading: false,
    error: errorMsg,
  }))
);

//--------------------------------------------------------------------------------------------------------------------

export const getIds = (state: FindPhraseState) => state.ids;
export const getQuery = (state: FindPhraseState) => state.query;
export const getLoading = (state: FindPhraseState) => state.loading;
export const getError = (state: FindPhraseState) => state.error;

export const getFindPhraseState = createFeatureSelector<AppState, FindPhraseState>('findPhrase');
export const getFindPhraseIds = createSelector(
  getFindPhraseState,
  (state: FindPhraseState) => state.ids
);
export const getFindPhraseQuery = createSelector(
  getFindPhraseState,
  (state: FindPhraseState) => state.query
);
export const getFindPhraseLoading = createSelector(
  getFindPhraseState,
  (state: FindPhraseState) => state.loading
);
export const getFindPhraseError = createSelector(
  getFindPhraseState,
  (state: FindPhraseState) => state.error
);

export const getFindResults = createSelector(
  getPhraseEntities,
  getFindPhraseIds,
  (phrases, ids) => {
    return ids
      .map(id => phrases[id])
      .filter((phrase): phrase is Phrase => phrase != null);
  }
);
