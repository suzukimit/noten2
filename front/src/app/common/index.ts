import {PhraseState} from '../phrase/reducers/phrase.reducer';
import {NotebookState} from '../notebook/reducers/notebook.reducer';
import {RouterStateSnapshot} from '@angular/router';
import {FindPhraseState} from '../phrase/reducers/find-phrase.reducer';

// TODO これは必要？
// index.ts -> https://stackoverflow.com/questions/37564906/what-are-all-the-index-ts-used-for
export interface AppState {
  phrase: PhraseState;
  findPhrase: FindPhraseState;
  notebook: NotebookState;
}

// TODO via https://qiita.com/kouMatsumoto/items/c8297466c1824953632f#ngrxrouter-store
interface RouterReducerState {
  state: RouterStateSnapshot;
  navigationId: number; // RouterEvent.id
}

export interface State {
  // layout: fromLayout.State;
  router: RouterReducerState;
}
