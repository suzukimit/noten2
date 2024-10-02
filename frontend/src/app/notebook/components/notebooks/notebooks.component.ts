import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Component} from '@angular/core';
import {Notebook} from '../../models/notebook';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../common';
import {getNotebooks} from '../../reducers/notebook.reducer';
import {AbstractComponent} from '../../../common/abstract.component';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {CreateNotebook} from "app/notebook/actions/notebook.action";

@Component({
  selector: 'notebooks',
  templateUrl: './notebooks.component.html',
})
export class NotebooksComponent extends AbstractComponent {
  notebooks$: Observable<Notebook[]>;
  faPlus = faPlus;

  constructor(
    public activeModal: NgbActiveModal,
    private store: Store<AppState>,
  ) {
    super();
  }

  ngOnInit(): void {
    this.notebooks$ = this.store.pipe(select(getNotebooks));
  }

  createNotebook(): void {
    this.store.dispatch(new CreateNotebook({notebook: Notebook.createDefault()}));
  }
}
