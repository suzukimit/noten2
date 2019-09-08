import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import {Notebook} from '../models/notebook';
import {NotebookActionTypes, NotebookActionUnion} from '../actions/notebook.action';
import {createFeatureSelector, createSelector} from '@ngrx/store';

/**
 * State
 */
export interface NotebookState extends EntityState<Notebook> {
  id: number;
  loading: boolean;
}

/**
 * Adapter
 */
export const adapter: EntityAdapter<Notebook> = createEntityAdapter<Notebook>();

/**
 * Initial state
 */
export const initialState: NotebookState = adapter.getInitialState({
  id: 0,
  loading: false,
});

/**
 * Reducer
 * @param state
 * @param action
 */
export function notebookReducer(state = initialState, action: NotebookActionUnion): NotebookState {
  switch (action.type) {
    case NotebookActionTypes.LoadNotebook: {
      return { ...state, id: action.payload, loading: true };
    }
    case NotebookActionTypes.LoadNotebookSuccess: {
      return adapter.addOne(action.payload.notebook, { ...state, loading: false } );
    }
    case NotebookActionTypes.LoadNotebookFail: {
      return { ...state, loading: false };
    }
    case NotebookActionTypes.LoadNotebooks: {
      return { ...state, loading: true };
    }
    case NotebookActionTypes.LoadNotebooksSuccess: {
      return adapter.addAll(action.payload.notebooks, { ...state, loading: false } );
    }
    case NotebookActionTypes.LoadNotebooksFail: {
      return { ...state, loading: false };
    }
    case NotebookActionTypes.CreateNotebook: {
      return { ...state, loading: true };
    }
    case NotebookActionTypes.CreateNotebookSuccess: {
      return adapter.addOne(action.payload.notebook, { ...state, loading: false });
    }
    case NotebookActionTypes.CreateNotebookFail: {
      return { ...state, loading: false };
    }
    case NotebookActionTypes.UpdateNotebook: {
      return { ...state, loading: true };
    }
    case NotebookActionTypes.UpdateNotebookSuccess: {
      return adapter.updateOne(action.payload.notebook, { ...state, loading: false });
    }
    case NotebookActionTypes.UpdateNotebookFail: {
      return { ...state, loading: false };
    }
    case NotebookActionTypes.DeleteNotebook: {
      return { ...state, loading: true };
    }
    case NotebookActionTypes.DeleteNotebookSuccess: {
      return adapter.removeOne(action.payload.id, { ...state, loading: false });
    }
    case NotebookActionTypes.DeleteNotebookFail: {
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

export const getNotebookState = createFeatureSelector<NotebookState>('notebook');
export const getNotebookEntityState = createSelector(getNotebookState, state => state);
export const getNotebooks = createSelector(getNotebookEntityState, selectAll);

export const getEntities = (state: NotebookState) => state.entities;
export const getSelectedId = (state: NotebookState) => state.id;
export const getNotebookId = createSelector(getNotebookEntityState, getSelectedId);
export const getNotebookEntities = createSelector(getNotebookEntityState, getEntities);
export const getNotebook = createSelector(getNotebookEntities, getNotebookId, (entities, id) => {
  return id && entities[id];
})
