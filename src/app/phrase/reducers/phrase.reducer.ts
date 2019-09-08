import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import {Phrase} from '../models/phrase';
import {PhraseActionTypes, PhraseActionUnion} from '../actions/phrase.action';
import {createFeatureSelector, createSelector} from '@ngrx/store';

/**
 * State
 */
export interface PhraseState extends EntityState<Phrase> {
  id: number;
  loading: boolean;
}

/**
 * Adapter
 */
export const adapter: EntityAdapter<Phrase> = createEntityAdapter<Phrase>();

/**
 * Initial state
 */
export const initialState: PhraseState = adapter.getInitialState({
  id: 0,
  loading: false,
});

/**
 * Reducer
 * @param state
 * @param action
 */
export function phraseReducer(state = initialState, action: PhraseActionUnion): PhraseState {
  switch (action.type) {
    case PhraseActionTypes.LoadPhrase: {
      return { ...state, id: action.payload, loading: true };
    }
    case PhraseActionTypes.LoadPhraseSuccess: {
      return adapter.addOne(action.payload.phrase, { ...state, loading: false } );
    }
    case PhraseActionTypes.LoadPhraseFail: {
      return { ...state, loading: false };
    }
    case PhraseActionTypes.LoadPhrases: {
      return { ...state, loading: true };
    }
    case PhraseActionTypes.LoadPhrasesSuccess: {
      return adapter.addAll(action.payload.phrases, { ...state, loading: false } );
    }
    case PhraseActionTypes.LoadPhrasesFail: {
      return { ...state, loading: false };
    }
    case PhraseActionTypes.CreatePhrase: {
      return { ...state, loading: true };
    }
    case PhraseActionTypes.CreatePhraseSuccess: {
      return adapter.addOne(action.payload.phrase, { ...state, loading: false });
    }
    case PhraseActionTypes.CreatePhraseFail: {
      return { ...state, loading: false };
    }
    case PhraseActionTypes.UpdatePhrase: {
      return { ...state, loading: true };
    }
    case PhraseActionTypes.UpdatePhraseSuccess: {
      return adapter.updateOne(action.payload.phrase, { ...state, loading: false });
    }
    case PhraseActionTypes.UpdatePhraseFail: {
      return { ...state, loading: false };
    }
    case PhraseActionTypes.DeletePhrase: {
      return { ...state, loading: true };
    }
    case PhraseActionTypes.DeletePhraseSuccess: {
      return adapter.removeOne(action.payload.id, { ...state, loading: false });
    }
    case PhraseActionTypes.DeletePhraseFail: {
      return { ...state, loading: false };
    }
    default: {
      return state;
    }
  }
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

//--------------------------------------------------------------------------------------------------------------------

export const getPhraseState = createFeatureSelector<PhraseState>('phrase');
export const getPhraseEntityState = createSelector(getPhraseState, state => state);
export const getPhrases = createSelector(getPhraseEntityState, selectAll);

export const getEntities = (state: PhraseState) => state.entities;
export const getSelectedId = (state: PhraseState) => state.id;
export const getPhraseId = createSelector(getPhraseEntityState, getSelectedId);
export const getPhraseEntities = createSelector(getPhraseEntityState, getEntities);
export const getPhrase = createSelector(getPhraseEntities, getPhraseId, (entities, id) => {
  return id && entities[id];
})
