import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Component, Input} from '@angular/core';
import {Notebook} from '../../models/notebook';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../common';
import {CreateNotebook, LoadNotebooks} from '../../actions/notebook.action';
import {getNotebooks} from '../../reducers/notebook.reducer';
import {AbstractComponent} from '../../../common/abstract.component';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {CreatePhrase} from '../../../phrase/actions/phrase.action';
import {Phrase} from '../../../phrase/models/phrase';

@Component({
  selector: 'notebooks',
  templateUrl: './notebooks.component.html',
})
export class NotebooksComponent extends AbstractComponent {
  notebook$: Observable<Notebook[]>;
  faPlus = faPlus;

  constructor(
    public activeModal: NgbActiveModal,
    private store: Store<AppState>,
  ) {
    super();
  }

  ngOnInit(): void {
    this.notebook$ = this.store.pipe(select(getNotebooks));
  }

  createNotebook(): void {
    //this.store.dispatch(new CreateNotebook({phrase: Notebook.createDefault()}));
  }
}
